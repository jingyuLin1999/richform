<template>
  <div class="widget-slider" :id="widgetId">
    <Slider
      v-model="value"
      :disabled="field.disabled"
      :show-tooltip="field.showTooltip"
      :min="field.minimum"
      :max="field.maximum"
      :step="field.step"
      :height="field.height"
      :vertical="field.vertical"
      :show-stops="field.showStop"
      :show-input="field.showInput"
      :input-size="field.inputSize"
      :show-input-controls="field.showInputControls"
      :range="field.showRange"
      :marks="field.marks"
    ></Slider>
  </div>
</template>

<script>
import baseMixin from "./baseMixin";
import { Slider } from "element-ui";
export default {
  mixins: [baseMixin],
  components: { Slider },
  methods: {
    defaultFieldAttr() {
      return {
        disabled: false,
        showTooltip: true,
        step: 1, // 步长
        minimum: 1, // 最小值
        maximum: 10, // 最大值
        showStop: false, // 显示间断点
        showInput: false, // 是否显示输入框，仅在非范围选择时有效
        inputSize: "", // large / medium / small / mini
        showInputControls: false, // 在显示输入框的情况下，是否显示输入框的控制按钮
        showRange: false, // 是否为范围选择,此时value必须为 [2,58]
        vertical: false,
        marks: {},
        height: "200px", // vertical 为true时，必须设置高度
      };
    },
  },
};
</script>

<style lang="scss">
.widget-slider {
  width: 100%;
  padding: 0 8px;
  > .select-widget {
    width: 100%;
  }
}
</style>