<template>
  <div class="expression-widget">
    <Popover placement="bottom" title="" trigger="click" ref="popoverRef">
      <Input
        :class="['el-form-item', isError ? 'is-error' : '']"
        ref="expressionInput"
        v-model="expValue"
        clearable
        placeholder="输入条件表达式"
      ></Input>
      <div class="option-container">
        <template v-for="(obj, index) in cardOptions">
          <div class="option-item" :key="index" v-if="obj.show">
            <div
              class="title"
              :style="{ background: form.colors.btnBgColor || '#F5F7FA' }"
            >
              {{ obj.title }}
            </div>
            <perfect-scrollbar class="option-list">
              <div
                v-for="(item, index) in obj.options"
                :key="index"
                :class="['option', item.disabled ? 'disabled-option' : '']"
                @click="clickOption(item)"
              >
                {{ item.label }}
              </div>
            </perfect-scrollbar>
          </div>
        </template>
      </div>
      <Button slot="reference" :size="field.size"> {{ buttonLable }}</Button>
      <Button type="primary" size="small" class="sure-exp" @click="onSureExp"
        >确定</Button
      >
    </Popover>
  </div>
</template>

<script>
import baseMixin from "./baseMixin";
import { Input, Button, Popover } from "element-ui";
import { PerfectScrollbar } from "vue2-perfect-scrollbar";
export default {
  mixins: [baseMixin],
  components: { Input, Button, Popover, PerfectScrollbar },
  mounted() {
    this.$nextTick(() => {
      this.validateExpression();
      if (this.$refs.expressionInput)
        this.expressionInputEl =
          this.$refs.expressionInput.$el.firstElementChild;
    });
  },
  watch: {
    expValue(val) {
      this.validateExpression(val);
    },
  },
  computed: {
    cardOptions() {
      let options = [];
      for (let key in this.field) {
        if (["key", "exp", "val"].includes(key)) {
          this.field[key].name = key;
          options.push(this.field[key]);
        }
      }
      options.sort((a, b) => a.order - b.order);
      return options;
    },
    buttonLable() {
      let label = Array.isArray(this.value)
        ? this.value[this.field.index]
        : this.value;
      return label || "请选择";
    },
  },
  methods: {
    defaultFieldAttr() {
      return {
        size: "small",
        key: {
          title: "字段",
          show: true,
          order: 1,
          options: [],
        },
        exp: {
          title: "不等式",
          show: true,
          order: 2,
          options: [{ label: "等于", value: "==" }],
        },
        val: {
          title: "值",
          show: true,
          order: 3,
          options: [],
        },
      };
    },
    // 获取表达式输入框光标位置
    getCursorPosition() {
      let startPos = this.expressionInputEl.selectionStart;
      let endPos = this.expressionInputEl.selectionEnd;
      if (startPos === undefined || endPos === undefined) return;
      this.cursorPosition = startPos;
    },
    // 迭代获取值
    iterationFindValue(obj) {
      let result = {};
      for (let key in obj) {
        if (typeof obj[key] == "object") {
          result[key] = this.iterationFindValue(obj[key]);
        } else {
          result[key] = obj[key];
        }
      }
      return result;
    },
    // 设置值
    async clickOption({ value, disabled }) {
      if (disabled == true) return;
      this.getCursorPosition();
      let newCursorPosition = this.cursorPosition + value.length;
      let oldValue = this.expValue || "";
      let expressionValue =
        oldValue.slice(0, this.cursorPosition) +
        value +
        oldValue.slice(this.cursorPosition);
      this.cursorPosition = newCursorPosition;
      this.expValue = expressionValue;
      await this.$nextTick();
      this.expressionInputEl.focus();
      this.expressionInputEl.setSelectionRange(
        newCursorPosition,
        newCursorPosition
      );
    },
    // 校验
    validateExpression(expression) {
      let regValue = [];
      let inequality = ["!", ">", "<", ">=", "<=", "==", "!=", "&&", /\|\|/];
      this.combination(inequality, inequality, regValue); // 组合
      let regString = regValue.join("|");
      regString = regString.replace(/\//g, "");
      let reg = new RegExp(regString);
      let abnormalReg = /^[\||\&|\>|\<|\=]|\w[\||\&|\>|\<|\=|\!]+$/;
      this.isError = reg.test(expression) || abnormalReg.test(expression);
    },
    // 组合
    combination(base = [], sub = [], value = []) {
      base.map((baseItem) =>
        sub.map((subItem) => value.push(`(${baseItem + subItem})`))
      );
    },
    onSureExp() {
      if (this.isError) return;
      if (Array.isArray(this.value)) {
        this.$set(this.value, this.field.index, this.expValue);
      } else this.value = this.expValue;
      this.$refs.popoverRef.doClose();
    },
  },
  data() {
    return {
      expValue: "",
      isError: false, // 是否错误
      cursorPosition: 0, // 光标位置
    };
  },
};
</script>

<style lang="scss">
.option-container {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 3px;
  > .option-item {
    min-width: 200px;
    height: 280px;
    margin-right: 3px;
    border: 1px solid #ddd;
    > .title {
      height: 25px;
      line-height: 25px;
      border-bottom: 1px solid #ddd;
      padding: 0 3px;
      box-sizing: border-box;
    }
    > .option-list {
      height: 255px;
      overflow-y: auto;
      > .option {
        height: 20px;
        line-height: 20px;
        padding: 0 3px;
        box-sizing: border-box;
      }
      > .option:hover {
        background: #bbb;
        color: #fff;
      }
      > .disabled-option {
        position: relative;
      }
      > .disabled-option::after {
        content: "";
        background: "#f00";
        z-index: 1000;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        cursor: not-allowed;
      }
    }
  }
}
.sure-exp {
  float: right;
  margin-top: 3px;
}
</style>