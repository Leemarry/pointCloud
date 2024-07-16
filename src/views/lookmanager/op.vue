<!--
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2023-12-28 10:26:19
 * @LastEditors: Andy
 * @LastEditTime: 2023-12-28 10:26:19
-->
<!--  -->
<template>

    <div class="container">
        <div class="item1">
            <div class="flexStyle">
                <div class="selectuav">
                    <span style="margin-left:20px;font-size:14px ; color:rgb(96, 98, 102)">当前无人机：</span>
                <el-select @change="selectChanged" v-model="defaultUavSn" placeholder="请选择">
                    <el-option v-for="(item,index) in uavs" :key="index" :label="item.uavName" :value="item.uavId">
                        <span style="float: left">{{ item.uavName }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.uavId }}</span>
                    </el-option>
                </el-select>
                </div>
                <div class="map">
                    <CesiumMap ref="CesiumMap" :defaultUavSn="defaultUavSn" :visible=CesiumDrawVisible></CesiumMap>
                </div>
             
            </div>
        </div>
        <div class="sping0"></div>
        <div class="item2 result-image-demo">
            <div class="result-titel">
                <div>空斑识别结果</div>
            </div>
            <div class="result-image">
                <el-image style="width: 100%; height: 100% ;overflow: auto; " :src="defaultUavImageData.url" fit="cover" :preview-src-list="[defaultUavImageData.url]">
                </el-image>
            </div>
        </div>
        <div class="item3 uav-image-demo result-image-demo">
            <div class="result-titel">
                <div>无人机实时回传</div>
            </div>
            <div class="result-image">
                <el-image style="width: 100%; height: 100% ;overflow: auto; " :src="defaultUavImageData.url" fit="cover" :preview-src-list="[defaultUavImageData.url]">
                </el-image>
            </div>
        </div>
        <div class="item4 ">
            <div class="table-list-info">
                <el-table :data="defaultUavImageList" stripe style="width: 100%">
                    <!-- <el-table-column prop="uavId" label="当前无人机" width="180">
                    </el-table-column> -->
                    <!-- <el-table-column label="当前无人机" width="100">
                        <template slot-scope="scope">
                            <el-tag effect="dark" size="mini" disable-transitions>{{ scope.row.uavId}}</el-tag>
                        </template>
                    </el-table-column> -->
                    <el-table-column label="时间" width="150">
                        <template slot-scope="scope">
                            <span>{{parseTime(scope.row.time)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="yaw" label="朝向" width="120">
                    </el-table-column>
                    <el-table-column prop="altAbs" label="海拔" width="150">
                    </el-table-column>
                    <el-table-column label="空斑位置（经纬度，高程）">
                        <template slot-scope="scope">
                            (<span>{{  Number(scope.row.lng).toFixed(4) }}</span> ,<span>{{ Number(scope.row.lat).toFixed(4)}}</span>, <span>{{Number(scope.row.alt).toFixed(4)}}</span>)
                        </template>
                    </el-table-column>
                    <el-table-column   width="80">
                                <template slot="header">
                                    <div id="adding" type="Border Base" class="cursorStyle"  @click="clearUavImageList">清空</div>
                                </template>

                                <!-- <template slot-scope="scope">
                                    <el-button size="mini" @click="clickeditPvGroupItem(scope.row, scope.$index)">编辑</el-button>

                                

                                </template> -->
                            </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="sping1"></div>
        <!-- <my-global-footer /> -->
    </div>


</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  name: '',
//import引入的组件需要注入到对象中才能使用
components: {},
data() {
//这里存放数据
return {

};
},
//让组件接收外部传来的数据
 props: {
},
//监听属性 类似于data概念
computed: {},
//监控data中的数据变化
watch: {},
//方法集合
methods: {

},
//生命周期 - 创建完成（可以访问当前this实例）
created() {

},
//生命周期 - 挂载完成（可以访问DOM元素）
mounted() {

},
beforeCreate() {}, //生命周期 - 创建之前
beforeMount() {}, //生命周期 - 挂载之前
beforeUpdate() {}, //生命周期 - 更新之前
updated() {}, //生命周期 - 更新之后
beforeDestroy() {}, //生命周期 - 销毁之前
destroyed() {}, //生命周期 - 销毁完成
activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类

</style>