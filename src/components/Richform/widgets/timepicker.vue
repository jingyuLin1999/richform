
<template>
  <div class="timepicker-widget" :id="widgetId">
    <TimePicker
      class="el-time"
      v-if="field.isPicker"
      v-model="value"
      :readonly="field.readOnly"
      :placeholder="field.placeholder"
      :disabled="field.disabled"
      :clearable="field.clearable"
      :size="field.size"
      :editable="field.editable"
      :value-format="field.valueFormat"
      :is-range="field.isRange"
      :arrow-control="field.arrowControl"
      :range-separator="field.rangeSeparator"
      :start-placeholder="field.startPlaceholder"
      :end-placeholder="field.endPlaceholder"
    ></TimePicker>
    <TimeSelect
      class="el-time"
      v-else
      v-model="value"
      :picker-options="field.pickerOptions"
      :readonly="field.readOnly"
      :placeholder="field.placeholder"
      :disabled="field.disabled"
      :clearable="field.clearable"
      :value-format="field.valueFormat"
      :size="field.size"
    ></TimeSelect>
  </div>
</template>


<script>
import baseMixin from "./baseMixin";
import { TimeSelect, TimePicker } from "element-ui";
export default {
  mixins: [baseMixin],
  components: { TimeSelect, TimePicker },
  methods: {
    defaultFieldAttr() {
      return {
        isPicker: true, // 是否为 timepicker 时间任意。timeselect固定时间，由pickerOptions设定
        readOnly: false, // 只看
        disabled: false, // 禁用
        clearable: true, // 是否显示清除按钮
        size: "medium", // medium / small / mini
        editable: false, // 文本框可输入
        placeholder: "请选择", // 单个
        valueFormat: "HH:mm:ss",
        isRange: false, // isRange下面三个有效
        arrowControl: true,
        rangeSeparator: "至", // 选择范围时的分隔符
        startPlaceholder: "开始时间",
        endPlaceholder: "结束时间",
        pickerOptions: {
          // timeselect 有效
          start: "08:30",
          step: "00:15",
          end: "18:30",
        },
      };
    },
  },
};
</script>

<style lang="scss">
.timepicker-widget {
  width: 100%;
  > .el-time {
    width: 100%;
  }
}
</style>