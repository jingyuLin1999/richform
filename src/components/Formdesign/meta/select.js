/**
 
        isGroup: false, // 是否分组
        placeholder: "请选择",
        size: "",
        disabled: false, // 说明：当该属性在字典中，则禁用对应的选项。若在field.disable则禁用整个选择器
        clearable: false, // 说明：可清空选项  注意：仅单选有效
        multiple: false, // 说明：是否支持多选
        collapseTags: false, // 多选用tags显示
        filterable: false, // 说明：搜索label
        allowCreate: false, // 说明：是否允许创建条目,谨慎使用  注意：filterable为true时有效
 */

import { baseForm, baseLayout } from "./base";

export const attribute = {
    schema: {

    },
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
                        label: "迷你",
                    },
                ],
            },
            {
                widget: "grid",
                showTitle: false,
                isClicked: false,
                fields: [
                    [
                        {
                            name: "isGroup",
                            title: "分组",
                            widget: "switch",
                            width: 40, // 宽度
                            activeColor: "#13ce66", // 激活背景颜色
                            inactiveColor: "#ff4949", // 取消背景颜色
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
                            inactiveColor: "#ff4949", // 取消背景颜色
                            activeValue: true, // 打开的值，支持Boolean, String或Number
                            inactiveValue: false, // 关闭的值，支持Boolean, String或Number
                        }
                    ]
                ]
            },
            {
                widget: "grid",
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
                            inactiveColor: "#ff4949", // 取消背景颜色
                            activeValue: true, // 打开的值，支持Boolean, String或Number
                            inactiveValue: false, // 关闭的值，支持Boolean, String或Number
                        }
                    ], [
                        {
                            name: "multiple",
                            title: "多选",
                            widget: "switch",
                            width: 40, // 宽度
                            activeColor: "#13ce66", // 激活背景颜色
                            inactiveColor: "#ff4949", // 取消背景颜色
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
    values: {},
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
                ],
            },
            {
                title: "最小长度",
                name: "minLength",
                widget: "inputnumber",
                step: 1, // 步数
                min: undefined,
                max: undefined,
                stepStrictly: false, // 严格步数,只能输入 step 的倍数
                precision: undefined, // 精度,设置计数器最小值
                controlsPosition: "", // 按钮位置。计数器增减按钮的位置, 默认"", 可设置为 "right"
                size: "mini",
            }
        ]
    }
}