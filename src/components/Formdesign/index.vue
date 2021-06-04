<template>
  <div class="form-design">
    <div class="design-header">表单设计器</div>
    <div class="design-content">
      <split-layout
        first-panel-size="210px"
        last-panel-size="280px"
        :hasLastPanel="true"
      >
        <template slot="first">
          <!-- 基本组件 -->
          <div class="base-widgets">
            <div class="widget-title">基础字段</div>
            <draggable
              tag="div"
              v-bind="dragOptions()"
              v-model="widgetsMeta"
              :clone="cloneDragField"
              class="base-components"
            >
              <span
                v-for="(widgetItem, index) in widgetsMeta"
                :key="index"
                class="base-component-item"
                >{{ widgetItem.title }}</span
              >
            </draggable>
          </div>
          <!-- 布局组件 -->
          <div class="base-widgets">
            <div class="widget-title">布局组件</div>
            <draggable
              tag="div"
              v-bind="dragOptions()"
              v-model="layoutMeta"
              :clone="cloneDragField"
              class="base-components"
            >
              <span
                v-for="(layoutItem, index) in layoutMeta"
                :key="index"
                class="base-component-item"
                >{{ layoutItem.title }}</span
              >
            </draggable>
          </div>
        </template>
        <template slot="center">
          <RichForm
            class="design-canvas"
            :schema="schema"
            :form="form"
            :values="values"
            :isDesign="true"
          ></RichForm
        ></template>
        <template slot="last">
          <el-tabs v-model="activeTabName" @tab-click="onTabClick">
            <el-tab-pane label="属性配置" name="attribute" class="design-tab"
              >用户管理</el-tab-pane
            >
            <el-tab-pane label="校验规则" name="rules" class="design-tab"
              >配置管理</el-tab-pane
            >
          </el-tabs>
        </template>
      </split-layout>
    </div>
  </div>
</template>

<script>
import RichForm from "../Richform";
import Draggable from "vuedraggable";
import SplitLayout from "../SplitLayout";
import { layout, widgets } from "./meta";
export default {
  components: { Draggable, SplitLayout, RichForm },
  data() {
    return {
      form: {
        border: true, // 显示边框
        grid: true, // 表单内部栅栏
        labelSuffix: true, // 字段标题后缀内容，默认' : '
        labelWidth: "100px", // 标签宽度,默认50px
        validator: "input", // submit
        labelAlign: "right", // 标签对齐, 默认右对齐, 可选左对齐left
        labelInline: true, // 字段标题显示位置, 默认true左侧left,false显示在top上方
        layout: [],
      },
      values: {},
      schema: {},
      activeTabName: "attribute",
      layoutMeta: layout,
      widgetsMeta: widgets,
    };
  },
  methods: {
    // 拖拽option参数：https://github.com/SortableJS/Sortable#options
    // 拖拽迁移记录：https://github.com/SortableJS/Vue.Draggable/blob/master/documentation/migrate.md#options-props
    dragOptions() {
      return {
        animation: 0, // 动画效果
        group: {
          name: "formdesign", // 两个draggable要相互拖拽必须设置相同
          pull: "clone", // 克隆方式拖拽出去
          put: false, // 禁止拖拽回来
          ghostClass: "design-field-ghost",
        },
        sort: false, // 禁止排序
      };
    },
    onTabClick(tab, event) {
      // console.log(tab, event);
    },
    // 布局克隆前预设处理
    cloneDragField(dragItem) {
      let newdragItem = JSON.parse(JSON.stringify(dragItem));
      newdragItem.designId = Math.random().toString(16).slice(2, 14);
      return newdragItem;
    },
  },
};
</script>

<style lang="scss">
.form-design {
  height: 100%;
  display: flex;
  flex-direction: column;
  .el-tabs__item {
    width: 140px;
    text-align: center;
  }

  > .design-header {
    height: 55px;
    line-height: 55px;
    padding: 0 10px;
    color: #fff;
    background: linear-gradient(90deg, #1179f4 45%, #079dc8, #01b3ac);
  }
  > .design-content {
    height: 100%;
    position: relative;
    .base-widgets {
      .widget-title {
        height: 25px;
        line-height: 25px;
        font-size: 13px;
        margin-left: 3px;
      }
      .base-components {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        > .base-component-item {
          height: 30px;
          line-height: 30px;
          width: 49.5%;
          text-align: center;
          font-size: 12px;
          background: #eff0f3;
          margin: 3px 0;
          cursor: move;
          box-sizing: border-box;
        }
        > .base-component-item:hover {
          border: 1px dashed #01b3ac;
        }
      }
    }
    .design-canvas {
    }
  }
}
</style>