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
                title: "比例",
                name: "ratio",
                widget: "input",
                description: "和列数对应,中间用英文字符:隔开",
                size: "small",
                placeholder: "如： 1:1"
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
