/**
 *
        disabled: false,
        showTooltip: true,
        step: 1, // 步长
        minimum: 1, // 最小值
        maximum: 10, // 最大值
        showStop: false, // 显示间断点
        showInput: false, // 是否显示输入框，仅在非范围选择时有效
        inputSize: "", // large / medium / small / mini
        showInputControls: false, // 在显示输入框的情况下，是否显示输入框的控制按钮
        showRange: false, // 是否为范围选择,此时value必须为 [2,58]
        vertical: false,
        marks: {},
        height: "200px", // vertical 为true时，必须设置高度
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
                title: "步长",
                widget: "inputnumber",
                name: "step",
                step: 1,
                default: 1,
            },
            {
                title: "最小值",
                widget: "inputnumber",
                name: "minimum",
                step: 1,
            },
            {
                title: "最大值",
                widget: "inputnumber",
                name: "maximum",
                step: 1,
            },
            {
                widget: "grid",
                title: "栅格布局",
                showTitle: false,
                isClicked: false,
                fields: [
                    [
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
                    ], [
                        {
                            name: "showStop",
                            title: "间断点",
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
            {
                widget: "grid",
                title: "栅格布局",
                showTitle: false,
                isClicked: false,
                fields: [
                    [
                        {
                            name: "showInput",
                            title: "显示输入框",
                            widget: "switch",
                            width: 40, // 宽度
                            activeColor: "#13ce66", // 激活背景颜色
                            inactiveColor: "#ccc", // 取消背景颜色
                            activeValue: true, // 打开的值，支持Boolean, String或Number
                            inactiveValue: false, // 关闭的值，支持Boolean, String或Number
                        }
                    ], [
                        {
                            name: "showInputControls",
                            title: "控制按钮",
                            widget: "switch",
                            width: 40, // 宽度
                            activeColor: "#13ce66", // 激活背景颜色
                            inactiveColor: "#ccc", // 取消背景颜色
                            activeValue: true, // 打开的值，支持Boolean, String或Number
                            inactiveValue: false, // 关闭的值，支持Boolean, String或Number
                            hideRely: "showInput == false",
                        }
                    ]
                ]
            },
            {
                widget: "grid",
                title: "栅格布局",
                showTitle: false,
                isClicked: false,
                fields: [
                    [
                        {
                            name: "vertical",
                            title: "竖排列",
                            widget: "switch",
                            width: 40, // 宽度
                            activeColor: "#13ce66", // 激活背景颜色
                            inactiveColor: "#ccc", // 取消背景颜色
                            activeValue: true, // 打开的值，支持Boolean, String或Number
                            inactiveValue: false, // 关闭的值，支持Boolean, String或Number
                        }
                    ], [
                        {
                            name: "height",
                            title: "高度",
                            widget: "input",
                            size: "small",
                            hideRely: "vertical == false",
                        }
                    ]
                ]
            },
            {
                title: "尺寸",
                widget: "select",
                name: "inputSize",
                size: "small",
                hideRely: "showInput == false",
                options: [
                    {
                        value: "large",
                        label: "超大",
                    },
                    {
                        value: "medium",
                        label: "大",
                    },
                    {
                        value: "small",
                        label: "中",
                    },
                    {
                        value: "mini",
                        label: "小",
                    },
                ],
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
