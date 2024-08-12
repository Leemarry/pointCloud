<!--  -->
<template>

  <div class="cesium-tool-container">
    <div class="CesiumTool">
      <div v-for="item of toolbox" :key="item.type" :title="item.title" class="tool-item" @click="openBox(item.type)">
        <i class="iconfont" :class="item.icon" :title="item.title" style="color: aliceblue;" />
      </div>
    </div>
    <div class="tool-box">
      <div v-if="currentMenu === 'MARKER'" class="box-item" type="MARKER">
        <div @click="createMark">创建</div> <div>清除</div>
      </div>
      <div v-if="currentMenu === 'TILESET'" class="box-item" type="MARKER">
        <div>创建</div> <div>清除</div>
      </div>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等!）
//例如：import 《组件名称》 from '《组件路径》';
import $ from 'jquery';
import { checkViewer, checkComponent } from '../core/utils';
// import { toolbox } from '../core/drowTool';
import GraphicManager, { toolbox } from '../core/GraphicManager';
import MarkerManager from '../core/MarkerManager';
// import GraphicManager from '@/views/core/GraphicManager';
// eslint-disable-next-line no-unused-vars
var graphicManager;
// eslint-disable-next-line no-unused-vars
var markerManager;
export default {
    name: 'CesiumTool',
    //import引入的组件需要注入到对象中才能使用
    components: {},
    //让组件接收外部传来的数据
    props: {
        viewer: {
            type: Object,
            required: true // 标记为必需的
        }
    },
    data() {
        //这里存放数据
        return {
            toolbox,
            selectedModel: undefined,
            extendMarkerModel: [],
            currentMenu: null
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
        window.jq = $;
        if (this.viewer instanceof Cesium.Viewer) {
            this.init(this.viewer);
        } else if (window.viewer instanceof Cesium.Viewer) {
            this.init(window.viewer);
        }
    },
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {},
    //方法集合
    methods: {
        init(viewer) {
            document.querySelectorAll('.cursor-tip-class');

            checkViewer(viewer);
            if (this._viewer) {
                return;
            }
            this._depthTestAgainstTerrain =
                viewer.scene.globe.depthTestAgainstTerrain;
            // this.$refs.markerManager.init(viewer); //传递子组件
            graphicManager = new GraphicManager(viewer);
            this.selectedModel = this.extendMarkerModel.length ? this.extendMarkerModel[0].url : undefined;
            this.cesiumViewer = viewer;
            this._viewer = viewer;
        },
        addEventListener() {
            document.addEventListener('addmarkerEvent', this.addmarkerEvent);
            document.addEventListener('getpositionsEvent', this.getpositionsEvent);
            document.addEventListener('addmarker', this.addmarker);
            document.addEventListener('addEvent', this.addEvent);
            document.addEventListener('stopEdit', this.stopEdit); // 停止编辑
            document.addEventListener('positionsMsg', this.positionsMsg); //多边形绘制结束-
            document.addEventListener('startEdit', this.startEdit); // 开始编辑
            document.addEventListener('destroyEvent', this.destroyEvent);
            document.addEventListener('deleteEvent', this.deleteEvent);
        },
        openBox(type) {
            this.currentMenu = type;
            checkComponent(this);
        },

        createMark() {
            markerManager = new MarkerManager(this.viewer)
            markerManager.pick('marker');
        }

    } //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.cesium-tool-container{
    position: relative;
}
.CesiumTool{
    padding: 5px 20px;
    display: flex;
    flex-direction: row;
    justify-self: center;
}
.tool-item{
    min-width: 18px;
    min-height: 18px;
    padding: 5px;
    cursor: pointer;

}
.tool-box{
//   position: absolute;
//   bottom: 5px;
//   left: 5px;
  background-color: rgba(0,138,255, 0.5);
}
.tool-box[type="MARKER"]{
    width: 200px;
    height: 20px;
}

</style>
