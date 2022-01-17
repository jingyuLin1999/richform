<template>
  <div class="select-widget-wrapper" :id="widgetId">
    <Select
      v-model="value"
      :class="[
        'select-widget',
        'el-form-item',
        fieldErrors[field.name] ? 'is-error' : '',
        widgetId,
      ]"
      :placeholder="field.placeholder"
      :disabled="field.disabled"
      :clearable="field.clearable"
      :multiple="field.multiple"
      :collapse-tags="field.collapseTags"
      :allow-create="field.allowCreate"
      :filterable="field.filterable"
      :size="field.size"
      @clear="clearOptions"
      @change="calcuHeight"
    >
      <!-- 不分组 -->
      <div v-if="!field.isGroup">
        <Option
          v-for="(option, index) in field.options"
          :key="index"
          :label="option[field.defaultProp.label]"
          :value="option[field.defaultProp.value]"
          :disabled="option.disabled"
        ></Option>
      </div>
      <!-- 分组 -->
      <div v-else>
        <OptionGroup
          v-for="(group, index) in field.options"
          :key="index"
          :label="group.label"
        >
          <Option
            v-for="option in group.options"
            :key="option[field.defaultProp.value]"
            :label="option[field.defaultProp.label]"
            :value="option[field.defaultProp.value]"
          ></Option>
        </OptionGroup>
      </div>
    </Select>
  </div>
</template>

<script>
import baseMixin from "./baseMixin";
import { Select, Option, OptionGroup } from "element-ui";
export default {
  mixins: [baseMixin],
  components: { Select, Option, OptionGroup },
  mounted() {
    this.calcuHeight();
  },
  methods: {
    defaultFieldAttr() {
      return {
        isGroup: false, // 是否分组
        placeholder: "请选择",
        size: "",
        disabled: false, // 说明：当该属性在字典中，则禁用对应的选项。若在field.disable则禁用整个选择器
        clearable: false, // 说明：可清空选项  注意：仅单选有效
        multiple: false, // 说明：是否支持多选
        collapseTags: false, // 多选用tags显示
        filterable: false, // 说明：搜索label
        allowCreate: false, // 说明：是否允许创建条目,谨慎使用  注意：filterable为true时有效
        defaultProp: {
          label: "label",
          value: "value",
        },
      };
    },
    // 清空的时候为"",后端要求最好是null,故强制转换一下
    clearOptions() {
      if (!this.field.multiple) this.values[this.field.name] = null;
    },
    // 有延迟，重复计算高度
    calcuHeight() {
      setTimeout(() => {
        this.getWidgetHeight();
      }, 80);
    },
  },
};
</script>

<style lang="scss">
.select-widget-wrapper {
  width: 100%;
  height: 100%;
  > .select-widget {
    height: 100%;
    width: 100%;
  }
}
</style>