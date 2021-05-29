
<!-- 
@name: 表单组件
@author: ljy
@email: 1071711404@qq.com

一期目标
1、表单数据采用标准的JSON Schema
2、ajv校验
3、字段依赖关联
4、无form时，自动布局
layout下的每个obj存放每个子组件的属性
  {
        widget: "input",
        name: "mode.name",
        dict: "", // 字典url路径，优先级大于options
        options: [{},{}], // 下拉选框的选项
        default: "", // 提供默认值，优先级小于values的值
  },


二期目标
表单设计器
-->
<template>
  <form :class="['richform', form.border ? 'form-border' : '']" :id="formId">
    <perfect-scrollbar>
      <!-- 增加一些按钮 -->
      <auto-layout v-if="isAutoLayout" :schema="schema"></auto-layout>
      <form-layout
        v-else
        :schema="schema"
        :layout="form.layout"
        :values="values"
      >
      </form-layout>
      <div class="no-ready">
        <!-- <div>表单未初始化</div> -->
      </div>
      <div class="error"></div>
      <!-- 增加一些按钮 -->
    </perfect-scrollbar>
  </form>
</template>

<script>
import { PerfectScrollbar } from "vue2-perfect-scrollbar";
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";
import FormLayout from "./layout";
import AutoLayout from "./autoLayout";
import eventbus from "./utils/eventbus";
export default {
  components: { FormLayout, AutoLayout, PerfectScrollbar },
  provide() {
    return {
      form: this.form,
      schema: this.schema,
      values: this.values,
      formId: this.formId,
      isDesign: this.isDesign,
      fieldErrors: this.fieldErrors,
    };
  },
  props: {
    schema: { type: Object, require: true }, // 表单的字段描述
    values: { type: Object, default: () => ({}) }, // 表单的值
    form: { type: Object, default: () => ({}) }, // 表单布局
    isDesign: { type: Boolean, default: true }, // 是否是设计模式
  },
  data() {
    return {
      formId: Math.random().toString(15).slice(2, 15),
      fieldErrors: {}, // 字段错误信息收集
      lastClicked: {}, // 记录最后的点击事件
    };
  },
  mounted() {
    this.load();
  },
  computed: {
    // 自动布局
    isAutoLayout() {
      // return this.form.layout.length == 0;
      return false;
    },
  },
  methods: {
    load() {
      this._registerEvents();
    },
    _registerEvents() {
      eventbus.$on(`${this.formId}:field:change`, this.onFieldValueChange);
      eventbus.$on(`${this.formId}:design:clicked`, this.onDesignClicked);
    },
    _unregisterEvents() {
      eventbus.$off(`${this.formId}:field:change`);
    },
    onFieldValueChange(fieldName, value) {
      this.$set(this.values, fieldName, value);
    },
    onDesignClicked(clicked) {
      if (clicked == this.lastClicked) clicked.isClicked = !clicked.isClicked;
      else {
        // 取消上次出发的点击事件
        this.$set(this.lastClicked, "isClicked", false);
        // 设置当前点击事件
        this.$set(clicked, "isClicked", true);
      }
      this.lastClicked = clicked;
    },
  },
  beforeDestroy() {
    this._unregisterEvents();
  },
};
</script>

<style lang="scss">
@import "./vars.scss";
@import "./utils/design.scss";
.richform {
  height: 100%;
  font-size: $form-font-size;
  padding: 10px;
  .ps {
    height: 1210px;
  }
}
.form-border {
  border: 1px solid $form-border-color;
}
</style>