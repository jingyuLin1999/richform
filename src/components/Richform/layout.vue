<template>
  <div class="layout">
    <template v-for="(item, index) in layout">
      <!-- 数组做循环 -->
      <field-group
        v-if="Array.isArray(item)"
        :key="index"
        :form="form"
        :form-schema="formSchema"
        :fields="item"
      />
      <!-- 标签页 -->
      <template v-else-if="typeof item == 'object' && item.widget == 'tabs'">
        <field-tabs :key="index" :tabsItem="item"></field-tabs>
      </template>
      <!-- 折叠面板 -->
      <template
        v-else-if="typeof item == 'object' && item.widget == 'collapse'"
      >
        <field-collapse :key="index" :collapse="item"></field-collapse>
      </template>
      <!-- 普通字段 -->
      <field v-else :key="index" :field="item"></field>
    </template>
  </div>
</template>

<script>
import FieldGroup from "./group/default";
import FieldTabs from "./group/tabs";
import FieldCollapse from "./group/collapse";
import Field from "./field.vue";
export default {
  name: "layout",
  components: { FieldTabs, FieldCollapse, Field },
  props: {
    schema: { type: Object, default: () => ({}) },
    layout: { type: Array, default: () => [] },
    values: { type: Object, default: () => ({}) },
  },
};
</script>

<style lang="scss">
@import "./vars.scss";
.layout {
  > .field-border-top:first-child {
    border-top: 1px solid $form-border-color;
  }
}
</style>