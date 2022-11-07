<!--
  字段组件

-->
<template>
  <!-- 不能用v-if，否则若开始为隐藏，后续无法切换 -->
  <div
    v-show="!field.hide"
    :class="['field-wrapper', field.name, form.grid ? 'field-border-top' : '']"
  >
    <div
      :class="[
        'field',
        form.labelInline ? 'label-inline' : '',
        form.grid ? 'field-border' : '',
        field.activeDesign && isDesign ? 'active-design' : '',
        form.labelInline && !form.grid ? 'inline-no-grid' : '',
      ]"
      @click="onClickedItem(field)"
    >
      <div
        v-show="field.widget != 'button'"
        :class="[
          'title-wrapper',
          'label-' + (form.labelAlign || 'right'),
          form.labelInline ? 'label-hori' : 'label-vert',
        ]"
        :style="{
          width: form.labelInline
            ? isShyTitle
              ? form.labelWidth
              : '0px'
            : '100%',
        }"
      >
        <div
          ref="fieldLabel"
          v-if="isShyTitle"
          :class="[
            'label-title',
            fieldSchema.require || requireds.includes(field.name)
              ? 'required-field'
              : '',
          ]"
          :style="{ color: colors.fontColor }"
        >
          {{ fieldTitle }}
        </div>
        <span
          class="label-suffix"
          :style="{ color: colors.fontColor }"
          v-if="
            isShyTitle &&
            form.labelSuffix.length > 0 &&
            Object.keys(this.field).length > 0
          "
          >{{ form.labelSuffix }}</span
        >
        <Tooltip
          v-if="fieldSchema.description || field.description"
          :content="fieldSchema.description || field.description"
          class="field-question"
          placement="bottom"
          :effect="isDark ? 'dark' : 'light'"
        >
          <i class="el-icon-question"></i>
        </Tooltip>
      </div>
      <div
        v-if="form.grid && form.labelInline"
        v-show="field.showLabel != 'button'"
        class="label-right-border"
        :style="{ height: lableRightBorder + 'px' }"
      ></div>
      <div
        :class="[
          'field-value',
          isDesign ? 'field-mask' : '',
          !form.labelInline ? 'field-value-vert' : 'field-value-hori',
        ]"
      >
        <component
          :is="asyncComponent"
          :schema="fieldSchema"
          :values="values"
          :field="field"
          :colors="colors"
          :fieldErrors="fieldErrors"
          :hideFields="hideFields"
          :isDark="isDark"
          @change="onChange"
          @buttonEvent="onButtonEvent"
          @widgetHeight="getWidgetHeight"
        />
        <!-- 错误信息 -->
        <div
          class="error-message"
          v-if="fieldErrors[field.name] && field.showError != false"
        >
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
import { path, pick } from "ramda";
import { Tooltip } from "element-ui";
import eventbus from "./utils/eventbus";
import DesignMixin from "./utils/designMixin";
import CommonMixin from "./utils/commonMixin";
import AJV, { localize as localizeErrors } from "./utils/validator";
export default {
  name: "field",
  components: { Tooltip },
  inject: [
    "dependencies",
    "requireds",
    "isDeepValues",
    "regExpFields",
    "pickDeepValueKeys",
  ],
  mixins: [DesignMixin, CommonMixin],
  props: {
    schema: { type: Object, default: () => ({}) },
    field: { type: Object, default: () => ({}) }, // 布局字段
    isDesign: { type: Boolean, default: false },
    form: { type: Object, default: () => ({}) },
    values: { type: Object, default: () => ({}) },
    fieldErrors: { type: Object, default: () => ({}) },
    hideFields: { type: Object, default: () => ({}) },
    colors: { type: Object, default: () => ({}) },
    isDark: { type: Boolean, default: false },
  },
  data() {
    return {
      fieldSchema: {}, // 字段的schema
      lableRightBorder: 0, // 标签右侧的边
      errorFieldsHistory: [], // 记录上一次历史错误字段，用于消除本次必填和错误信息
      fieldGrandfatherSchema: null, // schema的爷爷对象
    };
  },
  mounted() {
    this.load();
  },
  watch: {
    values: {
      handler() {
        if (!this.isDeepValues) return;
        this.createValue();
      },
      deep: true,
    },
  },
  computed: {
    asyncComponent() {
      let widget = this.field.widget || this.fieldSchema.widget;
      if (!widget) return;
      return () => ({
        // to handle bug in buildding.
        component: new Promise(async (resolve) => {
          resolve(await require(`./widgets/${widget}`));
        }),
        delay: 2000,
        timeout: 3000,
      });
    },
    fieldTitle() {
      this.pickSchema();
      return this.field.title || this.fieldSchema.title;
    },
    isShyTitle() {
      // 隐藏标签
      return !(this.field.showTitle != undefined && !this.field.showTitle);
    },
  },
  methods: {
    load() {
      this.pickSchema();
      this.pickRequireds();
      this.createValue();
    },
    getWidgetHeight(valueHeight) {
      this.$nextTick(() => {
        const labelDom = this.$refs.fieldLabel;
        if (labelDom) {
          const labelHeight = labelDom.offsetHeight;
          const height = labelHeight > valueHeight ? labelHeight : valueHeight;
          this.$set(this.$data, "lableRightBorder", height);
        }
      });
    },
    emit() {
      // 全局总线
      if (arguments.length > 0) {
        arguments[0] = `${this.formId}:${arguments[0]}`;
        eventbus.$emit(...arguments);
      }
    },
    pickSchema() {
      // schema不是必须的,若无field就无法查找
      if (
        Object.keys(this.schema).length == 0 ||
        !Object.keys(this.field).length
      )
        return;
      let schemaKeys = this.field.name
        .split(".")
        .join(".properties.")
        .split(".");
      schemaKeys.unshift("properties");
      let lastPropIdx = schemaKeys.lastIndexOf("properties");
      let schemaObj = this.schema;
      for (let index = 0; index < schemaKeys.length; index++) {
        let key = schemaKeys[index];
        let value = schemaObj[key];
        if (value != undefined) schemaObj = value;
        else {
          // 不存在则创建对应的schema结构
          schemaObj[key] = {};
          schemaObj = schemaObj[key];
        }
        if (index == lastPropIdx - 1) {
          schemaObj.type = "object";
          if (!schemaObj.required) schemaObj.required = [];
          this.fieldGrandfatherSchema = schemaObj;
        }
      }
      if (!this.fieldGrandfatherSchema)
        this.fieldGrandfatherSchema = this.schema;
      this.fieldSchema = schemaObj;
    },
    pickRequireds() {
      if (!this.fieldSchema.require && !this.field.require) return;
      if (!this.requireds.includes(this.field.name))
        this.requireds.push(this.field.name);
      // 添加到对应scheme的required字段
      let schemaRequired = this.field.name.split(".");
      schemaRequired = schemaRequired[schemaRequired.length - 1];
      if (!this.fieldGrandfatherSchema.required.includes(schemaRequired))
        this.fieldGrandfatherSchema.required.push(schemaRequired);
    },
    createValue() {
      // 深度模式收集键值
      if (
        this.isDeepValues &&
        !this.pickDeepValueKeys.includes(this.field.name)
      )
        this.pickDeepValueKeys.push(this.field.name);
      // 提供两种模式，树型结构或普通结构
      // 有值则不需要创建，即values的优先级大于default的值
      let fieldValue = this.isDeepValues
        ? path(this.field.name.split("."), this.values)
        : this.values[this.field.name];
      if (fieldValue != undefined && fieldValue != null) return;
      // 是否立即触发验证
      let defaultValue = this.isDeepValues
        ? path(this.field.name.split("."), this.values)
        : this.values[this.field.name] ||
          this.fieldSchema.default ||
          this.field.default;
      // 生成默认值
      let friendValue =
        defaultValue != null && defaultValue != undefined
          ? defaultValue
          : this.friendDefaultValue(this.fieldSchema.type);
      if (this.isDeepValues)
        this.deepSetValue(this.field.name.split("."), this.values, friendValue);
      else this.$set(this.values, this.field.name, friendValue);
      // 若有默认值，则需要直接进行校验
      if (defaultValue)
        this.validateField(this.field.name, this.fieldSchema, defaultValue);
    },
    pickFieldSchema(fieldName) {
      let schemaKeys = fieldName.split(".").join(".properties.").split(".");
      const fieldSchema =
        path(schemaKeys, this.schema.then.properties) ||
        path(schemaKeys, this.schema.properties) ||
        {};
      return fieldSchema;
    },
    removeErrorAndRequire() {
      // 先根据错误信息
      this.errorFieldsHistory.map((nameKey) => {
        // 错误
        if (this.fieldErrors[nameKey]) this.$delete(this.fieldErrors, nameKey);
      });
      this.errorFieldsHistory = [];
    },
    validateField(fieldName, schema, value) {
      try {
        let pickSchema = pick(
          ["errorMessage", "if", "else", "then", "allOf", "anyOf", "oneOf"],
          this.schema
        );
        let fieldSchema = {
          type: "object",
          properties: {},
          ...pickSchema,
        };
        let schemaKeys = fieldName.split(".").join(".properties.").split(".");
        schemaKeys.unshift("properties");
        let fieldSchemaT = fieldSchema;
        let lastPropIdx = schemaKeys.lastIndexOf("properties");
        for (let index = 0; index < schemaKeys.length; index++) {
          let key = schemaKeys[index];
          let curSchema = fieldSchemaT[key];
          if (curSchema != undefined) fieldSchemaT = curSchema;
          else if (index == schemaKeys.length - 1) {
            fieldSchemaT[key] = schema;
          } else {
            fieldSchemaT[key] = {};
            fieldSchemaT = fieldSchemaT[key];
          }
          if (index == lastPropIdx - 1) {
            fieldSchemaT.type = "object";
          }
        }
        let valid = AJV.validate(fieldSchema, this.values);
        localizeErrors(AJV.errors); // 将错误信息转化成中文
        if (valid) this.$delete(this.fieldErrors, fieldName);
        // 验证正常需要从错误池中移除
        else {
          AJV.errors.map((errorItem) => {
            let fieldName = errorItem.dataPath
              .split("/")
              .slice(1, errorItem.dataPath.length)
              .join(".");
            // 收集错误字段
            this.errorFieldsHistory.push(fieldName);
            // 错误信息收集
            if (
              fieldName != this.field.name &&
              this.fieldErrors[this.field.name]
            )
              this.$delete(this.fieldErrors, this.field.name); // 验证正常需要从错误池中移除
            this.$set(this.fieldErrors, fieldName, errorItem.message);
          });
        }
      } catch (e) {
        console.error("单个字段验证错误了：", e);
      }
    },
    onChange(fieldName, value, schema) {
      this.emit("field:change", fieldName, value);
      this.removeErrorAndRequire();
      this.validateField(fieldName, schema, value);
      this.onDispatch(fieldName);
    },
    onButtonEvent(info) {
      this.emit("action", info);
    },
  },
};
</script>

<style lang="scss">
@import "./vars.scss";
.field-wrapper {
  position: relative;
  color: $field-font-color;
  box-sizing: border-box;
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
  > .inline-no-grid {
    margin-bottom: 4px;
  }
  > .field-border {
    border: 1px solid $form-border-color;
    border-top: 0;
  }
  > .field {
    align-items: center;
    position: relative;
    min-height: 48px;
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
    .label-center {
      justify-content: center;
      padding-right: 4px;
      box-sizing: border-box;
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
    // 设计模式是否开启遮罩，暂时去掉
    > .field-mask::before {
      content: "";
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 99;
      left: 0;
      top: 0;
    }
    > .label-right-border {
      width: 1px;
      background: $form-border-color;
    }
    > .field-value {
      display: flex;
      align-items: center;
      box-sizing: border-box;
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
        bottom: -13px;
        z-index: 999;
      }
    }
    // 当是上下布局时，取消padding-top
    > .field-value-vert {
      padding-top: 1px;
      padding-left: 4px;
      display: flex;
      align-items: flex-start;
      margin-bottom: 4px;
      > .error-message {
        bottom: -13px;
      }
    }
    // 去除element自带的margin-bottom
    .el-form-item {
      margin: 0;
    }
  }
}
</style>