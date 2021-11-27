<template>
  <Cascader
    :id="widgetId"
    class="cascader-widget"
    v-model="value"
    :options="field.options"
    :disabled="field.disabled"
    :placeholder="field.placeholder"
    :separator="field.separator"
    :clearable="field.clearable"
    :filterable="field.filterable"
    :props="field.defaultProp"
    :show-all-levels="field.showAllLevels"
  ></Cascader>
</template>

<script>
import { Cascader } from "element-ui";
import baseMixin from "./baseMixin";
export default {
  mixins: [baseMixin],
  components: { Cascader },
  data() {
    return {
      cascaderDict: {},
    };
  },
  created() {
    this.cascaderDict = this.getDic(this.field.options);
  },
  methods: {
    defaultFieldAttr() {
      return {
        options: [], // 渲染的树结构
        isLeaf: false, // 只获取最后一级
        disabled: false,
        placeholder: "请选择",
        filterable: true, // 搜索功能
        clearable: true,
        separator: "/", // 分隔符
        showAllLevels: true, // 结果显示所以级别如：a/b/c
        defaultProp: {
          value: "value",
          label: "label",
          parentId: "parentId",
          expandTrigger: "hover", // 	click / hover
          checkStrictly: false, // 父子节点不互相关联
          multiple: false, // 可通过 props.multiple = true 来开启多选模
        },
      };
    },
    // 获取字典
    getDic(tree, res = {}) {
      tree.forEach((item) => {
        let cloneItem = JSON.parse(JSON.stringify(item));
        delete cloneItem.children;
        res[item[this.field.defaultProp.value]] = cloneItem;
        if (item.children && item.children.length > 0)
          this.getDic(item.children, res);
      });
      return res;
    },
    // 获取每代人的id
    pickGenerationId(id, parentId = []) {
      let curItem = this.cascaderDict[id];
      if (!curItem) return parentId;
      if (curItem) {
        if (this.schema.type == "number") id = parseInt(id);
        parentId.unshift(id);
      }
      let parentIdKey = this.field.defaultProp.parentId;
      return this.pickGenerationId(curItem[parentIdKey], parentId);
    },
    friendValue() {
      let value = this.values[this.field.name];
      if (this.field.isLeaf && !Array.isArray(value)) {
        value = this.pickGenerationId(value);
        console.log(value);
      }
      return value;
    },
    beforeChange(value) {
      return this.field.isLeaf && Array.isArray(value)
        ? value[value.length - 1]
        : value;
    },
  },
};
</script>

<style lang="scss">
.cascader-widget {
  width: 100%;
}
</style>