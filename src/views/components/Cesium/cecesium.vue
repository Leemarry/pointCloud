<!-- cesium.js  组件面 -->
<template>
    <div class="cesiumOutdiv">
        <div id="cesiumContainer"></div>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { markRaw } from "vue";
import CesiumDraw from "./cesiumDrawViewer.vue";
import { mapGetters } from "vuex";
import { calculateSquareCoordinates, } from "@/views/core/Geo"
var palaceTileset = null; //3DTilest模型
const dataSourcePromises = [];
const kmlUrls = [
    "http://127.0.0.1:9090/ceshi/kml/1.kml",
    "http://127.0.0.1:9090/ceshi/kml/2.kml",
    "http://127.0.0.1:9090/ceshi/kml/3.kml",
    "http://127.0.0.1:9090/ceshi/kml/4.kml",
    "http://127.0.0.1:9090/ceshi/kml/5.kml",
    "http://127.0.0.1:9090/ceshi/kml/6.kml",
    "http://127.0.0.1:9090/ceshi/kml/7.kml",
    "http://127.0.0.1:9090/ceshi/kml/8.kml"
];
let imagelayer;
export default {
    name: "CesiumMap",
    //import引入的组件需要注入到对象中才能使用
    components: {},
    data() {
        //这里存放数据
        return {
            viewer: null,
        };
    },
    //让组件接收外部传来的数据
    props: {

    },

    //监听属性 类似于data概念
    computed: {

    },
    //监控data中的数据变化
    watch: {

    },
    //方法集合
    methods: {
        // 实例Cesium
        CreateCesium() {
            var url;
            Cesium.Ion.defaultAccessToken =
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ODBiMzY4OS1iYmIwLTQwM2UtYjRmOS05NmE4ZTRlNDdhYWEiLCJpZCI6MTUyMTEwLCJpYXQiOjE3MDk3NzI2MzJ9.PwUC2tyDTy4MCHzRspKzCvAJgZuvN9z2sjcQCC_iLJs";
            var viewer = new Cesium.Viewer("cesiumContainer", {
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
                fullscreenElement: document.body, //全屏时渲染的HTML元素 暂时没发现用处
                //添加本地瓦片地图
                // imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
                //     url: "https://elevation3d.arcgis.com/arcgis/rest/services/World_Imagery/MapServer",
                // }),
                // 天地图地形
                terrainProvider: new Cesium.CesiumTerrainProvider({
                    url: "http://data.mars3d.cn/terrain"
                })
            });

            if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) { //判断是否支持图像渲染像素化处理
                viewer.resolutionScale = window.devicePixelRatio;
            }
            //是否开启抗锯齿
            viewer.scene.fxaa = true; // 关闭fxaa 最新的cesium已经将fxaa移到PostProcessStageCollection
            viewer.scene.postProcessStages.fxaa.enabled = true;

            // 设置默认相机视角 // 工厂 112.26670, 31.01892 // 县城 114.45006173 ,29.62837653
            viewer.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(114.45006173, 29.62837653, 1000),
                // 方向，俯视和仰视的视角
                orientation: {
                    heading: Cesium.Math.toRadians(0), // 设置偏航角度（单位：弧度）
                    pitch: Cesium.Math.toRadians(-90), // 设置俯仰角度（单位：弧度）
                    roll: Cesium.Math.toRadians(0) // 设置横滚角度（单位：弧度）
                }
            });

            this.viewer = viewer

            window.viewer = viewer;

        },


        doPartition() {
            var viewer = this.viewer
            let self = this;
            const kmlUrls = [
                "http://127.0.0.1:9090/ceshi/kml/1.kml",
                "http://127.0.0.1:9090/ceshi/kml/2.kml",
                "http://127.0.0.1:9090/ceshi/kml/3.kml",
                "http://127.0.0.1:9090/ceshi/kml/4.kml",
                "http://127.0.0.1:9090/ceshi/kml/5.kml",
                "http://127.0.0.1:9090/ceshi/kml/6.kml",
                "http://127.0.0.1:9090/ceshi/kml/7.kml",
                "http://127.0.0.1:9090/ceshi/kml/8.kml"
            ];

            kmlUrls.forEach(function (kmlUrl, index) {
                let addData = Cesium.KmlDataSource.load(kmlUrl);
                addData.then(function (dataSource) {
                    dataSource.id = index; // Assign ID to the data source
                    viewer.dataSources.add(dataSource);
                    viewer.zoomTo(dataSource); // Zoom to the dataSource

                    // Attach click event to the entities in the dataSource
                    dataSource.entities.values.forEach(entity => {
                        entity.description = 'Data source ID: ' + index; // Attach a description for identification
                        entity.isPickable = true; // Ensure entities are pickable
                        entity.dataSourceId = index; // Attach data source ID to the entity
                        entity.name = 'source' + index; // Attach data source ID to the entity
                    });

                    console.log(dataSource, dataSource.entities);

                    // Click event handler for the viewer
                    viewer.screenSpaceEventHandler.setInputAction((movement) => {
                        var pickedObject = viewer.scene.pick(movement.position);
                        if (Cesium.defined(pickedObject)) {
                            var entity = pickedObject.id;
                            console.log(pickedObject);
                            if (Cesium.defined(entity) && Cesium.defined(entity.dataSourceId)) {
                                console.log('Clicked on data source with ID: ' + entity.dataSourceId);

                                self.$bus.$emit('send:readkml', entity.dataSourceId);  //发送保存至minio
                                // self.op(); // 确保这里的 this 指向 Vue 实例


                            }
                        }
                    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                    // viewer.screenSpaceEventHandler.setInputAction(function (movement) {
                    //     var pickedObject = viewer.scene.pick(movement.position);
                    //     if (Cesium.defined(pickedObject)) {
                    //         var entity = pickedObject.id;
                    //         console.log(pickedObject);
                    //         if (Cesium.defined(entity) && Cesium.defined(entity.dataSourceId)) {
                    //             console.log('Clicked on data source with ID: ' + entity.dataSourceId);
                    //             // Perform actions based on the clicked data source ID
                    //             if (entity.dataSourceId) {
                    //                 this.op()

                    //             }
                    //         }
                    //     }
                    // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                });

                dataSourcePromises.push(addData);
            });
            viewer.scene.requestRender();
        },
        op(route, color) {

            this.drawLines(route, color)

        },
        async drawLines(PositionsList, color) {
            console.log('PositionsList', PositionsList);
            var viewer = this.viewer
            let self = this;
            if (PositionsList.length > 0) {
                // 设置默认相机视角
                viewer.camera.setView({
                    destination: Cesium.Cartesian3.fromDegrees(PositionsList[0][0], PositionsList[0][1], 500),
                    // 方向，俯视和仰视的视角
                    orientation: {
                        heading: Cesium.Math.toRadians(0), // 设置偏航角度（单位：弧度）
                        pitch: Cesium.Math.toRadians(-90), // 设置俯仰角度（单位：弧度）
                        roll: Cesium.Math.toRadians(0) // 设置横滚角度（单位：弧度）
                    }
                });
            }

            // this.clearLines(); // 清除
            // 定义航点数组
            var waypoints = [];

            // // 添加航点
            window.viewer.scene.globe.depthTestAgainstTerrain = false;
            for (let i = 0; i < PositionsList.length; i++) {
                var Position = PositionsList[i];
                var longitude = Position[0];
                var latitude = Position[1];
                var height = null;
                var position = Cesium.Cartographic.fromDegrees(longitude, latitude);
                console.log('position', position);
                var updatedPositions = await Cesium.sampleTerrainMostDetailed(
                    viewer.terrainProvider,
                    [position]
                );



                height = updatedPositions[0].height + 10;

                var altitude = height; // 指定航点的高度
                var newPosition = Cesium.Cartesian3.fromDegrees(
                    longitude,
                    latitude,
                    altitude
                );
                var pointEntity = new Cesium.Entity({
                    position: newPosition,
                    label: {
                        font: "16px sans-serif",
                        // text: "航点",
                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(0, -10)
                    },
                    id: "storePoint" + Date.now(),

                    point: {
                        color: Cesium.Color.YELLOW,
                        pixelSize: 10
                    }
                });

                window.viewer.entities.add(pointEntity);
                waypoints.push(newPosition);
            }
            // 添加航线
            var redLine = viewer.entities.add({
                id: "storePolyline" + Date.now(),
                name: "绘制上传的航线",
                polyline: {
                    positions: waypoints,
                    width: 3,
                    material: color
                }
            });

            viewer.scene.requestRender();
        },
        /**清除上传航线 */
        clearLines() {
            var viewer = this.viewer
            let self = this;

            // 获取所有实体的数组
            var entities = viewer.entities.values;
            // 遍历数组，移除所有非 this.vehicleEntity 的实体
            // 遍历数组，移除所有 id 中包含 "hang" 的实体
            for (var i = 0; i < entities.length; i++) {
                if (
                    entities[i].id &&
                    (entities[i].id.indexOf("store") !== -1 ||
                        entities[i].id.startsWith("store"))
                ) {
                    viewer.entities.remove(entities[i]);
                    i--;
                    viewer.scene.requestRender();
                }
            }
            viewer.entities.removeById("storePolyline");
        },
        /**清除 */
        removeDataSources() {
            var viewer = this.viewer
            dataSourcePromises.forEach(function (dataSourcePromise) {
                dataSourcePromise.then(function (dataSource) {
                    viewer.dataSources.remove(dataSource);
                });
            });
            viewer.scene.requestRender();
        },
        addimageryProvider() {
            var viewer = this.viewer
            var imageryProvider = new Cesium.UrlTemplateImageryProvider({
                // url: "./result/{z}/{x}/{y}.png",  
                url: 'http://localhost:456/result/{z}/{x}/{y}.png',
                // url: "/map/Map/result/{z}/{x}/{y}.png", 
                //http://localhost:456/map/Map/result/{z}/{x}/{y}.png
            });
            // 图层添加
            viewer.imageryLayers.addImageryProvider(imageryProvider);

        },



        showToast(msg) {
            this.$layer.msg(msg);
        },
        showMessage(msg, type) {
            this.$message({
                message: msg,
                type: type
            });
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() { },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.CreateCesium();
        // this.doPartition();
    },
    beforeCreate() { }, //生命周期 - 创建之前
    beforeMount() { }, //生命周期 - 挂载之前
    beforeUpdate() { }, //生命周期 - 更新之前
    updated() { }, //生命周期 - 更新之后
    beforeDestroy() {
        // observer.disconnect();
    }, //生命周期 - 销毁之前
    destroyed() { }, //生命周期 - 销毁完成
    activated() { } //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
.cesiumOutdiv {
    // 引用注意外侧
    width: 100% !important;
    height: 100% !important;
}
#cesiumContainer {
    width: 100%;
    height: 100%;
}
</style>
