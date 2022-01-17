import { type } from "ramda";
import { isUrl, loadDict, strToObj } from "../utils";
import CommonMixin from "../utils/commonMixin";

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
            widgetId: Math.random().toString(15).slice(2, 15)
        }
    },
    inject: ["dependencies", "isFriendValue", "globalVars", "regExpFields"],
    mixins: [CommonMixin],
    created() {
        this.load();
    },
    mounted() {
        this.getWidgetHeight();
    },
    computed: {
        value: {
            get() {
                if (this.isFriendValue) {
                    this.updateValue++; // 强制更新
                    let friendValue = { value: this.friendValue() }; // 必须改变地址，否则会出现无限循环
                    return friendValue.value;
                }
                else return this.values[this.field.name];
            },
            set(value) {
                if (this.isFriendValue) {
                    if (!value) {
                        this.changeValue(null);
                        return;
                    }
                    let emitValue = this.beforeChange(value)
                    this.changeValue(emitValue)
                } else this.values[this.field.name] = value
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
            this.pickRegExp();
            this.loadCompleteDispatch();
        },
        loadCompleteDispatch() {
            for (let key in this.values)// 隐藏字段需要立马派发，不然视觉体验不友好
                this.dispatchHide(key);
            if (this.globalVars.loadCompleted)
                clearTimeout(this.globalVars.loadCompleted);
            this.globalVars.loadCompleted = setTimeout(() => {
                for (let key in this.values) this.dispatchOptions(key);
            }, 500)
        },
        $setFieldAttr() {
            const defaultFieldAttr = this.defaultFieldAttr();
            let fieldAttr = Object.assign(defaultFieldAttr, this.field)
            for (const [key, value] of Object.entries(fieldAttr))
                this.$set(this.field, key, value)
        },
        beforeChange(value) {
            return this.schema.type == "number"
                ? parseFloat(value) ? parseFloat(value) : value
                : value;
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
                    case "array": friendValue = Array.isArray(value) ? value : strToObj(value); break;
                    case "number": friendValue = type(value) == "Number" ? value : parseFloat(value); break;
                    case "datetime": friendValue = new Date(value); break;
                    case "boolean":
                        friendValue = type(value) == "Boolean"
                            ? value
                            : value
                                ? Boolean(value)
                                : false;
                        break;
                    case "integer":
                        friendValue = type(value) == "Number"
                            ? value
                            : value
                                ? parseInt(value)
                                : value;
                        break;
                }
                if (friendValue) this.values[this.field.name] = friendValue; // 有友好值，需要更新
            } catch (e) {
                console.error(`转换友好值错了：${e}`)
            }
            return friendValue || value;
        },
        // 字段依赖隐藏
        pickHideFields() {
            const hideRely = this.field.hideRely;
            if (!hideRely) return; // 若不存在依赖，则无需收集
            const hideFields = Array.isArray(hideRely) ? hideRely :
                type(hideRely) == "String" ? [hideRely] : [];

            hideFields.map(hideItem => {
                let splitHideExp = hideItem.split("==");
                if (splitHideExp.length != 2) return;
                let relyKey = splitHideExp[0].trim();
                let relyValue = splitHideExp[1].trim();
                if (!this.hideFields[relyKey]) this.hideFields[relyKey] = [];
                // 必须全部遍历，以应对依赖先后关系
                for (let key in this.hideFields) {
                    // 已存在则不需要重新收集
                    let hasExit = this.hideFields[key].find((item) => {
                        if (item.key == relyKey &&
                            item.value == relyValue &&
                            item.name == this.field.name) {
                            // 必须重新赋值，因为form的地址已经变了
                            this.$set(item, 'field', this.field)
                            return true;
                        }
                    });
                    if (hasExit) return;
                }
                let convertKey = ["true", "false"];
                this.hideFields[relyKey].push({
                    name: this.field.name,
                    key: relyKey,
                    value: relyValue,
                    field: this.field,
                });
            })
        },
        // 收集依赖关系
        async pickDependencies() {
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
                    let relyKey = dictKeyVal[0].trim();
                    let relyValue = dictKeyVal[1].trim();
                    // 赋值初始值
                    if (!this.dependencies[relyKey]) this.dependencies[relyKey] = [];
                    // 已存在就无需重复添加
                    let hasExit = this.dependencies[relyKey].find((item) => {
                        if (item.keyValue == relyValue && item.name == this.field.name) {
                            // 必须重新赋值，因为form的地址已经变了
                            this.$set(item, 'field', this.field)
                            return true;
                        }
                    });
                    if (!hasExit) {
                        this.dependencies[relyKey].push({
                            name: this.field.name,
                            keyValue: dictKeyVal[1].trim(), //   [<字段名name> == 'A'] 的值 即：A
                            dictValue: dictItem,
                            field: this.field,
                            options: JSON.parse(JSON.stringify(this.field.options))
                        });
                    }
                }
            }
        },
        // 获取widget的dom高度，widgetDom高度会变化的需要调用该方法
        getWidgetHeight() {
            this.$nextTick(() => {
                // 不放在field的原因是设计器拖拽换位置不会重新计算高度
                const widgetDom = document.getElementById(this.widgetId);
                if (!widgetDom || widgetDom.offsetHeight == 0) {
                    this.$emit("widgetHeight", 48);
                    return;
                }
                let height = (widgetDom.offsetHeight < 40 ? 40 : widgetDom.offsetHeight) + 8;
                this.$emit("widgetHeight", height);
            })
        },
        // 收集表达式依赖
        pickRegExp() {
            const regExp = this.field.regExp;
            if (!regExp) return;
            regExp.map(regItem => {
                const { relyName } = regItem;
                if (!this.regExpFields[relyName]) this.regExpFields[relyName] = [];
                if (this.regExpFields[relyName].find(item => item.dispatchName == this.field.name
                    && item.relyName == regItem.relyName)) return; // 确保只收取一个表达式，
                // 正式收集
                this.regExpFields[relyName].push({
                    ...regItem,
                    dispatchName: this.field.name,
                })
            })
        }
    },
}