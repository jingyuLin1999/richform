<script>
export default {
    props: {
        to: {
            type: String,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false,
        }
    },
    render() {
        // $scopedSlots用来访问作用域插槽。对于包括 默认 slot 在内的每一个插槽，该对象都包含一个返回相应 VNode 的函数。
        return <div class="Teleport">{this.$scopedSlots.default()}</div>
    },
    watch: {
        disabled() {
            if (!this.disabled) {
                // this指向组件的实例。$el指向当前组件的DOM元素。
                document.querySelector(this.to).appendChild(this.$el);
            }
        }
    },
    mounted() {
        if (!this.disabled) document.querySelector(this.to).appendChild(this.$el)
    },
};
</script>
<style lang="scss" scoped></style>