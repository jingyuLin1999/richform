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
            // {
            //     title: "前置内容",
            //     name: "prepend",
            //     size: "small",
            //     widget: "input"
            // },
            // {
            //     title: "后置内容",
            //     name: "append",
            //     size: "small",
            //     widget: "input"
            // },
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
