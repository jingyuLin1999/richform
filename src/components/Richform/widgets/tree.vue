<template>
  <div class="perfect-tree-wrapper" :id="widgetId" :style="{ '--theme': field.theme }">
    <Input v-if="field.isShowSearch" placeholder="输入关键字进行过滤" v-model="filterText">
    </Input>
    <Input v-if="field.showAddTemplate" size="small" placeholder="新增模板" type="textarea"
      v-model="field.template"></Input>
    <Tree ref="pefectTree" :data="treeValue" :node-key="field.nodeKey" :default-expand-all="field.isExpandAll"
      :expand-on-click-node="false" :filter-node-method="filterNode" :draggable="field.draggable"
      :show-checkbox="field.isShowCheckbox" :default-checked-keys="defaultCheckedKeys" @check-change="onCheckedNode"
      @node-click="onNodeClick">
      <span :class="[
        'perfect-tree-node',
        `perfect-tree-node_${data[field.nodeKey]}`,
      ]" :data="data[field.nodeKey]" slot-scope="{ node, data }" @dblclick="editNodeTitle(data, node, $event)">
        <!-- 标题 -->
        <div :class="['title-wrapper', onActiveNode(data) ? 'active-node' : '']">
          <span v-if="field.isShowIcon">
            <!-- 张开和收缩图标-->
            <i v-if="node.childNodes.length > 0" :class="[node.expanded ? field.expandIcon : field.narrowIcon]"></i>
            <i v-else :class="['node-icon', field.leafIcon]"></i>
          </span>
          <span class="title" :ref="'perfect-tree-node-input_' + data[field.nodeKey]"
            :id="'perfect-tree-node-input_' + data[field.nodeKey]">
            {{ data.label || data[field.defaultProps.label] }}
          </span>
        </div>
        <!-- 工具 -->
        <span class="tools">
          <Tooltip class="tool-item" popper-class="perfect-tree-tool-tip" :open-delay="200"
            v-if="node.level == 1 && field.addSibling" content="添加兄弟点" :enterable="false" placement="top-end"
            effect="light">
            <i class="el-icon-circle-plus-outline" @click="addSibling()"></i>
          </Tooltip>
          <Tooltip class="tool-item" popper-class="perfect-tree-tool-tip" :open-delay="200" v-if="field.addable"
            content="添加" :enterable="false" placement="top-end" effect="light">
            <i class="el-icon-plus" @click="addNodeModal(data, node)"></i>
          </Tooltip>
          <Tooltip class="tool-item" popper-class="perfect-tree-tool-tip" :open-delay="200" v-if="field.editable"
            content="编辑" :enterable="false" placement="top-end" effect="light">
            <i class="el-icon-edit-outline" @click="editNodeModal(data, node, $event)"></i>
          </Tooltip>
          <Tooltip class="tool-item" popper-class="perfect-tree-tool-tip" :open-delay="200" v-if="field.deletable"
            content="删除" :enterable="false" placement="top-end" effect="light">
            <i class="el-icon-delete" @click="onRemoveNode(data, node)"></i>
          </Tooltip>
        </span>
      </span>
    </Tree>
    <!-- 弹窗 -->
    <Modal v-model="isModal" :showFooter="true" :title="modalTitle" resize :width="600">
      <div v-for="(key, index) in Object.keys(template)" :key="index" class="field-row">
        <label v-if="key != 'children'" class="field-label">{{ key }}:</label>
        <Input v-if="key != 'children'" size="small" v-model="template[key]" required></Input>
      </div>
      <span slot="footer" class="dialog-footer">
        <Button @click="isModal = false" size="mini">取 消</Button>
        <Button type="primary" size="mini" @click="onSureBtn">确 定</Button>
      </span>
    </Modal>
  </div>
</template>

