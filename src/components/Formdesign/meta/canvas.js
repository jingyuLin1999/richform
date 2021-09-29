/**
 *
        type: "text", // text，textarea
        placeholder: "请输入内容",
        disabled: false, // 禁用状态
        clearable: true, //
        showPassword: false, // 密码框
        prefixIcon: "", // 当type等于text有效。前置图标 el-icon-search
        suffixIcon: "", // 当type等于text有效。后置图标 el-icon-date
        rows: 4, // 当type等于textarea有效
        autosize: false, // 当type等于textarea有效。根据内容自动设置高度，也可接受一个对象 { minRows: 2, maxRows: 4}
        prepend: "", // 当type等于text有效。
        append: "", // 当type等于text有效。
        size: "", // large、small 和 mini
        maxLength: null,
        minLength: null,
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
            {
                title: "表边框",
                widget: "select",
                name: "border",
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
                title: "表栅栏",
                widget: "select",
                name: "grid",
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
                title: "对齐方式",
                widget: "select",
                name: "labelAlign",
                size: "small",
                options: [
                    {
                        value: "right",
                        label: "靠右",
                    },
                    {
                        value: "left",
                        label: "靠左",
                    }
                ],
            },
            {
                title: "标签后缀",
                widget: "input",
                name: "labelSuffix",
                size: "small",
            },
            {
                title: "标签宽度",
                widget: "input",
                name: "labelWidth",
                size: "small",
            },
            {
                title: "行显示",
                widget: "select",
                name: "labelInline",
                size: "small",
                options: [
                    { value: true, label: "是" },
                    { value: false, label: "否" }
                ],
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
        layout: []
    }
}
