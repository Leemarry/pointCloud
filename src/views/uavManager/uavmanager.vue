<!--
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2023-11-21 11:28:38
 * @LastEditors: likai 2806699104@qq.com
 * @LastEditTime: 2024-07-12 20:11:44
-->
<!-- 无人机监控管理 -->
<template>
    <el-container style="width: 100%;height: 100%;">
        <aside class="PointManagerAside-components">
            <div class="CesiumMap-out-div">
                <!-- <keep-alive include="AnalyzeTable,VideoPlayer" exclude="OpenLayersMap">
                    <component :is="currentComponent"  :pvDateInfo="pvDateInfo" :pvDateInfoLoading="pvDateInfoLoading" :readerKmzList="readerKmzList" :centerPosition="centerPosition"></component>
                </keep-alive> -->
                <CesiumMap ref="CesiumMap" v-if="isMap" :visible='false' :defaultUavSn="defaultUavSn" class="CesiumMap"></CesiumMap>
                <div class="imageViewer" v-else>
                    <img :src="`data:image/png;base64,${img}`" alt="加载失败" style="width:100%;height:100%">
                </div>
                <div class="block_list">
                    <details open>
                        <summary>所有地块总计</summary>
                        <!-- handleInfo -->
                        <div @click="switchWorkBlock(handleInfo,true)" class="tab-content">
                            <!-- <p>空斑面积：157.2㎡</p> -->
                            <p>{{ `空斑面积：${handleInfo.gapSquare} ㎡` }}</p>
                            <p>{{ `补播区域数量：${handleInfo.reseedAreaNum}` }}</p>
                            <p>{{`所需草种数量：${handleInfo.seedNum}`}}</p>

                        </div>
                    </details>
                    <details v-for="(block, index) of blockList" :key="index">
                        <summary>工作地块{{ `block` }}：{{index}}</summary>
                        <div @click="switchWorkBlock(block,false)" class="tab-content">
                            <p>{{`空斑面积：${block.gapSquare}㎡`}}</p>
                            <p>{{`补播区域数量：${block.reseedAreaNum}`}}</p>
                            <p>{{`所需草种数量：${block.seedNum}`}}</p>
                            <p>{{`中心经度：${block.centreLongitude}`}}</p>
                            <p>{{`中心纬度：${block.centreLatitude}`}}</p>
                        </div>
                    </details>
                </div>
            </div>
            <div class="uavInfo">
                <el-row :gutter="10" class="uavInfo-el-row">
                    <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="10">
                        <el-card hadow="always" class="uavParm">
                            <div class="uav">
                                <div class="uavParmMain">
                                    <div class="uavParmMainLeft">
                                        <svg-icon icon-class="parm_mode" style="fill:black" />
                                    </div>
                                    <div class="uavParmMainMiddle">
                                        <div>
                                            <span>{{defaultUavHeartbeat && defaultUavHeartbeat.uavId ? defaultUavHeartbeat.uavId:defaultUavSn}}</span>
                                            <span style="color:rgb(187, 187, 187);font-size: 10px"></span>
                                        </div>
                                        <div class="parmName" @click="openHeart">无人机</div>
                                    </div>
                                </div>
                                <div class="uavParmMain">
                                    <div class="uavParmMainLeft">
                                        <svg-icon icon-class="parm_mode" style="fill:black" />
                                    </div>
                                    <div class="uavParmMainMiddle">
                                        <div>
                                            <span>{{defaultUavHeartbeat && defaultUavHeartbeat.altabs ? defaultUavHeartbeat.altabs: '暂无信息'}}</span>
                                            <span style="color:rgb(187, 187, 187);font-size: 10px">{{'米'}}</span>
                                        </div>
                                        <div class="parmName">海拔</div>
                                    </div>
                                </div>
                                <div class="uavParmMain">
                                    <div class="uavParmMainLeft">
                                        <svg-icon icon-class="parm_mode" style="fill:black" />
                                    </div>
                                    <div class="uavParmMainMiddle">
                                        <div>
                                            <span>{{defaultUavHeartbeat && defaultUavHeartbeat.lng ?processedNumber(defaultUavHeartbeat.lng) :'暂无信息'}}</span>
                                            <span style="color:rgb(187, 187, 187);font-size: 10px">{{"°"}}</span>
                                        </div>
                                        <div class="parmName">{{'经度'}}</div>
                                    </div>
                                </div>
                                <div class="uavParmMain">
                                    <div class="uavParmMainLeft">
                                        <svg-icon icon-class="parm_mode" style="fill:black" />
                                    </div>
                                    <div class="uavParmMainMiddle">
                                        <div>
                                            <span>{{defaultUavHeartbeat && defaultUavHeartbeat.lat ? processedNumber(defaultUavHeartbeat.lat) :'暂无信息'}}</span>
                                            <span style="color:rgb(187, 187, 187);font-size: 10px">{{'°'}}</span>
                                        </div>
                                        <div class="parmName">{{'纬度'}}</div>
                                    </div>
                                </div>
                            </div>

                        </el-card>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="14" :xl="14">
                        <el-card hadow="always" class="pointlist">
                            <div class="pointlist-inside" v-if="geoCoordinates.length>0">
                                <div class="point-total-curee">
                                    <div>{{`总点数:${geoCoordinates.length}`}}</div>
                                    <div>{{`当前:${currentWorkPoint.pointId==null?'起飞点' : '点P'+currentWorkPoint.pointId}`}}</div>
                                </div>
                                <div class="scrollbar">
                                    <el-scrollbar style="width:98%;height: 200px;max-height:100%; color: #606266;;" wrap-style="overflow-x:hidden;flex:1">
                                        <el-row class="elrow" :gutter="10">
                                            <el-col class="elcol" :md="24" :lg="24" :xl="12" v-for="(item, index) in geoCoordinates" :key="index">
                                                <div :ref="'point'+index" :id="'point'+index">点P{{index}}</div>
                                                <div><span>纬度:</span><span>{{processedNumber( item[1])}}</span></div>
                                                <div><span>经度:</span><span>{{processedNumber(item[0]) }}</span></div>
                                            </el-col>
                                        </el-row>
                                    </el-scrollbar>
                                </div>
                            </div>

                            <el-empty v-else :image-size="120" description="暂无数据"></el-empty>
                        </el-card>
                    </el-col>
                </el-row>

            </div>
        </aside>
        <el-main class="main" style="background-color: rgb(238, 241, 246);">
            <!-- 视频口 -->
            <div class="main-right">
                <video-player class="video-player"></video-player>
                <!-- 定位 -->
                <!-- <div id="location">
                    <div id="locationinfo" v-for="(item,index) in 2" :key="index">
                        <span class="info">风速</span>
                        <span class="value"> 3m/s</span>
                    </div>
                </div> -->
            </div>
            <div class="main-bottom">
                <!-- 控制台 -->
                <div class="droneControl">

                    <div class="text textBox" @click="sendinitWebSocket()"><span>p1</span><span>投放</span><span class="redcolor">4</span><span>粒，目前已投放</span><span class="redcolor">0</span>粒<span></span></div>
                    <!-- 无人机控件 -->
                    <uavControl :uavControlBtn='uavControlBtn' :defaultUavSn='defaultUavSn' @sendthrowObject="throwObject" @sendmoveUav="moveUav" @sengcamerasetting="camerasetting" @sendcontrolTosendCommand="controlTosendCommand" @sendexecuteTakeoff="executeTakeoff" @sendnextwork="nextwork" @sendflyToHere='flyToHere' @sendfinishwork="finishwork" @sendstartwork="startwork" @senddocommand="doCommand"></uavControl>
                </div>
                <div class="loading">
                    <waterLevel class="waterLevelEChars-out" :loadingInfo="loadingInfo"></waterLevel>
                    <!-- <div class="image"><img src="../../assets/images/mount.png" alt=""></div>
                    <div style="    text-align: center; font-size: 18px;">
                        <div>挂载数量：</div>
                        <div style="color:red;">333/300</div>
                    </div> -->
                </div>
            </div>

        </el-main>
        <!-- 相机设置 -->
        <el-dialog title="相机" :visible.sync="isDialogCameraSetting" width="600px">
            <div>
                <el-row style="margin-top:10px;text-align:center" type="flex" align="middle" :gutter="20">
                    <el-col :span="6" align="left">
                        相机模式
                    </el-col>
                    <el-col :span="17" align="right">
                        <el-button-group>
                            <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1165, 0, 0, 0, 0)">拍照</el-button>
                            <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1165, 1, 0, 0, 0)">录像</el-button>
                            <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1165, 2, 0, 0, 0)">回放</el-button>
                            <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1165, 3, 0, 0, 0)">媒体下载</el-button>
                            <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1165, 4, 0, 0, 0)">广播</el-button>
                        </el-button-group>
                    </el-col>
                </el-row>
                <el-row style="margin-top:10px;text-align:center" type="flex" align="middle" :gutter="20">
                    <el-col :span="6" align="left">
                        拍照
                    </el-col>
                    <el-col :span="17" align="right">
                        <el-button-group>
                            <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1166, 0, 0, 0, 0)">单拍</el-button>
                            <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1166, 2, 0, 0, 0)">连拍</el-button>
                            <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1166, 1, 0, 0, 0)">HDR</el-button>
                            <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1166, 4, 0, 0, 0)">间隔拍照</el-button>
                            <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1166, 5, 0, 0, 0)">定时拍照</el-button>
                            <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1166, 6, 0, 0, 0)">全景</el-button>
                        </el-button-group>
                    </el-col>
                </el-row>
                <el-row style="margin-top:10px;text-align:center" type="flex" align="middle" :gutter="20">
                    <el-col :span="6" align="left">
                        镜头切换
                    </el-col>
                    <el-col :span="17" align="right">
                        <el-button-group>
                            <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1159, 0, 0, 0, 0)">刷新视频</el-button>
                            <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1167, 0, 0, 0, 0)">默认</el-button>
                            <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1167, 1, 0, 0, 0)">广角镜头</el-button>
                            <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1167, 2, 0, 0, 0)">变焦镜头</el-button>
                            <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1167, 3, 0, 0, 0)">红外镜头</el-button>
                        </el-button-group>
                    </el-col>
                </el-row>
                <el-row style="margin-top:10px;text-align:center" type="flex" align="middle" :gutter="20">
                    <el-col :span="6" align="left">
                        媒体管理
                    </el-col>
                    <el-col :span="17" align="right">
                        <el-button-group>
                            <el-button type="danger" round size="mini" @click="isDialogCameraSetting=false;doCommand(1175, 0, 0, 0, 0)">格式化SD卡</el-button>
                            <el-button type="danger" round size="mini" @click="isDialogCameraSetting=false;doCommand(1176, 0, 0, 0, 0)">格式化SSD</el-button>
                            <el-button type="danger" round size="mini" @click="isDialogCameraSetting=false;doCommand(1177, 0, 0, 0, 0)">格式化储存</el-button>
                        </el-button-group>
                    </el-col>
                </el-row>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { mapGetters } from 'vuex'
