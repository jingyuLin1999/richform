<template>
  <draggable
    :class="['layout', { 'drag-design': isDesign }]"
    v-bind="getDragOptions()"
    :list="layout"
    tag="div"
  >
    <template v-for="(item, index) in layout">
      <!-- 数组做循环 -->
      <field-group
        v-if="Array.isArray(item)"
        :key="index"
        :fields="item"
        :schema="schema"
        :values="values"
        :form="form"
        :colors="colors"
        :fieldErrors="fieldErrors"
        :hideFields="hideFields"
      />
      <!-- 标签页 -->
      <template v-else-if="typeof item == 'object' && item.widget == 'tabs'">
        <field-tabs
          :key="index"
          :schema="schema"
          :values="values"
          :form="form"
          :colors="colors"
          :tabsItem="item"
          :isDesign="isDesign"
          :fieldErrors="fieldErrors"
          :hideFields="hideFields"
        ></field-tabs>
      </template>
      <!-- 栅格布局 -->
      <template v-else-if="typeof item == 'object' && item.widget == 'grid'">
        <field-grid
          :key="index"
          :collapse="item"
          :schema="schema"
          :values="values"
          :form="form"
          :colors="colors"
          :gridItem="item"
          :isDesign="isDesign"
          :fieldErrors="fieldErrors"
          :hideFields="hideFields"
        ></field-grid>
      </template>
      <!-- 折叠面板 -->
      <template
        v-else-if="typeof item == 'object' && item.widget == 'collapse'"
      >
        <field-collapse
          :key="index"
          :collapse="item"
          :schema="schema"
          :values="values"
          :form="form"
          :colors="colors"
          :isDesign="isDesign"
          :fieldErrors="fieldErrors"
          :hideFields="hideFields"
        ></field-collapse>
      </template>
      <!-- 普通字段 -->
      <field
        v-else
        :key="index"
        :field="item"
        :schema="schema"
        :values="values"
        :form="form"
        :colors="colors"
        :isDesign="isDesign"
        :fieldErrors="fieldErrors"
        :hideFields="hideFields"
      ></field>
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
    form: { type: Object, default: () => ({}) },
    schema: { type: Object, default: () => ({}) },
    values: { type: Object, default: () => ({}) },
    layout: { type: Array, default: () => [] },
    isDesign: { type: Boolean, default: false },
    fieldErrors: { type: Object, default: () => ({}) },
    hideFields: { type: Object, default: () => ({}) },
    colors: { type: Object, default: () => ({}) },
  },
  methods: {},
};
</script>

<style lang="scss">
@import "./vars.scss";
.layout {
  .active-design {
    border: 3px solid $active-border-color;
  }
  padding-right: 0;
  > .field-border-top:first-child {
    border-top: 1px solid $form-border-color;
  }
}
</style>