<script>
import "xe-utils";
import { Modal } from "vxe-table";
import baseMixin from "./baseMixin";
import { Input, Button, Tree, Tooltip, MessageBox } from "element-ui";
export default {
  mixins: [baseMixin],
  components: { Modal, Input, Button, Tree, Tooltip, MessageBox },
  data() {
    return {
      isModal: false, // 弹出
      modalTitle: "", // 标题
      modalType: "", // add 和 edit模式
      clickNode: {}, // 节点的数据
      template: {},
      filterText: "",
      activeNode: "", //
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
  computed: {
    treeValue() {
      let { label, value } = this.field.defaultProps;
      return this.field.options.length > 0
        ? this.field.options
        : Array.isArray(this.value)
          ? this.value
          : [
            {
              [this.field.nodeKey]: this.uuid(),
              [label]: this.value,
              [value]: this.value,
            },
          ];
    },
    defaultCheckedKeys() {
      let defaultCheckedKeys = [];
      if (Array.isArray(this.value)) {
        defaultCheckedKeys = defaultCheckedKeys.concat(this.value);
      }
      defaultCheckedKeys = defaultCheckedKeys.concat(
        this.field.defaultCheckedKeys
      );
      return defaultCheckedKeys;
    },
  },
  methods: {
    defaultFieldAttr() {
      return {
        options: [], // 树数据
        nodeKey: "id", // 节点id
        defaultProps: {
          // 字段对应关系
          label: "label",
          value: "value",
        },
        isExpandAll: true, // 展开全部
        isShowCheckbox: false, // 显示复选框
        checkedKeys: [], // 已经选择的key值
        onlyCheckedKeys: false, // 值仅仅只要全部选中的，排除半选
        isShowSearch: false, // 开启搜索功能
        isShowIcon: true, // 是否显示图标
        onlyClickLeaf: true, // 仅仅枝叶可以单击
        editable: false,
        deletable: false,
        addable: false,
        draggable: false, // 开启拖拽
        addSibling: false,
        theme: "#409eff",
        expandIcon: "el-icon-folder-opened",
        narrowIcon: "el-icon-folder",
        leafIcon: "el-icon-document",
        template: `{ "id": null, "label": "", "value": ""}`, // 节点模板
        showAddTemplate: false, // 显示新增模板
        defaultCheckedKeys: [], // 默认勾选的值
      };
    },
    onActiveNode(data) {
      if (this.field.isShowCheckbox || this.field.options.length == 0)
        return false;
      else if (data[this.field.nodeKey] == this.value) return true;
      return false;
    },
    editNodeTitle() { },
    // 点击节点，即单选时使用
    onNodeClick(data) {
      if (this.field.isShowCheckbox || this.field.options.length == 0) return;

      this.changeValue(data[this.field.nodeKey]);
    },
    onCheckedNode() {
      // 当是多选框时，返回id
      // 方法一： https://www.cnblogs.com/qing619/p/8144584.html
      // 方法二： https://www.bilibili.com/read/cv5259145/
      const treeRef = this.$refs["pefectTree"];
      let getCheckedKeys = treeRef.getCheckedKeys();
      if (!this.field.onlyCheckedKeys) {
        let getHalfCheckedKeys = treeRef.getHalfCheckedKeys();
        getHalfCheckedKeys.map((item) => {
          if (!getCheckedKeys.includes(item)) getCheckedKeys.push(item);
        });
      }
      this.changeValue(getCheckedKeys);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data[this.field.defaultProps.label].indexOf(value) !== -1;
    },
    onRemoveNode(data, node) {
      if (this.treeValue.length == 1) return;
      MessageBox.confirm("此操作将永久删除节点, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const parent = node.parent;
          const children = parent.data.children || parent.data;
          const index = children.findIndex(
            (item) => item[this.field.nodeKey] === data[this.field.nodeKey]
          );
          children.splice(index, 1);
        })
        .catch(() => { });
    },
    onSureBtn() {
      switch (this.modalType) {
        case "add":
          this.addNode();
          break;
        case "edit":
          this.editNode();
          break;
        case "addSibling":
          this.addSiblingNode();
          break;
      }
    },
    uuid() {
      return Math.random().toString(16).slice(2, 12);
    },
    addNodeModal(data, node) {
      this.isModal = true;
      this.modalTitle = "新增";
      this.modalType = "add";
      this.clickNode = { data, node };
      this.template = JSON.parse(this.field.template);
      this.template[this.field.nodeKey] = this.uuid();
    },
    addNode() {
      let { data, node } = this.clickNode;
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(this.template);
      this.isModal = false;
    },
    editNodeModal(data, node) {
      this.isModal = true;
      this.modalTitle = "编辑";
      this.modalType = "edit";
      this.clickNode = { data, node };
      this.template = JSON.parse(JSON.stringify(data));
    },
    editNode() {
      for (let key in this.template) {
        this.$set(this.clickNode.data, key, this.template[key]);
      }
      this.isModal = false;
    },
    addSibling() {
      this.isModal = true;
      this.dialogEditModel = false;
      this.modalTitle = "新增兄弟节点";
      this.modalType = "addSibling";
      this.values.pid = 0;
      this.template = JSON.parse(this.field.template);
      this.template[this.field.nodeKey] = Math.random()
        .toString(16)
        .slice(2, 12);
    },
    addSiblingNode() {
      this.treeValue.push(this.template);
      this.isModal = false;
    },
  },
};
</script>

<style lang="scss">
@import "vxe-table/styles/variable.scss";
@import "vxe-table/styles/modal.scss";

// adjust element css
.perfect-tree-tool-tip {
  border-radius: 0;
  padding: 2px 4px;
}

// perfect-tree css
.perfect-tree-wrapper {
  width: 100%;
  margin: 0 2px;
  background: #fff;

  .field-row {
    display: flex;
    margin-bottom: 3px;
    align-items: center;

    .field-label {
      width: 60px;
      text-align: right;
      margin-right: 4px;
    }
  }

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

    .active-node {
      color: #4f9ffe;
    }
  }

  .perfect-tree-node:hover .tool-item {
    display: block;
  }
}
</style>