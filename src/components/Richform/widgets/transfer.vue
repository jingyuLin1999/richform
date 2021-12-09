<template>
  <div :id="widgetId">
    <Transfer
      style="
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
      "
      v-model="value"
      :data="field.options"
      :filterable="field.filterable"
      :titles="field.titles"
      :button-texts="field.buttonTexts"
    ></Transfer>
  </div>
</template>

<script>
import baseMixin from "./baseMixin";
import { Transfer } from "element-ui";
export default {
  name: "TransferWidget",
  components: { Transfer },
  mixins: [baseMixin],
  beforeMount() {
    window.addEventListener("resize", this.resizeHandler);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeHandler);
  },
  methods: {
    defaultFieldAttr() {
      return {
        placeholder: "",
        filterable: false, // 是否过滤
        titles: ["Source1", "Target"], // 标题
        buttonTexts: [], // "到左边", "到右边"
      };
    },
    resizeHandler() {
      this.getWidgetHeight();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
