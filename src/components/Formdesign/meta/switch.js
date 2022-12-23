/**
 *
        disabled: false,
        width: 40, // 宽度
        activeColor: "#13ce66", // 激活背景颜色
        inactiveColor: "#ff4949", // 取消背景颜色
        activeText: "", // 激活文本
        inactiveText: "", // 取消文本
        activeValue: true, // 打开的值，支持Boolean, String或Number
        inactiveValue: false, // 关闭的值，支持Boolean, String或Number
        activeIconClass: "",
        inactiveIconClass: "",
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
                title: "开值",
                widget: "input",
                size: "small",
                name: "activeValue"
            },
            {
                title: "关值",
                widget: "input",
                size: "small",
                name: "inactiveValue",
            },
            {
                title: "激活文本",
                widget: "input",
                size: "small",
                name: "activeText",
            },
            {
                title: "取消文本",
                widget: "input",
                size: "small",
                name: "inactiveText",
            },
            {
                title: "禁用",
                widget: "switch",
                name: "disabled",
            },
            {
                title: "宽度",
                widget: "inputnumber",
                size: "small",
                name: "width",
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
            {
                title: "类型",
                widget: "select",
                name: "type",
                size: "small",
                default: "number",
                options: [
                    {
                        value: "string",
                        label: "字符串",
                    },
                    {
                        value: "number",
                        label: "数字",
                    },
                    {
                        value: "boolean",
                        label: "布尔",
                    },
                ],
            },
        ]
    }
}
