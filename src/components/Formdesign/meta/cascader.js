/**
 *
    disabled: false,
    placeholder: "",
    filterable: true, // 搜索功能
    clearable: true,
    separator: "/", // 分隔符
    showAllLevels: true, // 结果显示所以级别如：a/b/c
    propValue: "value",
    propLabel: "label",
    expandTrigger: "hover", // 	click / hover
    checkStrictly: false, // 父子节点不互相关联
    multiple: false, // 可通过 props.multiple = true 来开启多选模
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
                title: "触发方式",
                widget: "select",
                name: "expandTrigger",
                size: "small",
                options: [
                    {
                        value: "hover",
                        label: "悬停",
                    },
                    {
                        value: "click ",
                        label: "点击",
                    },
                ],
            },
            {
                title: "标签键值",
                widget: "input",
                name: "propLabel",
                size: "small"
            },
            {
                title: "值键值",
                widget: "input",
                name: "propValue",
                size: "small"
            },
            {
                widget: "grid",
                title: "栅格布局",
                showTitle: false,
                isClicked: false,
                fields: [
                    [
                        {
                            name: "clearable",
                            title: "可清空",
                            widget: "switch",
                            width: 40, // 宽度
                            activeColor: "#13ce66", // 激活背景颜色
                            inactiveColor: "#ccc", // 取消背景颜色
                            activeValue: true, // 打开的值，支持Boolean, String或Number
                            inactiveValue: false, // 关闭的值，支持Boolean, String或Number
                        },
                        {
                            name: "filterable",
                            title: "过滤",
                            widget: "switch",
                            width: 40, // 宽度
                            activeColor: "#13ce66", // 激活背景颜色
                            inactiveColor: "#ccc", // 取消背景颜色
                            activeValue: true, // 打开的值，支持Boolean, String或Number
                            inactiveValue: false, // 关闭的值，支持Boolean, String或Number
                        },
                        {
                            name: "multiple",
                            title: "多选",
                            widget: "switch",
                            width: 40, // 宽度
                            activeColor: "#13ce66", // 激活背景颜色
                            inactiveColor: "#ccc", // 取消背景颜色
                            activeValue: true, // 打开的值，支持Boolean, String或Number
                            inactiveValue: false, // 关闭的值，支持Boolean, String或Number
                        }
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
                        {
                            name: "showAllLevels",
                            title: "所有级别",
                            widget: "switch",
                            width: 40, // 宽度
                            activeColor: "#13ce66", // 激活背景颜色
                            inactiveColor: "#ccc", // 取消背景颜色
                            activeValue: true, // 打开的值，支持Boolean, String或Number
                            inactiveValue: false, // 关闭的值，支持Boolean, String或Number
                        },
                        {
                            name: "checkStrictly",
                            title: "严格模式",
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
            {
                title: "分隔符",
                widget: "input",
                name: "separator",
                size: "small",
                hideRely: "showAllLevels==false",
            },
            {
                title: "数据配置",
                widget: "tree",
                name: "options",
                addSibling: true,
                editable: true,
                deletable: true,
                addable: true,
                draggable: true, // 开启拖拽
                isShowIcon: false,
                showAddTemplate: true,
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
