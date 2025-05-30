<!-- 折叠面板 -->
<template>
  <div :class="[
    'collapse-wrapper',
    form.grid ? 'collapse-wrapper-border ' : '',
    collapse.activeDesign ? 'active-design' : '',
  ]">
    <!-- 避免触发发缩收 -->
    <div v-if="isDesign" class="design-no-collapse" @click="onClickedItem(collapse)"></div>
    <Collapse v-model="openCollapseName" @change="onChange">
      <CollapseItem :name="collapse.name" class="collapse-item">
        <template slot="title">
          <span :style="collapse.style" class="collapse-title">{{ collapse.title}}</span>
        </template>
        <div class="collapse-container">
          <layout :layout="collapse.fields" :isDesign="isDesign" :form="form" :values="values" :colors="colors"
            :schema="schema" :fieldErrors="fieldErrors" :hideFields="hideFields" :isFriendValue="isFriendValue"
            :isDark="isDark">
            <template v-for="(_, name) in $scopedSlots" v-slot:[name]="data">
              <slot :name="name" v-bind="data" />
            </template>
          </layout>
          <actions v-if="Array.isArray(collapse.actions)" :actions="collapse.actions" :isDesign="isDesign"></actions>
        </div>
      </CollapseItem>
    </Collapse>
    <!--拖拽-->
    <span class="design-draggable design-handle-move" v-if="isDesign && collapse.isClicked">
      <i class="el-icon-rank design-handle-move"></i>
    </span>
    <!--复制-->
    <span class="design-copy" @click="onCopyItem(schema)" v-if="isDesign && collapse.isClicked">
      <i class="el-icon-document-copy"></i>
    </span>
    <!--删除-->
    <span class="design-delete" @click="onDeleteItem(form, collapse)" v-if="isDesign && collapse.isClicked">
      <i class="el-icon-delete"></i>
    </span>
  </div>
</template>

<script>
import DesignMixin from "../utils/designMixin";
import { Collapse, CollapseItem } from "element-ui";
export default {
  name: "collapse",
  mixins: [DesignMixin],
  components: { Collapse, CollapseItem },
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
    this.$options.components.Actions = () => import("../actions.vue");
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
    onChange(activeName) {
      this.emit("action", activeName);
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

  >.design-no-collapse {
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