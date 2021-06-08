
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
        widget: "input", // 当无schema时有效，和schema重复,
        title: "输入框", // 当无schema时有效，和schema重复,
        name: "mode.name",
        dict: "", // 字典url路径，优先级大于options,获取到的数据最终赋值给options
        options: [{},{}], // 下拉选框的选项
        default: "", // 提供默认值，优先级小于values的值
  },

dict说明
1、当两个select的选项互相依赖时，箭值为条件，值可以有两种形式，若是url则获取数据，若是数组则直接赋值给options
dict: "http://localhost:8080/#/form-design",
dict: {
  [<字段名name> == 'A']: "https://shandawang.com/dict/province", // 字典，
  [<字段名name> == 'B']: [{},{}], // 
}
2、

二期目标
表单设计器
-->
<template>
  <form :class="['richform', form.border ? 'form-border' : '']" :id="formId">
    <!-- {{ form }} -->
    <perfect-scrollbar :style="{ 'min-height': '150px' }">
      <!-- 增加一些按钮 -->
      <!-- <auto-layout v-else-if="isAutoLayout" :schema="schema"></auto-layout> -->
      <form-layout
        :schema="schema"
        :layout="form.layout"
        :values="values"
        :isDesign="isDesign"
        :form="form"
      >
        <!-- <div class="no-ready" v-if="noReady()">
          <div>表单未初始化</div>
        </div> -->
      </form-layout>
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
  props: {
    schema: { type: Object, default: () => ({}) }, // 表单的字段描述
    values: { type: Object, default: () => ({}) }, // 表单的值
    form: { type: Object, default: () => ({}) }, // 表单布局
    isDesign: { type: Boolean, default: false }, // 是否是设计模式
  },
  provide() {
    return {
      formId: this.formId,
      fieldErrors: this.fieldErrors,
      dependencies: this.dependencies,
    };
  },
  data() {
    return {
      formId: Math.random().toString(15).slice(2, 15),
      fieldErrors: {}, // 字段错误信息收集
      dependencies: {}, // 字段相互依赖信息
      lastClicked: {}, // 记录最后的点击事件，用于取消事件
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
    noReady() {
      return (
        Object.keys(this.schema).length == 0 &&
        Object.keys(this.form).length == 0
      );
    },
    onFieldValueChange(fieldName, value) {
      this.$set(this.values, fieldName, value);
    },
    onDesignClicked(clicked) {
      if (!this.isDesign) return;
      if (clicked == this.lastClicked) {
        clicked.isClicked = !clicked.isClicked;
        clicked.activeDesign = !clicked.activeDesign;
      } else {
        // 取消上次出发的点击事件
        this.$set(this.lastClicked, "isClicked", false);
        this.$set(this.lastClicked, "activeDesign", false);
        // 设置当前点击事件
        this.$set(clicked, "isClicked", true);
        this.$set(clicked, "activeDesign", true);
      }
      this.lastClicked = clicked;
      // 表单设计器
      this.$emit("designItem", clicked);
    },
    _registerEvents() {
      eventbus.$on(`${this.formId}:field:change`, this.onFieldValueChange);
      eventbus.$on(`${this.formId}:design:clicked`, this.onDesignClicked);
    },
    _unregisterEvents() {
      eventbus.$off(`${this.formId}:field:change`);
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
  .ps {
    // height: 800px;
  }
  .no-ready {
    width: 100%;
    height: 100%;
    color: $color;
    font-size: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.form-border {
  padding: 10px;
  border: 1px solid $form-border-color;
}
</style>