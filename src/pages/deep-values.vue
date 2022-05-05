
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
    <Button size="small" type="success" @click="onAddValues">新增values</Button>
    <Button size="small" type="warning" @click="changeValue">改变values</Button>
    <Button size="small" type="success" @click="hooks.reset()">重置</Button>
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
        properties: {},
      },
      values: {
        title: {
          text: "ECharts 入门示例",
          subtext: "Living Expenses in Shenzhen",
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
            name: "hello",
            options: [
              { label: "nihao", value: "hello" },
              { label: "richform", value: "richform" },
            ],
          },
          {
            title: "主标题",
            widget: "input",
            name: "title.text",
          },
          {
            title: "副标题",
            widget: "input",
            name: "title.subtext",
          },
        ],
      },
    };
  },
  methods: {
    onAddValues() {
      this.$set(this.$data, "values", {
        hello: "hello",
        title: {
          text: "ECharts 入门示例",
          subtext: "Living Expenses in Shenzhen",
        },
      });
    },
    changeValue() {
      this.$set(this.$data, "values", {
        hello: "hello",
        title: {
          text: "ECharts 入门示例123",
          subtext: "Liv88888",
        },
      });
    },
  },
};
</script>

<style lang="scss">
.rich-form-app {
  padding: 10px;
}
</style>

