<template>
  <div :class="['grid-layout', form.grid ? 'grid-layout-border ' : '']">
    <div
      class="grid-column"
      v-for="(columnItem, index) in gridItem.fields"
      :key="index"
    >
      <layout :layout="columnItem"></layout>
    </div>
  </div>
</template>

<script>
export default {
  name: "grid-layout",
  inject: ["form"],
  props: {
    gridItem: { type: Object, default: () => ({}) },
  },
  beforeCreate: function () {
    this.$options.components.Layout = () => import("../layout.vue");
  },
};
</script>

<style lang="scss">
@import "../vars.scss";
.grid-layout {
  display: flex;
  margin-top: 5px;
  box-sizing: border-box;
  padding: 5px;
  .grid-column {
    width: 100%;
    margin-right: -4px;
  }
}
.grid-layout-border {
  border: 1px solid $form-border-color;
}
</style>