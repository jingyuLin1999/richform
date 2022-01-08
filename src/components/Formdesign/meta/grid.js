import { baseForm, baseLayout } from "./base"
export const attribute = {
    schema: {

    },
    values: {
        ratio: "1:1:1"
    },
    form: {
        ...baseForm,
        layout: [
            ...baseLayout,
            {
                title: "比例",
                name: "ratio",
                widget: "input",
                description: "和列数对应,中间用英文字符:隔开",
                size: "small",
            },
            {
                title: "列数",
                name: "fields",
                widget: "draggablelist",
                template: []
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
