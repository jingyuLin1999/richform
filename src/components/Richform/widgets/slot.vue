<template>
  <div class="slot-widget">
    <slot :name="field.slotName" :field="field" :values="values"></slot>
  </div>
</template>

<script>
import baseMixin from "./baseMixin";
export default {
  mixins: [baseMixin],
  // render(h) {
  //   return h('div',this.slots[this.field.slotName]);
  // },
  methods: {
    defaultFieldAttr() {
      return {
        slotName: "", // 插槽名字
      };
    },
  },
};
</script>

<style lang="scss">
.slot-widget {
  width: 100%;
  height: 100%;
}
</style>