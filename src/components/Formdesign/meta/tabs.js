import { baseForm, baseLayout } from "./base"
export const attribute = {
    schema: {
        tabs: {
            type: "array"
        }
    },
    values: {

    },
    form: {
        ...baseForm,
        layout: [
            {
                idKey: "name",
                title: "标签",
                name: "tabs",
                widget: "draggablelist",
                editKeys: ["label", "name"],
                template: { label: "标签页一" }
            },
        ],
    }
}

export const rules = {
    schema: {},
    values: {},
    form: {
        ...baseForm
    }
}
