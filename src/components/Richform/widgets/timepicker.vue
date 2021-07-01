
<template>
  <div class="timepicker-widget">
    <el-time-picker
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
    ></el-time-picker>
    <el-time-select
      v-else
      v-model="value"
      :picker-options="field.pickerOptions"
      :readonly="field.readOnly"
      :placeholder="field.placeholder"
      :disabled="field.disabled"
      :clearable="field.clearable"
      :value-format="field.valueFormat"
      :size="field.size"
    ></el-time-select>
  </div>
</template>


<script>
import baseMixin from "./baseMixin";
export default {
  mixins: [baseMixin],
  methods: {
    defaultFieldAttr() {
      return {
        isPicker: false, // 是否为 timepicker 时间任意。timeselect固定时间，由pickerOptions设定
        readOnly: false,
        disabled: false,
        clearable: true, // 是否显示清除按钮
        size: "", // medium / small / mini
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