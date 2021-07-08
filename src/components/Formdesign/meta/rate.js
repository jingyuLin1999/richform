/**
 *
        disabled: false,
        colors: ["#99A9BF", "#F7BA2A", "#FF9900"], // 等同于 { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' }
        showText: false,
        texts: ["极差", "失望", "一般", "满意", "惊喜"], // 1、showText为true有效 2、数组长度要和max对应
        showScore: false, // texts优先级大于texts
        textColor: "#ff9900", // 字体颜色
        max: 5, // 最大分值，即有几个星星
        allowHalf: false, // 是否允许半选
        scoreTemplate: `${this.value}`, // 显示模板，优先级大于value，默认等于value
        lowThreshold: 2,
        highThreshold: 4,
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
                name: "max",
                title: "最大分值",
                widget: "inputnumber",
            },
            {
                name: "showText",
                title: "显示文本",
                widget: "switch",
                width: 40, // 宽度
                activeColor: "#13ce66", // 激活背景颜色
                inactiveColor: "#ccc", // 取消背景颜色
                activeValue: true, // 打开的值，支持Boolean, String或Number
                inactiveValue: false, // 关闭的值，支持Boolean, String或Number
            },
            {
                title: "选项",
                widget: "draggablelist",
                name: "texts",
                template: "",
                default: [],
                hideRely: "showText==false",
                description: "个数和最大分值对应"
            },
            {
                widget: "grid",
                title: "栅格布局",
                showTitle: false,
                isClicked: false,
                fields: [
                    [
                        {
                            name: "allowHalf",
                            title: "半选",
                            widget: "switch",
                            width: 40, // 宽度
                            activeColor: "#13ce66", // 激活背景颜色
                            inactiveColor: "#ccc", // 取消背景颜色
                            activeValue: true, // 打开的值，支持Boolean, String或Number
                            inactiveValue: false, // 关闭的值，支持Boolean, String或Number
                        },
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
