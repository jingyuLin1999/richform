const ORIGINAL_THEME = '#409EFF' // default color

export default {
    data() {
        return {
            originalColors: ['#409EFF', "#303133", "#606266", "#DCDFE6", "#E4E7ED", "#EBEEF5", "#F2F6FC", "#f4f4f5", "#fff", "#fff", "#fff", "#F5F7FA", "#303133"],
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
            this.$nextTick(() => {
                const oldVal = ORIGINAL_THEME
                let styles = [].slice.call(document.querySelectorAll('style')).filter(style => {
                    const text = style.innerText
                    return new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text)
                })
                styles.forEach((style) => {
                    const { innerText } = style
                    if (typeof innerText !== 'string') return
                    style.innerText = this.replaceStyle(innerText);
                })
                if (styles) this.updateOriginalColors();
            })
        },
        updateOriginalColors() {
            let { theme, fontColor, btnColor, activeColor, btnBgColor, dateRangeBgColor, multiOptionBgColor } = this.friendForm.colors;
            if (activeColor) this.originalColors[0] = activeColor;
            if (fontColor) {
                this.originalColors[1] = fontColor;
                this.originalColors[2] = fontColor;
                this.originalColors[3] = fontColor;
                this.originalColors[4] = fontColor;
                this.originalColors[5] = fontColor;
                this.originalColors[12] = theme;
            }
            if (dateRangeBgColor) this.originalColors[6] = dateRangeBgColor;
            if (multiOptionBgColor) this.originalColors[7] = multiOptionBgColor;
            if (theme) {
                this.originalColors[8] = theme;
                this.originalColors[9] = theme;
            }
            if (btnColor) this.originalColors[10] = btnColor;
            if (btnBgColor) this.originalColors[11] = btnBgColor;

        },
        replaceStyle(style) {
            let newStyle = style;
            let { originalColors } = this;
            let { activeColor, theme, fontColor, btnColor, btnBgColor, dateRangeBgColor, multiOptionBgColor } = this.friendForm.colors;
            if (activeColor.length > 0) // brand color
                // brand color
                newStyle = newStyle.replace(new RegExp(originalColors[0], 'ig'), activeColor) // 复选框,tab,选中的背景颜色
            if (fontColor.length > 0) {
                newStyle = newStyle.replace(new RegExp(`background:${originalColors[12]}`, 'ig'), 'background:' + theme) // tooltip背景颜色
                // font color
                newStyle = newStyle.replace(new RegExp(originalColors[1], 'ig'), fontColor) // 未被选中的状态,字体颜色
                newStyle = newStyle.replace(new RegExp(originalColors[2], 'ig'), fontColor) // 未被选中字体颜色，即字体颜色，非button ---白色
                // border color
                newStyle = newStyle.replace(new RegExp(originalColors[3], 'ig'), fontColor) // border 默认颜色
                newStyle = newStyle.replace(new RegExp(originalColors[4], 'ig'), fontColor) // border颜色 聚焦后的颜色
                newStyle = newStyle.replace(new RegExp(originalColors[5], 'ig'), fontColor) // 穿梭框边颜色
            }
            if (dateRangeBgColor.length > 0)
                newStyle = newStyle.replace(new RegExp(originalColors[6], 'ig'), dateRangeBgColor)  // 日期范围背景
            if (multiOptionBgColor.length > 0)
                newStyle = newStyle.replace(new RegExp(originalColors[7], 'ig'), multiOptionBgColor) // 下拉框，多选的选项颜色
            if (theme.length > 0) {
                // background color
                newStyle = newStyle.replace(new RegExp(`background:${originalColors[8]}`, 'ig'), 'background:' + theme) // 下同
                newStyle = newStyle.replace(new RegExp(`background-color:${originalColors[9]}`, 'ig'), 'background-color:' + theme)
            }
            if (btnColor.length > 0)
                newStyle = newStyle.replace(new RegExp(`color:${originalColors[10]}`, 'ig'), 'color:' + btnColor) // 按钮和滑块的字体颜色
            if (btnBgColor.length > 0)
                newStyle = newStyle.replace(new RegExp(originalColors[11], 'ig'), btnBgColor)  // 穿梭框头部和inputnumber两边的颜色，下拉hover的背景颜色

            return newStyle
        },
    }
}