<template>
  <div class="default-layout">
    <layout :layout="fields"></layout>
  </div>
</template>

<script>
import Layout from "../layout";

export default {
  name: "default",
  components: [Layout],
  props: {
    fields: { type: Array, default: () => [] },
  },
};
</script>

<style>
</style>