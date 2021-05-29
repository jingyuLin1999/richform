<!-- 
  
    通用布局组件
    Author:ljy

    一、特性：
    1、支持2-3列式布局
    2、左右两侧布局面板可调可隐藏
    3、支持嵌套
    4、支持浮动弹出

    使用方式:
    <layout attr1="..." @onhide="onHide" @onshow="onShow" @onresize="onResize">
        <div slot="first">放面板内容<div>
        <div slot="center">放面板内容<div>
        <div slot="last">放面板内容<div>
    </layout>

    上述定义中可以分别定义三个面板，需要指定slot="first或center或last"，其中center面板不可缺少。

    layout支持传入属性有：
    fit： true或false,充满父容器，父容器需要设置position值
    direction: hori或vert，默认=hori，即水平排列布局，vert=垂直排列布局

    hasFirstPanel:是否有第一个面板，如果为false，则代表布局只有两列，并且左/上侧没有面板，则定义在layout里面的 <div slot="first"><div>不会显示。
    firstPanelSize:左/上侧没有面板的默认尺寸，默认为200px
    firstPanelIsShow:true或false,左/上侧的显示状态
    firstPanelCloseable,lastPanelCloseable:设置左右侧面板能否被关闭
    hasLastPanel,lastPanelSize,lastPanelIsShow：同上。
  
    @onhide,onshow,onresize：当面板显示/隐藏/调节尺寸时触发事件，事件传入function(panel){...}，panel就是调节的面板对象

    firstPanelCanResize:第一个面板是否可拖动
    lastPanelCanResize:最后一个面板是否可拖动

 -->
<!-- 组件模板, -->
<template>
  <div
    :id="id"
    class="layout"
    @click="onCloseFloatPanel"
    @mousedown="onResizePanel"
    @mousemove="onResizePanel"
    @mouseup="onResizePanel"
    :class="[direction, { fit: fit }]"
  >
    <!-- first panal -->
    <transition name="togglePanel">
      <perfect-scrollbar
        :class="[direction, 'first', 'panel', 'vsecond-bg']"
        v-if="hasFirstPanel"
        v-show="firstIsShow"
        :style="
          direction == 'hori'
            ? { width: firstPanelSize }
            : { height: firstPanelSize }
        "
      >
        <slot name="first"></slot>
      </perfect-scrollbar>
    </transition>
    <!-- 隔离 -->
    <div
      :class="[
        direction,
        'first',
        'splitbar',
        ' vbg-2',
        { expaned: firstIsShow },
      ]"
      @mousemove="onOpenFloatPanel('first', $event)"
      v-if="hasFirstPanel"
    >
      <div
        class="splitCtrl vbg-3"
        v-if="firstPanelCloseable"
        @click="firstSplitClick"
      ></div>
    </div>
    <!-- center panal -->
    <perfect-scrollbar class="center panel">
      <slot name="center"></slot>
    </perfect-scrollbar>
    <!-- 隔离 -->
    <div
      :class="[
        direction,
        'last',
        'splitbar',
        ' vbg-2',
        { expaned: lastIsShow },
      ]"
      @mousemove="onOpenFloatPanel('last', $event)"
      v-if="hasLastPanel"
    >
      <div
        class="splitCtrl vbg-3"
        v-if="lastPanelCloseable"
        @click="lastSplitClick"
      ></div>
    </div>
    <!-- last panal -->
    <transition name="togglePanel">
      <perfect-scrollbar
        :class="[direction, 'last', 'panel', 'vsecond-bg']"
        v-if="hasLastPanel"
        v-show="lastIsShow"
        :style="
          direction == 'hori'
            ? { width: lastPanelSize }
            : { height: lastPanelSize }
        "
      >
        <slot name="last"></slot>
      </perfect-scrollbar>
    </transition>
  </div>
</template>

<script>
import Vue from "vue";
import $ from "jquery";
import PerfectScrollbar from "vue2-perfect-scrollbar"; //提供友好的滚动条
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";
Vue.use(PerfectScrollbar);

