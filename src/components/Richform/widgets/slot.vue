<script>
import baseMixin from "./baseMixin";
export default {
  mixins: [baseMixin],
  inject: ["slots"],
  render(h) {
    return h('div',this.slots[this.field.slotName]);
  },
  methods: {
    defaultFieldAttr() {
      return {
        slotName: "", // 插槽名字
      };
    },
  }
};
</script>