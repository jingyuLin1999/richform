<template>
  <div class="form-design-demo">
    <form-design></form-design>
  </div>
</template>

<script>
import FormDesign from "../components/Formdesign";
export default {
  components: { FormDesign },
  data() {
    return {};
  },
  methods: {
    onTabClick(tab, event) {},
  },
};
</script>

<style lang="scss">
.form-design-demo{
  height: 100%;
}
</style>