//面板开关动画
Vue.component("togglePanel", {
  css: false,
  enter: function (el, done) {
    let $Panel = $(el);
    let size = $Panel.attr("size");
    let isFloat = $Panel.hasClass("float");
    let hori = $Panel.hasClass("hori");
    let aniAttrs = hori ? { width: size + "px" } : { height: size + "px" };
    if ($Panel.hasClass("first")) {
      if ($Panel.hasClass("hori")) {
        aniAttrs.left = isFloat ? SplitbarSize : 0;
      } else {
        aniAttrs.top = isFloat ? SplitbarSize : 0;
      }
    } else {
      if ($Panel.hasClass("hori")) {
        aniAttrs.right = isFloat ? SplitbarSize : 0;
      } else {
        aniAttrs.bottom = isFloat ? SplitbarSize : 0;
      }
    }
    $Panel.animate(aniAttrs, "fast", "swing", done);
  },
  enterCancelled: function (el) {
    let $Panel = $(el);
    let size = $Panel.attr("size");
    let aniAttrs = $Panel.hasClass("hori")
      ? { width: size + "px" }
      : { height: size + "px" };
    $Panel.stop();
    $Panel.css(aniAttrs);
  },
  leave: function (el, done) {
    let $Panel = $(el);
    let hori = $Panel.hasClass("hori");
    let aniAttrs = hori ? { width: 0 } : { height: 0 };
    let size = hori ? $Panel.width() : $Panel.height();
    $Panel.attr("size", size).animate(aniAttrs, "fast", "swing", done);
  },
  leaveCancelled: function (el) {
    let $Panel = $(el);
    let hori = $Panel.hasClass("hori");
    let aniAttrs = hori ? { width: 0 } : { height: 0 };
    $Panel.stop();
    $Panel.css(aniAttrs);
  },
});

