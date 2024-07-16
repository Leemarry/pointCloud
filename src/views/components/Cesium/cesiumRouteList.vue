<!--
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2023-12-01 16:44:32
 * @LastEditors: likai 2806699104@qq.com
 * @LastEditTime: 2024-07-12 15:51:28
-->
<!-- 航线列表 -->
<template>
    <div class='routelist-manager-box'>
        <div class="route-manager-header" id="route-manager-header">
            <i class="cesiumDrawFont iconclose1"></i>
            <span style="margin-right: 5px;">{{ !isItATask ? '航线列表' : '航线任务' }}</span>
            <el-date-picker class="picker date-picker" :clearable="showCloseIcon" v-show="isItATask" @change="ChoiseTimeEvent()" align="center" popper-class="elDatePicker" :unlink-panels="false"
                value-format="yyyy-MM-dd HH:mm:ss" v-model="choiseTime" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
            <span class="closebtn cesiumDrawFont iconclose">
                <i class="iconfont  icon-lishijilu" :title="isItATask ? '=》航线任务' : '航线清单'" @click="switchRoutes()"></i>
            </span>
        </div>
        <!-- 显示 routes 的内容 -->
        <div v-show="shouldShowRoutes">
            <div class="sliderContainer">
                <el-tooltip effect="dark" content="统一速度" placement="top-start">
                    <span>{{ `速度: ${slidervalue}` }}</span>
                </el-tooltip>

                <el-slider v-model="slidervalue" :step="1" :min="4" :max="15" show-stops>
                </el-slider>
            </div>
            <div class="">
                <el-row>
                    <el-col :span="4">
                        <div class="动作前">动作前</div>
                    </el-col>
                    <el-col :span="8">
                        <el-input placeholder="请输入" v-model="startTime"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <div class="g">动作后</div>
                    </el-col>
                    <el-col :span="8">
                        <el-input placeholder="请输入" v-model="endTime"></el-input>
                    </el-col>
                </el-row>
            </div>

            <el-card class="box-card" v-for="(route, key) in routes" :key="key">
                <template #header>
                    <div class="card-header">
                        <el-row :gutter="5" style="width:100%">
                            <el-col :span="18">
                                <el-input v-model="newName" class="inputText" v-if="route.edit" @keyup.enter.native="renameAction(route)"></el-input>
                                <span @click="openEdit(route)" :title="route.mid" v-else>{{ route.text ? route.text : route.mid }}</span>
                            </el-col>
                            <el-col :span="6">
                                <i class="iconfont  icon-tijiao cursorStyle" :class="{ disabled: maploading }" :title="'上传无人机'" @click=" maploading ? null : sendUploadToUav(route, 'drow')"></i>
                                <!-- maploading ? null : -->
                                <i class="iconfont  icon-baocun cursorStyle" :class="{ disabled: maploading }" :title="'保存航线'" @click="maploading ? null : sendsave(route)"></i>
                            </el-col>
                        </el-row>
                    </div>
                </template>
                <virtual-list class="list" style="height: 200px; overflow-y: auto;" :data-key="'id'" :data-sources="getObjData(route.positions)" :data-component="PositionsItem" :estimate-size="50"
                    :extra-props="{
                        itemClick: itemClick,
                        current: current
                    }" />
            </el-card>
        </div>
        <!-- 显示 tasksRoutes 的内容 -->
        <div v-show="shouldShowTasks">
            <el-card class="box-card" v-for="(route, key) in tasksRoutes" :key="key">
                <template #header>
                    <div class="card-header">
                        <el-row :gutter="5" style="width:100%">
                            <el-col :span="13" v-if="route.edit">
                                <el-input v-model="routeName" class="inputText" @keyup.enter.native="renameActionSql(route)"></el-input>
                            </el-col>
                            <el-col :span="5" v-if="route.edit">
                                <i class="iconfont icon-a-zhengquerenkequeren cursorStyle" @click="renameActionSql(route)"></i>
                            </el-col>
                            <el-col :span="18" v-else>
                                <span @dblclick="openEditSqlRoute(route)" :title="route.mid">{{ route.kmzName }}</span>
                            </el-col>
                            <el-col :span="6">
                                <div class="rightfloat">
                                    <i class="iconfont  icon-tijiao cursorStyle" :class="{ disabled: maploading }" :title="'上传无人机2'" @click="maploading ? null : sendUploadToUav(route, 'tasks')"></i>
                                    <i class="iconfont  icon-hangxianxinxi cursorStyle" :class="{ disabled: maploading }" :title="'解析航线'" @click="maploading ? null : readerkml(route, 'read')"></i>
                                    <!-- <el-popconfirm title="确定删除吗？">
                                        <i  slot="reference" class="iconfont icon-shanchu- cursorStyle" :title="'删除任务'" @click="maploading ? null : editRouteTask(route,'delet')"></i>
                                    </el-popconfirm> -->

                                    <i slot="reference" class="iconfont icon-shanchu- cursorStyle" :title="'删除任务'" @click="maploading ? null : editRouteTask(route, 'delet')"></i>

                                </div>

                            </el-col>
                        </el-row>
                    </div>
                </template>
                <div class="container">
                    <div class="item"> <span>编辑时间：</span><span> {{ time(route.kmzUpdateTime) }}</span></div>
                    <div class="item"><span>文件类型：</span><span> {{ (route.kmzType) }}</span></div>
                    <div class="item"><span>大小：</span><span> {{ filtersType(route.kmzSize) }}</span></div>
                    <div class="item"><span>编辑人：</span><span> {{ (route.kmzUpdateUser) }}</span></div>
                    <div class="item"><span>预计路程：</span><span> {{ formattedNum(route.kmzDistance) }}米</span></div>
                    <div class="item"><span>预计时间：</span><span> {{ formatTime(route.kmzDuration) }}</span></div>
                </div>
            </el-card>
        </div>
        <div v-show="shouldShowLoad" class="loadingStyle">
            <div class="loading"></div>
            <div style="height:10px"></div>
            <div class="loading-text">加载中..</div>
        </div>
        <el-empty v-show="shouldShowEmpty" :image-size="200"></el-empty>

    </div>
