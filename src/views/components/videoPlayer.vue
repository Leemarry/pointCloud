<template>
  <div class="player">
    <div class="videoCtrl" :id="'videoView'+streamNo"></div>
    <div :class="checkedEditor?'videoTitleChecked':'videoTitle'">{{ uavNameEditor }}</div>
    <div class="videoDiv" v-loading="loading" @mouseover="isVideoMouseOver=true" @mouseleave="isVideoMouseOver=false"></div>
    <div class="tools" @mouseover="isVideoMouseOver=true" @mouseleave="isVideoMouseOver=false" v-show="isVideoMouseOver">
      <el-button-group>
        <el-tooltip class="item" effect="dark" content="刷新视频源" placement="bottom">
          <el-button class="button" size="mini" icon="el-icon-refresh" circle @click="play()" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="停止播放" placement="bottom">
          <el-button class="button" size="mini" icon="el-icon-video-pause" circle @click="stop()" />
        </el-tooltip>
        <el-tooltip class="item" v-if="type" effect="dark" content="切换无人机" placement="bottom">
          <el-button class="button" size="mini" icon="el-icon-sort" circle @click="switchVideoNo()" />
        </el-tooltip>
      </el-button-group>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: Boolean,
      default: true
    },
    checked: {
      type: Boolean,
      default: false
    },
    streamNo: {
      type: String,
      default: "0"
    },
    streamType: {
      type: String,
      default: 'webrtc'
    },
    uavSn: {
      type: String,
      default: ''
    },
    uavName: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: '-'
    },
  },
  data() {
    return {
      loading: false,
      tencentPlayer: null,
      isDialogCameraSetting: false,
      isVideoMouseOver: false,
      isCanOpter: true,
      isCanOpterUav: true,
      uavSnEditor: this.uavSn,
      uavNameEditor: this.uavName,
      urlEditor: this.url,
      streamTypeEditor: this.streamType,
      checkedEditor: this.checked,
    };
  },
  watch: {
    // url(newVal) {
    //   if (newVal == null) { newVal = "-"; }
    //   this.urlTemp = newVal;
    // }
  },
  created() {
    // console.log("created  第" + this.streamNo + "个视频", "播放地址：" + this.url)
  },
  mounted() {
    // console.log("mounted  第" + this.streamNo + "个视频", "播放地址：" + this.url)
  },
  beforeDestroy() {
    // console.log("beforeDestroy  第" + this.streamNo + "个视频", "播放地址：" + this.url)
    this.stop();
  },
  onDestroy() {
    // console.log("onDestroy  第" + this.streamNo + "个视频", "播放地址：" + this.url)
    this.stop();
  },
  methods: {
    showToast(msg) {
      this.$layer.msg(msg)
    },
    setChecked(temp) {
      this.checkedEditor = temp;
    },
    changeUav(sn, name, url, type) {
      this.streamTypeEditor = type;
      this.urlEditor = url;
      this.uavSnEditor = sn;
      this.uavNameEditor = name;
      // this.play();
    },
    async doCommand(command, p1, p2, p3, p4, timeout) {
      this.$parent.$parent.doCommand(command, p1, p2, p3, p4, timeout);
    },
    switchVideoNo() {
      this.$parent.$parent.switchVideoNo(this.streamNo, this.uavSnEditor);
    },
    play() {
      this.loading = true;
      try {
        let url = this.urlEditor;
        console.log("播放地址：" + url)
        this.stop();
        if (url !== null && url.length > 5) {
          console.log(url);
          if (this.streamTypeEditor === 'webrtc') {
            this.tencentPlayer = new this.TcPlayer('videoView' + this.streamNo, {
              // /** * 视频类型播放优先级 * mobile ：m3u8>mp4 * PC ：RTMP>flv>m3u8>mp4 */
              "webrtc": "webrtc://" + url,
              // "rtmp":"rtmp://" + url, // 播放 RTMP 格式的视频必须启用 Flash，目前浏览器默认禁用 Flash，需用户手动开启。
              "flv": "http://" + url + ".flv",
              // "m3u8": "http://" + url + ".m3u8", //hls/m3u8:  延迟比较大，一般是20s - 30s左右的延迟
              // "live": "true",
              "volume": "0", // 设置初始音量，范围：0 到 1 [v2.2.0+]。
              "autoplay": "true", // iOS 下 safari 浏览器是不开放这个能力的
              "controls": "false", // 是否显示播放器的控制栏 none
              "webrtcConfig": { streamType: 'video' }, // 仅拉取视频流，auto：拉取视频流和音频流
              // "poster" : {"style":"cover", "src":"http://www.test.com/myimage.jpg"}, // 视频封面,cover/stretch/default
              // "width": '480',//视频的显示宽度，请尽量使用视频分辨率宽度
              // "height": '320',//视频的显示高度，请尽量使用视频分辨率高度
              "wording": {
                2003: "连接视频超时",
                2032: "请求视频失败，请检查网络",
                2048: '请求m3u8文件失败，可能是网络错误或者跨域问题'
              }
            })
            this.tencentPlayer.play()
          } else {
            this.showToast('暂不支持其它格式视频播放！');
          }
        }
      }
      catch (e) { }
      this.loading = false;
    },
    stop() {
      try {
        if (this.tencentPlayer != null) {
          if (this.streamTypeEditor !== 'webrtc') {
            this.tencentPlayer.pause()
            this.tencentPlayer.unload()
            this.tencentPlayer.detachMediaElement()
          } else {
            this.tencentPlayer.pause()
          }
          this.tencentPlayer.destroy()
          this.tencentPlayer = null
        }
      } catch (error) { }
    }
  }
}
</script>

<style scoped>
.player {
  width: 100%;
  height: 100%;
  background-color: #242424;
  border: 2px solid rgb(0, 0, 0);
  padding: 5px;
  text-align: center;
  position: relative;
}
.item {
  border: 1px solid rgb(73, 72, 72);
  background-color: #242424;
}
.button {
  background-color: #242424;
}
.videoTitle {
  position: absolute;
  top: 5px;
  width: 100%;
  margin: 0 auto;
  color: rgb(212, 212, 212);
}
.videoTitleChecked {
  position: absolute;
  top: 5px;
  width: 100%;
  margin: 0 auto;
  font-weight: bold;
  color: #3de7c9;
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
  top: 30px;
  left: 10px;
  right: 10px;
  bottom: 10px;
}
.tools {
  position: absolute;
  height: auto;
  top: 20px;
  right: 10px;
  padding: 5px;
  background: transparent;
}
</style>
<style lang="scss" scoped>
// .player {
//   width: 100%;
//   height: 100%;
//   background-color: #242424;
//   border: 2px solid rgb(0, 0, 0);
//   padding: 20px;
//   text-align: center;
//   position: relative;
//   ::v-deep .video {
//     top: 5px;
//     bottom: 5px;
//     width: 100%;
//     height: 100%;
//     .vcp-player {
//       width: 100%;
//       height: 100%;
//       video {
//         width: 100%;
//         height: 100%;
//         object-fit: fill;
//       }
//     }
//   }
// }
</style>


