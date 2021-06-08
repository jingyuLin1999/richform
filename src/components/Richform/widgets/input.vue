<template>
  <el-input
    class="input-widget"
    v-model="value"
    :type="field.type"
    :placeholder="field.placeholder"
    :disabled="field.disabled"
    :clearable="field.clearable"
    :show-password="field.showPassword"
    :prefix-icon="field.prefixIcon"
    :suffix-icon="field.suffixIcon"
    :rows="field.rows"
    :autosize="field.autosize"
    :size="field.size"
    :maxlength="field.maxLength"
    :minlength="field.minLength"
  ></el-input>
</template>

<script>
import baseMixin from "./baseMixin";
export default {
  mixins: [baseMixin],
  methods: {
    defaultFieldAttr() {
      return {
        type: "text", // text，textarea
        placeholder: "请输入内容",
        disabled: false, // 禁用状态
        clearable: true, // 可清空
        showPassword: false, // 密码框
        prefixIcon: "", // 当type等于text有效。前置图标 el-icon-search
        suffixIcon: "", // 当type等于text有效。后置图标 el-icon-date
        rows: 4, // 当type等于textarea有效
        autosize: false, // 当type等于textarea有效。根据内容自动设置高度，也可接受一个对象 { minRows: 2, maxRows: 4}
        prepend: "", // 当type等于text有效。
        append: "", // 当type等于text有效。
        size: "", // large、small 和 mini
        maxLength: null,
        minLength: null,
      };
    },
  },
};
</script>

<style lang="scss">
.input-widget{
  width: 100%;
}
</style>