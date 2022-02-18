import { type, path } from "ramda"
import { isUrl, loadDict, deleteIteration } from "./";
export default {
    methods: {
        friendDefaultValue(type) {
            let value = null;
            switch (type) {
                case "null": value = null; break;
                case "string": value = ""; break;
                case "array": value = []; break;
                case "object": value = {}; break;
                case "boolean": value = false; break;
                case "number": value = 0; break;
            }
            return value;
        },
        tofriendValue(value) {
            let type = Array.isArray(value) ? "array"
                : value == null ? "null" : typeof value;
            return this.friendDefaultValue(type);
        },
        // 对依赖本字段的字典进行派发
        async dispatchOptions(fieldName) {
            let dicts = this.dependencies[fieldName];
            if (!Array.isArray(dicts) || !dicts.length) return;
            for (let index = 0; index < dicts.length; index++) {
                let dictItem = dicts[index];
                if (dictItem.keyValue == this.values[fieldName] || dictItem.keyValue == "any") {
                    let oldOptions = JSON.stringify(dictItem.field.options);
                    if (
                        typeof dictItem.dictValue == "string" &&
                        isUrl(dictItem.dictValue)
                    ) {
                        let options = [];
                        try {
                            // 若是url则发起http请求获取字典
                            const { payload } = await loadDict(dictItem.dictValue, { [fieldName]: this.values[fieldName] });
                            if (Array.isArray(payload)) options = payload;
                        } catch (e) {
                            console.error(e);
                        }
                        this.$set(dictItem.field, "options", options);
                    } else if (Array.isArray(dictItem.dictValue)) {
                        // 若是数组，则直接赋值给options
                        this.$set(dictItem.field, "options", dictItem.dictValue);
                    } else if (Object.prototype.toString.call(dictItem.dictValue) === '[object Object]') {
                        // 若是对象，则根据对象过滤出符合条件的options
                        let filterKey = dictItem.dictValue.filterKey;
                        if (!filterKey || !dictItem.options.length) return;
                        let filterOptions = dictItem.options.filter(item => (item[filterKey] == this.values[fieldName]));
                        this.$set(dictItem.field, "options", filterOptions);
                    }
                    // 只有选项改变了且新的选项中没有对应值，那么对应值才应清零
                    let newOptions = JSON.stringify(dictItem.field.options);
                    let matchOne = false;
                    const { defaultProp, name } = dictItem.field;
                    if (defaultProp) {
                        let valueList = Array.isArray(this.values[name]) ? JSON.parse(JSON.stringify(this.values[name])) : [this.values[name]]
                        // 值可能是数组，这种情况需要每个到options中匹配，匹配成功保留，否则删除
                        // 只要有一个匹配成功，就不会清空
                        let pickMatchValue = [];
                        valueList.map((valItem) => {
                            let matchValue = type(valItem) == "Object" ? valItem[defaultProp.value] : valItem;
                            let hasMatch = matchValue ? dictItem.field.options.find(option => option[defaultProp.value] == matchValue) : false;
                            if (hasMatch && !matchOne) matchOne = true; // 只要有一个匹配
                            if (hasMatch) pickMatchValue.push(valItem)
                        })
                        if (pickMatchValue.length > 0 && Array.isArray(this.values[name])) {
                            // 在index.html中watch values，加这个判断避免无限循环
                            if (JSON.stringify(this.values[name]) != JSON.stringify(pickMatchValue))
                                this.values[name] = pickMatchValue;
                        }
                    }
                    if (oldOptions != newOptions && !matchOne) this.values[dictItem.field.name] = null;
                }
            }
        },
        // 根据values的字段进行派发动作
        onDispatch(fieldName) {
            this.dispatchHide(fieldName);
            this.dispatchOptions(fieldName);
            this.dispatchRegExp(fieldName);
        },
        // 检查隐藏依赖
        dispatchHide(key) {
            let hideFields = this.hideFields[key];
            if (hideFields && (this.values[key] || this.values[key] == 0)) { // 值有可能是0
                let hideHistory = [];
                for (let index = 0; index < hideFields.length; index++) {
                    let item = hideFields[index];
                    let nameKey = item.name + "@" + item.key;
                    let isEquality = item.value == this.values[key];
                    if (!hideHistory.includes(nameKey) && isEquality) {
                        hideHistory.push(nameKey)
                        this.$set(item.field, "hide", isEquality);
                        this.values[item.name] = this.tofriendValue(this.values[item.name]); // TODO 被隐藏的字段是否应该把值清空
                        // 隐藏状态删除表达式的验证规则
                        this.updateSchemaInHide(item);
                    } else if (hideHistory.includes(nameKey)) {
                        // 这种情况，表示重复的name和key已有一个验证通过
                    } else {
                        this.$set(item.field, "hide", isEquality);
                    }
                }
            }
        },
        // 更新schema当字段隐藏时
        updateSchemaInHide(fieldItem) {
            if (this.schema && this.schema.properties) {
                const fieldSchema = path(this.schema.properties, fieldItem.name.split("."));
                if (fieldItem.field.regExp && fieldSchema) // 删除
                    deleteIteration(this.schema.properties, fieldItem.name.split("."));
                // 你都不存在了，依赖你的表达式也不应该存在
                const regExps = this.regExpFields[fieldItem.name];
                if (!regExps) return;
                regExps.map(item => {
                    const { dispatchName } = item;
                    const fieldSchema = path(this.schema.properties, dispatchName.split("."));
                    if (fieldSchema) deleteIteration(this.schema.properties, dispatchName.split(".")); // 删除
                })
            }
        },
        // 派发表达式，并修改schema
        dispatchRegExp(fieldName) {
            const regExps = this.regExpFields[fieldName];
            if (!regExps) return;
            regExps.map((item) => {
                const { dispatchName, exp, field } = item;
                const fieldSchema = path(
                    dispatchName.split("."),
                    this.schema.properties
                );
                if (fieldSchema) fieldSchema[exp] = this.values[fieldName]; // 找到更新
                else if (!fieldSchema && !field.hide) { // 有可能找不到
                    this.$set(this.schema.properties, dispatchName, {
                        [exp]: this.values[fieldName],
                    });
                }
            });
        },
    }
}