var PanelMinSize = 20; //面板最小尺寸
var SplitbarSize = 8;
export default {
  data() {
    return {
      id: parseInt(Math.random(0, 10) * 10000),
      dragging: null, //存放拖放的数据
      offset: 0, //存放MOUSE按下时的偏移量
      dragSplitbar: null,
      firstIsShow: true,
      lastIsShow: true,
    };
  },
  watch: {
    lastIsShow: function (value) {},
    firstIsShow: function (value) {},
  },
  methods: {
    //返回面板状态0=隐藏,1-弹出,2-部分打开,3-打开
    getPanelStatus(panel) {
      if (
        $(this.$el)
          .children("." + panel + ".panel")
          .hasClass("float")
      ) {
        return "close";
      } else {
        return "open";
      }
    },
    closePanel(panel) {
      //关闭面板，中间面板不能关闭
    },
    openPanel(panel) {
      //打开面板
      if (panel == "first") {
      } else {
      }
    },
    firstSplitClick() {
      let $Panel = $(this.$el).children(".first.panel");
      if ($Panel.hasClass("float")) {
        $Panel.removeClass("float");
        this.firstIsShow = true;
      } else {
        $Panel.removeClass("float");
        this.firstIsShow = !this.firstIsShow;
      }
      this.$emit(this.firstIsShow ? "onshow" : "onhide", $Panel.get(0));
    },
    lastSplitClick() {
      let $Panel = $(this.$el).children(".last.panel");
      this.lastIsShow = !this.lastIsShow;
      $Panel.removeClass("float");
      this.$emit(this.lastIsShow ? "onshow" : "onhide", $Panel.get(0));
    },
    onOpenFloatPanel(panel, event) {
      //移动上去后侧滑浮动面板
      if ($(event.target).hasClass("splitCtrl") || !this.lastPanelCanResize) {
        return;
      }
      let $Panel = $(this.$el).children("." + panel + ".panel");
      let ctlBar = $(event.target).children(".splitCtrl");
      if (this.direction == "hori") {
        if (
          event.offsetY > ctlBar.position().top &&
          event.offsetY < ctlBar.position().top + ctlBar.height()
        ) {
          return;
        }
      } else {
        if (
          event.offsetX > ctlBar.offset().left &&
          event.offsetX < ctlBar.offset().left + ctlBar.width()
        ) {
          return;
        }
      }
      if (panel == "first") {
        //
        if (this.firstIsShow || $(event.target).hasClass("splitCtrl")) {
          return;
        }
        if ($Panel.css("display") == "none") {
          $Panel.addClass("float");
          this.firstIsShow = true;
        }
      } else {
        if (this.lastIsShow || $(event.target).hasClass("splitCtrl")) {
          return;
        }
        if ($Panel.css("display") == "none") {
          $Panel.addClass("float");
          this.lastIsShow = true;
        }
      }
      this.$emit("onshow", $Panel.get(0));
    },
    onCloseFloatPanel(event) {
      //关闭浮动的面板
      let self = this;
      let $Target = $(event.target);
      if ($Target.hasClass("panel") && $Target.hasClass("float")) {
        if ($Target.hasClass("first")) {
          self.firstIsShow = false;
        }
        if ($Target.hasClass("last")) {
          self.lastIsShow = false;
        }
        self.$emit("onhide", $Target.get(0));
        event.stopPropagation();
      } else {
        $(this.$el)
          .children(".float.panel")
          .each(function () {
            let $Panel = $(this);
            if ($Panel.hasClass("first")) {
              self.firstIsShow = false;
              self.$emit("onhide", $Panel.get(0));
              return;
            }
            if ($Panel.hasClass("last")) {
              self.lastIsShow = false;
              self.$emit("onhide", $Panel.get(0));
              return;
            }
            if ($Panel.hasClass("center")) {
              self.firstIsShow = false;
              self.$emit("onhide", $Panel.prev(".panel").get(0));
              self.lastIsShow = false;
              self.$emit("onhide", $Panel.next(".panel").get(0));
              return;
            }
          });
      }
    }, //面板点击
    onResizePanel(event) {
      //拖动面板
      var target = event.target || event.srcElement;
      var layoutEle = this.$el;
      var direction = this.direction;
      switch (
        event.type //判断事件类型
      ) {
        case "mousedown":
          if (target.classList.contains("splitbar")) {
            // window.getSelection().empty()
            this.dragSplitbar = target;
            if (
              this.dragSplitbar.classList.contains("first") &&
              (!this.firstIsShow || !this.firstPanelCanResize)
            ) {
              event.stopPropagation();
              return;
            }
            if (
              this.dragSplitbar.classList.contains("last") &&
              (!this.lastIsShow || !this.lastPanelCanResize)
            ) {
              event.stopPropagation();
              return;
            }
            if (direction == "hori") {
              this.dragging = $(target)
                .clone()
                .css({
                  position: "absolute",
                  top: 0,
                  background: "black",
                  opacity: 0.2,
                  "z-index": 9,
                  left: $(target).position().left,
                })
                .empty()
                .appendTo(layoutEle)[0]; //赋值到拖动目标
            } else {
              this.dragging = $(target)
                .clone()
                .css({
                  position: "absolute",
                  left: 0,
                  background: "black",
                  opacity: 0.2,
                  "z-index": 9,
                  top: $(target).position().top,
                })
                .empty()
                .appendTo(layoutEle)[0];
            }
            this.offset =
              this.direction == "hori" ? event.offsetX : event.offsetY;
            event.stopPropagation();
          }
          break;

        case "mousemove":
          if (this.dragging && event.which == 1) {
            //当有拖动目标时执行
            // window.getSelection().empty()
            if (direction == "hori") {
              //水平布局
              let size =
                event.clientX - this.offset - $(layoutEle).offset().left;
              if (this.dragSplitbar.classList.contains("first")) {
                if (size < PanelMinSize) size = PanelMinSize;
              } else {
                let lRect = layoutEle.getBoundingClientRect();
                if (
                  lRect.right -
                    lRect.left -
                    size -
                    this.dragSplitbar.clientWidth <
                  PanelMinSize
                ) {
                  size =
                    lRect.right -
                    lRect.left -
                    PanelMinSize -
                    this.dragSplitbar.clientWidth;
                }
              }
              this.dragging.style.left = size + "px";
            } else {
              //垂直布局
              let size =
                event.clientY - this.offset - $(layoutEle).offset().top;
              if (this.dragSplitbar.classList.contains("first")) {
                if (size < PanelMinSize) size = PanelMinSize;
              } else {
                let lRect = layoutEle.getBoundingClientRect();
                if (
                  lRect.bottom -
                    lRect.top -
                    size -
                    this.dragSplitbar.clientHeight <
                  PanelMinSize
                ) {
                  size =
                    lRect.bottom -
                    lRect.top -
                    PanelMinSize -
                    this.dragSplitbar.clientHeight;
                }
              }
              this.dragging.style.top = size + "px";
            }
            event.preventDefault();
          } else {
            if (this.dragging) {
              this.dragging.remove();
              event.preventDefault();
            }
            this.dragging = null;
          }
          break;
        case "mouseup":
          if (this.dragging) {
            let lRect = layoutEle.getBoundingClientRect();
            if (this.dragSplitbar.classList.contains("first")) {
              if (direction == "hori") {
                if (parseInt(this.dragging.style.left) <= PanelMinSize) {
                  this.firstIsShow = false;
                } else {
                  this.dragSplitbar.previousElementSibling.style.width = this.dragging.style.left;
                }
              } else {
                //垂直
                if (parseInt(this.dragging.style.top) <= PanelMinSize) {
                  this.firstIsShow = false;
                } else {
                  this.dragSplitbar.previousElementSibling.style.height = this.dragging.style.top;
                }
              }
              this.$emit(
                "dragSplitbar",
                this.dragSplitbar.previousElementSibling
              );
            } else {
              if (direction == "hori") {
                let size =
                  lRect.right -
                  lRect.left -
                  parseInt(this.dragging.style.left) -
                  this.dragSplitbar.clientWidth;
                if (size <= PanelMinSize) {
                  this.lastIsShow = false;
                } else {
                  this.dragSplitbar.nextElementSibling.style.width =
                    size + "px";
                }
              } else {
                //垂直
                let size =
                  lRect.bottom -
                  lRect.top -
                  parseInt(this.dragging.style.top) -
                  this.dragSplitbar.clientHeight;
                if (size <= PanelMinSize) {
                  this.lastIsShow = false;
                } else {
                  this.dragSplitbar.nextElementSibling.style.height =
                    size + "px";
                }
              }
              this.$emit("dragSplitbar", this.dragSplitbar.nextElementSibling);
            }
            this.dragging.remove();
            this.dragging = null;
            event.stopPropagation();
          }
          break;
      }
    },
    listenScreenResize() {
      // show和hide有动画效果所以要延迟几毫秒
      const TIEM_DELAY = 100;
      this.$on("onshow", () =>
        setTimeout(() => this.$emit("onresize"), TIEM_DELAY)
      );
      this.$on("onhide", () =>
        setTimeout(() => this.$emit("onresize"), TIEM_DELAY)
      );
      this.$on("dragSplitbar", () => {
        // this.$eventbus.emit("dragSplitbar");  // TODO EventBus
        this.$emit("onresize");
      });
    },
  },
  created() {
    this.listenScreenResize();
    this.firstIsShow = this.firstPanelIsShow;
    this.lastIsShow = this.lastPanelIsShow;
  },
  mounted() {
    let self = this;
    this.$nextTick(function () {
      $(this.$el).on("mouseleave", function (event) {
        self.onCloseFloatPanel(event);
      });
    });
  },
  props: {
    fit: { type: Boolean, default: true }, //充满父容器
    border: { type: Boolean, default: false },
    splitbar: { type: String, default: "" }, //分割栏样式
    direction: { type: String, default: "hori" }, //布局方向Hori(zontal),Vert(ical)
    //左侧或上方面板
    hasFirstPanel: { type: Boolean, default: true },
    firstPanelSize: { type: String, default: "200px" },
    firstPanelIsShow: { type: Boolean, default: true }, //初始状态,0:隐藏,1:缩略状态,2:显示
    firstPanelCloseable: { type: Boolean, default: true }, //能否关闭
    //右侧或下方面板
    hasLastPanel: { type: Boolean, default: true },
    lastPanelSize: { type: String, default: "200px" },
    lastPanelIsShow: { type: Boolean, default: true },
    lastPanelCloseable: { type: Boolean, default: true }, //能否关闭
    //面板是否可拖动
    firstPanelCanResize: { type: Boolean, default: true },
    lastPanelCanResize: { type: Boolean, default: true },
  },
};
</script>
<!-- 组件样式 -->
<style lang="scss" scoped>
@import "./mixin.scss";
// 十个级别的亮度
$lightBackColor: #fbfbfb;
$lightColorL1: darken($lightBackColor, 1%);
$lightColorL2: darken($lightBackColor, 4%);
$lightColorL3: darken($lightBackColor, 7%);
$lightColorL4: darken($lightBackColor, 10%);
$lightColorL5: darken($lightBackColor, 13%);
$lightColorL6: darken($lightBackColor, 16%);
$lightColorL7: darken($lightBackColor, 19%);
$lightColorL8: darken($lightBackColor, 22%);
$lightColorL9: darken($lightBackColor, 25%);
$lightColorL10: darken($lightBackColor, 28%);

