
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
    <!-- {{ values }} -->
    <el-button
      size="small"
      type="success"
      @click="hooks.validate()"
      :style="{ 'margin-bottom': '3px' }"
      >外部校验</el-button
    >
    <RichForm
      :schema="schema"
      :form="form"
      :values="values"
      :isDesign="false"
      :hooks="hooks"
    ></RichForm>
    <textarea v-model="values.select"></textarea>
  </div>
</template>

<script>
import RichForm from "../components/Richform";
export default {
  components: { RichForm },
  data() {
    return {
      hooks: {},
      schema: {
        $schema: "http://json-schema.org/draft-07/schema#",
        title: "设备属性",
        description: "A product from Acme's catalog",
        type: "object",
        properties: {
          input: {
            title: "名称对方",
            description: "设备名称",
            type: "string",
            minLength: 5,
            widget: "input",
            default: "当我的值等于：123456时，会改变下拉选项B的选项",
            require: true,
          },
          selectA: {
            title: "下拉选框A",
            widget: "select",
            type: "string",
            default: "双皮奶",
          },
          selectB: {
            title: "下拉B依赖A",
            widget: "select",
            type: "string",
            default: "双皮奶",
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
          transfer: {
            title: "穿梭框",
            widget: "transfer",
            type: "array",
          },
        },
      },
      values: {
        a: "",
        select: "",
        map: "阳光",
      },
      form: {
        border: true, // 显示边框
        grid: false, // 表单内部栅栏
        labelSuffix: true, // 字段标题后缀内容，默认' : '
        labelWidth: "110px", // 标签宽度,默认50px
        validator: "input", // submit
        labelAlign: "right", // 标签对齐, 默认右对齐, 可选左对齐left
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
            title: "名称对方",
            widget: "input",
            name: "input",
            type: "textarea",
            hideRely: "radioA==单选框A",
          },
          {
            title: "百度地图",
            widget: "map",
            name: "map",
            description: "todo  错误Cannot set property 'pj' of undefined",
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
              "selectA == 选项2": "http://localhost:8080/#/form-design",
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
            widget: "radio",
            title: "单选",
            name: "radioA",
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
  methods: {},
};
</script>

<style lang="scss">
.rich-form-app {
  padding: 10px;
}
</style>