</template>

<script>
import { getData } from './data'
import Item from './Item.vue'
import positionsItem from '@/views/components/Cesium/positionsItem.vue'
import VirtualList from 'vue-virtual-scroll-list'
import { parseTime, filtersType } from "@/utils/index";
import currencyMinins from '@/utils/currencyMinins'
export default {
    name: "",
    mixins: [currencyMinins], //
    //import引入的组件需要注入到对象中才能使用
    components: { VirtualList },
    data() {
        //这里存放数据
        return {
            startTime: 1,
            endTime: 3,
            slidervalue: 5,
            showCloseIcon: false,
            choiseTime: [],
            isItATask: false,
            switch: false,
            newName: '',
            routeName: '重命名1',
            routelistmap: {},
            items: getData(1000),
            item: Item,
            PositionsItem: positionsItem,
            itemComponent: Item,//虚拟滚动组件循环对象
            current: '',
            // routes: [], // 添加一个新的属性来存储航线数据
        };
    },
    //让组件接收外部传来的数据
    props: {
        tasksLoading: {
            type: Boolean,
            default: false,
        },
        maploading: {
            type: Boolean,
            default: false,
        },
        tasksName: {
            type: String,
            default: "",
        },
        tasksRoutes: {
            default: function () {
                return [];
            },
            type: Array,
        },
        routes: {
            default: function () {
                return [];
            },
            type: Array,
        },
    },
    //监听属性 类似于data概念
    computed: {
        // routesWithNames:{

        //     get() {
        //         return this.routes.map(route => {
        //         // 在每个对象中添加 name 属性
        //         const positions = route.positions;
        //         return { ...route, name: route.mid ,'edit':false}; // 你可以替换 "YourNameHere" 为你想要的名称
        //     })
        //     },
        //     set(v) {
        //         // this.$emit("update:modeStatus", v)
        //     }
        // },
        routesWithNames() {
            // Compute and return routes with names
            return this.routes.map(route => {
                return { ...route, name: route.mid, edit: false };
            });
        },
        shouldShowRoutes() {
            return !this.isItATask && this.routes && this.routes.length > 0;
        },
        shouldShowTasks() {
            return this.isItATask && this.tasksRoutes && this.tasksRoutes.length > 0;
        },
        shouldShowEmpty() {
            return !this.shouldShowRoutes && !this.shouldShowTasks;
        },
        shouldShowLoad() {
            return this.isItATask && this.tasksLoading && this.tasksRoutes.length == 0;
        }
    },
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
        itemClick(index) {
            console.log('sssopp', index);
        },
        getObjData(positions) {
            const data = []
            const count = positions.length || 0;
            let idCounter = 0
            for (let index = 0; index < count; index++) {
                const position = positions[index]
                data.push({
                    id: String(idCounter++),
                    lng: String(position[0]),
                    lat: String(position[1]),
                })
            }
            return data
        },
        init() {
        },
        /**编辑航线名称（修改对应的manger的name */
        openEdit(route) {
            // this.$set(route, "edit", true);

            this.$emit('send:edit', route)
        },
        /**航线-回车确认（输入框编辑完成） */
        renameAction(route) {
            this.$emit("send:edit", route, this.newName);
        },
        /**历史航线任务编辑 */
        openEditSqlRoute(route) {
            const name = '航线任务1-11'//time(Date.now());
            this.routeName = route.kmzName;
            this.$bus.$emit('send:editRoute', route)
        },
        renameActionSql(route) {
            this.$bus.$emit('send:editRoute', route, this.routeName);
        },

        //#region --------------------------------------------------------组件传递----------------------------------------------------------------------- 
        /**切换航线任务  */
        switchRoutes() {
            this.isItATask = !this.isItATask
        },

        /**跨组件查询历史航线任务 */
        ChoiseTimeEvent() {
            this.$bus.$emit('send:choiseTime', [...this.choiseTime])
        },
        /**跨组件发送上传 */
        sendUploadToUav(sendRoute, type) {

            // drow // tasks        startTime:1,        endTime: 3,
            if (type === 'drow') {
                sendRoute.startTime = this.startTime//  Number(this.startTime)
                sendRoute.endTime = this.endTime// Number(this.endTime )
                sendRoute.speed = this.slidervalue
                this.$bus.$emit('send:uploadRouteTouav', sendRoute, type)
            } else {
                this.$bus.$emit('send:uploadRouteTouav', sendRoute, type)
            }



            // this.$emit('send:toggleRouteManager') // //收起下拉
        },
        /**组件发送保存航线至minion */
        sendsave(saveRoute) {
            saveRoute.startTime = this.startTime
            saveRoute.endTime = this.endTime
            console.log('组件发送保存航线', saveRoute);
            this.$bus.$emit('send:saveRouteToMinio', saveRoute, this.slidervalue)
            // console.log('saveRoute',saveRoute,this.slidervalue);
            this.$emit('send:toggleRouteManager')  //收起下拉
            // this.$bus.$emit('send:ceshiRouteToMinio', saveRoute);  //发送保存至minio
        },
        /*编辑删除航线 */
        editRouteTask(route, type) {
            this.$confirm('确认删除该航线任务？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$bus.$emit('send:editRouteTask', route, type)
                // this.showMessage('message', "success");
            }).catch(() => {

            });
            // this.$bus.$emit('send:editRouteTask', route, type)
        },
        /**解析航线 */
        readerkml(sendRoute, type) {
            this.$bus.$emit('send:readerKml', sendRoute)
        },

        //#endregion

        //#region 时间处理
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
        filtersType(val) {
            return filtersType(val);
        },
        parseTime(date) {
            return parseTime(date);
        },
        fileSizeKB(kmzFileSize) {
            const fileSizeKB = kmzFileSize / 1024; // 将字节数转换为 KB
            // String formattedSize = String.format("%.2f KB", fileSizeKB); // 格式化结果（保留两位小数）
        },
        formattedNum(num) {
            var roundedNum = Math.round(num * 100) / 100; // 进行四舍五入
            var formattedNum = roundedNum.toFixed(2); // 格式化结果保留两位小数

            return formattedNum
        },
        formatTime(value) {
            if (value === 0) return '0 s';

            let type = ["s", "m", "h"],
                i = Math.floor(Math.log(value) / Math.log(60));

            return new Number((value / Math.pow(60, i)).toPrecision(3)) + " " + type[i];
        }
        //#endregion
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() { },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.init();
    },
    beforeCreate() { }, //生命周期 - 创建之前
    beforeMount() { }, //生命周期 - 挂载之前
    beforeUpdate() { }, //生命周期 - 更新之前
    updated() { }, //生命周期 - 更新之后
    beforeDestroy() { }, //生命周期 - 销毁之前
    destroyed() { }, //生命周期 - 销毁完成
    activated() { }, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
