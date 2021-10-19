<template>
  <div class="radio-widget" :id="widgetId">
    <Radio
      v-if="!field.isGroup"
      :disabled="field.disabled"
      :border="field.border"
      :size="field.size"
      v-model="value"
      :label="field.title"
    ></Radio>
    <RadioGroup
      v-else
      :text-color="field.textColor"
      :fill="field.fill"
      v-model="value"
    >
      <div v-if="field.isButton">
        <RadioButton
          v-for="radio in field.options"
          :name="radio.name"
          :key="radio.name"
          :disabled="radio.disabled"
          :border="radio.border"
          :size="radio.size"
          :label="radio.title"
        ></RadioButton>
      </div>
      <div v-else>
        <Radio
          v-for="radio in field.options"
          :name="radio.name"
          :key="radio.name"
          :disabled="radio.disabled"
          :border="radio.border"
          :size="radio.size"
          :label="radio.title"
        ></Radio>
      </div>
    </RadioGroup>
  </div>
</template>

<script>
import baseMixin from "./baseMixin";
import { Radio, RadioGroup, RadioButton } from "element-ui";
export default {
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
      };
    },
  },
};
</script>

<style>
</style>