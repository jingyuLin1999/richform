import { baseForm, baseLayout } from "./base"
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
                title: "字体大小",
                widget: "input",
                name: "fontSize",
                size: "small"
            },
        ],
    }
}

export const rules = {
    schema: {},
    values: {},
    form: {
        ...baseForm,
        layout: []
    }
}
