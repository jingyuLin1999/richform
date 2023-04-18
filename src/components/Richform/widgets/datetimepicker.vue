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
  watch: {
    "colors.theme": {
      handler(theme) {
        this.$nextTick(() => {
          let elements = document.querySelectorAll(`#${this.widgetId} input`);
          for (let index = 0; index < elements.length; index++) {
            let item = elements[index];
            if (item) item.setAttribute("style", `background:${theme};`);
          }
        });
      },
      immediate: true,
    },
  },
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
        mapValues: [], // 如果是时间范围,则values会生成starttime->范围下标0，endtime两个字段->范围下标1   如：["starttime", "endtime"]
        pickerOptions: {
          // 限制范围
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          // 带有快捷键
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
      let { name, type, mapValues } = this.field;
      let rangeType = ["datetimerange", "daterange", "monthrange"];
      let value = this.values[name];
      // 初始化有默认值，需要手动生成mapValues的对应值
      if (
        rangeType.includes(type) &&
        Array.isArray(value) &&
        mapValues.length > 0
      ) {
        this.values[mapValues[0]] = value[0];
        this.values[mapValues[1]] = value[1];
      } else if (
        // 清空值则对应的mapValues值也要同步清空
        rangeType.includes(type) &&
        value == null &&
        mapValues.length > 0
      ) {
        this.values[mapValues[0]] = "";
        this.values[mapValues[1]] = "";
      }

      return value;
    },
    beforeChange(val) {
      let mapValues = this.field.mapValues;
      if (Array.isArray(val) && mapValues.length == 2) {
        this.values[mapValues[0]] = val[0];
        this.values[mapValues[1]] = val[1];
      }
      return val;
    },
  },
};
</script>

<style lang="scss">
.date-picker-widget {
  width: 100%;
  // .el-input__inner {
  //   width: 100%;
  // }
}
</style>
