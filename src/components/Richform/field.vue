<!--
  字段组件

-->
<template>
  <div
    v-if="!field.hide"
    :class="['field-wrapper', form.grid ? 'field-border-top' : '']"
  >
    <!-- https://github.com/SortableJS/Vue.Draggable/issues/1008#issuecomment-782545024 -->
    <div
      :class="[
        'field',
        form.labelInline ? 'label-inline' : '',
        form.grid ? 'field-border' : '',
        field.activeDesign && isDesign ? 'active-design' : '',
      ]"
      @click="onClickedItem(field)"
    >
      <div
        :class="[
          'title-wrapper',
          form.labelAlign == 'right' ? 'label-right' : '',
          form.labelInline ? 'label-hori' : 'label-vert',
        ]"
        :style="{
          'min-height': form.grid && form.labelInline ? '50px' : '26px',
          width: form.labelInline ? form.labelWidth : '100%',
        }"
      >
        <div
          :class="['label-title', fieldSchema.require ? 'required-field' : '']"
        >
          {{ fieldTitle }}
        </div>
        <span
          class="label-suffix"
          v-if="form.labelSuffix && Object.keys(this.field).length > 0"
          >:</span
        >
        <el-tooltip
          v-if="fieldSchema.description || field.description"
          :content="fieldSchema.description || field.description"
          class="field-question"
          placement="bottom"
          effect="light"
        >
          <i class="el-icon-question"></i>
        </el-tooltip>
      </div>
      <div
        :class="[
          'field-value',
          isDesign ? 'field-mask' : '',
          !form.labelInline ? 'field-value-vert' : 'field-value-hori',
          form.grid && form.labelInline ? 'label-border' : '',
        ]"
      >
        <component
          :is="asyncComponent"
          :schema="fieldSchema"
          :values="values"
          :field="field"
          :fieldErrors="fieldErrors"
          :hideFields="hideFields"
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
      v-if="isDesign && field.isClicked"
      @click="onDeleteItem(form, field)"
    >
      <i class="el-icon-delete"></i>
    </span>
  </div>
</template>

<script>
import eventbus from "./utils/eventbus";
import DesignMixin from "./utils/designMixin";
import CommonMixin from "./utils/commonMixin";
import AJV, { localize as localizeErrors } from "./utils/validator";

export default {
  name: "field",
  inject: ["dependencies", "requireds"],
  mixins: [DesignMixin, CommonMixin],
  props: {
    schema: { type: Object, default: () => ({}) },
    field: { type: Object, default: () => ({}) }, // 布局字段
    isDesign: { type: Boolean, default: false },
    form: { type: Object, default: () => ({}) },
    values: { type: Object, default: () => ({}) },
    fieldErrors: { type: Object, default: () => ({}) },
    hideFields: { type: Object, default: () => ({}) },
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
      this.pickRequireds();
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
      // schema不是必须的或无field就无法查找
      if (
        Object.keys(this.schema).length == 0 ||
        !Object.keys(this.field).length
      )
        return;
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
    pickRequireds() {
      if (!this.fieldSchema.require) return;
      if (!this.requireds.includes(this.field.name))
        this.requireds.push(this.field.name);
    },
    createValue() {
      // TODO 提供两种模式，树型结构或普通结构
      // 有值则不需要创建，即values的优先级大于default的值
      if (this.values[this.field.name]) return;
      // 是否立即触发验证
      const defaultValue =
        this.values[this.field.name] ||
        this.fieldSchema.default ||
        this.field.default;
      if (defaultValue)
        // 若有默认值，则需要直接进行校验
        this.validateField(this.field.name, this.fieldSchema, defaultValue);
      this.$set(
        // 生产默认值
        this.values,
        this.field.name,
        defaultValue ? defaultValue : this.friendValue(this.fieldSchema.type)
      );
    },
    validateField(fieldName, schema, value) {
      if (!Object.keys(schema).length) return;
      let require = [];
      if (schema.require) require.push(fieldName);
      const schemab = {
        type: "object",
        properties: {
          [fieldName]: schema,
        },
        required: require,
      };
      let valid = AJV.validate(schemab, this.values);
      if (valid || !value) {
        this.$delete(this.fieldErrors, fieldName); // 验证正常需要从错误池中移除
      } else {
        localizeErrors(AJV.errors); // 将错误信息转化成中文
        this.$set(this.fieldErrors, fieldName, AJV.errors[0].message); // 将错误信息添加到错误池中
      }
    },
    onChange(fieldName, value, schema) {
      this.emit("field:change", fieldName, value);
      this.validateField(fieldName, schema, value);
      this.onDispatch();
    },
  },
};
</script>

<style lang="scss">
@import "./vars.scss";
.field-wrapper {
  position: relative;
  color: $field-font-color;
  .required-field::before {
    content: "*";
    color: #f56c6c;
    margin-right: 0.2em;
    font-family: Verdana, Arial, Tahoma;
    font-weight: 400;
  }
  // 控制标签和字段是否在一行显示
  > .label-inline {
    display: flex;
  }
  > .field-border {
    border: 1px solid $form-border-color;
    border-top: 0;
  }
  > .field {
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
      border-left: 1px solid $form-border-color;
      padding: 8px 3px; // 错误占位符
    }
    // 控制标签和字段垂直显示
    > .label-vert {
      justify-content: flex-start;
      padding: 3px 0;
    }
    > .label-hori {
      // min-height: 40px;
    }
    // 设计模式，开启遮罩
    > .field-mask {
      width: 100%;
      position: relative;
    }
    > .field-mask::before {
      content: "";
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 99;
      left: 0;
      top: 0;
    }
    > .field-value {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      min-height: 50px; // 这个值需要和style中的值同步
      padding: 0 3px; // 边框,不能改成margin否则会溢出
      width: 100%;
      position: relative;
      > .error-message {
        font-size: 12px;
        height: 13px;
        line-height: 13px;
        color: #e83030;
        position: absolute;
        left: 0;
        bottom: -8px;
        z-index: 999;
      }
    }
    // 当是上下布局时，取消padding-top
    > .field-value-vert {
      padding-top: 1px;
      padding-left: 4px;
      display: flex;
      align-items: flex-start;
      margin-bottom: 3px;
      > .error-message {
        bottom: -1px;
      }
    }
    // 去除element自带的margin-bottom
    .el-form-item {
      margin: 0;
    }
  }
}
</style>