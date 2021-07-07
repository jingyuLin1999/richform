/**
        disabled: false,
        step: 1, // 步数
        min: undefined,
        max: undefined,
        stepStrictly: false, // 严格步数,只能输入 step 的倍数
        precision: undefined, // 精度,设置计数器最小值
        controlsPosition: "", // 按钮位置。计数器增减按钮的位置, 默认"", 可设置为 "right"
        size: "",
 */

import { baseForm, baseLayout } from "./base";

export const attribute = {
    values: {
        step: 1,
        min: 0,
        max: 256,
        disabled: false,
    },
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
                title: "按钮位置",
                widget: "select",
                name: "controlsPosition",
                size: "small",
                options: [
                    {
                        value: "",
                        label: "默认",
                    },
                    {
                        value: "right",
                        label: "右边",
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
                    },
                ],
            },
            {
                name: "step",
                title: "步经",
                widget: "inputnumber",
                step: 1,
                controlsPosition: "",
                size: "small",
            },
            {
                name: "min",
                title: "最小",
                widget: "inputnumber",
                step: 1,
                controlsPosition: "",
                size: "small",
            },
            {
                name: "max",
                title: "最大",
                widget: "inputnumber",
                step: 1,
                controlsPosition: "",
                size: "small",
            },
            // {
            //     name: "stepStrictly",
            //     title: "严格步经",
            //     widget: "switch",
            //     description: "只能输入 步经 的倍数"
            // },
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
            },
        ]
    }
}