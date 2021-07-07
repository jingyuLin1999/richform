<template>
  <div class="checkbox-widget">
    <!-- 单个复选框 -->
    <el-checkbox
      v-if="!field.isGroup"
      v-model="value"
      :border="field.border"
      :disabled="field.disabled"
      :label="field.title || field.label"
      :size="field.size"
    ></el-checkbox>
    <!-- 普通全选复选框-->
    <el-checkbox
      v-if="field.isGroup && !field.isButton"
      class="widget-checkAll"
      :indeterminate="isIndeterminate"
      v-model="checkAll"
      @change="onCheckAll"
      label="全选"
    ></el-checkbox>
    <!-- 多个复选框，必须设置options -->
    <el-checkbox-group
      v-if="field.isGroup"
      v-model="value"
      :max="field.max"
      :min="field.min"
      :disabled="field.disabled"
      :size="field.size"
      :text-color="field.textColor"
      :fill="field.fill"
      @change="onCheckboxGroup"
    >
      <!-- 普通复选组 -->
      <div v-if="!field.isButton">
        <el-checkbox
          v-for="box in field.options"
          :key="box.name"
          :label="box.title || box.label"
          :border="box.border"
          :disabled="box.disabled"
          :size="box.size"
        ></el-checkbox>
      </div>
      <!-- 按钮样式 -->
      <div v-else-if="field.isButton">
        <el-checkbox-button
          v-for="box in field.options"
          :key="box.name"
          :label="box.title || box.label"
          :border="box.border"
          :disabled="box.disabled"
          :size="box.size"
          :text-color="box.textColor"
          :fill="box.fill"
        ></el-checkbox-button>
      </div>
    </el-checkbox-group>
  </div>
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
        isGroup: false, // 为true时，options有效即多选框组生效,value必须为array
        isButton: false, // 功能：指明多选框组为按钮形式
        max: 10000, // 生效：多选框组  功能：规定可以选择的范围
        min: 0, // 生效：多选框组  功能：规定可以选择的范围
        disabled: false, // 生效：多选框组或单个  说明：优先级高于子checkbox
        border: false,
        size: "", // medium / small / mini  说明：仅对按钮形式或带有边框的Checkbox有效
        textColor: "#ffffff", // 按钮有效
        fill: "#409EFF", // 按钮有效
        chooseAll: false,
      };
    },
    // 选择全部
    onCheckAll(val) {
      const checkOptions = [];
      this.field.options.map((item) => {
        checkOptions.push(item.title);
      });
      let value = val ? checkOptions : [];
      this.changeValue(value);
      this.isIndeterminate = false;
    },
    onCheckboxGroup(value) {
      this.checkAll = this.field.options.length == value.length;
      this.isIndeterminate = this.checkAll ? false : true;
    },
  },
};
</script>

<style lang="scss" scoped>
.checkbox-widget {
  display: flex;
  width: 100%;
  .widget-checkAll {
    margin-right: 20px;
  }
}
</style>
