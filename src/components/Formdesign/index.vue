<template>
  <div class="form-design">
    <div class="design-header">
      <h1 class="title">表单设计器</h1>
      <div class="tools">
        <i class="el-icon-document-add tool" @click="onSubmit"> 生成JSON</i>
        <div class="tool" @click="onPreview">
          <i class="el-icon-view" v-if="isDesign"> 预览</i>
          <i class="el-icon-setting" v-else> 设计</i>
        </div>
        <i class="el-icon-s-promotion tool" @click="onSubmit"> 保存</i>
      </div>
    </div>
    <div class="design-content">
      <split-layout
        first-panel-size="210px"
        last-panel-size="280px"
        :hasLastPanel="true"
        :lastPanelCanResize="false"
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
            :schema="design.schema"
            :form="design.form"
            :values="design.values"
            :isDesign="isDesign"
            @designItem="clickedField"
          ></RichForm
        ></template>
        <template slot="last">
          <el-tabs
            class="tab-attribute"
            v-model="activeTabName"
            @tab-click="onTabClick"
          >
            <el-tab-pane label="属性配置" name="attribute" class="design-tab">
              <RichForm
                :schema="attribute.schema"
                :form="attribute.form"
                :values="attribute.values"
                :isDesign="false"
              ></RichForm>
            </el-tab-pane>
            <el-tab-pane label="校验规则" name="rules" class="design-tab">
              <RichForm
                :schema="rules.schema"
                :form="rules.form"
                :values="rules.values"
              ></RichForm
            ></el-tab-pane>
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
import { layout, widgets } from "./meta/layout";
export default {
  components: { Draggable, SplitLayout, RichForm },
  props: {
    fields: { type: Array, default: () => [] }, // 表的字段
  },
  data() {
    return {
      isDesign: true,
      designItem: {}, // 触发的item
      design: {
        // 设计模式
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
        schema: {
          $schema: "http://json-schema.org/draft-07/schema#",
          title: "表单设计器",
          description: "form design",
          type: "object",
          properties: {},
        },
      },
      rules: {
        form: {},
        values: {},
        schema: {},
      },
      attribute: {
        // 属性配置
        form: {},
        values: {},
        schema: {},
      },
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
          dragClass: "design-sortable-drag", // 排序背景显示
        },
        sort: false, // 禁止排序
      };
    },
    onTabClick(tab, event) {
      // console.log(tab, event);
    },
    async clickedField(item) {
      try {
        this.designItem = item;
        let { attribute, rules } = await import(
          `./meta/${item.widget.toLowerCase()}`
        );
        this.setAttribute(item, attribute);
        this.setRules(item, rules);
      } catch (e) {
        this.$set(this.attribute, "form", {});
        console.warn("加载表单字段元数据错误：" + e);
      }
    },
    setAttribute(item, attribute) {
      let attributeMeta = JSON.parse(JSON.stringify(attribute));
      let assignValues = Object.assign({}, item, attributeMeta.values);
      for (let key in assignValues) {
        this.$set(item, key, assignValues[key]);
      }
      this.$set(this.attribute, "values", item);
      this.$set(this.attribute, "form", attributeMeta.form);
    },
    setRules(item, rules) {
      // TODO schema由数据库字段生成
      let rulesMeta = JSON.parse(JSON.stringify(rules));
      let designRules = this.design.schema.properties;
      let ruleValue = rulesMeta.values;
      if (designRules[item.name])
        Object.assign(ruleValue, designRules[item.name]);
      this.$set(this.rules, "values", ruleValue);
      this.$set(this.design.schema.properties, item.name, this.rules.values);
      this.$set(this.rules, "form", rulesMeta.form);
    },
    // 布局克隆前预设处理
    cloneDragField(dragItem) {
      let newdragItem = JSON.parse(JSON.stringify(dragItem));
      newdragItem.designId = Math.random().toString(16).slice(2, 14);
      newdragItem.name = newdragItem.name + newdragItem.designId;
      return newdragItem;
    },
    onPreview() {
      this.$set(this.designItem, "activeField", false);
      this.$set(this.$data, "isDesign", !this.isDesign);
    },
    onSubmit() {},
  },
};
</script>

<style lang="scss">
.form-design {
  height: 100%;
  display: flex;
  flex-direction: column;
  .design-sortable-drag {
    background: #f00;
  }
  // 修改属性配置elementUi tab的样式
  .tab-attribute {
    .el-tabs__item {
      width: 135px;
      text-align: center;
    }
  }
  > .design-header {
    height: 55px;
    padding: 0 10px;
    color: #fff;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(90deg, #1179f4 45%, #079dc8, #01b3ac);
    .title {
      margin: 0;
      padding: 0;
      font-size: 19px;
      height: 55px;
      line-height: 55px;
    }
    .tools {
      display: flex;
      font-size: 14px;
      > .tool {
        cursor: pointer;
        margin-left: 10px;
      }
    }
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