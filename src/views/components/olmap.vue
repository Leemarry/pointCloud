<template>
  <div id="mapcontainer">
    <measureTool v-if="map" :map="map" />
    <maptool v-if="map" :map="map" />
  </div>
</template>
<script>
import measureTool from './measureTool.vue'
import maptool from './maptool.vue'

import 'ol/ol.css'
import Map from 'ol/Map'
import BingMaps from 'ol/source/BingMaps'
import TileLayer from 'ol/layer/Tile'
import View from 'ol/View'
import XYZ from 'ol/source/XYZ'
import { Vector as VectorLayer } from 'ol/layer'
import VectorSource from 'ol/source/Vector'
import { ScaleLine, defaults as defaultControls } from 'ol/control'

export default {
  components: {
    measureTool,
    maptool,
  },
  // 不能在子组件修改props数据，应触发事件让父组件修改该值
  // props: ['zoom'],
  props: { zoom: { default: 17 } },
  data() {
    // const self = this
    return {
      // zoom: 15,
                  centerPosition: [114.474721, 30.457096], // 用户当前位置经纬度
      map: null,
      layer_Map: null,
      layerTools: null,
      layer_Uavs: null, // 图层 - 无人机
      layer_Hives: null, // 图层 - 停机坪
      layer_Wp: null, //  图层 - 航点
      layer_Grid: null, // 图层 - 区域
      layer_WpLine: null, // 图层 - 航线
      layer_WpGridLine: null, // 图层 - 线条
      vectorSource_WpLine: null, // 航线集合
      vectorSource_FlyingPath: null, // 飞行路径集合
      vectorSource_GridLine: null, // 区域航线
      vectorSourceWp: null, // marker 集合
      vectorSourceGridWp: null, // 区域 marker 集合
      vectorSourceGridHome: null, // 区域 Home点
      vectorSourceUavs: null, // 无人机集合
      vectorSourceHives: null, // 停机坪集合
      feature_flypath: null, // 飞行路径对象
      translate: null, // 图标拖动层
      translateFeatures: null, // 拖动图标集合

      wps: [], // 所有航点原始数组
      wpsMarker: [], // 航点图标
      wpsLines: [], // 航点路径

      grids: [], // 所有区域边界原始数组
      gridsMarker: [], // 区域图标
      gridsLines: [] // 区域线条
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() { },
  onDestroy() { },
  methods: {
    init() {
      this.initMap()
    },
    test(msg) {
      // this.$parent.fatherMethod() // 调用父组件方法
      this.$layer.msg(msg)
    },
    showToast(msg) {
      this.$layer.msg(msg)
    },
    showMessage(msg, type) {
      this.$message({ message: msg, type: type })
    },
    initMap() {
      const bingStyles = [
        'RoadOnDemand', // 地图
        'Aerial', // 卫星图
        'AerialWithLabelsOnDemand', // 卫星混合地图
        'CanvasDark', // 夜晚图
        'OrdnanceSurvey' // 显示很多禁止拍照图片
      ]
      let navigatorOnLine = false
      if (navigator && navigator.onLine === false) {
        this.showToast('无法连接网络，正在使用离线地图！')
      } else {
        navigatorOnLine = true
      }
      if (navigatorOnLine) {
        this.layer_Map = new TileLayer({
          // source: new OSM()
          source: new BingMaps({
            key: 'Av6Re9f7niM0uJOAjG7m5O9dS4N4IcN-9yZc0r7RHqE-qGsKDv2s1YN1M5XJzK10',
            imagerySet: bingStyles[2]
          })
        })
      } else {
        this.layer_Map = new TileLayer({
          source: new XYZ({
            //   url: `tiles/{z}/{x}/{y}.png`
            url: '/mapresource/googlemap/tiles/{z}/{y}/{x}.png' // http://127.0.0.1/maps/tiles/bingmap/{z}/{y}/{x}.png
          })
        })
      }
      this.vectorSource_FlyingPath = new VectorSource({ wrapX: false })
      this.vectorSource_WpLine = new VectorSource({ wrapX: false })
      this.vectorSource_GridLine = new VectorSource({ wrapX: false })
      this.vectorSourceWp = new VectorSource()
      this.vectorSourceGridWp = new VectorSource()
      this.vectorSourceGridHome = new VectorSource()
      this.vectorSourceHives = new VectorSource()
      this.vectorSourceUavs = new VectorSource()

      this.layer_Wp = new VectorLayer({ source: this.vectorSourceWp })
      this.layer_WpLine = new VectorLayer({ source: this.vectorSource_WpLine })
      this.layer_WpGridLine = new VectorLayer({ source: this.vectorSource_GridLine })
      this.layer_Grid = new VectorLayer({ source: this.vectorSourceGridWp })
      const layerGridHome = new VectorLayer({ source: this.vectorSourceGridHome })
      this.layer_Hives = new VectorLayer({ source: this.vectorSourceHives })
      this.layer_Uavs = new VectorLayer({ source: this.vectorSourceUavs })

      const layer_FlyingPath = new VectorLayer({ source: this.vectorSource_FlyingPath })
      this.map = new Map({
        layers: [this.layer_Map, layer_FlyingPath, this.layer_WpLine, this.layer_Wp, this.layer_WpGridLine, this.layer_Grid, layerGridHome, this.layer_Hives, this.layer_Uavs],
        target: 'mapcontainer',
        view: new View({
          projection: 'EPSG:4326', // EPSG:4326即WGS84
          center: this.centerPosition,
          zoom: this.zoom // center: [12735483.107379029, 3567659.245886334],
        }),
        // 加载控件到地图容器中
        controls: defaultControls({
          zoom: true,
          rotate: false,
          attribution: false
        }).extend([
          new ScaleLine({
            // 设置比例尺单位，degrees、imperial、us、nautical、metric（度量单位）
            units: 'metric'
          })
        ])
      })
      this.map.on('singleclick', this.mapClick)
      this.map.on('dblclick', this.mapDbClick)
    },
    mapClick(mapsEvent) {
      var position = mapsEvent.coordinate // 点击的坐标 [ 114.44734811439332, 30.451819224204485 ]
      // this.showToast('点击了坐标：' + position)
    },
    mapDbClick() {

    }
  }
}
</script>
