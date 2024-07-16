<template>
  <div class="parentPositioning">
    <!-- 三维isMapMouseOver -->
    <div :class="{ activeTohide: isHide == true }" id="cesiumContainer" @mouseover="isMapMouseOver = true" @mouseleave="isMapMouseOver = false">
      <div v-if="this.createARouteOrNot === true" class="liststable" :style="{ height: this.divHeight - 36 + 'px' }">
      </div>
      <!-- 视频切口 -->
      <div @mouseover="isMapMouseOver = true" @mouseleave="isMapMouseOver = false" v-show="isMapMouseOver">
        <el-tooltip class="subLocalization" effect="dark" content="切回视频" placement="bottom">
          <i class="el-icon-video-camera clickstyle" @click="SelectHide()"></i>
        </el-tooltip>
      </div>
    </div>
    <!-- 显示视频串口 -->
    <div :class="{ activeTohide: isHide == false }" class="player">
      <div class="videoCtrl" :id="'videoView' + streamNo"></div>
      <div :class="checkedEditor ? 'videoTitleChecked' : 'videoTitle'">{{ uavNameEditor }}</div>
      <div class="videoDiv" v-loading="loading" @mouseover="isVideoMouseOver = true" @mouseleave="isVideoMouseOver = false">
      </div>
      <div class="tools" @mouseover="isVideoMouseOver = true" @mouseleave="isVideoMouseOver = false" v-show="isVideoMouseOver">
        <el-button-group>
          <el-tooltip class="item" effect="dark" content="刷新视频源" placement="bottom">
            <el-button class="button" size="mini" icon="el-icon-refresh" circle @click="play()" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="停止播放" placement="bottom">
            <el-button class="button" size="mini" icon="el-icon-video-pause" circle @click="stop()" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="切换无人机" placement="bottom">
            <el-button class="button" size="mini" icon="el-icon-sort" circle @click="switchVideoNo()" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="切回地图" placement="bottom">
            <el-button class="button" size="mini" icon="el-icon-location-information" circle @click="SelectHideVideoToMap()" />
          </el-tooltip>
        </el-button-group>
      </div>
    </div>
    <!-- 弹窗 -->
    <el-dialog title="安全起飞高度：" width="284px" :visible.sync="isdialogFormVisible">
      <div class="dialog">
        <el-form :model="takeoffAltform">
          <el-input v-model="takeoffAltform.takeoffAlt" autocomplete="off"></el-input>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="isdialogFormVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="takeoffAltsummit()">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
  
<script>
import map from "@/utils/3Dmap"
var vehicleEntity = null;

