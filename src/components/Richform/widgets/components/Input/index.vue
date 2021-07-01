
<!--
用于处理 el-input change事件不触发bug
-->
<template>
  <el-input v-model="inputVal" :placeholder="placeholder"></el-input>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ""
    },
    placeholder: { type: String, default: "" }
  },
  data() {
    return {
      inputVal: this.value
    };
  },
  watch: {
    inputVal(newVal) {
      this.$emit("change", newVal);
    },
    value(newVal) {
      if (newVal !== this.inputVal) {
        this.inputVal = newVal;
      }
    }
  },
  methods: {}
};
</script>

<style lang="scss" >
</style>
