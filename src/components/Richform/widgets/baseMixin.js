import { type, mergeDeepRight } from "ramda";
import { isUrl, loadDict, strToObj } from "../utils";
import CommonMixin from "../utils/commonMixin";

export default {
    props: {
        field: { type: Object, default: () => ({}) },
        schema: { type: Object, default: () => ({}) },
        values: { type: Object, default: () => ({}) },
        colors: { type: Object, default: () => ({}) },
        fieldErrors: { type: Object, default: () => ({}) },
        hideFields: { type: Object, default: () => ({}) },
        isDark: { type: Boolean, default: false },
        form: { type: Object, default: () => ({}) },
    },
    data() {
        return {
            updateValue: 0,
            widgetId: "widget-" + Math.random().toString(15).slice(2, 15)
        }
    },
    inject: ["dependencies", "globalVars", "regExpFields", "isDeepValues", "hooks", "flatFields"],
    mixins: [CommonMixin],
    created() {
        this.load();
    },
    watch: {
        "field.hideRely": {
            handler() {
                this.pickHideFields();
            },
            deep: true,
        }
    },
    computed: {
        value: {
            get() {
                this.updateValue++; // 强制更新
                let friendValue = {  // 必须改变地址，否则会出现无限循环
                    value: this.isDeepValues ?
                        this.deepPick(this.field.name.split("."), this.values) :
                        this.friendValue()
                };
                return friendValue.value;
            },
            set(value) {
                let emitValue = this.beforeChange(value)
                this.changeValue(emitValue)
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
            this.pickFlatField();
        },
        pickFlatField() {
            if (this.field.name) {
                this.flatFields[this.field.name] = this.field;
            }
        },
        loadCompleteDispatch() {
            // 隐藏字段需要立马派发，不然视觉体验不友好
            for (let key in this.hideFields) this.dispatchHide(key);
            // 等所有字段都渲染完成在派发options依赖
            if (this.globalVars.loadCompletedTimeout)
                clearTimeout(this.globalVars.loadCompletedTimeout);
            this.globalVars.loadCompletedTimeout = setTimeout(() => {
                for (let key in this.dependencies) this.dispatchOptions(key);
                this.globalVars.loadCompleted = true;
            }, 500)
        },
        $setFieldAttr() {
            const defaultFieldAttr = this.defaultFieldAttr();
            let fieldAttr = mergeDeepRight(defaultFieldAttr, this.field);
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
                const { method, respProp, params, pickValues } = this.field.dictConfig;
                pickValues.map(key => { if (this.values[key] != undefined) params[key] = this.values[key] });
                const response = await loadDict(this.field.dict, params, method);
                const options = this.deepPick(respProp.split("."), response);
                if (Array.isArray(options) && options.length > 0) this.$set(this.field, "options", options);
                if (this.field.defaultOption >= 0 && this.field.options.length > 0) {
                    let option = options[this.field.defaultOption];
                    this.values[this.field.name] = typeof option == "object" ? option[this.field.defaultProp.value] : option
                }
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
                            beRelyKey: relyKey, // [<字段名name> == 'A'] 的字段 即：<字段名name>
                            keyValue: relyValue, // [<字段名name> == 'A'] 的值 即：A
                            dictValue: dictItem, // dict[<字段名name> == 'A'] 的 值
                            field: this.field,
                            type: this.schema.type, // 在派发时为了友好值，需要知道字段类型
                            options: JSON.parse(JSON.stringify(this.field.options))
                        });
                    }
                }
            }
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
                    field: this.field,
                })
            })
        }
    },
}