var counter = 1
var lineEntity = null
// Ceseium
export default {
  name: "pvmap",
  data() {
    return {
      arraymap: [],
      isActive: false,
      isSaveUavRoute: false,
      UavRouteform: {
        name: ''
      },
      // xz
      resultType: 0,
      takeoffAltform: {
        takeoffAlt: ''
      },
      homeAltform: {
        homeAlt: ''
      },
      isSaveKmzRoute: false,
      KmzRouteform: {
        name: ''
      },
      isopenhomeAlt: false,
      formLabelWidth: '60px',
      isdialogFormVisible: false,
      // 保存
      altType: 1,
      takeoffAlt: 1,
      homeAlt: 0,
      // 点坐标list
      createARouteOrNot: false,
      pointCoordinatesList: [],
      pointCoordinates: '',
      uavsData: this.uavs,
      // 视频
      loading: false,
      isVideoMouseOver: false,
      urlEditor: this.url,
      tencentPlayer: null,
      streamTypeEditor: this.streamType,
      uavSnEditor: this.uavSn,
      uavNameEditor: this.uavName,
      checkedEditor: this.checked,
      //地图
      isMapMouseOver: false,
      isHide: false,
      iscolor: false,
      iscolors: false,
      // url:"../../static/terra_b3dms/tileset.json",
      // map:map,
      $handler: null,
      disableButton: false,
      lins: [],
      initialPosition: "",
      targetPosition: "",
    };
  },
  props: {
    divHeight: Number,
    isCreateARoute: Boolean,
    selectSn: String,
    // 3d模型路径
    mapUrl: String, 
    uavs: Array,
    // 视频
    type: {
      type: Boolean,
      default: true
    },
    checked: {
      type: Boolean,
      default: false
    },
    streamNo: {
      type: String,
      default: "1"
    },
    streamType: {
      type: String,
      default: 'webrtc'
    },
    uavSn: {
      type: String,
      default: ''
    },
    uavName: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: '-'
    },
  },
  watch: {
    'mapUrl'(newVal, oldVal) {
      this.initMap();
    },
    'createARouteOrNot'(newVal, oldVal) {
      this.createARouteOrNot = newVal
    }
  },

  mounted() {
    this.createARouteOrNot = false
    this.$emit('send', !this.createARouteOrNot);
    this.isActive = false
    // 初始渲染速度大于监听数据速度导致---拿不到
    setTimeout(() => { this.isActive = true }, 350)
    setTimeout(() => { this.initMap(); }, 315);
    setTimeout(() => { this.setMapCenter(30.456, 114.567); }, 3000);
  },

  methods: {
    showToast(msg) {
      this.$layer.msg(msg)
    },
    tosplit(height) {
      return height.toFixed(2)
    },
    showMessage(msg, type) {
      this.$message({
        message: msg,
        type: type
      })
    },

    setMapCenter(latitude, longitude) {
      window.viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          longitude,
          latitude,
          200,
          // Cesium.Ellipsoid.WGS84.cartesianToCartographic(window.viewer.camera.position).height
        )
      });

    },
    new3DTileset() {
      // 移除旧的3DTileset模型
      window.viewer.scene.primitives.remove();
      // 设置新的模型路径
      //  this.url=this.mapUrl
      //  this.url = map[this.mapUrl] || "../../static/pvmodel/b3dm/HBSJZZH00001/tileset.json";
      // 创建新的3DTileset对象
      var palaceTileset = new Cesium.Cesium3DTileset({
        url: this.mapUrl,
      });
      // 添加新的3DTileset模型
      palaceTileset.readyPromise.then((palaceTileset) => {
        viewer.scene.primitives.add(palaceTileset);
        var heightOffset = -10.0; //高度 高度你调这个就可以了(贴地)
        var boundingSphere = palaceTileset.boundingSphere;
        var cartographic = Cesium.Cartographic.fromCartesian(
          boundingSphere.center
        );
        var surface = Cesium.Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude,
          0.0
        );
        var offset = Cesium.Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude,
          heightOffset
        );
        var translation = Cesium.Cartesian3.subtract(
          offset,
          surface,
          new Cesium.Cartesian3()
        );
        palaceTileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
        window.viewer.zoomTo(
          palaceTileset,
          new Cesium.HeadingPitchRange(
            0.6,
            -0.2,
            palaceTileset.boundingSphere.radius * 0.6
          )
        );
      });

    },
    add0(m) {
      return m < 10 ? '0' + m : m
    },
    // 时间
    time(shijianchuo) {
      //shijianchuo是整数，否则要parseInt转换
      var time = new Date(shijianchuo);
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return y + '年' + this.add0(m) + '月' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s);
    },
    timeTask(shijianchuo) {
      //shijianchuo是整数，否则要parseInt转换number % 1000000;
      var time = new Date(shijianchuo);
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      return y + '年' + this.add0(m) + '月' + this.add0(d) + '日' + (shijianchuo % 1000000);
    },
    openSaveUavRoute() {
      let name = Date.now()
      this.UavRouteform.name = '无人机航线' + this.timeTask(name)
      this.isSaveUavRoute = true
    },
    openSaveRoute() {
      let name = Date.now()
      this.KmzRouteform.name = '航线任务' + this.timeTask(name)
      this.isSaveKmzRoute = true
    },
    opentakeoffAlt() {
      this.takeoffAltform.takeoffAlt = this.takeoffAlt;
      this.isdialogFormVisible = true
    },
    openhomeAlt() {
      this.homeAltform.homeAlt = this.homeAlt;
      this.isopenhomeAlt = true
    },
    takeoffAltsummit() {
      this.takeoffAlt = this.takeoffAltform.takeoffAlt
      this.isdialogFormVisible = false
      this.takeoffAltform.takeoffAlt = ''
    },
    homeAltsummit() {
      this.homeAlt = this.homeAltform.homeAlt
      this.isopenhomeAlt = false
      this.homeAltform.homeAlt = ''
    },
    initMap() {
      if (window.viewer) { window.viewer.destroy(); }
      Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjNzRiNzNkYS0zZTRmLTRhOTMtODFlNS0zOWFhN2FmYzZmYjkiLCJpZCI6MTUyMTEwLCJpYXQiOjE2ODg2OTYyMDl9.sWkoSUmLFPfbMTMFgAZeQKjBQERg-TZPBBtIN34sDNQ";
      window.viewer = new Cesium.Viewer("cesiumContainer", {
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
        //加载天地图影像地图，WebMapTileServiceImageryProvider该接口是加载WMTS服务的接口
        imageryProvider: new Cesium.ArcGisMapServerImageryProvider({ url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer", }),
        // 天地图地形
        terrainProvider: new Cesium.CesiumTerrainProvider({ url: "http://data.mars3d.cn/terrain", }),
      });
      window.viewer.cesiumWidget.creditContainer.style.display = "none";    // 去除logo
      window.viewer.scene.globe.depthTestAgainstTerrain = false;      //解决地形遮挡entity问题
      // 加载 3D
      var palaceTileset = new Cesium.Cesium3DTileset({
        //加载倾斜示范数据
        url: this.mapUrl,
        maximumMemoryUsage: 1024 * 1024 * 1024, // 设置3D Tiles的最大内存使用量
        maximumScreenSpaceError: 1, // 数值加大，能让最终成像变模糊,加载快;初始化的清晰度
        skipScreenSpaceErrorFactor: 16,
        dynamicScreenSpaceErrorDensity: 0.8, // 数值加大，能让周边加载变快
        dynamicScreenSpaceError: true, // 根据测试，有了这个后，会在真正的全屏加载完之后才清晰化房屋
      });

      palaceTileset.readyPromise.then((palaceTileset) => {
        viewer.scene.primitives.add(palaceTileset);
        var heightOffset = -10.0; //高度 高度你调这个就可以了
        var boundingSphere = palaceTileset.boundingSphere;
        var cartographic = Cesium.Cartographic.fromCartesian(
          boundingSphere.center
        );
        var surface = Cesium.Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude,
          0.0
        );
        var offset = Cesium.Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude,
          heightOffset
        );
        var translation = Cesium.Cartesian3.subtract(
          offset,
          surface,
          new Cesium.Cartesian3()
        );
        palaceTileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
        window.viewer.zoomTo(
          palaceTileset,
          new Cesium.HeadingPitchRange(
            0.6,
            -0.4,
            palaceTileset.boundingSphere.radius * 0.55
          )
        );
      });

    },
    // 注册地图点击事件
    getClickPointAdd() {
      // 注册屏幕点击事件
      var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      //注册鼠标事件,event参数是点击的地方是在哪里
      handler.setInputAction((event) => {
        //定义一个屏幕点击的事件，pickPosition封装的是获取点击的位置的坐标
        var position = viewer.scene.pickPosition(event.position);
        //输出之后我们发现坐标信息都是大数目，因为cesium定义的球体坐标都是笛卡尔坐标，所以我们需要转换笛卡尔坐标
        console.log("笛卡尔：" + position);
        //将笛卡尔坐标转化为弧度坐标
        var cartographic = Cesium.Cartographic.fromCartesian(position);
        console.log("弧度：" + cartographic);
        //将弧度坐标转换为经纬度坐标（先转弧度再转经纬度简单一点，直接转换的方法也有，不过推荐用这种）
        var longitude = Cesium.Math.toDegrees(cartographic.longitude); //经度
        var latitude = Cesium.Math.toDegrees(cartographic.latitude); //纬度
        var height = cartographic.height; //高度
        console.log("经纬度：" + longitude, latitude, height);
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
          name: "111", //点击描上的显示信息
          point: {
            color: Cesium.Color.YELLOW,
            pixelSize: 10,
            // heightReference: 相对于地面的位置
          },
        });
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    // 解析Kml
    ReadKml() {
      var promise = viewer.dataSources.add(
        Cesium.KmlDataSource.load("../../static/kml/S03-NB03.kml", {
          camera: viewer.scene.camera,
          canvas: viewer.scene.canvas,
        })
      );
    },
    //   移除模型
    removeModel() {
      let viewer = window.viewer;
      viewer.entities.removeAll();
    },
    // 停止模型漫游
    stopmove() {
      window.viewer.trackedEntity = null;
      window.viewer.clock.shouldAnimate = false;
      console.log("停止模型漫游");
    },

    // 移除事件
    removeClickHandler() {
      this.$handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    // 显示 // if(this.lins.length>3){this.lineshow}
    lineshow(lins) {
      console.log('航线');
      var line = new Cesium.Entity({
        id: "line",
        name: "航线",
        polyline: {
          // fromDegrees返回给定的经度和纬度值数组（以度为单位），该数组由Cartesian3位置组成。
          // Cesium.Cartesian3.fromDegreesArray([经度1, 纬度1, 经度2, 纬度2,])
          // Cesium.Cartesian3.fromDegreesArrayHeights([经度1, 纬度1, 高度1, 经度2, 纬度2, 高度2])
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(lins),
          // 宽度
          width: 2,
          // 线的颜色
          material: Cesium.Color.WHITE,
          // 线的顺序,仅当`clampToGround`为true并且支持地形上的折线时才有效。
          zIndex: 10,
          // 显示在距相机的距离处的属性，多少区间内是可以显示的
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1500),
          // 是否显示
          show: true
        }
      })
      window.viewer.entities.add(line)

    },
    test() {
    },
    // 清除生成航线
    clear() {
      let viewer = window.viewer;
      this.arraymap = [];
      this.pointCoordinatesList = []
      this.createARouteOrNot = false
      this.$emit('send', !this.createARouteOrNot);
      console.log('清除生成航线');
      this.disableButton = false;
      window.viewer.entities.removeAll();
      if (this.$handler) {
        this.$handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      }
      viewer.scene.requestRender();
      counter = 1
    },
    /* 清除实体 */
    clearAllDrawn() {
      //     let viewer = window.viewer;
      //  var tempEntities= viewer.entities.getById("point1")
      //     viewer.entities.removeAll(tempEntities);
      //     tempEntities=null
      this.arraymap = [];
      this.pointCoordinatesList = []
      let viewer = window.viewer;
      this.tempEntities = [];
      viewer.entities.removeAll();
      viewer.scene.requestRender();
    },
    // 切换
    SelectHide() {
      this.createARouteOrNot = false
      this.$emit('send', !this.createARouteOrNot);
      setTimeout(() => {
        this.isHide = !this.isHide
      }, 200);
    },
    // 隐藏视频退回Map
    SelectHideVideoToMap() {
      if (this.disableButton || this.pointCoordinatesList.length > 0) {
        this.createARouteOrNot = true
        this.$emit('send', !this.createARouteOrNot);
        setTimeout(() => {
          this.isHide = !this.isHide
        }, 200);
      } else {
        // 担心bug 地图注册点击没有清除
        if (this.$handler) {
          this.$handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }
        this.createARouteOrNot = false
        this.$emit('send', !this.createARouteOrNot);
        setTimeout(() => {
          this.isHide = !this.isHide
        }, 200);
      }
    },
    SelectHideMapToVideo() {
      // disableButton
      // createARouteOrNot

    },
    // Cesium 异步时间帧(优化渲染)--改手动请求
    renderedRoute(tempEntities, tempEntitiesList, tempPointEntities, oldindex) {
      // debugger
      let viewer = window.viewer;
      if (tempEntities !== null) {
        if (tempPointEntities !== null) {
          viewer.entities.remove(tempPointEntities);
          // 重新排顺序
          // 只更新剩余航点的名称
          for (var i = oldindex; i < this.pointCoordinatesList.length; i++) {
            var UptempEntities = viewer.entities.getById(this.pointCoordinatesList[i].id)
            UptempEntities.label.text = '航点' + (i + 1);
          }
        }
        tempEntities.polyline.positions = tempEntitiesList; // 假设tempEntitiesList是已经正确更新的位置数组
        //  tempPointEntities=null
        viewer.scene.requestRender();
      }
    },
    switchStyle(altType, takeoffAlt, homeAlt, ok) {
      this.altType = altType
      this.takeoffAlt = takeoffAlt
      this.homeAlt = homeAlt
      this.iscolor = ok
    },
    switchStyles(altType, takeoffAlt, homeAlt, ok) {
      this.altType = altType
      this.takeoffAlt = takeoffAlt
      this.homeAlt = homeAlt
      this.iscolors = ok
      console.log('ddd');
    },
    // loading层
    doLoading(ok) {
      this.$parent.$parent.doLoading(ok);
    },
    // rgba
    rgba(ok, rgba) {
      this.$parent.$parent.rgba(ok, rgba);
    },

    exitRoute() {
      this.clear()
    },
    // 点击获取坐标 
    async queryBoardGroupByPos(lat, lng) {
      try {
        this.rgba(true, 0)
        let formdata = new FormData();
        formdata.append("sn", this.selectSn);
        formdata.append("lat", lat);
        formdata.append("lng", lng);

        const response = await this.$store.dispatch("pv/queryBoardGroupByPos", formdata);
        const { code, message, data } = response;
        this.rgba(false, 0.35)
        if (code === 1) {
          this.pointCoordinates = data;
        } else {
          this.showMessage(message, 'warning');
        }

        return data; // 返回data给上一个方法
      } catch (error) {
        this.rgba(false, 0.35)
        this.showMessage(error, "error");
        throw error; // 抛出错误，可在上一个方法中捕获
      }
    },

    // ------------------------------------视频-------------------------------------
    showToast(msg) {
      this.$layer.msg(msg)
    },
    setChecked(temp) {
      this.checkedEditor = temp;
    },
    changeUav(sn, name, url, type) {
      this.streamTypeEditor = type;
      this.urlEditor = url;
      this.uavSnEditor = sn;
      this.uavNameEditor = name;
      // this.play();
    },
    async doCommand(command, p1, p2, p3, p4, timeout) {
    },
    switchVideoNo() {
    },
    // 刷新视频源
    play() {
      this.loading = true;
      try {
        let url = this.urlEditor;
        console.log("播放地址：" + url)
        this.stop();
        if (url !== null && url.length > 5) {
          if (this.streamTypeEditor === 'webrtc') {
            this.tencentPlayer = new this.TcPlayer('videoView' + this.streamNo, {
              // /** * 视频类型播放优先级 * mobile ：m3u8>mp4 * PC ：RTMP>flv>m3u8>mp4 */
              "webrtc": "webrtc://" + url,
              // "rtmp":"rtmp://" + url, // 播放 RTMP 格式的视频必须启用 Flash，目前浏览器默认禁用 Flash，需用户手动开启。
              "flv": "http://" + url + ".flv",
              // "m3u8": "http://" + url + ".m3u8", //hls/m3u8:  延迟比较大，一般是20s - 30s左右的延迟
              // "live": "true",
              "volume": "0", // 设置初始音量，范围：0 到 1 [v2.2.0+]。
              "autoplay": "true", // iOS 下 safari 浏览器是不开放这个能力的
              "controls": "false", // 是否显示播放器的控制栏 none
              "webrtcConfig": { streamType: 'video' }, // 仅拉取视频流，auto：拉取视频流和音频流
              // "poster" : {"style":"cover", "src":"http://www.test.com/myimage.jpg"}, // 视频封面,cover/stretch/default
              // "width": '480',//视频的显示宽度，请尽量使用视频分辨率宽度
              // "height": '320',//视频的显示高度，请尽量使用视频分辨率高度
              "wording": {
                2003: "连接视频超时",
                2032: "请求视频失败，请检查网络",
                2048: '请求m3u8文件失败，可能是网络错误或者跨域问题'
              }
            })
            this.tencentPlayer.play()
          } else {
            this.showToast('暂不支持其它格式视频播放！');
          }
        }
      }
      catch (e) { }
      this.loading = false;
    },
    stop() {
      try {
        if (this.tencentPlayer != null) {
          if (this.streamTypeEditor !== 'webrtc') {
            this.tencentPlayer.pause()
            this.tencentPlayer.unload()
            this.tencentPlayer.detachMediaElement()
          } else {
            this.tencentPlayer.pause()
          }
          this.tencentPlayer.destroy()
          this.tencentPlayer = null
        }
      } catch (error) { }
    }
  },
};
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style  scoped>
::v-deep #cesiumContainer {
  height: 99%;
  width: 99%;
  overflow: hidden;
}

