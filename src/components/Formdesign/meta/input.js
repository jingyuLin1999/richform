/**
 *
        type: "text", // text，textarea
        placeholder: "请输入内容",
        disabled: false, // 禁用状态
        clearable: true, //
        showPassword: false, // 密码框
        prefixIcon: "", // 当type等于text有效。前置图标 el-icon-search
        suffixIcon: "", // 当type等于text有效。后置图标 el-icon-date
        rows: 4, // 当type等于textarea有效
        autosize: false, // 当type等于textarea有效。根据内容自动设置高度，也可接受一个对象 { minRows: 2, maxRows: 4}
        prepend: "", // 当type等于text有效。
        append: "", // 当type等于text有效。
        size: "", // large、small 和 mini
        maxLength: null,
        minLength: null,
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
                title: "占位符",
                name: "placeholder",
                size: "small",
                widget: "input"
            },
            {
                title: "类型",
                widget: "select",
                name: "type",
                size: "small",
                options: [
                    {
                        value: "text",
                        label: "文本",
                    },
                    {
                        value: "textarea",
                        label: "多行文本框",
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
                widget: "grid",
                title: "栅格布局",
                showTitle: false,
                isClicked: false,
                fields: [
                    [
                        {
                            name: "clearable",
                            title: "可清空",
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
                            name: "showPassword",
                            title: "密码框",
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
