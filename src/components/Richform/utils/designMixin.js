import eventbus from "./eventbus";
export default {
    props: {
        schema: { type: Object, default: () => ({}) },
        values: { type: Object, default: () => ({}) },
        form: { type: Object, default: () => ({}) },
        isDesign: { type: Boolean, default: false },
        fieldErrors: { type: Object, default: () => ({}) },
        hideFields: { type: Object, default: () => ({}) },
        realyValues: { type: Object, default: () => ({}) },
    },
    inject: ["formId", "isFriendValue"],
    data() {
        return {
            designValid: true,
        }
    },
    created() {
        this.$nextTick(() => {
            // this.onScrollToBottom();
        })
    },
    methods: {
        emit() {
            if (arguments.length > 0) {
                arguments[0] = `${this.formId}:${arguments[0]}`;
                eventbus.$emit(...arguments);
            }
        },
        // 监听事件，滚动条滑动到最底部
        onScrollToBottom() {
            const ele = document.getElementById("form-design-center").parentNode;
            let scrollToBottomInterval;
            ele.onmouseenter = () => {
                scrollToBottomInterval = setInterval(function () {
                    //设置滚动条到最底部
                    if (ele.scrollHeight > ele.clientHeight) {
                        ele.scrollTop = ele.scrollHeight;
                    }
                }, 20);
            };
            ele.onmouseout = () => {
                clearInterval(scrollToBottomInterval);
            }
            window.addEventListener("mousewheel", () => {
                clearInterval(scrollToBottomInterval);
            }, false);
        },
        // 项目点击事件
        onClickedItem(item) {
            if (!this.isDesign) return;
            this.emit("design:clicked", item);
        },
        // 项目删除动作
        onDeleteItem(form, field) {
            if (!this.isDesign) return;
            this.iterationFind(form.layout, field)
        },
        // 递归查找并删除
        iterationFind(obj, target) {
            for (let key in obj) {
                if (typeof obj[key] === "object" && obj[key] !== null) {
                    if (JSON.stringify(obj[key]) == JSON.stringify(target)) {
                        this.$delete(obj, key);
                    }
                    this.iterationFind(obj[key], target)
                }
            }
        },
        // 复制
        onCopyItem(item) {
            if (!this.isDesign) return;
            this.emit("design:copyItem", item);
        },
        // 拖拽参数配置
        getDragOptions() {
            return {
                group: "formdesign", // 两个draggable要相互拖拽必须相同
                sort: true, // 是否允许排序
                disabled: false,
                animation: 0, // 过度
                easing: "cubic-bezier(1, 0, 0, 1)", // 动画效果
                handle: ".design-handle-move", // 可拖拽类，用于限定区域
                dragClass: "design-sortable-drag", // 排序背景显示
                ghostClass: "design-draggable-ghost",
                emptyInsertThreshold: 6, // 首个拖进来占位,该值不能太大，否则会发生抖动情况
                invertSwap: false,
                // direction: 'vertical',
                swapThreshold: 0.5,
            }
        }
    }
}