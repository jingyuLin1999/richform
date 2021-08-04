import { isUrl, loadDict } from "../utils";
import CommonMixin from "../utils/commonMixin"
export default {
    props: {
        field: { type: Object, default: () => ({}) },
        schema: { type: Object, default: () => ({}) },
        values: { type: Object, default: () => ({}) },
        fieldErrors: { type: Object, default: () => ({}) },
        hideFields: { type: Object, default: () => ({}) },
    },
    data() {
        return {
            updateValue: 0,
        }
    },
    inject: ["dependencies"],
    mixins: [CommonMixin],
    mounted() {
        this.load();
    },
    computed: {
        value: {
            get() {
                this.updateValue++; // 强制更新
                let friendValue = { value: this.friendValue() }; // 必须改变地址，否则会出现无限循环
                return friendValue.value;
            },
            set(value) {
                this.changeValue(value)
            }
        },
        dict() {
            this.field
        }
    },
    methods: {
        load() {
            this.$setFieldAttr();
            this.pickHideFields();
            this.pickDependencies();
            this.onDispatch()
        },
        $setFieldAttr() {
            const defaultFieldAttr = this.defaultFieldAttr();
            let fieldAttr = Object.assign(defaultFieldAttr, this.field)
            for (const [key, value] of Object.entries(fieldAttr))
                this.$set(this.field, key, value)
        },
        changeValue(value) {
            this.updateValue++;
            this.$emit('change', this.field.name, value, this.schema)
        },
        friendValue() {
            // 做一些友好值处理
            let friendValue = null;
            let value = this.values[this.field.name];
            try {
                switch (this.schema.type) {
                    case "array": friendValue = Array.isArray(value) ? value : JSON.parse(value); break;
                    case "number": friendValue = typeof value == "number" ? value : parseInt(value); break;
                }
            } catch (e) {
                console.error(`转换友好值错了：${e}`)
            }
            return friendValue || value;
        },
        // 字段依赖隐藏
        pickHideFields() {
            if (!this.field.hideRely) return; // 若不存在依赖，则无需收集
            let hideItem = this.field.hideRely.split("==");
            if (hideItem.length != 2) return;
            if (!this.hideFields[hideItem[0].trim()])
                this.hideFields[hideItem[0].trim()] = [];
            // 已存在则不需要重新收集
            for (let key in this.hideFields) {
                let hasExit = this.hideFields[key].find((item) => {
                    if (item.key == this.field.name) {
                        // 必须重新赋值，因为form的地址已经变了
                        this.$set(item, 'field', this.field)
                        return true;
                    }
                });
                if (hasExit) return;
            }
            let convertKey = ["true", "false"];
            let value = hideItem[1].trim();

            this.hideFields[hideItem[0].trim()].push({
                key: this.field.name,
                value: convertKey.includes(value) ? JSON.parse(value) : value,
                field: this.field,
            });
        },
        // 收集依赖关系
        async pickDependencies() {
            // 赋值初始值
            if (!this.dependencies[this.field.name])
                this.dependencies[this.field.name] = [];
            if (!this.field.hasOwnProperty("dict") || this.field.length == 0) return;
            if (typeof this.field.dict == "string" && isUrl(this.field.dict)) {
                // dict字段是url则直接获取数据，并赋值给options
                // TODO 未调试
                let options = await loadDict(this.field.dict);
                this.$set(this.field, "options", options);
            } else if (Object.keys(this.field.dict).length > 0) {
                for (let key in this.field.dict) {
                    let dictItem = this.field.dict[key];
                    let dictKeyVal = key.split("==");
                    if (this.dependencies[dictKeyVal[0].trim()]) {
                        for (let key in this.dependencies) {
                            let hasExit = this.dependencies[key].find((item) => {
                                if (item.keyValue == this.field.name) {
                                    // 必须重新赋值，因为form的地址已经变了
                                    this.$set(item, 'field', this.field)
                                    return true;
                                }
                            });
                            if (hasExit) return;
                        }
                        this.dependencies[dictKeyVal[0].trim()].push({
                            keyValue: dictKeyVal[1].trim(), //   [<字段名name> == 'A'] 的值 即：A
                            dictValue: dictItem,
                            field: this.field,
                        });
                    }
                }
            }
        }
    }
}