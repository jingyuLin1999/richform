<!-- 折叠面板 -->
<template>
  <div
    :class="['collapse-wrapper', form.grid ? 'collapse-wrapper-border ' : '']"
  >
    <!-- 避免出发缩收 -->
    <div
      v-if="isDesign"
      class="design-no-collapse"
      @click="onClickedItem(collapse)"
    ></div>
    <el-collapse v-model="openCollapseName">
      <el-collapse-item :name="collapse.name" class="collapse-item">
        <template slot="title">
          <span class="collapse-title">{{ collapse.title }}</span>
        </template>
        <div class="collapse-container">
          <layout :layout="collapse.fields"></layout>
        </div>
      </el-collapse-item>
    </el-collapse>
    <!--拖拽-->
    <span
      class="design-draggable design-handle-move"
      v-if="isDesign && collapse.isClicked"
    >
      <i class="el-icon-rank design-handle-move"></i>
    </span>
    <!--复制-->
    <span
      class="design-copy"
      @click="onCopyItem(schema)"
      v-if="isDesign && collapse.isClicked"
    >
      <i class="el-icon-document-copy"></i>
    </span>
    <!--删除-->
    <span
      class="design-delete"
      @click="onDeleteItem(schema)"
      v-if="isDesign && collapse.isClicked"
    >
      <i class="el-icon-delete"></i>
    </span>
  </div>
</template>

<script>
import DesignMixin from "../utils/designMixin";
export default {
  name: "collapse",
  inject: ["form", "isDesign"],
  mixins: [DesignMixin],
  props: {
    collapse: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      openCollapseName: "",
    };
  },
  beforeCreate: function () {
    this.$options.components.Layout = () => import("../layout.vue");
  },
  mounted() {
    this.openCollapse();
  },
  methods: {
    openCollapse() {
      if (this.collapse.expand) {
        this.openCollapseName = this.collapse.name;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../vars.scss";
.collapse-wrapper {
  overflow: hidden;
  margin-top: 10px;
  box-sizing: border-box;
  position: relative;
  .collapse-title {
    color: #409eff;
    font-size: 15px;
    margin-left: 3px;
  }
  .collapse-container {
    box-sizing: border-box;
    padding: 0 5px;
  }
  > .design-no-collapse {
    width: 100%;
    height: 50px;
    position: absolute;
    left: 100px;
  }
}
.collapse-wrapper-border {
  border: 1px solid $form-border-color;
  border-top: 0;
  border-bottom: 0;
  cursor: pointer;
}
</style>