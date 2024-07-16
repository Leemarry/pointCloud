<!--  -->
<template>
    <footer>
        <p>© 2023 My Website. All rights reserved.</p>
    </footer>
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
            uav: [],

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
        init() {
            // window.onbeforeunload = this.onbeforeunload()
            window.addEventListener('beforeunload', function (e) {
                e.preventDefault();
                e.returnValue = '';
                alert('你是否关闭页面？？');
            });
        },
        onbeforeunload() {
            alert('你是否关闭页面？？')
        },
        // #region --------------------------------------------------------- websocket ---------------------------------------------------------
        // 初始化weosocket
        async initWebSocket() {
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
                this.webSocket.onmessage = this.websocketonmessage;  //接收数据
                this.webSocket.onopen = this.websocketonopen;
                this.webSocket.onerror = this.websocketonerror;
                this.webSocket.onclose = this.websocketclose;
                // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
                //  window.onbeforeunload = that.onbeforeunload()

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
            // console.log(edata);
            let index = -1; // 当前无人机在数组中的索引
            let isNowUav = false; // 是不是默认无人机
            let isNowHive = false; // 是不是默认
            const resultUtil = JSON.parse(e.data);
            const {
                messageId, // 没有用到
                code, // 1
                deviceID = resultUtil.data.uavId, // 没有用到 用默认data值
                message, // " "
                data, // data -- 数据
            } = resultUtil;

            let needForceUpdate = false;

            var defaultData = null;
            if (this.defaultUavSn === deviceID) {
                isNowUav = true;
                defaultData = data;
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
                    // debugger;
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
                            this.uavstableData[index].array.unshift(defaultData);
                        } else {
                            this.uavstableData.push({
                                uavId: deviceID,
                                array: [defaultData],
                            });
                            index = this.uavstableData.length - 1;
                        }
                    } else {
                        this.uavstableData.push({
                            uavId: deviceID,
                            array: [defaultData],
                        });
                        index = 0;
                    }
                    if (isNowUav) {
                        needForceUpdate = true;
                        this.resultData = defaultData; // 图片覆盖
                        if (index >= 0 && this.uavstableData.length > index) {
                            this.isDangQianuav = this.uavstableData[index].array;
                        }
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

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        // this.initWebSocket()
        this.init()
    },
    beforeCreate() { }, //生命周期 - 创建之前
    beforeMount() { }, //生命周期 - 挂载之前
    beforeUpdate() { }, //生命周期 - 更新之前
    updated() { }, //生命周期 - 更新之后
    beforeDestroy() {
        // this.init()
    }, //生命周期 - 销毁之前
    destroyed() { }, //生命周期 - 销毁完成
    activated() { }, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
/* 组件的样式 */
footer {
    background-color: #f0f0f0;
    padding: 20px;
    text-align: center;
}
</style>