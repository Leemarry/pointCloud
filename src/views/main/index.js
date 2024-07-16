import { mapGetters } from 'vuex'
import videoPlayer from '../components/videoPlayer.vue'
import parmItem from '../components/parmItem.vue'
import realDatetime from '../components/realDatetime.vue'
import uavItem from '../components/uavItem.vue'
import pvmap from '../components/pvmap.vue'
import CesiumMap from '../components/Cesium/CesiumMap.vue'
import op from '../components/Cesium/drowcesium.vue'
import cameraSettingsPopup from '../components/cameraSettingsPopup.vue'
import { Attitude, Heading } from "vue-flight-indicators";
import { removeToken } from "@/utils/auth";

import { getDefaultObj, getDefaultData, switchNode, time, getTimeRange, getTimeRangeByKey, timeRangeMap, sortDataByPrefix } from "@/utils/currency"


import { resetRouter } from "@/router";
import scrollbar from '@/views/components/scrollbar/scrollbar'
import {
  parseTime,
  filtersType
} from '@/utils/index';
import {
  _debounce,
  _throttle
} from '@/utils/throttle'

import store from '@/store';


import request from '@/utils/request'
import TRTC from 'trtc-js-sdk';
// import { toggleClass } from '@/utils'
// import '@/assets/custom-theme/index.css' // the theme changed version element-ui css

