<!--
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2023-11-23 19:08:24
 * @LastEditors: likai 2806699104@qq.com
 * @LastEditTime: 2024-07-12 19:23:51
-->
<!--  -->
<template>
    <div class="con" v-loading="fullloading" :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.8)">
        <aside>
            <div class="resize"></div>
            <div class="line"></div>
            <div class="section aside-section">
                <div class="abP">
                    <el-button size="medium" round @click="clickHandle">处理</el-button>
                    <el-button size="medium" round @click="uploadProcess">上传</el-button>
                    <el-button size="medium" round @click="openFileDialog">文件上传</el-button>
                </div>
                <div class="aside-flex" v-if="currentComponent == 'nowComponents'">
                    <div class="flex-item flex-fly">
                        <el-card class="top-card fly-card" shadow="always">
                            <el-statistic class="fly-statistic">
                                <template slot="title">
                                    <span class="fly-title cursorStyle" @click="selectUav()" :title="`当前：${defaultUavSn}  \n 点击切换UAV`">处理列表</span>
                                </template>
                                <template slot="formatter">
                                    <span> {{ handleList.length > 0 ? handleList.length : '空' }}</span>
                                    <el-select ref="selectRef" class="fly-select" v-model="defaultUavSn" placeholder="请选择" @change="selectTrigger(defaultUavSn)">
                                        <el-option v-for="(item, index) in uavs" :key="index" :label="item.uavName" :value="item.uavId">
                                            <span style="float: left">{{ item.uavName }}</span>
                                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.uavId }}</span>
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-statistic>
                        </el-card>
                        <div class="table-card fly-table-card">
                            <el-skeleton :loading="leftloading" animated :throttle="500">
                                <template slot="template">
                                    <el-card v-for="(item, index) of 7" :key="index" class="photo-card">
                                        <template #header>
                                            <div class="card-header">
                                                <el-skeleton-item variant="h1" style="width: 100%" />
                                            </div>
                                        </template>
                                        <div>
                                            <el-skeleton-item variant="p" style="width: 100%" v-for="index of 4" :key="index" />
                                        </div>
                                    </el-card>
                                </template>
                                <template>
                                    <div v-if="handleList && handleList.length > 0">
                                        <el-card v-for="(item, index) of handleList" :key="index">
                                            <el-collapse>
                                                <el-collapse-item class="el-collapse-items">
                                                    <template slot="title">
                                                        <div style="width:100%;" :style="{ 'color': (currentHandleId == item.id ? '#068bed' : '') }" class="flexDiv">
                                                            <div> <span>{{ index + 1 }}</span></div>
                                                            <div @click.stop="chooseOtherHandle(item)"> <span class="items-sn">{{ parseTime(item.date) }}</span></div>
                                                        </div>
                                                    </template>
                                                    <!-- 下面 -->
                                                    <div class="rowlist flexDiv" style="background: rgba(0, 0, 0, 0);">
                                                        <div style="">
                                                            <span class="fontweight">处理时间&nbsp;:&nbsp;</span>
                                                            <span>{{ time(item.date) }}</span>
                                                        </div>
                                                        <div style="">
                                                            <span class="fontweight">原点经度&nbsp;:&nbsp;</span>
                                                            <span>{{ item.lng }}</span>
                                                        </div>
                                                        <div style="">
                                                            <span class="fontweight">原点纬度&nbsp;:&nbsp;</span>
                                                            <span>{{ item.lat }}</span>
                                                        </div>
                                                        <div style="">
                                                            <span class="fontweight">地高&nbsp;:&nbsp;</span>
                                                            <span>{{ item.lat }}</span>
                                                        </div>
                                                        <div style="">
                                                            <span class="fontweight">飞行高 &nbsp;:&nbsp; </span>
                                                            <span>{{ item.lat }}</span>
                                                        </div>

                                                    </div>
                                                </el-collapse-item>
                                            </el-collapse>
                                        </el-card>
                                    </div>
                                    <el-empty v-else description="暂无数据"></el-empty>
                                </template>
                            </el-skeleton>
                        </div>
                    </div>
                    <div class="flex-item">
                        <el-card class="top-card" shadow="always">
                            <el-statistic title="作业地块列表">
                                <template slot="formatter">
                                    {{ blockList.length > 0 ? blockList.length : '空' }}
                                </template>
                            </el-statistic>
                        </el-card>
                        <div class="table-card">
                            <el-skeleton :loading="centerloading" animated :throttle="500">
                                <template slot="template">
                                    <el-card v-for="(item, index) of 5" :key="index" class="photo-card ">
                                        <template #header>
                                            <div class="card-header">
                                                <el-row :gutter="5" style="width:100%">
                                                    <el-col :span="10">
                                                        <el-skeleton-item variant="h3" style="width: 100%" />
                                                    </el-col>
                                                    <el-col :span="14">
                                                        <el-skeleton-item variant="h3" style="width: 100%" />
                                                    </el-col>
                                                </el-row>
                                            </div>
                                        </template>
                                        <div class="image-demo">
                                            <el-row class="image-info" :gutter="3">
                                                <el-col :xs="24" :sm="14" :md="14" :lg="14" :xl="24">
                                                    <el-skeleton-item variant="image" style="width: 100%; height: 100px ;overflow: auto; " />
                                                </el-col>
                                                <el-col :xs="24" :sm="10" :md="10" :lg="10" :xl="24">
                                                    <el-skeleton-item variant="text" style="width: 100%" />
                                                </el-col>
                                            </el-row>
                                        </div>
                                    </el-card>
                                </template>
                                <template>
                                    <div v-if="blockList && blockList.length">
                                        <el-card v-for="(item, index) of blockList" :key="index" class="photo-card ">
                                            <template #header>
                                                <div class="card-header">
                                                    <div class="card-header-text">{{ `地块编号：${item.id}` }} </div>
                                                </div>
                                            </template>
                                            <!-- 卡片显示的内容 -->
                                            <div class="image-demo">
                                                <el-row :gutter="3" class="image-info">
                                                    <el-col :xs="24" :sm="14" :md="14" :lg="14" :xl="24">
                                                        <el-image style="width: 100%; height: 100px ;overflow: auto; " :src="`data:image/png;base64,${item.img}`" fit="cover"
                                                            :preview-src-list="[`data:image/png;base64,${item.img}`]">
                                                        </el-image>
                                                    </el-col>
                                                    <el-col class="demo-text" :xs="24" :sm="10" :md="10" :lg="10" :xl="24">
                                                        <div>
                                                            <div>
                                                                <span class="fontweight">空斑面积&nbsp;:&nbsp;{{ item.gapSquare }}</span>
                                                                <span class="fontweight">补播区域数&nbsp;:&nbsp; {{ item.reseedAreaNum }}</span>
                                                            </div>
                                                            <div><span class="fontweight">经纬度&nbsp;:&nbsp;</span>
                                                                {{ `(${item.centreLongitude ? (item.centreLongitude).toFixed(5) : '未知'},${item.centreLatitude ? (item.centreLatitude).toFixed(5) :
                                                                    '未知'})` }}</div>
                                                        </div>
                                                    </el-col>
                                                </el-row>
                                            </div>
                                        </el-card>
                                    </div>
                                    <el-empty v-else description="暂无数据"></el-empty>
                                </template>
                            </el-skeleton>
                        </div>
                    </div>
                    <div class="flex-item">
                        <el-card class="top-card fly-card el-card" shadow="always">
                            <div @click="getCoordinates"> 补播路径列表</div>
                            <div class="formatter"> {{ pointlist.length > 0 ? pointlist.length : '空' }}</div>
                        </el-card>
                        <div class="table-card parent-element" id="coio">
                            <el-skeleton :loading="rightloading" animated :throttle="500">
                                <template slot="template">
                                    <el-card v-for="(item, index) of 7" :key="index" class="photo-card ">
                                        <template #header>
                                            <div class="card-header">
                                                <el-skeleton-item variant="h1" style="width: 100%" />
                                            </div>
                                        </template>
                                        <div style="height:80px;width:100%">
                                            <el-row :gutter="20">
                                                <el-col :span="16">
                                                    <el-skeleton-item variant="h3" style="width: 100%" />
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-skeleton-item variant="p" style="width: 100%" />
                                                </el-col>
                                                <el-col :span="16">
                                                    <el-skeleton-item variant="p" style="width: 100%" />
                                                </el-col>
                                            </el-row>
                                        </div>
                                    </el-card>
                                </template>
                                <template>
                                    <el-card>
                                        <template #header>
                                            <div class='flexDiv card-header'>
                                                <div class='card-header-text'>类型：</div>
                                                <el-radio-group v-model="currentType" @change="switchType">
                                                    <el-radio :label="1">单点</el-radio>
                                                    <el-radio :label="0">连续补播</el-radio>
                                                </el-radio-group>
                                            </div>
                                        </template>
                                        <div style="font-size: 12px;" class="flexDiv">
                                            <el-radio-group v-model="isflyed" @input="switchFlyTime">
                                                <el-radio :label="0">未播</el-radio>
                                                <el-radio :label="1">已播</el-radio>
                                                <el-radio :label="2">全部</el-radio>
                                            </el-radio-group>
                                            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="selectAllPoint">{{ `全选` }}</el-checkbox>
                                        </div>
                                    </el-card>
                                    <div v-if='currentType'>
                                        <div v-if="pointlist && pointlist.length">
                                            <el-card v-for="(item, index) of pointlist" :key="index" :class="['point-card , child-element ', `photoId-${item.photoId}`]">
                                                <template #header>
                                                    <div class="card-header">
                                                        <el-checkbox v-model="item.checked" @change="pointchangeChecked(item)">{{ `路径点${item.id}` }}</el-checkbox>
                                                        <div class="flytime">巡播数：{{ item.flyTimes ? item.flyTimes : '0' }}</div>
                                                    </div>
                                                </template>
                                                <div style="font-size: 12px;" class="flexDiv">
                                                    <div class="fontweight">经纬度&nbsp;:&nbsp; {{ `(${(item.lng).toFixed(5)},${(item.lat).toFixed(5)})` }}</div>
                                                    <div class="fontweight">大地高&nbsp;:&nbsp; {{ (item.alt).toFixed(3) }}</div>
                                                    <div class="fontweight">所需草种数&nbsp;:&nbsp; {{ item.seedNum }}</div>
                                                </div>
                                            </el-card>
                                        </div>
                                        <el-empty v-else description="暂无数据"></el-empty>
                                    </div>
                                    <!-- 线段补播 -->
                                    <div v-if='!currentType'>
                                        <div v-if="lineList && lineList.length">
                                            <el-card v-for="(item, index) of lineList" :key="index" :class="['point-card , child-element ', `photoId-${item.photoId}`]">
                                                <template #header>
                                                    <div class="card-header">
                                                        <el-checkbox v-model="item.checked" @change="linechangeChecked(item)">{{ `路径点${item.id}` }}</el-checkbox>
                                                        <div class="flytime">巡播数：{{ item.flyTimes ? item.flyTimes : '0' }}</div>
                                                    </div>
                                                </template>
                                                <div style="font-size: 12px;" class="flexDiv">
                                                    <div class="fontweight">起点&nbsp;:&nbsp; {{ `(${(item.onlng).toFixed(5)},${(item.onlat).toFixed(5)})` }}</div>
                                                    <div class="fontweight">终点&nbsp;:&nbsp; {{ `(${(item.offlng).toFixed(5)},${(item.offlat).toFixed(5)})` }}</div>
                                                    <!-- <div class="fontweight offlat">所需草种数&nbsp;:&nbsp; {{ item.seedNum }}</div> -->
                                                </div>
                                            </el-card>
                                        </div>
                                        <el-empty v-else description="暂无数据"></el-empty>
                                    </div>
                                </template>
                            </el-skeleton>
                        </div>
                    </div>
                </div>

            </div>
        </aside>
        <!--右侧 -->
        <main>
            <div class="main">
                <CesiumMap ref="CesiumMap" :defaultUavSn="defaultUavSn" :visible=CesiumDrawVisible></CesiumMap>
            </div>
            <!--  -->
            <footer>
                <div class="resize-top"></div>
                <div class="line-level "></div>
                <section class="footer-section">
                    <div class="footer-bottom">
                        <div class="hascheckedPoint">
                            <div class="settingBnt">
                                <el-button @click="saveRouteToStore(true)">保存航线</el-button>
                                <el-button @click="openTaskDialog">{{ `上传${currentType ? '航点' : '航线'}` }}</el-button>
                                <el-button @click="downloadRouteTask" v-if="1 == 2">下载</el-button>
                                <el-button @click="isVisableSetunifiedHeight = !isVisableSetunifiedHeight">设置统一高度</el-button>
                                <el-button @click="seedmsg">SSE</el-button>

                                <div id="con"></div>
                                <div class="block" v-show="isVisableSetunifiedHeight">
                                    <el-slider @change="setunifiedHeight" v-model="unifiedHeight" :max="500" show-input>
                                    </el-slider>
                                </div>
                            </div>
                            <div class="checked-tablecard">
                                <el-row :gutter="5">
                                    <draggable v-if='currentType' v-model="choosePointlist" group="one" @change="change" @start="start" @end="end">
                                        <el-col :xs="8" :sm="8" :md="8" :lg="6" :xl="6" v-for="(item) of choosePointlist" :key="item.id">
                                            <el-card shadow="hover" :class="['point-card', item.photoid]">
                                                <template #header>
                                                    <div class="card-header">
                                                        <div>
                                                            <el-checkbox v-model="item.checked" @change="pointchangeChecked(item)">{{ `路径点${item.id}` }}</el-checkbox>
                                                        </div>
                                                        <div style="width:180px">
                                                            <el-slider v-model="item.alt" :max="500"></el-slider>
                                                        </div>
                                                    </div>
                                                </template>
                                                <div style="font-size: 12px;">
                                                    <div><span class="fontweight">经纬度&nbsp;:&nbsp;</span>
                                                        {{ `(${(item.lng).toFixed(5)},${(item.lat).toFixed(5)})` }}</div>
                                                </div>
                                            </el-card>
                                        </el-col>
                                    </draggable>
                                    <draggable v-else v-model="chooseLinelist" group="one" @change="change" @start="start" @end="end">
                                        <el-col :xs="8" :sm="8" :md="8" :lg="6" :xl="6" v-for="(item) of chooseLinelist" :key="item.id">
                                            <el-card shadow="hover" :class="['point-card', item.photoid]">
                                                <template #header>
                                                    <div class="card-header">
                                                        <div>
                                                            <el-checkbox v-model="item.checked" @change="linechangeChecked(item)">{{ `路径点${item.id}` }}</el-checkbox>
                                                        </div>
                                                        <div style="width:180px">
                                                            <el-slider v-model="item.onalt" :max="500"></el-slider>
                                                        </div>
                                                    </div>
                                                </template>
                                                <div style="font-size: 12px;">
                                                    <div><span class="fontweight">起始点&nbsp;:&nbsp;</span>
                                                        {{ `(${(item.onlng).toFixed(5)},${(item.onlat).toFixed(5)})` }}</div>
                                                    <div><span class="fontweight">终点&nbsp;:&nbsp;</span>
                                                        {{ `(${(item.offlng).toFixed(5)},${(item.offlat).toFixed(5)})` }}</div>
                                                </div>
                                            </el-card>
                                        </el-col>
                                    </draggable>
                                </el-row>
                            </div>
                        </div>
                        <!-- <el-empty :image-size="100" v-else description="暂无航线数据"></el-empty> -->
                    </div>
                </section>
            </footer>
        </main>
        <!-- 处理弹窗 -->
        <div id="handleDialog" class="block" @click="closeHandleDialog">
            <div class="content" id="div1">
                <div id="close">
                    <span id="close-button"></span>
                    <div></div>
                </div>
                <div id="div2">
                    <form @submit="handleSubmit">
                        <div class="formchild">
                            <label for="name">ENU原点经纬度和地高:</label>
                            <div class="input-list">
                                <!-- 原点经纬度和地高 -->
                                <label for="longitude">经度：</label>
                                <input type="number" id="longitude" v-model="handleInfo.longitude">
                                <label for="latitude">纬度：</label>
                                <input type="number" id="latitude" v-model="handleInfo.latitude">
                                <label for="height">地高：</label>
                                <input type="number" id="height" v-model="handleInfo.height">
                            </div>
                        </div>
                        <div class="formchild">
                            <label for="uavheight">播种无人机飞行高度:</label>
                            <input type="number" id="uavheight" v-model="handleInfo.uavheight"> <span>m</span>
                        </div>
                        <div class="formchild">
                            <label class="texts">补播机构参数：<span @click="plus">+</span></label>
                            <input v-show="isshow" type="text" id="email" placeholder="请输入机构参数（4-8字符）" v-model="handleInfo.size"> <span v-show="isshow">cm</span>
                        </div>
                        <div class="formchild">
                            <label for="size">口径大小:</label>
                            <input type="number" id="email" v-model="handleInfo.size"> <span>cm</span>
                        </div>
                        <div class="formchild">
                        </div>
                    </form>

                </div>
                <div id="footer">
                    <el-button size="mini" @click="handleSubmit">提交</el-button>
                    <el-button size="mini" @click="canlceHandle">取消</el-button>
                </div>
            </div>

        </div>
        <div id="fileDialog" class="block" @click="closeFileDialog">
            <div class="content" id="div1">
                <div id="close">
                    <span id="close-button"></span>
                    <div></div>
                </div>
                <div id="div2">
                    <el-upload class="upload-demo" ref="upload" action="/" :on-preview="handlePreview" size="mini" :before-remove="beforeRemove" :on-remove="handleRemove" :file-list="fileList"
                        :auto-upload="false" :on-change="changeFile">
                        <el-button slot="trigger" size="mini" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传zip文件，且不超过50M</div>
                    </el-upload>
                </div>
                <div id="footer">
                    <el-button size="mini" @click="fileSubmit" :disabled="!(fileList && fileList.length > 0)" :loading="btnloading">{{ '上传' }}</el-button>
                    <el-button size="mini" @click="canlceHandle">取消</el-button>
                </div>
            </div>
        </div>
        <!-- 航线弹窗 -->
        <div id="lineDialog" class="dialog">
            <div class='content' :style="{width:'30%'}">
                <div id="header">
                    <span>航线</span>
                </div>
                <div class='main'>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <div class=""><el-input placeholder="请输入内容"></el-input></div>
                        </el-col>
                        <el-col :span="12">
                            <div class=""></div>
                        </el-col>
                        <el-col :span="12">
                            <div class=""></div>
                        </el-col>
                        <el-col :span="12">
                            <div class=""></div>
                        </el-col>
                    </el-row>
                </div>
                <div id="footer">
                </div>
            </div>
        </div>
        <!-- 上传补播路径任务弹窗 -->
        <missionTaskDialog ref="missionTaskDialog" @submit:missionTask=uploadRouteTask></missionTaskDialog>
        <processDialog ref="processDialog" :defaultUavSn="defaultUavSn"></processDialog>
        <!-- 是否保存 -->
        <el-dialog title="下载完成" :visible.sync="centerDialogVisible" width="20%" center>
            <span>航线下载完成，请保存？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="respondRouteInfo()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
