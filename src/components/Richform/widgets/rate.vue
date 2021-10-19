
<template>
  <Rate
    :id="widgetId"
    v-model="value"
    :colors="field.colors"
    :show-text="field.showText"
    :texts="field.texts"
    :disabled="field.disabled"
    :show-score="field.showScore"
    :text-color="field.textColor"
    :max="field.max"
    :allow-half="field.allowHalf"
    :low-threshold="field.lowThreshold"
    :high-threshold="field.highThreshold"
    :score-template="field.scoreTemplate"
  ></Rate>
</template>

<script>
import baseMixin from "./baseMixin";
import { Rate } from "element-ui";

export default {
  mixins: [baseMixin],
  components: { Rate },
  methods: {
    defaultFieldAttr() {
      return {
        disabled: false,
        colors: ["#99A9BF", "#F7BA2A", "#FF9900"], // 等同于 { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' }
        showText: false,
        texts: ["极差", "失望", "一般", "满意", "惊喜"], // 1、showText为true有效 2、数组长度要和max对应
        showScore: false, // texts优先级大于texts
        textColor: "#ff9900", // 字体颜色
        max: 5, // 最大分值，即有几个星星
        allowHalf: false, // 是否允许半选
        scoreTemplate: `${this.value}`, // 显示模板，优先级大于value，默认等于value
        lowThreshold: 2,
        highThreshold: 4,
      };
    },
  },
};
</script>