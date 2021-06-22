<template>
  <div class="bdmap-component">
    <el-input
      v-model="value"
      size="small"
      placeholder="请搜索"
      @focus="isHideSearchList = false"
      @blur="isHideSearchList = true"
    />
    <baidu-map
      class="bm-view"
      ak="YEeZXyd2BDYzwX2DwCSICbomBCI1UYuG"
      :center="center"
      :zoom="zoom"
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
        @infohtmlset="clickLocation"
      ></bm-local-search>
      <bm-circle
        :center="circlePath.center"
        :radius="circlePath.radius"
        stroke-color="blue"
        fillColor="#6c90e0"
        :fillOpacity="0.5"
        :stroke-opacity="0.2"
        :stroke-weight="1"
        :editing="field.flexBounds"
        @lineupdate="getRadius"
      ></bm-circle>
      <bm-marker
        :position="circlePath.center"
        :dragging="false"
        animation="BMAP_ANIMATION_BOUNCE"
      >
      </bm-marker>
    </baidu-map>
  </div>
</template>

<script>
import baseMixin from "./baseMixin";
import { BaiduMap, BmMarker, BmCircle, BmLocalSearch } from "vue-baidu-map";

export default {
  name: "bmap",
  mixins: [baseMixin],
  components: {
    BaiduMap,
    BmMarker,
    BmCircle,
    BmLocalSearch,
  },
  data() {
    return {
      zoom: 14, // 放大倍数
      location: "福建", // 限定当前位置
      center: { lng: 0, lat: 0 }, // 中心
      isHideSearchList: true, // 是否隐藏搜索列表
      circlePath: {
        // 中心范围
        radius: 3000, // 单位m
        center: { lng: 118.1, lat: 24.1 },
      },
    };
  },
  methods: {
    defaultFieldAttr() {
      return {
        ak: "YEeZXyd2BDYzwX2DwCSICbomBCI1UYuG", // 百度地图密钥,请到百度地图官网申请
        flexBounds: false, // 改变范围大小
        showDetail: false, // 点击后是否显示详情
        scrollWheelZoom: true, // 鼠标滚轮缩放
      };
    },
    initMap({ BMap, map }) {
      this.BMap = BMap;
      this.zoom = 14;
      this.onLocation();
    },
    // 自动定位到当前位置
    onLocation() {
      let geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(
        (r) => {
          this.getDetailAddress(r.point);
          this.center = { lng: r.longitude, lat: r.latitude };
          this.circlePath.center = this.center;
        },
        { enableHighAccuracy: true }
      );
    },
    // 选取地址
    clickLocation($event) {
      this.isHideSearchList = true;
      this.getDetailAddress($event.point);
      this.circlePath.center = $event.point;
    },
    // 根据坐标获取详细地址
    getDetailAddress(point) {
      const geoCoder = new this.BMap.Geocoder();
      geoCoder.getLocation(point, (res) => {
        let { surroundingPois, address, point } = res;
        let curAddress = address;
        let surrounding = surroundingPois[0];
        if (surrounding) curAddress += surrounding.title;
      });
    },
    // 获取距离
    getRadius(e) {
      let radius = parseInt(e.target.getRadius());
      this.circlePath.radius = radius;
    },
  },
};
</script>

<style lang="scss" scoped>
.bdmap-component {
  width: 100%;
  position: relative;
  .bm-view {
    width: 100%;
    height: 220px;
    position: relative;
    .bd-local-search {
      position: absolute;
      top: 0;
      left: 0;
      display: block;
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