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
        <template v-for="(option, index) in friendOptions">
          <Option
            v-if="isFilter(option)"
            :key="index"
            :label="option[field.defaultProp.label]"
            :value="option[field.defaultProp.value]"
            :disabled="option.disabled"
          ></Option>
        </template>
      </div>
      <!-- 分组 -->
      <div v-else>
        <OptionGroup
          v-for="(group, index) in friendOptions"
          :key="index"
          :label="group.label"
        >
          <template v-for="option in group.options">
            <Option
              v-if="isFilter(option)"
              :key="option[field.defaultProp.value]"
              :label="option[field.defaultProp.label]"
              :value="option[field.defaultProp.value]"
            ></Option>
          </template>
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
  computed: {
    // 有可能是直接给个数组字符串格式，需要转化一下
    friendOptions() {
      let { options, defaultProp } = this.field;
      if (typeof options[0] == "object") return options;
      let friendOptions = [];
      options.map((item) => {
        let option =
          typeof item == "string"
            ? {
                [defaultProp.value]: item,
                [defaultProp.label]: item,
              }
            : item;
        friendOptions.push(option);
      });
      return friendOptions;
    },
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
        filter: { key: null, value: null }, // 过滤掉符合条件的
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
    // 过滤出符合条件的
    isFilter(option) {
      let { key, value } = this.field.filter;
      return !(key && value != null && option[key] == value);
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