import { baseForm, baseLayout } from "./base"
export const attribute = {
    schema: {

    },
    values: {
        type: "primary",
    },
    form: {
        ...baseForm,
        layout: [
            ...baseLayout,
            {
                title: "类型",
                widget: "select",
                name: "type",
                size: "small",
                options: [
                    {
                        value: "default",
                        label: "默认",
                    },
                    {
                        value: "primary",
                        label: "主要",
                    },
                    {
                        value: "success",
                        label: "成功",
                    },

                    {
                        value: "info",
                        label: "信息",
                    },
                    {
                        value: "warning",
                        label: "警告",
                    },
                    {
                        value: "danger",
                        label: "危险",
                    },
                    {
                        value: "text",
                        label: "文本",
                    },
                ],
            },
            {
                title: "尺寸",
                widget: "select",
                name: "size",
                size: "small",
                options: [
                    {
                        value: "medium",
                        label: "大",
                    },
                    {
                        value: "small ",
                        label: "中",
                    },
                    {
                        value: "mini",
                        label: "小",
                    },
                ],
            },
            {
                title: "禁用",
                widget: "select",
                name: "disabled",
                size: "small",
                options: [
                    {
                        value: true,
                        label: "是",
                    },
                    {
                        value: false,
                        label: "否",
                    }
                ],
            },
            {
                title: "左图标",
                widget: "icon",
                name: "leftIcon",
                size: "small"
            },
            {
                title: "右图标",
                widget: "icon",
                name: "rightIcon",
                size: "small"
            },
            {
                widget: "grid",
                title: "栅格布局",
                showTitle: false,
                isClicked: false,
                fields: [
                    [
                        {
                            name: "round",
                            title: "圆角",
                            widget: "switch",
                            width: 40, // 宽度
                            activeColor: "#13ce66", // 激活背景颜色
                            inactiveColor: "#ccc", // 取消背景颜色
                            activeValue: true, // 打开的值，支持Boolean, String或Number
                            inactiveValue: false, // 关闭的值，支持Boolean, String或Number
                        },
                        {
                            name: "circle",
                            title: "圆形",
                            widget: "switch",
                            width: 40, // 宽度
                            activeColor: "#13ce66", // 激活背景颜色
                            inactiveColor: "#ccc", // 取消背景颜色
                            activeValue: true, // 打开的值，支持Boolean, String或Number
                            inactiveValue: false, // 关闭的值，支持Boolean, String或Number
                        },
                    ], [
                        {
                            name: "plain",
                            title: "朴素按钮",
                            widget: "switch",
                            width: 40, // 宽度
                            activeColor: "#13ce66", // 激活背景颜色
                            inactiveColor: "#ccc", // 取消背景颜色
                            activeValue: true, // 打开的值，支持Boolean, String或Number
                            inactiveValue: false, // 关闭的值，支持Boolean, String或Number
                        }
                    ]
                ]
            },
        ],
    }
}

export const rules = {
    schema: {},
    values: {
        type: "string",
    },
    form: {
        ...baseForm,
        layout: [
            {
                title: "类型",
                widget: "select",
                name: "type",
                size: "small",
                options: [
                    {
                        value: "string",
                        label: "字符串",
                    },
                    {
                        value: "number",
                        label: "数字",
                    },
                ],
            },
            {
                title: "最小值",
                name: "minimum",
                widget: "inputnumber",
                step: 1, // 步数
                min: 0,
                default: 0,
                stepStrictly: false, // 严格步数,只能输入 step 的倍数
                precision: undefined, // 精度,设置计数器最小值
                controlsPosition: "", // 按钮位置。计数器增减按钮的位置, 默认"", 可设置为 "right"
                size: "mini",
                hideRely: "type==string",
            },
            {
                title: "最大值",
                name: "maximum",
                widget: "inputnumber",
                step: 1, // 步数
                min: 0,
                default: 255,
                stepStrictly: false, // 严格步数,只能输入 step 的倍数
                precision: undefined, // 精度,设置计数器最小值
                controlsPosition: "", // 按钮位置。计数器增减按钮的位置, 默认"", 可设置为 "right"
                size: "mini",
                hideRely: "type==string",
            },
            {
                title: "最小长度",
                name: "minLength",
                widget: "inputnumber",
                step: 1, // 步数
                min: 0,
                max: 255,
                default: 0,
                stepStrictly: false, // 严格步数,只能输入 step 的倍数
                precision: undefined, // 精度,设置计数器最小值
                controlsPosition: "", // 按钮位置。计数器增减按钮的位置, 默认"", 可设置为 "right"
                size: "mini",
                hideRely: "type==number",
            },
            {
                title: "最大长度",
                name: "maxLength",
                widget: "inputnumber",
                step: 1, // 步数
                min: 0,
                max: 255,
                default: 255,
                stepStrictly: false, // 严格步数,只能输入 step 的倍数
                precision: undefined, // 精度,设置计数器最小值
                controlsPosition: "", // 按钮位置。计数器增减按钮的位置, 默认"", 可设置为 "right"
                size: "mini",
                hideRely: "type==number",
            },

        ]
    }
}