// import requestWebworker from "worker-loader!../../utils/arequest.worker"
// import requestWebworker from "../../utils/arequest.worker"
import bus from "@/bus"
import VideoModule from '@/views/components/VideoModule/VideoModule'
import currencyMinins from '@/utils/currencyMinins'
var defaultUav = "defaultUav-";
export default {
  name: 'index',
  mixins: [currencyMinins], //
  components: {
    CesiumMap,
    pvmap,
    uavItem,
    parmItem,
    realDatetime,
    videoPlayer,
    Attitude,
    Heading,
    op,
    cameraSettingsPopup,
    VideoModule,
    scrollbar
  },

  data() {
    const self = this
    return {
      uploadUavVisible: false,
      kmzCurrentIndex: 0,
      copyText: 'a copy',
      currentTask: {},//当前航线
      currentIndex: null, // 追踪当前被点击的元素索引
      pagesize: 3,//指定展示多少条
      currentPage: 1,//当前页码
      isMap: true, //当前是否是地图
      aProUrl: process.env,
      tasksRoutes: [],
      tasksName: '重命名',
      tasksLoading: false,
      sendText: "收到请回答-来自爷爷",

      choiseTime: [new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date(Date.now())],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      file: null,

      CesiumDrawVisible: false,
      /**相机弹窗参数 */
      cameraSettingVisible: false,
      /** */
      receivedData: false, // 标记是否收到了数据
      dataCheckTimer: null, // 检查数据的定时器
      timeoutCheckTimer: null, // 超时提示的定时器
      newOpacity: 0.35,
      loadingBackground: "rgba(0, 0, 0,0.35)",
      maploading: false,
      loadingText: '...',
      createARouteOrNot: true,
      selectSn: '',
      divHeight: 0,
      resizeTimer: null,
      mapUrl: "",
      pieChartInfo: [],
      barChartInfo: [],
      statisticsInfo: '',
      statisticsloading: false,
      isActive: 1,
      dataIndex: 0,
      srcList: ['https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
        'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
      ],
      WrongSnInfoloading: false,
      WrongSnInfo: [],
      defaultUserId: false,
      defaultSnInfo: '',
      defaultSn: '',
      isShowDialogOpenSnCount: false,
      pvForm: '',
      isShowDialogOpenItem: false,
      testData: 1,
      theme: false, // true黑色
      logo: null,
      timer: null, // 初始定时器变量名为null
      webSocket: null,
      isHeaderMouse: false,
      loading: false,
      uavTypeImage: null,
      key_div_uav_parm: 0,
      key_div_gps_parm: 1,
      videoActiveCount: 4, //视频九宫格，1,4,9
      dialogVisibleChoiceVideoUrl: false,
      dialogVisibleChoiceVideoUrlUavSn: null,
      dialogVisibleChoiceVideoUrlIndex: 0,
      isDialogCameraSetting: false,
      uavOnlineCount: 0,
      defaultHiveId: null, //默认选中的停机坪
      hivesNowUav: [], //当前无人机的所有停机坪
      isHasHive: false, // 当前无人机是否有停机坪
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
        flightTimeInSeconds: 0
      },
      configss: {
        data: [{
          name: '总架次数',
          value: 55
        },
        {
          name: '总异常数',
          value: 120
        },
        {
          name: '总飞行时间',
          value: 78
        },
        ],
        // unit: '次数',
        waitTime: 500000,
        valueFormatter({
          name,
          value
        }) {
          if (name == '总飞行时间') {
            let result = value + 's'
            if (value >= 60) {
              result = (value / 60).toFixed(2) + 'm'
            } else if (value >= 3600) {
              result = (value / 3600).toFixed(2) + 'h'
            }
            return result
          }
          return value
        }
      },
      hiveHeartbeatNow: {},
      hives: [],
      inspectionUavs: [],
      seedingUavs: [],
      // 飞行架次
      flyedSorties: [],
      // 单架次数据
      sortiesInfo: [],
      // 地图
      bigView: "uav",
      isShowMapCtrl: false,
      isShowHiveVideoCtrl: false,
      map: null,
      mapStyle: 'dark', // 地图样式，支持normal（默认样式）、dark（深色样式）、light（浅色样式）、fresh(osm清新风格样式)四种
      zoom: 16,
      markerUavHiveOffset: [-32, -32],
      djiUavOnline: require('@/assets/images/uavOnline.png'),
      djiUavOffline: require('@/assets/images/uavOffline.png'),
      // 仪表盘
      heading: -0, // 逆时针转动度数
      numberAllUavCount: {
        number: [0],
        content: '{nt} 架'
      },
      numberOnlineUavCount: {
        number: [0],
        content: '{nt} 架'
      },
      timeoutReConnectWs: null, // 定时重新连接Ws
      streamType: 'webrtc',
      centerPosition: [114.474721, 30.457096], // 用户当前位置经纬度
      ProgressShow: '离线',
      // 控制
      isRemoteEnable: false, // 远程控制
      timerSendRemoteData: null,
      isDoingCommand: false,

      timerSendPanData: null,
      isCanOpter: false, // 是否可以操作无人机或停机坪
      isCanOpterUav: false, // 是否可以操作无人机
      isCanOpterHive: false, // 是否可以操作停机坪
      //KMZ 
      isDialogKmz: false,
      loadingKmz: false,
      kmzFileList: [],
      // 键盘控制
      lastPressKeyCode: 0,
      isKeyboardKeydown: false,
      rollKey: 0,
      pitchKey: 0,
      yawKey: 0,
      altKey: 0,
      // TRTC
      dialogTrtcRoom: false,
      loadingRoomUsers: false,
      isTrtcEnabled: false,
      isTrtcSpeekEnabled: true,
      isTrtcVoiceEnabled: true,
      clientTrtc: null,
      loadingTrtc: false,
      trtcLocalStream: null,
      trtcRemoteStreamClient: [],
      trtcRemoteStreamArray: [], // 远端流数组，用于音频静音
      whoIsTaking: '谁正在讲话',
      whoIsTakingDate: 0,
      // 时间
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      value1: '',
      value2: '',

    }
  },
  watch: {
    theme() {
      // toggleClass(document.body, 'custom-theme')
    },
    'createARouteOrNot'(newVal, oldVal) {
      console.log('我是生成的');
      console.log(newVal, oldVal);
      this.createARouteOrNot = newVal

      // this.new3DTileset()
    },
    // defaultUavHeartbeat(newValue) {
    //   console.log('defaultUavHeartbeat 变化:', newValue);
    // },
    'defaultUavHeartbeat': {
      deep: true,
      // immediate: true, //立即执行
      handler(newVal, oldVal) {
        /**CesiumMap */
        let CesiumMap = this.$refs.CesiumMap;
        // if (oldVal === null || typeof oldVal !== 'object') {
        //   console.log('oldVal 不是一个有效的对象');
        // } else {
        //   console.log('数据:', oldVal, '属性长度:', Object.keys(oldVal).length);
        // }
        // console.log('数据:',oldVal ,'属性长度:',Object.keys(defaultUavHeartbeat).length); 
        if (CesiumMap) {
          if (newVal !== undefined && Object.keys(newVal).length > 0 && newVal.uavId == this.defaultUavSn && newVal.lat !== 0 && newVal.lng !== 0) {
            console.log('显示', oldVal);
            CesiumMap.GetHeartbeatNows(oldVal);
          } else {
            console.log('移除', newVal);
            CesiumMap.GetHeartbeatNowToremoveModel(newVal);

          }
        }
      }
    },
  },
  computed: {
    ...mapGetters([
      'userId',
      'name',
      'userInfo',
      'currentMid',
      'currentMidUnifiedHeight',
      'webSocketMsg',
      'webSocketData',
      'messageId',
      'defaultUavHeartbeat',
      'ProcessWsMessage',
    ])
  },
  created() {
    // this.theme = true;
    // if (this.roleInfo) {
    //   this.isCanOpter = (this.roleInfo.roleId === 1 || this.roleInfo.roleId === 2 || this.roleInfo.roleId === 4 || this.roleInfo.roleId >= 50)
    // } else {
    //   this.isCanOpter = false
    // }


    this.$bus.$on('send:saveRouteToMinio', this.sendsaverouteInfo);  //发送保存至minio
    this.$bus.$on('send:uploadRouteTouav', this.sendRouteToUav);  // 上传至无人机（绘制航线与历史保存航线任务）
    this.$bus.$on('send:readerKml', this.readerKml);  // 上传至无人机（绘制航线与历史保存航线任务）
    this.$bus.$on('send:choiseTime', this.ChoiseTimeEvent)
    this.$bus.$on('send:editRouteTask', this.editRouteTask)
    this.$bus.$on('send:editRoute', this.doEdit)
    // 
    //测试



    // this.$EventBus.$on("update:DownCollapse", this.DownCollapse)
    // let that = this;
    // document.onkeydown = function (e) {
    //   // 事件对象兼容
    //   const key = e || event || window.event || arguments.callee.caller.arguments[0]
    //   // that.showToast('按下按键：' + key + ',Code:' + key.keyCode)
    //   that.sendKeyboardCommand(key.keyCode, true)
    // }
    // document.onkeyup = function (e) {
    //   // 事件对象兼容
    //   const key = e || event || window.event || arguments.callee.caller.arguments[0]
    //   // that.showToast('松开按键：' + key + ',Code:' + key.keyCode)
    //   that.sendKeyboardCommand(key.keyCode, false)
    // }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize()
    this.init();
    this.startDataCheckTimer(); // 在组件被挂载后启动检查数据定时器
    // this.startTimeoutCheckTimer(); // 在组件被挂载后启动超时提示定时器
    const CesiumMap = this.$refs.CesiumMap;
    if(CesiumMap){
        this.$refs.CesiumMap.handleOperation();
    }
  },
  // created() {},
  beforeDestroy() {
    // 
    this.$bus.$off('send:saveRouteToMinio');  //发送保存至minio
    this.$bus.$off('send:uploadRouteTouav');  // 上传至无人机（绘制航线与历史保存航线任务）
    this.$bus.$off('send:choiseTime');
    this.$bus.$off('send:readerKml');  // 上传至无人机（绘制航线与历史保存航线任务）
    this.$bus.$off('send:editRouteTask')
    this.$bus.$on('send:editRoute')
    // this.closeWebSocket();
    // 在组件销毁前清除定时器
    clearInterval(this.dataCheckTimer);
    // clearInterval(this.timeoutCheckTimer);
    this.stopTimer();
    this.stopTrtc();
    window.removeEventListener('resize', this.handleResize);
  },
  onDestroy() {
    // this.closeWebSocket();
    this.stopTimer();
    this.stopTrtc();


  },
  methods: {
    reElement() {
      console.log('this.$refs.opp', this.$refs.opp);

      this.$refs.opp.removeAttribute('v-op');
    },
    //#region  -----------------------------------------------worker------------------------------------------------------------

    // methods
    openOneThread(options) {
      options = options || {
        url: "uavs/getUavs",
        data: null,
        msg: "Start123456 processing!",
        method: "post",
        timeout: 3000,
      }
      this.worker = this.$worker // this.$worker.run(func, [args]?) 一次性的，自动销毁
        .run(
          (options) => {
            // 注意这里的函数是内部另一个线程空间的，不能从外部引入过来（内存空间隔离）

            let { url, msg, data, method, timeout } = options;
            console.log('options', options);
            return request({
              url: url,
              data: data,
              method: method,
              timeout: timeout,

            })

            // let res = getQuery(options)
            // let start = Date.now(); // console.time()和console.timeEnd()直接拿不到值，就换种方式
            // let res = fib(n);
            // let end = Date.now(); // window.performance.now()也不能用，因为没window对象
            // return [res, end - start]; // 返回数组，第一项是fib(44)的值，第二项是fib(44)递归计算用时
          },

        )
        .then((res) => {
          console.log("then", res); // 另一个线程执行完以后就能拿到结果了

        })
        .catch((err) => {
          console.log("err", err);

        });


    },
    // 点击这个方法 
    createWebWorker(options) {
      options = options || {
        url: "uavs/getUavs",
        data: null,
        msg: "Start123456 processing!",
        method: "post",
        timeout: 3000,
      }
      console.log(options, 'options----')
      // 创建一个新的 Web Worker requestWebworker
      const queryUvasWorker = new requestWebworker();
      queryUvasWorker.onmessage = (event) => {
        const {
          data,
          message,
          code
        } = event.data;
        queryUvasWorker.terminate(); // 在任务完成后终止 Worker
      };

      // 向 Worker 发送消息
      queryUvasWorker.postMessage(options);


    },

    //#endregion
    async init() {
      this.whoIsTaking = null;
      this.logo = null;
      this.queryAllUavs()
      // this.ChoiseTimeEvent()
    },
    // #region --------------------------------------------------------- 后台交互 发送http请求---------------------------------------------------------
    /**退出 */
    async logout() {
      this.$confirm("是否注销登录?", "提示", {
        confirmButtonText: "注销",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.logouting();
        })
        .catch(() => { });
    },
    async logouting() {
      this.disconnectWebSocket()
      removeToken();
      this.$router.push(`/login?` + Date.now());
    },
    /**查询所有无人机 */
    async queryAllUavs() {
      this.uavs = await this.queryAllUavsByMix()
      this.uavTypeInfo(this.uavs)
    },
    /**区分播种\巡检无人机 */
    uavTypeInfo(data = this.uavs) {
      if (!data || data.length <= 0) {
        return false;
      }
      this.setUavCount() //当前无人机数量
      // 检查LocalStorage中的"defaultUav"值
      let key = "defaultUav-" + this.userId;

      this.defaultUavSn = getDefaultData(key, data, 'uavId')
      this.defaultUavInfo = getDefaultObj(data, 'uavId', this.defaultUavSn)

      const newArray1 = []; // typeProtocol 为 1 的数组
      const newArray2 = []; // typeProtocol 为 2 的数组

      data.forEach(item => {
        if (item.efUavType.typeProtocol === 0) {
          newArray1.push(item);
        } else if (item.efUavType.typeProtocol === 1) {
          newArray2.push(item);
        }
      });
      this.inspectionUavs = newArray1
      this.seedingUavs = newArray2

    },

    //#endregion

    //#region -----------------------------------------------------------------------逻辑处理-----------------------------------------------------------------------------
    /**选中无人机 */
    async clickUavItem(item) {
      if (item.uavId === this.defaultUavSn) {
        // 如果点击的是当前已选中的 UAV，则不执行操作
        return;
      }
      let key = "defaultUav-" + this.userId;
      localStorage.setItem(key, item.uavId);
      this.defaultUavSn = item.uavId;
      this.defaultUavInfo = getDefaultObj(this.uavs, 'uavId', this.defaultUavSn)

      this.resetUavWs()
    },
    /**重置ws心跳数据 为空 */
    resetUavWs() {
      this.$store.dispatch('ws/ResetWsHeart')
    },
    acpectsend(data) {
      this.createARouteOrNot = data
    },


    /**切换dom(视频=地图) */
    switchMapOrVideo() {
      // console.log('切换视频');
      this.isMap = !this.isMap
      // 获取 <VideoModule> 元素的 DOM 引用 
      const videoModuleElement = this.$refs.VideoModule.$el;
      // 现在你可以对 videoModuleElement 进行操作，例如添加事件监听器等
      console.log(this.$refs.VideoModule);
      // console.log("VideoModule DOM:", videoModuleElement);
      var VideoModule = document.getElementById("VideoModule");
      // console.log('VideoModule', VideoModule);
      const CesiumMapElement = this.$refs.CesiumMap.$el
      switchNode(CesiumMapElement, videoModuleElement)

    },
    /** */
    current_change(currentPage) {
      this.currentPage = currentPage;
      this.currentIndex = null;
      this.currentTask = {};
    },
    /**点击选中 */
    changeColor(index, item) {
      // 点击事件处理程序，更新当前被点击元素的索引
      this.currentIndex = index;
      this.currentTask = item;

    },
    // 点击选择时间
    SelectTime(val) {
      const choiseTime = getTimeRangeByKey(val);
      this.currentIndex = null;
      this.currentTask = {};
      this.ChoiseTimeEvent(choiseTime)
      this.isActive = val
    },
    /**编辑历史航线信息 */
    doEdit(route, newName) {
      if (newName !== undefined) {

        this.$set(route, "kmzName", newName);
        this.$set(route, "edit", false);
        // this.$refs.routeManager.newName = route.mid

        this.editRouteTask(route, 'update')

      } else {
        // 执行不带 newName 的逻辑
        this.$set(route, "edit", true);
        // this.$refs.routeManager.newName = route.mid
      }
    },

    editRouteTask(route, type) {
      this.doMapLoading()
      let formdata = new FormData();
      formdata.append('id', route.id)
      let url = "uavs/editRouteTask"
      if (type == 'update') {
        formdata.append('name', route.kmzName)
      }

      this.$store.dispatch(url, formdata).then(response => {
        const { code, message, data } = response
        if (code === 1) {
          if (type == 'delet') {
            const index = this.tasksRoutes.findIndex(task => {
              return task.id == route.id
            })
            console.log(index, 'indexindex');
            if (index >= 0) {
              this.tasksRoutes.splice(index, 1)
            }
          }
          this.showMessage(message, "success");
        } else {
          this.showMessage(message, "warning");
        }
      }).catch(error => {

      }).finally(() => {
        this.maploading = false;
      })
    },

    //#endregion 

    //#region -------------------------------------------------无用-----------------------------------------------------------
    switchVideoCount(count) {
      if (this.bigView !== "uav") {
        this.videoActiveCount = 1;
        this.showToast('当前地图最大化状态下,不支持宫格画面切换。')
      } else {
        this.videoActiveCount = count;
        this.$nextTick(() => {
          this.initVideo(false);
        });
      }
    },
    async changeUav(sn) {
      this.refreshUavHeart(null);
      this.isCanOpterUav = false;
      this.uavTypeImage = null;
      if (sn == null || sn === '') {
        // 停止视频等...
      } else {
        let videoViews = this.$refs.videoViews;
        let hiveid = null;
        let item = null;
        for (var i = 0; i < this.uavs.length; i++) {
          let uav = this.uavs[i];
          if (uav.uavId === sn) {
            item = this.uavs[i];
            hiveid = uav.uavDefaultHiveId;
            try {
              this.uavTypeImage = require('@/assets/images/' + 'dji' + item.uavTypeId + '.png');
              // this.showMessage('图片路径：' + '@/assets/images/' + 'dji' + item.uavTypeId + '.png');
              // this.showMessage('图片路径：' + this.uavTypeImage);
            } catch (error) { }
          }
          // if (i < videoViews.length) {
          //   videoViews[i].setChecked((uav.uavId === sn));
          // }
          videoViews.setChecked((uav.uavId === sn));

        }
        // 判断当前无人机是否到期
        if (item != null) {
          if (this.roleInfo.roleId <= 2) {
            this.isCanOpterUav = true;
          } else {
            this.isCanOpterUav = this.getUavLimitText(item, 'bool')
          }
        }
        // 获取无人机对应停机坪
        await this.getHiveByUavId(sn, hiveid);
        let hiveVideo = this.$refs.hiveVideoView;
        if (hiveVideo != null) {
          hiveVideo.stop();
          if (this.isHasHive) {
            if (this.hiveHeartbeatNow.online) {
              hiveVideo.start();
            }
          }
        }
        if (this.videoActiveCount === 1) {
          this.initVideo(false);
        }
      }
    },
    getUavLimitText(uav, type) {
      let igGetTooltip = false
      let igGetBoolean = false
      if (type) {
        if (type === 'tooltip') {
          igGetTooltip = true
        } else {
          igGetBoolean = true
        }
      }
      let text = '-'
      let limitOfCompany = true //true表示已到期
      let limitOfUser = true //true表示已到期
      let limitOfCompanyTime = 0 //期限
      let limitOfUserTime = 0 //期限
      if (uav) {
        if (uav.limitOfCompany) {
          limitOfCompanyTime = uav.limitOfCompany
          if (uav.limitOfCompany > Date.now()) {
            limitOfCompany = false
          }
        }
        if (uav.limitOfUser) {
          limitOfUserTime = uav.limitOfUser
          if (uav.limitOfUser > Date.now()) {
            limitOfUser = false
          }
        }
      }
      if (limitOfCompany) {
        text = '已到期'
        if (igGetTooltip) {
          text = '公司授权已到期[' + this.$dateUtil.convertMillSecToYYYYMMDD(limitOfCompanyTime) + ']'
        }
      } else {
        if (limitOfUser) {
          text = '已到期'
          if (igGetTooltip) {
            text = '用户授权已到期[' + this.$dateUtil.convertMillSecToYYYYMMDD(limitOfUserTime) + ']'
          }
        } else {
          text = '正常'
          if (igGetTooltip) {
            text = '正常使用[' + this.$dateUtil.convertMillSecToYYYYMMDD(limitOfUserTime) + ']'
          }
        }
      }
      if (igGetBoolean) {
        // 都没有到期，则返回true
        return !limitOfCompany && !limitOfUser
      }
      return text
    },

    setUavCount() {
      this.numberAllUavCount = {
        number: [this.uavs.length],
        content: '{nt} 架'
      }
    },
    setUavOnlineCount() {
      this.numberOnlineUavCount = {
        number: [this.uavOnlineCount],
        content: '{nt}'
      }
    },
    cellClass(index) {
      switch (this.videoActiveCount) {
        case 1:
          return ['cell-player-1']
        case 4:
          return ['cell-player-4']
        case 6:
          if (index == 1)
            return ['cell-player-6-1']
          if (index == 2)
            return ['cell-player-6-2']
          if (index == 3)
            return ['cell-player-6-none']
          return ['cell-player-6']
        case 9:
          return ['cell-player-9']
        case 16:
          return ['cell-player-16']
        default:
          break;
      }
    },
    // 巡检记录 -- 通过变电站sn进行关联查询飞行 CESHI0000001
    async queryByStationSn(Sn, Name) {

      let startTime = Date.now() - 30 * 24 * 60 * 60 * 1000; // 默认有效期，一月
      let endTime = Date.now();
      try {
        let formdata = new FormData();
        formdata.append("stationSn", Sn)
        formdata.append("startTime", startTime)
        formdata.append("endTime", endTime)
        console.log('smsmmssss');
        console.log(formdata);
        await this.$store.dispatch("uav/queryByStationSn", formdata).then(response => {
          const {
            code,
            message,
            data
          } = response;
          if (code === 1) {
            this.flyedSorties = data
          } else {
            this.showMessage(message, 'warning');
          }
        }).catch((error) => {
          this.showMessage(error, "error");
        });
      } catch (error) {
      }
    },
    // 变电站 点击打开---选择
    openitem(item, index) {
      this.isShowDialogOpenItem = true
      this.pvForm = item
    },
    closeDialogitem() {
      this.isShowDialogOpenItem = false;
    },
    //   打开变电站总数与当前变电站
    clickSncount() {
      this.isShowDialogOpenSnCount = true
    },
    //   选取变电站 SelectSn 
    SelectSn(item, index) {
      let key = "defaultPvSn" + this.userId;
      // var jsonString = JSON.stringify(item);
      // localStorage.setItem(key,jsonString );
      this.mapUrl = item.modelB3dm

      localStorage.setItem(key, item.sn);
      this.selectSn = item.sn
      this.defaultSn = item.name
      this.queryByStationSn(item.sn, item.name)
      this.queryPvCurrentUav(item.sn)
      this.queryWrong(item.sn)
      this.switchSn(item.sn)
      this.isShowDialogOpenSnCount = false
    },
    // 打开 图片切换
    opensrcList(item) {
      const imgUrls = [];
      for (let i = 1; i <= 5; i++) {
        const imgUrl = item[`img${i}`];
        if (imgUrl !== null) {
          imgUrls.push(imgUrl);
        }
      }
      return imgUrls
    },
    // 变电站饼状图
    getRenderer() {
      // 基于准备好的dom，初始化echarts实例
      let EChart = this.$echarts.init(document.getElementById("EChartPie"));
      // 配置参数
      var option;
      option = {
        color: ['#FFD950', 'rgba(181,174,174,0.3)'],
        tooltip: {
          show: false, // 关闭鼠标移上去后显示浮框信息
          trigger: 'item',
          formatter: '{b}: {c}', // 显示标签的名称和数值
          textStyle: {
            fontSize: 8, // 字体大小
            fontWeight: 'bold', // 字体粗细
            fontStyle: 'italic', // 字体样式
            fontFamily: 'Arial, sans-serif' // 字体系列
          }
        },
        legend: {
          selectedMode: false,
          show: false,
          top: '5%',
          left: 'center'
        },
        series: [{
          hoverAnimation: false, // 取消掉环形图鼠标移上去时自动放大
          name: 'Access From',
          type: 'pie',
          radius: ['60%', '90%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center',
            textStyle: {
              fontSize: 20, // 字体大小
              fontWeight: 'bold', // 字体粗细
              color: '#333' // 字体颜色
            }
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 8,
              fontWeight: 'bold',
              formatter: function (params) {
                return '{a|' + params.name + '}\n\n{b|' + params.value + '%}';
              },
              rich: {
                a: {
                  fontSize: 12,
                  color: '#3DE7C9',
                  padding: [0, 5, 0, 0]
                },
                b: {
                  fontWeight: 'bolder',
                  fontSize: 16,
                  color: '#3DE7C9',
                  padding: [0, 0, 0, 5]
                }
              },

              textStyle: {
                color: '#3DE7C9' // 修改标签颜色为红色
              }
            }
          },
          labelLine: {
            show: false
          },
          data: this.pieChartInfo
        }]
      };
      EChart.setOption(option);
      // 注册默认显示
      EChart.dispatchAction({
        type: 'highlight',
        dataIndex: this.dataIndex
      }); // dataIndex：默认选中项索引值
      EChart.dispatchAction({
        type: 'showTip',
        seriesIndex: this.dataIndex,
        position: [120, 120],
        dataIndex: this.dataIndex
      }); // 点击生成detip工具条位置
      EChart.on('mouseover', (e) => {
        if (e.dataIndex !== this.dataIndex) { // 取消默认项选中状态
          EChart.dispatchAction({
            type: 'downplay',
            dataIndex: this.dataIndex
          });
        }
        this.dataIndex = e.dataIndex;
        EChart.dispatchAction({
          type: 'highlight',
          dataIndex: this.dataIndex
        }); // dataIndex：默认选中项索引值
        EChart.dispatchAction({
          type: 'showTip',
          seriesIndex: this.dataIndex,
          position: [120, 120],
          dataIndex: this.dataIndex
        }); // 点击生成detip工具条位置
      });
      // EChart.on('click',e=>{
      //   // 切换变电站详细
      //   this.switchSn(e)
      // })
    },
    // 初始显示饼状图--各个变电站百分百饼状图
    async showEchartPie() {
      this.statisticsloading = true
      try {
        await this.$store.dispatch("").then(response => {
          const {
            code,
            message,
            data
          } = response
          thhis.statisticsloading = false
          if (code === 1) {
            this.pieChartInfo = data
            if (data && data.length) {
              // 查询条形图该变电站统计详细 通过sn
              this.switchSn(data[0].sn)
            }
          } else {
            this.statisticsloading = false
          }
        })
      } catch (error) {
        this.statisticsloading = false
      }
    },
    // 切换 前后时间 
    async querySnErrorCount(time) {
      this.statisticsloading = true
      try {
        let formdata = new FormData();
        formdata.append("startTime", time.startTime)
        formdata.append("endTime", time.endTime)
        await this.$store.dispatch("", formdata).then(response => {
          this.statisticsloading = false
          const {
            code,
            message,
            data
          } = response;
          if (code === 1) {
            this.statisticsInfo = data
          } else {
            this.showMessage(message, 'warning');
          }

        }).catch(error => {
          this.statisticsloading = false
          this.showMessage(error, "error")
        })
      } catch (error) {
        this.showMessage(error, "error")
        this.statisticsloading = false
      }
    },
    // 切换变电站详细-点击-左侧条形图
    async switchSn(sn, time) {
      this.statisticsloading = true
      this.barChartInfo = []
      this.pieChartInfo = []
      try {
        let formdata = new FormData()
        // formdata.append("sn",'CESHI0000001')
        // formdata.append("startTime", time.startTime)
        // formdata.append("endTime", time.endTime)
        formdata.append('sn', sn)
        await this.$store.dispatch("pv/queryStatistics", formdata).then(response => {
          const {
            code,
            data,
            message
          } = response;
          this.statisticsloading = false
          if (code === 1) {
            this.statisticsInfo = data
            if (typeof data !== 'undefined' && data !== null) {
              // 条形图
              this.barChartInfo.push({
                key: '总异常数',
                value: data.exceptionCount + '个'
              })
              this.barChartInfo.push({
                key: '总飞行时间',
                value: this.statisticstime(data.flyingTime)
              })
              this.barChartInfo.push({
                key: '总架次数',
                value: data.sortie + '次'
              })
              if (data.Inspected > data.total) {
                this.pieChartInfo.push({
                  value: 0,
                  name: '未巡查'
                })
              } else {
                // 饼状图
                const altogether = data.total
                const inspected = data.Inspected
                const notInspected = altogether - inspected
                const inspectedresult = (inspected / altogether) * 100;
                const inspectedintegerValue = Math.floor(inspectedresult);
                const notInspectedresult = (notInspected / altogether) * 100;
                const notInspectedtegerValue = Math.floor(notInspectedresult);
                this.pieChartInfo.push({
                  value: notInspectedtegerValue,
                  name: '未巡查'
                })
                this.pieChartInfo.push({
                  value: inspectedintegerValue,
                  name: '已巡查'
                })
              }
            } else {
              this.barChartInfo.push({
                key: '总异常数',
                value: '0个'
              })
              this.barChartInfo.push({
                key: '总飞行时间',
                value: '0时'
              })
              this.barChartInfo.push({
                key: '总架次数',
                value: '0次'
              })
              this.pieChartInfo.push({
                value: 100,
                name: '未巡查'
              })
            }
            this.getRenderer()
          } else {
            this.showMessage(message, 'warning');
            this.statisticsloading = false
          }
        }).catch(error => {
          this.statisticsloading = false
          this.showMessage(error, "error")
        })
      } catch (error) {
        this.statisticsloading = false
      }
    },
    statisticstime(value) {
      let result = value + '秒'
      if (value >= 60) {
        result = (value / 60).toFixed(2) + '分'
      } else if (value >= 3600) {
        result = (value / 3600).toFixed(2) + '时'
      }
      return result
    },
    toFixed(data, num) {
      let dataNum = parseFloat(data)
      return (dataNum).toFixed(num)
    },
    //#endregion

    // #region --------------------------------------------------------- 实时参数 ---------------------------------------------------------
    startTimer() {
      // 将定时器名字赋值到变量中
      this.timer = setInterval(this.timerDoing, 5000);
    },
    stopTimer() {
      if (this.timer !== null) {
        clearInterval(this.timer);
        this.timer = null // 这里最好清除一下，回归默认值
      }
    },
    timerDoing() {
      // this.showToast('定时器执行中');
      if (this.whoIsTakingDate + 3000 < Date.now()) {
        this.whoIsTakingDate = Date.now();
        this.whoIsTaking = null;
      }
      //1、 定时对无人机在线状态进行检查
      let onlineCount = 0;
      for (let i = 0; i < this.uavs.length; i++) {
        if (this.uavs[i].receiveDataTime) {
          if (this.uavs[i].receiveDataTime + 10000 < Date.now()) {
            this.uavs[i].online = false; // 不在线
          } else {
            this.uavs[i].online = true;
            onlineCount++;
          }
        }
      }
      for (let i = 0; i < this.hives.length; i++) {
        if (this.hives[i].receiveDataTime) {
          if (this.hives[i].receiveDataTime + 10000 < Date.now()) {
            this.hives[i].online = false; // 不在线
          } else {
            this.hives[i].online = true;
          }
        }
      }
      this.uavOnlineCount = onlineCount;
      this.setUavOnlineCount();
    },
    // 更改1-9某个视频绑定的无人机 
    // 子模块切换 无人机
    switchVideoNo(streamNo, uavSn) {
      this.dialogVisibleChoiceVideoUrlIndex = streamNo;
      // 切换到那个无人机
      this.dialogVisibleChoiceVideoUrlUavSn = uavSn;
      this.dialogVisibleChoiceVideoUrl = true;
    },
    // 切换无人机---点击确认
    switchVideoNoFinlish() {
      this.dialogVisibleChoiceVideoUrl = false;
      let videoViews = this.$refs.videoViews;
      if (videoViews != null) {
        let i = this.uavs.findIndex(x => x.uavId === this.dialogVisibleChoiceVideoUrlUavSn);
        if (i >= 0) {
          let uav = this.uavs[i];
          // 修改defaultUavSn
          this.defaultUavSn = this.uavs[i].uavId
          videoViews.changeUav(uav.uavId, uav.uavName, uav.playUrl1, uav.streamType);
          videoViews.play();
        }

      }
    },


    // 默认无人机--视频窗口
    playvideo() {
      this.$nextTick(() => {
        let videoViews = this.$refs.videoViews;
        for (var i = 0; i < this.uavs.length; i++) {
          let uav = this.uavs[i];
          if (uav.uavId == this.defaultUavSn) {
            videoViews.setChecked((uav.uavId === this.defaultUavSn));
            videoViews.changeUav(uav.uavId, uav.uavName, uav.playUrl1, uav.streamType);
            if (uav.online == true) {
              videoViews.play();
            }
            break;
          }
        }
      });
    },

    // 初始化视频窗口
    initVideo(load) {
      this.stopAllVideo();
      let onlineCount = this.uavOnlineCount;
      if (load) {
        if (this.uavs.length <= 1) {
          this.videoActiveCount = 1;
        } else if (onlineCount >= 7) {
          this.videoActiveCount = 9;
        } else if (onlineCount >= 5) {
          this.videoActiveCount = 6;
        } else if (onlineCount >= 2) {
          this.videoActiveCount = 4;
        } else if (onlineCount == 0) {
          this.videoActiveCount = 4;
        } else {
          this.videoActiveCount = 1;
        }
      }
      this.$nextTick(() => {
        let videoViews = this.$refs.videoViews;
        if (videoViews != null && videoViews.length > 0) {
          if (videoViews.length == 1) {
            for (var i = 0; i < this.uavs.length; i++) {
              let uav = this.uavs[i];
              if (uav.uavId == this.defaultUavSn) {

                videoViews[0].setChecked((uav.uavId === this.defaultUavSn));
                videoViews[0].changeUav(uav.uavId, uav.uavName, uav.playUrl1, uav.streamType);
                if (uav.online == true) {
                  videoViews[0].play();
                }
                break;
              }
            }
          } else {
            for (var i = 0; i < this.uavs.length; i++) {
              let uav = this.uavs[i];
              if (i < videoViews.length) {
                videoViews[i].setChecked((uav.uavId === this.defaultUavSn));
                videoViews[i].changeUav(uav.uavId, uav.uavName, uav.playUrl1, uav.streamType);
                if (uav.online == true) {
                  videoViews[i].play();
                }
              }
            }
          }
        }
      });
    },


    stopAllVideo() {
      let videoViews = this.$refs.videoViews;

      // if (videoViews != null && videoViews.length > 0) {
      //   for (var i = 0; i < videoViews.length; i++) {
      //     videoViews[i].stop();
      //   }
      // }
      videoViews.stop();
    },
    // #endregion

    // #region  --------------------------------------------------------- 视   频 ---------------------------------------------------------
    async initLocalStream() {
      try {
        if (this.clientTrtc != null && this.trtcLocalStream != null) {
          await this.clientTrtc.unpublish(this.trtcLocalStream);
          console.log('本地流已取消！');
          this.trtcLocalStream = null;
        }
        const {
          roomUserId
        } = this.trtcModel;
        this.trtcLocalStream = TRTC.createStream({
          roomUserId,
          audio: true,
          video: false
        }); //创建本地音视频流
        await this.trtcLocalStream.initialize();
        console.log('初始化本地流成功');
        // 播放本地流，'local_stream' 是在 DOM 中的一个 div 标签的 ID
        //this.trtcLocalStream.play('local_stream');
        try {
          await this.clientTrtc.publish(this.trtcLocalStream);
          console.log('本地流发布成功');
        } catch (error) {
          console.error('本地流发布失败 ' + error);
        }
      } catch (error) {
        console.error('初始化本地流失败 ' + error);
      }
    },
    async muteLocalAudio(mute) {
      if (mute) {
        this.isTrtcSpeekEnabled = mute;
      } else {
        this.isTrtcSpeekEnabled = !this.isTrtcSpeekEnabled;
      }
      if (this.clientTrtc != null && this.trtcLocalStream != null) {
        if (this.isTrtcSpeekEnabled) {
          this.trtcLocalStream.unmuteAudio(); // 启用音频轨道
        } else {
          this.trtcLocalStream.muteAudio(); // 静音
        }
      }
    },
    // 静音所有远端流
    async muteRemoteAudio(mute) {
      if (mute) {
        this.isTrtcVoiceEnabled = mute;
      } else {
        this.isTrtcVoiceEnabled = !this.isTrtcVoiceEnabled;
      }
      if (this.clientTrtc != null && this.trtcRemoteStreamArray != null && this.trtcRemoteStreamArray.length > 0) {
        for (var i = 0; i < this.trtcRemoteStreamArray.length; i++) {
          if (this.isTrtcVoiceEnabled) {
            this.trtcRemoteStreamArray[i].remoteStream.unmuteAudio(); // 启用音视频播放
          } else {
            this.trtcRemoteStreamArray[i].remoteStream.muteAudio(); // 静音播放
          }
        }
      }
    },
    async initRemoteStream() {
      if (this.clientTrtc != null) {
        this.trtcRemoteStreamArray = [];
        this.clientTrtc.off('stream-added', this.trtcStreamAdded);
        this.clientTrtc.off('stream-subscribed', this.trtcStreamSubscribed);
        this.clientTrtc.off('stream-updated', this.trtcStreamRemoved);
        this.clientTrtc.off('stream-removed', this.trtcStreamRemoved);

        // 通过监听‘stream-added’事件获得远端流对象
        this.clientTrtc.on('stream-added', this.trtcStreamAdded);
        // 监听‘stream-subscribed’事件
        this.clientTrtc.on('stream-subscribed', this.trtcStreamSubscribed);
        // 监听‘stream-updated’事件
        this.clientTrtc.on('stream-updated', this.trtcStreamRemoved);
        // 监听‘stream-removed’事件
        this.clientTrtc.on('stream-removed', this.trtcStreamRemoved);
      }
    },
    trtcStreamAdded(event) {
      const remoteStream = event.stream;
      // const remoteUserId = remoteStream.getUserId();
      // console.log('received a remoteStream ID: ' + remoteStream.getId() + ' from user: ' + remoteUserId);
      // 若需要观看该远端流，则需要订阅它
      // 若不需要观看该远端流，请取消订阅它，否则SDK会接收远端流数据。
      // this.clientTrtc.unsubscribe(remoteStream);
      this.clientTrtc.subscribe(remoteStream);
      if (this.isTrtcVoiceEnabled) {
        remoteStream.unmuteAudio(); // 启用音频轨道
      } else {
        remoteStream.muteAudio(); // 静音
      }
      // this.trtcRemoteStreamArray.push({ id: remoteStream.getId(), remoteStream: remoteStream });
      // console.log('----------------------------------当前订阅流数量 + ：' + this.trtcRemoteStreamArray.length);
    },
    trtcStreamSubscribed(event) {
      // console.log('远端流订阅', event);
      const remoteStream = event.stream;
      // console.log('远端流订阅成功：' + remoteStream.getId());
      // 播放远端流
      // remoteStream.play('remote_stream-' + remoteStream.getId());
      if (this.isTrtcVoiceEnabled) {
        remoteStream.play('remote_stream_play_view');
      }
      let index = this.trtcRemoteStreamClient.findIndex(x => x.userId === remoteStream.getUserId())
      if (index >= 0) {
        let temp = this.trtcRemoteStreamClient[index];
        temp.hasAudio = remoteStream.hasAudio();
        temp.hasVideo = remoteStream.hasVideo();
        temp.talking = true;
        this.$set(this.trtcRemoteStreamClient, index, temp);
      }
      this.whoIsTaking = remoteStream.getUserId() + "正在讲话";
      this.whoIsTakingDate = Date.now();
    },
    trtcStreamUpdated(event) {
      const remoteStream = event.stream;
      // console.log('remoteStream ID: ' + remoteStream.getId() + ' was updated hasAudio: ' + remoteStream.hasAudio() + ' hasVideo: ' + remoteStream.hasVideo());
    },
    trtcStreamRemoved(event) {
      const remoteStream = event.stream;
      // let index = this.trtcRemoteStreamArray.findIndex(x => x.id === remoteStream.getId());
      // if (index >= 0) {
      //     this.trtcRemoteStreamArray.splice(index, 1);
      // }
      // console.log('----------------------------------当前订阅流数量 - ：' + this.trtcRemoteStreamArray.length);
      // 停止播放并删除相应<video>标签
      let index = this.trtcRemoteStreamClient.findIndex(x => x.userId === remoteStream.getUserId())
      if (index >= 0) {
        let temp = this.trtcRemoteStreamClient[index];
        temp.talking = false;
        this.$set(this.trtcRemoteStreamClient, index, temp);
      }
    },
    async stopTrtc() {
      if (this.clientTrtc != null) {
        try {
          if (this.trtcLocalStream != null) {
            await this.clientTrtc.unpublish(this.trtcLocalStream);
          }
          await this.clientTrtc.leave();
          this.clientTrtc.destroy();
          this.clientTrtc = null;
        } catch (error) {
          console.error('退出房间失败' + error);
          this.showToast('退出房间失败' + error);
        }
      }
      this.isTrtcEnabled = false;
      // 退房成功，可再次调用 this.clientTrtc.join 重新进房开启新的通话。  
    },
    // #endregion

    // #region --------------------------------------------------------- KMZ ---------------------------------------------------------
    filtersType(val) {
      return filtersType(val);
    },
    parseTime(date) {
      return parseTime(date)
    },
    rgba(ok, rgba) {
      setTimeout(() => {
        this.maploading = ok
      }, 300);
      this.loadingBackground = `rgba(0, 0, 0, ${rgba})`

    },
    handleResize() {
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer);
      }
      this.resizeTimer = setTimeout(() => {
        const divElement = this.$refs.mainleft;
        console.log(divElement);
        console.log(Object.keys(divElement));
        const height = divElement.clientHeight;
        const width = divElement.clientWidth;
        console.log('height:', height, 'width:', width);
        const computedStyle = window.getComputedStyle(divElement);
        const backgroundColor = computedStyle.backgroundColor;
        const fontSize = computedStyle.fontSize;
        // console.log('背景颜色:', backgroundColor, '字体大小:', fontSize);
        // divElement.style.fontSize = '20px'; // 修改字体大xiao
        // const mainMiddleElement=this.$refs.mainMiddle;
        this.divHeight = height - 2;
        console.log('Div height:', height);
      }, 290); // 节流延迟时间，单位为毫秒
    },

    getDivHeight() {
      const divElement = this.$refs.mainleft;
      const height = divElement.clientHeight;
      console.log('Div height:', height);
    },
    throttledHandleButtonClick: _throttle(function () {
      this.getDivHeight();
    }, 200), // 指定节流的等待时间
    // 秒分转
    convertSecondToTime(date) {
      return this.$dateUtil.convertSecondToTime(date);
    },
    // 里程
    convertMeterToFrendly(meter) {
      return this.$toolUtil.convertMeterToFrendly(meter);
    },
    //是否可以转数字
    checkIsNaN(num) {
      if (!isNaN(num)) {
        var num2 = parseInt(num); // 123
        switch (num2) {
          case 0:
            return '增稳模式'
            break;
          case 3:
            return '任务模式'
            break;
          case 5:
            return '悬停模式'
            break;
          case 4:
            return '指点模式'
            break;
          case 6:
            return '返航模式'
            break;
          case 9:
            return '降落模式'
            break;
          case 16:
            return '位置锁定'
            break;
          case 2:
            return '定高模式'
            break;
          default:
            return 'GPS姿态模式'
            break;
        }
      } else {
        return num
      }

    },
    async showKmz() {
      this.isDialogKmz = true;
      this.kmzFileList = [];
      try {
        this.loadingKmz = true;
        return this.$store
          .dispatch('efTaskKmz/queryAllByCid')
          .then((response) => {
            this.loadingKmz = false;
            const {
              code,
              message,
              data
            } = response;
            if (code === 1 && data) {
              this.kmzFileList = data;
            } else {
              this.showToast(message);
            }
          })
          .catch(() => {
            this.loadingKmz = false;
          });
      } catch (e) {
        this.loadingKmz = false;
      }
    },
    beforeMoreHandleCommandKmz(item, index, command) {
      return {
        "item": item,
        "index": index,
        "command": command
      };
    },
    async MoreHandleCommandKmz(parms) {
      const {
        item,
        index,
        command
      } = parms
      if (command == 'export') { } else if (command == 'delete') { } else if (command == 'rename') { } else if (command == 'upload') {
        this.beforeUploadKmzToUav(item.kmzName, item.kmzPath, item.kmzSize)
      }
    },
    // 上传Kmz航线任务至无人机
    async beforeUploadKmzToUav(kmzName, kmzPath, kmzSize) {
      await this.uploadKmzToUav(this.defaultUavSn, kmzPath, kmzSize);
    },
    // 上传给无人机测试
    async uploadKmzToUav(uavId, kmzPath, kmzSize) {
      try {
        this.isDialogKmz = false;
        this.loading = true;
        return this.$store
          .dispatch('efTaskKmz/uploadKmzToUav', {
            uavId: uavId,
            path: kmzPath,
            size: kmzSize
          })
          .then((response) => {
            this.loading = false;
            const {
              code,
              message,
              data
            } = response;
            if (code === 1) {
              this.showToast(message);
            } else {
              this.showToast(message);
            }
          })
          .catch((e) => {
            this.loading = false;
            this.showToast(e)
          });
      } catch (e) {
        this.loading = false;
        this.showToast(e)
      }
    },

    uploadKmzBefore(kmzTask = this.currentTask, uavId = this.defaultUavSn) {
      if (!kmzTask || !kmzTask.kmzPath) {
        this.showMessage('请选择航线', "warning");
        return;
      }
      const requestMap = {
        text: "确认上传无人机" + uavId + '?',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        void: () => { }
      }
      this.uploadUavVisible = true
    },
    handleCancelClick() {
      this.uploadUavVisible = false;
      this.kmzCurrentIndex = 0;
    },
    handleSumitClick() {
      this.uploadUavVisible = false;
      this.uploadTaskToUav()
    },
    // #endregion

    // #region --------------------------------------------------------- 地   图 ---------------------------------------------------------

    doLoading(ok) {
      this.maploading = ok
    },

    setMapCenter(lat, lng, zoom) {
      const latlng = this.$gisUtil.ConvertGpsToAmap(lat, lng)
      if (latlng.lng !== 0 && latlng.lat !== 0) {
        this.centerPosition = [latlng.lng, latlng.lat]
      }
      if (zoom) {
        this.zoom = zoom
      }
    },
    changeBig(type) {
      let maxView = document.getElementById("divBig"); // 大 div
      let miniViewUav = document.getElementById("divSmallUav"); // 无人机视频所在div
      let miniViewHive = document.getElementById("divSmallHive"); // 停机坪视频所在div
      let uavVideoNeedRefresh = true;
      if (type === "map") {
        if (this.bigView === "uav") {
          this.changePostion(miniViewUav, maxView);
          this.bigView = "map";
        } else if (this.bigView === "map") {
          this.changePostion(miniViewUav, maxView);
          this.bigView = "uav";
        } else {
          // 当前最大的是停机坪的视频
          this.changePostion(miniViewHive, maxView);
          this.changePostion(miniViewUav, maxView);
          this.bigView = "map";
        }
      } else if (type === "hive") {
        if (this.bigView === "map") {
          this.changePostion(miniViewHive, maxView);
          this.bigView = "hive";
          uavVideoNeedRefresh = false;
        } else if (this.bigView === "hive") {
          this.changePostion(miniViewHive, maxView);
          this.bigView = "map";
          uavVideoNeedRefresh = false;
        } else {
          // 当前最大的是无人机的视频
          this.changePostion(miniViewHive, maxView);
          this.changePostion(miniViewUav, maxView);
          this.bigView = "hive";
        }
      } else { }
      if (uavVideoNeedRefresh) {
        this.stopAllVideo();
        this.videoActiveCount = 1;
        // this.$nextTick(function() {
        //     this.initVideo(false);
        // });
        this.$nextTick(() => {
          let videoViews = this.$refs.videoViews;
          if (videoViews != null && videoViews.length > 0) {
            let isbreak = false;
            for (var i = 0; i < videoViews.length; i++) {
              for (var j = 0; j < this.uavs.length; j++) {
                let uav = this.uavs[j];
                if (uav.uavId === this.defaultUavSn) {
                  isbreak = true;
                  videoViews[i].setChecked(true);
                  videoViews[i].changeUav(uav.uavId, uav.uavName, uav.playUrl1, uav.streamType);
                  if (uav.online == true) {
                    videoViews[i].play();
                  }
                }
              }
              if (isbreak) {
                break;
              }
            }
          }
        });
      }
    },
    changePostion(view1, view2) {
      let view1Parent = view1.parentNode;
      let view2Parent = view2.parentNode;
      let index1 = Array.prototype.indexOf.call(view1Parent.children, view1);
      let index2 = Array.prototype.indexOf.call(view2Parent.children, view2);
      // console.log("父节点1：" + view1Parent + "父节点2：" + view2Parent + "，索引1：" + index1 + "，索引2：" + index2)
      view2Parent.insertBefore(view1, view2Parent.children[index2]);
      view1Parent.insertBefore(view2, view1Parent.children[index1]);
      //  document.body.replaceChild(view1, view2);
    },
    getUavTitle(item) {
      let title = '无人机'
      if (item && item != null) {
        title = '名称:' + item.uavName +
          '\r\n编号:' + item.uavId +
          '\r\n状态:' + ((item.online && item.online === true) ? '在线' : '离线')
      }
      return title
    },
    getUavMarkerVisble(item) {
      let visble = false
      if (item) {
        if (item.heartbeatData && item.heartbeatData != null) {
          if (!item.heartbeatData.lat || !item.heartbeatData.lng) { }
          if (item.heartbeatData.lat === 0 || item.heartbeatData.lng === 0) { }
          visble = true
        }
      }
      return visble
    },
    getMarkerUavPostion(item) {
      let position = [0, 0]
      if (item) {
        if (item.heartbeatData && item.heartbeatData != null) {
          if (!item.heartbeatData.lat || !item.heartbeatData.lng) { }
          if (item.heartbeatData.lat === 0 || item.heartbeatData.lng === 0) { }
          const temp = this.$gisUtil.ConvertGpsToAmap(item.heartbeatData.lat, item.heartbeatData.lng)
          position = [temp.lng, temp.lat]
        }
      }
      return position
    },
    getUavIco(uav) {
      let ico = null
      if (uav) {
        if (uav.heartbeatData && uav.heartbeatData != null) {
          if (!uav.heartbeatData.lat || !uav.heartbeatData.lng) { }
          if (uav.heartbeatData.lat === 0 || uav.heartbeatData.lng === 0) { } else {
            if (uav.isOnline && uav.heartbeatData.areMotorsOn === 1) ico = this.djiUavOnline
            else ico = this.djiUavOffline
          }
        }
      }
      return ico
    },
    getMarkerUavRoute(uav) {
      let yaw = 0
      if (uav) {
        if (uav.heartbeatData && uav.heartbeatData != null) {
          if (uav.heartbeatData.yaw) {
            return uav.heartbeatData.yaw
          }
        }
      }
      return yaw
    },
    //#endregion

    // #region --------------------------------------------------------- 组件命令 --------------------------------------------------------- 
    /**执行飞行 */
    doFlyCommandsEvent() {
      this.startMission()
    },
    /**执行飞行 */
    senddoFlyCommandsEvent(data) {
      this.startMission(data) //1006
    },
    //#endregion


    // #region ----------------------------------------------------------Uav执行、起飞、返航控制指令=-----------------------------------------------------------


    handleFolderSelect(event) {
      this.file = event.target.files[0];
      console.log(this.file);
    },


    /**发送消息通用 */
    sendMessage() {
      //定义发送信息 
      const evts = new CustomEvent('sendmsg', {
        detail: {
          mid: 'id',
          positions: 'uniqueArray', //jdArrs
        }
      })
      document.dispatchEvent(evts)
    },

    doMapLoading() {
      if (this.maploading) {
        this.$gtmessage.warning('等待上一请求中');
        return;
      }
      this.maploading = true
      this.loadingText = '请求执行中'
    },
    /**执行上传航线 */
    sendRouteToUav(route, type) {
      /**清除以前执行保存vuex */
      this.doMapLoading()
      /**清除以前存在巡检的信息 */
      this.$store.dispatch('ws/cleardefaultUavImageData', { uavId: this.defaultUavSn })

      if (type === 'tasks') {
        this.uploadTaskToUav(route, this.defaultUavSn)
      } else if (type === 'drow') {
        this.uploadMission(route, this.defaultUavSn)
      }
    },



    /**上传航线值无人机 */
    async uploadMission(route, uavId = this.defaultUavSn) {
      try {
        const parms = {
          uavId: uavId,
          altType: 0,
          takeoffAlt: route.unifiedHeight, //unifiedHeight
          homeAlt: 30, // 如果不需要传递homeAlt，可以设置为null
          startTime:route.startTime,
          endTime:route.endTime,
          speed:route.speed,
          spacing: route.spacing || 2,
        };
        const data = {
          'mission': route.positions,
          'formdata': parms,
        };

        await this.$store.dispatch("uavs/uploadMission", data).then((response) => {
          const { code, message, data } = response;
          if (code === 1) {
            const { mid, positions, unifiedHeight, text , startTime ,endTime ,speed } = route
            this.$store.dispatch("routeData/setRouteData", { mid, geoCoordinates: positions, unifiedHeight }); // 存储store
            this.showMessage(message, "success");
          } else {
            this.showMessage(message, "warning");
          }
        })
          .catch((error) => {

            this.showMessage(error, "error");
          });
      } catch (error) {
      } finally {
        this.maploading = false;
      }
    },
    /**历史保存航线任务上传无人机 */
    async uploadTaskToUav(kmzTask = this.currentTask, uavId = this.defaultUavSn) {
      try {
        if (!kmzTask || !kmzTask.kmzPath) {
          this.showMessage('请选择航线', "warning");
          return;
        }
        this.loadingText = '请求执行中'
        this.maploading = true;
        let formdata = new FormData();
        formdata.append('url', kmzTask.kmzPath)
        formdata.append('altType', 0);
        formdata.append('homeAlt', 30);
        formdata.append('uavId', uavId)
        formdata.append('currentIndex', this.kmzCurrentIndex)
        formdata.append('kmzId', kmzTask.id)

        await this.$store.dispatch("uavs/uploadTaskToUav", formdata).then((response) => {
          const { code, message, data } = response;
          if (code === 1) {
            this.showMessage(message, "success");
          } else {
            this.showMessage(message, "warning");
          }
        }).catch((error) => {
          this.showMessage(error, "error");
        });
      } catch (error) {
      } finally {
        this.maploading = false;
      }
    },
    /**解析kmlhangx */
    async readerKml(kmzTask = this.currentTask) {
      try {
        if (!kmzTask || !kmzTask.kmzPath) {
          this.showMessage('请选择航线', "warning");
          return;
        }
        this.maploading = true;
        let formdata = new FormData();
        formdata.append('Url', kmzTask.kmzPath)
        formdata.append('mid', kmzTask.id)
        await this.$store.dispatch("uavs/readerKml", formdata).then((response) => {
          const { code, message, data } = response;
          if (code === 1) {
            this.showMessage(message, "success");
            const positions = data.coordinateslist
            const mid = data.mid;
            const unifiedHeight = data.unifiedHeight
            let CesiumMap = this.$refs.CesiumMap;
            if (CesiumMap) {
              this.$refs.CesiumMap.drawLines(positions);
            }
          } else {
            this.showMessage(message, "warning");
          }
        }).catch((error) => {
          this.showMessage(error, "error");
        });
      } catch (error) {
      } finally {
        this.maploading = false;
      }
    },
    /**保存航线 */
    sendsaverouteInfo(route, speed, uavId = this.defaultUavSn) {
      //可能有一个text用于保存航线名称
      const { mid, text, positions, unifiedHeight } = route
      console.log('route, speed', route, speed);

      //保存minio
      //  text = text || mid;
      const name = (typeof text === 'string') ? text : mid;
      // console.log('保存route', route, 'name:', name);
      this.maploading = true;
      const parms = {
        uavId: uavId,
        altType: 0, //
        takeoffAlt: route.unifiedHeight, //unifiedHeight
        homeAlt: 30, // 如果不需要传递homeAlt，可以设置为null
        name: name,
        speed: speed,
        startTime : route.startTime,
        endTime : route.endTime

      };
      const data = {
        'mission': route.positions,
        'formdata': parms,
      };
      this.$store.dispatch('uavs/saveRouteToMinio', data).then(response => {
        const { code, message, data } = response;
        if (code === 1) {
          this.showMessage(message, "success");
        } else {
          this.showMessage(message, "warning");
        }
      }).catch((error) => {
        this.showMessage(error, "error");
      }).finally(() => { // 修正此行，将 finally 块改为箭头函数
        this.maploading = false;
      });

    },
    /**查询每一段时间点的任务*/
    async ChoiseTimeEvent(choiseTime) {
      try {
        this.tasksLoading = true
        this.tasksRoutes = [];
        // 时间戳大1000倍
        const startTime = choiseTime && choiseTime[0] ? new Date(choiseTime[0]).getTime() : (Date.now() - 30 * 24 * 60 * 60 * 1000); //   console.log(startTime);
        const endTime = choiseTime && choiseTime[1] ? new Date(choiseTime[1]).getTime() : Date.now();
        let formdata = new FormData();
        formdata.append("startTime", startTime);
        formdata.append("endTime", endTime);
        await this.$store.dispatch("uavs/queryKmzInfo", formdata).then(response => {
          const { code, message, data } = response;
          if (code === 1) {
            // this.tasksRoutes = data || []; // 返回数据

            const dataCopy = data.slice() || [];
            this.tasksRoutes = sortDataByPrefix(dataCopy);
            // this.tasksRoutes.sort(customSort);

          } else {
            this.showMessage(message, "warning");
          }
        })
      } catch (error) {
        this.showMessage(error, "error");
      } finally {
        this.tasksLoading = false
      }
    },
    /**执行任务指令 1006 */
    async startMission(command) {
      try {
        const RequestBody = {
          hiveId: "",
          timeout: 10,
          command: command,
          tag: 2,
          uavId: this.defaultUavSn,//'1ZNBJ5F00C008L',
          parm1: 0,
          parm2: 0,
          parm3: 0,
          parm4: 0,
        };
        this.doMapLoading()
        await this.$store.dispatch("uavs/startMission", RequestBody).then((response) => {
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
      } finally {
        this.maploading = false
      }
    },
    /** 暂停任务 */
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
        this.doMapLoading()
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
      } finally {
        this.maploading = false
      }
    },
    /**停止任务 */
    async stopMission(command) {
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
        this.doMapLoading()
        await this.$store.dispatch("uavs/stopMission", RequestBody).then((response) => {
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
      } finally {
        this.maploading = false
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
        })
          .catch((error) => {
            this.showMessage(error, "error");
          });
      } catch (error) {
        this.showMessage(error, "error");
      } finally {
        this.maploading = false
      }
    },
    /**起飞无人机指令 1100 */
    async takeoff(command) {
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
        this.doMapLoading()
        await this.$store.dispatch("uavs/takeoff", RequestBody).then((response) => {
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
      } finally {
        this.maploading = false;
      }
    },
    /**降落 */
    async land(command) {
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
        this.doMapLoading()
        await this.$store.dispatch("uavs/takeoff", RequestBody).then((response) => {
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
      } finally {
        this.maploading = false;
      }
    },
    /**返航 1102 无人机为相应 */
    async rtl(command) {
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
        this.doMapLoading()
        await this.$store.dispatch("uavs/rtl", RequestBody).then((response) => {
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
      } finally {
        this.maploading = false
      }
    },


    // #endregion


    // #region --------------------------------------------------------- websocket ---------------------------------------------------------
    onopenWebSocket() {
      const data = { id: '101', token: store.getters.token, }
      this.$store.dispatch('ws/onopenWebSocket', data)
    },
    disconnectWebSocket() {
      console.log('退出ws断开连接');
      this.$store.dispatch('ws/disconnectWebSocket') // ws断开连接
    },



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
        // console.log('initWebSocket 2')
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
      // console.log('接收websocket数据' + e.data)
      const edata = e.data
      console.log(edata);
      let index = -1 // 当前无人机在数组中的索引
      let isNowUav = false // 是不是默认无人机
      let isNowHive = false // 是不是默认



      const resultUtil = JSON.parse(e.data)


      //数据 存储 store  
      // const  webSocketMsg= resultUtil
      // this.$store.dispatch("publicData/setSocketData",webSocketMsg) 

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
        case 2000: // 大疆无人机心跳包
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
          // console.log('3秒内未收到数据,执行清空'); // 如果3秒内未收到数据，则输出提示信息 

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

  }


}
