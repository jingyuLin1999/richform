export default {
    props: {
        field: { type: Object, default: () => ({}) },
        schema: { type: Object, default: () => ({}) },
        values: { type: Object, default: () => ({}) },
        fieldErrors: { type: Object, default: () => ({}) },
    },
    data() {
        return {
            updateValue: 0,
        }
    },
    mounted() {
        this.$setFieldAttr()
    },
    // watch: {
    //     values: {
    //         handler() {
    //             this.values;
    //             console.log(45613)
    //         },
    //         deep: true
    //     },
    // },
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
            // TODO 做一些友好值处理
            // 值的类型
            return this.values[this.field.name];
        }
    }
}