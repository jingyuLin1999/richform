<!-- 折叠面板 -->
<template>
  <div
    :class="['collapse-wrapper', form.grid ? 'collapse-wrapper-border ' : '']"
  >
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
  </div>
</template>

<script>
export default {
  name: "collapse",
  inject: ["form"],
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
  margin-top: 10px;
  box-sizing: border-box;
  .collapse-title {
    color: #409eff;
    font-size: 15px;
    margin-left: 3px;
  }
  .collapse-container {
    box-sizing: border-box;
    padding: 0 5px;
  }
}
.collapse-wrapper-border {
  border: 1px solid $form-border-color;
  border-top: 0;
  border-bottom: 0;
}
</style>