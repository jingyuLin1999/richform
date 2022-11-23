
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
  <div class="richform-deep-value">
    所有值：{{ values }}<br />
    脏值：{{ hooks.dirtyValues }}<br />
    <Button size="small" type="primary" @click="onAddValues">新增values</Button>
    <Button size="small" type="warning" @click="changeValue">改变values</Button>
    <Button size="small" type="success" @click="hooks.reset()"
      >重置values</Button
    >
    <Button size="small" type="danger" @click="hooks.validate()"
      >外部校验</Button
    >
    <br />

    <RichForm
      :schema="schema"
      :form="form"
      :values="values"
      :isDesign="false"
      :hooks="hooks"
      deepValues
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
      hooks: {
        dirtyValues: {},
      },
      schema: {
        $schema: "http://json-schema.org/draft-07/schema#",
        title: "设备属性",
        description: "A product from Acme's catalog",
        type: "object",
        properties: {
          title: {
            type: "object",
            properties: {
              text: {
                type: "string",
                minLength: 20,
              },
              hello: {
                type: "string",
                minLength: 6,
              },
            },
            // required: ["text"],
          },
        },
      },
      values: {
        title: {
          text: "ECharts 入门示例",
          subtext: "Living Expenses in Shenzhen",
          hello: "",
        },
      },
      form: {
        border: true, // 显示边框
        grid: false, // 表单内部栅栏
        labelSuffix: ":", // 字段标题后缀内容，默认' : '
        labelWidth: "110px", // 标签宽度,默认50px
        validator: "input", // submit
        labelAlign: "right", // 标签对齐, 默认右对齐, 可选左对齐left
        labelInline: true, // 字段标题显示位置, 默认true左侧left,false显示在top上方
        actions: [],
        layout: [
          {
            title: "你好",
            widget: "select",
            name: "title.hello",
            options: [
              { label: "nihao", value: "nihao" },
              { label: "richform", value: "richform" },
            ],
          },
          {
            title: "richform",
            widget: "select",
            name: "title.richform",
            description: "我的选项依赖于【你好】",
            dict: {
              "title.hello == nihao": [
                {
                  value: "nihaoOption",
                  label: "nihaoOption",
                },
              ],
              "title.hello == richform": [
                {
                  value: "richformOption",
                  label: "richformOption",
                },
              ],
            },
            options: [],
          },
          {
            title: "主标题",
            widget: "input",
            name: "title.text",
            require: true,
          },
          {
            title: "副标题",
            widget: "input",
            name: "title.subtext",
            require: true,
            hideRely: ["title.hello==nihao"],
            description: "当你好等于nihao时，我隐藏",
          },
          {
            widget: "grid",
            title: "deepValues模式regExp例子",
            showTitle: true,
            isClicked: false,
            flexWrap: true,
            fields: [
              [
                {
                  title: "数字A",
                  name: "title.intA",
                  widget: "inputnumber",
                  min: -9999,
                  regExp: [{ exp: "exclusiveMaximum", relyName: "title.intB" }],
                },
              ],
              [
                {
                  title: "数字B",
                  name: "title.intB",
                  widget: "inputnumber",
                  description: "我的校验规则是值大于【数字A】",
                  regExp: [{ exp: "exclusiveMinimum", relyName: "title.intA" }],
                },
              ],
            ],
          },
          {
            title: "字典URL",
            widget: "select",
            name: "title.dictUrl",
            defaultOption: 0,
            dictConfig: {
              method: "post",
              respProp: "data",
              params: {}, // 一些固定的过滤参数
              pickValues: ["title.text"],
            },
            description: "当【你好】的值改变，就发起请求",
            dict: {
              "title.hello == any":
                "http://192.168.100.217:8899/ae_cnc/chk_detect/getProGroupList",
            },
            options: [],
          },
        ],
      },
    };
  },
  methods: {
    onAddValues() {
      this.$set(this.$data, "values", {
        title: {
          hello: "nihao",
          text: "ECharts 入门示例",
          subtext: "Living Expenses in Shenzhen",
        },
      });
    },
    changeValue() {
      this.$set(this.$data, "values", {
        title: {
          hello: "richform",
          text: "ECharts 入门示例123",
          subtext: "Liv88888",
        },
      });
    },
  },
};
</script>

<style lang="scss">
.richform-deep-value {
  padding: 10px;
  overflow: auto;
}
</style>

