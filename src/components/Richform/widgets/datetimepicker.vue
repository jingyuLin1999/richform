<template>
  <div :id="widgetId" class="date-picker-widget">
    <DatePicker
      v-model="value"
      :type="field.type"
      :readonly="field.readOnly"
      :placeholder="field.placeholder"
      :disabled="field.disabled"
      :clearable="field.clearable"
      :size="field.size"
      :editable="field.editable"
      :format="field.format"
      :value-format="field.valueFormat"
      :arrow-control="field.arrowControl"
      :range-separator="field.rangeSeparator"
      :start-placeholder="field.startPlaceholder"
      :end-placeholder="field.endPlaceholder"
      :picker-options="field.pickerOptions"
      :style="{ width: '100%' }"
    ></DatePicker>
  </div>
</template>

<script>
import baseMixin from "./baseMixin";
import { DatePicker } from "element-ui";
export default {
  name: "dataPickerWidget",
  mixins: [baseMixin],
  components: { DatePicker },
  methods: {
    defaultFieldAttr() {
      return {
        isNeedValidate: false, // 该widget不需要要验证，非属性
        type: "date", // year/month/date/dates/ week/datetime/datetimerange/ daterange/monthrange
        readOnly: false,
        disabled: false,
        clearable: true, // 是否显示清除按钮
        size: "medium", // medium / small / mini
        editable: false, // 文本框可输入
        placeholder: "请选择", // 单个
        format: "", // 显示的格式 yyyy 年 MM 月 dd 日
        valueFormat: "timestamp", // yyyy-MM-dd/timestamp 指定值的格式
        arrowControl: true,
        rangeSeparator: "至", // 选择范围时的分隔符
        startPlaceholder: "开始时间",
        endPlaceholder: "结束时间",
        pickerOptions: {
          // 带有快捷键
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [
            {
              text: "今天",
              onClick(picker) {
                picker.$emit("pick", new Date());
              },
            },
            {
              text: "昨天",
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                picker.$emit("pick", date);
              },
            },
            {
              text: "一周前",
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", date);
              },
            },
          ],
        },
      };
    },
    friendValue() {
      let value = this.values[this.field.name];
      if (typeof value == "string") value = new Date(value);
      return value;
    },
  },
};
</script>

<style lang="scss" scoped>
.date-picker-widget {
  width: 100%;
}
</style>
