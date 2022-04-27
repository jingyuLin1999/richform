<template>
  <div class="default-layout">
    <layout
      :layout="fields"
      :form="form"
      :values="values"
      :colors="colors"
      :schema="schema"
      :fieldErrors="fieldErrors"
      :hideFields="hideFields"
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