// import Worker from '@/views/planningManager/my.worker'
import { parseTime, filtersType } from "@/utils/index";
import { title } from "@/settings.js";
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import draggable from "vuedraggable"; // 拖拽
import { mapGetters } from 'vuex'
import CesiumMap from "../components/Cesium/CesiumMap.vue";
import store from "@/store";
import missionTaskDialog from "./components/missionTask.vue"
import processDialog from "./components/processDialog.vue";
import * as turf from '@turf/turf';
var latestSortyInfo = {}; //最新架次
import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';
import { isEqual } from "@/utils/currency";
export default {
    name: "",
    //import引入的组件需要注入到对象中才能使用
    components: {
        missionTaskDialog,
        processDialog,
        CesiumMap,
        draggable,
    },
    data() {
        //这里存放数据
        return {
            lat: 0,
            lng: 0,
            num: 500,
            currentType: 1, //  1:point 0:line
            pointlist: [], // 点列表
            choosePointlist: [], // 选中的点列表
            lineList: [], // 线列表
            chooseLinelist: [], // 选中的线列表

            btnloading: false,
            fileList: [],
            isIndeterminate: true,
            checkAll: false,
            isflyed: 2,
            eventSource: null,
            centerDialogVisible: false,
            isshow: false,
            loadingText: '拼命加载中',
            /**补播任务 */
            missionTask: {
                missionType: 0,
                speed: 0,
                maxSpeed: 20,
            },
            currentComponent: 'nowComponents',
            uavs: [],
            handleInfo: {},
            currentHandleId: null,
            labelPosition: 'top',
            value: '',

            defaultUavSn: '',
            windows: {}, // 用于存储浏览器窗口对象的引用
            isVisableSetunifiedHeight: false,
            unifiedHeight: 50, // 默认50统一高度
            fullloading: false,
            leftloading: true,
            centerloading: false,
            rightloading: false,
            islatestSortyInfo: true,
            CesiumDrawVisible: false,
            checked: true,
            lazysrc: true,
            photolist: [],
            blockList: [],
            handleList: [],
            flylist: [],
            holelist: [],
            checkedPoint: [], // nouse
            selectedObjects: new Map(),
            resultArray: [],
        };
    },
    //让组件接收外部传来的数据
    props: {},
    //监听属性 类似于data概念
    computed: {
        ...mapGetters([
            'minke',
            'userId',
            'name',
            'userInfo',
            'currentMid',
            'currentMidUnifiedHeight',
            'webSocketMsg',
            'webSocketData',
            'messageId',
            'defaultUavHeartbeat',
            'currentWorkPoint',
        ]),
    },
    //监控data中的数据变化
    watch: {
        choosePointlist(newVal, oldVal) {
            this.pointToRoute(newVal)
        },
        chooseLinelist: {
            handler(newVal, oldVal) {
                this.lineToRoute(newVal)
            },
            deep: true // 深度监听对象数组的变化  
        }
    },
    //方法集合
    methods: {
        handlequery() {
            this.queryPointList(this.currentHandleId);
        },
        selectAllHandle(bool) {
            this.value1 = bool ? this.options.map(v => v.value) : [];
        },
        // #region -------------------------------------------------------------------- 组件传递 ---------------------------------------------------------
        getCoordinates() {
            console.log("注册地图点击事件");
            this.$refs.CesiumMap.getCoordinates();
        },
        /**绘制航线 */
        drawLines(positions, type = this.currentType) {
            if (type) {

            } else {

            }
            this.$refs.CesiumMap.drawLines(positions);
        },
        /**后端返回数据 */
        respondRouteInfo(newVal) {
            // this.centerDialogVisible = true
            const result = newVal.map((item) => [item.lng / 10000000, item.lat / 10000000, item.altRel / 100]);  // 差一个高度
            this.resultArray = result
            this.drawLines(result);
        },
        /**计算点信息  绘制航线 */
        pointToRoute(newVal) {
            const result = newVal.map((item) => [item.lng, item.lat, item.alt]);
            this.resultArray = result
            console.log('resultArray', result);

            this.drawLines(result);
        },
        /* 计算线信息  绘制航线 */
        lineToRoute(newVal) {
            // 映射起点和终点，并展平结果  
            const result = newVal.flatMap((item) => [
                [item.onlng, item.onlat, item.onalt], // 起点  
                [item.offlng, item.offlat, item.offalt] // 终点  
            ]);

            this.resultArray = result
            this.drawLines(result);
        },
        /**保存航线☞store */
        saveRouteToStore(showMsg = false) {
            const dateId = Date.now();
            const mid = dateId;
            const unifiedHeight = null;
            var geo= this.resultArray.map(coord => {
                let values = new Array(3);
                values[0] = coord[0]; // 航线经度
                values[1] = coord[1]; // 航纬度
                if (parseFloat(coord[2]) < 10) {
                    values[2] = 30; // 高度
                } else {
                    values[2] = coord[2];
                }
                return values;
            }); 
            this.$store.dispatch("routeData/setRouteData", { mid, geoCoordinates:geo, unifiedHeight, }); // 存储store

            if (showMsg) {
                console.log('已保存');
                this.showToast('已保存')
            }
        },
        saveRouteData(showMsg) {
            /**数据处理*/
            // [[113.36887409647213,23.155143504551752,19.00895890982441],[113.36887409647213,23.155143504551752,19.00895890982441]] 
            var geo = this.choosePointlist.map((obj) => {
                let values = new Array(3);
                values[0] = obj.lng; // 航线经度
                values[1] = obj.lat; // 航纬度
                if (parseInt(obj.alt) < 10) {
                    values[2] = 30; // 高度
                } else {
                    values[2] = obj.alt;
                }
                return values;
            });
            const dateId = Date.now();
            const mid = dateId;
            const unifiedHeight = null;
            this.$store.dispatch("routeData/setRouteData", { mid, geoCoordinates:geo, unifiedHeight, }); // 存储store
            if (showMsg) {
                this.showToast('已保存')
            }
        },
        sendrouteInfoEvent() { },
        /**设置统一高度 */
        setunifiedHeight() {
            var modifiedArray = this.choosePointlist.map((obj) => {
                obj.alt = this.unifiedHeight;
                return obj;
            });
            this.choosePointlist = modifiedArray;
        },
        //#endregion

        // #region ------------------------------------------------------------------ 后端查询 -----------------------------------------------------------------------------
        /**早期查询初始 */
        async queryInfo(UavSn = this.defaultUavSn) {
            var data = await this.queryFlightNumber(UavSn);
            this.flylist = data;
            if (data.length >= 1) {
                latestSortyInfo = data[0]; // 获取架次最新id
                this.queryPhotoInfo(data[0].id, UavSn);
                this.queryHoleInfo(data[0].id, UavSn);
            } else {
                this.photolist = []
                this.holelist = []
            }
        },
        /**最新的初始查询 */
        async queryNewInfo() {
            var data = await this.queryHandle()
            this.handleList = data || [];
            if (data.length >= 1) {
                this.currentHandleId = data[0].id
                this.queryBlockList(data[0].id);
                this.queryPointList(data[0].id); // 查询处理单个
                this.queryLineList(data[0].id)
            } else {
                this.blockList = []
                this.pointlist = []
            }
        },
        //#region 现在左至右
        /**选择其他处理信息 */
        async chooseOtherHandle(handleObj) {
            const latestHandleId = handleObj.id
            if (this.currentHandleId == latestHandleId) return false;
            this.queryBlockList(latestHandleId),
                this.queryPointList(latestHandleId)
            this.queryLineList(latestHandleId)
            this.currentHandleId = latestHandleId
            this.choosePointlist = []
        },
        /**查询处理列表 ✓ */
        async queryHandle() {
            this.leftloading = true;
            const url = "uavs/queryHandle";
            try {
                const startTime = Date.now() - 6 * 30 * 24 * 60 * 60 * 1000;
                const endTime = Date.now();
                const formdata = {
                    startTime,
                    endTime,
                };
                // const startTimes = this.convertToFormattedDate(startTime);
                const payload = { formdata, url, that: this };
                const response = await this.$store.dispatch("uavs/queryHandle", payload);
                const { code, message, data } = response;
                if (code != 1) {
                    this.showMessage(message, "warning");
                }
                return data; // 返回数据
            } catch (error) {
                return null; // 返回数据
                this.showMessage(error, "error");
            } finally {
                this.leftloading = false;
            }
        },

        /**作业地块 */
        async queryBlockList(id) {
            this.centerloading = true;
            let url = "uavs/queryBlockList";
            try {
                let formdata = new FormData();
                formdata.append('handleId', id)
                const response = await this.$store.dispatch("uavs/queryBlockList", formdata);
                const { code, message, data } = response;
                if (code === 1) {
                    // this.showMessage(message, "success");
                    this.blockList = data || [];
                } else {
                    this.showMessage(message, "warning");
                }
                return Promise.resolve(response);
            } catch (error) {
                this.showMessage(error, "error");
                return Promise.reject(error);
            } finally {
                this.centerloading = false;
            }
        },
        /**补播路径信息 */
        async queryPointList(id) {
            this.rightloading = true;
            try {
                const formdata = new FormData(); // 查询架次图片
                formdata.append("handleId", id);
                formdata.append('flyTimes', this.isflyed)
                const response = await this.$store.dispatch("uavs/queryPointList", formdata);
                const { code, message, data } = response;
                if (code === 1) {
                    const pointList = data || [];
                    pointList.forEach((item => {
                        item.checked = false
                    }))
                    this.pointlist = pointList;
                } else {
                    this.showMessage(message, "warning");
                }
                return Promise.resolve(response);
            } catch (error) {
                this.showMessage(error, "error");
                return Promise.reject(error);
            } finally {
                this.rightloading = false;
            }
        },
        /**查询线 */
        async queryLineList(id) {
            try {
                const formdata = new FormData(); // 查询架次图片
                formdata.append("handleId", id);
                formdata.append('flyTimes', this.isflyed)
                const response = await this.$store.dispatch("uavs/queryLineList", formdata);
                const { code, message, data } = response;
                if (code === 1) {
                    const lineList = data || [];
                    lineList.forEach((item => {
                        item.checked = false
                    }))
                    this.lineList = lineList
                } else {
                    this.showMessage(message, "warning");
                }
                return Promise.resolve(response);
            } catch (error) {
                this.showMessage(error, "error");
                return Promise.reject(error);
            }

        },

        //#endregion

        //#region ------------------------------------------------------------以前左至右---------------------------------------------------
        /**切换架次 */
        async switchingFlightSorties(item) {
            if (item.id != latestSortyInfo.id) {
                this.islatestSortyInfo = false;
                //查询 架次下的图片与点
                var data = await this.queryPhotoInfo(item.id, item.uavId);
                await this.queryHoleInfo(item.id, item.uavId);
                // 清除航线
                this.$refs.CesiumMap.clearLines();
                // clearLines
                // 播种信息
                // for (let i = 0; i < this.holelist.length; i++) {
                //     // if(data.length>1){
                //     //     this.queryHoleSeedingInfo(data.id)
                //     // }
                // }
            } else {
                this.islatestSortyInfo = true;
                //查询 架次下的图片与点
                this.queryPhotoInfo(item.id, item.uavId);
                this.queryHoleInfo(item.id, item.uavId);
            }
        },
        /**一段时间戳 */
        calculateTimeRange(days) {
            const startTime = Date.now() - days * 24 * 60 * 60 * 1000;
            const endTime = Date.now();
            return { startTime, endTime };
        },
        /**查询飞行架次 根据无人机id查询 一个月的飞行记录*/
        async queryFlightNumber(UavSn = this.defaultUavSn) {
            this.leftloading = true;
            try {
                const { startTime, endTime } = this.calculateTimeRange(30); // 计算时间范围
                // 时间戳大1000倍
                let formdata = new FormData();
                formdata.append("uavId", UavSn);
                formdata.append("startTime", startTime);
                formdata.append("endTime", endTime);
                const response = await this.$store.dispatch(
                    "uavs/queryFlightNumber",
                    formdata
                );
                const { code, message, data } = response;
                if (code === 1) {
                    return data; // 返回数据
                } else {
                    this.showMessage(message, "warning");
                }
            } catch (error) {
                this.showMessage(error, "error");
            } finally {
                this.leftloading = false;
            }
        },
        /**查询图片 */
        async queryPhotoInfo(id, uavSn = this.defaultUavSn) {
            this.centerloading = true;
            try {
                let formdata = new FormData();
                formdata.append("uavId", uavSn);
                formdata.append("eachsortieId", id);
                const response = await this.$store.dispatch(
                    "uavs/queryPhotoInfo",
                    formdata
                );
                const { code, message, data } = response;
                if (code === 1) {
                    this.photolist = data;
                    return data; // 返回数据
                } else {
                    this.showMessage(message, "warning");
                }
            } catch (error) {
                this.showMessage(error, "error");
            } finally {
                this.centerloading = false;
            }
        },
        /**查询洞信息 */
        async queryHoleInfo(id, uavSn = this.defaultUavSn) {
            this.rightloading = true;
            try {
                const formdata = new FormData(); // 查询架次图片
                formdata.append("uavId", uavSn);
                formdata.append("eachsortieId", id);
                formdata.append("photoId", null);

                const response = await this.$store.dispatch("uavs/queryHoleInfo", formdata);
                const { code, message, data } = response;

                if (code === 1) {
                    this.holelist = data;
                } else {
                    this.showMessage(message, "warning");
                }
            } catch (error) {
                this.showMessage(error, "error");
            } finally {
                this.rightloading = false;
            }
        },
        //#region 早期查询空斑播种记录信息（切换除去第一条数据）
        /**架次查询空板播种信息 */
        async queryHoleSeedingInfoByeachsortieId(id) {
            try {
                const formdata = new FormData(); // 查询架次图片
                formdata.append("eachsortieId", id);
                const response = await this.$store.dispatch("uavs/queryHoleSeedingInfoByeachsortieId", formdata);
                const { code, message, data } = response;
                if (code === 1) {

                } else {
                    this.showMessage(message, "warning");
                }
            } catch (error) {
                this.showMessage(error, "error");
            }
        },
        /**洞斑id查询播种信息 */
        async queryHoleSeedingInfo(id) {
            try {
                let formdata = new FormData(); // 查询架次图片
                formdata.append("uavId", this.defaultUavSn);
                formdata.append("eachsortieId", id);
                formdata.append("photoId", null);
                const response = await this.$store.dispatch("uavs/queryHoleSeedingInfo", formdata);
                if (code === 1) {
                    return data;
                } else {
                    this.showMessage(message, "warning");
                }
            } catch (error) { }
        },
        //#endregion 
        /**页面新增按钮--上传 */
        //#region ---------------------------------------------------------------上传补播路径任务弹窗---------------------------------------------------------------------------
        /**打开弹窗 */
        openTaskDialog() {
            // let missionTaskDialog = this.$refs.missionTaskDialog
            // if (missionTaskDialog) missionTaskDialog.outerVisible = true; 
            if (this.currentType) {
                this.uploadRouteTask(this.choosePointlist)
            } else {
                // 当前线 分段 [[item.onlng, item.onlat, item.onalt],[item.onlng, item.onlat, item.onalt]]
                const result = this.chooseLinelist.flatMap((item) => {
                    const arr = this.calculateEquinox(item.onlng, item.onlat, item.offlng, item.offlat, 2.5)
                    arr.forEach(element => {
                        element[2] = item.onalt
                    });
                    return arr;
                });
                console.log('result', result);

                this.openLineDialog()

            }
        },
        openLineDialog() {
            const lineDialog = document.getElementById('lineDialog');
            lineDialog.style.display = 'block';
        },
        //#endregion
        // #region ---------------------------------------------------------------  监听 -------------------------------------------------------
        /**化点 */
        calculateEquinox(onlng, onlat, offlng, offlat, spacing = 2) {
            console.log(onlng, onlat, offlng, offlat, spacing);

            var from = turf.point([onlng, onlat]);
            var to = turf.point([offlng, offlat]);
            var options = {
                units: 'kilometers'
            };
            var distance = turf.distance(from, to, options) * 1000;
            // console.log(`result两点距离 ${distance},间距 ${spacing}`);
            const segmentCount = distance / spacing;
            // console.log(segmentCount);
            if (segmentCount < 1) {
                return [
                    [onlng, onlat], // 起点  
                    [offlng, offlat] // 终点  
                ];
            }
            const plat = (offlat - onlat) / segmentCount;
            const plon = (offlng - onlng) / segmentCount;
            const points = [[onlat, onlng]]; // 起始坐标
            for (let i = 1; i < segmentCount; i++) {
                const lat = onlat + (plat * i);
                const lon = onlng + (plon * i);
                points.push([lat, lon]);
            }
            points.push([offlat, offlng]); // 最后一个点
            return points;

        },
        createSse() {
            let uid = 'likai'
            const self = this
            if (window.EventSource) {
                //创建sse /efapi/reseeding/
                this.eventSource = new EventSourcePolyfill(`sse/createSse?uid=${uid}`, {
                    headers: {
                        // 'X-Custom-Header': 'value'
                        'token': store.getters.token
                    }
                });

                this.eventSource.onopen = function (event) {
                    console.log('uidSSE链接成功', uid);

                }
                this.eventSource.onmessage = function (event) {
                    if (event.data) {
                        self.updatePointId(event.data)
                    }
                }
                this.eventSource.onerror = (error) => {
                    console.log('SSE链接失败');
                };
            } else {
                alert("你的浏览器不支持SSE");
            }
        },
        updatePointId(PointId) {
            // 使用 JSON.parse() 方法将字符串转换为 JSON 对象
            let jsonObj = JSON.parse(PointId);
            const wpIndex = jsonObj.id
            // pointlist  flyTimes
            const index = this.pointlist.findIndex((item) => {
                return item.id === wpIndex;
            });
            console.log('uid后端返回的数据:', jsonObj, wpIndex, index);
            if (index >= 0) {
                //   this.$set(item, "checked", val);
                this.pointlist[index].flyTimes = this.pointlist[index].flyTimes === null ? 1 : (this.pointlist[index].flyTimes + 1);
            }
        },
        async seedmsg() {
            let uid = 'likai'
            console.log('uid', uid);
            // var url = `http://192.168.10.5:8082/efapi/reseeding/sse/sendMsg?uid=${uid}`
            var url = `http://192.168.10.5:8082/efapi/reseeding/sse/updateid?id=88`
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var responseData = xhr.response; // 解析 JSON 数据
                }
            }
            xhr.ontimeout = function (e) {
                // XMLHttpRequest 超时。在此做某事。
                console.log('XMLHttpRequest 超时。在此做某事。', e);
            };
            xhr.open("GET", url, true);  //  xhr.open("GET", url, true);  
            // xhr.timeout = 1; // 超时时间，单位是毫秒
            // xhr.setRequestHeader("Content-Type", "image/jpeg");
            xhr.setRequestHeader("Content-Type", 'application/json;charset=utf-8');
            xhr.setRequestHeader("token", store.getters.token);
            xhr.responseType = 'json';
            // const dataStr = JSON.stringify(newdata)
            xhr.send()
        },
        /**上传至开源无人机  */
        async uploadRouteTask(points) {
            if (!points || points.length <= 0) { return false; }

            let url = 'uvas/uploadRouteTask';
            try {
                this.loadingText = '正在上传中'
                this.fullloading = true;
                const uavId = this.defaultUavSn;

                const params = { uavId: this.defaultUavSn }

                const payload = { params, that: this, url, data: points }
                const response = await this.$store.dispatch('uavs/uploadRouteTask', payload);
                const { data, message, code } = response;
                if (code === 1) {
                    this.showMessage(message, "success");
                    this.saveRouteData()
                } else {
                    this.showMessage(message, "warning");
                }
            } catch (error) {
                this.showMessage(error, "error");
            } finally {
                this.loadingText = '拼命加载中'
                this.fullloading = false;
            }
        },
        /**从无人机下载航线文件--发送解析-saveRouteData*/
        async downloadRouteTask() {
            try {
                this.loadingText = '请求下载中'
                this.fullloading = true;
                const formdata = new FormData();
                formdata.append('uavId', this.defaultUavSn);
                const response = await this.$store.dispatch('uavs/downloadRouteTask', formdata);
                const { data, message, code } = response;
                if (code === 1) {
                    // 后端解析航线数据获取对应的经纬度高即可 
                    this.respondRouteInfo(data)
                    this.showMessage("下载成功，请点击保存", "success");

                } else {
                    this.showMessage(message, "warning");
                }
            } catch (error) {
                this.showMessage(error, "error");
            } finally {
                this.fullloading = false;
                this.loadingText = '拼命加载中'
            }
        },
        /**上传航线值无人机---没有用 */
        async uploadMission(route) {
            try {
                const parms = {
                    uavId: this.defaultUavSn,
                    altType: 0,
                    takeoffAlt: route.unifiedHeight, //unifiedHeight
                    homeAlt: 30, // 如果不需要传递homeAlt，可以设置为null
                };
                const data = {
                    mission: route.positions,
                    formdata: parms,
                };
                await this.$store
                    .dispatch("uavs/uploadMission", data)
                    .then((response) => {
                        const { code, message, data } = response;
                        if (code === 1) {
                            this.showMessage(message, "success");
                        } else {
                            this.showMessage(message, "warning");
                        }
                    })
                    .catch((error) => {
                        this.showMessage(error, "error");
                    });
            } catch (error) {

            }
        },

        //#endregion 

        //#region -----------------------------------------------------------------处理弹窗----------------------------------------------------------------------

        openFileDialog() {
            //打开弹窗
            this.fileList = []
            const fileDialogEle = document.getElementById('fileDialog')
            fileDialogEle.style.display = 'block'
        },
        closeFileDialog(event) {
            let that = this;
            if (event.target.id === 'fileDialog') {
                console.log('关闭弹窗');
            }
            var close = document.getElementById('close-button');
            var div = document.getElementById('fileDialog');
            close.onclick = function close() {
                div.style.display = "none";
            }
            window.onclick = function close(e) {
                if (e.target == div) {
                    div.style.display = "none";
                }
            }
        },

        /**页面点击处理按钮--打开处理弹窗 */
        clickHandle() {
            //打开弹窗
            const handleDialogEle = document.getElementById('handleDialog')
            handleDialogEle.style.display = 'block'
        },
        /**关闭弹窗 */
        closeHandleDialog(event) {
            let that = this;
            if (event.target.id === 'handleDialog') {
                console.log('关闭弹窗');
            }
            var close = document.getElementById('close-button');
            var div = document.getElementById('handleDialog');
            close.onclick = function close() {
                div.style.display = "none";
            }
            window.onclick = function close(e) {
                if (e.target == div) {
                    div.style.display = "none";
                }
            }
        },
        /**取消确认-关闭弹窗 */
        canlceHandle() {
            this.handleInfo = {};
            const div = document.getElementById('handleDialog');
            div.style.display = 'none';
        },
        /**弹窗确定提交 */
        async handleSubmit() {
            let url = 'uavs/confirmHandle';
            try {

                var center = [116.439049, 39.89823];
                var radius = 1;
                var options = { steps: 4, units: 'kilometers', properties: { foo: 'bar' } };
                var circle = turf.circle(center, radius, options);
                console.log('circle', circle);
                const handleDate = (new Date()).getTime(); // 439c-1711335601702-53646
                const handleUuid = '8b89-1718621646897-66274' //this.generateId(handleDate);
                const formdata = {
                    latitude: Number(this.handleInfo.latitude),
                    longitude: Number(this.handleInfo.longitude),
                    height: Number(this.handleInfo.height),
                    uavheight: Number(this.handleInfo.uavheight),
                    uavId: this.defaultUavSn,
                    handleDate,
                    handleUuid,
                };
                const payload = { formdata, url, that: this };
                const response = await this.$store.dispatch('uavs/confirmHandle', payload);
                const { code, message, data } = response;
                if (code === 1) {
                    this.showMessage(message, "success");
                    // this.handleList.unshift(data);
                    // 在数组头部插入新数据

                    this.$store.dispatch("ws/setProcessList", { handleUuid, date: handleDate })
                } else {
                    this.showMessage(message, "warning");
                }

            } catch (error) {
                this.showMessage(error, "error");
            } finally {
                this.canlceHandle()
            }

        },
        /** */
        plus() {
            this.isshow = !this.isshow
        },
        /**处理旁上传 */
        uploadProcess() {
            let processDialog = this.$refs.processDialog
            if (processDialog) {
                processDialog.dialogTableVisible = true
            }
        },
        generateId(HandleDate) {
            return (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + HandleDate + '-' + Math.random().toString().substr(2, 5);
        },
        //#endregion

        // #region ---------------------------------------------------------------- 上传 ----------------------------------------------------------------------
        handleRemove(file, fileList) {
            this.fileList = []
        },
        handlePreview(file) {
            console.log(file, 'file');
        },
        changeFile(file, fileList) {
            this.fileList = [];
            let fileName = file.name;
            let size = file.size;
            fileName = fileName.substring(fileName.lastIndexOf('.'))
            console.log('fileName', fileName);

            const isKmz = fileName === '.zip'; // ||'.kml'
            const isLt2M = file.size / 1024 / 1024 < 50;
            if (!isKmz) {
                this.showToast('上传航线文件只能是 zip 格式!');
            }
            if (!isLt2M) {
                this.showToast('上传航线文件不能超过 50MB!');
            }
            if (isKmz && isLt2M) {
                this.fileList.push(file);
            }
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`);
        },
        fileSubmit() {
            this.btnloading = true
            console.log('fileSubmit', this.fileList[0]);
            const file = this.fileList[0] || null;
            const handleDate = (new Date()).getTime(); // 439c-1711335601702-53646
            const handleUuid = this.generateId(handleDate);
            let formData = new FormData()
            formData.append('handleUuid', handleUuid) // 额外参数
            formData.append('file', file.raw)
            formData.append('handleDate', handleDate)

            this.$store.dispatch('uavs/uploadFile', formData).then(res => {
                //   console.log('res', res);
                this.fileList = [];
                //   this.showMessage('上传成功', 'success')
            }).catch(err => {
                this.showMessage(err, 'error')
            }).finally(() => {
                this.btnloading = false
            })

        },
        // #endregion
        //#region ----------------------------------------------------------------------切换----------------------------------------------------------------------------------
        /**查询点1与线0 切换*/
        switchType(type) {
            if (type) {
                this.selectAllLine(false); //切换到点 取消线全选
            } else {
                this.selectAllPoint(false); //切换到线 取消点全选
            }
        },
        /**飞行次数切换 */
        switchFlyTime(e) {
            if (this.currentType) {
                this.selectAllPoint(false); //取消全选
            } else {
                this.selectAllLine(false); //取消全选 
            }
            this.queryPointList(this.currentHandleId) //查询当前处理列表
            this.queryLineList(this.currentHandleId)  //查询当前处理列表
        },

        /**点全选设置 */
        selectAllPoint(val) {
            this.pointlist.forEach((item) => {
                this.$set(item, "checked", val);
            });
            if (val) {
                this.choosePointlist = [... this.pointlist]
            } else {
                this.choosePointlist = []
                this.checkAll = false
            }
        },
        /**线全选设置 */
        selectAllLine(val) {
            this.lineList.forEach((item) => {
                this.$set(item, "checked", val);
            });
            if (val) {
                this.chooseLinelist = [... this.lineList]
            } else {
                this.chooseLinelist.length = 0
            }
        },


        /**选择补播路径点*/
        pointchangeChecked(object) {

            if (object.checked) {
                this.choosePointlist.push({ ...object });
            } else {
                // 从 choosePointlist 对象数组 中删除 object 
                const index = this.choosePointlist.findIndex(item => item.id === object.id);
                if (index !== -1) {
                    this.choosePointlist.splice(index, 1);
                    this.pointlist.forEach((item) => {
                        if (object.id == item.id) {
                            this.$set(item, "checked", false);
                        }
                    });
                }
                // this.choosePointlist.splice(this.choosePointlist.indexOf({ ...object,checked:true}), 1); 

            }
            this.checkAll = this.choosePointlist.length === this.pointlist.length;
            this.isIndeterminate = this.choosePointlist.length > 0 && this.choosePointlist.length < this.pointlist.length;
        },
        /**选择补播路径线*/
        linechangeChecked(object) {
            if (object.checked) {
                this.chooseLinelist.push({ ...object });
            } else {
                const index = this.chooseLinelist.findIndex(item => item.id === object.id);
                if (index !== -1) {
                    this.chooseLinelist.splice(index, 1);
                    this.lineList.forEach((item) => {
                        if (object.id == item.id) {
                            this.$set(item, "checked", false);
                        }
                    });
                }
            }
            this.checkAll = this.chooseLinelist.length === this.lineList.length;
            this.isIndeterminate = this.chooseLinelist.length > 0 && this.chooseLinelist.length < this.lineList.length;
        },
        /**空洞选择 */
        // holechangeChecked(val, event) {
        //     const photo1List = this.holelist.filter(
        //         (item) => item.photoId === val.photoId
        //     );
        //     const findIndex = this.holelist.findIndex(
        //         (checkedItem) => val.id == checkedItem.id
        //     );

        //     if (findIndex >= 0) {
        //         this.$set(this.holelist[findIndex], "checked", event);
        //     }
        //     const isAllChecked = photo1List.every((item) => item.checked);

        //     if (isAllChecked) {
        //         this.photolist.forEach((item) => {
        //             if (val.photoId == item.id) {
        //                 this.$set(item, "checked", event);
        //             }
        //         });
        //     } else {
        //         this.photolist.forEach((item) => {
        //             if (val.photoId == item.id) {
        //                 this.$set(item, "checked", false);
        //             }
        //         });
        //     }
        //     if (event) {
        //         this.checkedPoint.push(this.holelist[findIndex]);
        //     } else {
        //         const removeIndex = this.checkedPoint.findIndex(
        //             (item) => item.id === val.id
        //         );
        //         if (removeIndex >= 0) {
        //             this.checkedPoint.splice(removeIndex, 1);
        //         }
        //     }
        // },
        changeScrolling(id) {
            let classid = ".photoId-" + id;
            let tablecardElement = document.querySelectorAll('.table-card')
            console.log(tablecardElement);
            const offsetHeight = tablecardElement[0].offsetTop
            console.log(offsetHeight);
            let element = document.querySelectorAll(classid);
            element[0].scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        },

        //#endregion



        //#region ----------------------------------------------------------------------拖拽api----------------------------------------------------------------------
        // 监听拖拽
        change(event) {
            console.log("change", event);
        },
        // 开始拖拽
        start(event) {
            console.log("start", event);
        },
        // 结束拖拽
        end(event) {
            console.log("end", event);
            // event.item  拖拽的本身
            // event.to      拖拽的目标列表
            // event.from    拖拽之前的列表
            // event.oldIndex    拖拽前的位置
            // event.newIndex    拖拽后的位置
        },
        //#endregion

        //#region  ----------------------------------------------------------------------其他---------------------------------------------------------------------
        /**转时间 */
        convertToFormattedDate(timestamp) {
            const date = new Date(timestamp);
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // Months are zero-based, so add 1
            const dateOfMonth = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();

            return `${year}-${month}-${dateOfMonth} ${hours}:${minutes}:${seconds}`;
        },
        showToast(msg) {
            this.$layer.msg(msg);
        },
        showMessage(msg, type) {
            this.$message({
                message: msg,
                type: type,
            });
        },
        add0(m) {
            return m < 10 ? "0" + m : m;
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
            return (
                y +
                "年" +
                this.add0(m) +
                "月" +
                this.add0(d) +
                " " +
                this.add0(h) +
                ":" +
                this.add0(mm) +
                ":" +
                this.add0(s)
            );
        },
        shuntime(time) {
            return this.$dateUtil.convertSecondToTime(time);
        },
        filtersType(val) {
            return filtersType(val);
        },
        parseTime(date) {

            return parseTime(date);
        },
        //#endregion


        //#region  windows测试
        //打开新窗口 this.windows={}
        openpage(item) {
            console.log(this.$router.options.routes)
            // window.open("/#/newpage", "_blank"); // 设定窗口名称
            const windowName = "newWindow-" + item.id;
            const existingWindow = window.open("", windowName);
            existingWindow.location.href = "#/newpage?ip=" + item.id;
            existingWindow.focus();
            // 将窗口对象引用存储到对象中
            this.windows[windowName] = existingWindow;
        },
        // 这个方法为发送信息
        psendC(item) {
            // 假设 existingWindow 是在 openpage 方法中存储的新窗口对象引用
            const windowName = "newWindow-" + item.id;
            // const existingWindow = window.open("", windowName);
            const existingWindow = this.windows[windowName];
            if (existingWindow) {
                if (existingWindow.closed) {
                    // 移除掉  this.windows[windowName]
                    console.log("移除掉  this.windows[windowName]");
                    delete this.windows[windowName];
                    return;
                }
                const messageObject = {
                    name: "John",
                    age: 25,
                };
                const messageString = JSON.stringify(messageObject);
                const message = "Hello from psendC method!" + windowName;
                console.log(message);
                existingWindow.postMessage(messageObject, window.location.origin);
            } else {
                // 窗口可能被浏览器拦截或未成功打开
                console.error(
                    "Failed to send message: window was not opened or was blocked by the browser"
                );
            }
        },
        otherpage() {
            const windowName = "newWindow"
            const existingWindow = window.open("", windowName)
            existingWindow.location.href = "#/so"
            existingWindow.focus();
        },
        getMsg(e) {
            let event = e
            console.log(event);

        },
        startwebWorker() {
            // var webWorker = new Worker()
            //  // 监听 Web Worker 发送的消息
            // webWorker.onmessage = (event) => {
            //     console.log(event);
            //     //   this.result = event.data;

            //     // 关闭 Web Worker 线程
            //     webWorker.terminate();
            //     webWorker = null;
            // };
            // // 向 Web Worker 发送消息
            // webWorker.postMessage('some data');
        },
        //#endregion

        //#region -------------------------------------------------------------- 查询无人机--点击切换下拉菜单-----------------------------------------------------
        /**查询所有无人机 */
        async queryAllUavs() {
            try {
                await this.$store.dispatch("uavs/getUavs").then(response => {
                    const {
                        code,
                        message,
                        data
                    } = response;
                    if (code === 1) {
                        this.uavs = data
                        if (!data || data.length <= 0) {
                            return false;
                        }
                        // 检查LocalStorage中的"defaultUav"值
                        let key = "defaultUav-" + this.userId;
                        var checkUav = localStorage.getItem(key);
                        if (!checkUav) {
                            localStorage.setItem(key, data[0].uavId)
                        } else {
                            let localStorageUav = localStorage.getItem(key) //获取浏览器存储的是否还在数据库表内
                            if (!data.some(item => (item.uavId === localStorageUav))) {
                                localStorage.setItem(key, data[0].uavId)
                            }
                        }
                        const info = localStorage.getItem(key)
                        this.defaultUavSn = localStorage.getItem(key)
                    }
                }).catch((error) => {
                    this.showMessage(error, "error");
                });
            } catch (error) {

            }
        },
        selectUav() {
            if (this.uavs.length > 0) {
                const isVisable = this.$refs.selectRef.visible
                this.$nextTick(() => {
                    // console.log(this.$refs.selectRef);

                    this.$refs.selectRef.visible = !isVisable;
                    // this.$refs.selectRef.toggleMenu();
                })
            }
        },
        /** 切换无人机-- 架次信息查询,洞斑，图片 */
        selectTrigger(val) {
            let key = "defaultUav-" + this.userId;
            localStorage.setItem(key, val)
        }
        //#endregion

    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        let key = "defaultUav-" + this.userId;
        this.defaultUavSn = localStorage.getItem(key)
        this.queryNewInfo()
        this.queryAllUavs();
        this.createSse() // 看不
    },
    beforeCreate() { }, //生命周期 - 创建之前
    beforeMount() { }, //生命周期 - 挂载之前
    beforeUpdate() { }, //生命周期 - 更新之前
    updated() { }, //生命周期 - 更新之后
    beforeDestroy() {
        //移除
        //    window.removeEventListener("message", (e) => this.getMsg(e));
    }, //生命周期 - 销毁之前
    destroyed() { }, //生命周期 - 销毁完成
    activated() { }, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>

<style lang="scss" scoped>
//@import url(); 引入公共css类</style>
<style lang="scss" src="./planningManager.scss" scoped>