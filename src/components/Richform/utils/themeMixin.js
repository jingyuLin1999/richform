import { clone } from "ramda";
const ORIGINAL_THEME = '#409EFF' // default color

export default {
    data() {
        return {
            styles: [],
        }
    },
    watch: {
        "form.colors": {
            handler(newVal) {
                // 将新的颜色派发保存以便下一轮替换    
                if (typeof newVal != "object") return;
                this.pickColors();
            },
            deep: true,
            immediate: true,
        }
    },
    methods: {
        pickColors() {
            const oldVal = ORIGINAL_THEME
            if (this.styles.length == 0)
                this.styles = [].slice.call(document.querySelectorAll('style')).filter(style => {
                    const text = style.innerText
                    return new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text)
                })
            let styles = clone(this.styles);
            styles.forEach(style => {
                const { innerText } = style
                if (typeof innerText !== 'string') return
                style.innerText = this.updateStyle(innerText);
            })
        },
        updateStyle(style) {
            let newStyle = style;
            let { theme, fontColor, btnColor, activeColor, btnBgColor, dateRangeBgColor, multiOptionBgColor } = this.friendForm.colors;
            // 开始替换
            if (activeColor.length > 0) // brand color
                // brand color
                newStyle = newStyle.replace(new RegExp('409EFF', 'ig'), activeColor.replace("#", "")) // 复选框,tab,选中的背景颜色
            if (fontColor.length > 0) {
                fontColor = fontColor.replace("#", "");
                // font color
                newStyle = newStyle.replace(new RegExp('303133', 'ig'), fontColor) // 未被选中的状态,字体颜色
                newStyle = newStyle.replace(new RegExp('606266', 'ig'), fontColor) // 未被选中字体颜色，即字体颜色，非button ---白色
                // border color
                newStyle = newStyle.replace(new RegExp('DCDFE6', 'ig'), fontColor) // border 默认颜色
                newStyle = newStyle.replace(new RegExp('E4E7ED', 'ig'), fontColor) // border颜色 聚焦后的颜色
                newStyle = newStyle.replace(new RegExp('EBEEF5', 'ig'), fontColor) // 穿梭框边颜色
            }
            if (dateRangeBgColor.length > 0)
                newStyle = newStyle.replace(new RegExp('F2F6FC', 'ig'), dateRangeBgColor.replace("#", ""))  // 日期范围背景
            if (multiOptionBgColor.length > 0)
                newStyle = newStyle.replace(new RegExp('f4f4f5', 'ig'), multiOptionBgColor.replace("#", "")) // 下拉框，多选的选项颜色
            if (theme.length > 0) {
                // background color
                newStyle = newStyle.replace(new RegExp('background:#fff', 'ig'), 'background:' + theme) // 下同
                newStyle = newStyle.replace(new RegExp('background-color:#fff', 'ig'), 'background-color:' + theme)
            }
            if (btnColor.length > 0)
                newStyle = newStyle.replace(new RegExp('color:#fff', 'ig'), 'color:' + btnColor) // 按钮和滑块的字体颜色
            if (btnBgColor.length > 0)
                newStyle = newStyle.replace(new RegExp('F5F7FA', 'ig'), btnBgColor.replace("#", ""))  // 穿梭框头部和inputnumber两边的颜色，下拉hover的背景颜色
            return newStyle
        },
    }
}