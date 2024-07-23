<template>
  <draggable :class="['layout', { 'drag-design': isDesign }]" v-bind="getDragOptions()" :list="layout" tag="div">
    <template v-for="(item, index) in layout">
      <!-- 数组做循环 -->
      <field-group v-if="Array.isArray(item)" :key="index" :fields="item" :schema="schema" :values="values" :form="form"
        :colors="colors" :fieldErrors="fieldErrors" :isFriendValue="isFriendValue" :hideFields="hideFields"
        :isDark="isDark">
        <template v-for="(_, name) in $scopedSlots" v-slot:[name]="data">
          <slot :name="name" v-bind="data" />
        </template>
      </field-group>
      <!-- 标签页 -->
      <template v-else-if="typeof item == 'object' && item.widget == 'tabs'">
        <field-tabs :key="index" :schema="schema" :values="values" :form="form" :colors="colors" :tabsItem="item"
          :isDesign="isDesign" :fieldErrors="fieldErrors" :isFriendValue="isFriendValue" :hideFields="hideFields"
          :isDark="isDark">
          <template v-for="(_, name) in $scopedSlots" v-slot:[name]="data">
            <slot :name="name" v-bind="data" />
          </template>
        </field-tabs>
      </template>
      <!-- 栅格布局 -->
      <template v-else-if="typeof item == 'object' && item.widget == 'grid'">
        <field-grid :key="index" :collapse="item" :schema="schema" :values="values" :form="form" :colors="colors"
          :gridItem="item" :isDesign="isDesign" :fieldErrors="fieldErrors" :isFriendValue="isFriendValue"
          :hideFields="hideFields" :isDark="isDark">
          <template v-for="(_, name) in $scopedSlots" v-slot:[name]="data">
            <slot :name="name" v-bind="data" />
          </template>
        </field-grid>
      </template>
      <!-- 折叠面板 -->
      <template v-else-if="typeof item == 'object' && item.widget == 'collapse'">
        <field-collapse :key="index" :collapse="item" :schema="schema" :values="values" :form="form" :colors="colors"
          :isDesign="isDesign" :fieldErrors="fieldErrors" :isFriendValue="isFriendValue" :hideFields="hideFields"
          :isDark="isDark">
          <template v-for="(_, name) in $scopedSlots" v-slot:[name]="data">
            <slot :name="name" v-bind="data" />
          </template>
        </field-collapse>
      </template>
      <!-- 普通字段 -->
      <field v-else :key="index" :field="item" :schema="schema" :values="values" :form="form" :colors="colors"
        :isDesign="isDesign" :fieldErrors="fieldErrors" :isFriendValue="isFriendValue" :hideFields="hideFields"
        :isDark="isDark">
        <!-- <template v-for="slot in Object.entries(this.$slots)" :slot="slot[0]">
          <slot :name="slot[0]"></slot>
        </template>
         -->
        <template v-for="(_, name) in $scopedSlots" v-slot:[name]="data">
          <slot :name="name" v-bind="data" />
        </template>
      </field>
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
    isDark: { type: Boolean, default: false },
    isFriendValue: { type: Boolean, default: true },
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

  >.field-border-top:first-child {
    border-top: 1px solid $form-border-color;
  }
}
</style>