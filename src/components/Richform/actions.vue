
<template>
  <div class="actions">
    <template v-for="(action, index) of leftActions">
      <Button
        :key="index"
        :type="action.type"
        v-if="action.visible != false"
        :size="action.size || form.size"
        @click="onActionClick(action, $event)"
        :native-type="getButtonType(action)"
        :disabled="isDesign"
      >
        <i :class="action.icon" v-if="action.icon"></i> {{ action.title }}
      </Button>
    </template>
    <div class="right">
      <template v-for="(action, index) of rightActions">
        <Button
          :key="index"
          :type="action.type"
          :size="action.size"
          v-if="action.visible != false"
          @click="onActionClick(action, $event)"
          :native-type="getButtonType(action)"
          :disabled="isDesign"
        >
          <i :class="action.icon" v-if="action.icon"></i> {{ action.title }}
        </Button>
      </template>
    </div>
  </div>
</template>

<script>
import eventbus from "./utils/eventbus";
import { Button } from "element-ui";
export default {
  name: "RichFormActions",
  inject: ["formId"],
  components: { Button },
  props: {
    actions: Array,
    isDesign: { type: Boolean, default: false }, // 是否是设计模式
  },
  data() {
    return {};
  },
  computed: {
    leftActions: function () {
      return this.actions.filter((action) => action.right != true);
    },
    rightActions: function () {
      return this.actions.filter((action) => action.right == true);
    },
  },
  methods: {
    getButtonType(action) {
      return action.submit ? "submit" : action.reset ? "reset" : "button";
    },
    onActionClick(action, event) {
      eventbus.$emit(`${this.formId}:action`, action);
      event.stopPropagation();
    },
  },
};
</script>

<style lang="scss" scoped>
.actions {
  margin: 2px 0;
  .right {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
