
<!-- 视频 -->
<template>
    <!-- :class="{ activeTohide: isHide == false }" -->
    <div class="player">
        <div class="videoCtrl" :id="'videoView'"></div>
        <!-- 无人机标题 this.$attrs.defaultUavInfo.uavName -->
        <div :class="checkedEditor ? 'videoTitleChecked' : 'videoTitle'">{{ defaultUavInfo ? defaultUavInfo.uavName : '' }}</div>
        <div class="videoDiv" v-loading="loading" @mouseover="isVideoMouseOver = true" @mouseleave="isVideoMouseOver = false">
        </div>
        <div class="tools" @mouseover="isVideoMouseOver = true" @mouseleave="isVideoMouseOver = false" v-show="isVideoMouseOver">
            <el-button-group>
                <el-tooltip class="item" effect="dark" content="刷新视频源" placement="bottom">
                    <el-button class="button" size="mini" icon="el-icon-refresh" circle @click="play()" />
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="停止播放" placement="bottom">
                    <el-button class="button" size="mini" icon="el-icon-video-pause" circle @click="stop()" />
                </el-tooltip>
                <!-- <el-tooltip class="item" effect="dark" content="切换无人机" placement="bottom">
                    <el-button class="button" size="mini" icon="el-icon-sort" circle @click="switchUavVideo()" />
                </el-tooltip> -->
                <el-tooltip class="item" effect="dark" content="切回地图" placement="bottom">
                    <el-button class="button" size="mini" icon="el-icon-location-information" circle @click="switchMapOrVideo()" />
                </el-tooltip>
            </el-button-group>
        </div>
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
            isVideoMouseOver: false,
            loading: false,
            uavNameEditor: 'ssss',
            checkedEditor: false,
            streamTypeEditor: "webrtc",
            tencentPlayer: null,
        };

    },
    //让组件接收外部传来的数据
    props: {
        defaultUavInfo: {
            type: Object,
            default: {}
        }

    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {
        'defaultUavInfo': {
            handler: function (newVal, oldVal) {
                console.log('defaultUavInfo 是否有变化');
                // 判断 defaultUavInfo 是否有变化
                if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
                    // 执行 play 方法
                    this.play(newVal);
                }
            },
            deep: true // 深度监听对象内部属性的变化
        }

    },
    //方法集合
    methods: {
        // 刷新视频源
        play(uavInfo =this.defaultUavInfo) {
            console.log('播放', this.defaultUavInfo.uavName);
            let that = this;
            // that.defaultSnInfo = that.$attrs.defaultSnInfo || uavInfo
            that.loading = true;
            try {
                let url = uavInfo.playUrl1 || null;
                // console.log("播放地址：" + url)
                this.stop();
                if (url !== null && url.length > 5) {
                    if (this.streamTypeEditor === "webrtc") {
                        this.tencentPlayer = new this.TcPlayer(
                            "videoView",
                            {
                                // /** * 视频类型播放优先级 * mobile ：m3u8>mp4 * PC ：RTMP>flv>m3u8>mp4 */
                                // webrtc: 'webrtc://www.efuav.xyz/live/1581F5FKD238B00D0V24-stream1?txSecret=cd1fd6dcdf5048885a6acf4048b1efc8&txTime=6808A4E6', 
                                webrtc: "webrtc://" + url,
                                // rtmp: "rtmp://www.efuav.xyz/djicloud/dji001?txSecret=7607ee8f8b81586114a60746b9466888&txTime=6811BEC4",//"rtmp://" + url, // 播放 RTMP 格式的视频必须启用 Flash，目前浏览器默认禁用 Flash，需用户手动开启。
                                flv: "http://" + url + ".flv",
                                // "m3u8": "http://" + url + ".m3u8", //hls/m3u8:  延迟比较大，一般是20s - 30s左右的延迟
                                // "live": "true",
                                volume: "0", // 设置初始音量，范围：0 到 1 [v2.2.0+]。
                                autoplay: "true", // iOS 下 safari 浏览器是不开放这个能力的
                                controls: "false", // 是否显示播放器的控制栏 none
                                webrtcConfig: { streamType: "video" }, // 仅拉取视频流，auto：拉取视频流和音频流
                                // "poster" : {"style":"cover", "src":"http://www.test.com/myimage.jpg"}, // 视频封面,cover/stretch/default
                                "width": '100%',//视频的显示宽度，请尽量使用视频分辨率宽度
                                "height": '100%',//视频的显示高度，请尽量使用视频分辨率高度
                                wording: {
                                    2003: "连接视频超时",
                                    2032: "请求视频失败，请检查网络",
                                    2048: "请求m3u8文件失败，可能是网络错误或者跨域问题",
                                },
                            }
                        );
                        // this.tencentPlayer = new TCPlayer("videoView", {
                        //     // fileID: "387702293675946633",
                        //     // appID: "1500009007",
                        //     fileID: "387702305305947266",
                        //     appID: "1500006438",
                        //     psign: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6MTUwMDAwNjQzOCwiZmlsZUlkIjoiMzg3NzAyMzA1MzA1OTQ3MjY2IiwiY3VycmVudFRpbWVTdGFtcCI6MTY2NzIzNzQyNywiY29udGVudEluZm8iOnsiYXVkaW9WaWRlb1R5cGUiOiJSYXdBZGFwdGl2ZSIsInJhd0FkYXB0aXZlRGVmaW5pdGlvbiI6MTB9LCJleHBpcmVUaW1lU3RhbXAiOjIxNzc0MjQwMDAsInVybEFjY2Vzc0luZm8iOnsiZG9tYWluIjoiMTUwMDAwNjQzOC52b2QyLm15cWNsb3VkLmNvbSIsInNjaGVtZSI6IkhUVFBTIn19.SnZnyJxJKGnFaz7M0SNWWs41NCZdCPhc-_lyHSuiXlA',
                        //     poster: "https://tcplayer-1306264703.cos.ap-nanjing.myqcloud.com/picture/poster.png",
                        // });

                        this.tencentPlayer.play();
                    } else {
                        this.showToast("暂不支持其它格式视频播放！");
                    }
                }
            } catch (e) { } finally {
                this.loading = false;
            }

        },
        tcplay(url) {
            let that = this;
            that.loading = true;
            try {
                if (url !== null && url.length > 5) {
    
                        this.tencentPlayer = new this.TcPlayer(
                            "videoView",
                            {
                                // rtmp://www.efuav.xyz/live/1581F5FKD238B00D0V24-stream1?txSecret=cd1fd6dcdf5048885a6acf4048b1efc8&txTime=6808A4E6
                                // /** * 视频类型播放优先级 * mobile ：m3u8>mp4 * PC ：RTMP>flv>m3u8>mp4 */
                                webrtc: 'webrtc://www.efuav.xyz/live/1581F5FKD238B00D0V24-stream1?txSecret=d1fd6dcdf5048885a6acf4048b1efcc8&txTime=6808A4E6', //"webrtc://" + url,
                                volume: "0", // 设置初始音量，范围：0 到 1 [v2.2.0+]。
                                autoplay: "true", // iOS 下 safari 浏览器是不开放这个能力的
                                controls: "false", // 是否显示播放器的控制栏 none
                                webrtcConfig: { streamType: "video" }, // 仅拉取视频流，auto：拉取视频流和音频流
                                // "poster" : {"style":"cover", "src":"http://www.test.com/myimage.jpg"}, // 视频封面,cover/stretch/default
                                "width": '100%',//视频的显示宽度，请尽量使用视频分辨率宽度
                                "height": '100%',//视频的显示高度，请尽量使用视频分辨率高度
                                wording: {
                                    2003: "连接视频超时",
                                    2032: "请求视频失败，请检查网络",
                                    2048: "请求m3u8文件失败，可能是网络错误或者跨域问题",
                                },
                            }
                        );
                        this.tencentPlayer.play();
                }
            } catch (e) { } finally {
                this.loading = false;
            }

        },
        stop() {
            try {
                if (this.tencentPlayer != null) {
                    if (this.streamTypeEditor !== "webrtc") {
                        this.tencentPlayer.pause();
                        this.tencentPlayer.unload();
                        this.tencentPlayer.detachMediaElement();
                    } else {
                        this.tencentPlayer.pause();
                    }
                    this.tencentPlayer.destroy();
                    this.tencentPlayer = null;
                }
            } catch (error) { }
        },
        /**切换mapOrvideo */
        switchMapOrVideo() {
            this.$emit("send:switchMapOrVideo");
        },
        // 打开开弹窗切换无人机
        switchUavVideo() {
            //发送打开弹窗
            this.$emit("sendswitchUavVideo")

        },
        findUavname(newVal) {
            if (newVal) {
                var uav = this.uavs.find((item) => {
                    return item.uavId === newVal;
                });
                return uav ? uav.uavName : null;
            } else {
                var uav = this.uavs.find((item) => {
                    return item.uavId === this.uavSn;
                });
                return uav ? uav.uavName : null;
            }
        },

    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.$EventBus.$on("Do:play", this.play)

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
    beforeCreate() { }, //生命周期 - 创建之前
    beforeMount() { }, //生命周期 - 挂载之前
    beforeUpdate() { }, //生命周期 - 更新之前
    updated() { }, //生命周期 - 更新之后
    beforeDestroy() { 
        this.stop()
    }, //生命周期 - 销毁之前
    destroyed() { }, //生命周期 - 销毁完成
    activated() { }, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类

/* 视频 */
.player {
    width: 100%;
    height: 100%;
    background-color: #242424;
    border: 2px solid rgb(0, 0, 0);
    padding: 5px;
    text-align: center;
    position: relative;
}
.videoCtrl {
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    background: rgb(0, 0, 0);
}

.videoDiv {
    position: absolute;
    background: transparent;
    top: 0px;
    left: 10px;
    right: 10px;
    bottom: 10px;
}

.tools {
    top: 15px;
    position: absolute;
    right: 10px;
}

.item {
    border: 1px solid rgb(73, 72, 72);
    background-color: #242424;
}

.button {
    background-color: #242424;
}

/* 文字标题 */
.videoTitleChecked {
    position: absolute;
    top: 10px;
    width: 100%;
    margin: 0 auto;
    font-weight: bold;
    color: #3de7c9;
}

.videoTitle {
    position: absolute;
    top: 10px;
    width: 100%;
    margin: 0 auto;
    color: rgb(212, 212, 212);
}
.vcp-player {
    width: 100% !important;
    height: 100% !important;
}
</style>