@import "../../../styles/default.scss";

.routelist-manager-box {
    width: $draw-panel-width;
    background-color: $bg-color;
    color: $color;
    height: 400px;
    overflow: auto;

    // ::v-deep span {
    //     font-size: $font-size;
    //     display: inline-block;
    //     vertical-align: top;
    // }
    ::v-deep .el-card__body {
        height: 200px;
        padding: 10px 15px;
    }

    ::v-deep .el-card__header {
        font-size: 14px;
        padding: 2px 15px;
    }

    &::-webkit-scrollbar {
        display: none;
    }

    .el-row {
        display: flex;
        align-items: center;
    }
}

.route-manager-header {
    // position: relative;
    position: sticky;
    top: 0px;
    z-index: 1;
    height: $title-height;
    line-height: $title-height;
    border-bottom: 1px solid $devision-color;
    background-color: $bg-color;
    padding: $padding;
    color: $color;

    i {
        margin: $item-margin;
        color: $color;
    }

    span {
        color: $color;
    }

    .date-picker {
        position: absolute;
        cursor: pointer;
    }
}

.position-item {
    margin: 5px;
}

.icon-tijiao,
.icon-shanchu-,
.icon-baocun {
    font-size: 36px;
}

.icon-tijiao {
    margin-right: 10px;
}

