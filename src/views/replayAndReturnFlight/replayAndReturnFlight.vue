<!--
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2023-11-22 14:03:36
 * @LastEditors: Andy
 * @LastEditTime: 2023-11-23 15:51:52
-->
<!-- 补播返航 -->
<template>
    <el-container style="width: 100%;height: 100%;">
        <el-aside class="PointManagerAside-components" style="background-color: rgb(238, 241, 246);height: 100%;width: 350px; margin-left: -1px ">
            <PointManagerleftAside @sendswitchUav='switchUav'></PointManagerleftAside>
        </el-aside>

        <el-container style="width: 100%;height: 100%;">
            <el-main class="cesium-components" style="height:100%;background-color: rgb(245, 250, 250);">
                <!-- 'H--M300' -->
                <div class="navigationBar"><span>正在{{'返航'}}无人机：</span><span class="navUavid">{{(selectedUavItem==null || !selectedUavItem.uavId)?"未选择":selectedUavItem.uavName}}</span></div>
                <CesiumMap></CesiumMap>
            </el-main>
            <el-aside class="PointManagerAside-components" style="background-color: rgb(238, 241, 246);height: 100% ;width: 300px;;margin-right: -1px ">
                <div class="loading" style="height:50%">
                    <waterLevel :loadingInfo="loadingInfo"></waterLevel>
                    <!-- <div class="image"><img style="height:320px;width:240px" src="../../assets/images/mount.png" alt=""></div>
                    <div style="    text-align: center; font-size: 18px;">
                        <div>挂载数量：</div>
                        <div style="color:red;">333/300</div>
                    </div> -->
                </div>
                <div class="replayInfo">
                    <el-row :gutter="10">
                        <el-col :span="12" class="repalyInfoOne" v-for="(item,index) in 233" :key="index"> <span>P{{index}}：</span><span>补播{{index}}粒</span></el-col>
                    </el-row>
                </div>
            </el-aside>
        </el-container>

    </el-container>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import PointManagerleftAside from "../components/flymanager/flymanager.vue";
import CesiumMap from "../components/Cesium/CesiumMap.vue";
import waterLevel from "../components/ECharts/waterLevelECharts.vue";
export default {
    name: "",
    //import引入的组件需要注入到对象中才能使用
    components: { PointManagerleftAside, CesiumMap,waterLevel },
    data() {
        //这里存放数据
        return {
            selectedUavItem:{},
            loadingInfo:{},
            /**补播信息 */
            replayInfo: [{}],
        };
    },
    //让组件接收外部传来的数据
    props: {},
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
        switchUav(selectedUavItem){
            this.selectedUavItem=selectedUavItem
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {},
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {},
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
::v-deep .el-main {
    padding: 10px;
    overflow: hidden;
}
.cesium-components {
    .navigationBar {
        text-align: center;
        height: 80px;
        line-height: 80px;
        font-size: 32px;
        .navUavid {
            font-weight: 700;
            color: rgb(255, 0, 0);
        }
    }
}
.PointManagerAside-components {
    .loading {
        // z-index: 1;
        // background-color: rgb(238, 241, 246);
        // position:sticky;
        // top: 0px;
    }
    .replayInfo {
        max-height: calc(100% - 400px);
        overflow-y: auto;
        padding: 20p;
        overflow-x: hidden;
        margin-top: 20px;
        .repalyInfoOne {
            padding: 8px;
        }
    }
    .replayInfo:hover {
        box-shadow: inset 0px 18px 25px -18px rgba(189, 189, 189, 0.9);
    }
}
</style>