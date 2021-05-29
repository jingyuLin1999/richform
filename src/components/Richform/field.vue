<!--
  字段组件
-->
<template>
  <div :class="['field-wrapper', form.grid ? 'field-border-top' : '']">
    <div
      :class="[
        'field',
        form.labelInline ? 'label-inline' : '',
        form.grid ? 'field-border' : '',
      ]"
      @click="onClickedItem(field)"
    >
      <div
        :class="[
          'title-wrapper',
          form.labelAlign == 'right' ? 'label-right' : '',
          !form.labelInline ? 'label-vert' : 'label-hori',
          form.grid && form.labelInline ? 'label-border' : '',
        ]"
        :style="{ width: form.labelWidth }"
      >
        <div class="label-title">{{ fieldTitle }}</div>
        <span class="label-suffix" v-if="form.labelSuffix">:</span>
        <el-tooltip
          v-if="fieldSchema.description"
          :content="fieldSchema.description"
          class="field-question"
          placement="bottom"
          effect="light"
        >
          <i class="el-icon-question"></i>
        </el-tooltip>
      </div>
      <div
        :class="[
          'field-mask',
          'field-value',
          !form.labelInline ? 'field-value-vert' : 'field-value-hori',
        ]"
      >
        <component
          :is="asyncComponent"
          :schema="fieldSchema"
          :values="values"
          :field="field"
          @change="onChange"
        />
        <!-- 错误信息 -->
        <div class="error-message" v-if="fieldErrors[field.name]">
          <i class="el-icon-warning-outline"></i>
          <span>{{ fieldErrors[field.name] }}</span>
        </div>
      </div>
    </div>
    <!--拖拽-->
    <span
      class="design-draggable design-handle-move"
      v-if="isDesign && field.isClicked"
    >
      <i class="el-icon-rank design-handle-move"></i>
    </span>
    <!--复制-->
    <span
      class="design-copy"
      @click="onCopyItem(schema)"
      v-if="isDesign && field.isClicked"
    >
      <i class="el-icon-document-copy"></i>
    </span>
    <!--删除-->
    <span
      class="design-delete"
      @click="onDeleteItem(schema)"
      v-if="isDesign && field.isClicked"
    >
      <i class="el-icon-delete"></i>
    </span>
  </div>
</template>

<script>
import eventbus from "./utils/eventbus";
import DesignMixin from "./utils/designMixin";
import AJV, { localize as localizeErrors } from "./utils/validator";

export default {
  name: "field",
  inject: ["values", "schema", "fieldErrors", "form", "isDesign"],
  mixins: [DesignMixin],
  props: {
    field: { type: Object, default: () => ({}) }, // 布局字段
  },
  data() {
    return {
      fieldSchema: {}, // 字段的schema
    };
  },
  mounted() {
    this.load();
  },
  computed: {
    asyncComponent() {
      let widget = this.field.widget || this.fieldSchema.widget;
      if (!widget) return;
      return () => ({
        component: import(`./widgets/${widget}`),
        delay: 200,
        timeout: 3000,
      });
    },
    fieldTitle() {
      this.pickSchema();
      return this.field.title || this.fieldSchema.title;
    },
  },
  methods: {
    load() {
      this.pickSchema();
      this.createValue();
    },
    emit() {
      // 全局总线
      if (arguments.length > 0) {
        arguments[0] = `${this.formId}:${arguments[0]}`;
        eventbus.$emit(...arguments);
      }
    },
    pickSchema() {
      let schemaKeys = this.field.name
        .split(".")
        .join(".properties.")
        .split(".");
      let schemaObj = this.schema.properties;
      for (let index = 0; index < schemaKeys.length; index++) {
        let key = schemaKeys[index];
        let value = schemaObj[key];
        if (value != undefined) schemaObj = value;
        else return null;
      }
      this.fieldSchema = schemaObj;
    },
    createValue() {
      // TODO 提供两种模式，树型结构或普通结构
      // 是否立即触发验证
      const defaultValue =
        this.values[this.field.name] || this.fieldSchema.default;
      if (defaultValue)
        // 若有默认值，则需要直接进行校验
        this.validateField(this.field.name, this.fieldSchema, defaultValue);
      this.$set(
        // 生产默认值
        this.values,
        this.field.name,
        defaultValue ? defaultValue : null
      );
    },
    validateField(fieldName, schema, value) {
      if (!Object.keys(schema).length) return;
      let valid = AJV.validate(schema, value);
      if (valid || !value) {
        this.$delete(this.fieldErrors, fieldName); // 验证正常需要从错误池中移除
      } else {
        localizeErrors(AJV.errors); // 将错误信息转化成中文
        this.$set(this.fieldErrors, fieldName, AJV.errors[0].message); // 将错误信息添加到错误池中
      }
    },
    onChange(fieldName, value, schema) {
      this.validateField(fieldName, schema, value);
      this.emit("field:change", fieldName, value);
    },
  },
};
</script>

<style lang="scss">
@import "./vars.scss";
.field-wrapper {
  position: relative;
  margin-right: 5px;
  color: $field-font-color;
  // 控制标签和字段是否在一行显示
  > .label-inline {
    display: flex;
  }
  > .field-border {
    border: 1px solid $form-border-color;
    border-top: 0;
  }
  > .field {
    width: 100%;
    align-items: center;
    position: relative;
    > .title-wrapper {
      display: flex;
      align-items: center;
      word-break: break-all;
      > .label-title {
        margin-left: 5px;
        display: flex;
        align-items: center;
        overflow: hidden;
      }
      > .field-question {
        color: #13ce66;
        cursor: pointer;
        margin: 0 5px;
      }
    }
    // 标签右对齐
    .label-right {
      justify-content: flex-end;
      padding-right: 4px;
      box-sizing: border-box;
    }
    // 标签右边
    > .label-border {
      position: relative;
    }
    > .label-border::after {
      content: "";
      position: absolute;
      width: 1px;
      top: 0px;
      right: 0px;
      height: 100%;
      background: $form-border-color;
    }
    // 控制标签和字段垂直显示
    > .label-vert {
      margin-bottom: 6px;
    }
    > .label-hori {
      min-height: 64px;
    }
    > .field-mask {
      width: 100%;
    }
    > .field-value {
      position: relative;
      box-sizing: border-box;
      // 边框,不能改成margin否则会溢出
      padding: 10px 10px 14px 10px;
      > .error-message {
        font-size: 12px;
        height: 13px;
        line-height: 13px;
        color: #e83030;
        position: absolute;
        left: 0;
        bottom: 0px;
      }
    }
    // 当是上下布局时，取消padding-top
    > .field-value-vert {
      padding-top: 1px;
      padding-left: 4px;
    }
  }
}
</style>