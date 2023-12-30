<!-- elementui HH:mm:ss 小时只能24小时，故写个组件时间天：时：分：秒功能 -->
<template>
  <div class="time-select-widget" ref="timeSelect" :id="widgetId">
    <div class="time-input">
      <div><i class="el-icon-time"></i> </div>
      <input class="input" v-model="value" type="text" autocomplete="off" :readonly="field.valueFormat == 'timestamp'"
        placeholder="任意时间点" @focus="onFocus">
    </div>
    <Teleport v-if="showTimeSelect" ref="teleport" to="body" class="time-select-panel">
      <div class="options">
        <el-scrollbar style="height: 100%" wrap-style="overflow-x:hidden;" ref="hoursScrollContainer"
          @wheel.native.prevent="(e) => { handleScroll(e, 'hours') }">
          <ul class="panel-ul">
            <li class="panel-li" v-for="(num, index) in hRange" :key="index" @click="scrollToNum(num, 'hours')">{{ num
            }}
            </li>
          </ul>
        </el-scrollbar>
        <el-scrollbar style="height: 100%" wrap-style="overflow-x:hidden;" ref="minuteScrollContainer"
          @wheel.native.prevent="(e) => { handleScroll(e, 'minute') }">
          <ul class="panel-ul">
            <li class="panel-li" v-for="(num, index) in msRange" :key="index" @click="scrollToNum(num, 'minute')">{{ num
            }}
            </li>
          </ul>
        </el-scrollbar>
        <el-scrollbar style="height: 100%" wrap-style="overflow-x:hidden;" ref="secondScrollContainer"
          @wheel.native.prevent="(e) => { handleScroll(e, 'second') }">
          <ul class="panel-ul">
            <li class="panel-li" v-for="(num, index) in msRange" :key="index" @click="scrollToNum(num, 'second')">{{ num
            }}
            </li>
          </ul>
        </el-scrollbar>
      </div>
      <div class="buttons">
        <button type="button" class="el-time-panel__btn cancel" @click="onCancel">取消</button>
        <button type="button" class="el-time-panel__btn confirm" @click="onConfirm">确定</button>
      </div>
    </Teleport>
  </div>
</template>

<script>
import { type, isNil } from "ramda"
import baseMixin from "./baseMixin";
import ElScrollbar from 'element-ui/packages/scrollbar';
import Teleport from "@/components/Teleport"

