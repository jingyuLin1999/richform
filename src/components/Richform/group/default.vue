<template>
  <div class="default-layout">
    <layout
      :layout="fields"
      :form="form"
      :values="values"
      :schema="schema"
    ></layout>
  </div>
</template>

<script>
export default {
  name: "default",
  props: {
    fields: { type: Array, default: () => [] },
    form: { type: Object, default: () => ({}) },
  },
  beforeCreate: function () {
    this.$options.components.Layout = () => import("../layout.vue");
  },
};
</script>

<style>
</style>