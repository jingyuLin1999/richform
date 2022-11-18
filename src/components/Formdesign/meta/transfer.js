/**
 *
        placeholder: "",
        filterable: false, // 是否过滤
        titles: ["Source1", "Target"], // 标题
        buttonTexts: [], // "到左边", "到右边"
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
                name: "filterable",
                title: "过滤",
                widget: "switch",
                width: 40, // 宽度
                activeColor: "#13ce66", // 激活背景颜色
                inactiveColor: "#ccc", // 取消背景颜色
                activeValue: true, // 打开的值，支持Boolean, String或Number
                inactiveValue: false, // 关闭的值，支持Boolean, String或Number
            },
            {
                title: "标题",
                widget: "draggablelist",
                name: "titles",
                template: "",
                default: [],
            },
            {
                title: "选项",
                widget: "draggablelist",
                name: "options",
                template: { label: "", key: "" },
                attribute: {
                    label: { widget: "input", placeholder: "", editable: true },
                    key: { widget: "input", placeholder: "", editable: true },
                    value: { widget: "", placeholder: "", editable: false },
                },
                default: [],
            },
            {
                title: "按钮",
                widget: "draggablelist",
                name: "buttonTexts",
                template: "",
                default: [],
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