export default {
  mixins: [baseMixin],
  components: { ElScrollbar, Teleport },
  data() {
    return {
      showTimeSelect: false, // 
      hours: '00',  // 时
      minute: '00', // 分
      second: '00', // 秒
      hRange: [], // 小时范围
      msRange: [], // ms范围
    }
  },
  mounted() {
    this.registerAddEventListener();
    this.msRange = this.createRange();
    this.hRange = this.createRange(0, this.field.hourEnd);
  },
  methods: {
    defaultFieldAttr() {
      return {
        valueFormat: "HH:mm:ss", // HH:mm:ss 或 timestamp
        hourEnd: 99,
      };
    },
    friendValue() {
      let value = this.values[this.field.name];
      if (type(value) == "Number") {
        return this.secondTohms(value)
      } else if (isNil(value)) {
        value = "00:00:00"
      }

      return value;
    },
    beforeChange(val) {
      if (this.field.valueFormat == "timestamp") {
        val = this.hmsToSecond(val)
      }
      else if (type(val) == "String") {
        // 对分秒进行校验，不能低于0或超过59
        let [h, m, s] = val.split(":")
        h = parseInt(h) < 0 ? 0 : parseInt(h) > this.field.hourEnd ? this.field.hourEnd : h;
        m = parseInt(m) < 0 ? 0 : parseInt(m) > 59 ? 59 : m
        s = parseInt(s) < 0 ? 0 : parseInt(s) > 59 ? 59 : s
        val = [h, m, s].join(":");
        this.hmsScrollToNum(val)
      }
      return val;
    },
    hmsToSecond(hmsStr) {
      let [h, m, s] = hmsStr.split(":");
      return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s)
    },
    secondTohms(second) {
      let h = parseInt(second / 3600)
      let m = parseInt(second % 3600 / 60)
      let s = parseInt(second % 3600 % 60)
      return `${this.formate(h)}:${this.formate(m)}:${this.formate(s)}`
    },
    createRange(start = 0, end = 59) {
      let array = [];
      for (let index = 0; index < 3; index++) {
        array.push(null)
      }
      for (let index = start; index <= end; index++) {
        array.push(this.formate(index))
      }
      for (let index = 0; index < 2; index++) {
        array.push(null)
      }
      return array;
    },
    handleScroll(e, type) {
      this.$nextTick(() => {
        const eventDelta = e.wheelDelta
        const $scrollWrapper = this.$refs[`${type}ScrollContainer`].$refs.wrap
        const scroll = $scrollWrapper.scrollTop + (eventDelta < 0 ? 32 : -32);  // 控制32的倍数
        $scrollWrapper.scrollTop = scroll;
        this[type] = parseInt(scroll / 32);
      })
    },
    scrollToNum(num, type) {
      if (!num) return;
      this.$nextTick(() => {
        num = parseInt(num);
        const $scrollWrapper = this.$refs[`${type}ScrollContainer`].$refs.wrap
        $scrollWrapper.scrollTop = num * 32;
        this[type] = num
      })
    },
    registerAddEventListener() {
      this.$nextTick(() => {
        window.addEventListener("click", (event) => {
          if (!this.$refs.teleport || !this.$refs.timeSelect) return;
          if (!this.$refs.teleport.$el.contains(event.target) && !this.$refs.timeSelect.contains(event.target)) {
            this.showTimeSelect = false
          }
        })
      })
    },
    formate(val) {
      if (!val) return "00";
      return val < 10 ? `0${val}` : val
    },
    onCancel() {
      this.showTimeSelect = false;
    },
    onConfirm() {
      this.value = `${this.formate(this.hours)}:${this.formate(this.minute)}:${this.formate(this.second)}`
      this.onCancel()
    },
    hmsScrollToNum(val) {
      let updateDataKey = ["hours", "minute", "second"]
      let toValue = val ? val : this.value
      let valueArr = toValue.split(":");
      this.showTimeSelect = true
      updateDataKey.map((key, index) => {
        this[key] = valueArr[index]
        this.scrollToNum(this.formate(this[key]), key);
      })
    },
    onFocus(evt) {
      this.showTimeSelect = true
      setTimeout(() => {
        const { left, top } = this.getPosOffBody(evt.target);
        const el = this.$refs.teleport.$el;
        el.style.left = `${left - 15}px`;
        el.style.top = `${top + evt.target.offsetHeight + 5}px`;
        this.hmsScrollToNum()
      }, 100);
    },
    getPosOffBody(obj) { //获取某元素以浏览器左上角为原点的坐标
      var t = obj.offsetTop; //获取该元素对应父容器的上边距
      var l = obj.offsetLeft; //对应父容器的上边距
      //判断是否有父容器，如果存在则累加其边距
      while (obj = obj.offsetParent) {//等效 obj = obj.offsetParent;while (obj != undefined)
        t += obj.offsetTop; //叠加父容器的上边距
        l += obj.offsetLeft; //叠加父容器的左边距
      }
      return { left: l, top: t }
    }
  },
};
</script>

<style lang="scss">
.time-select-widget {
  width: 100%;
  position: relative;

  >.time-input {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 5px;

    >.input {
      outline: 0;
      border: 0;
      height: 40px;
      width: 100%;
      margin-left: 3px;
    }
  }
}

.time-select-panel {
  position: absolute;
  bottom: 0;
  left: -2000px;
  z-index: 3000;
  width: 185px;
  height: 225px;
  background-color: #fff;
  box-shadow: 0 0 5px #ccc;

  .el-scrollbar__bar.is-horizontal {
    height: 0px !important;
  }

  >.options {
    height: 195px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 5px;
    position: relative;

    ul,
    li {
      margin: 0;
      padding: 0;
    }

    .panel-ul {
      list-style: none;
      width: 60px;

      .panel-li {
        list-style: none;
        height: 32px;
        width: 55px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #444;
        font-size: 13px;

        &:hover {
          background-color: #F5F7FA;
        }
      }

      .active {
        color: #000;
      }
    }
  }

  >.options::after {
    content: "";
    position: absolute;
    top: calc(50% - 3px);
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #dcdfe6;
    padding: 0 5px;
    box-sizing: border-box;
  }

  >.options::before {
    content: "";
    position: absolute;
    top: calc(50% + 30px);
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #dcdfe6;
    padding: 0 5px;
    box-sizing: border-box;
  }

  >.buttons {
    border-top: 1px solid #dcdfe6;
    height: 30px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>