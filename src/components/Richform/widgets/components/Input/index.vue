
<!--
用于处理 Input change事件不触发bug
-->
<template>
  <Input v-model="inputVal" :placeholder="placeholder"></Input>
</template>

<script>
import { Input } from "element-ui";
export default {
  props: {
    value: {
      type: String,
      default: "",
    },
    placeholder: { type: String, default: "" },
  },
  components: { Input },
  data() {
    return {
      inputVal: this.value,
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
    },
  },
  methods: {},
};
</script>

<style lang="scss" >
</style>
