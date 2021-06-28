<template>
  <div class="perfect-tree-wrapper" :style="{ '--theme': field.theme }">
    <el-input
      v-if="field.isShowSearch"
      placeholder="输入关键字进行过滤"
      v-model="filterText"
    >
    </el-input>
    <el-tree
      ref="pefectTree"
      :data="field.tree"
      :node-key="field.nodeKey"
      :default-expand-all="field.isExpandAll"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      :draggable="field.draggable"
      :show-checkbox="field.isShowCheckbox"
      @check-change="onCheckedNode"
    >
      <span
        :class="['perfect-tree-node', `perfect-tree-node_${data.id}`]"
        :data="data.id"
        slot-scope="{ node, data }"
        @dblclick="editNodeTitle(data, node, $event)"
      >
        <!-- 标题 -->
        <div class="title-wrapper">
          <span v-if="field.isShowIcon">
            <!-- 张开和收缩图标-->
            <i
              v-if="node.childNodes.length > 0"
              :class="[node.expanded ? field.expandIcon : field.narrowIcon]"
            ></i>
            <i v-else :class="['node-icon', field.leafIcon]"></i>
          </span>
          <span
            class="title"
            :ref="'perfect-tree-node-input_' + data.id"
            :id="'perfect-tree-node-input_' + data.id"
          >
            {{ data.label || data[field.defaultProps.label] }}
          </span>
        </div>
        <!-- 工具 -->
        <span class="tools">
          <el-tooltip
            class="tool-item"
            popper-class="perfect-tree-tool-tip"
            :open-delay="200"
            v-if="node.level == 1 && field.addSibling"
            content="添加兄弟点"
            :enterable="false"
            placement="top-end"
            effect="light"
          >
            <i class="el-icon-circle-plus-outline" @click="handleSibling()"></i>
          </el-tooltip>
          <el-tooltip
            class="tool-item"
            popper-class="perfect-tree-tool-tip"
            :open-delay="200"
            v-if="field.addable"
            content="添加"
            :enterable="false"
            placement="top-end"
            effect="light"
          >
            <i class="el-icon-plus" @click="handleAdd(data, node)"></i>
          </el-tooltip>
          <el-tooltip
            class="tool-item"
            popper-class="perfect-tree-tool-tip"
            :open-delay="200"
            v-if="field.editable"
            content="编辑"
            :enterable="false"
            placement="top-end"
            effect="light"
          >
            <i
              class="el-icon-edit-outline"
              @click="handleEdit(data, node, $event)"
            ></i>
          </el-tooltip>
          <el-tooltip
            class="tool-item"
            popper-class="perfect-tree-tool-tip"
            :open-delay="200"
            v-if="field.deletable"
            content="删除"
            :enterable="false"
            placement="top-end"
            effect="light"
          >
            <i class="el-icon-delete" @click="onRemoveNode(data, node)"></i>
          </el-tooltip>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
import baseMixin from "./baseMixin";
export default {
  mixins: [baseMixin],
  data() {
    return {
      filterText: "",
    };
  },
  watch: {
    checkedKeys() {
      this.$refs.pefectTree.setCheckedKeys(this.checkedKeys);
    },
    filterText(val) {
      this.$refs.pefectTree.filter(val);
    },
  },
  methods: {
    defaultFieldAttr() {
      return {
        tree: [],
        nodeKey: "id",
        isDialogType: true,
        defaultProps: {},
        isExpandAll: true,
        isShowCheckbox: false,
        checkedKeys: [],
        isShowSearch: false,
        isShowIcon: true,
        onlyClickLeaf: true,
        editable: false,
        deletable: false,
        deleteConfirm: false,
        addable: false,
        draggable: false,
        addSibling: false,
        theme: "#409eff",
        form: {},
        expandIcon: "el-icon-folder-opened",
        narrowIcon: "el-icon-folder",
        leafIcon: "el-icon-document",
      };
    },
    onCheckedNode() {
      // 当是多选框时，返回id
      if (this.field.isShowCheckbox) {
        // 方法一： https://www.cnblogs.com/qing619/p/8144584.html
        // 方法二： https://www.bilibili.com/read/cv5259145/
        const treeRef = this.$refs["pefectTree"];
        let getCheckedKeys = treeRef.getCheckedKeys();
        let getHalfCheckedKeys = treeRef.getHalfCheckedKeys();
        getHalfCheckedKeys.map((item) => {
          if (!getCheckedKeys.includes(item)) getCheckedKeys.push(item);
        });
        this.changeValue(getCheckedKeys);
        return;
      }
      //
      const checkedNode = treeRef.getCheckedNodes();
      this.changeValue(checkedNode);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data[this.field.defaultProps.label].indexOf(value) !== -1;
    },
    async onRemoveNode(data, node) {
      let newMenu = [];
      if (this.deleteConfirm) {
        this.$confirm("此操作将永久删除节点, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            const { payload } = await this.deleteRequest(data);
            newMenu = payload;
          })
          .catch(() => {});
      } else {
        const { payload } = await this.deleteRequest(data);
        newMenu = payload;
      }
      if (Array.isArray(newMenu) && newMenu.length > 0)
        this.$set(this.$data, "treeData", newMenu);
    },
    handleAdd(data, node) {
      if (this.isOverMaxLevel(node)) return;
      if (this.isDialogType) {
        this.isModal = true;
        this.modalTitle = "新增";
        this.dialogEditModel = false;
        this.$set(this.$data, "values", { pid: data.id });
      } else this.addNode(data);
    },
    // 是否超过最大层级数
    isOverMaxLevel(node) {
      return node.level + 1 >= this.maxLevel;
    },
    handleEdit(data, node, $event) {
      if (this.isDialogType) {
        this.isModal = true;
        this.modalTitle = "编辑";
        this.dialogEditModel = true;
        let editData = JSON.parse(JSON.stringify(data));
        this.$set(this.$data, "values", editData);
      }
    },
    // 增加兄弟节点
    handleSibling() {
      this.isModal = true;
      this.dialogEditModel = false;
      this.values.pid = 0;
    },
  },
};
</script>

<style lang="scss">
// adjust element css
.perfect-tree-tool-tip {
  border-radius: 0;
  padding: 2px 4px;
}
.el-dialog__header {
  height: 100%;
  background: var(--theme);
  > .el-dialog__title {
    color: #fff;
  }
  .el-dialog__close {
    color: #fff;
  }
  .el-dialog__close:hover {
    color: #fff !important;
  }
}
// .el-tree-node:focus > .el-tree-node__content {
//   color: var(--theme);
// }
// perfect-tree css
.perfect-tree-wrapper {
  background: #fff;
  margin: 0 2px;
  .perfect-tree-title {
    height: 35px;
    line-height: 35px;
    border-bottom: 1px solid #d6d6d6;
    font-size: 15px;
  }
  .perfect-tree-node {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    .tools {
      display: flex;
      .tool-item {
        padding-left: 10px;
        display: none;
      }
    }
    .node-icon {
      margin-right: 1px;
    }
    .title {
      padding: 3px 0;
    }
  }
  .perfect-tree-node:hover .tool-item {
    display: block;
  }
}
</style>