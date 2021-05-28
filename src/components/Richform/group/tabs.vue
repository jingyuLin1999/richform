<!-- 标签页 --->
<template>
  <div class="tab-wrapper">
    <el-tabs v-model="activeTabName" @tab-click="clickTab(tabsItem)">
      <el-tab-pane
        v-for="(tab, index) in tabsItem.tabs"
        :key="index"
        :label="tab.label"
        :name="tab.name"
      >
        <div class="tab-container">
          <layout :layout="tab.fields"></layout>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "tabs-layout",
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
}
</style>