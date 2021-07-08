<template>
  <el-cascader
    class="cascader-widget"
    v-model="value"
    :options="field.options"
    :disabled="field.disabled"
    :separator="field.separator"
    :clearable="field.clearable"
    :filterable="field.filterable"
    :props="props"
    :show-all-levels="field.showAllLevels"
  ></el-cascader>
</template>

<script>
import baseMixin from "./baseMixin";
export default {
  mixins: [baseMixin],
  computed: {
    props() {
      let { propValue, propLabel, expandTrigger, checkStrictly, multiple } =
        this.field;
      return {
        multiple,
        expandTrigger,
        checkStrictly,
        value: propValue,
        labbel: propLabel,
      };
    },
  },
  methods: {
    defaultFieldAttr() {
      return {
        disabled: false,
        placeholder: "",
        filterable: true, // 搜索功能
        clearable: true,
        separator: "/", // 分隔符
        showAllLevels: true, // 结果显示所以级别如：a/b/c
        propValue: "value",
        propLabel: "label",
        expandTrigger: "hover", // 	click / hover
        checkStrictly: false, // 父子节点不互相关联
        multiple: false, // 可通过 props.multiple = true 来开启多选模
      };
    },
  },
};
</script>

<style>
</style>