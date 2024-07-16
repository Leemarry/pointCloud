<!--
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2023-12-05 14:13:39
 * @LastEditors: likai 2806699104@qq.com
 * @LastEditTime: 2024-07-12 20:10:42
-->
<!-- 识别 tester   10010 -->
<template>
    <div class="container">

        <div class="item1 resize" id="">
            <div class="CesiumMap-outer">
                <CesiumMap ref="CesiumMap" :defaultUavSn="defaultUavSn" :visible=CesiumDrawVisible></CesiumMap>
                <div class="iconContainer ">
                    <i :class="['iconfont' ,  'icon-zhihang','cursorStyle']" title="执行任务" @click="startMission(1006)"></i>
                    <i :class="['iconfont' ,  'icon-jinhangzhong','cursorStyle']" title="暂停" @click="pauseMission(1142)"></i>
                    <i :class="['iconfont' ,  'icon-yiwancheng','cursorStyle']" title="恢复" @click="resumeMission(1143)"></i>
                    <!-- <i :class="['iconfont' ,  'icon-jinhangzhong','cursorStyle']" title="发送" @click="sendmsg()"></i>
                    <i :class="['iconfont' ,  'icon-yiwancheng','cursorStyle']" title="接收" @click="resumeMission(1143)"></i> -->
                </div>
            </div>
        </div>
        <div class="item2 result-image-demo">
            <div class="result-titel">
                <div>空斑识别结果</div>
            </div>
            <div class="result-image">
                <el-image style="width: 100%; height: 100% ;overflow: auto; " v-for="(url,index) in defaultUavResultImageData.imgarray" :key="index" :src="url" fit="cover" :preview-src-list="defaultUavResultImageData.imgarray">
                </el-image>
            </div>
        </div>
        <div class="item3 uav-image-demo result-image-demo">
            <div class="result-titel uav-realtime">
                <div :title="`当前：${defaultUavSn}  \n 点击切换无人机`" @click="selectUav()">无人机<span style="color:#ff0000">{{defaultUavSn}}</span>实时回传</div>
                <!-- <el-select ref="selectRef" class="fly-select" v-model="defaultUavSn" placeholder="请选择" @change="selectTrigger(defaultUavSn)">
                    <el-option v-for="(item,index) in uavs" :key="index" :label="item.uavName" :value="item.uavId">
                        <span style="float: left">{{ item.uavName }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.uavId }}</span>
                    </el-option>
                </el-select> -->
                <el-select ref="selectRef" class="fly-select" v-model="defaultUavSn" placeholder="请选择" @change="selectTrigger(defaultUavSn)">
                    <el-option-group v-for="group in options" :key="group.label" :label="group.label">
                        <el-option v-for="item in group.options" :key="item.uavId" :label="item.uavName" :value="item.uavId">
                            <span style="float: left">{{ item.uavName }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.uavId }}</span>
                        </el-option>
                    </el-option-group>
                </el-select>
            </div>
            <div class="result-image">
                <el-image style="width: 100%; height: 100% ;overflow: auto; " v-for="(url,index) in defaultUavImageData.imgarray" :key="index" :src="url" fit="cover" :preview-src-list="defaultUavImageData.imgarray">
                </el-image>
            </div>
        </div>
        <div class="item4">
            <div class="table-list-info">
                <!-- :row-class-name="tableRowClassName" -->
                <el-table :data="defaultUavResultImageData.array" stripe>

                    <el-table-column label="时间">
                        <template slot-scope="scope">
                            <span>{{parseTime(scope.row.time)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="id" label="空斑Id">
                    </el-table-column>
                    <el-table-column prop="yaw" label="朝向">
                    </el-table-column>
                    <el-table-column prop="altAbs" label="海拔">
                    </el-table-column>
                    <el-table-column label="空斑位置（经纬度，高程）">
                        <template slot-scope="scope">
                            (<span>{{  Number(scope.row.lng).toFixed(4) }}</span> ,<span>{{ Number(scope.row.lat).toFixed(4)}}</span>, <span>{{Number(scope.row.alt).toFixed(4)}}</span>)
                        </template>
                    </el-table-column>
                    <el-table-column prop="square" label="面积">
                    </el-table-column>
                    <el-table-column>
                        <template slot="header">
                            <el-popconfirm confirm-button-text='确定' cancel-button-text='不用了' icon="el-icon-info" icon-color="red" @cancel="cleardefaultUavData" @confirm="clearUavImageList()" title="确定清除当前无人机任务（航线与图集）？">
                                <div slot="reference" id="adding" type="Border Base" :title="'重置数据'" class="cursorStyle">清空</div>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

    </div>

</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import CesiumMap from "../components/Cesium/CesiumMap.vue";
import { parseTime, filtersType } from "@/utils/index";
import store from "@/store";
import { mapGetters } from "vuex";
import $ from "jquery";
import MyModule from "./myModule.js";
import { getDefaultObj, getDefaultData, switchNode, time, getTimeRange, getTimeRangeByKey, timeRangeMap } from "@/utils/currency"
var myModuleInstance;
export default {
    name: "",
    //import引入的组件需要注入到对象中才能使用
    components: { CesiumMap },
    data() {
        //这里存放数据
        return {

            options: [],
            visible: false,
            defaultUavResultImageData: {},
            defaultUavImageData: {},
            ceshi: {
                "uavId": "1ZNBJ5F00C008L",
                "array": [
                    {
                        "EFLINK_MSG_ID": 10010,
                        "EFLINK_MSG_LENGTH": 18,
                        "alt": 0,
                        "altAbs": 0,
                        "lat": 23.155158,
                        "lng": 113.36928266666666,
                        "time": 1712905092763,
                        "uavId": "1ZNBJ5F00C008L",
                        "url": "http://8.148.10.90:9000/efuav/photo/uav/1ZNBJ5F00C008L/image/20240412/dji3932675_20240412145812.JPG",
                        "yaw": 0
                    },
                    {
                        "EFLINK_MSG_ID": 10010,
                        "EFLINK_MSG_LENGTH": 18,
                        "alt": 0,
                        "altAbs": 0,
                        "lat": 23.155159555555553,
                        "lng": 113.3686423611111,
                        "time": 1712905074980,
                        "uavId": "1ZNBJ5F00C008L",
                        "url": "http://8.148.10.90:9000/efuav/photo/uav/1ZNBJ5F00C008L/image/20240412/dji3932659_20240412145754.JPG",
                        "yaw": 0
                    },
                    {
                        "EFLINK_MSG_ID": 10010,
                        "EFLINK_MSG_LENGTH": 18,
                        "alt": 0,
                        "altAbs": 0,
                        "lat": 23.155447277777775,
                        "lng": 113.36872927777777,
                        "time": 1712905058279,
                        "uavId": "1ZNBJ5F00C008L",
                        "url": "http://8.148.10.90:9000/efuav/photo/uav/1ZNBJ5F00C008L/image/20240412/dji3932643_20240412145738.JPG",
                        "yaw": 0
                    }
                ],
                "imgarray": [
                    "http://8.148.10.90:9000/efuav/photo/uav/1ZNBJ5F00C008L/image/20240412/dji3932675_20240412145812.JPG",
                    "http://8.148.10.90:9000/efuav/photo/uav/1ZNBJ5F00C008L/image/20240412/dji3932659_20240412145754.JPG",
                    "http://8.148.10.90:9000/efuav/photo/uav/1ZNBJ5F00C008L/image/20240412/dji3932643_20240412145738.JPG"
                ],
                "url": "http://8.148.10.90:9000/efuav/photo/uav/1ZNBJ5F00C008L/image/20240412/dji3932675_20240412145812.JPG"
            },
            webSocketDatas: {},
            onlinetimer: null,
            flyindex: 0,
            isDangQianuav: [],
            receivedData: false, // 标记是否收到了数据
            dataCheckTimer: null, // 检查数据的定时器
            timeoutCheckTimer: null, // 超时提示的定时器
            CesiumDrawVisible: false,
            resultData: {}, // 心跳数据
            defaultUavSn: "",
            uavs: [],
            uavstableData: [],
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
            'imageHeartbeatList',  //所有无人实时回传图片信息列表
            // 'defaultUavImageData', //  当前默认无人机实时回传图片信息(图列表，数据列，最新url,uvaId) 没有用
            'resultimageHeartbeatList', //所有无人机分析结果图片信息列表
            // 'defaultUavResultImageData', //仅当前无人机分析结果图片信息(图列表，数据列，最新url,uvaId)没有用
        ])
    },
    //监控data中的数据变化
    watch: {
        'resultimageHeartbeatList': {
            deep: true,
            immediate: true,
            handler(val, oldval) {
                console.log('分析结果图集');
                const uavId = this.defaultUavSn
                this.defaultUavResultImageData = this.setUavImageData(uavId, this.resultimageHeartbeatList);
            }
        },
        'imageHeartbeatList': {
            deep: true,
            immediate: true,
            handler(val, oldval) {
                // console.log('实时回传图集');
                const uavId = this.defaultUavSn
                this.defaultUavImageData = this.setUavImageData(uavId, this.imageHeartbeatList);
                // this.defaultUavImageData = this.ceshi
            }
        },
        'defaultUavHeartbeat': {
            deep: true,
            immediate: true,//立即执行
            handler(newVal, oldVal) {
                /**CesiumMap */
                let CesiumMap = this.$refs.CesiumMap;
                // console.log('数据', oldVal);
                if (CesiumMap) {
                    console.log(Object.keys(oldVal).length);
                    if (oldVal !== undefined && Object.keys(oldVal).length > 0 && oldVal.uavId == this.defaultUavSn && oldVal.lat !== 0 && oldVal.lng !== 0) {
                        // console.log('显示');
                        CesiumMap.GetHeartbeatNows(oldVal);
                    } else {
                        CesiumMap.GetHeartbeatNowToremoveModel(oldVal);
                        // console.log('移除');
                    }
                }
            }
        },
    },
    //方法集合
    methods: {
        async init() {
            // let key = "defaultUav-" + this.userId;
            // this.defaultUavSn = localStorage.getItem(key)
            this.queryAllUavs();
        },
        tableRowClassName({ row, rowIndex }) {
            console.log(row, rowIndex, '颜色');
            if (rowIndex === 1) {
                return 'warning-row';
            }
            return '';
        },
        // #region --------------------------------------------------------- 后台交互 ---------------------------------------------------------

        selectUav() {
            // this.$refs.selectRef.toggleMenu();
            // console.log('this.$refs.selectRef', this.$refs.selectRef, this.$refs.selectRef.visible);
            if (this.uavs.length > 0) {
                const isVisable = this.$refs.selectRef.visible
                this.$nextTick(() => {
                    // console.log(this.$refs.selectRef);
                    this.$refs.selectRef.visible = !isVisable;
                    // this.$refs.selectRef.toggleMenu();
                })
            }
        },
        selectTrigger(val) {
            this.defaultUavResultImageData = this.setUavImageData(val, this.resultimageHeartbeatList);
            this.defaultUavImageData = this.setUavImageData(val, this.imageHeartbeatList);
            // this.defaultUavImageData = this.ceshi
        },

        selectChanged(value) {
            let key = "defaultUav-" + this.userId;
            localStorage.setItem(key, value);
        },
        /**默认信息数据 */
        setUavImageData(val, dataList) {
            const index = dataList.findIndex(item => item.uavId == val);
            if (index >= 0) {
                return dataList[index];
            } else {
                return {
                    url: '',
                    uavId: null,
                    array: [],
                    imgarray: []
                };
            }
        },

        /**默认数据 resultimageHeartbeatList: */
        defaultData(data) {
            if (!data || data.length <= 0) {
                return false;
            }
            // 检查LocalStorage中的"defaultUav"值  defaultUav-2
            let key = "defaultUav-" + this.userId;
            var checkUav = localStorage.getItem(key);
            if (!checkUav) {
                localStorage.setItem(key, data[0].uavId);
            } else {
                let localStorageUav = localStorage.getItem(key); //获取浏览器存储的是否还在数据库表内
                if (!data.some((item) => item.uavId === localStorageUav)
                ) {
                    localStorage.setItem(key, data[0].uavId);
                }
            }
            this.defaultUavSn = localStorage.getItem(key);
            // 分析结果图集
            const val = this.defaultUavSn
            this.defaultUavResultImageData = this.setUavImageData(val, this.resultimageHeartbeatList);
            this.defaultUavImageData = this.setUavImageData(val, this.imageHeartbeatList);
            // this.defaultUavImageData = this.ceshi

        },

        uavTypeInfo(data) {

            const inspectionUavs = [];
            const seedingUavs = [];
            const other = []
            data.forEach(item => {
                if (item.efUavType.typeProtocol === 0) {
                    inspectionUavs.push(item);
                } else if (item.efUavType.typeProtocol === 1) {
                    seedingUavs.push(item);
                } else {
                    other.push(item)
                }
            });
            if (inspectionUavs.length > 0) {
                this.options.push({ label: '巡检机', options: inspectionUavs })
            }
            if (seedingUavs.length > 0) {
                this.options.push({ label: '播种机', options: seedingUavs })
            }
            if (other.length > 0) {
                this.options.push({ label: '其他', options: other })
            }

        },


        //#region  ----------------------------------------------------------------------http请求--------------------------------------------------------------------------------
        /**查询所有无人机 */
        async queryAllUavs() {
            try {
                await this.$store.dispatch("uavs/getUavs").then((response) => {
                    const { code, message, data } = response;
                    if (code === 1) {
                        this.uavs = data;
                        let key = 'defaultUav-2';
                        var checkUav = localStorage.getItem(key);
                        this.defaultData(data)


                        // this.defaultUavSn = getDefaultData(key, data, 'uavId')
                        this.uavTypeInfo(data)
                    }
                }).catch((error) => {
                    this.showMessage(error, "error");
                });
            } catch (error) {
            }
        },

        /**执行任务 */
        async startMission(command) {
            try {
                const RequestBody = {
                    hiveId: "",
                    timeout: 10,
                    command: command,
                    tag: 2,
                    uavId: this.defaultUavSn,
                    parm1: 0,
                    parm2: 0,
                    parm3: 0,
                    parm4: 0,
                };
                await this.$store.dispatch("uavs/startMission", RequestBody).then((response) => {
                    const { code, message, data } = response;
                    if (code === 1) {
                        this.showMessage(message + "执行", "success");
                    } else {
                        this.showMessage(message, "warning");
                    }
                }).catch((error) => {
                    this.showMessage(error, "error");
                });
            } catch (error) {
                this.showMessage(error, "error");
            }
        },
        /**暂停任务 */
        async pauseMission(command) {
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
                await this.$store.dispatch("uavs/pauseMission", RequestBody).then((response) => {
                    const { code, message, data } = response;
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
        /**恢复任务 */
        async resumeMission(command) {
            try {
                const RequestBody = {
                    hiveId: "",
                    timeout: 10,
                    command: command,
                    tag: 2,
                    uavId: this.defaultUavSn,
                    parm1: 0,
                    parm2: 0,
                    parm3: 0,
                    parm4: 0,
                };
                await this.$store.dispatch("uavs/resumeMission", RequestBody).then((response) => {
                    const { code, message, data } = response;
                    if (code === 1) {
                        this.showMessage(message + "执行", "success");
                    } else {
                        this.showMessage(message, "warning");
                    }
                }).catch((error) => {
                    this.showMessage(error, "error");
                });
            } catch (error) {
                this.showMessage(error, "error");
            }
        },

        sendmsg() {
            //定义发送信息 
            const evts = new CustomEvent('sendmsg', {
                detail: {
                    mid: 'id',
                    positions: 'uniqueArray', //jdArrs
                }
            })
            document.dispatchEvent(evts)
        },

        //#endregion



        /**清空图片列表 所有信息 */
        clearUavImageList() {
            // CesiumMap
            this.$refs.CesiumMap.clearLinesAndStore();
        },
        cleardefaultUavData() {
            console.log('清空当前信息');
        },

        // #region ----------------------------------------------------信息提示 ------------------------------------------------------
        showToast(msg) {
            this.$layer.msg(msg)
        },
        showMessage(msg, type) {
            this.$message({
                message: msg,
                type: type
            })
        },

        filtersType(val) {
            return filtersType(val);
        },
        parseTime(date) {
            return parseTime(date);
        },

        //#endregion

        startOnlineTimer() {
            this.stopOnlineTimer();
            this.onlinetimer = setInterval(this.UavsNowData, 500);
        },
        stopOnlineTimer() {
            if (this.onlinetimer != null) {
                clearInterval(this.onlinetimer);
                this.onlinetimer = null;
            }
        },
        async UavsNowData() {
            // webSocketDatas
            this.flyindex = this.flyindex - 3;
            this.webSocketDatas.data.altabs = this.flyindex;
            console.log("我的定时器");

            this.webSocketDatas.data.lat = 37.541208607993305;
            this.webSocketDatas.data.lng = 114.279892983626;
            this.webSocketDatas.data.flightModeText = "降落";
            // 经度：114.279892983626纬度：37.541208607993305高度：219.00802214149556
            this.webSocketDatas.data.altabs = this.flyindex;
            this.webSocketDatas.data.uavId = 'ssss';

            // const response = await this.$store.dispatch(
            //     "publicData/setSocketData",
            //     this.webSocketDatas
            // );
            // console.log(this.webSocketData.altabs);
            const today = new Date().toISOString().substr(0, 10);
            console.log(this.$store.state.publicData);

            console.log('false');
            // 检查是否已存在当前日期的数据 存储当天数据 、、、
            // const webSocketMsg = this.webSocketDatas; // 当天的数据对象; 
            // this.$store.dispatch("publicData/setSocketDatabyDate", {
            //     date: today,
            //     webSocketMsg,
            // });



            // if (!this.$store.state.publicData.dailyData[today]) {
            //     // 检查是否已存在当前日期的数据
            //     const data = this.uavHeartbeatNow; // 当天的数据对象
            //     this.$store.dispatch("publicData/setSocketData", {
            //         date: today,
            //         data,
            //     });
            // }

            //  cesium.changeuavs(this.uavHeartbeatNow);
            // cesium.throttleClick(this.uavHeartbeatNow)
            //  if(this)
        },

        // const originalGridTemplateRows = container.style.gridTemplateRows; // 保存原始值

        //#region 拉伸
        handleResize() {
            const resizeElement = document.querySelector('.resize')  //应该获取你的宽度 做比 

            // 添加点击事件监听器
            // 鼠标按下事件 document.onmousedown 
            resizeElement.onmousedown = function (e) {
                //第一个item1（reisze) 宽高 
                let resizeWidth = resizeElement.offsetWidth;
                let resizeHeight = resizeElement.offsetHeight;
                // console.log('resizeHeight', resizeHeight);
                // console.log('resizeElement.offsetHeight', resizeElement.offsetHeight);
                const containerElement = document.querySelector('.container') //外层网格布局

                const startY = e.clientY
                const startX = e.clientX
                // 鼠标拖动事件 
                document.onmousemove = function (e) {
                    const endY = e.clientY
                    const endX = e.clientX
                    // 获取 containerElement offsetHeight
                    const containeroffsetHeight = containerElement.offsetHeight
                    const containeroffsetWidth = containerElement.offsetWidth
                    // 做比 修改网格比例
                    const Y1 = resizeHeight + (endY - startY)
                    const Y2 = containeroffsetHeight - Y1
                    containerElement.style.gridTemplateRows = `${Y1}fr ${Y2}fr`;
                    const X1 = resizeWidth + (endX - startX);
                    const X2 = containeroffsetWidth - X1;
                    containerElement.style.gridTemplateColumns = `${X1}fr ${X2}fr`;
                }
                // 鼠标松开事件
                document.onmouseup = function (evt) {
                    resizeWidth = null;// resizeElement.offsetWidth;
                    resizeHeight = null; //resizeElement.offsetHeight;
                    document.onmousemove = null;
                    document.onmouseup = null;

                    resizeElement.releaseCapture && resizeElement.releaseCapture() // 当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
                }
                resizeElement.setCapture && resizeElement.setCapture() // 该函数在属于当前线程的指定窗口里设置鼠标捕获
                return false
            }
        },
        //#endregion
        // #region --------------------------------------------------------- websocket ---------------------------------------------------------
        // 初始化weosocket
        async initWebSocket() {
            // this.startOnlineTimer();
            // this.uavstableData = Array.from(
            //     { length: this.uavs.length },
            //     () => []
            // );
            // console.log('initWebSocket 1')
            if (store.getters.token) {
                if (this.webSocket !== null) {
                    try {
                        this.webSocket.destroy();
                    } catch (error) { }
                    this.webSocket = null;
                }
                // const URL = (location.protocol === "https:" ? "wss" : "ws") + '://' + location.host + '/websocketapi/' + this.userId + '/' + this.name
                // const URL = (location.protocol === "https:" ? "wss" : "ws") + '://' + location.host + '/websocketapi/' + store.getters.token
                const URL =
                    (location.protocol === "https:" ? "wss" : "ws") +
                    "://" +
                    location.host +
                    "/websocketapi/" +
                    store.getters.token;
                // const URL = (location.protocol === "https:" ? "wss" : "ws") + '://192.168.10.110:8080/websocketapi/' + store.getters.token
                // console.log('连接地址：' + URL)
                this.webSocket = new WebSocket(URL);
                // console.log('initWebSocket 2')
                this.webSocket.onmessage = this.websocketonmessage; //接收数据
                this.webSocket.onopen = this.websocketonopen;
                this.webSocket.onerror = this.websocketonerror;
                this.webSocket.onclose = this.websocketclose;
            }
        },
        // 连接建立之后执行send方法发送数据
        websocketonopen() {
            console.log("连接服务器成功。");
            // console.log('websocketonopen')
            const actions = {
                msg: "我来了，同志们！",
            };
            this.websocketsend(JSON.stringify(actions));
            // console.log(JSON.stringify(actions));
        },
        // 连接建立失败重连
        websocketonerror(e) {
            console.error("websocketonerror：", e);
            this.showMessage("服务器连接丢失，5秒后重新连接！");
            if (this.timeoutReConnectWs != null) {
                clearTimeout(this.timeoutReConnectWs);
                this.timeoutReConnectWs = null;
            }
            //  计时器
            this.timeoutReConnectWs = setTimeout(() => {
                this.initWebSocket();
            }, 10000);
        },
        // 数据发送
        websocketsend(data) {
            try {
                // console.log('发送WebSocket数据：' + data)
                if (this.webSocket != null) {
                    // this.webSocket.send({data: data})
                    this.webSocket.send(data);
                    // console.warn('云台控制：' + data)
                }
            } catch (error) {
                console.error("websocket: " + error);
            }
        },
        // 关闭
        websocketclose(e) {
            console.log("断开服务器连接：", e);
        },
        closeWebSocket() {
            if (this.webSocket !== null) {
                console.log("断开与服务器的连接！");
                try {
                    this.webSocket.destroy();
                } catch (error) { }
                this.webSocket = null;
            }
        },
        /**数据接收 */
        websocketonmessage(e) {
            this.receivedData = true; // 收到了数据
            // console.log("接收websocket数据" + e.data);
            const edata = e.data;
            //
            // console.log(edata);
            let index = -1; // 当前无人机在数组中的索引
            let isNowUav = false; // 是不是默认无人机
            let isNowHive = false; // 是不是默认
            const resultUtil = JSON.parse(e.data);

            //数据 存储 store  
            const webSocketMsg = resultUtil
            this.$store.dispatch("publicData/SetSocketData", webSocketMsg)

            const {
                messageId, // 没有用到
                code, // 1
                deviceID = resultUtil.data.uavId, // 没有用到 用默认data值
                message, // " "
                data, // data -- 数据
            } = resultUtil;

            let needForceUpdate = false;

            var defaultData = null;
            var isNotDefaultData = null;
            if (this.defaultUavSn === deviceID) {
                isNowUav = true;
                defaultData = data;
            } else {
                console.log("不是当前飞机");
                isNotDefaultData = data;
            }

            switch (messageId) {
                case 2200: // 大疆无人机心跳包
                    if (isNowUav) {
                        needForceUpdate = true;

                        this.refreshUavHeart(defaultData);
                    } else {
                        const op = null;
                        this.refreshUavHeart(op);
                    }
                    break;
                case 10010: // 10010 图片
                    if (this.uavstableData && this.uavstableData.length > 0) {
                        for (let i = 0; i < this.uavstableData.length; i++) {
                            const element = this.uavstableData[i]; // 0
                            if (element && element.uavId) {
                                if (element.uavId === deviceID) {
                                    index = i;
                                    break;
                                }
                            }
                        }
                        if (index >= 0) {
                            this.uavstableData[index].array.unshift(data);
                        } else {
                            this.uavstableData.push({
                                uavId: deviceID,
                                array: [data],
                            });
                            index = this.uavstableData.length - 1;
                        }
                    } else {
                        this.uavstableData.push({
                            uavId: deviceID,
                            array: [data],
                        });
                        index = 0;
                    }
                    if (isNowUav) {
                        needForceUpdate = true;
                        this.resultData = defaultData; // 图片覆盖
                        if (index >= 0 && this.uavstableData.length > index) {
                            this.isDangQianuav =
                                this.uavstableData[index].array;
                        }
                    } else {
                        this.resultData = {};
                        this.isDangQianuav = [];
                        // this.isDangQianuav = this.uavstableData[index].array;
                    }
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
                    console.log("3秒内未收到数据,执行清空"); // 如果3秒内未收到数据，则输出提示信息
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
                    console.log("超时提示：3秒内未再次收到数据"); // 如果3秒内再次未收到数据，则输出提示信息
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
                this.uavHeartbeatNow.flightTimeInSeconds =
                    this.$dateUtil.convertSecondToTime(
                        data.flightTimeInSeconds
                    );
            }
            this.key_div_uav_parm++;

            /**CesiumMap */
            let CesiumMap = this.$refs.CesiumMap;
            if (CesiumMap) {
                CesiumMap.GetHeartbeatNow(this.uavHeartbeatNow);
            }
        },
        // #endregion
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        // myModuleInstance = new MyModule();
        // this.webSocketDatas = myModuleInstance.webSocketData;
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.init();
        /**页面拉伸 */
        this.handleResize()
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
// #region 网格布局 设计拉伸
.container {
    display: grid;
    width: 100%; // 相对父100%
    height: 100%; // 相对父100%
    grid-template-areas:
        "item1 item2"
        "item3 item4"; // wge
    grid-template-columns: 1fr 1.2fr;
    grid-template-rows: 1fr 01fr;
}
.container > div {
    border: 1px dashed #888;
}

.item1 {
    grid-area: item1;
}
.item2 {
    grid-area: item2;
}
.item3 {
    grid-area: item3;
}
.item4 {
    grid-area: item4;
}

// #endregion 网格布局 设计拉伸
.resize {
    resize: both;
    overflow: hidden;
}
.item2 {
    position: relative;
    min-width: 300px;
    min-width: 200px;
}
.item1 {
    position: relative;
    min-width: 500px;
    min-height: 300px;
    .moveDiv {
        position: absolute;
        inset: 0 0 0 0;

        z-index: 1;
    }
    .move {
        // position: absolute;
        // width: 20px;
        // height: 20px;
        // z-index: 99;
        // bottom: 0px;
        // right: 0px;
        // cursor: pointer;
        // resize: both;
        // overflow: hidden;
        position: absolute;
        right: 0px;
        bottom: 0;
        width: 20px;
        height: 20px;
        background: yellow;
    }
    .CesiumMap-outer {
        position: absolute;
        inset: 0 0 0 0;
    }
}
.item4 {
    position: relative;
    .table-list-info {
        position: absolute;
        inset: 0 0 0 0;
        display: flex;
        ::v-deep .el-table {
            flex: 1;
            overflow: scroll;
        }
    }
}

.result-image-demo {
overflow: hidden;
    .result-titel {
        height: 40px;
        text-align: center;
        font-weight: 700;
        font-size: 24px;
        line-height: 45px;
    }
    .result-image {
        width: 100%;
        // height: 100%;
        height: calc(100% - 40px);
        overflow: scroll;
    }
    .uav-realtime {
        position: relative;
        .fly-select {
            opacity: 0;
            position: absolute;
            top: 2px;
            left: 0px;
        }
    }
}
.iconContainer {
    position: absolute;
    bottom: 0px;
    color: #637fcf;
}
.cursorStyle {
    cursor: pointer;
    &:hover {
        color: aquamarine;
    }
}
::v-deep .el-select-dropdown__item {
    padding: 0 10px;
}

::v-deep .el-image {
    position: relative;
    img {
        position: absolute;
        inset: 0px 0px 0px 0px;
    }
}

.warning-row {
    background: oldlace;
}
</style>
