<!--
 * @Date: 2024-07-17 10:27:55
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\views\mediaPreviewPointCloud\index copy.vue
 * @Description: Do not edit
-->
<!-- 预览点云-->
<template>
  <div class="cesiumCon ">
    <!-- 工具 -->
    <!-- <div class="tool"> 工具</div> -->
    <measureViewer ref="measure" class="tool" />
    <div id="cesiumViewer" class="cesiumViewer" />
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等!）
//例如：import 《组件名称》 from '《组件路径》';
// import * as turf from '@turf/turf';
// import GraphicManager from '@/views/core/GraphicManager';
// // import MarkerViewer from './markerViewer.vue';
// import { CesiumPolygon } from '@/views/core/Graphic';
// import GraphicType from '@/views/core/GraphicType';
// import { open } from 'shapefile';
// import { moveDiv } from '@/views/core/utils';
// import $ from 'jquery';
// import { checkComponent, checkViewer, getPolygonArea } from '@/views/core/utils';
// import { mapGetters } from 'vuex';
// import measureViewer from './core/measurePanel.vue';
export default {
    name: '',
    //import引入的组件需要注入到对象中才能使用
    components: {  },
    //让组件接收外部传来的数据
    props: {
    },
    data() {
        //这里存放数据
        return {
            Viewer: null,
            cesiumLoading: false,
            tileset: null,
            src: null
        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = parseInt(urlParams.get('id'), 10); // 假设 id 是整数
        const src = decodeURIComponent(urlParams.get('src'));
        const dataString = urlParams.get('data');
        const data = JSON.parse(decodeURIComponent(dataString));
        // const data = decodeURIComponent(urlParams.get('data'));
        const myObject = { id, src, data };
        console.log(myObject, urlParams); // 输出: { id: 1, name: 'Example', data: 'Some data' }
        this.src = src;
        // eslint-disable-next-line no-undef
        this.tileset = new Cesium.Cesium3DTileset({
            url: src// 'http://127.0.0.1:9090/efuavmodel/pointCloud/kunmingPv/tileset.json',
        });
        this.initCesium(this.src);
    },
    beforeCreate() { }, //生命周期 - 创建之前
    beforeMount() { }, //生命周期 - 挂载之前
    beforeUpdate() { }, //生命周期 - 更新之前
    updated() { }, //生命周期 - 更新之后
    beforeDestroy() { }, //生命周期 - 销毁之前
    destroyed() { }, //生命周期 - 销毁完成
    activated() { },
    //方法集合
    methods: {
        // 实例Cesium
        initCesium(src) {
            // 初始时，判断视口是否存在
            Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjNzRiNzNkYS0zZTRmLTRhOTMtODFlNS0zOWFhN2FmYzZmYjkiLCJpZCI6MTUyMTEwLCJpYXQiOjE2ODg2OTYyMDl9.sWkoSUmLFPfbMTMFgAZeQKjBQERg-TZPBBtIN34sDNQ'; //密钥 否则页面提示
            // 将窗口设置为cesiumViewer
            const viewer = new Cesium.Viewer('cesiumViewer', {
                selectionIndicator: false, //关闭绿色点击框
                //需要进行可视化的数据源的集合
                animation: false, //是否显示动画控件
                timeline: false, //是否显示时间线控件
                shouldAnimate: false,
                homeButton: false, //是否显示Home按钮
                fullscreenButton: false, //是否显示全屏按钮
                baseLayerPicker: false, //是否显示图层选择控件
                geocoder: false, //是否显示地名查找控件
                sceneModePicker: false, //是否显示投影方式控件
                navigationHelpButton: false, //是否显示帮助信息控件
                infoBox: false, //是否显示点击要素之后显示的信息
                requestRenderMode: true, //启用请求渲染模式
                scene3DOnly: false, //每个几何实例将只能以3D渲染以节省GPU内存
                sceneMode: 3, //初始场景模式 1 2D模式 2 2D循环模式 3 3D模式  Cesium.SceneMode
                terrainProvider: Cesium.createWorldTerrain(),
                //添加本地瓦片地图
                imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
                    url: 'https://elevation3d.arcgis.com/arcgis/rest/services/World_Imagery/MapServer'
                })
            });
            viewer.cesiumWidget.creditContainer.style.display = 'none'; // 去除logo
            viewer.scene.globe.depthTestAgainstTerrain = true; //解决地形遮挡entity问题
            // 开启抗锯齿
            viewer.scene.postProcessStages.fxaa.enabled = true;
            this.Viewer = viewer;
            window.viewer = viewer;
            this.addtileset(src)
            // this.reloadLoadProgress(src,this.Viewer)
        },
        addtileset(src) {
            if (!this.tileset) {
                // eslint-disable-next-line no-undef
                this.tileset = new Cesium.Cesium3DTileset({
                    url: src // 'http://127.0.0.1:9090/efuavmodel/pointCloud/kunmingPv/tileset.json', // http://127.0.0.1:9090/efuavmodel/pointCloud/kunmingPv/tileset.json
                    // ./pv/tileset.json
                });
            }
            this.Viewer.scene.primitives.add(this.tileset);
            this.Viewer.zoomTo(this.tileset);
        },
        addimageryProvider() {
            var viewer = this.viewer
            // eslint-disable-next-line no-undef
            var imageryProvider = new Cesium.UrlTemplateImageryProvider({
                // url: "./result/{z}/{x}/{y}.png",
                url: 'http://localhost:456/result/{z}/{x}/{y}.png'
                // url: "/map/Map/result/{z}/{x}/{y}.png",
                //http://localhost:456/map/Map/result/{z}/{x}/{y}.png
            });
            // 图层添加
            viewer.imageryLayers.addImageryProvider(imageryProvider);
        }
    } //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.cesiumCon {
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: relative;
}
#cesiumViewer{
    height: 100%;
    width: 100%;
    position: absolute;
}

.tool{
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 9;
}

</style>
