<template>
  <div class="default-layout">
    <layout :layout="fields"></layout>
  </div>
</template>

<script>
export default {
  name: "default",
  props: {
    fields: { type: Array, default: () => [] },
  },
    beforeCreate: function () {
    this.$options.components.Layout = () => import("../layout.vue");
  },
};
</script>

<style>
</style>