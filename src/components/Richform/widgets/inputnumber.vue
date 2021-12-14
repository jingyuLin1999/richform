<template>
  <div class="inputnumber-widget" :id="widgetId">
    <InputNumber
      v-model="value"
      style="width: 100%"
      :disabled="field.disabled"
      :step="field.step"
      :min="field.min"
      :max="field.max"
      :size="field.size"
      :step-strictly="field.stepStrictly"
      :precision="field.precision"
      :controls-position="field.controlsPosition"
    ></InputNumber>
  </div>
</template>

<script>
import baseMixin from "./baseMixin";
import { InputNumber } from "element-ui";
export default {
  mixins: [baseMixin],
  components: { InputNumber },
  methods: {
    defaultFieldAttr() {
      return {
        disabled: false,
        step: 1, // 步数
        min: 0,
        max: 255,
        stepStrictly: false, // 严格步数,只能输入 step 的倍数
        precision: undefined, // 精度,设置计数器最小值
        controlsPosition: "", // 按钮位置。计数器增减按钮的位置, 默认"", 可设置为 "right"
        size: "medium",
      };
    },
  },
};
</script>
<style lang="scss">
.inputnumber-widget {
  width: 100%;
}
</style>
