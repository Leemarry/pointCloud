<template>
  <el-container>
    <el-main>
      <!-- <div id="mapcontainer" style="height:100%;width:100%"></div> -->
      <div class="viewer">
        <vc-viewer ref="viewer" scene3-d-only :animation="animation" :baseLayerPicker="baseLayerPicker" :logo="false" :camera="camera" @ready="ready" :LEFT_CLICK="mapLeftClick">
          <vc-measure-distance ref="measureDistance" :clamp-to-ground="clampToGround" @activeEvt="activeEvt" @measureEvt="measureEvt" @movingEvt="movingEvt" :remove-last-position="removeLastPosition"></vc-measure-distance>
          <vc-measure-area ref="measureArea" @activeEvt="activeEvt" @measureEvt="measureEvt" @movingEvt="movingEvt" :clamp-to-ground="clampToGround" :remove-last-position="removeLastPosition"></vc-measure-area>
          <vc-measure-height ref="measureHeight" @activeEvt="activeEvt" @measureEvt="measureEvt" @movingEvt="movingEvt"></vc-measure-height>
        </vc-viewer>
      </div>
      <el-button class="md-raised md-accent" @click="toggle('measureDistance')">{{ distanceMeasuring ? '停止' : '距离' }}</el-button>
      <el-button class="md-raised md-accent" @click="toggle('measureArea')">{{ areaMeasuring ? '停止' : '面积' }}</el-button>
      <el-button class="md-raised md-accent" @click="toggle('measureHeight')">{{ heightMeasuring ? '停止' : '高度' }}</el-button>
      <el-button class="md-raised md-accent" @click="clear">清除</el-button>
    </el-main>
  </el-container>
  <!-- <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column label="日期" width="120">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120">
      </el-table-column>
      <el-table-column prop="address" label="地址" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button @click="toggleSelection(tableData)">切换第二、第三行的选中状态</el-button>
      <el-button @click="toggleSelection()">取消选择</el-button>
      <el-button @click="download">下载</el-button>
    </div> -->
</template>
<script>
// import * as Cesium from 'cesium'

export default {
  data() {
    return {
      // viewer: null,
      cesiumInstance: null,
      camera: {
        position: {
          lng: 104.06,
          lat: 30.67,
          height: 2000
        },
        heading: 360,
        pitch: -90,
        roll: 0
      },
      animation: false,
      baseLayerPicker: true,
      distanceMeasuring: false,
      areaMeasuring: false,
      heightMeasuring: false,
      clampToGround: false,
      removeLastPosition: true
    }
  },
  mounted() {
    this.$refs.viewer.createPromise.then(({ Cesium, viewer }) => {
      console.log('viewer is loaded.')
    })
    this.init()
  },
  methods: {
    async init() {
      // this.initCesiumScene()
    },
    showToast(msg) {
      this.$layer.msg(msg)
    },
    showMessage(msg, type) {
      this.$message({ message: msg, type: type })
    },
    ready(cesiumInstance) {
      const { Cesium, viewer } = cesiumInstance
      // 在这儿获取Cesium和viewer实例，再执行相关逻辑代码
      this.camera.position.lng = 114.46
      this.camera.position.lat = 35.92
      this.camera.position.height = 500

      this.cesiumInstance = cesiumInstance
      var scene = viewer.scene
      scene.debugShowFramesPerSecond = true
      this.cesiumInstance = cesiumInstance
      viewer.scene.globe.depthTestAgainstTerrain = true
    },
    initCesiumScene() {
      let viewerOption = {
        shouldAnimate: true,
        animation: false, // 是否创建动画小器件，左下角仪表
        baseLayerPicker: true, // 是否显示图层选择器
        fullscreenButton: true, // 是否显示全屏按钮
        geocoder: false, // 是否显示geocoder小器件，右上角查询按钮
        homeButton: false, // 是否显示Home按钮
        infoBox: false, // 是否显示信息框
        sceneModePicker: true, // 是否显示3D/2D选择器
        selectionIndicator: false, // 是否显示选取指示器组件
        timeline: false, // 是否显示时间轴
        navigationHelpButton: false, // 是否显示右上角的帮助按钮
        scene3DOnly: false, // 如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
        clock: new Cesium.Clock(), // 用于控制当前时间的时钟对象
        selectedImageryProviderViewModel: undefined, // 当前图像图层的显示模型，仅baseLayerPicker设为true有意义
        imageryProviderViewModels: Cesium.createDefaultImageryProviderViewModels(), // 可供BaseLayerPicker选择的图像图层ProviderViewModel数组
        selectedTerrainProviderViewModel: undefined, // 当前地形图层的显示模型，仅baseLayerPicker设为true有意义
        terrainProviderViewModels: Cesium.createDefaultTerrainProviderViewModels(), // 可供BaseLayerPicker选择的地形图层ProviderViewModel数组
        // imageryProvider: new Cesium.UrlTemplateImageryProvider({
        //   url: 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali'
        // }),
        fullscreenElement: document.body, // 全屏时渲染的HTML元素,
        useDefaultRenderLoop: true, // 如果需要控制渲染循环，则设为true
        targetFrameRate: undefined, // 使用默认render loop时的帧率
        showRenderLoopErrors: false, // 如果设为true，将在一个HTML面板中显示错误信息
        automaticallyTrackDataSourceClocks: true, // 自动追踪最近添加的数据源的时钟设置
        contextOptions: undefined, // 传递给Scene对象的上下文参数（scene.options）
        sceneMode: Cesium.SceneMode.SCENE2D, // 初始进入时的场景模式，3D或2D
        mapProjection: new Cesium.WebMercatorProjection(), // 地图投影体系
        dataSources: new Cesium.DataSourceCollection(),  // 需要进行可视化的数据源的集合
      };
      // this.viewer = new Cesium.Viewer('mapcontainer');
      this.viewer = new Cesium.Viewer('mapcontainer', viewerOption);

      // Add Cesium OSM Buildings, a global 3D buildings layer.
      const buildingTileset = this.viewer.scene.primitives.add(Cesium.createOsmBuildings());
      // Fly the camera to San Francisco at the given longitude, latitude, and height.
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(114.4692725, 30.4594530, 400),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-45.0),
        }
      });
      this.viewer._cesiumWidget._creditContainer.style.display = "none";// 隐藏版权

    },
    handleSelectionChange(val) {
      this.multipleSelection.push(val)
      console.log(this.multipleSelection)
    },
    download() {
      const target = this.multipleSelection.splice(-1)
      console.log(target)
    },
    toggle(type) {
      this.$refs[type].measuring = !this.$refs[type].measuring
    },
    clear() {
      this.$refs.measureDistance.clear()
      this.$refs.measureArea.clear()
      this.$refs.measureHeight.clear()
    },
    activeEvt(_) {
      this[_.type] = _.isActive
    },
    measureEvt(result) {
      console.log(result)
    },
    movingEvt(position) {
      console.log(position)
    },
    readyPromise(tileset) {
      const { viewer } = this.cesiumInstance
      viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.0, -0.5, tileset.boundingSphere.radius * 2.0))
    }
  }
}
</script>


<style lang="scss" scoped>
.el-container {
  // background: blue;
  position: absolute;
  padding: 0px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.el-header {
  // background-color: #b3c0d1;
  color: #333;
  // text-align: center;
  // line-height: 20px;
  padding-top: 10px;
}

.el-main {
  // background:red;
  width: 100%;
  height: 100%;
  padding: 0px;
  flex: 1;
}
.viewer {
  width: 100%;
  height: 800px;
}
</style>