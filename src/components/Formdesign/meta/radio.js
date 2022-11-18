/**
        isGroup: true,
        isButton: false,
        disabled: true,
        border: false,
        size: "", // medium / small / mini
        textColor: "", // 当isButton为true时有效
        fill: "", // 当isButton为true时有效
 */

import { baseForm, baseLayout } from "./base";

export const attribute = {
    values: {},
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
            },
            {
                widget: "grid",
                showTitle: false,
                isClicked: false,
                fields: [
                    [
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
                            title: "边框",
                            widget: "switch",
                            width: 40, // 宽度
                            activeColor: "#13ce66", // 激活背景颜色
                            inactiveColor: "#ccc", // 取消背景颜色
                            activeValue: true, // 打开的值，支持Boolean, String或Number
                            inactiveValue: false, // 关闭的值，支持Boolean, String或Number
                        }
                    ],
                    [
                        {
                            name: "isGroup",
                            title: "分组",
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
                        }
                    ],
                ]
            }
        ],
    }
}

export const rules = {
    schema: {},
    values: {},
    form: {
        ...baseForm,
        layout: [
            {
                title: "类型",
                widget: "select",
                name: "type",
                size: "small",
                default: "string",
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
        ]
    }
}