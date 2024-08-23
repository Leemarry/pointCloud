<!-- cesium.js  组件面 -->
<template>
  <div class="cesiumOutdiv cesiumCon">
    <div id="cesiumContainer" />
    <!-- <CesiumTool v-if="viewer" v-bind="$attrs" class="SurveyingTools" :viewer="viewer" v-on="$listeners" /> -->
    <!-- 绘画 -->
    <CesiumDraw
      v-if="viewer"
      v-bind="$attrs"
      :cursor-tip-distance="CursorTipDistance"
      :viewer="viewer"
      :tilesetsrc="src"
      :urioptions="urioptions"
      v-on="$listeners"
      @sendclearLinesAndstore="clearLinesAndStore"
      @senddoFlyCommands="senddoFlyCommandsEvent"
      @editEvent="CesiumEditEvent"
      @sendAreaText="setAreaText"
    />
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import CesiumDraw from './tool/cesiumDrawViewer.vue';
// import CesiumTool from './tool/cesiumTool.vue';
// import TilesetManager from './core/TilesetManager'
import ImageryManager from './core/ImageryManager'
import { mapGetters } from 'vuex';
import { calculateSquareCoordinates } from '@/views/core/Geo'
let imagelayer;
// eslint-disable-next-line no-unused-vars
var tilesetManager;
// eslint-disable-next-line no-unused-vars
var imageryManager;
export default {
    name: 'CesiumMap',
    //import引入的组件需要注入到对象中才能使用
    components: { CesiumDraw },
    //让组件接收外部传来的数据
    props: {
        /**是否飞行移动 */
        isflymove: {
            type: Boolean,
            default: false
        },
        // 2D/3D ，值改变后则改变地图为2d或3d
        MapType: {
            type: String,
            default: '3D'
        },
        // 高德/百度/天地图 等，值改变后改变地图类型(url,服务接口,图层类型)
        MapProvider: {
            type: String,
            default: 'tiandi'
        },
        /**默认无人机 */
        defaultUavSn: {
            type: String,
            default: 'defaultUavSn'
        }
    },
    data() {
        //这里存放数据
        return {
            urioptions: [],
            src: null,
            areaText: null,
            isLockView: true,
            /**心跳数据 */
            beatData: null,
            /**心跳包展示的无人机 */
            currentDisplayUavId: null,
            modelFlightStatusOrNot: false, // 是否模型飞行状态
            /**状态 提示器 */
            lastToast: '',
            /**模型*/
            vehicleEntity: null,
            viewer: null,
            value: '',
            signProvider: null, //标记图层
            imageryProvider: null, //影像图层
            terrainProvider: null, //地形图层
            entityMap: {}, //实体对象
            TitlesMap: {}, // 瓦片
            imageryLayersMap: {}, // 影像 用于二维
            index: 0,
            mapUrlMap: {
                baidu:
                      'http://shangetu0.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46',
                gaode:
                      'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
                tiandi:
                      'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
            },
            CursorTipDistance: {
                distanceX: 0,
                distanceY: 0
            },
            billboardsEntities: []
        };
    },

    //监听属性 类似于data概念
    computed: {
        ...mapGetters([
            'currentMid'
        ])
    },
    //监控data中的数据变化
    watch: {
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = decodeURIComponent(urlParams.get('id'));
        const src = decodeURIComponent(urlParams.get('src'));
        const title = decodeURIComponent(urlParams.get('title'))
        document.title = '预览-' + title; // 设置页面标题
        const dataString = urlParams.get('data');
        const data = JSON.parse(decodeURIComponent(dataString));
        // const data = decodeURIComponent(urlParams.get('data'));
        const myObject = { id, src, data };
        sessionStorage.setItem('rowData', JSON.stringify(myObject));
        console.log(myObject, urlParams); // 输出: { id: 1, name: 'Example', data: 'Some data' }
        this.src = src;
        // 115.48027239020547 30.910056912936394
        this.urioptions = [{
            value: src,
            label: title,
            longitude: data.lon || 115.48027239020547,
            latitude: data.lat || 30.910056912936394
        }]

        const pointItems = document.querySelectorAll('.cursor-tip-class');
        if (pointItems.length) {
            console.log('pointItems', pointItems);
            // pointItems.forEach((item) => {
            //     item.remove();
            // });
            pointItems.forEach(item => {
                item.parentNode.removeChild(item);
            });
        }
        this.CreateCesium();
    },
    beforeCreate() { }, //生命周期 - 创建之前
    beforeMount() { }, //生命周期 - 挂载之前
    beforeUpdate() { }, //生命周期 - 更新之前
    updated() { }, //生命周期 - 更新之后
    beforeDestroy() {
        this.clearAllPointAndLine()
        // observer.disconnect();
    }, //生命周期 - 销毁之前
    destroyed() { }, //生命周期 - 销毁完成
    activated() { },
    //方法集合
    methods: {
        /**获取坐标信息 */
        getCoordinates() {
            // 注册屏幕点击事件
            var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            // 监听鼠标点击事件
            handler.setInputAction(function(click) {
                var ellipsoid = viewer.scene.globe.ellipsoid;
                var cartesian = viewer.camera.pickEllipsoid(click.position, ellipsoid);

                if (cartesian) {
                    var cartographic = ellipsoid.cartesianToCartographic(cartesian);
                    var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                    var latitude = Cesium.Math.toDegrees(cartographic.latitude);

                    console.log('注册地图点击事件', '经度：', longitude, '，纬度：', latitude);
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        },
        // 注册地图点击事件
        getClickPointAdd() {
            // 注册屏幕点击事件
            var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            //注册鼠标事件,event参数是点击的地方是在哪里
            var positionList = [];
            handler.setInputAction(event => {
                //定义一个屏幕点击的事件，pickPosition封装的是获取点击的位置的坐标
                var position = viewer.scene.pickPosition(event.position);
                //输出之后我们发现坐标信息都是大数目，因为cesium定义的球体坐标都是笛卡尔坐标，所以我们需要转换笛卡尔坐标
                console.log('笛卡尔：' + position);
                //将笛卡尔坐标转化为弧度坐标
                var cartographic = Cesium.Cartographic.fromCartesian(position);
                console.log('弧度：' + cartographic);
                //将弧度坐标转换为经纬度坐标（先转弧度再转经纬度简单一点，直接转换的方法也有，不过推荐用这种）
                var longitude = Cesium.Math.toDegrees(cartographic.longitude); //经度
                var latitude = Cesium.Math.toDegrees(cartographic.latitude); //纬度
                var height = cartographic.height; //高度
                console.log('经纬度：' + longitude, latitude, height);
                positionList.push({
                    lat: latitude,
                    lng: longitude,
                    lat: height
                });
                console.log(positionList);
                // if(height < 0) {
                //     height = 0;
                // }
                // alert("经度：" + longitude + "纬度：" + latitude + "高度：" + height);
                //同时也可以将经度度转回为笛卡尔
                var ellipsoid = viewer.scene.globe.ellipsoid;
                //定义84坐标为一个Cartesian值
                var wgs84 = Cesium.Cartographic.fromDegrees(
                    longitude,
                    latitude,
                    height
                );
                //将84坐标转换为笛卡尔
                var dikaer = ellipsoid.cartographicToCartesian(wgs84);
                //赋值
                var longitude = dikaer.x;
                var latitude = dikaer.y;
                var height = dikaer.z;
                // alert("笛卡尔x：" + longitude + "笛卡尔y：" + latitude + "笛卡尔z：" + height);
                // 添加点
                viewer.entities.add({
                    position: position,
                    name: '111', //点击描上的显示信息
                    point: {
                        color: Cesium.Color.YELLOW,
                        pixelSize: 10
                        // heightReference: 相对于地面的位置
                    }
                });
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        },
        // #region
        // 实例Cesium
        CreateCesium() {
            if (window.viewer) {
                window.viewer.destroy();
            } // 初始时，判断视口是否存在
            Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjNzRiNzNkYS0zZTRmLTRhOTMtODFlNS0zOWFhN2FmYzZmYjkiLCJpZCI6MTUyMTEwLCJpYXQiOjE2ODg2OTYyMDl9.sWkoSUmLFPfbMTMFgAZeQKjBQERg-TZPBBtIN34sDNQ'; //密钥 否则页面提示
            // 将窗口设置为cesiumshiko
            window.viewer = new Cesium.Viewer('cesiumContainer', {
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
                // requestRenderMode: true, //启用请求渲染模式
                scene3DOnly: false, //每个几何实例将只能以3D渲染以节省GPU内存
                sceneMode: 3, //初始场景模式 1 2D模式 2 2D循环模式 3 3D模式  Cesium.SceneMode
                // terrainProvider: Cesium.createWorldTerrain()
                //添加本地瓦片地图
                // imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
                //     url: 'https://elevation3d.arcgis.com/arcgis/rest/services/World_Imagery/MapServer'
                // })
                imageryProvider: new Cesium.UrlTemplateImageryProvider({
                    // Satellite
                    url: 'http://127.0.0.1:9090/efuav-image/hubeijux/Satellite/{z}/{x}/{y}.png', // ok 不能删
                    //   url: 'http://127.0.0.1:9090/efuav-ortho-img/900/900/map/{z}/{x}/{y}.png'  // 黄冈
                    // url: 'http://127.0.0.1:456/static/satellite/{z}/{x}/{y}.jpg', // 456 http://localhost:456/static/satellite
                    // url: 'http://127.0.0.1:9090/efuav-image/csch/tiles/{z}/{x}/{y}.jpg' // cs

                    minimumLevel: 3,
                    maximumLevel: 18
                    // tilingScheme: new AmapMercatorTilingScheme(), //坐标矫正
                })
            });

            window.viewer.cesiumWidget.creditContainer.style.display = 'none'; // 去除logo
            window.viewer.scene.globe.depthTestAgainstTerrain = true; //解决地形遮挡entity问题
            // 开启抗锯齿
            // window.viewer.scene.postProcessStages.fxaa.enabled = true;
            this.viewer = window.viewer;
            // this.addtileset()
            //        // this.addimageryLayers(this.MapProvider);
        },
        reloadLoadProgress(viewer = window.viewer) {
            var helper = new Cesium.EventHelper();
            helper.add(viewer.scene.globe.tileLoadProgressEvent, function(e) {
                console.log('每次加载地图服务矢量切片都会进入这个回调', e);
                if (e === 0) {
                    console.log('矢量切片加载完成时的回调');
                    // that.cesiumLoading = false;//关闭加载动画
                } else {
                    console.log('每次加载地图服务矢量切片都会进入这个回调', e);
                }
            });
        },
        addtileset(src) {
            // tilesetManager = new TilesetManager(this.viewer);
            // tilesetManager.addTileset('http://127.0.0.1:9090/efuavmodel/pointCloud/kunmingPv/tileset.json')
            imageryManager = new ImageryManager(this.viewer);
            imageryManager.addImagery({ url: 'http://127.0.0.1:9090/efuavmodel/2d/result/{z}/{x}/{y}.png' }, {
                longitude: 112.27139701848677,
                latitude: 31.026628725595643,
                height: 1000
            })
        },
        addimagery() {

        },
        /**添加影像--默认tiandi 天地图 */
        addimageryLayers(MapProvider = 'tiandi') {
            const url = this.mapUrlMap[MapProvider];
            if (!url) {
                return false;
            }
            this.deleteAllImageryProvider();
            // 影像
            if (MapProvider === 'tiandi') {
                this.imageryProvider = new Cesium.ArcGisMapServerImageryProvider({
                    url: url
                });
            } else {
                this.imageryProvider = new Cesium.UrlTemplateImageryProvider({
                    url: url
                });
            }
            window.viewer.imageryLayers.addImageryProvider(this.imageryProvider);
            // 地形
            this.terrainProvider = new Cesium.createWorldTerrain({
                url: 'http://data.mars3d.cn/terrain',
                show: false
            });

            // window.viewer.terrainProvider = this.terrainProvider;
            const viewer = window.viewer
            const layers = viewer.imageryLayers;
            console.log('layers', layers);
            // //  高德路网中文注记
            // this.signProvider = new Cesium.UrlTemplateImageryProvider({
            //     url:
            //         "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
            //     minimumLevel: 3,
            //     maximumLevel: 18
            // });
            // window.viewer.imageryLayers.addImageryProvider(this.signProvider);
        },
        // 修改地图中心纬度，参数为经纬高，相机的水平方向视角（0正北，90正东，以此类推），相机的俯仰角度（0水平，-90俯视，90仰天）
        updateMapCenter(lat, lng, alt, heading, pitch) {
            const viewer = window.viewer; //
            const Position = Cesium.Cartesian3.fromDegrees(lat, lng, alt);
            var duration = 2.0; // 动画过渡时间，单位秒
            // 设置默认相机视角
            viewer.camera.setView({
                destination: Position,
                // 方向，俯视和仰视的视角
                orientation: {
                    heading: Cesium.Math.toRadians(heading), //坐标系旋转90度，将水平方向的旋转角度设置为 90 度，即顺时针旋转 90 度。
                    pitch: Cesium.Math.toRadians(pitch) //设置俯仰角度为-45度
                }
            });
        },
        //移除所有的实体对象
        deleteAll3dModel() {
            const viewer = window.viewer;
            viewer.entities.removeAll();
        },
        // 删除某个3D模型
        delete3dModel(url) {
            const viewer = window.viewer;
            const entity = this.entityMap[url]; // 根据 URL 从映射表中获取对应的实体对象
            if (entity) {
                // 取消将相机设置到模型位置
                viewer.trackedEntity = null;
                viewer.entities.remove(entity); // 从场景中移除实体对象
                delete this.entityMap[url]; // 从映射表中移除对应的实体对象
            } else {
                console.log('未找到对应 URL 的实体对象');
            }
            viewer.scene.requestRender();
        },
        // var tempEntities = viewer.entities.getById("polyline")
        /**通过id删除模型 */
        delete3dModelById(id) {
            var tempEntities = viewer.entities.getById(id);
            if (tempEntities) {
                viewer.trackedEntity = null;
                viewer.entities.remove(tempEntities); // 从场景中移除实体对象
            }
        },
        // url为模型路径，setViewport（lat,lng，alt）为添加3D模型在地图上显示的位置，false是否设置视口，(x,y,z）观察模型视口偏移量
        show3dModel(url, id, lat = 0, lng = 0, alt = 0, heading = 0, pitch = 0, roll = 0, scale = 0.5, setViewport = true, x = 0, y = 0, z = 20) {
            const viewer = window.viewer;
            viewer.entities.removeAll();
            if (this.entityMap[url]) { return false; }
            heading = 0; // -93
            // 设置模型初始朝向
            const headingValue = Cesium.Math.toRadians(heading); // 将角度值转换为弧度
            const Position = Cesium.Cartesian3.fromDegrees(lat, lng, alt);
            const orientation = Cesium.Transforms.headingPitchRollQuaternion(
                Position,
                new Cesium.HeadingPitchRoll(headingValue, pitch, roll) //模型的偏航角（heading）模型的俯仰角（pitch） 表示模型的横滚角（roll）
            );
            // 添加模型，并将实体对象保存到对象映射中
            const entity = window.viewer.entities.add({
                id: id,
                // 设置方向
                orientation: orientation,
                position: Position,
                name: '飞机',
                model: {
                    uri: url,
                    scale: scale //模型大小比例
                }
            });
            // 检查实体是否成功添加 // 设置模型初始朝向
            const entityAdded = viewer.entities.contains(entity);
            if (entityAdded) {
                console.log('模型实体成功添加');
                // 存储实体对象到映射表中
                this.entityMap[url] = entity; // 以 URL 为 key，实体对象为 value 的映射表
            } else {
                console.log('模型实体添加失败');
            }
            if (setViewport) {
                viewer.trackedEntity = entity; // 将相机设置到模型位置
                entity.viewFrom = new Cesium.Cartesian3(x, y, z);
            }
            viewer.scene.requestRender();
        },
        // 删除某个3d title
        delete3dTitles(url) {
            const viewer = window.viewer;
            const Tileset = this.TitlesMap[url]; // 根据 URL 从映射表中获取对应的实体对象
            if (Tileset) {
                // 取消将相机设置到模型位置
                viewer.scene.primitives.remove(Tileset);
                delete this.TitlesMap[url]; // 从映射表中移除对应的实体对象
            } else {
                console.log('未找到对应 URL 的实体TitlesMap对象');
            }
            viewer.scene.requestRender();
        },
        // 显示 3d title在地图上 --url
        showTitles(url) {
            const viewer = window.viewer;
            viewer.trackedEntity = undefined;
            const palace3DTileset = new Cesium.Cesium3DTileset({
                url: url, //加载倾斜示范数据
                maximumMemoryUsage: 1024 * 1024, // 设置3D Tiles的最大内存使用量--浏览器内层占用,
                maximumScreenSpaceError: 2, // 数值加大，能让最终成像变模糊,加载快;初始化的清晰度
                skipScreenSpaceErrorFactor: 16,
                dynamicScreenSpaceErrorDensity: 0.3, // 数值加大，能让周边加载变快
                dynamicScreenSpaceError: true // 根据测试，有了这个后，会在真正的全屏加载完之后才清晰化房屋
            });
            // 订阅加载完成事件
            palace3DTileset.readyPromise.then(palace3DTileset => {
                viewer.scene.primitives.add(palace3DTileset);
                const layerAdded = viewer.scene.primitives.contains(palace3DTileset);
                if (layerAdded) {
                    console.log('影像图层成功添加');
                    this.TitlesMap[url] = palace3DTileset; // 映射瓦片模型
                } else {
                    console.log('影像图层添加失败');
                }
                //设置相机视角
                window.viewer.zoomTo(
                    palace3DTileset,
                    new Cesium.HeadingPitchRange(
                        0.6,
                        -0.4,
                        palace3DTileset.boundingSphere.radius * 0.35
                    )
                );
            });
            viewer.scene.requestRender();
        },
        //添加影像图层 格式--// url: "../../../static/Maps/result/{z}/{x}/{y}.png",
        showImageryProvider(url, MapProviderDrive = 'UrlTemplateImageryProvider') {
            const viewer = window.viewer;
            var imageryProvider = new Cesium[MapProviderDrive]({
                url: url + '/{z}/{x}/{y}.png'
            });
            var layerName = '图层名称';
            var layer = viewer.imageryLayers.addImageryProvider(imageryProvider);
            layer.name = layerName;
            this.imageryLayersMap[url] = layer;
        },
        //移除影像 参数 url
        deleteImageryProvider(url) {
            const viewer = window.viewer;
            imagelayer = this.imageryLayersMap[url]; // 根据 URL 从映射表中获取对应的实体对象
            if (imagelayer != null) {
                viewer.imageryLayers.remove(imagelayer);
                delete this.imageryLayersMap[url]; // 从映射表中移除对应的实体对象
            } else {
                console.log('未找到对应 URL 的实体imagelayer对象');
            }
            viewer.scene.requestRender();
        },
        deleteAllImageryProvider() {
            const viewer = window.viewer;
            viewer.imageryLayers.removeAll();
            viewer.scene.requestRender();
        },
        //切换 3维模式    let type = "2D"
        switchSceneMode(type) {
            const viewer = window.viewer;
            switch (type) {
                case '3D':
                    viewer.scene.mode = Cesium.SceneMode.SCENE3D; //3维模式
                    break;
                case '2D':
                    viewer.scene.mode = Cesium.SceneMode.SCENE2D; // 切换到 2D 模式
                    break;
                case '2.5D':
                    viewer.scene.mode = Cesium.SceneMode.COLUMBUS_VIEW; // 2.5D 哥伦布模式
                    break;
                case '1D':
                    viewer.scene.mode = Cesium.SceneMode.MORPHING; // 变形模式
                    break;

                default:
                    break;
            }
        },
        // #endregion
        // 添加3D模型并偏移后显示在地图上
        show3dModelOffset(url, lat, lng, alt, setViewport, x = 0, y = 0, z = 0) {
            function show3dModel(url, lat, lng, alt, setViewport, x = 0, y = 0, z = 0) {
                if (arguments.length === 1) {
                    // 处理只有url的情况
                    console.log('处理只有url的情况:', url);
                } else if (arguments.length === 5 && typeof setViewport === 'boolean') {
                    // 处理不带偏移量的情况
                    console.log('处理不带偏移量的情况:', url, lat, lng, alt, setViewport);
                } else if (arguments.length === 8 && typeof setViewport === 'boolean') {
                    // 处理带偏移量的情况
                    console.log('处理带偏移量的情况:', url, lat, lng, alt, setViewport, x, y, z);
                } else {
                    // 其他情况的处理逻辑
                    console.log('其他情况的处理');
                }
            }
        },
        /** 处理父组件下发的操作 */
        handleOperation() {
            // 是否是主界面
            if (this.geoCoordinates.length > 0) {
                console.log('规划中心点');
                this.updateMapCenter(this.geoCoordinates[0][0], this.geoCoordinates[0][1], 600.05766199658808, 0, -45);
                this.drawLines()
            } else if (this.defaultUavHeartbeat && this.defaultUavHeartbeat.lng !== 0 && this.defaultUavHeartbeat.lng !== 0) {
                console.log('无人机中心点');
                const longitude = this.defaultUavHeartbeat.lng
                const latitude = this.defaultUavHeartbeat.lat;
                this.updateMapCenter(longitude, latitude, 400.05766199658808, 0, -45);
            } else {
                console.log('默认中心点');
                // 数据库： 113.36887409647213，23.155143504551752
                this.updateMapCenter(113.36887409647213, 23.155143504551752, 400.05766199658808, 0, -90);
            }
        },
        handleOperation2() {
            if (this.defaultUavHeartbeat && this.defaultUavHeartbeat.lng !== 0 && this.defaultUavHeartbeat.lng !== 0) {
                console.log('无人机中心点');
                const longitude = this.defaultUavHeartbeat.lng
                const latitude = this.defaultUavHeartbeat.lat;
                this.updateMapCenter(longitude, latitude, 400.05766199658808, 0, -45);
            } else {
                console.log('默认中心点');
                // 数据库： 113.36887409647213，23.155143504551752
                this.updateMapCenter(113.36887409647213, 23.155143504551752, 400.05766199658808, 0, -90);
            }
        },
        /**
           * @name:
           * @msg: 绘制航线-- 用于主页航线
           * @param {*} PositionsList 经度纬度数组
           * @return {*}
           */
        async drawLines(PositionsList = this.geoCoordinates) {
            const startColor = new Cesium.Color.fromCssColorString('#009DFF').withAlpha(0.3) // #9EE8E7
            const endColor = new Cesium.Color.fromCssColorString('#9EE8E7').withAlpha(0.3)
            const color = Cesium.Color.BLUE
            const lineColor = new Cesium.Color.fromCssColorString('#E6E6E6').withAlpha(0.3) // #9EE8E7
            const viewer = window.viewer;
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

            this.clearAllPointAndLine(); // 清除
            // 定义航点数组
            var waypoints = [];
            // 用于存储实体的 map
            var entityMap = new Map();

            // 添加航点
            window.viewer.scene.globe.depthTestAgainstTerrain = false;
            for (let i = 0; i < PositionsList.length; i++) {
                const currentCorlor = i == 0 ? startColor : endColor; //Cesium.Color.YELLOW;
                var Position = PositionsList[i];
                var longitude = Position[0];
                var latitude = Position[1];
                var height = null;
                var position = Cesium.Cartographic.fromDegrees(longitude, latitude);
                var updatedPositions = await Cesium.sampleTerrainMostDetailed(
                    this.terrainProvider,
                    [position]
                );
                // console.log('高度高度',updatedPositions,Position,position);
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
                        font: '16px sans-serif',
                        // text: "航点",
                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(0, -10)
                    },
                    id: 'storePoint' + i,
                    point: {
                        color: currentCorlor,
                        pixelSize: 10
                    }
                });

                window.viewer.entities.add(pointEntity);
                waypoints.push(newPosition);

                // 将实体添加到 map 中
                entityMap.set(pointEntity.id, pointEntity);
            }
            // 添加航线
            var redLine = viewer.entities.add({
                id: 'storePolyline',
                name: '绘制上传的航线',
                polyline: {
                    positions: waypoints,
                    width: 3,
                    material: lineColor, //  Cesium.Color.RED,
                    granularity: 0.03
                }
            });

            // 将航线实体添加到 map 中
            entityMap.set(redLine.id, redLine);

            // 5 秒后修改第一个点的颜色为红色
            // setTimeout(() => {
            //     var firstPoint = viewer.entities.getById("storePoint0");
            //     if (firstPoint) {
            //         firstPoint.point.color = Cesium.Color.RED;
            //     }
            // }, 5000);

            viewer.scene.requestRender();
        },
        async drawPoints(PositionsList = this.geoCoordinates) {
            const startColor = new Cesium.Color.fromCssColorString('#009DFF').withAlpha(0.3) // #9EE8E7
            const endColor = new Cesium.Color.fromCssColorString('#9EE8E7').withAlpha(0.3)
            const color = Cesium.Color.BLUE
            const lineColor = new Cesium.Color.fromCssColorString('#E6E6E6').withAlpha(0.3) // #9EE8E7
            const viewer = window.viewer;
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

            this.clearAllPointAndLine(); // 清除
            // 定义航点数组
            var waypoints = [];
            // 用于存储实体的 map
            var entityMap = new Map();

            // 添加航点
            window.viewer.scene.globe.depthTestAgainstTerrain = false;
            for (let i = 0; i < PositionsList.length; i++) {
                const currentCorlor = i == 0 ? startColor : endColor; //Cesium.Color.YELLOW;
                var Position = PositionsList[i];
                var longitude = Position[0];
                var latitude = Position[1];
                var height = null;
                var position = Cesium.Cartographic.fromDegrees(longitude, latitude);
                var updatedPositions = await Cesium.sampleTerrainMostDetailed(
                    this.terrainProvider,
                    [position]
                );
                // console.log('高度高度',updatedPositions,Position,position);
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
                        font: '16px sans-serif',
                        // text: "航点",
                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(0, -10)
                    },
                    id: 'storePoint' + i,
                    point: {
                        color: currentCorlor,
                        pixelSize: 10
                    }
                });

                window.viewer.entities.add(pointEntity);
                waypoints.push(newPosition);
                // 将实体添加到 map 中
                entityMap.set(pointEntity.id, pointEntity);
            }

            // this.$bus.$emit('send:entityMap', entityMap, viewer);  //发送保存至minio
            viewer.scene.requestRender();
        },
        /**将所有实体点颜色修改 */
        async updatePointsColor(colorPoints, indexArr) {
            const defaultStartColor = new Cesium.Color.fromCssColorString('#009DFF').withAlpha(0.3) // #9EE8E7
            const startColor = new Cesium.Color.fromCssColorString('#009DFF') // #9EE8E7
            const endColor = new Cesium.Color.fromCssColorString('#9EE8E7').withAlpha(0.3)
            const color = Cesium.Color.BLUE
            const lineColor = new Cesium.Color.fromCssColorString('#00FF00').withAlpha(0.9) // #9EE8E7
            const viewer = window.viewer;
            var waypoints = [];
            var entities = viewer.entities.values;
            for (var i = 0; i < entities.length; i++) {
                if (
                    entities[i].id &&
                      (entities[i].id.indexOf('storePoint') !== -1 ||
                          entities[i].id.startsWith('storePoint'))
                ) {
                    console.log(' entities[i]', entities[i].id); // id : storePoint_0
                    entities[i].point.color = endColor;
                }
            }
            for (let index = 0; index < indexArr.length; index++) {
                const PointId = 'storePoint' + indexArr[index]; //id: "storePoint" + i
                var radar = viewer.entities.getById(PointId);
                if (radar !== undefined) {
                    var position = radar.position.getValue(Cesium.JulianDate.now());
                    if (index === 0) {
                        radar.point.color = startColor;
                    } else {
                        radar.point.color = Cesium.Color.RED;
                    }
                    waypoints.push(position);
                }
            }
            this.clearOnlyLines()
            // // 添加航线
            var redLine = viewer.entities.add({
                id: 'storePolyline',
                name: '绘制上传的航线',
                polyline: {
                    positions: waypoints,
                    width: 3,
                    material: lineColor, //  Cesium.Color.RED,
                    granularity: 0.03
                }
            });
        },
        clearOnlyLines() {
            const viewer = window.viewer;
            viewer.entities.removeById('storePolyline');
            viewer.scene.requestRender();
        },

        /**清除上传航线 */
        clearAllPointAndLine() {
            const viewer = window.viewer;
            // 获取所有实体的数组
            var entities = viewer.entities.values;
            // 遍历数组，移除所有非 this.vehicleEntity 的实体
            // 遍历数组，移除所有 id 中包含 "hang" 的实体
            for (var i = 0; i < entities.length; i++) {
                if (
                    entities[i].id &&
                      (entities[i].id.indexOf('store') !== -1 ||
                          entities[i].id.startsWith('store'))
                ) {
                    viewer.entities.remove(entities[i]);
                    i--;
                    viewer.scene.requestRender();
                }
            }
            viewer.entities.removeById('storePolyline');
            viewer.scene.requestRender();
        },
        clearLines() {
            const viewer = window.viewer;
            // 获取所有实体的数组
            var entities = viewer.entities.values;
            // 遍历数组，移除所有非 this.vehicleEntity 的实体
            // 遍历数组，移除所有 id 中包含 "hang" 的实体
            for (var i = 0; i < entities.length; i++) {
                if (
                    entities[i].id &&
                      (entities[i].id.indexOf('store') !== -1 ||
                          entities[i].id.startsWith('store'))
                ) {
                    viewer.entities.remove(entities[i]);
                    i--;
                    viewer.scene.requestRender();
                }
            }
            viewer.entities.removeById('storePolyline');
            viewer.scene.requestRender();
            // for (var i = 0; i < entities.length; i++) {
            //     var entity = entities[i];

            //     if (entity !== this.vehicleEntity  ) {
            //         viewer.entities.remove(entity);
            //         viewer.scene.requestRender();
            //     }
            // }
        },

        showBillboard(pointlist, mainType = 'billboard', description = '', labelShow = false) {
            const viewer = window.viewer;
            this.billboardsEntities = []
            if (!pointlist || pointlist.length <= 0) { return false; }

            const pinBuilder = new Cesium.PinBuilder();

            console.log('pointlist', pointlist);

            pointlist.forEach((pointInfo, index) => {
                // 生成唯一的 id
                const url = pointInfo[2]; //
                const id = 'Billboard-' + Date.now();
                var entities = viewer.entities.values;
                // 检查 id 是否已经存在于实体数组中
                const isIdExist = entities.some(entity => entity.id === id);

                // 如果存在相同 id 的实体，则跳过创建
                if (isIdExist) {
                    // 跳过当前迭代，继续执行下一个迭代
                    console.log('存在相同 id');
                    return;
                }
                var entity = viewer.entities.add({
                    position: Cesium.Cartesian3.fromDegrees(pointInfo[0], pointInfo[1], 300),
                    label: {
                        show: labelShow,
                        font: '16px sans-serif', // 设置字体大小为16像素，使用sans-serif字体
                        // text: "航点",
                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // 水平对齐方式为中心
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // 垂直对齐方式为底部
                        pixelOffset: new Cesium.Cartesian2(0, -10), // 标签相对于点的偏移量
                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                        disableDepthTestDistance: 99000000
                    },
                    billboard: {
                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                        disableDepthTestDistance: 99000000,
                        image: pinBuilder.fromText('?', Cesium.Color.RED, 48).toDataURL(), // this.gasJPG, //
                        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY,
                        pixelOffset: new Cesium.Cartesian2(-6, 6),
                        scale: 0.45
                    },
                    id: id,
                    // name: pointInfo.name,
                    monitoItems: {
                        data: pointInfo
                    }
                });
                // entity.description = '<div style="height: 360px;">' + '重写infoBox' + '</div>'; src="${url}"
                entity.description = `
                  <label style="margin:10px 0px;" for="">当前点经度：[ 114.468056, 29.623333]</label>  
                  <span>地址：湖北省咸宁市通山县</span>
                  <img width="450" height="200" src="${url}"></img>
                  <video width="450" height="350" controls="controls" type="video/mp4" preload="auto">
                      <source src="./test2.mp4" autostart="true">
                  </video>
                  <div style=" margin:15px 0px;display: flex; align-items: center;">
                        <svg t="1711533504631" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4344" width="16" height="16"><path d="M100.452975 423.800384a411.516315 411.516315 0 0 1 823.03263 0c0 227.255278-410.287908 583.984645-410.287908 583.984645S100.452975 651.055662 100.452975 423.800384z" fill="#FFF100" p-id="4345"></path><path d="M123.301344 483.869482a459.976967 459.976967 0 0 1 460.038387-459.976968c6.940499 0 13.819578 0 20.698657 0.491363A411.516315 411.516315 0 0 0 93.328215 423.800384C93.328215 472.93666 112.737044 528.644914 143.447217 585.274472a303.600768 303.600768 0 0 1-20.145873-101.40499z" fill="#FFFFFF" p-id="4346"></path><path d="M918.571977 340.760077v2.456814c0 225.166987-365.880998 565.681382-438.786948 631.278311 22.848369 21.128599 36.852207 33.289827 36.852207 33.289827S926.986564 651.055662 926.986564 423.800384a411.516315 411.516315 0 0 0-8.414587-83.040307z" fill="#F8B62D" p-id="4347"></path><path d="M513.259117 1024l-8.046065-6.940499C488.199616 1002.380038 88.168906 654.065259 88.168906 423.800384A424.721689 424.721689 0 0 1 304.368522 54.234165a12.284069 12.284069 0 1 1 12.284069 21.435701A400.03071 400.03071 0 0 0 112.737044 423.800384c0 201.827255 343.216891 516.422265 400.522073 567.585413 7.247601-6.510557 18.978887-17.136276 33.965451-31.201536a12.284069 12.284069 0 0 1 16.767754 17.934741c-25.919386 24.568138-42.011516 38.326296-42.994241 38.940499zM601.028791 937.704415a12.284069 12.284069 0 0 1-8.660269-21.005759c14.1881-14.003839 28.314779-28.253359 42.072937-42.502879a12.284069 12.284069 0 1 1 17.627639 17.074856c-13.819578 14.372361-28.130518 28.806142-42.441459 42.994242a12.284069 12.284069 0 0 1-8.598848 3.43954zM689.71977 845.451056a12.284069 12.284069 0 0 1-8.230327-3.193858 12.284069 12.284069 0 0 1-0.859884-17.320538C785.84261 709.28215 911.201536 545.904031 911.201536 423.800384A399.539347 399.539347 0 0 0 386.794626 44.591171a12.284069 12.284069 0 1 1-7.738964-23.339731A424.168906 424.168906 0 0 1 935.769674 423.800384c0 129.904031-128.982726 298.809981-237.021114 417.658349a12.284069 12.284069 0 0 1-9.02879 3.992323z" fill="#231815" p-id="4348"></path><path d="M513.259117 438.049904m-142.126679 0a142.126679 142.126679 0 1 0 284.253359 0 142.126679 142.126679 0 1 0-284.253359 0Z" fill="#00A0E9" p-id="4349"></path><path d="M556.990403 298.072937a141.942418 141.942418 0 0 1-110.556622 257.535508 142.065259 142.065259 0 1 0 110.556622-257.535508z" fill="#036EB8" p-id="4350"></path><path d="M467.009597 570.779271A141.942418 141.942418 0 0 1 577.68906 313.243762a142.003839 142.003839 0 1 0-110.556622 257.474088z" fill="#FFFFFF" p-id="4351"></path><path d="M513.259117 592.522073a154.472169 154.472169 0 1 1 154.410749-154.472169 154.59501 154.59501 0 0 1-154.410749 154.472169z m0-284.314779a129.904031 129.904031 0 1 0 129.84261 129.84261 129.965451 129.965451 0 0 0-129.84261-129.84261z" fill="#231815" p-id="4352"></path></svg>
                  <span>咸宁市、通山县</span>
                      </div>`
                // viewer.entities.add(entity);
                this.billboardsEntities.push(id)
            })
        },
        /**重新绘制清除 信息包括 航线信息 与 执行任务后图片信息 与 分析图信息 列表信息 */
        clearLinesAndStore() {
            this.clearAllPointAndLine()
            // imageHeartbeatList  resultimageHeartbeatList
            const data = { imageHeartbeatList: [], defaultUavImageData: null, resultimageHeartbeatList: [], defaultUavResultImageData: null }
            // this.$store.dispatch('ws/setUavImageListAboutAll', data)
            this.$store.dispatch('ws/cleardefaultUavImageData', { uavId: this.defaultUavSn })
            /**清除store 航线数据 组件传递 移除 */
            this.$store.dispatch('routeData/setRouteData', { mid: null, geoCoordinates: [], unifiedHeight: null })
        },
        /**图片覆盖 */
        addImageryBaseLayer(img, lng, lat) {
            const viewer = window.viewer
            window.viewer.trackedEntity = undefined;
            this.isLockView = false; // 解除锁定问题
            // console.log('图片覆盖', img);
            const centerLatitude = lat; //40.7128; // 纽约市的纬度  [116.439049, 39.89823]
            const centerLongitude = lng; // -74.0060; // 纽约市的经度
            const squareSize = 1000; // 正方形边长，假设单位为米

            const squareCoordinates = calculateSquareCoordinates(centerLatitude, centerLongitude, squareSize);
            console.log('工作地块中心点:', lng, lat);
            console.log('工作地块Northeast:', squareCoordinates.northeast);
            console.log('工作地块Southeast:', squareCoordinates.southeast);
            console.log('工作地块Northwest:', squareCoordinates.northwest);
            console.log('工作地块Southwest:', squareCoordinates.southwest);
            //#region  图片四个点位置
            const topLeft = squareCoordinates.northeast;

            // {
            //     longitude: 116.313969,
            //     latitude: 39.896964,
            // };
            const topRight = squareCoordinates.southeast;
            // {
            //     longitude: 116.329297,
            //     latitude: 39.897618,
            // };
            const bottomRight = squareCoordinates.northwest;
            // {
            //     longitude: 116.329920,
            //     latitude: 39.887897,
            // };
            const bottomLeft = squareCoordinates.southwest;
            // {
            //     longitude: 116.313986,
            //     latitude: 39.887171,
            // };
            const coverRectangle = new Cesium.Rectangle.fromDegrees(
                Math.min(topLeft.longitude, bottomLeft.longitude),
                Math.min(bottomLeft.latitude, bottomRight.latitude),
                Math.max(topRight.longitude, bottomRight.longitude),
                Math.max(topLeft.latitude, topRight.latitude)
            );
            //#endregion
            // Cut a rectangle out of the base layer
            const layers = viewer.imageryLayers;
            console.log('layers', layers);
            // const imageryBaseLayer = layers.get(0);

            // 创建图像基础图层
            const imageryBaseLayer = new Cesium.ImageryLayer(
                new Cesium.ArcGisMapServerImageryProvider({
                    url: 'https://elevation3d.arcgis.com/arcgis/rest/services/World_Imagery/MapServer',
                    rectangle: Cesium.Rectangle.fromDegrees(
                        Math.min(topLeft.longitude, bottomLeft.longitude),
                        Math.min(bottomLeft.latitude, bottomRight.latitude),
                        Math.max(topRight.longitude, bottomRight.longitude),
                        Math.max(topLeft.latitude, topRight.latitude)
                    )
                })
            );
            // 将图像基础图层添加到图层集合中
            layers.add(imageryBaseLayer);

            imageryBaseLayer.cutoutRectangle = coverRectangle; //在 imageryBaseLayer 图层上创建一个裁剪矩形。裁剪矩形可以用来在显示图层的时候裁剪掉一部分区域，只显示裁剪矩形内的部分。
            const logo = new Cesium.ImageryLayer(
                new Cesium.SingleTileImageryProvider({
                    // url: "https://picsum.photos/150/200",
                    url: `data:image/png;base64,${img}`, // 使用 Base64 图像
                    rectangle: coverRectangle
                }), {
                    alpha: 1
                }
            );
            layers.add(logo);

            //#region   设置相机位置
            // 设置默认相机视角
            viewer.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(
                    (topLeft.longitude + bottomRight.longitude) / 2, // 计算中心经度
                    (topLeft.latitude + bottomRight.latitude) / 2, // 计算中心纬度
                    1000 // 相机高度（单位：米）
                ),
                // 方向，俯视和仰视的视角
                orientation: {
                    heading: Cesium.Math.toRadians(0), // 设置偏航角度（单位：弧度）
                    pitch: Cesium.Math.toRadians(-90), // 设置俯仰角度（单位：弧度）
                    roll: Cesium.Math.toRadians(0) // 设置横滚角度（单位：弧度）
                }
            });
            viewer.scene.requestRender();
            // console.log('图片覆盖执行完');
            //#endregion
        },
        // #region --------------------------------------------------------- 组件传递 ---------------------------------------------------------
        setAreaText(areaText) {
            this.areaText = areaText;
        },
        CesiumEditEvent(data) {
            // console.log(data);
        },
        senddoFlyCommandsEvent() {
            this.$emit('senddoFlyCommands');
        },
        /**获取父组件传递过来心跳数据包 */
        async GetHeartbeatNows(uavHeartbeatNow) {
            const viewer = window.viewer;

            var position = Cesium.Cartographic.fromDegrees(
                uavHeartbeatNow.lng,
                uavHeartbeatNow.lat
            );
            // 使用 sampleTerrainMostDetailed 函数进行高度采样 -- 耗时
            var updatedPositions = await Cesium.sampleTerrainMostDetailed(
                this.terrainProvider,
                [position]
            );
            var height = 0
            // debugger
            height = updatedPositions[0].height; // 27.592189191613983 字符串
            //心跳高度+当前获取的高度
            // let newheight = parseFloat(height) + parseFloat(uavHeartbeatNow.alt)
            const newheight = parseFloat(uavHeartbeatNow.alt)
            viewer.clock.shouldAnimate = true;
            this.flymovenew(
                this.defaultUavSn,
                uavHeartbeatNow.lng,
                uavHeartbeatNow.lat,
                newheight,
                uavHeartbeatNow.yaw,
                uavHeartbeatNow.pitch,
                uavHeartbeatNow.roll
            );
        },
        /**心跳异常异常模型 */
        GetHeartbeatNowToremoveModel(uavHeartbeatNow) {
            console.log('心跳异常异常模型');
            const viewer = window.viewer;
            viewer.entities.remove(this.vehicleEntity);
            window.viewer.trackedEntity = undefined;
            this.vehicleEntity = null;
        },
        async GetHeartbeatNow(uavHeartbeatNow) {
            // 心跳数据
            console.log('当前在线无人机经纬度点',
                uavHeartbeatNow.lng,
                uavHeartbeatNow.lat,
                uavHeartbeatNow.altabs
            );
            viewer.clock.shouldAnimate = true;
            this.flymovenew(
                this.defaultUavSn,
                uavHeartbeatNow.lng,
                uavHeartbeatNow.lat,
                uavHeartbeatNow.altabs,
                uavHeartbeatNow.yaw
            );
            //#region
            // console.log("父传子---获取心跳数据");
            // // console.log(uavHeartbeatNow);
            // // 创建一个Cartographic对象表示经纬度坐标
            // // if (!uavHeartbeatNow.lng || uavHeartbeatNow.lat) return false;  //没有获取
            // var position = Cesium.Cartographic.fromDegrees(
            //     uavHeartbeatNow.lng,
            //     uavHeartbeatNow.lat
            // );
            // // 使用 sampleTerrainMostDetailed 函数进行高度采样 -- 耗时
            // var updatedPositions = await Cesium.sampleTerrainMostDetailed(
            //     viewer.terrainProvider,
            //     [position]
            // );
            // // console.log(updatedPositions);
            // // // 获取海拔高度
            // var height = updatedPositions[0].height; // 27.592189191613983
            // // // 在控制台打印高度
            // // console.log("模型的海拔高度：" + height.toFixed(3) + " 米");
            // this.beatData = JSON.parse(JSON.stringify(uavHeartbeatNow));

            // // 存在模型遮挡 判断 飞行模型高度在不在3D模型  25 --当前地形高度
            // if (this.beatData.altabs > height.toFixed(3) - 25) {
            //     // console.log("高度正常");
            //     const currentLocation = {};
            //     if (uavHeartbeatNow.flightModeText.includes("GPS")) {
            //         this.flymovenew(
            //             this.defaultUavSn,
            //             uavHeartbeatNow.lng,
            //             uavHeartbeatNow.lat,
            //             uavHeartbeatNow.altabs,
            //             uavHeartbeatNow.yaw
            //         );
            //         return;
            //     } else if (uavHeartbeatNow.flightModeText.includes("返航")) {
            //         if (this.lastToast !== "返航") {
            //             this.showToast("正在返航!");
            //             this.lastToast = "返航";
            //         }
            //         this.flymovenew(
            //             this.defaultUavSn,
            //             uavHeartbeatNow.lng,
            //             uavHeartbeatNow.lat,
            //             uavHeartbeatNow.altabs,
            //             uavHeartbeatNow.yaw
            //         );
            //         return;
            //     } else if (uavHeartbeatNow.flightModeText.includes("降落")) {
            //         if (this.lastToast !== "降落") {
            //             this.showToast("正在降落!");
            //             this.lastToast = "降落";
            //         }
            //         this.flymovenew(
            //             this.defaultUavSn,
            //             uavHeartbeatNow.lng,
            //             uavHeartbeatNow.lat,
            //             uavHeartbeatNow.altabs,
            //             uavHeartbeatNow.yaw
            //         );
            //         return;
            //     }
            // } else {
            //     // 高度异常---标准海拔
            //     this.beatData.altabs = height.toFixed(3) - 25;
            //     console.log("高度异常");
            //     let viewer = window.viewer;
            //     if (uavHeartbeatNow.flightModeText.includes("起飞")) {
            //         if (this.lastToast !== "起飞") {
            //             setTimeout(() => {
            //                 this.showToast("准备起飞!");
            //                 this.lastToast = "起飞";
            //             }, 2000);
            //         }
            //         // uavHeartbeatNow.lng, uavHeartbeatNow.lat, uavHeartbeatNow.altabs,uavHeartbeatNow.yaw
            //         this.flymovenew(
            //             this.defaultUavSn,
            //             this.beatData.lng,
            //             this.beatData.lat,
            //             this.beatData.altabs,
            //             this.beatData.yaw
            //         );
            //         console.log("高度异常---准备起飞!", this.beatData.altabs);
            //         return;
            //     }
            //     //高度异常 一降落
            //     if (uavHeartbeatNow.flightModeText.includes("降落")) {
            //         viewer.clock.shouldAnimate = false;
            //         this.flymovenew(
            //             this.defaultUavSn,
            //             this.beatData.lng,
            //             this.beatData.lat,
            //             this.beatData.altabs,
            //             this.beatData.yaw
            //         );
            //         viewer.scene.requestRender();
            //         return;
            //     }
            // }

            //#endregion
        },
        /**
           * @name:
           * @msg: 显示模型 只负责接收当前到下一个的经纬度 哪一架飞机
           * @param {*} uavid 当前设置无人机
           * @param {*} lng 经纬度
           * @param {*} lat
           * @param {*} altabs 高度
           * @param {*} yaw 角度 为弧度 已处理
           * @return {*}
           */
        flymovenew(uavid, lng, lat, altabs, yaw, pitch, roll) {
            var viewer = window.viewer
            const nextPosition = Cesium.Cartesian3.fromDegrees(lng, lat, altabs);
            /** 在这个地方是不是换uavid  uvaid 改变重新 添加   */
            if (!this.vehicleEntity || this.currentDisplayUavId != uavid) {
                //      // 通过 uavid 获取对应的实体 移除
                const entityId = 'onlineUav-' + this.currentDisplayUavId
                viewer.entities.removeById(entityId); // 已知实体的id为entityId
                //     var oldVehicleEntity = window.viewer.entities.getById(entityId);

                this.currentDisplayUavId = uavid // 当前显示无人机

                /**模型文件角度存在偏差 弧度 - 1.570796326 度数 93*/
                const heading = yaw - 1.570796326;
                /**设置模型初始朝向 */
                // let headingValue = Cesium.Math.toRadians(heading); // 将角度值转换为弧度
                const orientation = Cesium.Transforms.headingPitchRollQuaternion(
                    nextPosition,
                    new Cesium.HeadingPitchRoll(heading, pitch, roll) //(headingValue, 0, 0) 模型的偏航角（heading）模型的俯仰角（pitch） 表示模型的横滚角（roll）
                );
                /**添加当前无人机模型*/
                this.vehicleEntity = window.viewer.entities.add({
                    id: ('onlineUav-' + uavid).toString(),
                    /**设置方向 */
                    orientation: orientation, // 设置模型初始朝向
                    position: nextPosition,
                    model: {
                        uri: '../../static/model/wrji.glb',
                        scale: 0.55
                    }
                });
            } else {
                // 使用动画平滑移动模型
                //  获取当时这个点的位置 开始位置
                const startPosition = this.vehicleEntity.position.getValue(
                    viewer.clock.currentTime
                );
                /**初始化时获取当前位置的朝向 --前一帧 */
                const startOrientation = this.vehicleEntity.orientation.getValue(
                    viewer.clock.currentTime
                );

                //  后来滴一条
                var endPosition = null;
                if ((lng, lat, altabs)) {
                    endPosition = Cesium.Cartesian3.fromDegrees(lng, lat, altabs);
                } else {
                    endPosition = this.vehicleEntity.position.getValue(
                        viewer.clock.currentTime
                    );
                }
                //11
                /**动画效果 初始计时--默认时长 */
                let factor = 0;
                var duration = 300; // 移动动画的持续时间（秒）
                // 实时更新this.vehicleEntity.position
                this.vehicleEntity.position = new Cesium.CallbackProperty(
                    function() {
                        if (factor > duration) {
                            factor = 0;
                        }
                        factor++;
                        // 动态更新位置
                        return Cesium.Cartesian3.lerp(
                            startPosition,
                            endPosition,
                            factor / duration,
                            new Cesium.Cartesian3()
                        );
                    },
                    false
                );
                /**动态更新朝向 实时更新 this.vehicleEntity.orientation */
                this.vehicleEntity.orientation = new Cesium.CallbackProperty(
                    function() {
                        // 获取当前位置的朝向yaw值
                        const heading = yaw - 1.570796326;
                        // let headingValue = Cesium.Math.toRadians(heading);
                        const orientation =
                              Cesium.Transforms.headingPitchRollQuaternion(
                                  nextPosition,
                                  new Cesium.HeadingPitchRoll(heading, pitch, roll)
                              );
                        return Cesium.Quaternion.slerp(
                            startOrientation,
                            orientation,
                            factor / duration,
                            new Cesium.Quaternion()
                        );
                    },
                    false
                );
            }

            // 地图设置视角的位置
            if (this.isLockView) {
                window.viewer.trackedEntity = this.vehicleEntity;
                this.vehicleEntity.viewFrom = new Cesium.Cartesian3(0, 0, 18);
            }
            viewer.scene.requestRender();
        },

        /**设置是否锁定视口 */
        setViewport() {
            this.isLockView = !this.isLockView;
            const viewer = window.viewer;
            if (!this.isLockView) {
                window.viewer.trackedEntity = undefined;
            }

            /**视口朝向或无人机模型为视口 */
            const isOnline = this.vehicleEntity !== null;
            const hasMapCenter = true;
            if (isOnline && this.isLockView) {
                console.log('当前无人机在线');
                window.viewer.trackedEntity = this.vehicleEntity;
                this.vehicleEntity.viewFrom = new Cesium.Cartesian3(0, 0, 18);
            } else if (hasMapCenter && this.isLockView) {
                console.log('设置中心点');
            } else {

            }
            viewer.scene.requestRender();
        },
        // 解析Kml
        ReadKml() {
            var viewer = window.viewer
            console.log('解析Kml');
            // var promise = viewer.dataSources.add(
            //     // Cesium.KmlDataSource.load("../../static/kml/S03-NB03.kml", {
            //     //     camera: viewer.scene.camera,
            //     //     canvas: viewer.scene.canvas,
            //     // })
            //     Cesium.KmlDataSource.load("../../../assets/gis/1.kml", {
            //         camera: viewer.scene.camera,
            //         canvas: viewer.scene.canvas,
            //     })
            // );

            // 加载kml数据
            const kmlUrl = 'http://127.0.0.1:9090/ceshi/kml/ces.kml';
            const kmlDataPromise = Cesium.KmlDataSource.load(kmlUrl);
            console.log('kmlDataPromise', kmlDataPromise);
            kmlDataPromise.then(function(dataSource) {
                viewer.dataSources.add(dataSource);
                viewer.clock.shouldAnimate = false;
                var rider = dataSource.entities.getById('tour');

                viewer.flyTo(rider).then(function() {
                    viewer.trackedEntity = rider;
                    viewer.selectedEntity = viewer.trackedEntity;
                    viewer.clock.multiplier = 30;
                    viewer.clock.shouldAnimate = true;
                });
                console.log(dataSource, 'dataSource');
            });
            // var options = {
            //     camera: viewer.scene.camera,
            //     canvas: viewer.scene.canvas,
            //     clampToGround: true //开启贴地
            // };
            // viewer.dataSources.add(Cesium.KmlDataSource.load(kmlUrl, options)).then(function (dataSource) {
            //     viewer.clock.shouldAnimate = false;
            //     var rider = dataSource.entities.getById('tour');
            //     viewer.flyTo(rider).then(function () {
            //         viewer.trackedEntity = rider;
            //         viewer.selectedEntity = viewer.trackedEntity;
            //         viewer.clock.multiplier = 30;
            //         viewer.clock.shouldAnimate = true;
            //     });
            // });

            // let kmlDataPromise = Cesium.KmlDataSource.load(kmlUrl, {
            //     camera: viewer.scene.camera,
            //     canvas: viewer.scene.canvas,
            //     screenOverlayContainer: viewer.container,
            // });
            // console.log(kmlDataPromise);

            // kmlDataPromise.then(function (dataSource) {
            //     console.log(dataSource);
            //     viewer.dataSources.add(dataSource);
            // });

            // 加载KML
            // var dataSourcePromise = Cesium.KmlDataSource.load("../../../assets/gis/1.kml");

            // dataSourcePromise.then(function(dataSource) {
            //     viewer.dataSources.add(dataSource);

            //     // 将视图定位到KML数据
            //     viewer.zoomTo(dataSource);
            // }).otherwise(function(error){
            //     // 如果加载失败，则输出错误消息
            //     console.error(error);
            // });
        },
        doPartition() {
            var viewer = window.viewer

            const kmlUrl1 = 'http://127.0.0.1:9090/ceshi/kml/1.kml';
            const kmlUrl2 = 'http://127.0.0.1:9090/ceshi/kml/2.kml';
            const kmlUrl3 = 'http://127.0.0.1:9090/ceshi/kml/3.kml';
            const kmlUrl4 = 'http://127.0.0.1:9090/ceshi/kml/4.kml';
            const kmlUrl5 = 'http://127.0.0.1:9090/ceshi/kml/5.kml';
            const kmlUrl6 = 'http://127.0.0.1:9090/ceshi/kml/6.kml';
            const kmlUrl7 = 'http://127.0.0.1:9090/ceshi/kml/7.kml';
            const kmlUrl8 = 'http://127.0.0.1:9090/ceshi/kml/8.kml';

            // const dataSourcePromise1 = Cesium.KmlDataSource.load(kmlUrl1, {
            //     camera: viewer.scene.camera,
            //     canvas: viewer.scene.canvas,

            // });
            // dataSourcePromise1.then(function (dataSource) {
            //     dataSource.id = 'dataSource1'; // Set a unique ID for the data source
            //     viewer.dataSources.add(dataSource);
            // });

            // viewer.dataSources.add(dataSourcePromise1);
            const dataSourcePromise2 = Cesium.KmlDataSource.load(kmlUrl2);
            viewer.dataSources.add(dataSourcePromise2);

            const dataSourcePromise3 = Cesium.KmlDataSource.load(kmlUrl3);
            viewer.dataSources.add(dataSourcePromise3);

            const dataSourcePromise4 = Cesium.KmlDataSource.load(kmlUrl4);
            viewer.dataSources.add(dataSourcePromise4);

            const dataSourcePromise5 = Cesium.KmlDataSource.load(kmlUrl5);
            viewer.dataSources.add(dataSourcePromise5);

            const dataSourcePromise6 = Cesium.KmlDataSource.load(kmlUrl6);
            viewer.dataSources.add(dataSourcePromise6);

            const dataSourcePromise7 = Cesium.KmlDataSource.load(kmlUrl7);
            viewer.dataSources.add(dataSourcePromise7);

            const dataSourcePromise8 = Cesium.KmlDataSource.load(kmlUrl8);
            viewer.dataSources.add(dataSourcePromise8);
            console.log(viewer.dataSources);

            viewer.zoomTo(dataSourcePromise2);
        },
        showToast(msg) {
            this.$layer.msg(msg);
        },
        showMessage(msg, type) {
            this.$message({
                message: msg,
                type: type
            });
        },

        receivemsg(e) {
            console.log('getpositionsEvet0', e);
        }
    } //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
  <style lang="scss" scoped>
  //@import url(); 引入公共css类
  .cesiumOutdiv {
      // 引用注意外侧
      width: 100% !important;
      height: 100% !important;
      position: relative;
  }

  #cesiumContainer {
      width: 100%;
      height: 100%;
  }
  .SurveyingTools{
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 9;
    margin-right: 5px;
    background-color: rgba(0,138,255, 0.5);
}

  </style>
