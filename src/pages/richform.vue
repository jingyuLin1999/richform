
<!-- 
@name: 表单组件
@author: ljy
@email: 1071711404@qq.com

名词解释：
schema是对字段的描述，包括依赖关系，但是依赖关系可能是

一期目标
1、表单数据采用标准的JSON Schema
2、ajv校验
3、字段依赖关联
4、无layout时，自动布局


二期目标 
表单设计器
-->
<template>
  <div class="rich-form-app">
    {{ values }}
    <br />
    <Button type="info" size="small" @click="onSetValues">赋值values</Button>
    <Button type="primary" size="small" @click="changeTheme">改变主题</Button>
    <Button type="success" size="small" @click="hooks.validate()"
      >外部校验</Button
    >
    <Button type="danger" size="small" @click="onHidden">触发隐藏</Button>
    <RichForm
      :schema="schema"
      :form="form"
      :values="values"
      :isDesign="false"
      :hooks="hooks"
      :authorization="{
        value: '21f16dcf98j09x40d3248448fE5J8abbtrE631n6K7179fd16edd17161Tgf',
      }"
      @action="formAction"
    ></RichForm>
  </div>
</template>

<script>
import { Button } from "element-ui";
import RichForm from "../components/Richform";
export default {
  components: { RichForm, Button },
  data() {
    return {
      hooks: {},
      schema: {
        $schema: "http://json-schema.org/draft-07/schema#",
        title: "设备属性",
        description: "A product from Acme's catalog",
        type: "object",
        properties: {
          inputTypeSwitch: {
            type: "number",
          },
          // cascader: {
          //   type: "array", //number
          // },
          upload: {
            type: "array",
          },
          enddate: {
            type: "string",
            minLength: 1,
            require: true,
          },
          input: {
            title: "对方名称",
            description: "设备名称",
            type: "string",
            minLength: 1,
            widget: "input",
            default: "当我的值等于：123456时，会改变下拉选项B的选项",
            require: true,
          },
          selectMultiple: {
            type: "string",
          },
          selectA: {
            type: "string",
            minLength: 1,
            require: true,
            // default: "选项1",
          },
          product_code: {
            type: "string",
            require: true,
          },
          selectC: {
            type: "string",
            minLength: 1,
          },
          radioA: {
            title: "单选框A",
            type: "string",
            default: "单选框A",
          },
          radioB: {
            title: "单选框B",
            widget: "radio",
            type: "string",
            default: "单选框B",
          },
          inputnumber: {
            title: "计数器",
            widget: "inputnumber",
          },
          switch: {
            title: "开关",
            widget: "switch",
          },
          slider: {
            type: "number",
            title: "滑块",
            widget: "slider",
            description: "滑块测试",
          },
          radioNumber: {
            type: "number",
            default: 1,
          },
          mode: {
            type: "object",
            properties: {
              name: {
                type: "string",
                minLength: 5,
                default: "E6201",
                title: "型号",
              },
              value: {
                type: "number",
                default: 1,
                title: "数量",
                enum: [1, 2, 3, 4, 5, 6, 7],
              },
            },
          },
        },
        errorMessage: {
          // 自定义信息
          properties: {
            intB: "必须大于数字A，这是自定义错误信息",
          },
        },
        if: {
          properties: { selectA: { const: "选项2" } },
        },
        then: {
          properties: {
            product_code: {
              type: "string",
              minLength: 1,
              require: true,
            },
            selectB: {
              type: "string",
              minLength: 1,
              require: true,
            },
          },
        },
      },
      values: {
        // cascader: 4,
        a: "",
        select: "",
        map: "阳新花园城",
        selectMultiple: `["选项1", "选项2"]`,
        rate: 4,
        imageFile: [
          "http://192.168.100.12:9000/images/178a383967db4bc48bcf790282d5f19f.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20211210%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20211210T013328Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=7592596bef4cdb51eab88ea7713e7e423c23d21f8d822b8d9639f5917bbdb75a",
        ],
        tree: "22",
        radioA: "radioA",
        selectA: "选项1",
        datetimepicker: ["2022-05-05 00:00:00", "2022-05-20 00:00:00"],
        selectB: "选项1",
      },
      form: {
        border: true, // 显示边框
        grid: true, // 表单内部栅栏
        labelSuffix: ":", // 字段标题后缀内容，默认' : '
        labelWidth: "110px", // 标签宽度,默认50px
        validator: "input", // submit
        labelAlign: "right", // 标签对齐, 默认右对齐, 可选左对齐left/center
        labelInline: true, // 字段标题显示位置, 默认true左侧left,false显示在top上方
        colors: {
          // theme: "#121B2C",
          // fontColor: "#F8F4F4",
          // btnColor: "#F8F4F4",
          // btnBgColor: "#040C19",
          // activeColor: "#4F9FFE",
          // dateRangeBgColor: "#999",
          // multiOptionBgColor: "#ddd",
        }, // 颜色
        actions: [
          //声明显示在下方和动作按钮
          {
            name: "reset1", // 按键的唯一标识符
            type: "primary", // 按键类型,默认为primary，具体可见element button
            title: "重置", // 按键的文字
            icon: "el-icon-star-off", // 按键图标 具体可见element icon
            right: true, // 如果=true，则显示在右侧
            visible: true, // 按键是否可见,同时满足readonly===false和设置为true才会显示,默认为true
            tips: "提示信息", // 鼠标悬浮在按键的提示信息
            top: true, // 是否在上面, false则在下面
            size: "medium", // medium / small / mini, 若未指明，则等同于form.size
            loading: false,
          },
          {
            name: "submit", // 按键的唯一标识符
            type: "info", // 按键类型,默认为primary，具体可见element button
            title: "提交", // 按键的文字
            icon: "", // 按键图标 具体可见element icon
            right: true, // 如果=true，则显示在右侧
            visible: true, // 按键是否可见,同时满足readonly===false和设置为true才会显示,默认为true
            tips: "提示信息", // 鼠标悬浮在按键的提示信息
            top: true, // 是否在上面, false则在下面
            size: "medium", // medium / small / mini, 若未指明，则等同于form.size
            loading: false,
          },
        ],
        layout: [
          {
            widget: "expression",
            name: "expression",
            title: "表达式",
            key: {
              options: [
                { label: "姓名", value: "name" },
                { label: "年龄", value: "age" },
                { label: "身高", value: "height" },
                { label: "爱好", value: "like" },
                { label: "头发", value: "hair" },
                { label: "鞋子", value: "shoes" },
                { label: "皮肤", value: "skin" },
              ],
            },
            val: {
              options: [{ label: "123", value: "123" }],
            },
          },
          {
            widget: "button",
            name: "button",
            title: "按钮",
            showTitle: false,
            type: "primary",
            size: "small",
            isGroup: true,
            options: [
              {
                title: "按钮一",
                type: "success", // primary / success / warning / danger / info / text
                disabled: false,
                loading: false,
                style: {},
                isGroup: false,
                size: "small",
                round: false,
                plain: false,
                circle: false,
                leftIcon: "",
                rightIcon: "",
              },
              {
                title: "按钮二",
                type: "warning",
                disabled: false,
                loading: false,
                style: {},
                isGroup: false,
                size: "small",
                round: false,
                plain: false,
                circle: false,
                leftIcon: "",
                rightIcon: "",
              },
            ],
          },
          {
            widget: "icon",
            title: "图标",
            name: "icon",
            size: "small",
            default: "el-icon-platform-eleme",
          },
          {
            widget: "radio",
            title: "单选数字",
            name: "radioNumber",
            isGroup: true,
            isButton: true,
            disabled: false,
            border: true,
            size: "small",
            textColor: "#fff",
            fill: "#409EFF",
            options: [
              {
                name: "1",
                title: "Number1",
                disabled: false,
                border: false,
                size: "default",
              },
              {
                name: "2",
                title: "Number2",
                disabled: false,
                border: false,
                size: "default",
              },
              {
                name: "3",
                title: "Number3",
                disabled: false,
                border: false,
                size: "default",
              },
            ],
          },
          {
            title: "input类型转换",
            name: "inputTypeSwitch",
            widget: "input",
            placeholder: "只能输入数字",
            description: "在schema中type定义的是number,注意看值的变化",
          },
          {
            widget: "grid",
            title: "regExp属性例子",
            showTitle: true,
            isClicked: false,
            flexWrap: true,
            ratio: "1:3",
            fields: [
              [
                {
                  title: "数字A",
                  name: "intA",
                  widget: "inputnumber",
                  regExp: [{ exp: "exclusiveMaximum", relyName: "intB" }],
                },
              ],
              [
                {
                  title: "数字B",
                  name: "intB",
                  widget: "inputnumber",
                  description: "我的校验规则是值大于【数字A】",
                  regExp: [{ exp: "exclusiveMinimum", relyName: "intA" }],
                  hideRely: ["radioA==radioA"],
                },
              ],
            ],
          },
          {
            widget: "tabs",
            title: "依赖关系例子",
            enabled: true,
            tabs: [
              {
                label: "选项依赖",
                name: "optonRelyon",
                icon: "",
                fields: [
                  {
                    title: "下拉选框A", // 优先级小于shema中定义的title
                    widget: "select",
                    name: "selectA",
                    clearable: true,
                    // filter: { key: "isdelete", value: 1 },
                    options: [
                      {
                        value: "选项1",
                        label: "黄金糕",
                        isdelete: 1,
                      },
                      {
                        value: "选项2",
                        label: "双皮奶",
                        isdelete: 0,
                      },
                      {
                        value: "选项3",
                        label: "蚵仔煎",
                        isdelete: 0,
                      },
                    ],
                  },
                  {
                    title: "下拉选框C",
                    widget: "select",
                    name: "selectC",
                    description: "我的选项依赖于【下拉选框A】等于黄金糕",
                    dict: {
                      "selectA==any": { filterKey: "macCtrlTypeId" },
                    },
                    options: [
                      {
                        macCtrlTypeId: "选项1",
                        value: "选项1",
                        label: "黄金糕",
                      },
                      {
                        macCtrlTypeId: "选项3",
                        value: "选项3",
                        label: "选项3",
                      },
                      {
                        macCtrlTypeId: "这个不会被过滤",
                        value: "选项3",
                        label: "这个不会被过滤",
                      },
                    ],
                  },
                  {
                    title: "下拉选框D",
                    widget: "select",
                    name: "selectD",
                    clearable: true,
                    description: "我的选项依赖于【下拉选框A】等于黄金糕",
                    dict: {
                      "selectA==any": { filterKey: "macCtrlTypeId" },
                    },
                    options: [
                      {
                        macCtrlTypeId: "选项1",
                        value: "选项1",
                        label: "黄金糕",
                      },
                      {
                        macCtrlTypeId: "选项3",
                        value: "选项3",
                        label: "选项3",
                      },
                      {
                        macCtrlTypeId: "这个不会被过滤",
                        value: "选项3",
                        label: "这个不会被过滤",
                      },
                    ],
                  },
                  {
                    title: "下拉选框B",
                    widget: "select",
                    name: "selectB",
                    description:
                      "我的选项依赖于【下拉选框A】等于黄金糕。且在等于该值时会触发验证规则",
                    dict: {
                      "selectA==选项1": [
                        {
                          value: "选项1",
                          label: "根据[下拉选框A]的值变化A",
                        },
                        {
                          value: "选项2",
                          label: "根据[下拉选框A]的值变化B",
                        },
                      ],
                      // "selectA == 选项2": "http://localhost:8080/form-design",
                      "selectA == 选项2": [
                        {
                          value: "选项1",
                          label: "根据[下拉选框A]选项1,的值变化A",
                        },
                      ],
                      "selectA==选项3": [
                        {
                          value: "测试默认值是否会被清空",
                          label: "测试默认值是否会被清空",
                        },
                      ],
                      "input == 123456": [
                        {
                          value: "【对方名称】等于123456",
                          label: "【对方名称】等于123456",
                        },
                      ],
                    },
                    options: [
                      {
                        value: "选项1",
                        label: "黄金糕",
                      },
                      {
                        value: "选项2",
                        label: "双皮奶",
                      },
                    ],
                  },
                  {
                    title: "触发字典过滤",
                    widget: "input",
                    name: "product_code",
                    prefixIcon: "el-icon-search",
                    prepend: "D", // 当type等于text有效
                    append: "KB",
                    description: "C42G-YN-CNC2-1",
                    showError: false,
                    hideRely: ["selectA==选项1"],
                  },
                  {
                    title: "字典过滤",
                    widget: "select",
                    name: "dictUrl",
                    defaultOption: 0, // 当字典从服务器加载后默认选中的选项下标
                    dictConfig: {
                      method: "post",
                      respProp: "data",
                      params: {}, // 一些固定的过滤参数
                      pickValues: ["map"],
                    },
                    dict: {
                      "product_code == any":
                        "http://192.168.100.217:8899/ae_cnc/chk_detect/getProGroupList",
                    },
                    options: [],
                  },
                ],
              },
              {
                label: "隐藏依赖",
                name: "hideRelyon",
                icon: "",
                fields: [
                  {
                    widget: "radio",
                    title: "单选",
                    name: "radioA",
                    isGroup: true,
                    isButton: true,
                    disabled: false,
                    border: true,
                    size: "small",
                    textColor: "#fff",
                    fill: "#409EFF",
                    description:
                      "1、当我的值等于 单选框B 时会触发【对方名称】隐藏。2、注意看action触发的console.log()",
                    options: [
                      {
                        name: "radioA",
                        title: "单选框A",
                        disabled: false,
                        border: false,
                        size: "default",
                      },
                      {
                        name: "radioB",
                        title: "单选框B",
                        disabled: false,
                        border: false,
                        size: "default",
                      },
                      {
                        name: "radioC",
                        title: "单选框C",
                        disabled: false,
                        border: false,
                        size: "default",
                      },
                    ],
                  },
                  {
                    title: "被依赖",
                    widget: "input",
                    name: "beHide",
                    type: "text",
                    placeholder: "当我等于 hello 时会触发【对方名称】隐藏",
                    description: "当我等于 hello 时会触发【对方名称】隐藏",
                  },
                  {
                    title: "对方名称",
                    widget: "input",
                    name: "input",
                    type: "text",
                    hideRely: [
                      "radioA == radioC",
                      "radioA==radioB",
                      "beHide == hello",
                    ],
                  },
                  {
                    title: "I LOVE YOU",
                    widget: "input",
                    name: "iloveyou",
                    type: "text",
                    hideRely: ["radioA==radioB"],
                  },
                ],
              },
            ],
          },
          {
            title: "级联选择器",
            widget: "cascader",
            name: "cascader",
            disabled: false,
            placeholder: "",
            isLeaf: true, // 只获取最后一级
            filterable: true, // 搜索功能
            clearable: true,
            separator: "/", // 分隔符
            showAllLevels: false, // 结果显示所以级别如：a/b/c
            collapseTags: true,
            defaultProp: {
              value: "value",
              label: "bbb",
              parentId: "parentId", // parentId必须有
              children: "children",
              expandTrigger: "click", // 	click / hover
              checkStrictly: false, // 父子节点不互相关联,可单选
              multiple: true, // 可通过 props.multiple = true 来开启多选模
            },
            options: [
              // 可两种类型，一种是树结构，一种是扁平数据，具体如下：
              // parentId字段必须有
              { value: "jk", bbb: "bb0", parentId: "0" },
              { value: "bb1", bbb: "bb1", parentId: "jk" },
              { value: "bb2", bbb: "bb2", parentId: "jk" },
              { value: "ff", bbb: "bb11", parentId: "0" },
              { value: "f20", bbb: "f20", parentId: "ff" },
              { value: "f60", bbb: "f60", parentId: "ff" },
              // {
              //   value: 1,
              //   bbb: "指南",
              //   parentId: "0",
              //   children: [
              //     {
              //       value: 2,
              //       bbb: "设计原则",
              //       parentId: "1",
              //       children: [
              //         {
              //           value: 3,
              //           bbb: "严格要求",
              //           parentId: "2",
              //         },
              //       ],
              //     },
              //     { value: 4, bbb: "卡车", parentId: "1" },
              //   ],
              // },
              // {
              //   value: 5,
              //   bbb: "你好",
              //   parentId: "0",
              //   children: [
              //     { value: 6, bbb: "测试1", parentId: "5" },
              //     { value: 7, bbb: "测试2", parentId: "5" },
              //   ],
              // },
            ],
          },
          {
            widget: "grid",
            title: "文件上传",
            showTitle: true,
            isClicked: false,
            flexWrap: true,
            fields: [
              [
                {
                  title: "上传",
                  widget: "upload",
                  name: "imageFile",
                  tips: "提示语句", // 提示
                  listType: "text", // 可选 text/picture/picture-card
                  actions: "http://127.0.0.1:8080/manage/minio/upload.do", // 上传路径
                  deleteUrl: "http://127.0.0.1:8080/manage/minio/removeFile.do", // 删除路径
                  draggable: true, // 是否可拖拽
                  multiple: true, // 多选
                  autoUpload: true, // 是否在选取文件后立即进行上传
                  limit: 2, // 上传限制
                  disabled: false,
                  showFileList: true, // 是否显示已上传文件列表
                  mapValues: {
                    // 将服务器返回值映射到values对应字段
                    originalFilename: "filename", // 返回字段 value字段
                    fileSize: "filesize",
                  },
                },
                {
                  title: "文件名",
                  name: "filename",
                  widget: "input",
                },
                {
                  title: "文件大小",
                  name: "filesize",
                  widget: "input",
                },
              ],
            ],
          },
          {
            title: "结束日期",
            name: "enddate",
            widget: "datetimepicker",
            pickerOptions: {},
            format: "yyyy 年 MM 月 dd 日",
            valueFormat: "yyyy-MM-dd",
            type: "datetime",
            // 当前日期
            default:
              new Date().getFullYear() +
              "-" +
              (new Date().getMonth() + 1) +
              "-" +
              new Date().getDate(),
          },
          {
            title: "日期选择器",
            widget: "datetimepicker",
            name: "datetimepicker",
            type: "datetimerange", // year/month/date/dates/ week/datetime/datetimerange/ daterange/monthrange
            readOnly: false,
            disabled: false,
            clearable: true, // 是否显示清除按钮
            size: "", // medium / small / mini
            editable: false, // 文本框可输入
            placeholder: "请选择", // 单个
            format: "", // 显示的格式,注意和type配套
            valueFormat: "yyyy-MM-dd HH:mm:ss", // yyyy-MM-dd/timestamp 指定值的格式
            arrowControl: true,
            rangeSeparator: "至", // 选择范围时的分隔符
            startPlaceholder: "开始时间",
            endPlaceholder: "结束时间",
            mapValues: ["starttime", "endtime"],
            forceType: "null",
            pickerOptions: {
              disabledDate(time) {
                return false;
              },
              shortcuts: null,
            },
            hideRely: ["hours == 3", "hours == 5"],
          },
          {
            widget: "select",
            name: "hours",
            title: "时间段",
            clearable: true,
            forceType: "null",
            options: [
              { label: "3小时", value: 3 },
              { label: "5小时", value: 5 },
            ],
          },
          {
            title: "拖拽列表",
            widget: "draggablelist",
            name: "draggablelist",
            default: [],
            template: { label: "", value: "" },
            strAttr: {
              // 当template: "",时有效
              widget: "expression", // 或 input
              key: {
                options: [
                  { label: "姓名", value: "name" },
                  { label: "年龄", value: "age" },
                  { label: "身高", value: "height" },
                  { label: "爱好", value: "like" },
                  { label: "头发", value: "hair" },
                  { label: "鞋子", value: "shoes" },
                  { label: "皮肤", value: "skin" },
                ],
              },
              val: {
                options: [{ label: "123", value: "123" }],
              },
            },
          },
          {
            title: "Ip输入框",
            widget: "ipinput",
            name: "ipinput",
          },
          {
            title: "时间选择器",
            widget: "timepicker",
            name: "timepicker",
          },
          {
            title: "评分",
            widget: "rate",
            name: "rate",
          },
          {
            title: "颜色选择器",
            widget: "colorpicker",
            name: "colorpicker",
          },
          {
            title: "复选框",
            name: "checkbox",
            widget: "checkbox",
            showTitle: true,
            readOnly: false,
            disabled: false,
            isGroup: true,
            isButton: false,
            chooseAll: true,
            size: "medium",
            max: 10000,
            min: 0,
            default: [],
            textColor: "#ff0000", // isButton为true或border为true有效
            fill: "#0f0", // isButton为true或border为true有效
            options: [
              {
                name: "checkboxA",
                title: "复选框A",
                disabled: false,
                border: false,
              },
              {
                name: "checkboxB",
                title: "复选框B",
                disabled: false,
                border: false,
              },
              {
                name: "checkboxC",
                title: "复选框C",
                disabled: false,
                border: false,
                defaultColor: "#f00",
              },
            ],
          },
          {
            title: "树结构", // 树
            widget: "tree",
            name: "tree",
            isShowCheckbox: false,
            onlyCheckedKeys: true,
            nodeKey: "value",
            options: [
              {
                id: 1,
                value: "11",
                label: "一级 1",
                children: [
                  {
                    id: 2,
                    value: "22",
                    label: "二级 1-1",
                  },
                ],
              },
              {
                id: 3,
                value: "33",
                label: "三级 1-1-1",
              },
            ],
          },
          {
            title: "自定义插槽",
            widget: "slot",
            name: "slot",
            html: "<a href='#'>richform你好</a><br>123",
          },
          // {
          //   title: "百度地图",
          //   widget: "map",
          //   name: "map",
          //   description: "todo  错误Cannot set property 'pj' of undefined",
          // },
          {
            title: "下拉选框多选", // 优先级小于shema中定义的title
            widget: "select",
            name: "selectMultiple",
            multiple: true,
            filterable: true,
            clearable: true,
            dict: {
              "inputnumber == 2": [
                {
                  value: "选项1",
                  label: "黄金糕12",
                },
              ],
            },
            options: [
              {
                value: "选项1",
                label: "黄金糕",
              },
              {
                value: "选项2",
                label: "双皮奶",
              },
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
            size: "default",
          },
          {
            name: "switch",
            title: "开关",
            widget: "switch",
            disabled: false,
            width: 40, // 宽度
            activeColor: "#13ce66", // 激活背景颜色
            inactiveColor: "#ff4949", // 取消背景颜色
            activeText: "路飞", // 激活文本
            inactiveText: "索隆", // 取消文本
            activeValue: true, // 打开的值，支持Boolean, String或Number
            inactiveValue: false, // 关闭的值，支持Boolean, String或Number
            activeIconClass: "",
            inactiveIconClass: "",
          },
          {
            widget: "slider",
            name: "slider", // 对应的schema键值,必选,唯一
            title: "滑块",
            clearable: true,
            minimum: 0,
            maximum: 1000,
            step: 100,
          },
          {
            title: "穿梭框",
            name: "transfer",
            widget: "transfer",
            titles: ["Source1", "Target"], // 标题
            default: [],
            options: [
              {
                key: 1,
                label: `备选项1`,
              },
              {
                key: 2,
                label: `备选项2`,
              },
            ],
          },
          {
            widget: "grid",
            title: "栅格布局",
            showTitle: true,
            isClicked: false,
            flexWrap: true,
            fields: [
              [
                {
                  title: "开关",
                  widget: "switch",
                  name: "switch",
                  disabled: false,
                  width: 40, // 宽度
                  activeColor: "#13ce66", // 激活背景颜色
                  inactiveColor: "#ff4949", // 取消背景颜色
                  activeText: "路飞", // 激活文本
                  inactiveText: "索隆", // 取消文本
                  activeValue: true, // 打开的值，支持Boolean, String或Number
                  inactiveValue: false, // 关闭的值，支持Boolean, String或Number
                  activeIconClass: "",
                  inactiveIconClass: "",
                },
              ],
              [
                {
                  title: "滑块",
                  widget: "slider",
                  name: "slider",
                  clearable: true,
                  minimum: 0,
                  maximum: 1000,
                  step: 100,
                },
              ],
              [
                {
                  title: "滑块",
                  widget: "slider",
                  name: "slider",
                  clearable: true,
                  minimum: 0,
                  maximum: 1000,
                  step: 100,
                },
              ],
            ],
          },
          {
            widget: "tabs",
            title: "网络配置",
            enabled: true,
            tabs: [
              {
                label: "标签页一",
                name: "a",
                icon: "",
                fields: [
                  {
                    title: "输入框",
                    widget: "input",
                    name: "netinput",
                  },
                  {
                    name: "network",
                    widget: "collapse",
                    title: "信令服务器",
                    expand: true,
                    actions: [
                      {
                        name: "hello", // 按键的唯一标识符
                        type: "success", // 按键类型,默认为primary，具体可见element button
                        title: "提交", // 按键的文字
                        icon: "", // 按键图标 具体可见element icon
                        right: true, // 如果=true，则显示在右侧
                        visible: true, // 按键是否可见,同时满足readonly===false和设置为true才会显示,默认为true
                        tips: "提示信息", // 鼠标悬浮在按键的提示信息
                        top: false, // 是否在上面, false则在下面
                        size: "medium", // medium / small / mini, 若未指明，则等同于form.size
                        loading: false,
                      },
                    ],
                    fields: [
                      {
                        title: "单选",
                        widget: "radio",
                        name: "radioB",
                        isGroup: true,
                        isButton: false,
                        disabled: false,
                        border: true,
                        size: "default",
                        textColor: "#f00",
                        fill: "#00f",
                        default: "radioA",
                        options: [
                          {
                            name: "radioA",
                            title: "单选框A",
                            disabled: false,
                            border: false,
                            size: "default",
                          },
                          {
                            name: "radioB",
                            title: "单选框B",
                            disabled: false,
                            border: false,
                            size: "default",
                          },
                        ],
                      },
                      {
                        title: "输入框",
                        widget: "input",
                        name: "networkInput",
                      },
                    ],
                  },
                ],
              },
              {
                label: "标签页二",
                name: "b",
                icon: "",
                fields: [
                  {
                    widget: "input",
                    name: "selectA",
                    title: "输入框13",
                  },
                ],
              },
            ],
          },
        ],
      },
    };
  },
  methods: {
    formAction(event) {
      event.loading = true;
      console.log(event);
    },
    onSetValues() {
      // 手动赋值values，是否会重新派发隐藏和下拉选项
      this.$set(this.values, "selectA", "选项2");
    },
    onHidden() {
      this.$set(this.values, "radioA", "radioB");
    },
    changeTheme() {
      this.form.colors = {
        theme: "#121B2C",
        fontColor: "#F8F4F4",
        btnColor: "#F8F4F4",
        btnBgColor: "#040C19",
        activeColor: "#4F9FFE",
        dateRangeBgColor: "#999",
        multiOptionBgColor: "#ddd",
      };
    },
  },
};
</script>

<style lang="scss">
.rich-form-app {
  padding: 10px;
}
</style>

