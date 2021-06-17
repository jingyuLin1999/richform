export const layout = [ // 布局模板数据
    {
        widget: "grid",
        title: "栅格布局",
        showTitle: false,
        isClicked: false,
        fields: [[]]
    },

    {
        layoutId: "2",
        title: "标签页",
        widget: "tabs",
        inline: false,
        isClicked: false,
        tabs: [
            {
                label: "标签页一",
                name: "1",
                designId: new Date().getTime().toString(),
                icon: "",
                fields: [
                ]
            }
        ]
    },
    {
        layoutId: "3",
        title: "折叠面板",
        expand: true,
        widget: "collapse",
        isClicked: false,
        fields: []
    }
]

export const widgets = [
    {
        id: "1",
        title: "输入框",
        widget: "input",
        name: "input",
    },
    {
        title: "下拉选框", // 优先级小于shema中定义的title
        widget: "select",
        name: "select",
        options: [
            {
                value: "选项1",
                label: "黄金糕",
            }
        ],
    },
    {
        widget: "radio",
        title: "单选",
        name: "radio",
        isGroup: true,
        isButton: false,
        disabled: false,
        border: true,
        size: "default",
        textColor: "#f00",
        fill: "#00f",
        options: [
            {
                name: "optionA",
                title: "选项A",
                disabled: false,
                border: false,
                size: "default",
            },
            {
                name: "optionB",
                title: "选项B",
                disabled: false,
                border: false,
                size: "default",
            },
        ],
    },
    {
        name: "inputnumber",
        widget: "inputnumber",
        title: "计数器",
        disabled: true,
        step: 1, // 步数
        min: undefined,
        max: undefined,
        stepStrictly: false, // 严格步数,只能输入 step 的倍数
        precision: undefined, // 精度,设置计数器最小值
        controlsPosition: "", // 按钮位置。计数器增减按钮的位置, 默认"", 可设置为 "right"
        size: "default",
    },
    {
        name: "switch",
        title: "开关",
        widget: "switch",
        disabled: false,
        width: 40, // 宽度
        activeColor: "#13ce66", // 激活背景颜色
        inactiveColor: "#ff4949", // 取消背景颜色
        activeText: "路飞", // 激活文本
        inactiveText: "索隆", // 取消文本
        activeValue: true, // 打开的值，支持Boolean, String或Number
        inactiveValue: false, // 关闭的值，支持Boolean, String或Number
        activeIconClass: "",
        inactiveIconClass: "",
    },
    {
        widget: "slider",
        name: "slider", // 对应的schema键值,必选,唯一
        title: "滑块",
        clearable: true,
        minimum: 0,
        maximum: 1000,
        step: 100,
    }
]