import store from '@/store';
import CesiumMap from "../components/Cesium/CesiumMap.vue";
import videoPlayer from "../components/videoPlayer.vue";
import uavControl from "./uavControl.vue";
import parmItem from "../components/parmItem.vue";
import { moveDiv } from "./../core/utils";
import waterLevel from "../components/ECharts/waterLevelECharts.vue";
import $ from "jquery";
import axios from 'axios';
export default {
    name: "",
    //import引入的组件需要注入到对象中才能使用
    components: {
        CesiumMap,
        videoPlayer,
        uavControl,
        parmItem,
        waterLevel,
    },
    data() {
        //这里存放数据
        return {
            img: '',
            isMap: true,
            items: ['Apple', 'Banana', 'Orange', 'Grape'],
            handleInfo: {},
            blockList: [],
            pointlist: [],
            /**相机设置 */
            isDialogCameraSetting: false,
            loadingInfo: {},
            hives: [],
            uavs: [],
            /**默认无人机 */
            defaultUavSn: "",
            timerSendPanData: null,
            webSocket: null,
            /** // 定时重新连接Ws */
            timeoutReConnectWs: null,
            uavHeartbeatNow: {
                alt: 0,
                areMotorsOn: 0,
                aremd: 0,
                batteryValue: 0,
                dataDate: 0,
                flightModeText: "-",
                linkAirUpload: 0,
                linkAirDownload: 0,
                batteryPert: 0,
                gpsStatusText: "-",
                satecount: 0,
                altabs: 0,
                lng: 0,
                lat: 0,
                xySpeed: 0,
                zSpeed: 0,
                roll: 0,
                pitch: 0,
                yaw: 0,
                flightTimeInSeconds: 0,
            },
            hiveHeartbeatNow: {},
            key_div_uav_parm: 0,
            key_div_gps_parm: 1,
            uavControlBtn: {},
            isRemoteEnable: false,
            timerSendRemoteData: null,

            uavParm: [
                {
                    parm1: "无人机",
                    parm2: "1024",
                    unit: null,
                },
                {
                    parm1: "海拔",
                    parm2: "1024",
                    unit: "米",
                },
                {
                    parm1: "经度",
                    parm2: "102.024",
                    unit: "°",
                },
                {
                    parm1: "纬度",
                    parm2: "24.0125",
                    unit: "°",
                },
            ],
        };
    },
    //让组件接收外部传来的数据
    props: {
        /**组件无人机控件 */
        // uavControlBtn:{
        //     type:Object,
        //     default:function(){
        //         return {}
        //     }
        // }
    },
    //监听属性 类似于data概念
    computed: {
        ...mapGetters([
            'minke',
            'userId',
            'name',
            'userInfo',
            'currentMid',
            'currentMidUnifiedHeight',
            'geoCoordinates',
            'currentWorkPoint',
            'webSocketMsg',
            'webSocketData',
            'messageId',
            'defaultUavHeartbeat',
        ])
    },
    //监控data中的数据变化
    watch: {
        'defaultUavHeartbeat': {
            deep: true,
            immediate: true,//立即执行
            handler(newVal, oldVal) {
                /**CesiumMap */
                let CesiumMap = this.$refs.CesiumMap;
                if (CesiumMap) {
                    if (oldVal !== undefined && Object.keys(oldVal).length > 0 && oldVal.uavId == this.defaultUavSn && oldVal.lat !== 0 && oldVal.lng !== 0) {
                        console.log('显示模型');
                        CesiumMap.GetHeartbeatNows(oldVal);
                    } else {
                        CesiumMap.GetHeartbeatNowToremoveModel(oldVal);

                    }
                }
            }
        },
    },
    //方法集合
    methods: {
        async sendinitWebSocket() {
            await this.$store.dispatch("websocket/webSocketInit");
        },
        //#region 
        op() {
            const params = {
                key: 'STZM3wOV_mjH8QsjJ',
                location: '上海',
                language: 'zh-Hans',
                unit: 'c'
            }

            this.$store.dispatch(
                "uavs/queryWeather",
                params).then(response => {

                });
            //             var url = "https://api.seniverse.com/v3/weather/now.json?key=STZM3wOV_mjH8QsjJ&location=上海&language=zh-Hans&unit=c"

            // fetch(url)
            //   .then(response => response.json())
            //   .then(data => console.log(data)) // 在控制台中打印响应数据
            //   .catch(error => console.log(error));

            // axios.get('https://api.seniverse.com/v3/weather/now.json', {
            //             params: {
            //               key: 'STZM3wOV_mjH8QsjJ',
            //               location: '上海',
            //               language: 'zh-Hans',
            //               unit: 'c'
            //             }
            //           })
            //           .then(response => {
            //             console.log(response.data); // 处理响应数据
            //           })
            //           .catch(error => {
            //             console.error(error);
            //           });

        },

        //#endregion
        //#region ----------------------------------------------------------- 交互 -----------------------------------------------------------
        /**工作地块 切换 */
        switchWorkBlock(data, isMap) {
            console.log("工作地块 切换", data);
            if (isMap) {
                this.isMap = true; //
                this.$nextTick(() => {
                    let CesiumMap = this.$refs.CesiumMap;
                    // imgLevel
                    if (CesiumMap && data.imgLevel) {
                        // lat lng
                        CesiumMap.addImageryBaseLayer(data.imgLevel, data.lng, data.lat);
                    } else {
                        console.log('地图layers加载不上');
                    }
                });

            } else {
                this.isMap = false; //
                this.img = data.img
            }
        },

        //#endregion
        // #region --------------------------------------------------------- 云控件 ---------------------------------------------------------
        /**
        * @name: 
        * @msg: 起飞 起飞无人机指令
        * @param {*} command 起飞指令 1100
        * @return {*}
        */
        async executeTakeoff(command = 1100) {
            try {
                const RequestBody = {
                    hiveId: "",
                    timeout: 10,
                    command: command, // 1003一键起飞未实现  1004 //  1007
                    tag: 2,
                    uavId: this.defaultUavSn,
                    parm1: 0,
                    parm2: 0,
                    parm3: 0,
                    parm4: 0,
                };
                await this.$store
                    .dispatch("uavs/takeoff", RequestBody)
                    .then((response) => {
                        const {
                            code,
                            message,
                            data
                        } = response;
                        if (code === 1) {
                            this.showMessage(message + "执行", "success");
                        } else {
                            this.showMessage(message, "warning");
                        }
                    })
                    .catch((error) => {
                        this.showMessage(error, "error");
                    });
            } catch (error) {
                this.showMessage(error, "error");
            }
        },
        /**
         * @name: 
         *  @msg: 返航 1102 无人机为相应
         * @param {*} command
         * @return {*}
          */
        async rtl(command = 1102) {
            try {
                const RequestBody = {
                    hiveId: "",
                    timeout: 10,
                    command: command, // 1003一键起飞未实现  1004 //  1007
                    tag: 2,
                    uavId: this.defaultUavSn,
                    parm1: 0,
                    parm2: 0,
                    parm3: 0,
                    parm4: 0,
                };
                await this.$store
                    .dispatch("uavs/rtl", RequestBody)
                    .then((response) => {
                        const {
                            code,
                            message,
                            data
                        } = response;
                        if (code === 1) {
                            this.showMessage(message + "执行", "success");
                            // this.isflymove = true;
                            // this.$parent.$parent.switchVideoNo(this.isflymove);
                        } else {
                            this.showMessage(message, "warning");
                        }
                    })
                    .catch((error) => {
                        this.showMessage(error, "error");
                    });
            } catch (error) {
                this.showMessage(error, "error");
            }
        },
        /**飞往某个航点 */
        async guidToHere(nextLongitude = this.defaultUavHeartbeat.lat, nextLatitude = this.defaultUavHeartbeat.lng, nextAltitude = Number(this.defaultUavHeartbeat.alt / 100)) {
            try {
                let formdata = new FormData();
                formdata.append("uavId", this.defaultUavSn);
                formdata.append("lat", nextLatitude);
                formdata.append("lng", nextLongitude);
                formdata.append("alt", nextAltitude);
                await this.$store
                    .dispatch("uavs/guidToHere", formdata)
                    .then((response) => {
                        const { code, message, data } = response;
                        if (code === 1) {
                            this.showMessage('执行成功', 'success')
                        } else {
                            this.showMessage(message, "warning");
                        }
                    })
                    .catch((error) => {
                        console.error('控制台打印catch=>eror', error)
                        this.showMessage(error, "error");
                    });
            } catch (error) {
                console.error('控制台打印eror', error)
            }
        },


        /**下一作业 */
        async nextwork() {
            this.changeuavControlBtn(true);
            if (this.currentWorkPoint && this.currentWorkPoint.pointId == null) {
                console.log('获取航点第一个');
                /**获取航点第一个*/
                if (this.geoCoordinates.length > 0 && this.defaultUavHeartbeat && Object.keys(this.defaultUavHeartbeat).length > 0) {

                    const [longitude, latitude, altitude] = this.geoCoordinates[0];

                    const WorkPointPositions = [longitude, latitude, altitude]; // 
                    // console.log("WorkPointPositions", WorkPointPositions);
                    this.guidToHere(longitude, latitude, altitude)
                    this.updateCurrentWorkPoint(0, WorkPointPositions);
                    // 'point'+index 滚动
                    let scrollIntoPointId = 'point' + 0
                    this.scrollIntoView(scrollIntoPointId)
                }
            } else {
                /** 增加 */
                const currentWorkPointId = this.currentWorkPoint.pointId;
                if (currentWorkPointId + 1 < this.geoCoordinates.length && this.defaultUavHeartbeat && Object.keys(this.defaultUavHeartbeat).length > 0) {
                    const [nextLongitude, nextLatitude] = this.geoCoordinates[currentWorkPointId + 1];
                    let nextAltitude = this.defaultUavHeartbeat.alt;
                    if (nextAltitude < 10) {
                        nextAltitude = this.geoCoordinates[currentWorkPointId + 1][2];
                    }
                    const nextWorkPointPositions = [nextLongitude, nextLatitude, nextAltitude];


                    this.guidToHere(nextLongitude, nextLatitude, nextAltitude)
                    this.updateCurrentWorkPoint(currentWorkPointId + 1, nextWorkPointPositions);
                    // 'point'+index 滚动
                    let scrollIntoPointId = 'point' + (currentWorkPointId + 1)
                    this.scrollIntoView(scrollIntoPointId)
                } else {
                    // this.updateCurrentWorkPoint(currentWorkPointId + 1, nextWorkPointPositions);
                    this.showToast('当前已最后一个')
                }
            }
            setTimeout(() => {
                this.changeuavControlBtn(false);
            }, 1500);
        },
        flyToHere(data){
            let { lng, lat, alt } = data
            // 小数点处理 保证小数点后7位
            lng = Number(lng).toFixed(7)
            lat = Number(lat).toFixed(7)
            alt = Number(alt).toFixed(2)
            console.log('flyToHere', lng, lat, alt);
            this.guidToHere( lng, lat, alt )
        },
        /**store记录当前点 */
        updateCurrentWorkPoint(pointId, positions) {
            this.$store.dispatch("routeData/setcurrentWorkPoint", { pointId, positions });
        },
        /**作业完毕 */
        async finishwork() {
            this.changeuavControlBtn(true);
            this.rtl()
            // 作业完毕返航：=> 移除sore 记录当前点
            this.updateCurrentWorkPoint('前往返航点', null);
            setTimeout(() => {
                this.changeuavControlBtn(false);
            }, 1500);
        },
        /**执行f5投放 */
        async throwObject() {
            try {
                let formdata = new FormData();
                formdata.append("uavId", this.defaultUavSn);
                formdata.append("count", 4); // 投放Id
                formdata.append("duration", 1);  //投放时间
                await this.$store
                    .dispatch("uavs/throwObject", formdata)
                    .then((response) => {
                        const { code, message, data } = response;
                        if (code === 1) {
                            this.showMessage('执行成功', 'success')
                        } else {
                            this.showMessage(message, "warning");
                        }
                    })
                    .catch((error) => {
                        console.error('控制台打印catch=>eror', error)
                        this.showMessage(error, "error");
                    });
            } catch (error) {
                console.error('控制台打印eror', error)
            }

        },
        /**移动无人机 */
        //   /**无人机控制 1121自旋 角度:00.1度 1-逆时针 0顺时针 ，角度0相对角度 1以正北wei0的角度  参数角度 *  /
        async moveUav(data) {
            try {
                const { type, slidervalue, rotation, roateType } = data
                let formdata = new FormData();
                formdata.append("uavId", this.defaultUavSn); //  1 
                formdata.append("type", type);
                // 是不是旋转
                if (type == 1121) {
                    formdata.append("Parm1", parseInt(slidervalue) * 100);
                    formdata.append("Parm2", rotation);
                    formdata.append("Parm3", roateType);
                } else {
                    formdata.append("Parm1", slidervalue); // 500零米
                    formdata.append("Parm2", 0);
                    formdata.append("Parm3", 0);
                }

                await this.$store
                    .dispatch("uavs/moveUav", formdata)
                    .then((response) => {
                        this.changeuavControlBtn(false);
                        const { code, message, data } = response;
                        if (code === 1) {
                            this.showMessage('执行成功', 'success')
                        } else {
                            this.showMessage(message, "warning");
                        }
                    })
                    .catch((error) => {
                        this.changeuavControlBtn(false);
                        this.showMessage(error, "error");
                    });
            } catch (error) {
                setTimeout(() => {
                    this.changeuavControlBtn(false);
                }, 3000);
            }
        },
        /**开始作业 没有用*/
        async startwork() {
            this.changeuavControlBtn(true);
            try {
                await this.$store
                    .dispatch("uav/startwork")
                    .then((response) => {
                        this.changeuavControlBtn(false);
                        const { code, message, data } = response;
                        if (code === 1) {
                        } else {
                            this.showMessage(message, "warning");
                        }
                    })
                    .catch((error) => {
                        this.changeuavControlBtn(false);
                        this.showMessage(error, "error");
                    });
            } catch (error) {
                setTimeout(() => {
                    this.changeuavControlBtn(false);
                }, 3000);
            }
        },
        /**无人机操作 */
        doCommand(command, p1, p2, p3, p4, timeout) {
            if (this.defaultUavSn == null) {
                this.showToast("请选择无人机！");
                return;
            }
            const data = {
                tag: this.$tag++,
                timeout: timeout,
                uavId: this.defaultUavSn,
                command: command,
                parm1: p1,
                parm2: p2,
                parm3: p3,
                parm4: p4,
            };
            if (command === 1151) {
                // 结束远程控制
                this.isRemoteEnable = false;
                if (this.timerSendRemoteData) {
                    if (this.timerSendRemoteData != null) {
                        clearInterval(this.timerSendRemoteData);
                    }
                }
            }
            this.changeuavControlBtn(true);
            try {
                return this.$store
                    .dispatch("uav/doCommand", data)
                    .then((response) => {
                        const { code, message } = response;
                        this.changeuavControlBtn(false);
                        let showTip = message;
                        if (command === 1150) {
                            // 开始远程控制成功
                            this.isRemoteEnable = false;
                            if (
                                this.timerSendRemoteData &&
                                this.timerSendRemoteData != null
                            ) {
                                clearInterval(this.timerSendRemoteData);
                            }
                            this.isRemoteEnable = true;
                            this.timerSendRemoteData = setInterval(
                                this.sendDjiRemoteData,
                                350
                            );
                        }
                        if (code === 1) {
                            if (command === 1160) {
                                showTip = "切换到拍照模式" + showTip;
                            } else if (command === 1161) {
                                showTip = "切换到录像模式" + showTip;
                            } else if (command === 1162) {
                                showTip = "拍照" + showTip;
                            } else if (command === 1163) {
                                showTip = "开始录像" + showTip;
                            } else if (command === 1164) {
                                showTip = "结束录像" + showTip;
                            }
                        }
                        if (code === 1) {
                            this.showToast(showTip);
                        } else {
                            this.showMessage(showTip, "error");
                        }
                        //this.showMessage(showTip, code === 1 ? 'success' : 'error')
                    })
                    .catch(() => {
                        this.changeuavControlBtn(false);
                    });
            } catch (error) {
                setTimeout(() => {
                    this.changeuavControlBtn(false);
                }, 3000);
            }
        },
        /**无人机控件 */
        controlTosendCommand(command, parm1, parm2, parm3, parm4) {
            console.log(command, parm1, parm2, parm3, parm4);
            if (this.defaultUavSn == null) {
                return;
            }
            if (this.timerSendPanData !== null) {
                clearInterval(this.timerSendPanData);
                this.timerSendPanData = null;
            }
            let that = this;
            const data = {
                MessageID: 3050,
                uavId: that.defaultUavSn,
                command: command,
                parm1: parm1,
                parm2: parm2,
                parm3: parm3,
                parm4: parm4,
            };
            if (parm1 === 0 && parm2 === 0 && parm3 === 0 && parm4 === 0) {
            } else if (parm4 === 5) {
                that.websocketsend(JSON.stringify(data));
            } else {
                this.timerSendPanData = setInterval(function () {
                    that.websocketsend(JSON.stringify(data));
                }, 100);
            }
        },
        //#endregion

        changeuavControlBtn(isdisabled) {
            if (isdisabled) {
                this.uavControlBtn = {
                    disabled: isdisabled,
                    disabledtitle: "执行中",
                };
            } else {
                this.uavControlBtn = {
                    disabled: isdisabled,
                    disabledtitle: "",
                };
            }
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
        // #region --------------------------------------------------------- 组件接参 ---------------------------------------------------------

        camerasetting(isDialog) {
            this.isDialogCameraSetting = isDialog;
        },
        //#region dom文本
        scrollIntoView(scrollIntoPointId) {
            let element = document.getElementById(scrollIntoPointId)
            let elementRect = element.getBoundingClientRect();
            let offset = elementRect.top + 40; // 向上偏移20个像素，视情况可调整
            console.log(offset);
            element.scrollIntoView({
                behavior: "smooth",  // 平滑过渡
                block: "start",  // 上边框与视窗顶部平齐。默认值
                // offset: { top: 50, left: 0 }
            })

            // this.$refs[scrollIntoPointId].scrollIntoView({
            //     behavior: "smooth",  // 平滑过渡
            //     block: "start"  // 上边框与视窗顶部平齐。默认值
            // });
        },
        //#endregion
        processedNumber(numStr) {
            // 判断小数点的位数是否超过5位
            numStr = numStr.toString();
            const decimalIndex = numStr.indexOf('.');
            if (decimalIndex !== -1 && numStr.length - decimalIndex > 6) {
                // 小数点超过5位，截取前6位
                return numStr.slice(0, decimalIndex + 6);
            }
            return numStr;
        },
        // #region --------------------------------------------------------- websocket ---------------------------------------------------------
        // 初始化weosocket
        async initWebSocket() {
            // console.log('initWebSocket 1')
            if (store.getters.token) {
                if (this.webSocket !== null) {
                    try {
                        this.webSocket.destroy()
                    } catch (error) { }
                    this.webSocket = null
                }
                // const URL = (location.protocol === "https:" ? "wss" : "ws") + '://' + location.host + '/websocketapi/' + this.userId + '/' + this.name
                // const URL = (location.protocol === "https:" ? "wss" : "ws") + '://' + location.host + '/websocketapi/' + store.getters.token
                const URL = (location.protocol === "https:" ? "wss" : "ws") + '://' + location.host + '/websocketapi/' + store.getters.token
                // const URL = (location.protocol === "https:" ? "wss" : "ws") + '://192.168.10.110:8080/websocketapi/' + store.getters.token
                // console.log('连接地址：' + URL)
                this.webSocket = new WebSocket(URL)
                this.webSocket.onmessage = this.websocketonmessage
                this.webSocket.onopen = this.websocketonopen
                this.webSocket.onerror = this.websocketonerror
                this.webSocket.onclose = this.websocketclose
            }
        },
        async initWebSocket2() {
            // console.log('initWebSocket 1')
            if (this.userId && this.name) {
                if (this.userId !== '' && this.name !== '') {
                    if (this.webSocket !== null) {
                        try {
                            this.webSocket.destroy()
                        } catch (error) { }
                        this.webSocket = null
                    }
                    const URL = (location.protocol === "https:" ? "wss" : "ws") + '://' + location.host + '/websocketapi/' + this.userId + '/' + this.name

                    // const URL = (location.protocol === "https:" ? "wss" : "ws") + '://' + location.host + '/websocketapi/' + this.userId + '/' + this.name
                    // console.log('连接地址：' + URL)
                    this.webSocket = new WebSocket(URL)
                    // console.log('initWebSocket 2')
                    // 监听socket连接
                    this.webSocket.onopen = this.websocketonopen
                    // 监听socket消息
                    this.webSocket.onmessage = this.websocketonmessage
                    // 监听socket错误信息
                    this.webSocket.onerror = this.websocketonerror
                    // 销毁监听
                    this.webSocket.onclose = this.websocketclose
                }
            }
        },
        // 连接建立之后执行send方法发送数据
        websocketonopen() {
            console.log('连接服务器成功。')
            // console.log('websocketonopen')
            const actions = {
                'msg': '我来了，同志们！'
            }
            this.websocketsend(JSON.stringify(actions))
            // console.log(JSON.stringify(actions));
        },
        // 连接建立失败重连
        websocketonerror(e) {
            console.error('websocketonerror：', e)
            this.showMessage('服务器连接丢失，5秒后重新连接！')
            if (this.timeoutReConnectWs != null) {
                clearTimeout(this.timeoutReConnectWs);
                this.timeoutReConnectWs = null;
            }
            //  计时器
            this.timeoutReConnectWs = setTimeout(() => {
                this.initWebSocket()
            }, 10000)
        },
        // 数据发送
        websocketsend(data) {
            try {
                // console.log('发送WebSocket数据：' + data)
                if (this.webSocket != null) {
                    // this.webSocket.send({data: data})
                    this.webSocket.send(data)
                    // console.warn('云台控制：' + data)
                }
            } catch (error) {
                console.error('websocket: ' + error)
            }
        },
        // 关闭
        websocketclose(e) {
            console.log('断开服务器连接：', e)
        },
        closeWebSocket() {
            // alert('销毁前')
            if (this.webSocket !== null) {
                console.log('断开与服务器的连接！')
                try {
                    this.webSocket.destroy()
                } catch (error) { }
                this.webSocket = null
            }
        },
        // 数据接收
        websocketonmessage(e) {
            this.receivedData = true; // 收到了数据 
            //   console.log('接收websocket数据' + e.data)
            const edata = e.data
            console.log(edata);
            let index = -1 // 当前无人机在数组中的索引
            let isNowUav = false // 是不是默认无人机
            let isNowHive = false // 是不是默认

            //数据 存储 store  
            const webSocketMsg = resultUtil
            //  this.$store.dispatch("publicData/SetSocketData",webSocketMsg)

            const resultUtil = JSON.parse(e.data)
            const {
                messageId, // 没有用到 
                code, // 1
                deviceID = resultUtil.data.uavId, // 没有用到 用默认data值
                message, // " "
                data, // data -- 数据
            } = resultUtil

            let needForceUpdate = false
            if (this.uavs && this.uavs.length > 0) {
                index = this.uavs.findIndex(uav => uav.uavId === deviceID);
                if (index >= 0) {
                    this.uavs[index].heartbeatData = data
                    this.uavs[index].receiveDataTime = Date.now(); // 设置数据接收的时间
                    this.uavs[index].online = true;
                }
            }
            var defaultData = null
            // 是不是默认
            // if (this.defaultUavSn === deviceID) {
            //   isNowUav = true
            //   needForceUpdate = true;
            //   this.refreshUavHeart(data);
            // } else {
            //   const op = null
            //   this.refreshUavHeart(op);
            // }

            // 是不是默认
            if (this.defaultUavSn === deviceID) {
                defaultData = data
                isNowUav = true
                // this.tuavHeartbeatData=data  
            }

            switch (messageId) {
                case 2200: // 大疆无人机心跳包
                    if (isNowUav) {
                        needForceUpdate = true;

                        this.refreshUavHeart(defaultData);
                    } else {
                        const op = null
                        this.refreshUavHeart(op);
                    }
                    break;
                case 10010: // 10010 图片
                    console.log(defaultData);
                    break;
                case 2250: // 大疆服务后台心跳包
                    break;
                case 2251:
                    break;
                case 2300: // 机巢心跳包
                    if (isNowHive) {
                        needForceUpdate = true;
                        this.refreshHiveHeart(data);
                    }
                    break;
            }

            // if (needForceUpdate) {
            //     this.$forceUpdate();
            // }
        },
        startDataCheckTimer() {
            this.dataCheckTimer = setInterval(() => {
                if (!this.receivedData) {
                    console.log('3秒内未收到数据,执行清空'); // 如果3秒内未收到数据，则输出提示信息 

                }
                this.receivedData = false; // 重置receivedData标记
            }, 3000);


            function debounce(fu, delay) {
                let timeoutId;
                return (...arg) => {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => fu(...arg), delay);
                };
            }
        },
        startTimeoutCheckTimer() {
            this.timeoutCheckTimer = setInterval(() => {
                if (!this.receivedData) {
                    console.log('超时提示：3秒内未再次收到数据'); // 如果3秒内再次未收到数据，则输出提示信息
                }
            }, 3000);
        },
        refreshUavHeart(data) {
            this.testData = new Date().getTime();
            if (data == null) {
                this.uavHeartbeatNow.alt = 0;
                this.uavHeartbeatNow.areMotorsOn = 0;
                this.uavHeartbeatNow.aremd = 0;
                this.uavHeartbeatNow.batteryValue = 0;
                this.uavHeartbeatNow.dataDate = 0;
                this.uavHeartbeatNow.flightModeText = "-";
                this.uavHeartbeatNow.linkAirUpload = 0;
                this.uavHeartbeatNow.linkAirDownload = 0;
                this.uavHeartbeatNow.batteryPert = 0;
                this.uavHeartbeatNow.gpsStatusText = "";
                this.uavHeartbeatNow.satecount = 0;
                this.uavHeartbeatNow.altabs = 0;
                this.uavHeartbeatNow.lng = 0;
                this.uavHeartbeatNow.lat = 0;
                this.uavHeartbeatNow.xySpeed = 0;
                this.uavHeartbeatNow.zSpeed = 0;
                this.uavHeartbeatNow.roll = 0;
                this.uavHeartbeatNow.pitch = 0;
                this.uavHeartbeatNow.yaw = 0;
                this.uavHeartbeatNow.flightTimeInSeconds = 0;
                // this.$set(this.uavHeartbeatNow, 'dataDate', Date.now());

            } else {
                this.uavHeartbeatNow.alt = data.alt;
                this.uavHeartbeatNow.altabs = data.altabs;
                this.uavHeartbeatNow.areMotorsOn = data.areMotorsOn;
                this.uavHeartbeatNow.aremd = data.aremd;
                this.uavHeartbeatNow.batteryValue = data.batteryValue;
                this.uavHeartbeatNow.dataDate = data.dataDate;
                this.uavHeartbeatNow.flightModeText = data.flightModeText;
                this.uavHeartbeatNow.linkAirUpload = data.linkAirUpload;
                this.uavHeartbeatNow.linkAirDownload = data.linkAirDownload;
                this.uavHeartbeatNow.batteryPert = data.batteryPert;
                this.uavHeartbeatNow.gpsStatusText = data.gpsStatusText;
                this.uavHeartbeatNow.satecount = data.satecount;
                this.uavHeartbeatNow.lng = data.lng;
                this.uavHeartbeatNow.lat = data.lat;
                this.uavHeartbeatNow.xySpeed = data.xySpeed;
                this.uavHeartbeatNow.zSpeed = data.zSpeed;
                this.uavHeartbeatNow.roll = data.roll;
                this.uavHeartbeatNow.pitch = data.pitch;
                this.uavHeartbeatNow.yaw = data.yaw.toFixed(2);
                this.uavHeartbeatNow.flightTimeInSeconds = this.$dateUtil.convertSecondToTime(data.flightTimeInSeconds);

                // this.$set(this.uavHeartbeatNow, 'yaw', data.yaw.toFixed(2));
                // this.$set(this.uavHeartbeatNow, 'dataDate', data.dataDate);
            }
            this.key_div_uav_parm++;

            /**CesiumMap */
            let CesiumMap = this.$refs.CesiumMap;
            if (CesiumMap) {
                if (this.uavHeartbeatNow.lat !== 0 && this.uavHeartbeatNow.lng !== 0) {
                    CesiumMap.GetHeartbeatNow(this.uavHeartbeatNow);
                }

            }

        },
        // #endregion

        async init() {
            // this.initWebSocket() //初始生命周期加载
            this.queryNewInfo()
        },
        /**最新的初始查询 */
        async queryNewInfo() {
            var data = await this.queryHandle() || []
            if (data.length >= 1) {
                this.handleInfo = data[0]
                this.queryBlockList(data[0].id);
                // this.queryPointList(data[0].id);
            } else {
                this.blockList = []
                // this.pointlist = []
            }

        },

        //#region-------------------------------------------------------------- 处理最新的一条 地块信息---------------------------------------------------------------------------
        /**查询处理列表 ✓ */
        async queryHandle() {
            const url = "uavs/queryHandle";
            try {
                const startTime = Date.now() - 3 * 30 * 24 * 60 * 60 * 1000;
                const endTime = Date.now();
                const formdata = { startTime, endTime, };
                const payload = { formdata, url, that: this };
                const response = await this.$store.dispatch("uavs/queryHandle", payload);
                const { code, message, data } = response;
                if (code === 1) {

                } else {
                    this.showMessage(message, "warning");
                }
                return data; // 返回数据
            } catch (error) {
                return null; // 返回数据
                this.showMessage(error, "error");
            } finally {
            }
        },

        /**作业地块 */
        async queryBlockList(id) {
            let url = "uavs/queryBlockList";
            try {
                let formdata = new FormData();
                formdata.append('handleId', id)
                console.log('handleId', formdata);
                const response = await this.$store.dispatch("uavs/queryBlockList", formdata);
                const { code, message, data } = response;
                if (code === 1) {
                    this.blockList = data || [];
                } else {
                    this.showMessage(message, "warning");
                }
                return Promise.resolve(response);
            } catch (error) {
                this.showMessage(error, "error");
                return Promise.reject(error);
            } finally {
            }
        },
        /**补播路径信息 */
        async queryPointList(id) {
            this.rightloading = true;
            try {
                const formdata = new FormData(); // 查询架次图片
                formdata.append("handleId", id);
                const response = await this.$store.dispatch("uavs/queryPointList", formdata);
                const { code, message, data } = response;
                if (code === 1) {
                    this.pointlist = data || [];
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

        //#endregion

        //#region --------------------------------------------------------------------- 模拟大疆心跳包------------------------------------------------------------
        openHeart() {
            // setInterval(this.printMessage, 500);
        },
        printMessage() {
            // this.showMessage('error', "error");
            const randomId = Math.floor(Math.random() * 1000); // 生成随机的 id
            const dataDate = Date.now()
            const uavHeart = {
                "code": 1,
                "data": {
                    "alt": 0,
                    "altabs": 99.9,
                    "areMotorsOn": 0,
                    "aremd": 0,
                    "batteryPert": 82,
                    "batteryTemp": 0,
                    "batteryValue": 0,
                    "cameraLens": 1,
                    "dataDate": dataDate,
                    "distToHome": 139.52,
                    "distToTarget": 0,
                    "electricCurrent": -0.69,
                    "flightMode": "GPS_ATTI",
                    "flightModeText": "GPS姿态模式",
                    "flightTimeInSeconds": 0,
                    "fpvSign": 100,
                    "gimbalMode": 2,
                    "gimbalPitch": 12.300000190734863,
                    "gimbalRelToUavHeading": 0.5,
                    "gimbalRoll": 0,
                    "gimbalYaw": -2,
                    "gpsStatus": 5,
                    "gpsStatusText": "高质量",
                    "id": randomId, // 使用随机生成的 id
                    "lat": 23.155143504551752,
                    "linkAirDownload": 100,
                    "linkAirUpload": 100,
                    "lng": 113.36887409647213,
                    "mountDevice": 1,
                    "pdop": 0,
                    "pitch": 0.4,
                    "remoteSign": 100,
                    "roll": 0.1,
                    "satecount": 18,
                    "systemStatus": 0,
                    "uavAbnormal": 0,
                    "uavCurentHive": "",
                    "uavId": "1ZNBJ5F00C008L",
                    "uavStatus": 0,
                    "uavType": 2,
                    "voltage": 49.81,
                    "wpCount": 0,
                    "wpFirstWpTime": 0,
                    "wpFlyedTime": 0,
                    "wpMayFinlishTime": 0,
                    "wpNo": 0,
                    "wpProgress": 0,
                    "wpStartTime": 0,
                    "xySpeed": 0,
                    "yaw": 0,
                    "zSpeed": 0
                },
                "message": "",
                "messageId": 2200
            };

            this.$store.dispatch('ws/CE_SHI_SOCKET_ONMESSAGE', uavHeart); // 用于模拟测试心跳
        },
        //#endregion
      
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() { },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        window.jq = $;

        let key = "defaultUav-" + this.userId;
        this.defaultUavSn = localStorage.getItem(key)
        this.init();
        const CesiumMap = this.$refs.CesiumMap;
        if(CesiumMap){
            this.$refs.CesiumMap.handleOperation();
        }
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
::v-deep .el-scrollbar__bar.is-horizontal {
    display: none;
}
::v-deep .el-aside,
.el-main {
    padding: 10px;
    // overflow: hidden;
}
.PointManagerAside-components {
    background-color: rgb(230, 237, 249);
    height: 100%;
    width: 55%;
    margin-left: -1px;
    padding: 10px;
}
.uavInfo {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    .uavInfo-el-row {
        width: calc(100% + 10px);
    }
    .uavParm {
        flex: 3;
    }
    ::v-deep .pointlist {
        --heightValue: 258px;
        overflow: hidden;
        .pointlist-inside {
            overflow: hidden;
        }
        .point-total-curee {
            background-color: #fff;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            div:first-of-type {
                flex: 1;
            }
        }
        // .scrollbar{
        //     position: fixed;
        //     height: 250px;
        // }
        height: var(--heightValue);
        flex: 2;
        .elcol {
            margin-bottom: 10px;
        }
        .el-card__body {
            height: 100%;
        }
    }
}
.uavParmMain {
    height: auto;
    border: 1px solid #d1caca;
    padding: 1px;
    text-align: center;
    display: flex;
    display: -webkit-flex;
    /* Safari */
    flex-direction: row;
    .uavParmMainLeft {
        width: 35px;
        display: flex;
        display: -webkit-flex;
        /* Safari */
        align-items: center;
        justify-content: center;
    }

    container-type: inline-size;
    .uavParmMainMiddle {
        font-size: 6cqw;
        height: 50px;
        flex: 1;
        display: flex;
        display: -webkit-flex;
        /* Safari */
        flex-direction: column;
        /* 水平居中 */
        /* align-items: center; */
        /* 垂直居中 */
        justify-content: center;
    }
}

.main {
    display: flex;
    flex-direction: column;
    .main-right {
        height: 65%;
        position: relative;
        margin-bottom: 20p;
        #location {
            background: #d1caca;
            position: absolute;
            top: 0px;
            right: 0px;
            padding: 10px 5px;
            width: 120px;
            #locationinfo {
                padding: 9px;
                background: #f9f9f9;
                border-radius: 5px;
                .info {
                    border-right: 1px solid #161616;
                    padding-right: 8px;
                }
                .value {
                    padding-left: 10px;
                }
            }
            #locationinfo:first-child {
                margin-bottom: 15px;
            }
            #locationinfo:hover {
            }
        }
    }
    .main-bottom {
        flex: 1;
        display: flex;
        flex-direction: row;
        .droneControl {
            flex: 3;
            display: flex;
            flex-direction: column;

            .uavControl {
                display: flex;
                flex: 1;
            }
            .textBox {
                height: auto;
            }
        }
        .loading {
            flex: 1;
            .image {
                width: 250px;
                height: 250px;
                position: relative;
                img {
                    width: 240px;
                    height: 320px;
                    position: absolute;
                    top: -45px;
                }
            }
        }
    }
}

