<template>
  <draggable
    :class="['layout', { 'drag-design': isDesign }]"
    v-bind="getDragOptions()"
    :list="layout"
    tag="div"
  >
    <template v-for="(item, index) in layout">
      <!-- 数组做循环 -->
      <field-group v-if="Array.isArray(item)" :key="index" :fields="item" />
      <!-- 标签页 -->
      <template v-else-if="typeof item == 'object' && item.widget == 'tabs'">
        <field-tabs :key="index" :tabsItem="item"></field-tabs>
      </template>
      <!-- 栅格布局 -->
      <template v-else-if="typeof item == 'object' && item.widget == 'grid'">
        <field-grid :key="index" :gridItem="item"></field-grid>
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
  </draggable>
</template>

<script>
import Field from "./field.vue";
import FieldGroup from "./group/default";
import FieldTabs from "./group/tabs";
import FieldGrid from "./group/grid";
import FieldCollapse from "./group/collapse";
import Draggable from "vuedraggable";
import DragMixin from "./utils/designMixin";

export default {
  name: "layout",
  inject: ["isDesign"],
  mixins: [DragMixin],
  components: {
    FieldTabs,
    FieldGrid,
    FieldGroup,
    FieldCollapse,
    Field,
    Draggable,
  },
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
  .active-design {
    border: 3px solid #409eff;
  }
  padding-right: 0;
  > .field-border-top:first-child {
    border-top: 1px solid $form-border-color;
  }
}
</style>