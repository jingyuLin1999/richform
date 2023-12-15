import { type, path, isEmpty, clone } from "ramda"
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
                case "undefined": value = undefined; break;
            }
            return value;
        },
        tofriendValue(value) {
            let type = Array.isArray(value) ? "array"
                : value == null ? "null" : typeof value;
            return this.friendDefaultValue(type);
        },
        // 深度模式设置值
        deepSetValue(keys = [], obj = {}, value, notExistAddObj = false) {
            let pickObj = null;
            if (keys.length == 0 || !keys[0]) return;
            keys.map((key, index) => {
                if (notExistAddObj && !obj[key]) this.$set(obj, key, {})
                pickObj = obj[key];
                if (pickObj && keys.length != index + 1) obj = pickObj;
                if (obj && keys.length == index + 1) this.$set(obj, key, value);
            });
        },
        // 深度获取
        deepPick(keys = [], obj) {
            let pickObj = null;
            if (keys.length == 0 || !keys[0]) return obj;
            keys.map((key, index) => {
                pickObj = obj[key];
                if (pickObj && keys.length != index + 1)
                    obj = pickObj;
            })
            return pickObj;
        },
        deepDelete(keys = [], obj, deleteChildren = true) {
            if (keys.length == 0 || !keys[0] || typeof obj != 'object') return;
            let tempObj = obj
            for (let index = 0; index < keys.length; index++) {
                let key = keys[index]
                let sObj = tempObj[key];
                if (!sObj) break;
                if (keys.length == index + 1) {
                    if (deleteChildren) {
                        for (let k in sObj) this.$delete(sObj, k)
                    }
                    else this.$delete(tempObj, key)
                    return;
                }
                tempObj = sObj
            }
        },
        // 对依赖本字段的字典进行派发
        async dispatchOptions(fieldName) {
            let dicts = this.dependencies[fieldName];
            if (!Array.isArray(dicts) || !dicts.length) return;
            for (let index = 0; index < dicts.length; index++) {
                let dictItem = dicts[index];
                let fieldValue = this.deepPick(fieldName.split("."), this.values);
                if (dictItem.keyValue == fieldValue || dictItem.keyValue == "any") {
                    let oldOptions = JSON.stringify(dictItem.field.options);
                    if (
                        typeof dictItem.dictValue == "string" &&
                        isUrl(dictItem.dictValue)
                    ) {
                        let options = [];
                        try {
                            // 若是url则发起http请求获取字典
                            if (fieldValue != null && fieldValue != "") {
                                const { method, respProp, params, pickValues } = dictItem.field.dictConfig;
                                let pickValueMap = {};
                                pickValues.map(key => {
                                    let value = this.deepPick(key.split("."), this.values);
                                    if (value != undefined) { pickValueMap[key] = value }
                                });
                                const rqParams = Object.assign({ ...params }, pickValueMap, { [fieldName]: fieldValue });
                                const response = await loadDict(dictItem.dictValue, rqParams, method);
                                const payload = this.deepPick(respProp.split("."), response);
                                if (Array.isArray(payload)) options = payload;
                            } else {
                                options = clone(dictItem.options)
                            }
                        } catch (e) {
                            console.error(e);
                        }
                        this.$set(dictItem.field, "options", options);
                    } else if (Array.isArray(dictItem.dictValue)) {
                        // 若是数组，则直接赋值给options
                        this.$set(dictItem.field, "options", dictItem.dictValue);
                    } else if (Object.prototype.toString.call(dictItem.dictValue) === '[object Object]') {
                        // 若是对象，则根据对象过滤出符合条件的options
                        let { filterKey, beRelyFilterKey } = dictItem.dictValue;
                        if (!filterKey || !dictItem.options.length) return;
                        // 有一种特殊应用，当被依赖的字段值变化了，根据被依赖选项({label,value,other})的某个字段的值到当前options过滤
                        // 此时必须配beRelyFilterKey,如: "selectG==any":{ filterKey: "filterG", beRelyFilterKey: 'other' },
                        let filterOptions = [];
                        if (dictItem.beRelyKey && beRelyFilterKey && this.flatFields) {
                            let beRelyField = this.flatFields[dictItem.beRelyKey];
                            if (beRelyField && fieldValue) {
                                let propValueKey = beRelyField.defaultProp.value;
                                let beRelyOption = beRelyField.options.find(optionItem => (optionItem[propValueKey] == fieldValue));
                                if (beRelyOption) filterOptions = dictItem.options.filter(item => (item[filterKey] == beRelyOption[beRelyFilterKey]));
                            }
                        } else filterOptions = dictItem.options.filter(item => (item[filterKey] == fieldValue)); // 未配置beRelyFilterKey，则根据filterKey过滤
                        this.$set(dictItem.field, "options", fieldValue ? filterOptions : dictItem.options);
                    }
                    // 只有选项改变了且新的选项中没有对应值，那么对应值才应清零
                    let newOptions = JSON.stringify(dictItem.field.options);
                    let matchOne = false;
                    const { defaultProp, name } = dictItem.field;
                    if (defaultProp) {
                        let fieldValue = this.deepPick(name.split("."), this.values);
                        let valueList = Array.isArray(fieldValue) ? JSON.parse(JSON.stringify(fieldValue)) : [fieldValue]
                        // 值可能是数组(select可多选)，这种情况需要每个到options中匹配，匹配成功保留，否则删除
                        // 只要有一个匹配成功，就不会清空
                        let pickMatchValue = [];
                        valueList.map((valItem) => {
                            // valItem 可能是 {}，或者 string
                            let matchValue = type(valItem) == "Object" ? valItem[defaultProp.value] : valItem;
                            let hasMatch = matchValue ? dictItem.field.options.find(option => {
                                let optionValue = type(option) == "Object" ? option[defaultProp.value] : option;
                                if (optionValue == matchValue) return true;
                            }) : false;
                            if (hasMatch && !matchOne) matchOne = true; // 只要有一个匹配
                            if (hasMatch) pickMatchValue.push(valItem)
                        })
                        if (pickMatchValue.length > 0 && Array.isArray(this.values[name])) {
                            // 在index.html中watch values，加这个判断避免无限循环
                            if (JSON.stringify(fieldValue) != JSON.stringify(pickMatchValue)) {
                                this.deepSetValue(name.split("."), this.values, pickMatchValue);
                            }
                        }
                    }
                    // 重置值
                    if (oldOptions != newOptions && !matchOne) {
                        let field = dictItem.field;
                        let friendType = field.forceType || dictItem.type || (type(this.values[field.name]).toLowerCase());
                        let friendValue = this.friendDefaultValue(friendType);
                        if (field.widget == "select") {
                            let { defaultOption, options, defaultProp } = field;
                            if (options.length > 0 && defaultOption >= 0) {
                                let option = options[defaultOption];
                                friendValue = typeof option == "object" ? option[defaultProp.value] : option
                            }
                        }
                        this.deepSetValue(dictItem.field.name.split("."), this.values, friendValue);
                    }
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
            let beRelyValue = this.deepPick(key.split("."), this.values);
            if (hideFields && (beRelyValue || beRelyValue == 0)) { // 值有可能是0
                let hideHistory = [];
                for (let index = 0; index < hideFields.length; index++) {
                    let item = hideFields[index];
                    let { name, key, field, value } = item;
                    let nameKey = name + "@" + key;
                    let isEquality = (value == beRelyValue);
                    if (!hideHistory.includes(nameKey) && isEquality) {
                        hideHistory.push(nameKey)
                        this.$set(field, "hide", isEquality);
                        // 在index.html中watch values，加这个判断避免无限循环
                        let hideValue = this.deepPick(name.split("."), this.values)
                        if (!isEmpty(hideValue)) {
                            // 日期范围带有mapValues的需要清空
                            if (field.widget == "datetimepicker" && Array.isArray(this.values[name])) {
                                field.mapValues.map(key => {
                                    // this.deepSetValue(key.split("."), this.values, this.tofriendValue(beRelyValue));
                                })
                            }
                            // 清空被隐藏字段的值
                            let friendType = field.forceType || (type(this.values[name]).toLowerCase());
                            this.deepSetValue(name.split("."), this.values, this.friendDefaultValue(friendType));
                        }
                        // 隐藏状态删除表达式的验证规则(schema)  
                        this.dispatchRegExp(item.name);
                    } else if (hideHistory.includes(nameKey)) {
                        // 这种情况，表示重复的name和key已有一个验证通过
                    } else {
                        // 显示字段
                        this.$set(item.field, "hide", isEquality);
                        // 字段显示了需要添加schema 2023-12-14
                        for (let key in this.regExpFields) this.dispatchRegExp(key)
                    }
                }
            }
        },
        // 派发表达式，并修改schema
        dispatchRegExp(fieldName) {
            const regExps = this.regExpFields[fieldName];
            // 父级fieldName隐藏了，依赖你的表达式也不应该存在
            let fieldItem = this.flatFields[fieldName];
            if (fieldItem && fieldItem.hide && this.schema && this.schema.properties) {
                let fieldSchemaKeys = fieldName.split(".").join(".properties.").split(".");
                let fieldSchema = path(fieldSchemaKeys, this.schema.properties);
                this.deepDelete(fieldSchemaKeys, fieldSchema);
            }
            // 遍历子级依赖
            if (!Array.isArray(regExps)) return
            regExps.map((item) => {
                let { childrenName, exp, field } = item;
                let schemaKeys = childrenName.split(".").join(".properties.").split(".");
                let fieldSchema = path(schemaKeys, this.schema.properties);
                let fieldValue = this.deepPick(fieldName.split("."), this.values)
                if ((fieldSchema && field.hide) || (fieldItem && fieldItem.hide)) {  // 隐藏 2023-12-14
                    // 条件设置为：字段A，小于字段B和小于字段C，B隐藏了，但是C不隐藏。还有C，这种情况就不能删除了
                    let fieldCanBeDeleted = true;
                    for (let key in this.regExpFields) {
                        let regExpsArr = this.regExpFields[key]
                        let fieldItem = this.flatFields[key]
                        regExpsArr.map(item => {
                            if (fieldCanBeDeleted &&
                                item.childrenName == childrenName &&
                                fieldItem && !fieldItem.hide) {
                                fieldCanBeDeleted = false;
                            }
                        })
                    }
                    // 删除schema
                    if (fieldCanBeDeleted) {
                        let schema = this.schema.properties;
                        this.deepDelete(schemaKeys, schema);
                        if (this.fieldErrors[childrenName]) this.$delete(this.fieldErrors, childrenName) // 没有schema了，对应显示的错误信息也得去掉
                    }
                }
                else if (fieldSchema && !field.hide) {
                    // 条件设置为：字段A，小于字段B和小于字段C，那么要设置的值是【字段B】和【字段C】的最小值。大于同理
                    let regExpValue = [];
                    for (let key in this.regExpFields) {
                        let regExpsArr = this.regExpFields[key]
                        let fieldItem = this.flatFields[key]
                        regExpsArr.map(item => {
                            if (item.childrenName == childrenName && fieldItem && !fieldItem.hide) {
                                let fieldValue = this.deepPick(key.split("."), this.values)
                                regExpValue.push(fieldValue)
                            }
                        })
                    }
                    let value = fieldValue;
                    // 根据exp，判断是大于或小于
                    // 上限,即取最小值
                    if (["maximum", "exclusiveMaximum"].includes(exp)) {
                        value = Math.min(...regExpValue)
                    }
                    // 下限,即取最大值
                    else if (["minimum", "exclusiveMinimum"].includes(exp)) {
                        value = Math.max(...regExpValue)
                    }
                    fieldSchema[exp] = value; // 找到更新
                }
                else if (!fieldSchema && !field.hide) { // 有可能找不到
                    this.deepSetValue(schemaKeys, this.schema.properties, {
                        [exp]: fieldValue,
                    });
                }
            });
        },
    }
}