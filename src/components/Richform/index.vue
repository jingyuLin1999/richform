
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
        hideRely: <字段名称name> == 'A', // 显示
        dict: "", // 字典url路径，优先级大于options,获取到的数据最终赋值给options
        options: [{},{}], // 下拉选框的选项
        default: "", // 提供默认值，优先级小于values的值
  },

字典说明
1、当两个select的选项互相依赖时，箭值为条件，值可以有两种形式，若是url则获取数据，若是数组则直接赋值给options
dict: "http://localhost:8080/#/form-design",
dict: {
  [<字段名name> == 'A']: "https://shandawang.com/dict/province", // 字典，
  [<字段名name> == 'B']: [{},{}], // options
  [<字段名name> == 'any']: "https://shandawang.com/dict/province", // 若等于any，<字段名name>的值只要变化，就会带上<字段名name>值到后端过滤获取字典
}
隐藏说明
hideRely：<字段名称name> == 'A'



二期目标
表单设计器


-->
<template>
  <form
    :class="[
      'richform',
      form.border ? 'richform-border' : '',
      form.activeDesign && isDesign ? 'active-form-design' : '',
    ]"
    :id="formId"
  >
    <!-- 画布遮罩，用于全局点击事件 -->
    <div class="canvas-mask" @click="onClickCanvas"></div>
    <perfect-scrollbar :style="{ 'min-height': '120px' }">
      <!-- 顶部按钮 -->
      <actions
        v-if="showBtns"
        :actions="topActions"
        :isDesign="isDesign"
      ></actions>
      <!-- 核心布局 -->
      <form-layout
        :schema="schema"
        :layout="friendForm.layout"
        :values="richValues"
        :isDesign="isDesign"
        :form="form"
        :fieldErrors="fieldErrors"
        :hideFields="hideFields"
      >
      </form-layout>
      <!-- 底部按钮 -->
      <actions
        v-if="showBtns"
        :actions="buttomActions"
        :isDesign="isDesign"
      ></actions>
      <!-- 错误信息 -->
      <div class="no-ready" v-if="noReady()">
        <div>表单未初始化</div>
      </div>
    </perfect-scrollbar>
  </form>
</template>

<script>
import { hasPath } from "ramda";
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
  name: "RichForm",
  mixins: [CommonMixin],
  components: { FormLayout, AutoLayout, PerfectScrollbar, Actions },
  props: {
    schema: { type: Object, default: () => ({}) }, // 表单的字段描述
    values: { type: Object, default: () => ({}) }, // 表单的值
    form: { type: Object, default: () => ({}) }, // 表单布局
    isDesign: { type: Boolean, default: false }, // 是否是设计模式
    hooks: { type: Object, default: () => ({}) }, // 钩子，挂载一些函数或数据供外部使用
    showBtns: { type: Boolean, default: true }, // 是否显示按钮
    deepValues: { type: Boolean, default: false }, // 值是否开启深度编辑模式
    isFriendValue: { type: Boolean, default: true }, // 值是否是友好模式，开启这种方法会改变引用地址，若需要转换类型，需要在shema中指明要转换的数据类型
  },
  provide() {
    return {
      formId: this.formId, // 表单id
      dependencies: this.dependencies,
      requireds: this.requireds,
      isFriendValue: this.isFriendValue,
      isDeepValues: this.deepValues,
      realyValues: this.values, // 开启deepValues时richValues返回的实际是rubbishyValues值,在field无法根据values赋初值，故需传入
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
      hideFields: {}, // 收集隐藏的字段
      dirtyValues: {}, // 脏值即values中有变化的键值对
      rubbishyValues: {}, // 垃圾值
    };
  },
  mounted() {
    this.load();
  },
  computed: {
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
    richValues() {
      return this.deepValues ? this.rubbishyValues : this.values;
    },
  },
  methods: {
    load() {
      this._registerEvents();
      this.initHooks();
    },
    initHooks() {
      this.hooks.validate = this.globalValidate;
      this.hooks.reset = this.onReset;
    },
    noReady() {
      return Object.keys(this.form).length == 0;
    },
    onFieldValueChange(fieldName, value) {
      try {
        // 若是deepValues需要values进行赋值
        if (this.deepValues) {
          let valueKeys = fieldName.split(".");
          let checkPath = hasPath(valueKeys, this.values);
          if (checkPath)
            eval("this.values" + "['" + valueKeys.join("']['") + "'] = value"); // TODO 防止注入
        }
        // handle bug 实际值已经更新，但dom没有变化
        this.$delete(this.richValues, fieldName);
        this.$set(this.richValues, fieldName, value);
      } catch (e) {
        console.warn("全局设置值出错：" + e);
      }
    },
    // 设计模式点击事件
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
      // to表单设计器
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
        this.onReset();
        return;
      }
      this.$emit("action", action); // 外部可获取当前点击了哪个事件
    },
    onReset() {
      for (let key in this.richValues) {
        let type = Array.isArray(this.richValues[key])
          ? "array"
          : this.richValues[key] == null
          ? "null"
          : typeof this.richValues[key];
        // 子组件用v-model监听的是computed的值
        // 为了触发computed的set属性，需删除再赋值
        this.$delete(this.richValues, key);
        this.$set(this.richValues, key, this.friendDefaultValue(type));
      }
    },
    // 全局校验
    globalValidate() {
      // 未传入schema，无法校验，直接返回
      if (!Object.keys(this.schema).length) return true;
      // 开始校验
      const _this = this;
      this.fieldErrors = {};
      this.schema.required = this.requireds;
      let valid = AJV.validate(this.schema, this.richValues);
      if (!valid) {
        localizeErrors(AJV.errors); // 将错误信息转化成中文
        console.error("全局校验失败：" + AJV.errors);
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
    // 画布全局设置
    onClickCanvas() {
      this.form.widget = "canvas";
      this.onDesignClicked(this.form);
    },
  },
  beforeDestroy() {
    this.rubbishyValues = {};
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
  position: relative;
  .ps {
    // height: 800px;
  }
  > .canvas-mask {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
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
.richform-border {
  padding: 10px;
  border: 1px solid $form-border-color;
}
.active-form-design{
  border: 1px solid $active-border-color;
}
</style>