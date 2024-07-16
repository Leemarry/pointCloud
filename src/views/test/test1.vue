<template>
  <el-container>
    <el-main>
      <olmap ref="olmap" :zoom="17" style="width:100%;height:100%" />
    </el-main>
  </el-container>
</template>

<script>
import olmap from '@/views/components/olmap.vue'

export default {
  name: 'TEST1',
  components: {
    olmap
  },
  data() {
    return {
      
      loading: false
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
      this.test()
    },
    test() {
      this.$refs.olmap.test('欢迎使用地图！')
    },
    showToast(msg) {
      this.$layer.msg(msg)
    },
    showMessage(msg, type) {
      debugger
      this.$message({ message: msg, type: type })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  // background: blue;
  position: absolute;
  padding: 0px;
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
  padding: 0px;
  flex: 1;
}
</style>