.rightfloat {
    display: flex;
    align-items: center;

    .icon-hangxianxinxi {
        font-size: 21px;
    }

    .icon-shanchu- {
        font-size: 26px;
    }
}

// 航线任务
.container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 10px;
    /* 如果需要设置间距可以调整这个值 */
}

.item {
    background-color: lightblue;
    padding: 10px;
}

::v-deep .task-div {}

/**时间选择器样式突兀修改 */
::v-deep .el-range-editor {
    .el-range__icon {
        margin-bottom: 10px;
    }

    .el-range-separator {
        line-height: 22px;
    }
}

::v-deep .el-input__inner {
    border: none;
    border-bottom: 1px solid #444444;
    border-radius: 0;
}

// 时间选择器
::v-deep .inputText .el-input__inner {
    width: 100%;
}

::v-deep .el-range-editor.el-input__inner {
    width: 230px;
    padding: 3px;

    .el-range__close-icon {
        display: none;
    }
}

.sliderContainer {
    display: flex;
    align-items: center;
    margin: 0px 5px;

    &> :first-child {
        margin: 0px 15px 0px 10px;
    }

    &> :not(:first-child) {
        flex-grow: 1;
    }
}

.loadingStyle {
    display: flex;
    align-items: center;
    flex-direction: column;
    height: 100%;
    flex: 1;
    align-content: center;
    justify-content: center;
    font-size: 20px;

    .loading {
        width: 115px;
        height: 115px;
        border-radius: 50%;
        display: inline-block;
        position: relative;
        border: 3px solid;
        border-color: #ddd #ddd transparent;
        animation: rotation 1s linear infinite;
    }

    .loading:after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        border: 3px solid;
        border-color: transparent #ff3d00 #ff3d00;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        -webkit-animation: rotationBack 0.5s linear infinite;
        animation: rotationBack 0.5s linear infinite;
        transform-origin: center center;
    }

    .loading-text {
        font-size: 28px;
        font-family: Arial, Helvetica, sans-serif;
        font-weight: bold;
        color: #ff3d00;
        letter-spacing: 2px;
        position: relative;
    }

    .loading-text::after {
        content: "加载中..";
        position: absolute;
        left: 0;
        top: 0;
        color: #fff;
        text-shadow: 0 0 2px #ff3d00, 0 0 1px #ff3d00, 0 0 1px #ff3d00;
        width: 100%;
        height: 100%;
        overflow: hidden;
        animation: loading-animation 6s linear infinite;
    }

    @keyframes loading-animation {
        0% {
            height: 100%;
        }

        100% {
            height: 0%;
        }
    }

    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes rotationBack {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(-360deg);
        }
    }
}

.cursorStyle {
    cursor: pointer;

    &:hover {
        color: aquamarine;
    }
}

.disabled {
    opacity: 0.5;
    /* 或者其他禁用状态下的样式 */
    cursor: not-allowed !important;
    pointer-events: none;
    /* 禁止鼠标事件 */
}
</style>