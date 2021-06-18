
<!-- 
@name: 表单组件
@author: ljy
@email: 1071711404@qq.com

一期目标
1、校验规则采用标准的JsonSchema，用ajv校验
2、字段依赖关联
3、无form时，自动布局
4、hooks外部钩子
  {
    validate  校验函数
  }
5、layout下的每个obj存放每个子组件的属性
  {
        widget: "input", // 当无schema时有效，和schema重复,
        title: "输入框", // 当无schema时有效，和schema重复,
        name: "mode.name",
        dict: "", // 字典url路径，优先级大于options,获取到的数据最终赋值给options
        options: [{},{}], // 下拉选框的选项
        default: "", // 提供默认值，优先级小于values的值
  },

字典说明
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
    <perfect-scrollbar :style="{ 'min-height': '120px' }">
      <!-- 顶部按钮 -->
      <actions :actions="topActions" :isDesign="isDesign"></actions>
      <!-- 核心布局 -->
      <form-layout
        :schema="schema"
        :layout="friendForm.layout"
        :values="values"
        :isDesign="isDesign"
        :form="form"
        :fieldErrors="fieldErrors"
      >
      </form-layout>
      <!-- 底部按钮 -->
      <actions :actions="buttomActions" :isDesign="isDesign"></actions>
      <!-- 错误信息 -->
      <div class="no-ready" v-if="noReady()">
        <div>表单未初始化</div>
      </div>
    </perfect-scrollbar>
  </form>
</template>

<script>
import Actions from "./actions";
import FormLayout from "./layout";
import AutoLayout from "./autoLayout";
import eventbus from "./utils/eventbus";
import { defaultForm } from "./utils/defaultData";
import CommonMixin from "./utils/commonMixin";
import { PerfectScrollbar } from "vue2-perfect-scrollbar";
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";
import AJV, { localize as localizeErrors } from "./utils/validator";

export default {
  mixins: [CommonMixin],
  components: { FormLayout, AutoLayout, PerfectScrollbar, Actions },
  props: {
    schema: { type: Object, default: () => ({}) }, // 表单的字段描述
    values: { type: Object, default: () => ({}) }, // 表单的值
    form: { type: Object, default: () => ({}) }, // 表单布局
    isDesign: { type: Boolean, default: false }, // 是否是设计模式
    hooks: { type: Object, default: () => ({}) }, // 钩子，挂载一些函数或数据供外部使用
  },
  provide() {
    return {
      formId: this.formId,
      dependencies: this.dependencies,
      requireds: this.requireds,
    };
  },
  data() {
    return {
      formId: Math.random().toString(15).slice(2, 15),
      fieldErrors: {}, // 字段错误信息收集
      dependencies: {}, // 字段相互依赖信息
      lastClicked: {}, // 记录最后的点击事件，用于取消事件
      defaultForm,
      requireds: [], // 收集必须字段
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
    friendForm() {
      return Object.assign({}, this.defaultForm, this.form);
    },
    topActions() {
      if (!this.form.actions) return [];
      return this.form.actions.filter((actionItem) => actionItem.top);
    },
    buttomActions() {
      if (!this.form.actions) return [];
      return this.form.actions.filter((actionItem) => !actionItem.top);
    },
  },
  methods: {
    load() {
      this._registerEvents();
      this.initHooks();
    },
    initHooks() {
      this.hooks.validate = this.globalValidate;
    },
    noReady() {
      return Object.keys(this.form).length == 0;
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
      eventbus.$on(`${this.formId}:action`, this.onAction);
    },
    onAction(action) {
      if (action.name == "submit" && !this.globalValidate()) return;
      else if (action.name == "reset") {
        for (let key in this.values) {
          let type = Array.isArray(this.values[key])
            ? "array"
            : typeof this.values[key];
          // 子组件用v-model监听的是computed的值
          // 为了触发computed的set属性，需删除再赋值
          this.$delete(this.values, key);
          this.$set(this.values, key, this.friendValue(type));
        }
        return;
      }
      this.$emit("action", action); // 外部可获取当前点击了哪个事件
    },
    // 全局校验
    globalValidate() {
      const _this = this;
      this.fieldErrors = {};
      this.schema.required = this.requireds;
      let valid = AJV.validate(this.schema, this.values);
      if (!valid) {
        localizeErrors(AJV.errors); // 将错误信息转化成中文
        AJV.errors.map((errorItem) => {
          let fieldName = errorItem.dataPath
            .split(".")
            .slice(1, errorItem.dataPath.length)
            .join(".");
          _this.$set(_this.fieldErrors, fieldName, errorItem.message);
        });
      }
      return valid;
    },
    // 注销eventbus
    _unregisterEvents() {
      eventbus.$off(`${this.formId}:field:change`);
      eventbus.$off(`${this.formId}:design:clicked`);
      eventbus.$off(`${this.formId}:action`);
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