<template>
  <div
    class="ip-input-container"
    :class="{ disabled: disabled, focus: isFocus }"
  >
    <div
      class="ip-segment"
      :style="{ visibility: disabled ? 'hidden' : 'visible' }"
      v-for="(segment, index) in segments"
      :key="index"
    >
      <input
        type="text"
        maxlength="3"
        class="ip-segment-input"
        :value="segment"
        :placeholder="placeholder"
        v-on:keydown="onInputKeydown($event, index)"
        v-on:input="onInput($event, index)"
        v-on:blur="onInputBlur()"
        v-on:focus="isFocus = true"
        v-on:paste="onPaste($event, index)"
        :style="{ color: colors.fontColor }"
      />
      <i v-show="index != segments.length - 1">.</i>
    </div>
  </div>
</template>

<script>
// 用法
// import VueIpInput from 'vue-ip-input';

// new Vue({
//     components: {
//         'vue-ip-input': VueIpInput
//     },
//     data() {
//         return {
//             ip: '127.0.0.1'
//         };
//     },
//     methods: {
//         onIpChange(ip) {
//             console.log('ip input change:', ip);
//         },
//         onIpBlur(ip) {
//             console.log('ip input blur:', ip);
//         }
//     },
//     template: '<vue-ip-input :ip="ip" :on-change="onIpChange" :on-blur="onIpBlur"></vue-ip-input>'
// })

/* global document*/
/**
 * get the cursor position of the element
 * @param  {Element} el the element
 * @return {Integer}    the position fo the cursor
 */
function getRange(el) {
  var cuRange;
  var tbRange;
  var headRange;
  var range;
  var dupRange;
  var ret = {};
  if (el.setSelectionRange) {
    // standard
    ret.begin = el.selectionStart;
    ret.end = el.selectionEnd;
    ret.result = el.value.substring(ret.begin, ret.end);
  } else if (document.selection) {
    // ie
    if (el.tagName.toLowerCase() === "input") {
      cuRange = document.selection.createRange();
      tbRange = el.createTextRange();
      tbRange.collapse(true);
      tbRange.select();
      headRange = document.selection.createRange();
      headRange.setEndPoint("EndToEnd", cuRange);
      ret.begin = headRange.text.length - cuRange.text.length;
      ret.end = headRange.text.length;
      ret.result = cuRange.text;
      cuRange.select();
    } else if (el.tagName.toLowerCase() === "textarea") {
      range = document.selection.createRange();
      dupRange = range.duplicate();
      dupRange.moveToElementText(el);
      dupRange.setEndPoint("EndToEnd", range);
      ret.begin = dupRange.text.length - range.text.length;
      ret.end = dupRange.text.length;
      ret.result = range.text;
    }
  }
  el.focus();
  return ret;
}
export default {
  props: {
    ip: {
      type: String,
    },
    placeholder: String,
    onChange: Function,
    onBlur: Function,
    disabled: {
      type: Boolean,
      default: false,
    },
    colors: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      isFocus: false,
      segments: ["", "", "", ""],
    };
  },
  watch: {
    ip(ip) {
      if (!ip) {
        this.segments = ["", "", "", ""];
      }
      this.syncIp(ip);
    },
  },
  methods: {
    onInputKeydown(event, index) {
      var keyCode = event.keyCode || event.which;
      var value = event.target.value;
      if (keyCode === 8 || keyCode === 37) {
        // move the cursor to previous input if backspace and left arrow is pressed at the begin of one input
        if (
          (value.length === 0 || getRange(event.target).end === 0) &&
          index > 0
        ) {
          this.$el.getElementsByTagName("input")[index - 1].focus();
          // When jump to pre input(enter "backspace"), thr cursor should in the end.
          // before fix: 127.|0.0.0  =>   12|7.0.0.1
          // after fix: 127.|0.0.0 = >   127|.0.0.0
          // notes: "|" mean the cursor position.
          event.preventDefault();
        }
      } else if (keyCode === 39) {
        if (getRange(event.target).end === value.length && index < 3) {
          // move to cursor to the next input if right arrow is pressed at the end of one input
          this.$el.getElementsByTagName("input")[index + 1].focus();
        }
      }
    },
    onInput(event, index) {
      let value = event.target.value;
      event.target.value = this.segments[index];
      let segment = Number(value);
      if (isNaN(segment)) {
        return;
      } else if (value === "") {
        this.segments.splice(index, 1, "");
      } else if (segment > 255 || segment < 0) {
        // set the segment to 255 if out of ip range
        this.segments.splice(index, 1, 255);
      } else {
        this.segments.splice(index, 1, segment);
      }
      // jump to next input
      if (
        (value.length === 3 && index < 3) ||
        value[value.length - 1] === "."
      ) {
        this.$el.getElementsByTagName("input")[index + 1].focus();
      }
    },
    onInputBlur() {
      this.isFocus = false;
      setTimeout(() => {
        var className = document.activeElement.className;
        if (className.indexOf("ip-segment-input") === -1) {
          if (this.onBlur) {
            this.onBlur(this.segments.join("."));
          }
        }
      }, 50);
    },
    onPaste(e, index) {
      var pasteText = e.clipboardData.getData("text/plain");
      var segments = pasteText.split(".");
      segments.forEach((segment, i) => {
        if (
          index + i < 4 &&
          !isNaN(segment) &&
          segment >= 0 &&
          segment <= 255
        ) {
          this.segments.splice(index + i, 1, segment);
        }
      });
      e.preventDefault();
    },
    syncIp(ip) {
      if (ip && ip.indexOf(".") !== -1) {
        ip.split(".").map((segment, index) => {
          if (isNaN(segment) || segment < 0 || segment > 255) {
            segment = 255;
          }
          this.segments.splice(index, 1, segment);
          return segment;
        });
      }
    },
  },
  mounted() {
    this.syncIp(this.ip);
    this.$watch(
      () => {
        return this.segments.join(".");
      },
      (val, oldValue) => {
        if (val !== oldValue) {
          if (val === "...") {
            val = "";
          }
          if (this.onChange) {
            this.onChange(val);
          }
          this.$emit("onChange", val);
        }
      }
    );
  },
};
</script>

<style lang="scss" scoped>
.ip-input-container.disabled {
  background: #f5f3f3;
}
.ip-input-container {
  display: flex;
  height: 36px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  line-height: normal;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
}
.ip-segment {
  display: inline-block;
  width: 50px;
  height: 26px;
  line-height: normal;
  input {
    width: 36px;
    height: 26px;
    line-height: normal;
    border: none;
    outline: none;
    text-align: center;
    text-indent: 0px;
    margin: 0px;
    padding: 0px;
    background-color: transparent;
  }
  i {
    display: inline-block;
    font-size: 18px;
  }
}
</style>
