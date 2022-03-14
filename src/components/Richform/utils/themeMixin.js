const ORIGINAL_THEME = '#409EFF' // default color
import { defaultColors } from "./defaultData"

export default {
    mounted() {
        this.pickColors();
    },
    watch: {
        colors() {
            this.pickColors();
        }
    },
    methods: {
        pickColors() {
            if (Object.keys(this.colors).length == 0) return;
            const oldVal = ORIGINAL_THEME
            const styles = [].slice.call(document.querySelectorAll('style'))
                .filter(style => {
                    const text = style.innerText
                    return new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text)
                })
            styles.forEach(style => {
                const { innerText } = style
                if (typeof innerText !== 'string') return
                style.innerText = this.updateStyle(innerText)
            })
        },
        updateStyle(style) {
            let newStyle = style;
            let { theme, fontColor, btnColor, activeColor, btnBgColor, dateRangeBgColor, multiOptionBgColor } = Object.assign(this.colors, { ...defaultColors }, this.colors);
            fontColor = fontColor.replace("#", "");
            // brand color
            newStyle = newStyle.replace(new RegExp('409EFF', 'ig'), activeColor.replace("#", "")) // 复选框,tab,选中的背景颜色
            // font color
            newStyle = newStyle.replace(new RegExp('303133', 'ig'), fontColor) // 未被选中的状态,字体颜色
            newStyle = newStyle.replace(new RegExp('606266', 'ig'), fontColor) // 未被选中字体颜色，即字体颜色，非button ---白色
            // border color
            newStyle = newStyle.replace(new RegExp('DCDFE6', 'ig'), fontColor) // border 默认颜色
            newStyle = newStyle.replace(new RegExp('E4E7ED', 'ig'), fontColor) // border颜色 聚焦后的颜色
            newStyle = newStyle.replace(new RegExp('F2F6FC', 'ig'), dateRangeBgColor.replace("#", ""))  // 日期范围背景
            newStyle = newStyle.replace(new RegExp('EBEEF5', 'ig'), fontColor) // 穿梭框边颜色
            // f4f4f5
            newStyle = newStyle.replace(new RegExp('f4f4f5', 'ig'), multiOptionBgColor.replace("#", "")) // 下拉框，多选的选项颜色
            // background color
            newStyle = newStyle.replace(new RegExp('background:#fff', 'ig'), 'background:' + theme) // 下同
            newStyle = newStyle.replace(new RegExp('background-color:#fff', 'ig'), 'background-color:' + theme)
            newStyle = newStyle.replace(new RegExp('color:#fff', 'ig'), 'color:' + btnColor) // 按钮和滑块的字体颜色
            newStyle = newStyle.replace(new RegExp('F5F7FA', 'ig'), btnBgColor.replace("#", ""))  // 穿梭框头部和inputnumber两边的颜色，下拉hover的背景颜色
            return newStyle
        },
    }
}