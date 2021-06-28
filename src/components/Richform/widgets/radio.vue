<template>
  <div class="radio-widget">
    <el-radio
      v-if="!field.isGroup"
      :disabled="field.disabled"
      :border="field.border"
      :size="field.size"
      v-model="value"
      :label="field.title"
    ></el-radio>
    <el-radio-group
      v-else
      :text-color="field.textColor"
      :fill="field.fill"
      v-model="value"
    >
      <div v-if="field.isButton">
        <el-radio-button
          v-for="radio in field.options"
          :name="radio.name"
          :key="radio.name"
          :disabled="radio.disabled"
          :border="radio.border"
          :size="radio.size"
          :label="radio.title"
        ></el-radio-button>
      </div>
      <div v-else>
        <el-radio
          v-for="radio in field.options"
          :name="radio.name"
          :key="radio.name"
          :disabled="radio.disabled"
          :border="radio.border"
          :size="radio.size"
          :label="radio.title"
        ></el-radio>
      </div>
    </el-radio-group>
  </div>
</template>

<script>
import baseMixin from "./baseMixin";
export default {
  mixins: [baseMixin],
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