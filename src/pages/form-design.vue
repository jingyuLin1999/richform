<template>
  <div class="form-design">
    <div class="design-header">表单设计器</div>
    <div class="design-content">
      <split-layout first-panel-size="210px" :hasLastPanel="false">
        <template slot="first"> 子组件 </template>
        <template slot="center">
          <RichForm :schema="schema" :form="form" :values="values"></RichForm
        ></template>
      </split-layout>
    </div>
  </div>
</template>

<script>
import RichForm from "../components/Richform";
import SplitLayout from "../components/SplitLayout";
export default {
  components: { SplitLayout, RichForm },
  data() {
    return {
      form: {},
      values: {},
      schema: {},
    };
  },
};
</script>

<style lang="scss">
.form-design {
  height: 100%;
  display: flex;
  flex-direction: column;
  > .design-header {
    height: 55px;
    line-height: 55px;
    padding: 0 10px;
    color: #fff;
    background: linear-gradient(90deg, #1179f4 45%, #079dc8, #01b3ac);
  }
  > .design-content {
    height: 100%;
    position: relative;
  }
}
</style>