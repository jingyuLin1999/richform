<template>
  <dl class="draggable-list-widget" :id="widgetId">
    <draggable v-bind="dragOptions()" :list="value">
      <dd
        class="draggable-list-item"
        v-for="(item, index) in value"
        :key="item.id"
      >
        <i
          :class="[
            'el-icon-s-operation',
            'draggable-list-icon',
            'list-handle-move',
          ]"
        ></i>
        <!-- 字符串 -->
        <Input
          class="input-draggable"
          v-if="typeof item == 'string'"
          :size="field.size"
          v-model="value[index]"
          :placeholder="value[index]"
        />
        <!-- 对象 -->
        <div
          v-else
          class="input-wrapper"
          v-for="(key, index) in Object.keys(item)"
          :key="index"
        >
          <Input
            class="input-draggable"
            v-if="field.editKeys && field.editKeys.includes(key)"
            v-model="item[key]"
            :size="field.size"
            :placeholder="key"
          />
        </div>
        <i
          v-if="field.showOperation"
          :class="['el-icon-remove', 'delete-list-icon']"
          @click="deleteItem(index)"
        ></i>
      </dd>

      <div
        v-show="field.showOperation"
        class="draggable-list-add"
        @click="addItem"
      >
        添加
      </div>
    </draggable>
  </dl>
</template>
<script>
import { Input } from "element-ui";
import baseMixin from "./baseMixin";
import Draggable from "vuedraggable";
export default {
  name: "DraggableListWidget",
  mixins: [baseMixin],
  components: { Draggable, Input },
  data() {
    return {
      id: 1,
    };
  },
  mounted() {
    if (!this.value) this.value = [];
    if (this.field.atLeastOne && this.value.length == 0) this.addItem();
    // 找出最大id
    for (let key in this.value) {
      let item = this.value[key];
      this.id = item.id > this.id ? item.id : this.id;
    }
  },
  methods: {
    // 定义一个规范化Schema的方法，用来为组件添加个性化的默认属性
    defaultFieldAttr() {
      return {
        idKey: "id", // id的键值
        size: "small", // "mini/medium"
        title: "拖拽列表",
        showLabel: false,
        icon: "el-icon-circle-plus", // 添加图标
        showOperation: true, // 是否显示操作图标
        template: { label: "", value: "" }, // 新增模板
        atLeastOne: true, // 选项至少要有一个
        editKeys: ["label", "value"], // 可编辑的键值
      };
    },
    // 增加项目
    addItem() {
      let template = null;
      if (Object.keys(this.field.template).length > 0) {
        template = JSON.parse(JSON.stringify(this.field.template));
        let key = ++this.id;
        template[this.field.idKey] = key.toString();
      } else if (typeof this.field.template == "string")
        template = this.field.template;
      else if (Array.isArray(this.field.template))
        template = JSON.parse(JSON.stringify(this.field.template));
      this.value.push(template);
      this.getWidgetHeight();
    },
    // 删除项目
    deleteItem(index) {
      if (this.value.length === 1 && this.field.atLeastOne) return;
      this.value.splice(index, 1);
      this.getWidgetHeight();
    },
    // 拖拽配置
    dragOptions() {
      return {
        sort: true,
        animation: 200,
        ghostClass: "ghost",
        handle: ".list-handle-move",
        easing: "cubic-bezier(1, 0, 0, 1)",
        group: {
          name: "draggablelist",
          put: false,
        },
      };
    },
  },
};
</script>

<style lang="scss">
.draggable-list-widget {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 0;
  padding: 0;
  .draggable-list-icon,
  .delete-list-icon {
    width: 30px;
    height: 30px;
    line-height: 30px;
    font-size: 25px;
    cursor: pointer;
  }
  .delete-list-icon {
    color: #fbc5c5;
  }
  .delete-list-icon:hover {
    color: #f56c6c;
  }
  .draggable-list-icon {
    color: #c8cbcc;
    cursor: move;
  }
  .draggable-list-item {
    display: flex;
    align-items: center;
    margin: 5px 0;
    .list-handel-move {
      color: #556567;
    }
    .input-draggable {
      min-width: 60px;
    }
    .input-wrapper {
      margin-right: 3px;
    }
  }
  .draggable-list-add {
    margin-top: 5px;
    font-size: 14px;
    color: #1890ff;
    cursor: pointer;
  }
}
</style>