export const layout = [ // 布局模板数据
    {
        widget: "grid",
        title: "栅格布局",
        showTitle: false,
        isClicked: false,
        fields: [[]],
        ratio: "",
    },

    {
        layoutId: "2",
        title: "标签页",
        widget: "tabs",
        inline: false,
        isClicked: false,
        tabs: [
            {
                label: "标签页一",
                name: "1",
                icon: "",
                fields: []
            }
        ]
    },
    {
        layoutId: "3",
        title: "折叠面板",
        expand: true,
        widget: "collapse",
        isClicked: false,
        fields: []
    }
]

export const widgets = [
    {
        id: "1",
        title: "输入框",
        widget: "input",
        name: "input",
        hideRely: [],
    },
    {
        title: "下拉选框", // 优先级小于shema中定义的title
        widget: "select",
        name: "select",
        options: [],
        hideRely: [],
    },
    {

        title: "单选",
        widget: "radio",
        name: "radio",
        isGroup: true,
        isButton: false,
        disabled: false,
        border: true,
        size: "small",
        fill: "#409EFF",
        textColor: "#fff",
        hideRely: [],
        options: [
            {
                title: "选项A",
                name: "optionA",
                disabled: false,
                border: false,
                size: "default",
            },
            {
                title: "选项B",
                name: "optionB",
                disabled: false,
                border: false,
                size: "default",
            },
        ],
    },
    {
        title: "复选框",
        name: "checkbox",
        widget: "checkbox",
        readOnly: false,
        disabled: false,
        isGroup: true,
        isButton: false,
        chooseAll: true,
        size: "medium",
        max: 10000,
        min: 0,
        default: [],
        hideRely: [],
        options: [
            {
                title: "复选框A",
                name: "checkboxA",
                disabled: false,
                border: false,
            },
            {
                title: "复选框B",
                name: "checkboxB",
                disabled: false,
                border: false,
            }
        ],
    },
    {
        name: "inputnumber",
        widget: "inputnumber",
        title: "计数器",
        disabled: false,
        step: 1, // 步数
        min: undefined,
        max: undefined,
        stepStrictly: false, // 严格步数,只能输入 step 的倍数
        precision: undefined, // 精度,设置计数器最小值
        controlsPosition: "", // 按钮位置。计数器增减按钮的位置, 默认"", 可设置为 "right"
        hideRely: [],
    },
    {
        name: "switch",
        title: "开关",
        widget: "switch",
        disabled: false,
        width: 40, // 宽度
        activeColor: "#13ce66", // 激活背景颜色
        inactiveColor: "#ccc", // 取消背景颜色
        activeText: "路飞", // 激活文本
        inactiveText: "索隆", // 取消文本
        activeValue: 1, // 打开的值，支持Boolean, String或Number
        inactiveValue: 2, // 关闭的值，支持Boolean, String或Number
        activeIconClass: "",
        inactiveIconClass: "",
        hideRely: [],
    },
    {
        widget: "slider",
        name: "slider", // 对应的schema键值,必选,唯一
        title: "滑块",
        clearable: true,
        minimum: 0,
        maximum: 1000,
        step: 1,
        hideRely: [],
    },
    {
        title: "颜色选择器",
        widget: "colorpicker",
        name: "colorpicker",
        hideRely: [],
    },
    {
        title: "评分",
        widget: "rate",
        name: "rate",
        hideRely: [],
    },
    {
        title: "穿梭框",
        name: "transfer",
        widget: "transfer",
        default: [],
        hideRely: [],
        options: [
            {
                label: `备选项1`,
                key: 1,
            },
            {
                label: `备选项2`,
                key: 2,
            },
        ],
    },
    {
        title: "时间选择器",
        widget: "timepicker",
        name: "timepicker",
        hideRely: [],
    },
    {
        title: "日期选择器",
        widget: "datetimepicker",
        name: "datetimepicker",
        type: "daterange", // year/month/date/dates/ week/datetime/datetimerange/ daterange/monthrange
        readOnly: false,
        disabled: false,
        clearable: true, // 是否显示清除按钮
        size: "", // medium / small / mini
        editable: false, // 文本框可输入
        placeholder: "请选择", // 单个
        format: "", // 显示的格式,注意和type配套
        valueFormat: "yyyy-MM-dd", // yyyy-MM-dd/timestamp 指定值的格式
        arrowControl: true,
        rangeSeparator: "至", // 选择范围时的分隔符
        startPlaceholder: "开始时间",
        endPlaceholder: "结束时间",
        pickerOptions: {},
        hideRely: [],
    },
    {
        title: "级联选择器",
        widget: "cascader",
        name: "cascader",
        disabled: false,
        placeholder: "",
        filterable: true, // 搜索功能
        clearable: true,
        separator: "/", // 分隔符
        showAllLevels: true, // 结果显示所以级别如：a/b/c
        propValue: "value",
        propLabel: "label",
        expandTrigger: "hover", // 	click / hover
        checkStrictly: false,
        multiple: false, // 可通过 props.multiple = true 来开启多选模
        hideRely: [],
        options: [
            {
                id: "zhinan",
                value: "zhinan",
                label: "指南",
                children: [
                    { id: "shejiyuanze", value: "shejiyuanze", label: "设计原则" },
                    { id: 'collapse', value: "collapse", label: '折叠面板' }
                ],
            },
        ],
    },
    {
        title: "自定义文本",
        widget: "slot",
        name: "slot",
        html: "你好，我是自定义文本",
        hideRely: [],
    },
    {
        title: "IP输入框",
        widget: "ipinput",
        hideRely: [],
    },
    {
        title: "上传",
        widget: "upload",
        name: "imageFile",
        tips: "", // 提示
        listType: "picture-card", // 可选 text/picture/picture-card
        actions: "http://127.0.0.1:8080/manage/minio/upload.do", // 上传路径
        deleteUrl: "http://127.0.0.1:8080/manage/minio/removeFile.do", // 删除路径
        draggable: true, // 是否可拖拽
        multiple: true, // 多选
        autoUpload: true, // 是否在选取文件后立即进行上传
        limit: 3, // 上传限制
        disabled: false,
        showFileList: true, // 是否显示已上传文件列表
        hideRely: [],
    },
    {
        title: "图标",
        widget: "icon",
        name: "icon",
        size: "small",
        disabled: false,
        fontSize: "13px",
        hideRely: [],
    },
    {
        title: "按钮",
        name: "button",
        widget: "button",
        showTitle: false,
        type: "default", // primary / success / warning / danger / info / text
        disabled: false,
        loading: false,
        style: {},
        size: "default",
        round: false,
        plain: false,
        circle: false,
        leftIcon: "",
        rightIcon: "",
        isGroup: false,
        options: [],
        hideRely: [],
    },
]


