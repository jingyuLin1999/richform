<template>
  <Cascader
    :id="widgetId"
    class="cascader-widget"
    v-model="value"
    :options="options"
    :disabled="field.disabled"
    :placeholder="field.placeholder"
    :separator="field.separator"
    :clearable="field.clearable"
    :filterable="field.filterable"
    :collapse-tags="field.collapseTags"
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
      optionFlatMap: {}, // options扁平数据
    };
  },
  watch: {
    "colors.theme": {
      handler(theme) {
        this.$nextTick(() => {
          let cascaderEl = document.querySelector(
            `#${this.widgetId} .el-cascader__search-input`
          );
          if (cascaderEl) {
            cascaderEl.setAttribute("style", `background:${theme};`);
          }
        });
      },
      immediate: true,
    },
  },
  computed: {
    options() {
      // options数据类型判断，是树结构还是扁平数据,并转换
      let { options, defaultProp } = this.field;
      // 能找到children，则说明是数，否则是扁平数据
      let isTree = options.find((opItem) =>
        opItem[defaultProp.children] ? true : false
      );
      if (isTree) {
        this.optionFlatMap = this.treeToFlatMap(options);
      } else {
        options.map((item) => {
          let cloneItem = JSON.parse(JSON.stringify(item));
          let key = cloneItem[this.field.defaultProp.value];
          this.optionFlatMap[key] = cloneItem;
        });
        return this.toTree();
      }
      return options;
    },
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
        collapseTags: false, // 折叠
        defaultProp: {
          value: "value",
          label: "label",
          children: "children",
          parentId: "parentId",
          expandTrigger: "hover", // 	click / hover
          checkStrictly: false, // 父子节点不互相关联
          multiple: false, // 可通过 props.multiple = true 来开启多选模
        },
      };
    },
    // 将树结构数据转化成扁平数据
    treeToFlatMap(tree, res = {}) {
      tree.forEach((item) => {
        let cloneItem = JSON.parse(JSON.stringify(item));
        delete cloneItem.children;
        res[item[this.field.defaultProp.value]] = cloneItem;
        if (item.children && item.children.length > 0)
          this.treeToFlatMap(item.children, res);
      });
      return res;
    },
    // 将options的扁平数据转化成树结构
    toTree() {
      let tree = [];
      let searchPool = {};
      let { options, defaultProp } = this.field;
      let optionList = JSON.parse(JSON.stringify(options));
      let { value, children, parentId } = defaultProp;
      optionList.forEach((item) => {
        if (item[children]) this.$delete(item, children);
        searchPool[item[value]] = item;
      });
      optionList.forEach((item) => {
        let parent = searchPool[item[parentId]];
        if (parent) (parent[children] || (parent[children] = [])).push(item);
        else tree.push(item);
      });
      return tree;
    },
    // 获取每代的id
    pickGenerationId(id, parentId = []) {
      let curItem = this.optionFlatMap[id];
      if (!curItem) return parentId;
      if (curItem) {
        switch (this.schema.type) {
          case "number":
            id = parseInt(id);
            break;
          case "string":
            id = id.toString();
            break;
        }
        parentId.unshift(id);
      }
      let parentIdKey = this.field.defaultProp.parentId;
      return this.pickGenerationId(curItem[parentIdKey], parentId);
    },
    friendValue() {
      let { name, isLeaf, defaultProp } = this.field;
      let value = this.values[name];
      // 多选且只获取枝叶节点
      if (isLeaf && defaultProp.multiple && Array.isArray(value)) {
        let multiValue = [];
        value.map((id) => multiValue.push(this.pickGenerationId(id)));
        value = multiValue;
      } else if (isLeaf && defaultProp.checkStrictly) {
        // 单选且枝叶节点
        value = this.pickGenerationId(value);
      }
      return value;
    },
    beforeChange(value) {
      let { isLeaf, defaultProp } = this.field;
      if (isLeaf && defaultProp.multiple && Array.isArray(value)) {
        // 多选且只获取枝叶节点
        let multiValue = [];
        value.map((itemArr) => {
          multiValue.push(itemArr[itemArr.length - 1]);
        });
        return multiValue;
      } else if (isLeaf && defaultProp.checkStrictly) {
        // 单选且枝叶节点
        return value[value.length - 1];
      }
      return value;
    },
  },
};
</script>

<style lang="scss">
.el-cascader__tags .el-tag {
  min-width: 55px !important;
}
.cascader-widget {
  width: 100%;
}
</style>