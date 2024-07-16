<template>
    <div id="map" class="map">
        <el-button type="warning" size="mini" style="position:absolute;z-index:10;" @click="drawGeometry('polygon')">绘制面
        </el-button>
        <el-button type="warning" size="mini" style="position:absolute;z-index:10;margin-left:120px;" @click="drawGeometry('polyline')">绘制线
        </el-button>
        <el-button type="warning" size="mini" style="position:absolute;z-index:10;margin-left:220px;" @click="sendMsg()">发送
        </el-button>
        <!--隐藏掉CESIUM底部的ICON-->
        <div id="creditContainer" class="creditContainer" style="position:absolute;display:none;">
        </div>
    </div>
</template>
 
<script>
/*openlayer*/

export default {
    data() {
        return {
            viewer: null,
            handler: null,
            positions: [], //leftclick记录的点
            moveposition: [], // mouse move记录的点，总是比leftclick多一个点
            GeometryShape: null,
        };
    },
    methods: {
        drawGeometry(drawMode) {
            let self = this;
            /*
             * 鼠标左键单击事件发生，用两个数组来存点坐标
             * 鼠标移动事件，利用两个数组长度比较，左键单击事件发生时，两个长度一样，moveposition总添加第一个移动的点坐标；
             * 当鼠标移动事件发生时，moveposition长度总比positions多1，moveposition[moveposition.length-1]更新为最后一个动点
             * 鼠标左键双击发生时，结束鼠标交互事件
             */
            self.handler = new Cesium.ScreenSpaceEventHandler(
                self.viewer.scene.canvas
            );
            var activePosition;
            self.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
                Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
            );
            self.handler.setInputAction(function (e) {
                self.moveposition.pop();
                self.drawshape(self.moveposition, {
                    drawMode: drawMode,
                    color: Cesium.Color.RED,
                    width: 3,
                });
                self.viewer.entities.remove(self.GeometryShape);
                self.GeometryShape = undefined;
                self.moveposition = [];
                self.positions = [];
                self.handler.destroy();
            }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
            self.handler.setInputAction(function (e) {
                //此获取包含地形坐标的高度
                var positions = self.viewer.scene.pickPosition(e.position);
                // let ray = self.viewer.camera.getPickRay(e.position);
                // let leftclickcartesian = self.viewer.scene.globe.pick(ray, self.viewer.scene);
                //此获取的是无高度的空间直角坐标系
                // let positions= self.viewer.camera.pickEllipsoid(e.position, self.viewer.scene.globe.ellipsoid);
                //动态加面改进
                if (self.positions.length == 0) {
                    activePosition = new Cesium.CallbackProperty(function () {
                        if (drawMode == "polygon") {
                            return new Cesium.PolygonHierarchy(
                                self.moveposition
                            );
                        }
                        return self.moveposition;
                    }, false);
                    self.GeometryShape = self.drawshape(activePosition, {
                        drawMode: drawMode,
                        color: Cesium.Color.RED,
                        width: 3,
                    });
                }
                self.positions.push(positions);
                self.moveposition.push(positions);
                //动态添加点
                self.viewer.entities.add({
                    position: positions,
                    point: {
                        pixelSize: 5,
                        color: Cesium.Color.BLUE,
                        outlineColor: Cesium.Color.WHITE,
                        outlineWidth: 1,
                    },
                });
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

            self.handler.setInputAction(function (e) {
                // let ray = self.viewer.camera.getPickRay(e.endPosition);
                // let mousemovecartesian = self.viewer.scene.globe.pick(ray, self.viewer.scene);
                var mousemovecartesian = self.viewer.scene.pickPosition(
                    e.endPosition
                );
                // let mousemovecartesian= self.viewer.camera.pickEllipsoid(e.endPosition, self.viewer.scene.globe.ellipsoid);
                //两个if条件控制，保证当moveposition的长度与positions的长度一致时，moveposition push 鼠标移动的点
                if (self.moveposition.length === self.positions.length + 1) {
                    //当moveposition的长度比positions大1时，一直更新最新的动点
                    self.moveposition[self.moveposition.length - 1] =
                        mousemovecartesian;
                    // console.log("this.moveposition",self.moveposition);
                } else if (self.moveposition.length === self.positions.length) {
                    //长度一样添加鼠标动点坐标
                    self.moveposition.push(mousemovecartesian);
                    // console.log("this.moveposition",self.moveposition.length);
                    // console.log("this.positions",self.positions.length);
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            // this.measure.measureAreaSpace(this.viewer,this.handler);
        },
        //绘制图形的函数
        drawshape(positions, config) {
            var config = config ? config : {};
            var shape;
            if (config.drawMode == "polygon") {
                shape = this.viewer.entities.add({
                    polygon: {
                        hierarchy: positions, //new Cesium.PolygonHierarchy(positions),
                        material: config.color
                            ? config.color
                            : new Cesium.ColorMaterialProperty(
                                  Cesium.Color.WHITE.withAlpha(0.7)
                              ),
                        width: config.width ? config.width : 2,
                    },
                });
            } else if (config.drawMode == "polyline") {
                shape = this.viewer.entities.add({
                    polyline: {
                        clampToGround: true,
                        positions: positions,
                        material: config.color
                            ? config.color
                            : new Cesium.Color.fromCssColorString(
                                  "#FFD700"
                              ).withAlpha(0.2),
                        width: config.width ? config.width : 3,
                    },
                });
            }
            return shape;
        },
        init3dmap() {
            Cesium.Ion.defaultAccessToken =
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjNzRiNzNkYS0zZTRmLTRhOTMtODFlNS0zOWFhN2FmYzZmYjkiLCJpZCI6MTUyMTEwLCJpYXQiOjE2ODg2OTYyMDl9.sWkoSUmLFPfbMTMFgAZeQKjBQERg-TZPBBtIN34sDNQ";
            //初始化3D底图
            this.viewer = new Cesium.Viewer("map", {
                geocoder: false,
                homeButton: false,
                sceneModePicker: false,
                baseLayerPicker: false,
                navigationHelpButton: false,
                animation: false, //左下角的动画控件的显示
                shouldAnimate: false, //控制模型动画
                timeline: false,
                creditContainer: "creditContainer",
                creditViewport: "creditContainer",
                fullscreenButton: false,
                infoBox: false,
                terrainProvider: Cesium.createWorldTerrain(), //使用世界地形，默认的地形
                selectionIndicator: false,
                // baseLayerPicker:false,
                // timeline:true,
                // homeButton:false,
                // fullscreenButton:false,
                // infoBox:false,
                // sceneModePicker:false,
                // navigationInstructionsInitiallyVisible:false,
                // navigationHelpButton:false,
                // shouldAnimate : true
            });
            //开启深度检测，不然画的线面会飘在模型表面
            this.viewer.scene.globe.depthTestAgainstTerrain = true;
            //加载地形
            // viewer.terrainProvider=new Cesium.createWorldTerrain();
            //加载本地发布的地形
            // viewer.terrainProvider = new Cesium. CesiumTerrainProvider({url: "http://localhost/terrain"});
            //不使用地形
            // viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider()

            //相机操作
            this.viewer.scene.camera.setView({
                destination: new Cesium.Cartesian3.fromDegrees(
                    112.405419,
                    23.073514,
                    20000
                ),
                orientation: {
                    heading: 0.0, //当前的方向，正北。方位角，北偏东的角度
                    pitch: Cesium.Math.toRadians(-60), //垂直视线方向和水平面的夹角,Pitch为正 表示方向向量指向水平平面上方，反之表示方向向量指向平面下方，正值从下往上看
                    roll: 0.0, //平面的旋转角度。是方向向量以正东方向为轴的旋转角度,40.0向上翻
                },
            });
        },

        //init2Dmap openlayer6
        init2dmap() {
            var layers = [
                new TileLayer({
                    source: new TileWMS({
                        url: "https://ahocevar.com/geoserver/wms",
                        params: {
                            LAYERS: "ne:NE1_HR_LC_SR_W_DR",
                            TILED: true,
                        },
                    }),
                }),
            ];

            var map = new Map({
                controls: defaultControls().extend([
                    new ScaleLine({
                        units: "degrees",
                    }),
                ]),
                layers: layers,
                target: "map",
                view: new View({
                    projection: "EPSG:4326",
                    center: [0, 0],
                    zoom: 2,
                }),
            });
        },
        /**发送信息 */
        sendMsg() {
            const modifiedData = {
            // 修改后的信息...
            url:'op',
            sn:'ppp',
            data:'pppp',
        };
        // 向原始窗口发送消息，传递修改后的信息
        window.opener.postMessage({ modifiedData }, '*');
        },
        getMsg(event){
            console.log('的影子');
            console.log(event);
            // console.log(window.location.origin);
            // if (event.origin === window.location.origin) {
            //     const receivedString = event.data;
            //     // const receivedObject = JSON.parse(receivedString);
            //     // console.log(receivedObject);
            //     console.log("Received message in new window:", event.data.name);
            //     // 进行相应的操作，如更新页面内容等
            // }
        },
    },
    mounted() {
        const id = this.$route.query.ip;
        document.title = "临时上传-" + id; // 设置页面标题
        // this.initmap();
        this.init3dmap();

        window.addEventListener("message", (event) => this.getMsg(event));
        // window.addEventListener("message", this.getMsg);
    },
    beforeDestroy() {
        //移除
        window.removeEventListener("message",(event)=> this.getMsg(event));
        // window.removeEventListener("message", this.getMsg);
    },
};
</script>
<style lang="scss">
.map {
    position: absolute;
    width: 100%;
    // height:600px;
    height: 100%;
}
</style>
 