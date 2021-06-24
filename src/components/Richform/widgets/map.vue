<template>
  <div class="bdmap-component">
    <el-input
      v-model="value"
      size="small"
      @focus="isHideSearchList = false"
      @change="isHideSearchList = false"
    />
    <baidu-map
      class="bm-view"
      ak="YEeZXyd2BDYzwX2DwCSICbomBCI1UYuG"
      :center="center"
      :zoom="35"
      :map-click="field.showDetail"
      :scroll-wheel-zoom="field.scrollWheelZoom"
      @ready="initMap"
      @click="clickLocation"
    >
      <bm-local-search
        :class="['bd-local-search', isHideSearchList ? 'hide-search-list' : '']"
        :keyword="value"
        :auto-viewport="true"
        :location="location"
        @markersset="markersset"
        @infohtmlset="infohtmlset"
      ></bm-local-search>
      <bm-circle
        :center="circleCenter"
        :radius="field.radius"
        stroke-color="blue"
        fillColor="#6c90e0"
        :fillOpacity="0.5"
        :stroke-opacity="0.2"
        :stroke-weight="1"
        :editing="field.flexBounds"
        @lineupdate="getRadius"
      ></bm-circle>
      <bm-marker
        :position="circleCenter"
        :dragging="false"
        animation="BMAP_ANIMATION_BOUNCE"
      >
      </bm-marker>
      <bm-copyright
        anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
        :copyright="[
          {
            id: 1,
            content: field.copyright,
            bounds: { ne: { lng: 110, lat: 40 }, sw: { lng: 0, lat: 0 } },
          },
        ]"
      >
      </bm-copyright>
    </baidu-map>
  </div>
</template>

<script>
import {
  BaiduMap,
  BmMarker,
  BmGeolocation,
  BmCircle,
  BmLocalSearch,
  BmCopyright,
} from "vue-baidu-map";
import baseMixin from "./baseMixin";
export default {
  name: "bmap",
  components: {
    BaiduMap,
    BmMarker,
    BmGeolocation,
    BmCircle,
    BmLocalSearch,
    BmCopyright,
  },
  mixins: [baseMixin],
  data() {
    return {
      keyword: "阳江小区", // 搜索关键词
      location: "泉州", // 限定当前位置
      center: { lng: 0, lat: 0 }, // 中心
      isHideSearchList: true, // 是否隐藏搜索列表
      circleCenter: { lng: 118.1, lat: 24.1 }, // 圆心
    };
  },
  methods: {
    defaultFieldAttr() {
      return {
        zoom: 25, // 默认放大倍数
        ak: "YEeZXyd2BDYzwX2DwCSICbomBCI1UYuG", // 百度地图密钥,请到百度地图官网申请
        flexBounds: false, // 改变范围大小
        showDetail: false, // 点击后是否显示详情
        scrollWheelZoom: true, // 鼠标滚轮缩放
        radius: 300, // 半径
        copyright: "兰台",
      };
    },
    markersset($event) {
      let curItem = $event.find((item) => item.title == this.value);
      if (!curItem) return;
      this.clickLocation(curItem);
    },
    infohtmlset($event) {
      this.clickLocation($event);
    },
    initMap({ BMap, map }) {
      this.BMap = BMap;
      if (this.value) return;
      this.onLocation();
    },
    // 自动定位到当前位置
    onLocation() {
      let geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(
        (r) => {
          this.getDetailAddress(r.point);
          this.center = { lng: r.longitude, lat: r.latitude };
          this.circleCenter = this.center;
        },
        { enableHighAccuracy: true }
      );
    },
    // 选取地址
    clickLocation($event) {
      this.isHideSearchList = true;
      this.getDetailAddress($event.point);
      this.circleCenter = $event.point;
      if ($event.title) this.changeValue($event.title);
    },
    // 根据坐标获取详细地址
    getDetailAddress(point) {
      const geoCoder = new this.BMap.Geocoder();
      geoCoder.getLocation(point, (res) => {
        let { surroundingPois, address, point } = res;
        let curAddress = address;
        let surrounding = surroundingPois[0];
        if (surrounding) {
          curAddress += surrounding.title;
        }
        this.changeValue(curAddress);
      });
    },
    // 获取距离
    getRadius(e) {
      let radius = parseInt(e.target.getRadius());
      this.field.radius = radius;
    },
  },
};
</script>

<style lang="scss">
.bdmap-component {
  position: relative;
  width: 100%;
  margin-top: 5px;
  .bm-view {
    width: 100%;
    height: 200px;
    position: relative;
    .bd-local-search {
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      z-index: 9999;
    }
    .hide-search-list {
      position: absolute;
      top: 0;
      left: 0;
      display: none;
    }
  }
}
</style>