export const baseForm = {
    border: false, // 显示边框
    grid: false, // 表单内部栅栏
    labelSuffix: ":", // 字段标题后缀内容，默认' : '
    labelWidth: "100px", // 标签宽度,默认50px
    validator: "input", // submit
    labelAlign: "right", // 标签对齐, 默认右对齐, 可选左对齐left
    labelInline: true, // 字段标题显示位置, 默认true左侧left,false显示在top上方
    colors: {
        btnBgColor: ""
    }
}

export const baseValues = {
    title: "",
}

export const baseLayout = [
    {
        title: "名称",
        name: "name",
        size: "small",
        widget: "select",
        filterable: true,
        allowCreate: true,
        description: "对应数据库字段",
        options: [],
    },
    {
        title: "标题",
        name: "title",
        size: "small",
        widget: "input"
    },
    {
        title: "隐藏",
        name: "hideRely",
        size: "small",
        widget: "draggablelist",
        // description: "隐藏依赖设置",
        template: "",
        default: [],
        strAttr: {
            widget: "expression",
            key: {
                title: "字段",
                show: true,
                order: 1,
                options: [],
            },
            val: {
                title: "值",
                show: true,
                order: 3,
                options: [],
            },
        }
    }
]

export const baseRules = {
    ...baseForm,
    layout: [
        {
            title: "类型",
            widget: "select",
            name: "type",
            size: "small",
            options: [
                { value: "string", label: "字符串" },
            ],
        },
    ]
}