<template>
  <div class="default-layout">
    <layout :layout="fields" :form="form" :values="values" :colors="colors" :schema="schema" :fieldErrors="fieldErrors"
      :hideFields="hideFields" :isFriendValue="isFriendValue" :isDark="isDark">
      <template v-for="(_, name) in $scopedSlots" v-slot:[name]="data">
        <slot :name="name" v-bind="data" />
      </template>
    </layout>
  </div>
</template>

<script>
export default {
  name: "default",
  props: {
    fields: { type: Array, default: () => [] },
    form: { type: Object, default: () => ({}) },
    isFriendValue: { type: Boolean, default: true },
  },
  beforeCreate: function () {
    this.$options.components.Layout = () => import("../layout.vue");
  },
};
</script>

<style></style>