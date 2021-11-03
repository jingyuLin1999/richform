
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
    <Button
      size="small"
      type="success"
      @click="hooks.validate()"
      :style="{ 'margin-bottom': '3px' }"
      >外部校验</Button
    >
    <RichForm
      :schema="schema"
      :form="form"
      :values="values"
      :isDesign="false"
      :hooks="hooks"
      :authorization="{
        value: 'gxf16dcf98fqy3P0d324n448f3VV8abbIU9r2oY541179fd16edd17qnnw38',
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
          upload: {
            type: "array",
          },
          input: {
            title: "名称对方",
            description: "设备名称",
            type: "string",
            minLength: 5,
            widget: "input",
            default: "当我的值等于：123456时，会改变下拉选项B的选项",
            require: true,
          },
          selectMultiple: {
            type: "array",
          },
          selectA: {
            title: "下拉选框A",
            widget: "select",
            type: "string",
            default: "选项1",
          },
          selectB: {
            title: "下拉B依赖A",
            widget: "select",
            type: "string",
            minLength: 1,
          },
          selectC: {
            title: "下拉C依赖A",
            widget: "select",
            type: "string",
            minLength: 1,
          },
          radioA: {
            title: "单选框A",
            widget: "radio",
            type: "string",
            default: "单选框A",
            description: "当我的值等于：单选框B,会隐藏第一项",
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
      },
      values: {
        a: "",
        select: "",
        map: "阳新花园城",
        selectMultiple: '["选项1","选项2"]',
        enddate: "2020-12-09 18:38:54",
        rate: 4,
        imageFile: [
          "http://127.0.0.1:9000/images/0d4d19123dd04970b7d2943277200cca.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20211028%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20211028T070611Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=ee6740c7d7d1e10f3af407068ad7d42896d0baf634db83ab409c3b48c66cecb9",
        ],
        tree: "22",
      },
      form: {
        border: true, // 显示边框
        grid: true, // 表单内部栅栏
        labelSuffix: ":", // 字段标题后缀内容，默认' : '
        labelWidth: "110px", // 标签宽度,默认50px
        validator: "input", // submit
        labelAlign: "right", // 标签对齐, 默认右对齐, 可选左对齐left/center
        labelInline: true, // 字段标题显示位置, 默认true左侧left,false显示在top上方
        actions: [
          //声明显示在下方和动作按钮
          {
            name: "reset", // 按键的唯一标识符
            type: "primary", // 按键类型,默认为primary，具体可见element button
            title: "重置", // 按键的文字
            icon: "el-icon-star-off", // 按键图标 具体可见element icon
            right: true, // 如果=true，则显示在右侧
            visible: true, // 按键是否可见,同时满足readonly===false和设置为true才会显示,默认为true
            tips: "提示信息", // 鼠标悬浮在按键的提示信息
            top: true, // 是否在上面, false则在下面
            size: "medium", // medium / small / mini, 若未指明，则等同于form.size
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
          },
        ],
        layout: [
          {
            title: "级联选择器",
            widget: "cascader",
            name: "cascader",
            disabled: false,
            placeholder: "",
            filterable: true, // 搜索功能
            clearable: true,
            separator: "/", // 分隔符
            showAllLevels: false, // 结果显示所以级别如：a/b/c
            defaultProp: {
              value: "value",
              label: "bbb",
              expandTrigger: "click", // 	click / hover
              checkStrictly: true, // 父子节点不互相关联,可单选
              multiple: false, // 可通过 props.multiple = true 来开启多选模
            },
            options: [
              {
                value: "zhinan",
                bbb: "指南",
                children: [{ value: "shejiyuanze", bbb: "设计原则" }],
              },
              {
                value: "nihao",
                bbb: "你好",
              },
            ],
          },
          {
            widget: "grid",
            title: "文件上传",
            showTitle: true,
            isClicked: false,
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
                  limit: 1, // 上传限制
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
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            type: "datetime",
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
            valueFormat: "yyyy-MM-dd", // yyyy-MM-dd/timestamp 指定值的格式
            arrowControl: true,
            rangeSeparator: "至", // 选择范围时的分隔符
            startPlaceholder: "开始时间",
            endPlaceholder: "结束时间",
            pickerOptions: {},
          },
          {
            title: "拖拽列表",
            widget: "draggablelist",
            name: "draggablelist",
            default: [],
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
          {
            title: "名称对方",
            widget: "input",
            name: "input",
            type: "textarea",
            hideRely: "radioA==单选框B",
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
            title: "下拉选框A", // 优先级小于shema中定义的title
            widget: "select",
            name: "selectA",
            options: [
              {
                value: "选项1",
                label: "黄金糕",
              },
              {
                value: "选项2",
                label: "双皮奶",
              },
              {
                value: "选项3",
                label: "选项3",
              },
            ],
          },
          {
            title: "下拉选框B",
            widget: "select",
            name: "selectB",
            description: "我的选项依赖于【下拉选框A】",
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
              "selectA == 选项2": "http://localhost:8080/form-design",
              "input == 123456": [
                {
                  value: "input等于123456",
                  label: "input等于123456",
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
            title: "下拉选框C",
            widget: "select",
            name: "selectC",
            description: "我的选项依赖于【下拉选框A】",
            dict: {
              "selectA==any": { filterKey: "id" },
            },
            options: [
              {
                id: "选项1",
                value: "选项1",
                label: "黄金糕",
              },
              {
                id: "选项3",
                value: "选项3",
                label: "选项3",
              },
              {
                id: "这个不会被过滤",
                value: "选项3",
                label: "这个不会被过滤",
              },
            ],
          },
          {
            title: "触发字典过滤",
            widget: "input",
            name: "factoryid",
          },
          {
            title: "字典过滤",
            widget: "select",
            name: "dictTest",
            dict: {
              "factoryid == any":
                "http://192.168.100.11:8080/manage/dict/getWorkshopByFactoryId.do",
            },
            options: [],
          },
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
            name: "inputnumber",
            widget: "inputnumber",
            title: "计数器",
            disabled: true,
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
                {
                  title: "滑块",
                  widget: "slider",
                  name: "slider",
                  clearable: true,
                  minimum: 0,
                  maximum: 1000,
                  step: 100,
                },
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
              [],
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
                    name: "input",
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
                        name: "input",
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
          {
            name: "network",
            widget: "collapse",
            title: "信令服务器",
            expand: true,
            fields: [
              {
                title: "输入框",
                widget: "input",
                name: "input",
              },
              {
                title: "输入框",
                widget: "input",
                name: "input",
              },
            ],
          },
        ],
      },
    };
  },
  methods: {
    formAction(event) {
      console.log(event.name);
    },
  },
};
</script>

<style lang="scss">
.rich-form-app {
  padding: 10px;
}
</style>

