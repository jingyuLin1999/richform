<template>
  <div class="text-widget" :id="widgetId">
    <div v-html="field.html" :style="{ color: colors.fontColor }"></div>
  </div>
</template>

<script>
import baseMixin from "./baseMixin";
export default {
  mixins: [baseMixin],
  methods: {
    defaultFieldAttr() {
      return {};
    },
  },
};
</script>

<style lang="scss">
.text-widget {
  width: 100%;
}
