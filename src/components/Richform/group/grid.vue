<template>
  <div :class="[
    'grid-layout',
    form.grid ? 'grid-layout-border' : '',
    gridItem.activeDesign ? 'active-design' : '',
  ]">
    <div class="grid-title" v-if="gridItem.showTitle" :class="[form.grid ? 'grid-title-border' : '']"
      :style="{ color: colors.fontColor }" @click="onClickedItem(gridItem)">
      {{ gridItem.title }}
    </div>
    <div class="gird-content">
      <div class="drag-wrapper" @click="onClickedItem(gridItem)"></div>
      <div class="grid-flex" :style="{ flexWrap: gridItem.flexWrap ? 'wrap' : 'nowrap' }">
        <div :class="[
    'grid-column',
    form.grid ? 'grid-column-border' : '',
    form.grid ? 'grid-column-padding' : '',
  ]" v-for="(columnItem, index) in gridItem.fields" :key="index" :style="{ flex: ratio[index] || 1 }"
          v-show="isShowColumn(columnItem)">
          <layout :layout="columnItem" :isDesign="isDesign" :form="form" :values="values" :colors="colors"
            :schema="schema" :fieldErrors="fieldErrors" :isFriendValue="isFriendValue" :hideFields="hideFields"
            :isDark="isDark">
            <template v-for="(_, name) in $scopedSlots" v-slot:[name]="data">
              <slot :name="name" v-bind="data" />
            </template>
          </layout>
        </div>
      </div>
    </div>
    <!--拖拽-->
    <span class="design-draggable design-handle-move" v-if="isDesign && gridItem.isClicked">
      <i class="el-icon-rank design-handle-move"></i>
    </span>
    <!--复制-->
    <span class="design-copy" @click="onCopyItem(schema)" v-if="isDesign && gridItem.isClicked">
      <i class="el-icon-document-copy"></i>
    </span>
    <!--删除-->
    <span class="design-delete" @click="onDeleteItem(form, gridItem)" v-if="isDesign && gridItem.isClicked">
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
  computed: {
    ratio() {
      return this.gridItem.ratio ? this.gridItem.ratio.split(":") : [];
    },
  },
  methods: {
    // 当该列的所有数据都是隐藏的，则该列不显示
    isShowColumn(columnList) {
      if (this.isDesign) return true;
      let needShow = columnList.find(
        (item) => item.hide == false || item.hide == undefined
      );
      return needShow ? true : false;
    },
  },
};
</script>

<style lang="scss">
@import "../vars.scss";

.grid-layout {
  margin-top: 2px;
  position: relative;

  &.grid-layout-border {
    box-sizing: border-box;
    border: 1px solid $form-border-color;
    border-top: 0;
    border-right: 0;
  }

  .grid-title-border {
    border-top: 1px solid $form-border-color;
    border-right: 1px solid $form-border-color;
  }

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

    .grid-flex {
      display: flex;
      width: 100%;
      height: 100%;
    }

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
</style>