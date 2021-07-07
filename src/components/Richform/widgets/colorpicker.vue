<template>
  <el-color-picker
    class="widget-colorpicker"
    v-model="value"
    :disabled="field.disabled"
    :show-alpha="field.showAlpha"
    :color-format="field.colorFormat"
    :size="field.size"
    :predefine="field.predefineColors"
  ></el-color-picker>
</template>

<script>
import baseMixin from "./baseMixin";
export default {
  mixins: [baseMixin],
  data() {
    return {
      checkAll: false,
      isIndeterminate: true,
    };
  },
  methods: {
    defaultFieldAttr() {
      return {
        predefineColors: ["#409EFF", "#f00"], // 预定义颜色
        disabled: false,
        size: "small", // 选项： medium / small / mini
        showAlpha: false,
        popperClass: "",
        colorFormat: "", //单位选项：hsl / hsv / hex / rgb 说明：写入 v-model 的颜色的格式
        default: "#1278F6",
      };
    },
  },
};
</script>