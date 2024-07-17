import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// fade/zoom 等
import 'element-ui/lib/theme-chalk/base.css'
// collapse 展开折叠
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';

import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

Vue.component(CollapseTransition.name, CollapseTransition)

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
// import s from './store/index' 
import router from './router'
import VueAMap from 'vue-amap'


import '@/icons' // icon
import '@/permission' // permission control

// 将自动注册所有组件为全局组件
import dataV from '@jiaminghi/data-view'
Vue.use(dataV)

import gisUtil from './utils/gisUtil.js'
Vue.prototype.$gisUtil = gisUtil

import dateUtil from './utils/dateUtil.js'
Vue.prototype.$dateUtil = dateUtil

import toolUtil from './utils/toolUtil.js'
Vue.prototype.$toolUtil = toolUtil

import machineUtil from './utils/machineUtil.js'
Vue.prototype.$machineUtil = machineUtil

import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts

import VueParticles from 'vue-particles'
Vue.use(VueParticles)

import uploader from 'vue-simple-uploader'
Vue.use(uploader)

import lottie from 'vue-lottie'
Vue.component('lottie', lottie)

import tinymce from 'tinymce'
import VueTinymce from '@packy-tang/vue-tinymce'
Vue.prototype.$tinymce = tinymce // 将全局tinymce对象指向给Vue作用域下
Vue.use(VueTinymce) // 安装vue的tinymce组件

/**icon 图标 */
import "@/assets/css/iconfont.css";
import "@/assets/css/icon/iconfont.css"
import "@/assets/icons/iconfont.css"
Vue.prototype.$tag = 0


import localForage from "localforage";

import VueWorker from 'vue-worker' // Web worker插件
Vue.use(VueWorker)

// Vue.prototype.$webSocketPath = 'ws://192.168.0.207:8765'
// Vue.prototype.$webSocketPath = 'ws://127.0.0.1:8765'
// Vue.prototype.$webSocketPath = 'ws://192.168.0.109:8765'
// Vue.prototype.$webSocketPath = 'ws://119.45.227.52:8765'
// Vue.prototype.$webSocketPath = 'ws://efuavserverhost:8080' // docker容器地址

import layer from 'vue-layer'
import 'vue-layer/lib/vue-layer.css'
Vue.prototype.$layer = layer(Vue)

// 使用视频播放器
import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)

import '@/assets/tcplayer/tcplayer.min.css'
// import '@/assets/TcPlayer-2.4.1/TcPlayer-2.4.1.js'
// import '@/assets/TcPlayer-2.4.1/TcPlayer-module-2.4.1.js'
import { TcPlayer } from '@/assets/TcPlayer-2.4.1/TcPlayer-2.4.1.js'
Vue.prototype.TcPlayer = TcPlayer

Vue.prototype.$layer = layer(Vue, { // 全局配置项
        msgtime: 3 // 目前只有一项，即msg方法的默认消失时间，单位：秒
    })
    /**
     * If you don't want to use mock-server
     * you want to use MockJs for mock api
     * you can execute: mockXHR()
     *
     * Currently MockJs will be used in the production environment,
     * please remove it before going online ! ! !
     */
    // if (process.env.NODE_ENV === 'production') {
    //     const { mockXHR } = require('../mock')
    //     mockXHR()
    // }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
import Directives from './directive'

Vue.use(Directives)

import Plugin from 'v-fit-columns';
Vue.use(Plugin);


// import VueCesium from 'vue-cesium'
// Vue.use(VueCesium, {
//     // cesiumPath 是指引用的Cesium.js路径，如
//     // 项目本地的Cesium Build包，vue项目需要将Cesium Build包放static目录：
//     // cesiumPath: '/static/CesiumUnminified/Cesium.js',
//     // 个人在线Cesium Build包：
//     // cesiumPath: 'https://zouyaoji.top/vue-cesium/statics/Cesium/Cesium.js'
//     // 个人在线SuperMap Cesium Build包（在官方基础上二次开发出来的）：
//     // cesiumPath: 'https://zouyaoji.top/vue-cesium/statics/SuperMapCesium/Cesium.js'
//     // 官方在线Cesium Build包，有CDN加速，推荐用这个：
//     cesiumPath: 'https://unpkg.com/cesium@latest/Build/Cesium/Cesium.js',
//     // 指定Cesium.Ion.defaultAccessToken，使用Cesium ion的数据源需要到https://cesium.com/ion/申请一个账户，获取Access Token。不指定的话可能导致 Cesium 在线影像加载不了
//     accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwNGIyMDFlNi1kYTI0LTRhMGItOWVkMC00MWUwYjk1ZTNmNWYiLCJpZCI6MTE5MDI4LCJpYXQiOjE2NzE2OTE0Njl9.ju0Ps-7jS1_YS9_W6ulhGlWYds4mI7mjvGGAJOfYChg'
// })

import MyGlobalFooter from './views/components/MyGlobalFooter.vue';


const EventBus = new Vue();
Vue.prototype.$EventBus = EventBus;

Vue.mixin({
  beforeDestroy() {
    this.$EventBus.$off();
  },
});

import BusFactory from './bus'
// 创建一个 Vue 实例
const vueInstance = new Vue()
// 在Vue原型上添加$bus属性，使得在所有组件中都能够访问到同一个事件总线实例
Vue.prototype.$bus = BusFactory(vueInstance)

import gtMessage from "./message"
Vue.prototype.$gtmessage = gtMessage;

// Vue.prototype.$bus = BusFactory;



Vue.component('my-global-footer', MyGlobalFooter);


setTimeout(() => {
    // localStorage.clear()
    Vue.use(VueAMap)
        // 初始化高德地图的 key 和插件
    VueAMap.initAMapApiLoader({
        key: '690ee7d7356fc5f1d90c0f1d3a650d70',
        plugin: [
            "AMap.Autocomplete", // 输入提示插件
            "AMap.PlaceSearch", // POI搜索插件
            "AMap.Scale", // 右下角缩略图插件 比例尺
            "AMap.OverView", // 地图鹰眼插件
            "AMap.ToolBar", // 地图工具条
            "AMap.MapType", // 类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
            "AMap.PolyEditor", // 编辑 折线多，边形
            "AMap.CircleEditor", // 圆形编辑器插件
            "AMap.Geolocation", // 定位控件，用来获取和展示用户主机所在的经纬度位置
            "AMap.Geocoder", // 获取地理位置编码
            "AMap.MouseTool", // 工具条
            "AMap.RangingTool" // 距离测量
        ],
        // 默认高德 sdk 版本为 1.4.4
        v: '1.4.4'
    })
}, 0)

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})