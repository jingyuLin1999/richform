<template>
  <div class="radio-widget" :id="widgetId">
    <Radio
      v-if="!field.isGroup"
      :disabled="field.disabled"
      :border="field.border"
      :size="field.size"
      v-model="value"
      :label="field.options[0].name || field.title"
    >
      {{ field.options[0].title || field.title }}</Radio
    >
    <RadioGroup
      v-else
      :text-color="field.textColor"
      :fill="field.fill"
      v-model="value"
      @change="onChange"
    >
      <div v-if="field.isButton">
        <RadioButton
          v-for="radio in field.options"
          :name="radio.name"
          :key="radio.name"
          :disabled="radio.disabled"
          :border="radio.border"
          :size="radio.size"
          :label="radio.name"
        >
          {{ radio.title }}
        </RadioButton>
      </div>
      <div v-else>
        <Radio
          v-for="radio in field.options"
          :name="radio.name"
          :key="radio.name"
          :disabled="radio.disabled"
          :border="radio.border"
          :size="radio.size"
          :label="radio.name"
        >
          {{ radio.title }}
        </Radio>
      </div>
    </RadioGroup>
  </div>
</template>

<script>
import baseMixin from "./baseMixin";
import eventbus from "../utils/eventbus";
import { Radio, RadioGroup, RadioButton } from "element-ui";
export default {
  inject: ["formId"],
  mixins: [baseMixin],
  components: { Radio, RadioGroup, RadioButton },
  methods: {
    defaultFieldAttr() {
      return {
        isGroup: true,
        isButton: false,
        disabled: true,
        border: false,
        size: "small", // medium / small / mini
        textColor: "#fff", // 当isButton为true时有效
        fill: "#409EFF", // 当isButton为true时有效
        options: [],
      };
    },
    friendValue() {
      let value = this.values[this.field.name];
      if (typeof value == "number") return value.toString();
      return value;
    },
    beforeChange(val) {
      return this.schema.type == "number" ? parseFloat(val) : val;
    },
    onChange(val) {
      eventbus.$emit(`${this.formId}:action`, {
        value: val,
        name: this.field.name,
      });
    },
  },
};
</script>

<style>
</style>