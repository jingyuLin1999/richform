<!-- 标签页 --->
<template>
  <div :class="['tab-wrapper', tabsItem.activeDesign ? 'active-design' : '']">
    <!-- 点击区域，不影响tabs -->
    <div
      v-if="isDesign"
      class="design-no-tabs"
      @click="onClickedItem(tabsItem)"
    ></div>
    <Tabs v-model="activeTabName" @tab-click="clickTab(tabsItem)">
      <TabPane
        v-for="(tab, index) in tabsItem.tabs"
        :key="index"
        :label="tab.label"
        :name="tab.name"
      >
        <div class="tab-container">
          <layout
            :layout="tab.fields"
            :isDesign="isDesign"
            :form="form"
            :values="values"
            :colors="colors"
            :schema="schema"
            :fieldErrors="fieldErrors"
            :hideFields="hideFields"
            :isDark="isDark"
          ></layout>
        </div>
      </TabPane>
    </Tabs>
    <!--拖拽-->
    <span
      class="design-draggable design-handle-move"
      v-if="isDesign && tabsItem.isClicked"
    >
      <i class="el-icon-rank design-handle-move"></i>
    </span>
    <!--复制-->
    <span
      class="design-copy"
      @click="onCopyItem(schema)"
      v-if="isDesign && tabsItem.isClicked"
    >
      <i class="el-icon-document-copy"></i>
    </span>
    <!--删除-->
    <span
      class="design-delete"
      @click="onDeleteItem(form, tabsItem)"
      v-if="isDesign && tabsItem.isClicked"
    >
      <i class="el-icon-delete"></i>
    </span>
  </div>
</template>

<script>
import DesignMixin from "../utils/designMixin";
import { Tabs, TabPane } from "element-ui";
export default {
  name: "tabs-layout",
  mixins: [DesignMixin],
  components: { Tabs, TabPane },
  props: {
    tabsItem: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      activeTabName: this.tabsItem.tabs[0] ? this.tabsItem.tabs[0].name : "",
    };
  },
  beforeCreate: function () {
    this.$options.components.Layout = () => import("../layout.vue");
  },
  methods: {
    clickTab() {},
  },
};
</script>

<style lang="scss">
.tab-wrapper {
  position: relative;
  box-sizing: border-box;
  > .design-no-tabs {
    width: 100%;
    height: 40px;
    position: absolute;
    z-index: 2;
  }
}
</style>