<template>
  <div class="select-widget-wrapper" :id="widgetId">
    <Select v-model="value" :class="[
      'select-widget',
      'el-form-item',
      fieldErrors[field.name] ? 'is-error' : '',
      widgetId,
    ]" :placeholder="field.placeholder" :disabled="field.disabled" :clearable="field.clearable"
      :multiple="field.multiple" :collapse-tags="field.collapseTags" :allow-create="field.allowCreate"
      :filterable="field.filterable" :size="field.size" @clear="clearOptions">
      <!-- 不分组 -->
      <div v-if="!field.isGroup">
        <template v-for="(option, index) in friendOptions">
          <Option v-if="isFilter(option)" :key="index" :label="getOptionLabel(option)" :value="getOptionValue(option)"
            :disabled="option.disabled">
            <span v-if="option.prefixHtml" v-html="option.prefixHtml"></span>
            {{ getOptionLabel(option) }}
            <span v-if="option.suffixHtml" v-html="option.suffixHtml"></span>
          </Option>
        </template>
      </div>
      <!-- 分组 -->
      <div v-else>
        <OptionGroup v-for="(group, index) in friendOptions" :key="index" :label="group.label">
          <template v-for="option in group.options">
            <Option v-if="isFilter(option)" :key="option[field.defaultProp.value]" :label="getOptionLabel(option)"
              :value="getOptionValue(option)"></Option>
          </template>
        </OptionGroup>
      </div>
    </Select>
    <span v-if="field.suffixHtml" v-html="field.suffixHtml"></span>
  </div>
</template>

<script>
import { type, isNil } from "ramda";
import baseMixin from "./baseMixin";
import { strToObj } from "../utils";
import { Select, Option, OptionGroup } from "element-ui";

export default {
  mixins: [baseMixin],
  components: { Select, Option, OptionGroup },
  watch: {
    // 多选和单选切换，value数据类型需跟着转换
    "field.multiple"(newVal) {
      this.value = newVal ? [] : "";
    },
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
        defaultOption: -1, // 当字典从服务器加载后默认选中的选项下标
        forceType: null, // 重置数据类型
        join: "", // 说明： 当mutiple为true时，若设置了join,则会转换成字符串
        suffixHtml: "", // 后缀添加html
        dictConfig: {
          // 字典配置
          method: "post",
          respProp: "",
          params: {}, // 一些固定的过滤参数
          pickValues: [], // 获取values的数据做请求参数
        },
        defaultProp: {
          label: "label", // {a:'a',b:'b',c:'c'} 显示可能需要 a-b 组合，所以改成 a,c
          labelSeparator: "-",
          splitSeparator: ',',
          value: "value", // 上同
          valueSeparator: "-",
        },
        filter: { key: null, value: null }, // 过滤掉符合条件的
      };
    },
    getOptionLabel(option) {
      let toLabel = null;
      let { label, labelSeparator, splitSeparator } = this.field.defaultProp;
      let labelKeyArr = label.split(splitSeparator || ',')
      labelKeyArr.map((key, index) => {
        if (!isNil(option[key]) && toLabel == null) toLabel = option[key];
        else if (!isNil(option[key])) toLabel += option[key];
        if (!isNil(option[key]) && index != (labelKeyArr.length - 1)) toLabel += (labelSeparator || '-')
      })
      return toLabel;
    },
    getOptionValue(option) {
      let toValue = null;
      let { value, splitSeparator, valueSeparator } = this.field.defaultProp;
      let valueKeyArr = value.split(splitSeparator || ',')
      valueKeyArr.map((key, index) => {
        if (!isNil(option[key]) && toValue == null) toValue = option[key];
        else if (!isNil(option[key])) toValue += option[key];
        if (!isNil(option[key]) && index != (valueKeyArr.length - 1)) toValue += (valueSeparator || '-')
      })
      return toValue;
    },
    // 清空的时候为"",后端要求最好是null,故强制转换一下
    clearOptions() {
      let friendType =
        this.field.forceType ||
        this.fieldSchema.type ||
        type(this.values[this.field.name]).toLowerCase();
      this.values[this.field.name] = this.friendDefaultValue(friendType);
    },
    // 过滤出符合条件的
    isFilter(option) {
      let { key, value } = this.field.filter;
      return !(key && value != null && option[key] == value);
    },
    friendValue() {
      let value = this.values[this.field.name];
      let { multiple, join } = this.field;
      // vaue是string且配有join，则需根据join打散
      if (
        multiple &&
        join.length > 0 &&
        typeof value == "string" &&
        value.length > 0
      ) {
        value = value.split(join);
      } else if (typeof value == "string") {
        value = strToObj(value); // 友好转换一下
      }
      return value;
    },
    beforeChange(value) {
      let { multiple, join, forceType } = this.field;
      if (
        typeof value == "string" &&
        (forceType == "number" || this.fieldSchema.type == "number")
      ) {
        value = parseFloat(value);
      } else if (multiple && join.length > 0 && Array.isArray(value)) {
        value = value.join(join);
      } else if (
        Array.isArray(value) &&
        (forceType == "string" || this.fieldSchema.type == "string")
      ) {
        value = JSON.stringify(value);
      }
      return value;
    },
  },
};
</script>

<style lang="scss">
.select-widget-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;

  >.select-widget {
    height: 100%;
    width: 100%;
  }
}
</style>