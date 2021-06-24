<template>
  <div class="slot-widget">
    <div v-html="field.html"></div>
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
.slot-widget {
  width: 100%;
}