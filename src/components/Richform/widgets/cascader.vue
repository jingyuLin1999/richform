<template>
  <el-cascader
    class="cascader-widget"
    v-model="value"
    :options="field.options"
    :disabled="field.disabled"
    :placeholder="field.placeholder"
    :separator="field.separator"
    :clearable="field.clearable"
    :filterable="field.filterable"
    :props="field.defaultProp"
    :show-all-levels="field.showAllLevels"
  ></el-cascader>
</template>

<script>
import baseMixin from "./baseMixin";
export default {
  mixins: [baseMixin],
  methods: {
    defaultFieldAttr() {
      return {
        disabled: false,
        placeholder: "请选择",
        filterable: true, // 搜索功能
        clearable: true,
        separator: "/", // 分隔符
        showAllLevels: true, // 结果显示所以级别如：a/b/c
        defaultProp: {
          value: "value",
          label: "label",
          expandTrigger: "hover", // 	click / hover
          checkStrictly: false, // 父子节点不互相关联
          multiple: false, // 可通过 props.multiple = true 来开启多选模
        },
      };
    },
  },
};
</script>

<style lang="scss">
.cascader-widget {
  width: 100%;
}
</style>