// 主背景色
.vbg {
  background: $lightBackColor;
}
// 主背景色+度
.vbg-1 {
  background: $lightColorL1;
}
.vbg-2 {
  background: $lightColorL2;
}
.vbg-3 {
  background: $lightColorL3;
}
.vbg-4 {
  background: $lightColorL4;
}
.vbg-5 {
  background: $lightColorL5;
}
.vbg-6 {
  background: $lightColorL6;
}
.vbg-7 {
  background: $lightColorL7;
}
.vbg-8 {
  background: $lightColorL8;
}
.vbg-9 {
  background: $lightColorL9;
}
.vbg-10 {
  background: $lightColorL10;
}
/* 滚动条的宽度 */
::-webkit-scrollbar {
  width: 6px;
  height: 10px;
}
/* 滚动条的滑块 */
::-webkit-scrollbar-thumb {
  background-color: #a1a3a9;
  border-radius: 3px;
}
.layout {
  overflow: auto;
  position: relative;
  padding: 0px;
  /* background: #FAFAFA;  */
  display: flex;
  align-items: stretch;
}
.layout .panel {
  position: relative;
}
.layout.hori {
  flex-direction: row;
}
.layout.vert {
  flex-direction: column;
}

.layout.fit {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
}
.layout > div {
  /*position: relative;*/
}
.layout > div.center {
  top: 0px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.layout > div.panel.float {
  z-index: 9;
}
.layout > div.hori.first.float {
  position: absolute;
  height: 100%;
  z-index: 1000;
  /* background: #FAFAFA; */
  border-right: 1px solid rgb(2, 1, 1);
  box-shadow: 2px 0px 8px #dedede;
}
.layout > div.hori.last.float {
  position: absolute;
  height: 100%;
  z-index: 1000;
  /* background: #FAFAFA; */
  border-left: 1px solid #dedede;
  box-shadow: -2px 0px 10px #dedede;
  right: -8px;
}

.layout > div.vert.first.float {
  position: absolute;
  width: 100%;
  z-index: 1000;
  /* background: #FAFAFA; */
  border-bottom: 1px solid #dedede;
  box-shadow: 0px 2px 8px #dedede;
}
.layout > div.vert.last.float {
  position: absolute;
  width: 100%;
  z-index: 1000;
  /* background: #FAFAFA; */
  border-top: 1px solid #dedede;
  box-shadow: 0px -2px 10px #dedede;
}

/*分割条*/
.layout > div.splitbar {
  position: relative;
  flex-shrink: 0;
  box-sizing: border-box;
  border: 0px;
}
.layout > div.hori.splitbar {
  height: 100%;
  width: 8px;
  cursor: e-resize;
}

.layout > div.vert.splitbar {
  width: 100%;
  height: 8px;
  cursor: s-resize;
}

.layout > div.splitbar > .splitCtrl {
  position: absolute;
  box-sizing: border-box;
  /* background: white; */
  cursor: pointer;
  font-size: 4px;
}
.layout > div.hori.splitbar > .splitCtrl {
  top: 45%;
  left: 0px;
  height: 10%;
  width: 100%;
  display: flex;
  align-items: center;
}

.layout > div.vert.splitbar > .splitCtrl {
  top: 0px;
  left: 45%;
  width: 10%;
  height: 100%;
}

.layout > div.splitbar > .splitCtrl:hover {
  color: white;
}
.layout div[slot] {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
}
/** 指示按钮 */
.layout > div.hori.splitbar > .splitCtrl:after {
  content: " ";
}
.layout > div.hori.last.splitbar {
  &:not(.expaned) {
    & > .splitCtrl:after {
      @include triangle(10px, 5px, currentColor, left);
      margin-left: 2px;
      opacity: 0.8;
    }
  }
  &.expaned {
    & > .splitCtrl:after {
      @include triangle(10px, 5px, currentColor, right);
      margin-left: 2px;
      opacity: 0.8;
    }
  }
}
.layout > div.hori.first.splitbar {
  &:not(.expaned) {
    & > .splitCtrl:after {
      @include triangle(10px, 5px, currentColor, right);
      margin-left: 2px;
      opacity: 0.8;
    }
  }
  &.expaned {
    & > .splitCtrl:after {
      @include triangle(10px, 5px, currentColor, left);
      margin-left: 2px;
      opacity: 0.8;
    }
  }
}
.layout > div.vert.last.splitbar {
  &:not(.expaned) {
    & > .splitCtrl:after {
      @include triangle(10px, 5px, currentColor, up);
      margin-left: -2px;
      opacity: 0.8;
    }
  }
  &.expaned {
    & > .splitCtrl:after {
      @include triangle(10px, 5px, currentColor, down);
      margin-left: -2px;
      opacity: 0.8;
    }
  }
}
.layout > div.vert.first.splitbar {
  &:not(.expaned) {
    & > .splitCtrl:after {
      @include triangle(10px, 5px, currentColor, down);
      margin-left: -2px;
      opacity: 0.8;
    }
  }
  &.expaned {
    & > .splitCtrl:after {
      @include triangle(10px, 5px, currentColor, up);
      margin-left: -2px;
      opacity: 0.8;
    }
  }
}
</style>

