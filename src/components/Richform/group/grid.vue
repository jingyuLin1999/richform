<template>
  <div
    :class="[
      'grid-layout',
      form.grid ? 'grid-layout-border' : '',
      gridItem.activeDesign ? 'active-design' : '',
    ]"
  >
    <div class="grid-title" v-if="gridItem.showTitle">
      {{ gridItem.title }}
    </div>
    <div class="gird-content">
      <div class="drag-wrapper" @click="onClickedItem(gridItem)"></div>
      <div
        :class="[
          'grid-column',
          form.grid ? 'grid-column-border' : '',
          form.grid ? 'grid-column-padding' : '',
        ]"
        v-for="(columnItem, index) in gridItem.fields"
        :key="index"
      >
        <layout
          :layout="columnItem"
          :isDesign="isDesign"
          :form="form"
          :values="values"
          :schema="schema"
          :fieldErrors="fieldErrors"
          :hideFields="hideFields"
        ></layout>
      </div>
    </div>
    <!--拖拽-->
    <span
      class="design-draggable design-handle-move"
      v-if="isDesign && gridItem.isClicked"
    >
      <i class="el-icon-rank design-handle-move"></i>
    </span>
    <!--复制-->
    <span
      class="design-copy"
      @click="onCopyItem(schema)"
      v-if="isDesign && gridItem.isClicked"
    >
      <i class="el-icon-document-copy"></i>
    </span>
    <!--删除-->
    <span
      class="design-delete"
      @click="onDeleteItem(schema)"
      v-if="isDesign && gridItem.isClicked"
    >
      <i class="el-icon-delete"></i>
    </span>
  </div>
</template>

<script>
import DesignMixin from "../utils/designMixin";
export default {
  name: "grid-layout",
  mixins: [DesignMixin],
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
  margin-top: 5px;
  position: relative;
  .drag-wrapper {
    top: 0;
    left: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    cursor: pointer;
    box-sizing: border-box;
  }
  .grid-title {
    padding: 3px;
  }
  .gird-content {
    display: flex;
    position: relative;
    box-sizing: border-box;
    .grid-column {
      width: 100%;
      min-height: 62px;
      padding: 6px 0 6px 6px;
      box-sizing: border-box;
    }
    .grid-column-padding {
      padding: 6px;
      border-top: 1px solid $form-border-color;
    }
    .grid-column-border:not(:last-child) {
      border-right: 1px solid $form-border-color;
    }
    .grid-column-border:last-child {
      border-right: 1px solid $form-border-color;
    }
  }
}
.grid-layout-border {
  box-sizing: border-box;
  border: 1px solid $form-border-color;
  border-top: 0;
  border-right: 0;
}
</style>