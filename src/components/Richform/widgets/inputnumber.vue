<template>
  <div class="inputnumber-widget">
    <el-input-number
      v-model="value"
      :disabled="field.disabled"
      :step="field.step"
      :min="field.min"
      :max="field.max"
      :size="field.size"
      :step-strictly="field.stepStrictly"
      :precision="field.precision"
      :controls-position="field.controlsPosition"
    ></el-input-number>
  </div>
</template>

<script>
import baseMixin from "./baseMixin";
export default {
  mixins: [baseMixin],
  methods: {
    defaultFieldAttr() {
      return {
        disabled: false,
        step: 1, // 步数
        min: undefined,
        max: undefined,
        stepStrictly: false, // 严格步数,只能输入 step 的倍数
        precision: undefined, // 精度,设置计数器最小值
        controlsPosition: "", // 按钮位置。计数器增减按钮的位置, 默认"", 可设置为 "right"
        size: "default",
      };
    },
  },
};
</script>
<style lang="scss">
</style>
