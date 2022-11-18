/**
 *
        isGroup: false, // 为true时，options有效即多选框组生效,value必须为array
        isButton: false, // 功能：指明多选框组为按钮形式
        max: 10000, // 生效：多选框组  功能：规定可以选择的范围
        min: 0, // 生效：多选框组  功能：规定可以选择的范围
        disabled: false, // 生效：多选框组或单个  说明：优先级高于子checkbox
        border: false,
        size: "", // medium / small / mini  说明：仅对按钮形式或带有边框的Checkbox有效
        textColor: "#ffffff", // 按钮有效
        fill: "#409EFF", // 按钮有效
        chooseAll: false,
 *
 */
import { baseForm, baseLayout } from "./base"
export const attribute = {
    schema: {

    },
    values: {

    },
    form: {
        ...baseForm,
        layout: [
            ...baseLayout,
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
                title: "选项",
                widget: "draggablelist",
                name: "options",
                template: { title: "", name: "" },
                attribute: {
                    title: { widget: "input", placeholder: "", editable: true },
                    name: { widget: "input", placeholder: "", editable: true },
                },
                default: []
            },
            {
                widget: "grid",
                title: "栅格布局",
                showTitle: false,
                isClicked: false,
                fields: [
                    [
                        {
                            name: "isGroup",
                            title: "多选框组",
                            widget: "switch",
                            width: 40, // 宽度
                            activeColor: "#13ce66", // 激活背景颜色
                            inactiveColor: "#ccc", // 取消背景颜色
                            activeValue: true, // 打开的值，支持Boolean, String或Number
                            inactiveValue: false, // 关闭的值，支持Boolean, String或Number
                        },
                        {
                            name: "disabled",
                            title: "禁用",
                            widget: "switch",
                            width: 40, // 宽度
                            activeColor: "#13ce66", // 激活背景颜色
                            inactiveColor: "#ccc", // 取消背景颜色
                            activeValue: true, // 打开的值，支持Boolean, String或Number
                            inactiveValue: false, // 关闭的值，支持Boolean, String或Number
                        },
                        {
                            title: "字体颜色",
                            widget: "colorpicker",
                            name: "textColor",
                            hideRely: "isButton==false",
                        },
                    ], [
                        {
                            name: "isButton",
                            title: "按钮",
                            widget: "switch",
                            width: 40, // 宽度
                            activeColor: "#13ce66", // 激活背景颜色
                            inactiveColor: "#ccc", // 取消背景颜色
                            activeValue: true, // 打开的值，支持Boolean, String或Number
                            inactiveValue: false, // 关闭的值，支持Boolean, String或Number
                        },
                        {
                            name: "border",
                            title: "边界",
                            widget: "switch",
                            width: 40, // 宽度
                            activeColor: "#13ce66", // 激活背景颜色
                            inactiveColor: "#ccc", // 取消背景颜色
                            activeValue: true, // 打开的值，支持Boolean, String或Number
                            inactiveValue: false, // 关闭的值，支持Boolean, String或Number
                        },
                        {
                            title: "填充颜色",
                            widget: "colorpicker",
                            name: "fill",
                            hideRely: "isButton==false",
                        },
                    ]
                ]
            },
        ],
    }
}

export const rules = {
    schema: {},
    values: {

    },
    form: {
        ...baseForm,
        layout: [

        ]
    }
}
