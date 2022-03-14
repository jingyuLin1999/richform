<!--
  字段组件

-->
<template>
  <div
    v-if="!field.hide"
    :class="['field-wrapper', form.grid ? 'field-border-top' : '']"
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
        :class="[
          'title-wrapper',
          'label-' + (form.labelAlign || 'right'),
          form.labelInline ? 'label-hori' : 'label-vert',
        ]"
        :style="{
          width: form.labelInline ? form.labelWidth : '100%',
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
          effect="light"
        >
          <i class="el-icon-question"></i>
        </Tooltip>
      </div>
      <div
        v-if="form.grid && form.labelInline"
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
          @change="onChange"
          @widgetHeight="getWidgetHeight"
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
import { path, pick } from "ramda";
import { Tooltip } from "element-ui";
import eventbus from "./utils/eventbus";
import DesignMixin from "./utils/designMixin";
import CommonMixin from "./utils/commonMixin";
import AJV, { localize as localizeErrors } from "./utils/validator";
export default {
  name: "field",
  components: { Tooltip },
  inject: ["dependencies", "requireds", "isDeepValues", "regExpFields"],
  mixins: [DesignMixin, CommonMixin],
  props: {
    schema: { type: Object, default: () => ({}) },
    field: { type: Object, default: () => ({}) }, // 布局字段
    isDesign: { type: Boolean, default: false },
    form: { type: Object, default: () => ({}) },
    values: { type: Object, default: () => ({}) },
    fieldErrors: { type: Object, default: () => ({}) },
    hideFields: { type: Object, default: () => ({}) },
    realyValues: { type: Object, default: () => ({}) },
    colors: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      fieldSchema: {}, // 字段的schema
      lableRightBorder: 0, // 标签右侧的边
      errorFieldsHistory: [], // 记录上一次历史错误字段，用于消除本次必填和错误信息
    };
  },
  mounted() {
    this.load();
  },
  watch: {
    realyValues: {
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
        // to handle bug of after build error.
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
      const labelHeight = this.$refs.fieldLabel.offsetHeight;
      const height = labelHeight > valueHeight ? labelHeight : valueHeight;
      this.$set(this.$data, "lableRightBorder", height);
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
      // 引用地址不能改变，直接返回
      if (!this.isFriendValue) return;
      // TODO 提供两种模式，树型结构或普通结构
      // 有值则不需要创建，即values的优先级大于default的值
      if (this.values[this.field.name] != undefined && !this.isDeepValues)
        return;
      // 是否立即触发验证
      const defaultValue = this.isDeepValues
        ? path(this.field.name.split("."), this.realyValues)
        : this.values[this.field.name] ||
          this.fieldSchema.default ||
          this.field.default;
      // 若有默认值，则需要直接进行校验
      if (defaultValue)
        this.validateField(this.field.name, this.fieldSchema, defaultValue);

      // 生成默认值
      this.$set(
        this.values,
        this.field.name,
        defaultValue
          ? defaultValue
          : this.friendDefaultValue(this.fieldSchema.type)
      );
    },
    pickFieldSchema(fieldName) {
      const fieldSchema =
        path(fieldName.split("."), this.schema.then.properties) ||
        path(fieldName.split("."), this.schema.properties) ||
        {};
      return fieldSchema;
    },
    removeErrorAndRequire() {
      // 先根据错误信息
      this.errorFieldsHistory.map((nameKey) => {
        // 必填
        let requireIndex = this.requireds.findIndex(
          (require) => require == nameKey
        );
        if (requireIndex != -1) this.$delete(this.requireds, requireIndex);
        // 错误
        if (this.fieldErrors[nameKey]) this.$delete(this.fieldErrors, nameKey);
      });
      this.errorFieldsHistory = [];
    },
    validateField(fieldName, schema, value) {
      try {
        schema = this.pickFieldSchema(fieldName) || schema;
        if (!Object.keys(schema).length) return;
        const pickSchema = pick(
          ["errorMessage", "if", "else", "then", "allOf", "anyOf", "oneOf"],
          this.schema
        );
        let require = [];
        if (schema.require) require.push(fieldName);
        const unitSchema = {
          type: "object",
          properties: {
            [fieldName]: schema,
          },
          // required: require,
          ...pickSchema,
        };
        let valid = AJV.validate(unitSchema, this.values);
        localizeErrors(AJV.errors); // 将错误信息转化成中文

        if (valid) this.$delete(this.fieldErrors, fieldName);
        // 验证正常需要从错误池中移除
        else {
          AJV.errors.map((errorItem) => {
            let fieldName = errorItem.instancePath
              .split("/")
              .slice(1, errorItem.instancePath.length)
              .join("/");

            // 收集错误字段
            this.errorFieldsHistory.push(fieldName);
            // 收集是否有必填信息
            let fieldSchema = this.pickFieldSchema(fieldName);
            if (
              Object.keys(fieldSchema).length > 0 &&
              fieldSchema.require &&
              !this.requireds.includes(fieldName)
            )
              this.requireds.push(fieldName);
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
        console.error("单个字段验证错误了：" + e);
      }
    },
    onChange(fieldName, value, schema) {
      this.emit("field:change", fieldName, value);
      this.removeErrorAndRequire();
      this.validateField(fieldName, schema, value);
      this.onDispatch(fieldName);
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