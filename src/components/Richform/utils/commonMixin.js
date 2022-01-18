import { type } from "ramda"
import { isUrl, loadDict } from "./";
export default {
    methods: {
        friendDefaultValue(type) {
            let value = null;
            switch (type) {
                case "null":
                    value = null;
                    break;
                case "string":
                    value = "";
                    break;
                case "array":
                    value = [];
                    break;
                case "object":
                    value = {};
                    break;
                case "boolean":
                    value = false;
                    break;
                case "number":
                    value = 0;
                    break;
            }
            return value;
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
                        if (pickMatchValue.length > 0 && Array.isArray(this.values[name]))
                            this.values[name] = pickMatchValue;
                    }
                    if (oldOptions != newOptions && !matchOne) this.values[dictItem.field.name] = null;
                }
            }
        },
        // 根据values的字段进行派发动作
        onDispatch(fieldName) {
            this.dispatchHide(fieldName);
            this.dispatchOptions(fieldName);
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
                    } else if (hideHistory.includes(nameKey)) {
                        // 这种情况，表示重复的name和key已有一个验证通过
                    } else this.$set(item.field, "hide", isEquality);
                }
            }
        }
    }
}