/* 在宽度小于 600px 的屏幕上隐藏 .loading */
@media screen and (max-width: 1200px) {
    .main-bottom .droneControl {
        /* 在小屏幕上设置适当的最大宽度，例如 100% */
        max-width: 100%;
    }

    .main-bottom .loading {
        display: none;
    }
}

.text {
    text-align: center;
    font-size: 18px;
    font-weight: 700;
}

/**地图按钮 */
.CesiumMap-out-div {
    display: flex;
    flex-direction: row;
    height: 65%;

    .CesiumMap,
    .imageViewer {
        flex: 1;
        border: 1px solid #333333;
    }
    .block_list {
        width: 220px;
        margin-left: 2px;
        border: 2px solid #333333;
        overflow: scroll;
        .tab-content {
            font-size: 13px;
            text-align: center;
            font-weight: 800;
            & > p {
                position: relative;
            }

            & > p:first-child::before {
                content: "";
                cursor: pointer;
                width: 50px;
                height: 28px;
                position: absolute;
            }
        }
    }
}

// #region 折叠
summary {
    font-size: 1rem;
    font-weight: 600;
    background-color: #f3f3f3;
    color: #000;
    padding: 1rem;
    margin-bottom: 1rem;
    outline: none;
    border-radius: 0.25rem;
    cursor: pointer;
    position: relative;
}
details[open] summary ~ * {
    animation: sweep 0.5s ease-in-out;
}

@keyframes sweep {
    0% {
        opacity: 0;
        margin-top: -10px;
    }

    100% {
        opacity: 1;
        margin-top: 0px;
    }
}
details > summary::after {
    position: absolute;
    content: "+";
    right: 20px;
}

details[open] > summary::after {
    position: absolute;
    content: "-";
    right: 20px;
}

details > summary::-webkit-details-marker {
    display: none;
}
// #endregion
</style>