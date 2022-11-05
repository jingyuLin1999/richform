export const defaultForm = {
    border: false, // 显示边框
    grid: false, // 表单内部栅栏
    labelSuffix: ":", // 字段标题后缀内容，默认' : '
    labelWidth: "100px", // 标签宽度,默认50px
    validator: "input", // submit
    labelAlign: "right", // 标签对齐, 默认右对齐, 可选左对齐left
    labelInline: true, // 字段标题显示位置, 默认true左侧left,false显示在top上方
    colors: {  // 主题颜色
        theme: "", // #121B2C
        fontColor: "", // #F8F4F4
        btnColor: "", // #F8F4F4
        btnBgColor: "", // #040C19
        activeColor: "", // #4F9FFE
        dateRangeBgColor: "", // #999
        multiOptionBgColor: "" // #ddd
    },
}

export const defaultSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "richform attribute",
    description: "",
    type: "object",
    properties: {},
    errorMessage: {},
    if: {},
    then: {},
    else: {},
    allOf: [],
    anyOf: [],
    oneOf: [],
    required: [],
}
