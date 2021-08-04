import { isUrl, loadDict } from "./";
export default {
    methods: {
        friendValue(type) {
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
                if (dictItem.keyValue == this.values[fieldName]) {
                    if (
                        typeof dictItem.dictValue == "string" &&
                        isUrl(dictItem.dictValue)
                    ) {
                        let options = [];
                        try {
                            // 若是url则发起http请求获取字典
                            options = await loadDict(dictItem.dictValue);
                        } catch (e) {
                            console.error(e);
                        }
                        this.$set(dictItem.field, "options", options);
                    } else if (Array.isArray(dictItem.dictValue)) {
                        // 若是数组，则直接赋值给options
                        this.$set(dictItem.field, "options", dictItem.dictValue);
                    } else {
                    }
                }
            }
        },
        // 根据values的字段进行派发动作
        onDispatch() {
            for (let key in this.values) {
                this.dispatchHide(key);
                this.dispatchOptions(key);
            }
        },
        // 检查隐藏依赖
        dispatchHide(key) {
            let hideFields = this.hideFields[key];
            if (hideFields) {
                for (let index = 0; index < hideFields.length; index++) {
                    let item = hideFields[index];
                    this.$set(item.field, "hide", item.value == this.values[key]);
                }
            }
        },
    }
}