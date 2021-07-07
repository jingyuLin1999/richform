/**
 *
        isPicker: true, // 是否为 timepicker 时间任意。timeselect固定时间，由pickerOptions设定
        readOnly: false,
        disabled: false,
        clearable: true, // 是否显示清除按钮
        size: "", // medium / small / mini
        editable: false, // 文本框可输入
        placeholder: "请选择", // 单个
        valueFormat: "HH:mm:ss",
        isRange: false, // isRange下面三个有效
        arrowControl: true,
        rangeSeparator: "至", // 选择范围时的分隔符
        startPlaceholder: "开始时间",
        endPlaceholder: "结束时间",
        pickerOptions: {
          // timeselect 有效
          start: "08:30",
          step: "00:15",
          end: "18:30",
        },
 *
 */
import { baseForm, baseLayout } from "./base"
export const attribute = {
    schema: {
        $schema: "http://json-schema.org/draft-07/schema#",
        title: "设备属性",
        description: "A product from Acme's catalog",
        type: "object",
        properties: {
            isRange: {
                require: true,
                description: "该字段选择后不可更改，否则会因为字段类型错误而报错",
            }
        }
    },
    values: {},
    form: {
        ...baseForm,
        layout: [
            ...baseLayout,
            {
                title: "范围选择",
                widget: "select",
                name: "isRange",
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
                        value: "small",
                        label: "中",
                    },
                    {
                        value: "mini",
                        label: "小",
                    },
                ],
            },
            {
                widget: "input",
                title: "开始占位符",
                name: "startPlaceholder",
                hideRely: "isRange==false",
                size: "small"
            },
            {
                widget: "input",
                title: "结束占位符",
                name: "endPlaceholder",
                hideRely: "isRange==false",
                size: "small"
            },
            {
                widget: "input",
                title: "分隔符",
                name: "rangeSeparator",
                hideRely: "isRange==false",
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
                            name: "readOnly",
                            title: "只看",
                            widget: "switch",
                            width: 40, // 宽度
                            activeColor: "#13ce66", // 激活背景颜色
                            inactiveColor: "#ccc", // 取消背景颜色
                            activeValue: true, // 打开的值，支持Boolean, String或Number
                            inactiveValue: false, // 关闭的值，支持Boolean, String或Number
                        },
                        {
                            name: "clearable",
                            title: "清除按钮",
                            widget: "switch",
                            width: 40, // 宽度
                            activeColor: "#13ce66", // 激活背景颜色
                            inactiveColor: "#ccc", // 取消背景颜色
                            activeValue: true, // 打开的值，支持Boolean, String或Number
                            inactiveValue: false, // 关闭的值，支持Boolean, String或Number
                        }
                    ], [
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
                            name: "arrowControl",
                            title: "可控",
                            widget: "switch",
                            width: 40, // 宽度
                            activeColor: "#13ce66", // 激活背景颜色
                            inactiveColor: "#ccc", // 取消背景颜色
                            activeValue: true, // 打开的值，支持Boolean, String或Number
                            inactiveValue: false, // 关闭的值，支持Boolean, String或Number
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
            // {
            //     title: "类型",
            //     widget: "select",
            //     name: "type",
            //     size: "small",
            //     options: [
            //         {
            //             value: "string",
            //             label: "字符串",
            //         },
            //         {
            //             value: "number",
            //             label: "数字",
            //         },
            //     ],
            // },
        ]
    }
}
