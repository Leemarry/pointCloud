import { mapGetters } from 'vuex'
import Cookies from 'js-cookie'
import { parseTime } from '@/utils/index'
import $ from 'jquery'
import uav from '@/store/modules/uav'
// <!-- getMyUavHive 返回的是EfRelationUserUav、EfRelationUserHive 关系表 -->

export default {
    name: 'index',
    data() {
        const self = this
        return {
            centerPosition: [114.5273285, 30.56789], // 用户当前位置经纬度
            zoom: 16,
            ProgressShow: '离线',
            ttlMessage: null, // ttl语音播放对象
            ProgressShowTime: 0, // 刷新的时间戳，超过30秒则赋值为空
            djiUavOnline: require('@/assets/images/uavOnline.png'),
            djiUavOffline: require('@/assets/images/uavOffline.png'),
            efUavOnline: require('@/assets/images/uavOnline.png'),
            efUavOffline: require('@/assets/images/uavOffline.png'),
            hiveOnline: require('@/assets/images/hiveOnline.png'),
            hiveOffline: require('@/assets/images/hiveOffline.png'),
            t16000: require('@/assets/images/T16000.png'),
            formLabelWidth: '50px',
            fileListKml: [],
            webSocket: null,
            isLeftFold: false,
            isRightFold: false,
            loading: false,
            loadingWps: false,
            loadingText: '拼命干活中...',
            taskWps: [], // 航线任务
            messageType: 'info',
            isShowMessageTip: false,
            messageTip: '拼命干活中',
            isShowUavs: false,
            isCanOpter: false, // 是否可以操作无人机或停机坪
            isShowThisUavHives: false,
            isEditWps: false,
            isEditGrid: false,
            isEditGridChoiceStartPoint: false,
            isDialogEditWp: false,
            isDialogEditWps: false,
            isDialogConfig: false,
            isDialogTasks: false,
            isDialogEditDjiAction: false,
            isSendRemoteData: false,
            mapStyle: 'normal', // 地图样式，支持normal（默认样式）、dark（深色样式）、light（浅色样式）、fresh(osm清新风格样式)四种
            bigView: 'map',
            isMapFollowUav: true,
            isFirstGpsFixed: false, // 第一次定位，刷新位置到无人机位置
            isShowUavFlyedPath: true,
            isShowHiveVideo: true,
            isHasHive: false, // 当前无人机是否有停机坪
            // 视频
            isVideo1MouseOver: false,
            isVideo2MouseOver: false,
            isRequestStream1: false,
            isRequestStream2: false,
            textRequestStream1: '加载中',
            textRequestStream2: '加载中',
            TcPlayerUav: null, // 无人机视频播放控件
            TcPlayerHive: null, // 停机坪视频播放控件
            markerUavsModel: [], // 多无人机图标
            markerOthersModel: [{
                index: 0,
                tag: '',
                lat: 0,
                lng: 0
            }], // 其它特殊图标，通过tag区分
            hives: [],
            uavs: [],
            hivesNowUav: [],
            // 当前选中的无人机
            selectedUavItem: {},
            // 当前选中的停机坪
            selectedHiveItem: {},
            // 当前选择的无人机类型 ，1 大疆，2 翼飞，3 xxx
            selectedUavType: 2,
            // 遥控器
            // 键盘按键
            lastPressKeyCode: -1,
            moveSpeed: 3,
            moveMinSpeed: 0.5, // 摇杆操作运动速度范围
            moveMaxSpeed: 10, // 摇杆操作运动速度范围
            isYuntaiMode: true, // 默认为拍照模式，false为录像模式
            isDoingCommand: false, // 是否正在执行动作命令
            isRemoteConnect: false,
            isRemoteEnable: false,
            isDialogRemote: false,
            isDialogRemoteHelp: false,
            timerSendRemoteData: false,
            timerSendPanData: null, // 按下按钮时，需要定时发送数据
            remoteAxis: [],
            remoteButtons: [],

            isKeyboardKeydown: false,
            roll: 0,
            pitch: 0,
            yaw: 0,
            alt: 0,
            rollKey: 0,
            pitchKey: 0,
            yawKey: 0,
            altKey: 0,
            rollYuntai: 0,
            pitchYuntai: 0,
            yawYuntai: 0,

            timerRefreshUi: null, // 定时器名称,
            markerOffset: [-13, -13],
            markerGridOffset: [-10, -10],
            markerUavHiveOffset: [-32, -32],
            defaultWpParm: { // 默认航线值
                type: 'ef', // ef,dji
                command: 16,
                action: 0,
                alt: 30
            },
            efCommands: [], // 翼飞命令
            djiActions: [], // 大疆动作
            editWpDialogModel: {}, // 当前编辑的航点对象
            editWpDjiActionDialogModel: {
                action: 0,
                parm: 0
            }, // 编辑大疆指令
            //  修改全部航点
            editWpsDialogModel: {
                type: 0, // 0:高度，1：命令
                wpAlt: 30,
                wpAction: 16,
                wpDjiActions: ''
            },
            grids: [],
            gridsWps: [],
            wpsPath: [],
            gridAutoParms: {
                alt: 50,
                homePos: { lat: 0, lng: 0 },
                spacing: 50,
                headSpacing: 30,
                yaw: 90,
                outlineDistance: 0
            },
            // 航点数组
            wps: [{
                wpIndex: 0,
                wpLat: 0,
                wpLng: 0,
                wpAlt: 0,
                wpAltAbs: 0,
                wpAction: 0,
                wpDjiActions: '',
                wpParm1: 0,
                wpParm2: 0,
                wpParm3: 0,
                wpParm4: 0
            }],
            wpsGotoWaypointModeOptions: [{ label: '空', value: 0 }],
            wpsHeadingModeOptons: [{ label: '空', value: 0 }],
            wpsFlightPathModeOptions: [{ label: '空', value: 0 }],
            wpsFinishedActionOptions: [{ label: '空', value: 0 }],
            wpsRcSignalLostOptions: [{ label: '空', value: 0 }],
            wpsInfo: { // 当前任务的描述，航程，飞行时长等
                wpsName: '',
                wpsType: 0, // 0 翼飞，1 大疆
                wpsLat: 30.456,
                wpsLng: 114.567,
                wpsAlt: 30,
                wpsDistance: 0,
                wpsUserTime: 0,
                wpsWpCount: 0,
                wpsLocation: '湖北省武汉市',
                wpsAltAbs: 0,
                wpsDes: '任务描述',
                wpsSpeed: 5, // 任务飞行速度
                wpsMaxSpeed: 15, // 最大速度
                wpsRcSignalLost: 0, // 遥控信号丢失
                wpsFinishedAction: 1, // 任务结束后执行动作
                wpsFlightPathMode: 0, // 航点或曲线航点
                wpsGotoWaypointMode: 0, // 如何飞到第一个航点
                wpsHeadingMode: 0, // 机头朝向
                wpsRepeatTimes: 1 // 任务执行次数
            },
            // mapRangingTool: {},
            mapTools: {},
            isMapRuler: false,
            isMapArea: false,
            mapEvents: {
                init(map) {
                    // console.log(map.getCenter());
                    // self.mapRangingTool = new window.AMap.RangingTool(map) // MouseTool
                    self.mapTools = new window.AMap.MouseTool(map) // RangingTool
                },
                zoomchange: (e) => {
                    // console.log(e);
                },
                zoomend: (e) => {
                    // 获取当前缩放zoom值
                    // console.log(this.$refs.map.$$getInstance().getZoom());
                    // console.log(e);
                },
                click: e => {
                    this.mapClick(e)
                }
            },
            plugin: [
                'ToolBar',
                {
                    pName: 'MapType',
                    // 1为卫星图 0为默认
                    defaultType: 1,
                    // showRoad和showTraffic 为路况和路网
                    showRoad: true,
                    showTraffic: false,
                    position: 'LT',
                    events: {
                        init(o) {
                            // console.log(o);
                        },
                    },
                },
                //   {
                //   pName: 'Geolocation',
                //   events: {
                //     init(o) {
                //       // o 是高德地图定位插件实例
                //       // o.getCurrentPosition((status, result) => {
                //       //   if (result && result.position) {
                //       //     self.lng = result.position.lng;
                //       //     self.lat = result.position.lat;
                //       //     self.center = [self.lng, self.lat];
                //       //     self.markers[0].position = self.center;
                //       //     self.loaded = true;
                //       //     self.$nextTick();
                //       //   }
                //       // });
                //     }
                //   }
                // },
                {
                    pName: 'Geocoder',
                    events: {
                        init(o) {
                            // 定位第一次逆解码
                            // o.getAddress(self.center, (status, result) => {
                            //   if (status === 'complete' && result.info === 'OK') {
                            //     self.formattedAddress = result.regeocode.formattedAddress
                            //   }
                            // })
                        }
                    }
                }
            ],
            markerEvents: {
                click: e => {
                    // alert(e)
                },
                dragend: (e) => { // 移动坐标点
                    const marker = e.target
                        // const position = [e.lnglat.lng, e.lnglat.lat]
                    const positionGps = this.$gisUtil.ConvertAmapToGps(e.lnglat.lat, e.lnglat.lng)
                        // marker.position = [e.lnglat.lng, e.lnglat.lat]
                    const position = [positionGps.lng, positionGps.lat]
                    this.updateWpPostion(marker.getExtData(), position)
                }
            },
            polygonEvents: {
                click: e => {
                    // this.$layer.msg('点击了多边形：' + e)
                }
            },
            markerGridEvents: {
                click: e => {
                    const marker = e.target
                    const wp = marker.getExtData()
                    this.$confirm('是否移除 ' + (wp.index + 1) + ' 号边界点?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.removeWpGrid(wp)
                    }).catch(() => {})
                },
                dragend: (e) => { // 移动坐标点
                    const marker = e.target
                        // const position = [e.lnglat.lng, e.lnglat.lat]
                    const gps = this.$gisUtil.ConvertAmapToGps(e.lnglat.lat, e.lnglat.lng)
                    const positionGps = [gps.lng, gps.lat]
                    const positionAmap = [e.lnglat.lng, e.lnglat.lat]
                    this.updateGridWpPostion(marker.getExtData(), positionGps, positionAmap)
                }
            }
        }
    },
    computed: {
        ...mapGetters([
            'userId',
            'name',
            'defaultUavIndex',
            'roleInfo',
            'defaultHiveIndex'
        ])
    },
    created() {
        if (this.roleInfo) {
            this.isCanOpter = (this.roleInfo.roleId === 1 || this.roleInfo.roleId === 2 || this.roleInfo.roleId === 4)
        } else {
            this.isCanOpter = false
        }
        var _this = this
            // 监听游戏手柄
        window.addEventListener('gamepadconnected', function(e) {
                console.log('已插入遥控手柄:' + e.gamepad.id)
                _this.showToast('已插入遥控手柄' + e.gamepad.id)
                    // var gp = navigator.getGamepads()[e.gamepad.index]
                _this.startgamepad() // 启动手柄
            })
            // 监听游戏手柄拔出
        window.addEventListener('gamepaddisconnected', function(e) {
            console.log('遥控手柄已拔出！' + e.gamepad.id)
            _this.showToast('遥控手柄已拔出！')
            _this.isRemoteConnect = false
            _this.isRemoteEnable = false
            _this.remoteAxis = []
            _this.remoteButtons = []
            clearInterval(_this.intervalRemote) // 停止获取手柄数据
        })
        document.onkeydown = function(e) {
            // 事件对象兼容
            const key = e || event || window.event || arguments.callee.caller.arguments[0]
                // _this.showToast('按下按键：' + key + ',Code:' + key.keyCode)
            _this.sendKeyboardCommand(key.keyCode, true)
        }
        document.onkeyup = function(e) {
            // 事件对象兼容
            const key = e || event || window.event || arguments.callee.caller.arguments[0]
                // _this.showMessage('松开按键：' + key + ',Code:' + key.keyCode)
            _this.sendKeyboardCommand(key.keyCode, false)
        }
    },
    mounted() {
        this.init()
    },
    // created() {},
    beforeDestroy() {
        document.onkeydown = null
        document.onkeyup = null

        this.remoteAxis = []
        this.remoteButtons = []
        this.stopVideo()

        clearInterval(this.timerRefreshUi)
        this.timerRefreshUi = null
        clearInterval(this.intervalRemote) // 停止获取手柄数据
        this.intervalRemote = null
    },
    onDestroy() {
        if (this.webSocket !== null) {
            this.webSocket.destroy()
            this.webSocket = null
        }
    },
    methods: {
        async init() {
            this.wps = []
            this.markerOthersModel = []
            this.loading = true
            try {
                this.mapStyle = this.getCookieString('efuav_map_style', 'normal')
                this.isMapFollowUav = this.getCookieBool('efuav_isMapFollowUav', true)
                this.isShowUavFlyedPath = this.getCookieBool('efuav_isShowUavFlyedPath', true)
                this.isShowHiveVideo = this.getCookieBool('efuav_isShowHiveVideo', true)
                if (this.timerRefreshUi !== null) {
                    clearInterval(this.timerRefreshUi)
                }
                this.timerRefreshUi = setInterval(this.refreshUi, 1000)
                await this.initWebSocket()
                await this.queryAllCommands()
                await this.queryAllDjiEnum()
                await this.queryAllDjiActions()
                await this.initMyUavHives()
                    // setTimeout(() => { this.initMyUavHives() }, 1000)
            } catch (error) {
                console.error('初始化失败：' + error)
            }
            this.loading = false
        },
        handleChangeKml(file, fileList) {
            this.fileListKml = []
            if (this.beforeKmlUpload(file.raw)) {
                this.fileListKml.push(file)
                debugger
                var reader = new FileReader()
                reader.readAsText(file.raw)
                const that = this
                reader.onload = function() {
                    console.log('加载文件 ' + file.raw.name + ':\r\n' + reader.result)
                    const points = that.$gisUtil.getKmlData(reader.result) // 解析kml文件
                        // console.log('解析路径:\r\n ' + points)
                    let firstPoint = null
                    for (let index = 0; index < points.length; index++) {
                        const positionGps = { lat: points[index].lat, lng: points[index].lng }
                        const positionAmap = that.$gisUtil.ConvertGpsToAmap(positionGps.lat, positionGps.lng)
                        if (firstPoint === null) {
                            firstPoint = { lat: positionAmap.lat, lng: positionAmap.lng }
                        }
                        that.addGridItem(positionGps, positionAmap)
                    }
                    if (firstPoint !== null) {
                        that.setMapCenter(firstPoint.lat, firstPoint.lng)
                    }
                }
            }
        },
        beforeKmlUpload(file) {
            // name: "123.kml"
            const fullName = file.name
            var first = fullName.lastIndexOf('.')
            var filesuffix = fullName.substring(first + 1, fullName.length) // 截取获得后缀名
            const isKml = (filesuffix.toLowerCase() === 'kmz' || filesuffix.toLowerCase() === 'kml')
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isKml) {
                this.$message.error('选择文件只能是 Kml/Kmz 格式!')
            }
            if (!isLt2M) {
                this.$message.error('文件大小不能超过 2MB!')
            }
            return isKml && isLt2M
        },
        // 语音播报
        speechSynthesis(msg) {
            if (this.ttlMessage == null) {
                this.ttlMessage = new window.SpeechSynthesisUtterance()
            }
            // this.ttlMessage.lang = 'zh-CN'
            // this.ttlMessage.volume = 1 // 音量 0-1
            // this.ttlMessage.rate = 1 // 语速，0.1-10
            // this.ttlMessage.pitch = 1 // 音调高低，0-2
            this.ttlMessage.text = msg
            window.speechSynthesis.speak(this.ttlMessage)
        },
        // 视频  ---------------------------------------------------------
        refreshVideo(type) {
            let isRefreshUav = false
            let isRefreshHive = false
            let urlUav, urlHive

            if (type) {
                if (type === 'uav') {
                    isRefreshUav = true
                } else if (type === 'hive') {
                    isRefreshHive = true
                }
            } else {
                this.stopVideo()
                isRefreshUav = true
                isRefreshHive = true
            }
            if (this.selectedUavItem && this.selectedUavItem !== null) {
                urlUav = this.selectedUavItem.playUrl1
            }
            if (this.selectedHiveItem && this.selectedHiveItem !== null) {
                urlHive = this.selectedHiveItem.playUrl
            }
            if (isRefreshUav && urlUav) {
                this.playVideo1(urlUav)
            }
            if (isRefreshHive && urlHive) {
                this.playVideo2(urlHive)
            }
        },

        async playVideo1(url) {
            if (url && url.length > 0) {
                let goon = true
                const StreamState = await this.getLineStreamOnline(url, 'uav')
                if (StreamState !== null) {
                    if (StreamState === true) {
                        goon = true
                    } else {
                        goon = false
                    }
                }
                this.stopVideo1()
                if (goon) {
                    console.log('无人机视频播放地址：' + "webrtc://" + url)
                    console.log('无人机视频播放地址：' + "http://" + url)
                    this.TcPlayerUav = new TcPlayer('video1', {
                            "webrtc": "webrtc://" + url,
                            "flv": "http://" + url,
                            // "live": "true",
                            "volume": "0", // 设置初始音量，范围：0 到 1 [v2.2.0+]。
                            "autoplay": "true", // iOS 下 safari 浏览器是不开放这个能力的
                            "controls": "false", // 是否显示播放器的控制栏 none
                            "webrtcConfig": { streamType: 'video' }, // 仅拉取视频流，auto：拉取视频流和音频流
                            // "width": '480',//视频的显示宽度，请尽量使用视频分辨率宽度
                            // "height": '320',//视频的显示高度，请尽量使用视频分辨率高度
                            "wording": {
                                2003: "连接视频超时",
                                2032: "请求视频失败，请检查网络",
                                2048: '请求m3u8文件失败，可能是网络错误或者跨域问题'
                            }
                        })
                        // this.TcPlayerUav.on('error', function(error) {
                        //     this.showToast('播放失败:' + error)
                        // })
                    this.TcPlayerUav.play()
                }
            }
        },
        async playVideo2(url) {
            if (this.isShowHiveVideo && this.getIsThisUavContainsHive() === true) {
                if (url && url.length > 0) {
                    let goon = true
                    const StreamState = await this.getLineStreamOnline(url, 'hive')
                    if (StreamState !== null) {
                        if (StreamState === true) {
                            goon = true
                        } else {
                            goon = false
                        }
                    }
                    this.stopVideo2()
                        // console.log('当前加载视频流为:' + url)
                    if (goon) {
                        this.TcPlayerHive = new TcPlayer('video2', {
                                'webrtc': 'webrtc://' + url,
                                "flv": "http://" + url,
                                // "live": "true",
                                "volume": "0", // 设置初始音量，范围：0 到 1 [v2.2.0+]。
                                "autoplay": "true", // iOS 下 safari 浏览器是不开放这个能力的
                                "controls": "false", // 是否显示播放器的控制栏 none
                                "webrtcConfig": { streamType: 'video' }, // 仅拉取视频流，auto：拉取视频流和音频流
                                // "width": '480',//视频的显示宽度，请尽量使用视频分辨率宽度
                                // "height": '320',//视频的显示高度，请尽量使用视频分辨率高度
                                "wording": {
                                    2003: "连接视频超时",
                                    2032: "请求视频失败，请检查网络",
                                    2048: '请求m3u8文件失败，可能是网络错误或者跨域问题'
                                }
                            })
                            // this.TcPlayerHive.on('error', function(error) {
                            //     this.showToast('播放失败:' + error)
                            // })
                        this.TcPlayerHive.play()
                    }
                }
            }
        },
        stopVideo() {
            this.stopVideo1()
            this.stopVideo2()
        },
        stopVideo1() {
            try {
                if (this.TcPlayerUav != null) {
                    this.TcPlayerUav.pause()
                    this.TcPlayerUav.destroy()
                    this.TcPlayerUav = null
                }
            } catch (error) {}
        },
        stopVideo2() {
            try {
                if (this.TcPlayerHive != null) {
                    this.TcPlayerHive.pause()
                    this.TcPlayerHive.destroy()
                    this.TcPlayerHive = null
                }
            } catch (error) {}
        },
        // 工具函数 ---------------------------------------------------------

        // 获取实时数据值
        getRealdataDes(type) {
            if (this.selectedHiveItem) {
                switch (type) {
                    case 'hive':
                        if (this.selectedHiveItem.isOnline) {
                            return '在线'
                        } else {
                            return '离线'
                        }
                }
                if (this.selectedHiveItem.heartbeatData && this.selectedHiveItem.heartbeatData != null) {
                    switch (type) {
                        case 'hivetemp':
                            return this.selectedHiveItem.heartbeatData.hiveTemperature
                    }
                }
            }
            if (this.selectedUavItem && this.selectedUavItem != null) {
                switch (type) {
                    case 'uav':
                        if (this.selectedUavItem.isOnline) {
                            return '在线'
                        } else {
                            return '离线'
                        }
                    case 'boottime':
                        return '已运行 ' + this.$dateUtil.convertSecondToFrendly2(this.selectedUavItem.djiServerBootTime)
                    case 'charging':
                        return this.selectedUavItem.isChargingText
                    case 'chargingbool':
                        return this.selectedUavItem.isCharging
                    case 'remote':
                        return this.selectedUavItem.isRomoteControlOnline ? '在线' : '离线'
                    case 'gcs':
                        return this.selectedUavItem.isGcsOnline ? '在线' : '离线'
                    case 'server':
                        return this.selectedUavItem.isDjiServerOnline ? '在线' : '离线'
                }
                if (this.selectedUavItem.heartbeatData && this.selectedUavItem.heartbeatData != null) {
                    switch (type) {
                        case 'flightMode':
                            return this.selectedUavItem.heartbeatData.flightModeText
                        case 'gpsStatusText':
                            return this.selectedUavItem.heartbeatData.gpsStatusText
                        case 'satecount':
                            return this.selectedUavItem.heartbeatData.satecount
                        case 'flightTimeInSeconds':
                            if (this.selectedUavType === 1) {
                                return this.$dateUtil.convertSecondToTime(this.selectedUavItem.heartbeatData.flightTimeInSeconds)
                            } else {
                                return this.$dateUtil.convertSecondToTime(this.selectedUavItem.heartbeatData.flightTimeInSeconds)
                            }
                        case 'batt':
                            if (this.selectedUavType === 1) {
                                return this.selectedUavItem.heartbeatData.batteryPert + ' %'
                            } else {
                                return this.selectedUavItem.heartbeatData.batteryValue + ' 伏'
                            }
                        case 'sign':
                            if (this.selectedUavType === 1) {
                                return '下行' + this.selectedUavItem.heartbeatData.linkAirDownload + '% 上行' + this.selectedUavItem.heartbeatData.linkAirUpload + '%'
                            } else {
                                return this.selectedUavItem.heartbeatData.linkAirDownload + ' %'
                            }
                        case 'yaw':
                            let yaw = this.selectedUavItem.heartbeatData.yaw
                            if (yaw < 0) {
                                yaw += 360
                            }
                            return yaw.toFixed(2)
                        case 'alt':
                            return this.selectedUavItem.heartbeatData.alt.toFixed(2)
                        case 'altabs':
                            return this.selectedUavItem.heartbeatData.altabs.toFixed(2)
                        case 'speed':
                            return this.selectedUavItem.heartbeatData.xySpeed.toFixed(2)
                    }
                } else {
                    return '/'
                }
            } else {
                return '/'
            }
        },
        getHiveRealdataDes(type) {
            if (this.selectedHiveItem && this.selectedHiveItem !== null) {
                switch (type) {
                    case 'address':
                        if (this.selectedHiveItem.efHive && this.selectedHiveItem.efHive != null) {
                            return this.selectedHiveItem.efHive.hiveAddress
                        }
                        break
                    case 'hive':
                        if (this.selectedHiveItem.isOnline) {
                            let hivestatus = '在线'
                            if (this.selectedHiveItem.heartbeatData && this.selectedHiveItem.heartbeatData != null) {
                                switch (this.selectedHiveItem.heartbeatData.hiveSwitchStatus) {
                                    case 0:
                                        hivestatus = "未知";
                                        break;
                                    case 1:
                                        hivestatus = "已开启";
                                        break;
                                    case 2:
                                        hivestatus = "已关闭";
                                        break;
                                    case 5:
                                        hivestatus = "暂停中";
                                        break;
                                    case 3:
                                        hivestatus = "开启中";
                                        if (this.selectedHiveItem.heartbeatData.doorSwitchStatus === 3) {
                                            hivestatus = "开启舱门";
                                        } else if (this.selectedHiveItem.heartbeatData.upDownSwitchStatus === 3) {
                                            hivestatus = "开启升降";
                                        } else if (this.selectedHiveItem.heartbeatData.pushSwitchStatus === 3) {
                                            hivestatus = "开启推杆";
                                        }
                                        break;
                                    case 4:
                                        hivestatus = "关闭中";
                                        if (this.selectedHiveItem.heartbeatData.doorSwitchStatus === 4) {
                                            hivestatus = "关闭舱门";
                                        } else if (this.selectedHiveItem.heartbeatData.upDownSwitchStatus === 4) {
                                            hivestatus = "关闭升降";
                                        } else if (this.selectedHiveItem.heartbeatData.pushSwitchStatus === 4) {
                                            hivestatus = "关闭推杆";
                                        }
                                        break;
                                }
                            }
                            return hivestatus
                        } else {
                            return '离线'
                        }
                }
                if (this.selectedHiveItem.heartbeatData && this.selectedHiveItem.heartbeatData != null) {
                    switch (type) {
                        case 'altabs':
                            return this.selectedHiveItem.heartbeatData.altabs.toFixed(2)
                        case 'hivetemp':
                            return this.selectedHiveItem.heartbeatData.hiveTemperature.toFixed(2)
                        case 'usetime':
                            return this.selectedHiveItem.heartbeatData.useTime
                        case 'runtime':
                            return this.$dateUtil.convertSecondToFrendly2(this.selectedHiveItem.heartbeatData.runTime)
                    }
                } else {
                    return '/'
                }
            }
        },
        getHiveWeatherDes(type) {
            if (this.selectedHiveItem && this.selectedHiveItem !== null) {
                if (this.selectedHiveItem.heartbeatDataWeather && this.selectedHiveItem.heartbeatDataWeather != null) {
                    switch (type) {
                        case 'windSpeed':
                            return this.selectedHiveItem.heartbeatDataWeather.windSpeed.toFixed(2)
                        case 'windPower':
                            return this.selectedHiveItem.heartbeatDataWeather.windPower
                        case 'WindDirection':
                            return this.selectedHiveItem.heartbeatDataWeather.WindDirection.toFixed(2)
                        case 'airTemp':
                            return this.selectedHiveItem.heartbeatDataWeather.airTemp.toFixed(2)
                        case 'airHumidity':
                            return this.selectedHiveItem.heartbeatDataWeather.airHumidity.toFixed(0)
                        case 'Light':
                            return this.selectedHiveItem.heartbeatDataWeather.Light.toFixed(0)
                        case 'PM1':
                            return this.selectedHiveItem.heartbeatDataWeather.PM1.toFixed(2)
                        case 'PM2':
                            return this.selectedHiveItem.heartbeatDataWeather.PM2.toFixed(2)
                        case 'rainSnow':
                            return (this.selectedHiveItem.heartbeatDataWeather.rainSnow === 1) ? "有雨雪" : "无";
                        case 'rainWater':
                            return this.selectedHiveItem.heartbeatDataWeather.rainWater.toFixed(0)
                    }
                } else {
                    return '/'
                }
            } else {
                return '/'
            }
        },
        // 获取实时数据状态，告警
        getRealdataWarn(type) {
            if (this.selectedUavItem && this.selectedUavItem != null) {
                switch (type) {
                    case 'uav':
                        if (this.selectedUavItem.isOnline) {
                            return '#67c23a'
                        } else {
                            return 'red'
                        }
                    case 'charging':
                        return this.selectedUavItem.isCharging ? 'red' : '#67c23a'
                    case 'remote':
                        return this.selectedUavItem.isRomoteControlOnline ? '#67c23a' : 'red'
                    case 'gcs':
                        return this.selectedUavItem.isGcsOnline ? '#67c23a' : 'red'
                    case 'server':
                        return this.selectedUavItem.isDjiServerOnline ? '#67c23a' : 'red'
                }
                if (this.selectedUavItem.heartbeatData && this.selectedUavItem.heartbeatData != null) {
                    switch (type) {

                        case 'batt':
                            if (this.selectedUavType === 1) {
                                if (this.selectedUavItem.heartbeatData.batteryPert > 60) {
                                    return '#67c23a'
                                }
                            } else {
                                if (this.selectedUavItem.heartbeatData.batteryValue >= 18) {
                                    return '#67c23a'
                                }
                            }
                            break
                        case 'sign':
                            if (this.selectedUavType === 1) {
                                if (this.selectedUavItem.heartbeatData.linkAirDownload >= 60 || this.selectedUavItem.heartbeatData.linkAirUpload >= 60) {
                                    return '#67c23a'
                                }
                            } else {
                                if (this.selectedUavItem.heartbeatData.linkAirDownload >= 60) {
                                    return '#67c23a'
                                }
                            }
                            break
                        case 'sate':
                            if (this.selectedUavItem.heartbeatData.satecount >= 10) {
                                return '#67c23a'
                            }
                            break
                        case 'charging':
                            return this.selectedUavItem.isCharging ? 'red' : '#67c23a'
                        case 'remote':
                            return this.selectedUavItem.isRomoteControlOnline ? '#67c23a' : 'red'
                        case 'gcs':
                            return this.selectedUavItem.isGcsOnline ? '#67c23a' : 'red'
                        case 'server':
                            return this.selectedUavItem.isDjiServerOnline ? '#67c23a' : 'red'
                    }
                } else {
                    return 'red'
                }
            } else {
                return 'red'
            }

        },

        enableRuler(enable) {
            if (this.isMapArea) {
                this.enableArea(false)
            }
            if (enable) {
                this.isMapRuler = enable
            } else {
                this.isMapRuler = !this.isMapRuler
            }
            if (this.isMapRuler) {
                this.mapTools.rule()
            } else {
                this.mapTools.close(true) // 关闭，并清除覆盖物
            }
        },
        enableArea(enable) {
            if (this.isMapRuler) {
                this.enableRuler(false)
            }
            if (enable) {
                this.isMapArea = enable
            } else {
                this.isMapArea = !this.isMapArea
            }
            if (this.isMapArea) {
                this.mapTools.measureArea({
                    strokeColor: '#80d8ff',
                    fillColor: '#80d8ff',
                    fillOpacity: 0.3
                })
            } else {
                this.mapTools.close(true) // 关闭，并清除覆盖物
            }
        },
        saveConfig(reset) {
            this.isDialogConfig = false
            if (reset === true) {
                this.mapStyle = this.getCookieString('efuav_map_style', 'normal')
                this.isMapFollowUav = this.getCookieBool('efuav_isMapFollowUav', true)
                this.isShowUavFlyedPath = this.getCookieBool('efuav_isShowUavFlyedPath', true)
                this.isShowHiveVideo = this.getCookieBool('efuav_isShowHiveVideo', true)
            } else {
                Cookies.set('efuav_map_style', this.mapStyle)
                Cookies.set('efuav_isMapFollowUav', this.isMapFollowUav)
                Cookies.set('efuav_isShowUavFlyedPath', this.isShowUavFlyedPath)
                Cookies.set('efuav_isShowHiveVideo', this.isShowHiveVideo)
            }
        },
        getCookieString(key, defaultStr) {
            const temp = Cookies.get(key)
            if (temp) {
                defaultStr = temp
            }
            return defaultStr
        },
        getCookieBool(key, defaultBool) {
            const temp = Cookies.get(key)
            if (temp) {
                if (temp.toLowerCase() === 'true') {
                    defaultBool = true
                } else {
                    defaultBool = false
                }
            }
            return defaultBool
        },
        showToast(msg) {
            this.$layer.msg(msg)
        },
        showMessage(msg, type) {
            this.$message({ message: msg, type: type })
        },
        switchVideoMap(type) {
            // if (this.bigView === 'map') {
            //     if (type === 'video1') {
            //         this.stopVideo1()
            //         setTimeout(() => this.refreshVideo('uav'), 180)
            //     } else if (type === 'video2') {
            //         this.stopVideo2()
            //         setTimeout(() => this.refreshVideo('hive'), 180)
            //     }
            //     this.bigView = type
            // } else {
            //     this.bigView = type
            //     this.stopVideo()
            //     setTimeout(() => this.refreshVideo(), 180)
            // }
            let maxView = document.getElementById("container"); // 地图所在div
            let miniViewUav = document.getElementById("videoUav"); // 无人机视频所在div
            let miniViewHive = document.getElementById("videoHive"); // 停机坪视频所在div
            if (type === "uav") {
                if (this.bigView === "map") {
                    this.changePostion(miniViewUav, maxView);
                    this.bigView = "uav";
                } else if (this.bigView === "uav") {
                    this.changePostion(miniViewUav, maxView);
                    this.bigView = "map";
                } else {
                    // 当前最大的是另外的视频
                    this.changePostion(miniViewHive, maxView);
                    this.changePostion(miniViewUav, maxView);
                    this.bigView = "uav";
                }
            } else if (type === "hive") {
                if (this.bigView === "map") {
                    this.changePostion(miniViewHive, maxView);
                    this.bigView = "hive";
                } else if (this.bigView === "hive") {
                    this.changePostion(miniViewHive, maxView);
                    this.bigView = "map";
                } else {
                    // 当前最大的是另外的视频
                    this.changePostion(miniViewUav, maxView);
                    this.changePostion(miniViewHive, maxView);
                    this.bigView = "hive";
                }
            } else {
                //TODO 后期支持更多视频类型
            }
            setTimeout(() => this.refreshVideo(), 180)
        },
        changePostion(view1, view2) {
            let view1Parent = view1.parentNode;
            let view2Parent = view2.parentNode;
            let index1 = Array.prototype.indexOf.call(view1Parent.children, view1);
            let index2 = Array.prototype.indexOf.call(view2Parent.children, view2);
            console.log("父节点1：" + view1Parent + "父节点2：" + view2Parent + "，索引1：" + index1 + "，索引2：" + index2)
            view2Parent.insertBefore(view1, view2Parent.children[index2]);
            view1Parent.insertBefore(view2, view1Parent.children[index1]);
            //  document.body.replaceChild(view1, view2);
        },
        // 修改航点默认高度
        startSetDefaultAlt() {
            const that = this
            this.$layer.prompt({
                title: '请输入默认高度值',
                formType: 0, // 输入框类型，支持0（文本）默认1（密码）2（多行文本）
                value: this.defaultWpParm.alt,
                maxlength: 4, // 可输入文本的最大长度，默认500
                area: ['400px', '170px'], // 自定义文本域宽高
                scrollbar: false,
                zIndex: 2000 // 层优先级
            }, function(value, index) {
                if (value === '' || isNaN(value)) {
                    that.$layer.msg('请输入数字！', { icon: 6 })
                    return
                }
                that.defaultWpParm.alt = value
                that.$layer.close(index)
            })
        },
        // 检测在线状态
        refreshUi() {
            let isNeedForceUpdate = false
                // 进度提示
            if (this.ProgressShowTime + 15000 < Date.now()) {
                this.ProgressShowTime = Date.now();
                if (this.selectedUavItem && this.selectedUavItem != null && this.selectedUavItem.heartbeatData && this.selectedUavItem.heartbeatData != null) {
                    if (this.selectedUavItem.isOnline) {
                        if (this.selectedUavItem.heartbeatData.areMotorsOn === 1) {
                            this.ProgressShow = "飞行中";
                        } else {
                            this.ProgressShow = "地面待命";
                        }
                    } else {
                        this.ProgressShow = "离线";
                    }
                } else {
                    this.ProgressShow = "离线";
                }
            }
            if (this.uavs && this.uavs.length > 0) {
                this.uavs.forEach((item, index) => {
                    if (item.isOnline && item.heartbeatDataTime + 10000 < Date.now()) {
                        item.isOnline = false
                        isNeedForceUpdate = true
                            // this.$set(this.uavs, index, {
                            //   ...this.uavs[index],
                            //   isOnline: false
                            // })
                    }
                    if (item.isDjiServerOnline && item.djiServerTime + 30000 < Date.now()) {
                        item.isDjiServerOnline = false // 服务后台在线状态
                        item.isGcsOnline = false // 地面站在线状态
                        item.isUavOnline = false // 无人机在线状态
                        item.isRomoteControlOnline = false // 遥控器在线状态
                        item.isAirLinkOnline = false // 无人机与遥控器链接
                        item.isCameraOnline = false // 相机
                        item.djiServerBootTime = 0 //大疆服务启动时间

                        isNeedForceUpdate = true
                    }
                })

            }
            if (this.hives && this.hives.length > 0) {
                this.hives.forEach((item, index) => {
                    if (item.isOnline && item.heartbeatDataTime + 10000 < Date.now()) {
                        item.isOnline = false
                        isNeedForceUpdate = true
                    }
                    if (item.isOnlineBasestation && item.heartbeatDataBasestationTime + 30000 < Date.now()) {
                        item.isOnlineBasestation = false
                        isNeedForceUpdate = true
                    }
                })
            }
            if (isNeedForceUpdate) {
                this.$forceUpdate()
            }
        },
        // 获得开源的命令描述
        getCommandDes(wp) {
            const cmd = wp.wpAction
            var item = this.efCommands.find(a => { return a.cmdId === cmd })
            if (item) {
                return item.cmdNameZh
            } else { return cmd }
        },
        // 获得大疆的动作指令内容
        getActionDes(wp) {
            let show = '无'
            const cmds = wp.wpDjiActions //  5,0|6,1|7,5
            if (cmds && cmds.length > 0) {
                const actionsArr = cmds.split('|')
                if (actionsArr && actionsArr.length > 0) {
                    actionsArr.forEach((item, index) => {
                        // 5,0
                        if (item && item.length > 0) {
                            const action = item.split(',')
                            if (action && action.length >= 2) {
                                const actId = parseInt(action[0])
                                const actValue = parseFloat(action[1])
                                var find = this.djiActions.find(a => {
                                    return a.actId === actId
                                })
                                if (find) {
                                    if (show === '无') { show = '' }
                                    show += find.actNameZh + '(' + actValue + ')' + ' '
                                }
                            }
                        }
                    })
                } else {
                    show = cmds
                }
            }
            return show
        },
        parseTime(date) {
            return parseTime(date)
        },
        // 获取航线任务鼠标悬浮，显示更多信息
        getTaskInfo(item) {
            let info = ''
            if (item) {
                info += '所在纬度：' + item.wpsLat + '<br>'
                info += '所在经度：' + item.wpsLng + '<br>'
                info += '飞行高度：' + item.wpsAlt + '米' + '<br>'
                info += '飞行海拔：' + item.wpsAltAbs + '米' + '<br/>'
                if (item.wpsType === 1) {
                    info += '飞行速度：' + item.wpsSpeed + '米/秒' + '<br/>'
                    info += '最大速度：' + item.wpsMaxSpeed + '米/秒' + '<br/>'
                    info += '遥控链路中断：' + item.wpsRcSignalLost + '<br>'
                    info += '航线路径类型：' + item.wpsFlightPathMode
                    info += '飞行路径方式：' + item.wpsGotoWaypointMode
                    info += '飞行时朝向：' + item.wpsHeadingMode
                    info += '完成任务后：' + item.wpsFinishedAction
                    info += '执行次数：' + item.wpsRepeatTimes + '<br/>' + '<br/>'
                }
                info += '创建时间：' + parseTime(item.wpsCreateTime)
                info += '创建人：' + item.wpsCreateByUserId
                info += '更新时间：' + parseTime(item.wpsUpdateTime)
                info += '更新人：' + item.wpsUpdateByUserId
            } else {
                info = '无'
            }
            return info
        },
        getUavOnlineStatus(item) {
            if (item) {
                if (item.isOnline) {
                    return 'fill:green'
                } else {
                    if (item.efUav && item.efUav.uavFactoryId === 1) {
                        if (item.isDjiServerOnline) {
                            return 'fill:red'
                        } else {
                            return 'fill:gray'
                        }
                    } else {
                        return 'fill:gray'
                    }
                }
            } else {
                return 'fill:red'
            }
        },
        getOnlineStyle(item) {
            if (item && item.isOnline !== undefined && item.isOnline) {
                return true
            } else {
                return false
            }
        },
        getUavTypeName(type) {
            switch (type) {
                case 1:
                    return '大疆'
                case 2:
                    return '开源'
            }
        },
        getUavSelectedRowStyle(e) {
            const { row, rowindex } = e
            let background = {}
            if (this.selectedUavItem && this.selectedUavItem != null) {
                if (row.uavId === this.selectedUavItem.uavId) {
                    background.background = '#E6E6FA'
                }
            }
            return background
        },
        getHiveSelectedRowStyle(e) {
            const { row, rowindex } = e
            let background = {}
            if (this.selectedHiveItem && this.selectedHiveItem != null) {
                if (row.hiveId === this.selectedHiveItem.hiveId) {
                    background.background = '#E6E6FA'
                }
            }
            return background
        },
        clickWpsItem(item, needclose) {

        },
        beforeMoreHandleCommandUav(command, parm1, parm2, parm3, parm4, timeout, msg) {
            return { "command": command, "parm1": parm1, "parm2": parm2, "parm3": parm3, "parm4": parm4, "timeout": timeout, "msg": msg };
        },
        MoreHandleCommandUav(parms) {
            const { command, parm1, parm2, parm3, parm4, timeout, msg } = parms
            if (msg && msg.length > 0) {
                this.beforeDoCommand(command, parm1, parm2, parm3, parm4, timeout, msg)
            } else {
                this.doCommand(command, parm1, parm2, parm3, parm4, timeout)
            }
        },
        beforeMoreHandleCommandTask(item, index, command) {
            return { "item": item, "index": index, "command": command };
        },
        async MoreHandleCommandTask(parms) {
            const { item, index, command } = parms
            switch (command) {
                case 'download':
                    await this.queryByWpsIndex(index, item.wpsName, item)
                    break
                case 'update':
                    this.showToast('功能未开放，敬请期待！')
                    break
            }
        },
        async clickTaskItem(item, b) {

        },
        // 更多按钮，传入自定义参数
        beforeMoreHandleCommandWps(item, index, command) {
            return { "item": item, "index": index, "command": command };
        },
        // 更多按钮点击事件
        MoreHandleCommandWps(parms) {
            const { item, index, command } = parms
            switch (command) {
                case 'insert':
                    const wp = {
                        wpIndex: index,
                        wpLat: 0,
                        wpLng: 0,
                        wpAlt: this.defaultWpParm.alt,
                        wpAltAbs: 0,
                        wpAction: this.defaultWpParm.command,
                        wpDjiActions: '',
                        wpParm1: 0,
                        wpParm2: 0,
                        wpParm3: 0,
                        wpParm4: 0
                    }
                    this.insertWpDetail(wp)
                    break
                case 'edit':
                    this.editWpDialogModel = JSON.parse(JSON.stringify(item))
                    this.isDialogEditWp = true
                    break
                case 'editall':
                    // this.editWpsDialogModel = JSON.parse(JSON.stringify(item))
                    this.editWpsDialogModel.wpAlt = this.defaultWpParm.alt
                    this.isDialogEditWps = true
                    break
            }
        },

        // 地图事件 --------------------------------------------------------
        setMapCenter(lat, lng, zoom) {
            const latlng = this.$gisUtil.ConvertGpsToAmap(lat, lng)
            if (latlng.lng !== 0 && latlng.lat !== 0) {
                this.centerPosition = [latlng.lng, latlng.lat]
            }
            if (zoom) {
                this.zoom = zoom
            }
        },
        mapClick(mapsEvent) {
            const positionAmap = { lat: mapsEvent.lnglat.lat, lng: mapsEvent.lnglat.lng }
            const positionGps = this.$gisUtil.ConvertAmapToGps(mapsEvent.lnglat.lat, mapsEvent.lnglat.lng)
            if (this.isEditGridChoiceStartPoint) {
                this.gridAutoParms.homePos = { lat: positionGps.lat, lng: positionGps.lng }

                const index = this.markerOthersModel.findIndex(item => item.tag === 'grid_start_point')
                if (index >= 0) {
                    this.markerOthersModel.splice(index, 1)
                }
                this.markerOthersModel.push({
                    index: this.markerOthersModel.length,
                    tag: 'grid_start_point',
                    lat: positionGps.lat,
                    lng: positionGps.lng
                })
                this.isEditGridChoiceStartPoint = false
            } else if (this.isEditGrid) {
                this.addGridItem(positionGps, positionAmap)
            } else if (this.isEditWps) {
                this.addWp(positionGps)
            }
            // this.getAddress([positionAmap.lng, positionAmap.lat])
        },
        // 逆解码函数
        getAddress(lnglat) {
            let self = this
            AMap.plugin('AMap.Geocoder', function() {
                var geocoder = new AMap.Geocoder({
                    // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                    city: '010'
                })
                geocoder.getAddress(lnglat, function(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        self.formattedAddress = result.regeocode.formattedAddress
                            // result为对应的地理位置详细信息
                    }
                })
            })
        },
        // 摇杆控制 ---------------------------------------------------------
        // 启动手柄
        startgamepad() {
            var _this = this;
            _this.isRemoteConnect = true;
            // 每200ms 获取一次手柄数据，查看是否按下手柄按键
            this.intervalRemote = setInterval(function() {
                var gamepad = navigator.getGamepads()[0];
                if (_this.isRemoteConnect !== true) {
                    _this.isRemoteConnect = true;
                }
                _this.remoteSensing(gamepad.axes);
                _this.pressKey(gamepad.buttons);
            }, 100);
        },
        formatMoveSpeedTooltip(value) {
            return value + '米/秒'
        },
        getThrottle() {
            let value = 0
            if (this.remoteAxis && this.remoteAxis != null && this.remoteAxis.length >= 9) {
                value = this.convertRomoteDataToPwm(-this.remoteAxis[6], 0, 100)
            }
            if (value < 0) {
                value = 0
            } else if (value > 100) {
                value = 100
            }
            return Math.round(value * 10) / 10
        },
        // 手柄遥感
        remoteSensing(arr) {
            // 判断云台控制是否有变化，有变化则实时发送
            if (this.remoteAxis && this.remoteAxis != null && this.remoteAxis.length >= 9 && arr && arr != null && arr.length >= 9) {
                //if (Math.abs(this.remoteAxis[9] - arr[9]) > 0.2) {
                if (arr[9] >= -1 && arr[9] <= 1) {
                    let panValue = arr[9] // -1到1，顺时针旋转增加，上为-1，下为0.1428，默认为3.285
                    this.rollYuntai = 0
                    this.pitchYuntai = 0
                    this.yawYuntai = 0
                    if (panValue >= 2 || panValue === 0) {
                        // 居中状态
                    } else if (panValue >= 0.75 || panValue <= -0.75) {
                        this.pitchYuntai = 2; //上
                    } else if (panValue <= 0.25 && panValue >= -0.25) {
                        this.pitchYuntai = -2; //下
                    } else if (panValue >= 0.25 && panValue <= 0.75) {
                        this.yawYuntai = -2; //左
                    } else if (panValue >= -0.75 && panValue <= -0.25) {
                        this.yawYuntai = 2; //右
                    }
                    // mode，0是相对角度，1是绝对角度，2是速度模式
                    this.sendCommandToWebsocket(1153, this.rollYuntai, this.pitchYuntai, this.yawYuntai, 0)
                }
            }
            this.remoteAxis = arr
        },
        // 手柄按键
        pressKey(arr) {
            let needWarn = false
            let warnMsg = '是否执行?'
            let command = 0,
                p1 = 0,
                p2 = 0,
                p3 = 0,
                p4 = 0
            if (this.remoteButtons && this.remoteButtons != null && this.remoteButtons.length >= 16 && arr && arr != null && arr.length >= 16) {
                if (this.remoteButtons[1].value !== 1 && arr[1].value === 1) {
                    // this.showToast('已发送拍照/录像模式切换指令!')
                    // 切换拍照/录像模式 
                    if (this.isYuntaiMode === true) {
                        command = 1161 //  1161	录像模式
                    } else {
                        command = 1160 //  1160	拍照模式
                    }
                } else if (this.remoteButtons[0].value !== 1 && arr[0].value === 1) {
                    command = 1162 // 拍照
                        // console.log('原始的：' + this.remoteButtons[0].value + ',新的值：' + arr[0].value)
                } else if (this.remoteButtons[2].value !== 1 && arr[2].value === 1) {
                    command = 1163 // 开始录像
                } else if (this.remoteButtons[3].value !== 1 && arr[3].value === 1) {
                    command = 1164 // 停止录像
                } else if (this.remoteButtons[10].value !== 1 && arr[10].value === 1) {
                    needWarn = true
                    warnMsg = '是否执行全自动起飞!'
                    command = 1003
                } else if (this.remoteButtons[11].value !== 1 && arr[11].value === 1) {
                    needWarn = true
                    warnMsg = '是否执行全自动精确起飞!'
                    command = 1004
                } else if (this.remoteButtons[12].value !== 1 && arr[12].value === 1) {
                    needWarn = true
                    warnMsg = '是否开始全自动起飞 - 执行任务!'
                    command = 1006
                } else if (this.remoteButtons[13].value !== 1 && arr[13].value === 1) {
                    needWarn = true
                    warnMsg = '是否开始全自动精确起飞 - 执行任务!'
                    command = 1007
                } else if (this.remoteButtons[14].value !== 1 && arr[14].value === 1) {
                    needWarn = true
                    warnMsg = '是否开始全自动返航!'
                    command = 1009
                } else if (this.remoteButtons[15].value !== 1 && arr[15].value === 1) {
                    needWarn = true
                    warnMsg = '是否终止全自动任务!'
                    command = 1
                } else if (this.remoteButtons[4].value !== 1 && arr[4].value === 1) {
                    needWarn = true
                    warnMsg = '是否立即起飞无人机!'
                    command = 1100
                } else if (this.remoteButtons[5].value !== 1 && arr[5].value === 1) {
                    needWarn = true
                    warnMsg = '是否立即精确起飞无人机!'
                    command = 1105
                } else if (this.remoteButtons[6].value !== 1 && arr[6].value === 1) {
                    needWarn = true
                    warnMsg = '是否立即悬停无人机!'
                    command = 1104
                } else if (this.remoteButtons[7].value !== 1 && arr[7].value === 1) {
                    needWarn = true
                    warnMsg = '是否开始执行任务!'
                    command = 1101
                } else if (this.remoteButtons[8].value !== 1 && arr[8].value === 1) {
                    needWarn = true
                    warnMsg = '是否立即降落无人机!'
                    command = 1103
                } else if (this.remoteButtons[9].value !== 1 && arr[9].value === 1) {
                    needWarn = true
                    warnMsg = '是否立即返航无人机!'
                    command = 1102
                }
            }
            this.remoteButtons = arr
                // console.log('循环中...')
            if (command !== 0) {
                if (needWarn) {
                    if (this.isDoingCommand) {
                        this.showToast('正在执行命令中...')
                    } else {
                        // this.showToast('执行命令...' + command + '  ' + warnMsg)
                        this.isDoingCommand = true
                        this.beforeDoCommand(command, p1, p2, p3, p4, 10, warnMsg)
                    }
                } else {
                    this.doCommand(command, p1, p2, p3, p4)
                }
            }
        },
        sendKeyboardCommand(keyCode, keydownOrUp) {
            let command = 0
            let p1 = 0,
                p2 = 0,
                p3 = 0,
                p4 = 0
            switch (keyCode) {
                // 无人机控制
                case 87: // W
                    this.isKeyboardKeydown = keydownOrUp
                    if (keydownOrUp === true) {
                        this.pitchKey = this.moveSpeed
                    } else {
                        this.pitchKey = 0
                    }
                    break
                case 83: // S
                    this.isKeyboardKeydown = keydownOrUp
                    if (keydownOrUp === true) {
                        this.pitchKey = -this.moveSpeed
                    } else {
                        this.pitchKey = 0
                    }
                    break
                case 65: // A
                    this.isKeyboardKeydown = keydownOrUp
                    if (keydownOrUp === true) {
                        this.rollKey = -this.moveSpeed
                    } else {
                        this.rollKey = 0
                    }
                    break
                case 68: // D
                    this.isKeyboardKeydown = keydownOrUp
                    if (keydownOrUp === true) {
                        this.rollKey = this.moveSpeed
                    } else {
                        this.rollKey = 0
                    }
                    break
                case 85: // U 上升
                    this.isKeyboardKeydown = keydownOrUp
                    if (keydownOrUp === true) {
                        this.altKey = 1
                    } else {
                        this.altKey = 0
                    }
                    break
                case 73: // I 下降
                    this.isKeyboardKeydown = keydownOrUp
                    if (keydownOrUp === true) {
                        this.altKey = -1
                    } else {
                        this.altKey = 0
                    }
                    break
                case 74: // J 转向
                    this.isKeyboardKeydown = keydownOrUp
                    if (keydownOrUp === true) {
                        this.yawKey = -15
                    } else {
                        this.yawKey = 0
                    }
                    break
                case 75: // K 转向
                    this.isKeyboardKeydown = keydownOrUp
                    if (keydownOrUp === true) {
                        this.yawKey = 15
                    } else {
                        this.yawKey = 0
                    }
                    break
                    // 云台控制
                case 37: // ←
                    command = 1153
                    if (keydownOrUp === true) {
                        p3 = -2
                    }
                    break
                case 38: // ↑
                    command = 1153
                    if (keydownOrUp === true) {
                        p2 = 2
                    }
                    break
                case 39: // →
                    command = 1153
                    if (keydownOrUp === true) {
                        p3 = 2
                    }
                    break
                case 40: // ↓
                    command = 1153
                    if (keydownOrUp === true) {
                        p2 = -2
                    }
                    break
            }
            if (keydownOrUp === false) {
                this.lastPressKeyCode = -1
            }
            if (command !== 0) {
                if (this.lastPressKeyCode !== keyCode) {
                    this.sendCommandToWebsocketThread(command, p1, p2, p3, p4)
                }
            }
            if (keydownOrUp === true) {
                this.lastPressKeyCode = keyCode
            }
        },
        sendCommandToWebsocketThread(command, parm1, parm2, parm3, parm4) {
            if (this.timerSendPanData !== null) {
                clearInterval(this.timerSendPanData)
                this.timerSendPanData = null
            }
            let that = this
            const data = {
                MessageID: 3050,
                uavId: that.selectedUavItem.uavId,
                command: command,
                parm1: parm1,
                parm2: parm2,
                parm3: parm3,
                parm4: parm4
            }
            if (parm1 === 0 && parm2 === 0 && parm3 === 0 && parm4 === 0) {

            } else if (parm4 === 5) {
                that.websocketsend(JSON.stringify(data))
            } else {
                this.timerSendPanData = setInterval(function() {
                    that.websocketsend(JSON.stringify(data))
                }, 100);
            }
        },
        sendCommandToWebsocket(command, parm1, parm2, parm3, parm4) {
            const data = {
                MessageID: 3050,
                uavId: this.selectedUavItem.uavId,
                command: command,
                parm1: parm1,
                parm2: parm2,
                parm3: parm3,
                parm4: parm4
            }
            this.websocketsend(JSON.stringify(data))
        },
        // 遥控器数据，每隔250毫秒发送一次 ---------------------------------------------------------
        convertRomoteDataToPwm(value, newMini, newMax) {
            if (Math.abs(value) <= 0.06) {
                // 死区为3%，即范围1000为30，范围2为0.06
                value = 0
            }
            let pert = (value + 1) / 2 //转为0-2，计算百分比
            let speed = newMini + (newMax - newMini) * pert
            return speed
        },
        sendDjiRemoteData() {
            if (this.isRemoteEnable == false) {
                this.isRemoteEnable = true
            }
            this.roll = 0
            this.pitch = 0
            this.yaw = 0
            this.alt = 0
            if (this.isKeyboardKeydown === true) {
                // 按下了键盘按键
                this.roll = this.rollKey
                this.pitch = this.pitchKey
                this.yaw = this.yawKey
                this.alt = this.altKey
            } else if (this.remoteAxis && this.remoteAxis.length > 6) {
                this.roll = this.convertRomoteDataToPwm(this.remoteAxis[0], -this.moveSpeed, this.moveSpeed) // 值范围为-1到1
                this.pitch = this.convertRomoteDataToPwm(-this.remoteAxis[1], -this.moveSpeed, this.moveSpeed) // 值范围为-1到1
                this.yaw = this.convertRomoteDataToPwm(this.remoteAxis[5], -15, 15) // 值范围为-1到1
                    // this.roll = this.convertRomoteDataToPwm(this.remoteAxis[0], -5, 5) // 值范围为-1到1
                    // this.pitch = this.convertRomoteDataToPwm(-this.remoteAxis[1], -5, 5) // 值范围为-1到1
                    // this.yaw = this.convertRomoteDataToPwm(this.remoteAxis[5], -15, 15) // 值范围为-1到1
                this.alt = this.convertRomoteDataToPwm(-this.remoteAxis[6], -3, 3) // 值范围为-1到1
            }
            // 对应大疆无人机为 -5到5 m/s ，开源无人机为1000-2000
            const data = {
                    MessageID: 3050,
                    uavId: this.selectedUavItem.uavId,
                    command: 1152,
                    parm1: this.roll,
                    parm2: this.pitch,
                    parm3: this.yaw,
                    parm4: this.alt
                }
                // console.log('实时发送大疆遥控数据:' + JSON.stringify(data));
            this.websocketsend(JSON.stringify(data))
        },
        // 区域编辑 ---------------------------------------------------------
        enableGrid() {
            this.isEditGrid = !this.isEditGrid
            if (!this.isEditGrid) {
                const index = this.markerOthersModel.findIndex(item => item.tag === 'grid_start_point')
                if (index >= 0) {
                    this.markerOthersModel.splice(index, 1)
                }
            }
        },
        // 自动生成航线
        autoWps() {
            if (this.gridsWps == null || this.gridsWps.length < 3) {
                this.showToast('请选择飞行区域！', 'warning')
                return
            }
            const pointsGps = []
            this.gridsWps.forEach(item => {
                const latlng = this.$gisUtil.ConvertAmapToGps(item.lat, item.lng)
                pointsGps.push({ lat: latlng.lat, lng: latlng.lng })
            })
            const homePos = this.gridAutoParms.homePos
            const spacing = this.gridAutoParms.spacing
            const headSpacing = this.gridAutoParms.headSpacing // TODO 航向间距
            const yaw = this.gridAutoParms.yaw
            const outlineDistance = this.gridAutoParms.outlineDistance // 外扩距离
            const listAutoWps = this.$gisUtil.GenerationWaypointsByGrid(pointsGps, homePos, spacing, headSpacing, yaw, outlineDistance)
            if (listAutoWps && listAutoWps.length > 500) {
                this.showToast('航点数量超过500个，无法渲染', 'warning')
            } else {
                this.clearWps()
                listAutoWps.forEach(item => {
                    const lnglat = this.$gisUtil.ConvertGpsToAmap(item.lat, item.lng)
                    this.addWp(lnglat)
                })
            }
        },
        addGridItem(lnglatGps, lnglatAmap) {
            // const gridItem = { lat: lnglat.lat, lng: lnglat.lng }
            this.grids.push([lnglatAmap.lng, lnglatAmap.lat])
            const gridItem = {
                index: 0,
                lat: lnglatGps.lat,
                lng: lnglatGps.lng,
                alt: this.defaultWpParm.alt,
                altAbs: 0,
                action: this.defaultWpParm.command,
                djiActions: '',
                parm1: 0,
                parm2: 0,
                parm3: 0,
                parm4: 0
            }
            gridItem.index = this.gridsWps.length
            this.gridsWps.push(gridItem)
        },
        removeWpGrid(wp) {
            this.gridsWps.splice(wp.index, 1)
            this.grids.splice(wp.index, 1)
            this.refreshGrid()
        },
        updateGridWpPostion(wp, positionGps, positionAmap) {
            wp.lat = positionGps[1]
            wp.lng = positionGps[0]
            this.gridsWps.splice(wp.index, 1, wp)
            this.grids.splice(wp.index, 1, positionAmap)
        },

        getGridMarkerContent(wp, width, height, isRotate = false) {
            const bgRoate = isRotate ? 'transform: rotate(45deg);' : ''
            const txRotate = isRotate ? 'transform: rotate(-45deg);' : ''
            let backgroundColor = '#4169E1'
            if (isRotate) {
                backgroundColor = '#0893FF'
            }
            const show = (wp.index + 1) + ''
            const content = `<div style="display: flex;
                                      justify-content: center;
                                      align-items: center;
                                      height: ${width}px;
                                      width: ${height}px;
                                      border-radius: 0.1rem;
                                      ${bgRoate}
                                      font-family: Arial-BoldMT;
                                      font-size: 10px;
                                      color: #FFFFFF;
                                      box-shadow: 2px 2px 4px 0 rgba(0,0,0,0.30);
                                      background-color: ${backgroundColor};">
                                      <div style="${txRotate}"> ${show} </div>
                           </div>`
            return content
                // return '航点' + wp.index + ',命令：' + wp.action
        },
        getOtherMarkerContent(wp, width, height, isRotate = false) {
            const bgRoate = isRotate ? 'transform: rotate(45deg);' : ''
            const txRotate = isRotate ? 'transform: rotate(-45deg);' : ''
            const backgroundColor = '#4169E1'
            let show = wp.tag
            switch (wp.tag) {
                case 'grid_start_point':
                    show = '起'
                    break
            }
            const content = `<div style="display: flex;
                                      justify-content: center;
                                      align-items: center;
                                      height: ${width}px;
                                      width: ${height}px;
                                      border-radius: 0.8rem;
                                      ${bgRoate}
                                      font-family: Arial-BoldMT;
                                      font-size: 8px;
                                      color: #FFFFFF;
                                      box-shadow: 2px 2px 4px 0 rgba(0,0,0,0.30);
                                      background-color: ${backgroundColor};">
                                      <div style="${txRotate}"> ${show} </div>
                           </div>`
            return content
                // return '航点' + wp.index + ',命令：' + wp.action
        },
        getUavMarkerContent(item, width, height, isRotate = false) {
            const bgRoate = isRotate ? 'transform: rotate(45deg);' : ''
            const txRotate = isRotate ? 'transform: rotate(-45deg);' : ''
            const backgroundColor = '#4169E1'
            let show = item.uavId + ''
            if (item.efUav && item.efUav != null) {
                show = item.efUav.uavName
                    // show = '名称:' + item.efUav.uavName + '\r\n编号:' + item.uavId
            }
            const content = `<div style="display: flex;
                                      justify-content: center;
                                      align-items: center;
                                      height: ${width}px;
                                      width: ${height}px;
                                      border-radius: 0.8rem;
                                      ${bgRoate}
                                      font-family: Arial-BoldMT;
                                      font-size: 8px;
                                      color: #FFFFFF;
                                      box-shadow: 2px 2px 4px 0 rgba(0,0,0,0.30);
                                      background-color: ${backgroundColor};">
                                      <div style="${txRotate}"> ${show} </div>
                           </div>`
            return content
                // return '航点' + item.index + ',命令：' + item.action
        },
        getHomeMarkerContent(width, height, isRotate = false) {
            const bgRoate = isRotate ? 'transform: rotate(45deg);' : ''
            const txRotate = isRotate ? 'transform: rotate(-45deg);' : ''
            const backgroundColor = '#EAC100'
            this.selectedUavItem
            let show = 'H'
            const content = `<div style="display: flex;
                                      justify-content: center;
                                      align-items: center;
                                      height: ${width}px;
                                      width: ${height}px;
                                      border-radius: 0.8rem;
                                      ${bgRoate}
                                      font-family: Arial-BoldMT;
                                      font-size: 8px;
                                      color: #FFFFFF;
                                      box-shadow: 2px 2px 4px 0 rgba(0,0,0,0.30);
                                      background-color: ${backgroundColor};">
                                      <div style="${txRotate}"> ${show} </div>
                           </div>`
            return content
        },
        refreshGrid() {
            this.gridsWps.forEach((wp, index) => {
                wp.index = index
            })
        },
        // 航点编辑 ---------------------------------------------------------
        getMarkerContent(wp, width, height, isRotate = false) {
            if (wp.wpLat === 0 || wp.wpLng === 0) {
                return null
            }
            const bgRoate = isRotate ? 'transform: rotate(45deg);' : ''
            const txRotate = isRotate ? 'transform: rotate(-45deg);' : ''
            let backgroundColor = (wp.wpIndex === 0 ? '#8D3ECD' : '#2DCD72')
            if (isRotate) {
                backgroundColor = '#0893FF'
            }
            const show = (wp.wpIndex === 0 ? '1' : (wp.wpIndex + 1) + '')
            const content = `<div style="display: flex;
                                      justify-content: center;
                                      align-items: center;
                                      height: ${width}px;
                                      width: ${height}px;
                                      border-radius: 20rem;
                                      ${bgRoate}
                                      font-family: Arial-BoldMT;
                                      font-size: 10px;
                                      color: #FFFFFF;
                                      box-shadow: 2px 2px 4px 0 rgba(0,0,0,0.30);
                                      background-color: ${backgroundColor};">
                                      <div style="${txRotate}"> ${show} </div>
                           </div>`
            return content
                // return '航点' + wp.wpIndex + ',命令：' + wp.action
        },
        getMarkerPostion(lat, lng) {
            // const target = [lnglat.lng, lnglat.lat]
            if (lat === 0 || lng === 0) return null
            const position = this.$gisUtil.ConvertGpsToAmap(lat, lng)
            return [position.lng, position.lat]
        },
        insertWpDetail(wp) {
            if (wp.wpIndex >= this.wps.length) {
                this.addWpDetail(wp, true)
            } else {
                this.wps.splice(wp.wpIndex, 0, wp)
                this.refreshWps()
            }
        },
        addWp(lnglat) {
            const wp = {
                wpIndex: 0,
                wpLat: lnglat.lat,
                wpLng: lnglat.lng,
                wpAlt: this.defaultWpParm.alt,
                wpAltAbs: 0,
                wpAction: this.defaultWpParm.command,
                wpDjiActions: '',
                wpParm1: 0,
                wpParm2: 0,
                wpParm3: 0,
                wpParm4: 0
            }
            this.addWpDetail(wp, true)
        },
        addWpDetail(wp, refreshLine) {
            wp.wpIndex = this.wps.length
            this.wps.push(wp)
            if (refreshLine && refreshLine === true) {
                this.refreshLine()
            }
        },

        updateWpPostion(wp, position) {
            wp.wpLat = position[1]
            wp.wpLng = position[0]
            this.updateWpDetail(wp)
        },
        updateWpDetail(wp) {
            this.wps.splice(wp.wpIndex, 1, wp)
            this.refreshLine()
        },
        saveWp() {
            const temp = JSON.parse(JSON.stringify(this.editWpDialogModel))
            temp.wpLat = parseFloat(temp.wpLat)
            temp.wpLng = parseFloat(temp.wpLng)
            this.updateWpDetail(temp)
            this.isDialogEditWp = false
        },
        updateAllWp() {
            this.isDialogEditWps = false
            const newAlt = parseFloat(this.editWpsDialogModel.wpAlt)
            const newWpAction = this.editWpsDialogModel.wpAction
            const newWpDjiActions = this.editWpsDialogModel.wpDjiActions
            this.wps.forEach((wp, index) => {
                if (this.editWpsDialogModel.type === 0) {
                    wp.wpAlt = newAlt // 修改全部高度
                } else if (this.editWpsDialogModel.type === 1) {
                    if (this.selectedUavType === 2) {
                        wp.wpAction = newWpAction // 修改全部命令
                    } else if (this.selectedUavType === 1) {
                        wp.wpDjiActions = newWpDjiActions // 大疆动作
                    }
                }
            })
        },
        deleteWp(index) {
            this.wps.splice(index, 1)
            this.refreshWps()
        },
        // 添加一个大疆动作
        beaforeAddDjiAction(type) {
            this.editWpDjiActionDialogModel.type = type
            this.editWpDjiActionDialogModel.action = 0
            this.editWpDjiActionDialogModel.parm = 0
            this.isDialogEditDjiAction = true
        },
        // 添加一个大疆动作
        addDjiAction() {
            const action = this.editWpDjiActionDialogModel.action
            const parm = this.editWpDjiActionDialogModel.parm
            if (this.editWpDjiActionDialogModel.type === 'one') {
                if (this.editWpDialogModel) {
                    if (!this.editWpDialogModel.wpDjiActions || this.editWpDialogModel.wpDjiActions === '') {
                        this.editWpDialogModel.wpDjiActions = action + ',' + parm
                    } else {
                        this.editWpDialogModel.wpDjiActions = this.editWpDialogModel.wpDjiActions + '|' + action + ',' + parm
                    }
                }
            } else if (this.editWpDjiActionDialogModel.type === 'all') {
                if (!this.editWpsDialogModel.wpDjiActions || this.editWpsDialogModel.wpDjiActions === '') {
                    this.editWpsDialogModel.wpDjiActions = action + ',' + parm
                } else {
                    this.editWpsDialogModel.wpDjiActions = this.editWpsDialogModel.wpDjiActions + '|' + action + ',' + parm
                }
            }
            this.isDialogEditDjiAction = false
        },
        // 清除大疆动作
        clearDjiAction() {
            if (this.editWpDjiActionDialogModel.type === 'one') {
                this.editWpDialogModel.wpDjiActions = ''
            } else if (this.editWpDjiActionDialogModel.type === 'all') {
                this.editWpsDialogModel.wpDjiActions = ''
            }
        },
        // 删除单个航点
        deleteWpBefore(wp) {
            this.$confirm('是否删除[' + wp.index + ']号航点?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteWp(wp.index)
            }).catch(() => {})
        },
        refreshLine() {
            const wpsPathTemp = []
            let wpsAlt = 0
            let wpsDistance = 0
            let wpsLat = 0
            let wpsLng = 0
            const lastLatLng = { lat: 0, lng: 0 }
            this.wps.forEach((wp, index) => {
                if (wp.wpLat !== 0 && wp.lng !== 0) {
                    if (wpsAlt === 0) wpsAlt = wp.wpAlt
                    if (wpsLat === 0) wpsLat = wp.wpLat
                    if (wpsLng === 0) wpsLng = wp.wpLng
                    wpsPathTemp.push(this.getMarkerPostion(wp.wpLat, wp.wpLng))
                    if (lastLatLng.lat !== 0 && lastLatLng.lng !== 0) {
                        wpsDistance += this.$gisUtil.getDistance(lastLatLng.lat, lastLatLng.lng, 0, wp.wpLat, wp.wpLng, 0)
                    }
                    lastLatLng.lat = wp.wpLat
                    lastLatLng.lng = wp.wpLng
                }
            })
            this.wpsPath = wpsPathTemp

            this.wpsInfo.wpsType = this.selectedUavType === 1 ? 1 : 0
            this.wpsInfo.wpsLat = wpsLat
            this.wpsInfo.wpsLng = wpsLng
            this.wpsInfo.wpsAlt = wpsAlt
            this.wpsInfo.wpsDistance = wpsDistance
            this.wpsInfo.wpsUserTime = wpsDistance / 5 // 预计飞行耗时
            this.wpsInfo.wpsWpCount = this.wps.length
            this.wpsInfo.wpsLocation = ''
            this.wpsInfo.wpsAltAbs = 30
        },
        // 刷新全部航点
        refreshWps() {
            // const wpsPathTemp = []
            let wpIndexTemp = 0
            this.wps.forEach((wp, index) => {
                    wp.wpIndex = wpIndexTemp
                        // if (wp.lat !== 0 && wp.lng !== 0) {
                        //   wpsPathTemp.push(this.getMarkerPostion(wp.lat, wp.lng))
                        // }
                    wpIndexTemp++
                })
                // this.wpsPath = wpsPathTemp
            this.refreshLine()
        },
        enableEditWps(enable) {
            if (enable) {
                this.isEditWps = enable
            } else {
                this.isEditWps = !this.isEditWps
            }
            if (!this.isEditWps) {
                this.isEditGrid = false
            }
            this.$notify({ title: '', message: this.isEditWps ? '您可以开始编辑航线任务了。' : '已结束航线编辑模式！', type: this.isEditWps ? 'success' : 'info' })
        },
        clearWps() {
            this.wpsPath = []
            this.wps = []
            this.wpsInfo.wpsLat = 0
            this.wpsInfo.wpsLng = 0
            this.wpsInfo.wpsAlt = 0
            this.wpsInfo.wpsDistance = 0
            this.wpsInfo.wpsUserTime = 0 // 预计飞行耗时
            this.wpsInfo.wpsWpCount = 0
            this.wpsInfo.wpsLocation = ''
            this.wpsInfo.wpsAltAbs = 0
        },
        // 停机坪 ---------------------------------------------------------

        // 当前无人机是否绑定了停机坪
        getIsThisUavContainsHive() {
            return this.hivesNowUav && this.hivesNowUav != null && this.hivesNowUav.length > 0
        },
        clickHiveRow(row) {
            this.switchHive(row)
        },
        // 切换停机坪
        switchHive(hive) {
            let changed = true
            if (this.selectedHiveItem && this.selectedHiveItem != null && this.selectedHiveItem.hiveId === hive.hiveId) {
                changed = false
            }
            this.selectedHiveItem = hive
            this.isShowThisUavHives = false
            if (changed) {
                this.refreshVideo('hive')
            }
        },

        getMarkerHivePostion(item) {
            if (item) {
                if (item.efHive && item.efHive != null) {
                    if (!item.efHive.hiveLat || !item.efHive.hiveLng) return null
                    if (item.efHive.hiveLat === 0 || item.efHive.hiveLng === 0) return null
                    const position = this.$gisUtil.ConvertGpsToAmap(item.efHive.hiveLat, item.efHive.hiveLng)
                    return [position.lng, position.lat]
                } else {
                    return null
                }
            } else {
                return null
            }
        },
        getHiveTitle(item) {
            let title = '停机坪'
            if (item) {
                if (item.efHive && item.efHive != null) {
                    title = '名称:' + item.efHive.hiveName +
                        '\r\n编号:' + item.efHive.hiveId +
                        '\r\n位置:' + item.efHive.hiveAddress +
                        '\r\n状态:' + ((item.isOnline && item.isOnline === true) ? '在线' : '离线')
                }
            }
            return title
        },
        getHiveIco(item) {
            // return this.hiveOnline
            if (item) {
                if (!item.hasOwnProperty('isOnline')) return this.hiveOffline
                if (item.isOnline) return this.hiveOnline
                else return this.hiveOffline
            } else {
                return null
            }
        },
        // 无人机 ---------------------------------------------------------
        clickUavRow(row) {
            this.clickUavItem(row, true)
        },
        clickUavItem(item, needclose) {
            let goon = true
            if (needclose && needclose === true) {
                this.isShowUavs = false
            }
            this.selectedUavType = item.efUav.uavFactoryId // 当前选择的无人机类型
            if (this.selectedUavItem === null || this.selectedUavItem.uavId !== item.uavId) {
                // 切换了无人机
                if (this.wps.length > 0) {
                    if (this.selectedUavItem == null || this.selectedUavItem.efUav.uavFactoryId !== item.efUav.uavFactoryId) {
                        goon = false
                        this.$confirm('当前选择的无人机类型变化，继续将会清除航线任务，是否切换?', '提示', {
                            confirmButtonText: '切换',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.clearWps()
                            this.switchUav(item)
                        }).catch(() => {})
                    }
                }
            }
            if (goon) {
                this.switchUav(item)
            }
        },
        // 切换无人机
        switchUav(item) {
            let changed = true
            this.ProgressShow = "离线";
            if (this.selectedUavItem && this.selectedUavItem != null && this.selectedUavItem.uavId === item.uavId) {
                changed = false
            }
            if (!item.selected) {
                if (this.selectedUavItem !== null) {
                    this.selectedUavItem.selected = false
                }
            }
            this.selectedUavItem = item
            this.selectedUavItem.selected = true
            this.changedUav(changed)
        },
        async changedUav(changed) {
            if (changed && changed === true) {
                // this.$store.dispatch('settings/SET_defaultUavIndex', 2).then((response) => {})
                let index = this.uavs.findIndex((item) => { return item.uavId === this.selectedUavItem.uavId })
                this.$store.commit('settings/setDefaultUavIndex', index)
                this.$store.commit('settings/setDefaultHiveIndex', 0)
                    // this.showToast('默认无人机：' + this.defaultUavIndex)
                this.refreshVideo()
            }
            this.isFirstGpsFixed = false
            let position = [0, 0]
            if (this.selectedUavItem) {
                if (this.selectedUavItem.heartbeatData && this.selectedUavItem.heartbeatData != null) {
                    if (!this.selectedUavItem.heartbeatData.lat || !this.selectedUavItem.heartbeatData.lng) {}
                    if (this.selectedUavItem.heartbeatData.lat !== 0 && this.selectedUavItem.heartbeatData.lng !== 0) {
                        position = [this.selectedUavItem.heartbeatData.lat, this.selectedUavItem.heartbeatData.lng]
                    }
                }
                if (changed && changed === true) {
                    // 根据当前无人机获取停机坪
                    await this.getHiveByUavId(this.selectedUavItem.uavId)
                    this.refreshVideo('hive')
                }
            }
            if (position[0] !== 0 && position[1] !== 0) {
                this.setMapCenter(position[0], position[1], 16)
            }
        },

        getMarkerUavPostion(item) {
            let position = [0, 0]
            if (item) {
                if (item.heartbeatData && item.heartbeatData != null) {
                    if (!item.heartbeatData.lat || !item.heartbeatData.lng) {}
                    if (item.heartbeatData.lat === 0 || item.heartbeatData.lng === 0) {}
                    const temp = this.$gisUtil.ConvertGpsToAmap(item.heartbeatData.lat, item.heartbeatData.lng)
                    position = [temp.lng, temp.lat]
                }
            }
            return position
        },
        getMarkerUavHomePostion() {
            let position = [0, 0]
            if (this.selectedUavItem && this.selectedUavItem != null) {
                if (this.selectedUavItem.homePosition && this.selectedUavItem.homePosition != null) {
                    if (this.selectedUavItem.homePosition.lat !== 0 && this.selectedUavItem.homePosition.lng !== 0) {
                        const temp = this.$gisUtil.ConvertGpsToAmap(this.selectedUavItem.homePosition.lat, this.selectedUavItem.homePosition.lng)
                        position = [temp.lng, temp.lat]
                    }
                }
            }
            return position
        },
        getUavTitle(item) {
            let title = '无人机'
            if (item) {
                if (item.efUav && item.efUav != null) {
                    title = '名称:' + item.efUav.uavName +
                        '\r\n编号:' + item.uavId +
                        '\r\n状态:' + ((item.isOnline && item.isOnline === true) ? '在线' : '离线')
                }
            }
            return title
        },
        getUavHomeTitle() {
            let title = '起飞点'
            if (this.selectedUavItem && this.selectedUavItem != null) {
                if (this.selectedUavItem.efUav && this.selectedUavItem.efUav != null) {
                    title += '\r\n无人机:' + this.selectedUavItem.efUav.uavName +
                        '\r\n编号:' + this.selectedUavItem.uavId
                }
            }
            return title
        },
        getUavMarkerVisble(item) {
            let visble = false
            if (item) {
                if (item.heartbeatData && item.heartbeatData != null) {
                    if (!item.heartbeatData.lat || !item.heartbeatData.lng) {}
                    if (item.heartbeatData.lat === 0 || item.heartbeatData.lng === 0) {}
                    visble = true
                }
            }
            return visble
        },
        getUavHomeMarkerVisble() {
            let visble = false
            if (this.selectedUavItem && this.selectedUavItem != null) {
                if (this.selectedUavItem.homePosition && this.selectedUavItem.homePosition != null) {
                    if (this.selectedUavItem.homePosition.lat !== 0 && this.selectedUavItem.homePosition.lng !== 0) {
                        visble = true
                    }
                }
            }
            return visble
        },
        getUavIco(uav) {
            let ico = null
            if (uav) {
                if (uav.heartbeatData && uav.heartbeatData != null) {
                    if (!uav.heartbeatData.lat || !uav.heartbeatData.lng) {}
                    if (uav.heartbeatData.lat === 0 || uav.heartbeatData.lng === 0) {} else {
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

        // 后台交互 ---------------------------------------------------------
        getCurrentTime() {
            const data = new Date()
            const yy = data.getFullYear()
            const mm = data.getMonth() + 1
            const dd = data.getDate()
            const hh = data.getHours()
            const mf = data.getMinutes() < 10 ? '0' + data.getMinutes() : data.getMinutes()
            const ss = data.getSeconds() < 10 ? '0' + data.getSeconds() : data.getSeconds()
            return yy + '-' + mm + '-' + dd + '-' + hh + '' + mf + '' + ss
        },
        openOrCloseGcs() {
            if (this.selectedUavItem && this.selectedUavItem != null) {
                if (this.selectedUavItem.isGcsOnline) {
                    this.$confirm('是否关闭大疆地面站？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.doCommand(1029, 0, 0, 0, 0, 5)
                    }).catch(() => {});
                } else {
                    this.$confirm('是否打开大疆地面站？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.doCommand(1028, 0, 0, 0, 0, 5)
                    }).catch(() => {});
                }
            }
        },
        startOrStopCharging() {
            if (this.selectedUavItem && this.selectedUavItem != null) {
                if (this.selectedUavItem.isCharging) {
                    this.$confirm('是否停止充电？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.doCommand(1033, 0, 0, 0, 0, 5)
                    }).catch(() => {});
                } else {
                    this.$confirm('是否开始充电？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.doCommand(1032, 0, 0, 0, 0, 5)
                    }).catch(() => {});
                }
            }
        },
        openOrCloseSystem(open) {
            if (this.selectedUavItem && this.selectedUavItem != null) {
                if (!open) {
                    this.doCommand(1012, 0, 0, 0, 0, 5)
                        // this.$confirm('是否关闭系统？', '提示', {
                        //     confirmButtonText: '确定',
                        //     cancelButtonText: '取消',
                        //     type: 'warning'
                        // }).then(() => {
                        //     this.doCommand(1012, 0, 0, 0, 0, 5)
                        // }).catch(() => {});
                } else {
                    this.doCommand(1000, 0, 0, 0, 0, 5)
                        // this.$confirm('是否打开系统？', '提示', {
                        //     confirmButtonText: '确定',
                        //     cancelButtonText: '取消',
                        //     type: 'warning'
                        // }).then(() => {
                        //     this.doCommand(1000, 0, 0, 0, 0, 5)
                        // }).catch(() => {});
                }
            }
        },
        openOrCloseUav() {
            if (this.selectedUavItem && this.selectedUavItem != null) {
                if (this.selectedUavItem.isOnline) {
                    this.$confirm('是否关闭无人机？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.doCommand(1021, 0, 0, 0, 0, 5)
                    }).catch(() => {});
                } else {
                    this.$confirm('是否打开无人机？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.doCommand(1020, 0, 0, 0, 0, 5)
                    }).catch(() => {});
                }
            }
        },
        openOrCloseRemote() {
            if (this.selectedUavItem && this.selectedUavItem != null) {
                if (this.selectedUavItem.isRomoteControlOnline) {
                    this.$confirm('是否关闭遥控器？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.doCommand(1025, 0, 0, 0, 0, 5)
                    }).catch(() => {});
                } else {
                    this.$confirm('是否打开遥控器？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.doCommand(1024, 0, 0, 0, 0, 5)
                    }).catch(() => {});
                }
            }
        },
        // 打开关闭空调
        openOrCloseAirConditioner() {
            this.$confirm('是否启动空调？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.showToast('功能暂未开放！')
            }).catch(() => {});
            // if (this.selectedUavItem && this.selectedUavItem != null) {
            //     if (this.selectedUavItem.isRomoteControlOnline) {
            //         this.$confirm('是否关闭空调？', '提示', {
            //             confirmButtonText: '确定',
            //             cancelButtonText: '取消',
            //             type: 'warning'
            //         }).then(() => {
            //             this.showToast('功能暂未开放！')
            //                 // this.doCommand(1025, 0, 0, 0, 0, 5)
            //         }).catch(() => {});
            //     } else {
            //         this.$confirm('是否启动空调？', '提示', {
            //             confirmButtonText: '确定',
            //             cancelButtonText: '取消',
            //             type: 'warning'
            //         }).then(() => {
            //             this.showToast('功能暂未开放！')
            //         }).catch(() => {});
            //     }
            // }
        },
        saveWps() {
            if (this.wps.length <= 0) {
                this.showToast('请先规划航线路径！')
            } else {
                this.$layer.prompt({
                            title: '请输入任务信息',
                            formType: 0, // 输入框类型，支持0（文本）默认1（密码）2（多行文本）
                            // value: '航线任务' + this.getCurrentTime(), // 初始时的值，默认空字符
                            value: '暂无任务描述',
                            maxlength: 140, // 可输入文本的最大长度，默认500
                            area: ['400px', '270px'], // 自定义文本域宽高
                            scrollbar: false,
                            zIndex: 2000 // 层优先级
                        },
                        (taskDescriptions, index) => {
                            if ($('#taskName').val() === '' || taskDescriptions === '') {
                                this.$layer.msg('任务名称和描述不能为空！')
                                return
                            } else {
                                // console.log(`获取弹框的信息 任务名称 ${$('#taskName').val()} 任务描述:${taskDescriptions}`)
                                this.addTaskWps($('#taskName').val(), taskDescriptions)
                                this.$layer.close(index)
                            }
                        }
                    )
                    // 往class=vl-input元素前插入
                $('.vl-input').before(
                    `<div style="margin-bottom:8px">任务名称</div><input id="taskName" data-v-6c69dd9a type="text" style="margin-bottom:10px" class="vl-input"/><div style="margin-bottom:8px">任务描述</div>`
                )
            }
        },
        async queryAllCommands() {
            this.efCommands = []
                // 调用的是src/store/modules中的login方法
            return this.$store.dispatch('efCommands/queryAllCommands').then((response) => {
                const { code, data } = response
                if (code === 1 && data) {
                    this.efCommands = data
                }
            }).catch(() => {})
        },
        // 查询指令集
        async queryAllDjiEnum() {
            await this.$store
                .dispatch('efTaskWps/queryAllDjiEnum')
                .then((response) => {
                    if (response.code === 1) {
                        this.wpsGotoWaypointModeOptions = response.data.efDjiEnumGotoFirstWp
                        this.wpsHeadingModeOptons = response.data.efDjiEnumHeadingMode
                        this.wpsFlightPathModeOptions = response.data.efDjiEnumPathModes
                        this.wpsFinishedActionOptions = response.data.efDjiEnumFinlishTask
                        this.wpsRcSignalLostOptions = response.data.efDjiEnumRcSignLosts
                    } else {
                        this.showMessage(response.message, 'error')
                    }
                })
                .catch((error) => {
                    this.showMessage(error, 'error')
                })
        },
        async queryAllDjiActions() {
            this.djiActions = []
                // 调用的是src/store/modules中的login方法
            return this.$store.dispatch('efDjiActions/queryAllDjiActions').then((response) => {
                const { code, data } = response
                if (code === 1 && data) {
                    this.djiActions = data
                }
            }).catch(() => {})
        },
        // 查询拥有权限的无人机和停机坪
        async initMyUavHives() {
            this.hives = []
            this.uavs = []
                // 调用的是src/store/modules中的login方法
            return this.$store.dispatch('user/getMyUavHive').then((response) => {
                const { code, data, message } = response
                if (code === 1 && data) {
                    this.selectedUavItem = null
                    this.hives = data.hives
                        // const newName = data.uavs[0].efUav.uavName;
                        // for (let i = 0; i < 10; i++) {
                        //   data.uavs[0].selected = false
                        //   data.uavs[0].isOnline = (i % 2 === 0)
                        //   data.uavs[0].efUav.uavName = newName + '-' + i
                        //   this.uavs.push(JSON.parse(JSON.stringify(data.uavs[0])))
                        // }
                    let uavsTemp = data.uavs
                    if (uavsTemp && uavsTemp.length > 0) {
                        for (let i = 0; i < uavsTemp.length; i++) {
                            // 给数组增加字段
                            // uavFactoryId 无人机类型，大疆或翼飞
                            uavsTemp[i].selected = false
                            uavsTemp[i].isOnline = false
                            uavsTemp[i].isCharging = false // 充电状态
                            uavsTemp[i].isChargingText = "未知";
                            uavsTemp[i].isDjiServerOnline = false // 服务后台在线状态
                            uavsTemp[i].isGcsOnline = false // 地面站在线状态
                            uavsTemp[i].isUavOnline = false // 无人机在线状态
                            uavsTemp[i].isRomoteControlOnline = false // 遥控器在线状态
                            uavsTemp[i].isAirLinkOnline = false // 无人机与遥控器链接
                            uavsTemp[i].isCameraOnline = false // 相机
                            uavsTemp[i].djiServerBootTime = 0 //大疆服务启动时间

                            uavsTemp[i].djiServerTime = 0 // 大疆服务的心跳包时间
                            uavsTemp[i].heartbeatData = null // 实时心跳包数据
                            uavsTemp[i].heartbeatDataTime = 0 // 实时心跳包的时间
                                //uavsTemp.isDjiServerOnline = (uavsTemp.efUav.uavFactoryId !== 1)
                        }
                        this.uavs = uavsTemp

                        let index = 0
                        if (this.defaultUavIndex && this.defaultUavIndex !== null && !isNaN(this.defaultUavIndex) && this.defaultUavIndex < this.uavs.length) {
                            index = this.defaultUavIndex
                        }
                        this.clickUavItem(this.uavs[index])
                    }
                } else {
                    this.showMessage(message, 'error')
                }
            }).catch(() => {})
        },

        // 保存任务文件到云端
        async addTaskWps(name, des) {
            // let that = this
            this.wpsInfo.wpsName = name
            this.wpsInfo.wpsDes = des
            this.loading = true
                // 调用的是src/store/modules中的login方法
            return this.$store.dispatch('efTaskWps/addTaskWps', { wpsInfo: this.wpsInfo, wpsDetail: this.wps }).then((response) => {
                this.loading = false
                const { code, message } = response
                this.showMessage(message, code === 1 ? 'success' : 'error')
            }).catch(() => {
                this.loading = false
            })
        },
        // 上传任务至无人机
        async uploadWps() {
            if (this.wps.length <= 0) {
                this.showToast('请先规划航线路径！')
            } else {
                const data = {
                    tag: 0,
                    timeout: 10,
                    uavId: this.selectedUavItem.uavId,
                    wpsInfo: this.wpsInfo,
                    wpsDetail: this.wps
                }
                this.loading = true
                this.loadingText = '上传航线任务中...'
                return this.$store.dispatch('uav/uploadWps', data).then((response) => {
                    const { code, message } = response
                    this.loading = false
                    this.showMessage(message, code === 1 ? 'success' : 'error')
                    if (code === 1) {
                        setTimeout(() => { this.isShowMessageTip = false }, 30000) // 最多30秒后强制关闭提示
                    }
                }).catch(() => {
                    this.loading = false
                })
            }
        },
        // 从无人机下载任务
        async downloadWps() {
            if (this.selectedUavItem == null) {
                this.showToast('请选择无人机!')
            } else {
                this.$confirm('是否从无人机下载航线任务?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const data = {
                        tag: 0,
                        timeout: 20,
                        uavId: this.selectedUavItem.uavId,
                        wpsType: this.selectedUavType
                    }
                    this.loading = true
                    this.loadingText = '下载航线任务中...'
                    return this.$store.dispatch('uav/downloadWps', data).then((response) => {
                        const { code, message, data } = response
                        this.loading = false
                        this.showMessage(message, code === 1 ? 'success' : 'error')
                        if (code === 1) {
                            setTimeout(() => { this.isShowMessageTip = false }, 30000) // 最多30秒后强制关闭提示
                            const { msg3108, msg3109 } = data
                            if (msg3108 && msg3109) {
                                // 1、航线描述信息赋值
                                // this.wpsInfo.wpsLat = 0
                                // this.wpsInfo.wpsLng = 0
                                this.wpsInfo.wpsType = msg3108.missionType
                                this.wpsInfo.wpsWpCount = msg3108.wpsCount
                                this.wpsInfo.wpsSpeed = msg3108.speed / 100
                                this.wpsInfo.wpsMaxSpeed = msg3108.maxSpeed / 100
                                this.wpsInfo.wpsRcSignalLost = msg3108.missionOnRCSignalLostEnabled
                                this.wpsInfo.wpsFinishedAction = msg3108.missionFinishedAction
                                this.wpsInfo.wpsFlightPathMode = msg3108.missionFlightPathMode
                                this.wpsInfo.wpsGotoWaypointMode = msg3108.missionGotoWaypointMode
                                this.wpsInfo.wpsHeadingMode = msg3108.missionHeadingMode
                                this.wpsInfo.wpsRepeatTimes = msg3108.missionRepeatTimes
                                    // 1、航线航点赋值
                                const wps = msg3109.waypointDjiList
                                if (wps.length > 0) {
                                    this.clearWps()
                                    const latlng = { lat: 0, lng: 0 }
                                    for (let i = 0; i < wps.length; i++) {
                                        const actionCount = wps[i].actionCount
                                        const actions = wps[i].waypointDjiActionList
                                        let wpDjiActions = ''
                                        if (actionCount > 0 && actions.length > 0) {
                                            actions.forEach((item) => {
                                                wpDjiActions += item.actionType + ',' + item.actionParam
                                                wpDjiActions += '|'
                                            })
                                        }
                                        if (wpDjiActions.length > 0) {
                                            wpDjiActions = wpDjiActions.substring(0, wpDjiActions.length - 1)
                                        }
                                        const wp = {
                                            wpIndex: wps[i].wpNo,
                                            wpLat: wps[i].lat / 1E7,
                                            wpLng: wps[i].lng / 1E7,
                                            wpAlt: wps[i].altRel / 100,
                                            wpAltAbs: wps[i].altAbs / 100,
                                            wpAction: 16,
                                            wpDjiActions: wpDjiActions,
                                            wpParm1: 0,
                                            wpParm2: 0,
                                            wpParm3: 0,
                                            wpParm4: 0
                                        }
                                        if (latlng.lat === 0 || latlng.lng === 0) {
                                            latlng.lat = wp.wpLat
                                            latlng.lng = wp.wpLng
                                        }
                                        if (msg3108.missionType !== 1) {
                                            wp.wpParm1 = 0
                                            wp.wpParm2 = 0
                                            wp.wpParm3 = 0
                                            wp.wpParm4 = 0
                                        }
                                        this.addWpDetail(wp, false)
                                    }
                                    if (latlng.lat !== 0 && latlng.lng !== 0) {
                                        this.setMapCenter(latlng.lat, latlng.lng, 16)
                                    }
                                    this.refreshLine()
                                }
                            }
                        }
                    }).catch(() => {
                        this.loading = false
                    })
                }).catch(() => {})
            }
        },
        async beforeDoCommand(command, p1, p2, p3, p4, timeout, msg) {
            this.isDoingCommand = true
            let tip = msg
            if (!this.selectedUavItem.isOnline) {
                tip = "[无人机离线] " + msg
            }
            this.$confirm(tip, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (command === 'openSystem') {
                    this.openOrCloseSystem(true)
                } else if (command === 'closeSystem') {
                    this.openOrCloseSystem(false)
                } else {
                    this.doCommand(command, p1, p2, p3, p4, timeout)
                }
            }).catch(() => { this.isDoingCommand = false });
        },
        // 操作停机坪命令
        async beforeDoCommandHive(command, p1, p2, p3, p4, timeout, msg) {
            if (!this.selectedHiveItem || this.selectedHiveItem == null) {
                this.showMessage('未绑定或配置停机坪!', 'error')
                return
            }
            let tip = msg
            if (!this.selectedHiveItem.isOnline) {
                tip = "[停机坪离线] " + msg
            }
            this.$confirm(tip, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.doCommandHive(command, p1, p2, p3, p4, timeout)
            }).catch(() => {});
        },
        // 无人机控制指令
        async doCommand(command, p1, p2, p3, p4, timeout) {
            if (!timeout) {
                timeout = 5
            }
            const data = {
                tag: this.$tag++,
                timeout: timeout,
                uavId: this.selectedUavItem.uavId,
                command: command,
                parm1: p1,
                parm2: p2,
                parm3: p3,
                parm4: p4
            }
            if (command === 1151) {
                // 结束远程控制
                this.isRemoteEnable = false
                if (this.timerSendRemoteData) {
                    if (this.timerSendRemoteData != null) {
                        clearInterval(this.timerSendRemoteData);
                    }
                }
            }
            this.loading = true
            this.loadingText = '执行命令中...'
            return this.$store.dispatch('uav/doCommand', data).then((response) => {
                this.isDoingCommand = false
                const { code, message } = response
                this.loading = false
                let showTip = message
                if (command === 1150) {
                    // 开始远程控制成功
                    this.isRemoteEnable = false
                    if (this.timerSendRemoteData && this.timerSendRemoteData != null) {
                        clearInterval(this.timerSendRemoteData);
                    }
                    this.isRemoteEnable = true
                    this.timerSendRemoteData = setInterval(this.sendDjiRemoteData, 350);
                }
                if (code === 1) {
                    if (command === 1160) {
                        this.isYuntaiMode = true
                        showTip = '切换到拍照模式' + showTip
                    } else if (command === 1161) {
                        this.isYuntaiMode = false
                        showTip = '切换到录像模式' + showTip
                    } else if (command === 1162) {
                        showTip = '拍照' + showTip
                        this.isYuntaiMode = true
                    } else if (command === 1163) {
                        showTip = '开始录像' + showTip
                        this.isYuntaiMode = false
                    } else if (command === 1164) {
                        showTip = '结束录像' + showTip
                        this.isYuntaiMode = false
                    }
                }
                if (code === 1) {
                    this.showToast(showTip)
                } else {
                    this.showMessage(showTip, 'error')
                }
                //this.showMessage(showTip, code === 1 ? 'success' : 'error')
            }).catch(() => {
                this.isDoingCommand = false
                this.loading = false
            })
        },
        // 停机坪控制控制指令
        async doCommandHive(command, p1, p2, p3, p4, timeout) {
            const data = {
                tag: this.$tag++,
                timeout: timeout,
                hiveId: this.selectedHiveItem.hiveId,
                command: command,
                parm1: p1,
                parm2: p2,
                parm3: p3,
                parm4: p4
            }
            this.loading = true
            this.loadingText = '执行命令中...'
            return this.$store.dispatch('hive/doCommand', data).then((response) => {
                const { code, message } = response
                this.loading = false
                if (code === 1) {
                    this.showToast(message)
                } else {
                    this.showMessage(message, 'error')
                }
                // this.showMessage(message, code === 1 ? 'success' : 'error')
            }).catch(() => {
                this.loading = false
            })
        },
        // 下载云端任务
        async showAllTaskWps() {
            this.isDialogTasks = true
            await this.queryAllTaskWps()
        },
        // 删除任务
        async deleteTaskById(id) {
            this.loadingWps = true
            await this.$store
                .dispatch("efTaskWps/deleteTimedTask", { id: id })
                .then((response) => {
                    this.loadingWps = false
                    if (response.code === 1) {
                        this.showToast('删除成功')
                        const index = this.taskWps.findIndex((item) => {
                            if (item.id === id) {
                                return
                            }
                        })
                        if (index >= 0) {
                            this.taskWps.splice(index, 1)
                        }
                    } else {
                        this.showMessage(response.message, 'error')
                    }
                });
        },
        //查询所有航点任务 
        async queryAllTaskWps() {
            this.loadingWps = true;
            this.taskWps = [];
            await this.$store
                .dispatch("timedTask/queryAllTaskWps", { type: null })
                .then((response) => {
                    this.loadingWps = false;
                    if (response.code === 1) {
                        this.taskWps = response.data
                    } else {
                        this.showToast(response.message);
                    }
                })
                .catch((error) => {
                    this.loadingWps = false;
                    this.showMessage(error, 'error')
                });
        },
        //查询选择任务的所有航点
        async queryByWpsIndex(id, wpsName, item) {
            const msg = '当前任务类型与所选择的无人机不一致！'
            if (item.wpsType === 1) {
                //item.wpsType  0为翼飞任务，1为大疆任务
                //this.selectedUavType 1 大疆，2 翼飞，3 xxx
                if (this.selectedUavType !== 1) {
                    this.showMessage(msg, 'warning')
                    return
                }
            } else {
                if (this.selectedUavType !== 2) {
                    this.showMessage(msg, 'warning')
                    return
                }
            }
            this.loadingWps = true;
            this.wpsInfo.id = id;
            this.wpsInfo.wpsName = wpsName;
            this.wpsInfo.wpsType = item.wpsType;
            this.wpsInfo.wpsLat = item.wpsLat;
            this.wpsInfo.wpsLng = item.wpsLng;
            this.wpsInfo.wpsAlt = item.wpsAlt;
            this.wpsInfo.wpsDistance = item.wpsDistance;
            this.wpsInfo.wpsUserTime = item.wpsUserTime;
            this.wpsInfo.wpsWpCount = item.wpsWpCount;
            this.wpsInfo.wpsLocation = item.wpsLocation;
            this.wpsInfo.wpsAltAbs = item.wpsAltAbs;
            this.wpsInfo.wpsCreateTime = item.wpsCreateTime;
            this.wpsInfo.wpsCreateByUserId = item.wpsCreateByUserId;
            this.wpsInfo.wpsUpdateTime = item.wpsUpdateTime;
            this.wpsInfo.wpsUpdateByUserId = item.wpsUpdateByUserId;
            this.wpsInfo.wpsDes = item.wpsDes;
            this.wpsInfo.wpsCompanyId = item.wpsCompanyId;
            this.wpsInfo.wpsSpeed = item.wpsSpeed;
            this.wpsInfo.wpsMaxSpeed = item.wpsMaxSpeed;
            this.wpsInfo.wpsRcSignalLost = item.wpsRcSignalLost;
            this.wpsInfo.wpsFinishedAction = item.wpsFinishedAction;
            this.wpsInfo.wpsFlightPathMode = item.wpsFlightPathMode;
            this.wpsInfo.wpsGotoWaypointMode = item.wpsGotoWaypointMode;
            this.wpsInfo.wpsHeadingMode = item.wpsHeadingMode;
            this.wpsInfo.wpsRepeatTimes = item.wpsRepeatTimes;
            await this.$store
                .dispatch("efTaskWps/queryByWpsIndex", { id: id, })
                .then((response) => {
                    this.loadingWps = false;
                    const { code, data, message } = response
                    if (code === 1) {
                        this.showToast('下载任务成功')
                        if (data && data.length > 0) {
                            const { efTaskWps, efTaskWpsDetails } = data[0]
                            this.clearWps();
                            this.wps = efTaskWpsDetails
                            this.refreshLine();
                            if (this.wps && this.wps.length >= 0) {
                                this.setMapCenter(this.wps[0].wpLat, this.wps[0].wpLng, 16)
                            }
                        }
                    } else {
                        this.showMessage(message, 'error')
                    }
                });
        },
        // 查询当前流是否正在播放
        async getLineStreamOnline(url, type) {
            // url = "www.efuav.xyz/live/asdweqrfdsfds-stream1?txSecret=423c66abf4a948c3c28a623449b9e15b&txTime=61ea3c31"
            if (url && url.length > 10) {
                let temp = url
                try {
                    const index = url.indexOf('?')
                    if (index > 0) {
                        url = url.substring(0, index)
                        const index2 = url.lastIndexOf('/')
                        url = url.substring(index2 + 1, url.length)
                    }
                } catch (error) {
                    url = temp
                }
            }
            if (type === 'uav') {
                this.isRequestStream1 = true
                this.textRequestStream1 = '获取视频状态中'
            } else if (type === 'hive') {
                this.isRequestStream2 = true
                this.textRequestStream2 = '获取视频状态中'
            }
            let result = null
            try {
                await this.$store
                    .dispatch("efTencent/getLineStreamOnline", { appName: 'live', streamName: url, timeout: 5 })
                    .then((response) => {
                        const { code, data } = response
                        // this.loadingWps = false
                        if (code === 1 && data.streamState) {
                            result = data.streamState === 'active'
                            if (type === 'uav') {
                                this.textRequestStream1 = result ? '加载视频中' : '未开始直播'
                            } else if (type === 'hive') {
                                this.textRequestStream2 = result ? '加载视频中' : '未开始直播'
                            }
                            setTimeout(() => {
                                if (type === 'uav') {
                                    this.isRequestStream1 = false
                                } else if (type === 'hive') {
                                    this.isRequestStream2 = false
                                }
                            }, 1500)
                        }
                    });
            } catch (error) {
                setTimeout(() => {
                    if (type === 'uav') {
                        this.isRequestStream1 = false
                    } else if (type === 'hive') {
                        this.isRequestStream2 = false
                    }
                }, 1500)
            }
            return result
        },
        // 根据无人机编号获取对应绑定的停机坪 
        async getHiveByUavId(uavId) {
            this.loading = true
            this.selectedHiveItem = {}
            this.hivesNowUav = []
            this.isHasHive = false
            try {
                await this.$store
                    .dispatch("efRelationUavHive/queryByUavId", { uavId: uavId })
                    .then((response) => {
                        this.loading = false;
                        const { code, message, data } = response
                        if (code === 1) {
                            debugger
                            if (data && data.length >= 0) {
                                for (let i = 0; i < data.length; i++) {
                                    for (let j = 0; j < this.hives.length; j++) {
                                        if (this.hives[j].hiveId === data[i].hiveId) {
                                            this.hivesNowUav.push(this.hives[j])
                                            break
                                        }
                                    }
                                }
                                if (this.hivesNowUav.length > 0) {
                                    this.isHasHive = true
                                    let index = 0
                                    if (this.defaultHiveIndex && this.defaultHiveIndex !== null && !isNaN(this.defaultHiveIndex) && this.defaultHiveIndex < this.hivesNowUav.length) {
                                        index = this.defaultHiveIndex
                                    }
                                    this.selectedHiveItem = this.hivesNowUav[index]
                                }
                                // for (let index = 0; index < 20; index++) {
                                //     let item = JSON.parse(JSON.stringify(this.selectedHiveItem))
                                //     item.hiveId = this.selectedHiveItem.hiveId + (index + 1)
                                //     this.hivesNowUav.push(item)
                                // }
                            } else {
                                this.showToast('当前无人机未绑定停机坪！')
                            }
                        } else {
                            this.showMessage(message, 'warning');
                        }
                    })
                    .catch((error) => {
                        this.loading = false;
                        this.showMessage(error, 'error')
                    });
            } catch (error) {
                this.loading = false;
            }
        },
        // websocket ---------------------------------------------------------
        // 初始化weosocket
        async initWebSocket() {
            // console.log('initWebSocket 1')
            if (this.userId && this.name) {
                if (this.userId !== '' && this.name !== '') {
                    if (this.webSocket !== null) {
                        this.webSocket.destroy()
                        this.webSocket = null
                    }
                    // let webSocketPath = this.$webSocketPath
                    // let webSocketPath = process.env.WEB_SOCKET_URL
                    // console.log('web socket 连接地址:' + webSocketPath)
                    // const wsuri = 'ws://127.0.0.1:8765/efapi/uavsystem/websocket/' + this.userId + '/' + this.name
                    // const URL = 'ws://' + location.host + '/websocketapi/' + this.userId + '/' + this.name
                    const URL = (location.protocol === "https:" ? "wss" : "ws") + '://' + location.host + '/websocketapi/' + this.userId + '/' + this.name
                    console.log('连接地址：' + URL)
                    this.webSocket = new WebSocket(URL)
                        // console.log('initWebSocket 2')
                    this.webSocket.onmessage = this.websocketonmessage
                    this.webSocket.onopen = this.websocketonopen
                    this.webSocket.onerror = this.websocketonerror
                    this.webSocket.onclose = this.websocketclose
                }
            }
        },
        // 连接建立之后执行send方法发送数据
        websocketonopen() {
            // console.log('websocketonopen')
            const actions = { 'msg': '我来了，同志们！' }
            this.websocketsend(JSON.stringify(actions))
        },
        // 连接建立失败重连
        websocketonerror(e) {
            console.log('websocketonerror：' + e)
            this.initWebSocket()
        },
        // 数据接收
        websocketonmessage(e) {
            // console.log('接收WebSocket数据：' + e.data)
            let index = -1 // 当前无人机在数组中的索引
            let indexHive = -1 // 当前停机坪在数组中的索引
            let isNowUav = false
            let isNowHive = false
            const resultUtil = JSON.parse(e.data)
            const { messageID, code, deviceID, message, data } = resultUtil
            let needForceUpdate = false
            if (this.uavs && this.uavs.length > 0) {
                index = this.uavs.findIndex(x => x.uavId === deviceID)
            }
            if (this.hives && this.hives.length > 0) {
                indexHive = this.hives.findIndex(x => x.hiveId === deviceID)
            }
            if (this.selectedUavItem && this.selectedUavItem !== null && this.selectedUavItem.uavId === deviceID) {
                isNowUav = true
            }
            if (this.selectedHiveItem && this.selectedHiveItem !== null && this.selectedHiveItem.hiveId === deviceID) {
                isNowHive = true
            }
            switch (messageID) {
                case 2200: // 大疆无人机心跳包
                    if (index >= 0) {
                        needForceUpdate = true
                        this.uavs[index].isOnline = true
                        this.uavs[index].heartbeatData = data
                        this.uavs[index].heartbeatDataTime = Date.now()
                        if (isNowUav) {
                            // this.speechSynthesis()
                            if (this.isMapFollowUav) {
                                this.setMapCenter(data.lat, data.lng)
                            }
                            // 首次定位，跳转到对应的地图位置
                            if (data.lat === 0 && data.lng === 0) {
                                this.isFirstGpsFixed = false
                            } else {
                                if (this.selectedUavItem.heartbeatData.aremd === 0) {
                                    this.selectedUavItem.homePosition = { lat: data.lat, lng: data.lng }
                                }
                                if (this.isFirstGpsFixed === false) {
                                    if (data.lat !== 0 && data.lng !== 0) {
                                        this.isFirstGpsFixed = true
                                        this.selectedUavItem.homePosition = { lat: data.lat, lng: data.lng }
                                    }
                                }
                            }
                            if (this.ProgressShowTime + 5000 < Date.now()) {
                                this.ProgressShowTime = Date.now();
                                if (this.selectedUavItem.isOnline) {
                                    if (this.selectedUavItem.heartbeatData.areMotorsOn === 1) {
                                        this.ProgressShow = "飞行中";
                                    } else {
                                        this.ProgressShow = "地面待命";
                                    }
                                } else {
                                    this.ProgressShow = "离线";
                                }
                            }
                        }
                    }
                    break
                case 2250: // 大疆服务后台心跳包
                    const { bootTime, isAirLinkOnline, isCameraOnline, isGcsOnline, isRomoteControlOnline, isUavOnline, machineCode } = data
                    if (index >= 0) {
                        needForceUpdate = true
                        this.uavs[index].isDjiServerOnline = true // 服务后台在线状态
                        this.uavs[index].isGcsOnline = (isGcsOnline === 1) // 地面站在线状态
                        this.uavs[index].isUavOnline = (isUavOnline === 1) // 无人机在线状态
                        this.uavs[index].isRomoteControlOnline = (isRomoteControlOnline === 1) // 遥控器在线状态
                        this.uavs[index].isAirLinkOnline = (isAirLinkOnline === 1) // 无人机与遥控器链接
                        this.uavs[index].isCameraOnline = (isCameraOnline === 1) // 相机
                        this.uavs[index].djiServerBootTime = bootTime //大疆服务启动时间
                        this.uavs[index].djiServerTime = Date.now()
                    }
                    break
                case 2251: // 
                    // const { bootTime, isAirLinkOnline, isCameraOnline, isGcsOnline, isRomoteControlOnline, isUavOnline, machineCode } = data
                    // if (this.uavs && this.uavs.length > 0) {
                    //   uavIndex = this.uavs.findIndex(x => x.uavId === deviceID)
                    //   if (uavIndex >= 0) {
                    //     this.uavs[uavIndex].isDjiServerOnline = true
                    //   }
                    // }
                    break
                case 3101: // 无人机上传航线中
                    if (data) {
                        this.isShowMessageTip = true
                        const { progress, progressCount, progressText, result, tag } = data
                        if (result === 1) {
                            this.messageType = 'success'
                            if (progressText !== '') {
                                this.messageTip = progressText
                            }
                        } else {
                            this.messageType = 'warning'
                            if (progressText !== '') {
                                this.messageTip = progressText
                            }
                        }
                        if (progress === progressCount) {
                            setTimeout(() => { this.isShowMessageTip = false }, 3000)
                        }
                    }
                    break
                case 3109: // 下载无人机任务
                    if (data) {
                        console.log('下载航线：' + data)
                    }
                    break
                case 2300: // 机巢心跳包
                    if (indexHive >= 0) {
                        needForceUpdate = true
                        this.hives[indexHive].isOnline = true
                        this.hives[indexHive].heartbeatData = data
                        this.hives[indexHive].heartbeatDataTime = Date.now()
                        if (this.selectedHiveItem && this.selectedHiveItem !== null && this.selectedHiveItem.hiveId === deviceID) {
                            this.selectedHiveItem.isOnline = true
                            if (this.selectedUavItem && this.selectedUavItem != null) {
                                this.selectedUavItem.isCharging = (data.chargeStatus === 2 || data.chargeStatus === 3); // 是否正在充电，0：未知，1：未充电，2：充电中，3：已充满
                                this.selectedUavItem.isChargingText = "未知";
                                switch (data.chargeStatus) {
                                    case 1:
                                        this.selectedUavItem.isChargingText = "未充电";
                                        break;
                                    case 2:
                                        this.selectedUavItem.isChargingText = "充电中";
                                        break;
                                    case 3:
                                        this.selectedUavItem.isChargingText = "已充满";
                                        break;
                                }
                            }
                        }
                    }
                    break
                case 2350: // 气象站数据
                    if (indexHive >= 0) {
                        needForceUpdate = true
                        this.hives[indexHive].isOnlineWeather = true
                        this.hives[indexHive].heartbeatDataWeather = data
                        this.hives[indexHive].heartbeatDataWeatherTime = Date.now()
                        if (this.selectedHiveItem && this.selectedHiveItem !== null && this.selectedHiveItem.hiveId === deviceID) {
                            this.selectedHiveItem.isOnlineWeather = true
                        }
                    }
                    break
                case 2370: // 基站心跳包
                    if (indexHive >= 0) {
                        needForceUpdate = true
                        this.hives[indexHive].isOnlineBasestation = true
                        this.hives[indexHive].heartbeatDataBasestation = data
                        this.hives[indexHive].heartbeatDataBasestationTime = Date.now()
                        if (this.selectedHiveItem && this.selectedHiveItem !== null && this.selectedHiveItem.hiveId === deviceID) {
                            this.selectedHiveItem.isOnlineBasestation = true
                        }
                    }
                    break
                case 3052: // 全自动指令，后续回复 
                    // console.log(resultUtil)
                    if (isNowUav) {
                        // needForceUpdate = true
                        // 界面显示提示信息
                        let ProgressText = data.progressTextDes; // 进度信息
                        let ProgressError = data.errorText; // 错误信息
                        let Progress = data.progress; // 倒计时
                        this.ProgressShowTime = Date.now();
                        if (ProgressError !== "") {
                            this.ProgressShow = ProgressError;
                        } else {
                            if (Progress > 0) {
                                this.ProgressShow = ProgressText + "[" + Progress + "]";
                            } else {
                                this.ProgressShow = ProgressText;
                            }
                        }
                    }
                    break
            }
            if (needForceUpdate) {
                this.$forceUpdate()
            }
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
            console.log('断开连接：' + e)
        },
        async logout() {}
    }
}