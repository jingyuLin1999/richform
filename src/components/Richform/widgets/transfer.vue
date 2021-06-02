<template>
  <div>
    <el-transfer
      style="display: flex; justify-content: flex-start; align-items: center"
      v-model="value"
      :data="field.options"
      :filterable="field.filterable"
      :titles="field.titles"
      :button-texts="field.buttonTexts"
    ></el-transfer>
  </div>
</template>

<script>
import baseMixin from "./baseMixin";
export default {
  name: "TransferWidget",
  mixins: [baseMixin],
  methods: {
    defaultFieldAttr() {
      return {
        placeholder: "",
        filterable: false, // 是否过滤
        titles: ["Source1", "Target"], // 标题
        buttonTexts: [], // "到左边", "到右边"
      };
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
