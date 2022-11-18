import { baseForm, baseLayout } from "./base"
export const attribute = {
    schema: {
        $schema: "http://json-schema.org/draft-07/schema#",
        title: "设备属性",
        description: "A product from Acme's catalog",
        type: "object",
        properties: {
            tabs: {
                type: "array"
            }
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
                template: { label: "标签页一", fields: [] },
                attribute: {
                    label: { widget: "input", placeholder: "", editable: true },
                    name: { widget: "input", placeholder: "", editable: true },
                    value: { widget: "", placeholder: "", editable: false },
                },
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
