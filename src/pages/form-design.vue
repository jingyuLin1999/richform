<template>
  <div class="form-design-demo">
    <form-design :fields="dataFields"></form-design>
  </div>
</template>

<script>
import FormDesign from "../components/Formdesign";
export default {
  components: { FormDesign },
  data() {
    return {
      dataFields: [
        { label: "身高", value: "height", disabled: true },
        { label: "体重", value: "weight" },
        { label: "年龄", value: "age" },
        { label: "职业", value: "occupation" },
      ],
    };
  },
  methods: {
    onTabClick(tab, event) {},
  },
};
</script>

<style lang="scss">
.form-design-demo {
  height: 100%;
}
</style>