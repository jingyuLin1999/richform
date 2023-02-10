<template>
  <div class="ipinput-widget" :id="widgetId">
    <ipInput
      :disabled="field.readOnly"
      :ip="value"
      :placeholder="field.placeholder"
      :on-change="onIpChange"
      :colors="colors"
    ></ipInput>
    <template slot="prepend" v-if="field.prepend">{{ field.prepend }}</template>
    <template slot="append" v-if="field.append">{{ field.append }}</template>
  </div>
</template>

<script>
import baseMixin from "./baseMixin";
import ipInput from "./components/IpInput";

export default {
  name: "IpInputWidget",
  mixins: [baseMixin],
  components: { ipInput },
  computed: {},
  data() {
    return {};
  },
  methods: {
    onIpChange(val) {
      this.value = val;
    },
    // 定义一个规范化Schema的方法，用来为组件添加个性化的默认属性
    defaultFieldAttr() {
      return {
        placeholder: "",
        prepend: null, //前置内容
        append: null, //后置内容
      };
    },
  },
};
</script>

<style lang="scss">
.richform {
  .ipinput-widget {
    width: 100%;
  }
  .layout {
    .field.error {
      input {
        border: 1px solid red;
        background: transparentize(red, 0.8);
      }
    }
  }
}
</style>