.parentPositioning {
  position: relative;
}

/* 航线 */
.liststable {
  z-index: 999;
  position: absolute;
  /* top: 10px; */
  /* left: 10px; */
  right: -299px;
  background: #151515;
  width: 287px;
}

::v-deep .liststable .dv-border-box-7 {
}

.fontweight {
  font-weight: bold;
}
.summitpading {
  padding: 7px 0;
  border: 1px solid #2a2a2a;
  text-align: center;
}
.summitpadingfirst {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}
.summitpadinglast {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
.summitpading:hover,
.summitpading:active {
  color: #3de7c9;
  /* #73859f */
  /* color: #409eff; */
  border-color: #c6e2ff;
  background-color: rgb(36, 36, 36);
}

.clickstyle {
  cursor: pointer;
}

.titleHeader {
  font-size: 16px;
  padding-bottom: 5px;
  display: flex;
  /* justify-content: space-around; */
}

.titleHeadertop {
  font-size: 12px;
  font-weight: bold;
  margin-top: 10px;
  padding-left: 20px;
  padding-right: 20px;
  border-bottom: 1px solid #ebeef5;
}

/* 航线内容 */
.textContent {
  display: flex;
  flex-direction: column;
  /* height: 150px; */
  height: 98%;
  /* width: 350px; */
}

.card {
  margin-bottom: 10px;
  border: 1px solid #2a2a2a;
}

::v-deep .textContent .el-collapse {
  border-bottom: none;
}

::v-deep .el-dialog .el-dialog__body {
  padding: 0px 20px 15px 20px !important;
  padding-top: 0px;
}

::v-deep .dialog .dialog-footer {
  margin-top: 15px;
  text-align: right;
}
::v-deep .dialog .el-form .el-input .el-input__inner {
  color: #73859f;
}

/* .el-collapse */
/* 头 */
::v-deep .textContent .el-collapse-item__header {
  background: rgba(0, 0, 0, 0);
  font-size: 12px;
  height: 40px;
  flex-direction: row-reverse;
  color: rgb(187, 187, 187);
}

::v-deep .textContent .el-collapse-item__content {
  color: rgb(187, 187, 187);
}

/* 展开内容 */
::v-deep .el-collapse-items .el-collapse-item__wrap {
  background: rgba(0, 0, 0, 0) !important;
  background-color: rgba(0, 0, 0, 0) !important;
  color: rgb(187, 187, 187);
}

.subLocalization {
  z-index: 999;
  position: absolute;
  top: 10px;
  right: 10px;
}

.activeTohide {
  display: none;
}

.activeTocolor {
  background: #3de7c9;
  color: #151515;
}

.activeTocolors {
  color: #151515;
  background: #3de7c9;
}

.margin-bottom {
  margin-bottom: 5px;
}

.booder2 {
  /* border-radius: 上左角半径 上右角半径 下右角半径 下左角半径; */
  /* border-radius: 10px 0 0 10px; */
  border-radius: 0, 5px, 5px, 0;
}

.booder1 {
  /* border-radius: 上左角半径 上右角半径 下右角半径 下左角半径; */
  /* border-radius: 10px 0 0 10px; */
  border-radius: 5px, 0, 0, 5px;
}

.paddingstyle {
  padding: 7px 15px;
  line-height: 12px;
  text-align: center;
}

/* 视频 */
.player {
  width: 100%;
  height: 100%;
  background-color: #242424;
  border: 2px solid rgb(0, 0, 0);
  padding: 5px;
  text-align: center;
  position: relative;
}

.item {
  border: 1px solid rgb(73, 72, 72);
  background-color: #242424;
}

.button {
  background-color: #242424;
}

.videoCtrl {
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  background: rgb(0, 0, 0);
}

/* 文字标题 */
.videoTitleChecked {
  position: absolute;
  top: 10px;
  width: 100%;
  margin: 0 auto;
  font-weight: bold;
  color: #3de7c9;
}

.videoTitle {
  position: absolute;
  top: 10px;
  width: 100%;
  margin: 0 auto;
  color: rgb(212, 212, 212);
}

.videoDiv {
  position: absolute;
  background: transparent;
  top: 0px;
  left: 10px;
  right: 10px;
  bottom: 10px;
}

.mapDiv {
  position: absolute;
  background: transparent;
  top: 0px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  z-index: 1;
}

.tools {
  top: 15px;
  position: absolute;
  right: 10px;
}

.errorCls {
  display: none;
}
.coler {
  z-index: 999;
  width: 30px;
  height: 125px;
  position: absolute;
  bottom: 5px;
  right: 2px;
  font-size: 15px;
  display: flex;
  flex-direction: column;
}

.margin-b {
  margin-bottom: 2px;
}

::v-deep .margin-b .el-button {
  background: rgb(255 255 255 / 50%);
  border: 1px solid rgb(21 21 21 / 65%);
}

::v-deep .margin-b .el-button:focus,
.margin-b .el-button:hover {
  background-color: rgb(172 176 181 / 30%);
  border: 1px solid rgb(21 21 21 / 65%);
  color: #3de7c9;
}

.divider {
  flex: 1;
  height: 1px;
  border-top: 1px dashed #000;
  content: "";
}

.container {
  width: 69px; /* 设置容器宽度 */
  overflow: hidden; /* 隐藏溢出的内容 */
  direction: rtl; /* 设置内容从右向左方向排列 */
}

.content {
  white-space: nowrap; /* 禁止内容换行 */
}
</style>
  
