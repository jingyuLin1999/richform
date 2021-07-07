/**
 *
        title: "日期选择器",
        type: "daterange", // year/month/date/dates/ week/datetime/datetimerange/daterange/monthrange
        readOnly: false,
        disabled: false,
        clearable: true, // 是否显示清除按钮
        size: "", // medium / small / mini
        editable: false, // 文本框可输入
        placeholder: "请选择", // 单个
        format: "", // 显示的格式,注意和type配套
        valueFormat: "yyyy-MM-dd", // yyyy-MM-dd/timestamp 指定值的格式
        arrowControl: true,
        rangeSeparator: "至", // 选择范围时的分隔符
        startPlaceholder: "开始时间",
        endPlaceholder: "结束时间",
        pickerOptions: {},
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
                title: "类型",
                widget: "select",
                name: "type",
                size: "small",
                options: [
                    {
                        value: "year",
                        label: "年",
                    },
                    {
                        value: "month",
                        label: "月",
                    },
                    {
                        value: "date",
                        label: "日期",
                    },
                    {
                        value: "dates",
                        label: "多个日期",
                    },
                    {
                        value: "week",
                        label: "星期",
                    },
                    {
                        value: "datetime",
                        label: "日期时间",
                    },
                    {
                        value: "datetimerange",
                        label: "日期时间范围",
                    },
                    {
                        value: "daterange",
                        label: "日期范围",
                    },
                    {
                        value: "monthrange",
                        label: "月份范围",
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
                title: "占位符",
                name: "placeholder",
                size: "small",
                widget: "input"
            },
            {
                widget: "input",
                title: "开始占位符",
                name: "startPlaceholder",
                size: "small"
            },
            {
                widget: "input",
                title: "结束占位符",
                name: "endPlaceholder",
                size: "small"
            },
            {
                widget: "input",
                title: "分隔符",
                name: "rangeSeparator",
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
                            title: "只读",
                            widget: "switch",
                            width: 40, // 宽度
                            activeColor: "#13ce66", // 激活背景颜色
                            inactiveColor: "#ccc", // 取消背景颜色
                            activeValue: true, // 打开的值，支持Boolean, String或Number
                            inactiveValue: false, // 关闭的值，支持Boolean, String或Number
                            hideRely: "type==textarea",
                        },
                        {
                            name: "clearable",
                            title: "可清除",
                            widget: "switch",
                            width: 40, // 宽度
                            activeColor: "#13ce66", // 激活背景颜色
                            inactiveColor: "#ccc", // 取消背景颜色
                            activeValue: true, // 打开的值，支持Boolean, String或Number
                            inactiveValue: false, // 关闭的值，支持Boolean, String或Number
                            hideRely: "type==textarea",
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
                            hideRely: "type==textarea",
                        },
                        {
                            name: "arrowControl",
                            title: "箭头",
                            widget: "switch",
                            width: 40, // 宽度
                            activeColor: "#13ce66", // 激活背景颜色
                            inactiveColor: "#ccc", // 取消背景颜色
                            activeValue: true, // 打开的值，支持Boolean, String或Number
                            inactiveValue: false, // 关闭的值，支持Boolean, String或Number
                            hideRely: "type==textarea",
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
    },
    form: {
        ...baseForm,
        layout: []
    }
}
