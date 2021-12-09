<template>
  <div :id="widgetId">
    <el-switch
      class="switch-widget"
      v-model="value"
      :width="field.width"
      :disabled="field.disabled"
      :active-color="field.activeColor"
      :inactive-color="field.inactiveColor"
      :active-text="field.activeText"
      :inactive-text="field.inactiveText"
      :active-value="field.activeValue"
      :inactive-value="field.inactiveValue"
      :active-icon-class="field.activeIconClass"
      :inactive-icon-class="field.inactiveIconClass"
    ></el-switch>
  </div>
</template>

<script>
import baseMixin from "./baseMixin";
import { Switch as elSwitch } from "element-ui";
export default {
  mixins: [baseMixin],
  components: { elSwitch },
  methods: {
    defaultFieldAttr() {
      return {
        disabled: false,
        width: 40, // 宽度
        activeColor: "#13ce66", // 激活背景颜色
        inactiveColor: "#ff4949", // 取消背景颜色
        activeText: "", // 激活文本
        inactiveText: "", // 取消文本
        activeValue: true, // 打开的值，支持Boolean, String或Number
        inactiveValue: false, // 关闭的值，支持Boolean, String或Number
        activeIconClass: "",
        inactiveIconClass: "",
      };
    },
  },
};
</script>

<style lang="scss">
.select-widget-wrapper {
  width: 100%;
  > .select-widget {
    width: 100%;
  }
}
</style>