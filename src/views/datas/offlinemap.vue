<template>
  <el-container>
    <el-main>
      <uploader :options="options" :file-status-text="statusText" @file-complete="fileComplete" @complete="complete" class="uploader-example">
        <uploader-unsupport></uploader-unsupport>
        <uploader-drop>
          <p>拖动文件或文件夹到这里或者</p>
          <uploader-btn>选择文件</uploader-btn>
          <uploader-btn :attrs="attrs">选择图片</uploader-btn>
          <uploader-btn :directory="true">选择文件夹</uploader-btn>
        </uploader-drop>
        <uploader-list></uploader-list>
      </uploader>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'Logined',
  data() {
    return {
      loading: false,
      options: {
        // 可通过 https://github.com/simple-uploader/Uploader/tree/develop/samples/Node.js 示例启动服务
        target: '/upload', // //SpringBoot后台接收文件夹数据的接口
        autoStart: true, // 默认 true, 是否选择文件后自动开始上传
        testChunks: false, // 是否分片-不分片 ,是否测试每个块是否在服务端已经上传了，主要用来实现秒传、跨浏览器上传等，默认true
        chunkSize: 1024 * 1024 * 10, // 10MB,分块时按照该值来分。最后一个上传块的大小是可能是大于等于1倍的这个值但是小于两倍的这个值大小，默认 110241024
        simultaneousUploads: 1, // 并发上传数, 设置为1同步上传，后端就不会有Bug
        headers: {
          'access-token': 'abcd1234'
        },
        query: {
          code: 123
        }
      },
      statusText: {
        success: '成功了',
        error: '出错了',
        uploading: '上传中',
        paused: '暂停中',
        waiting: '等待中'
      },
      attrs: {
        accept: 'image/*'
      }
    }
  },
  computed: {
    message() {
      return '...'
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() { },
  onDestroy() { },
  methods: {
    async init() {
      // await this.queryAll()
    },
    showToast(msg) {
      this.$layer.msg(msg)
    },
    showMessage(msg, type) {
      this.$message({ message: msg, type: type })
    },
    // 上传完成
    complete() {
      console.log('complete', arguments)
    },
    // 一个根文件（文件夹）成功上传完成。
    fileComplete() {
      console.log('file complete', arguments)
      // const file = arguments[0].file;
    }
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  // background: blue;
  position: absolute;
  padding: 1px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.el-header {
  // background-color: #b3c0d1;
  color: #333;
  // text-align: center;
  // line-height: 20px;
  padding-top: 10px;
}

.el-main {
  // background:red;
  width: 100%;
  height: 100%;
  padding: 5px;
  flex: 1;
}
.uploader-example {
  height: 100%;
  width: 100%;
  padding: 15px;
  // margin: 20px 10px 20px 10px;
  font-size: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}
.uploader-example .uploader-btn {
  margin-right: 4px;
}
.uploader-example .uploader-list {
  max-height: 90%;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
