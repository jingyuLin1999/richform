/**
 *
        predefineColors: ["#409EFF", "#f00"], // 预定义颜色
        disabled: false,
        size: "small", // 选项： medium / small / mini
        showAlpha: false,
        popperClass: "",
        colorFormat: "", //单位选项：hsl / hsv / hex / rgb 说明：写入 v-model 的颜色的格式
        defaultColor: "#1278F6",
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
                title: "单位", // 优先级小于shema中定义的title
                widget: "select",
                name: "selectMultiple",
                filterable: true,
                size: "small",
                options: [
                    {
                        value: "hsl",
                        label: "hsl",
                    },
                    {
                        value: "hsv",
                        label: "hsv",
                    },
                    {
                        value: "hex",
                        label: "hex",
                    },
                    {
                        value: "rgb",
                        label: "rgb",
                    },
                ],
            },
            {
                title: "默认颜色",
                widget: "colorpicker",
                name: "default",
                default: "#f00"
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
                            name: "showAlpha",
                            title: "透明度",
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

        ]
    }
}
