<!--
 * @Date: 2024-07-19 10:06:25
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\views\businessMange\towerManage\TowerdDetails\index2.vue
 * @Description: Do not edit
-->
<!--  -->
<template>
  <div class="sss">
    <el-drawer
      :title="'kml坐标解析'"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
      size="300px"
    >
      <div style="height: 105px;">
        <el-upload
          ref="upload"
          class="upload-demo"
          action="/"
          accept="application/vnd.google-earth.kml+xml, application/xml, .kml"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-exceed="handleExceed"
          :limit="1"
          :file-list="fileList"
          :auto-upload="false"
          :on-change="changeFile"
          :before-remove="beforeRemove"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" :disabled="towerPoints.length===0" @click="submitUpload">上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">只能上传kml文件，且不超过800kb</div>
        </el-upload>

      </div>
      <hr>
      <el-table
        :data="towerPoints"
        style="width: 100%"
      >
        <el-table-column
          prop="mark"
          label="杆塔号"
          width="90px"
        />
        <el-table-column
          prop="coordinates"
          label="坐标"
        />
      </el-table>

    </el-drawer>
  </div>
</template>
<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等!）
//例如：import 《组件名称》 from '《组件路径》';

export default {
    name: '',
    //import引入的组件需要注入到对象中才能使用
    components: {},
    //让组件接收外部传来的数据
    props: {
        drawer: { type: Boolean, default: false },
        direction: { type: String, default: 'rtl' },
        title: { type: String, default: '导入kml坐标' },
        // eslint-disable-next-line vue/require-default-prop
        reqdata: { type: Object, require: true }
    },
    data() {
        //这里存放数据
        return {
            fileList: [],
            towerPoints: []
        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.towerPoints = []
    },
    beforeCreate() { }, //生命周期 - 创建之前
    beforeMount() { }, //生命周期 - 挂载之前
    beforeUpdate() { }, //生命周期 - 更新之前
    updated() { }, //生命周期 - 更新之后
    beforeDestroy() { }, //生命周期 - 销毁之前
    destroyed() { }, //生命周期 - 销毁完成
    activated() { },
    //方法集合
    methods: {
        changeFile(file, fileList) {
            this.fileList = [];
            this.towerPoints = []
            let fileName = file.name;
            fileName = fileName.substring(fileName.lastIndexOf('.'))

            const isKmz = fileName === '.kml'; // ||'.kml'
            const isLt2M = file.size / 1024 / 1024 < 50;
            if (!isKmz) {
                this.showToast('上传航线文件只能是 kml 格式!');
            }
            if (!isLt2M) {
                this.showToast('上传航线文件不能超过 50MB!');
            }
            if (isKmz && isLt2M) {
                this.fileList.push(file);
                this.parseXML(file.raw)
            }
        },
        parseXML(file) {
            const self = this
            const reader = new FileReader();
            reader.onload = function(e) {
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(e.target.result, 'text/xml');
                const placemarks = xmlDoc.getElementsByTagName('Placemark')
                for (let i = 0; i < placemarks.length; i++) {
                    const names = placemarks[i].getElementsByTagName('name')[0]
                    let mark = names.textContent
                    mark = mark.replace(/[^a-zA-Z0-9]/g, '');
                    const coordinate = placemarks[i].getElementsByTagName('coordinates')[0]
                    const coordinates = coordinate.textContent
                    // 使用， 分割字符串
                    const parts = coordinates.split(',');
                    const data = { mark, latStr: parts[1], lonStr: parts[0], absaltStr: parts[2], coordinates }
                    self.addData(data)
                }
            }
            reader.readAsText(file)
        },
        addData(data) {
        // 检查是否重复
            let isDuplicate = false;
            for (const existingData of this.towerPoints) {
                if (existingData.name === data.name && existingData.latStr === data.latStr && existingData.lonStr === data.lonStr && existingData.absaltStr === data.absaltStr) {
                    isDuplicate = true;
                    break;
                }
            }
            if (!isDuplicate) {
                this.towerPoints.push(data);
            }
        },
        beforeRemove(file, fileList) {
            this.fileList = [];
            this.towerPoints = []
        },
        async submitUpload() {
            this.mixinsLoading = true;
            try {
                const res = await this.$store.dispatch('business/handTower', { data: this.towerPoints, url: this.reqdata.reqUrl })
                const { code, message } = res;
                if (code === 1) {
                    this.$message({
                        message: message,
                        type: 'success',
                        duration: 1000
                    })
                } else {
                    this.$message({
                        message: message,
                        type: 'error',
                        duration: 1000
                    })
                }
            } catch (err) {
                this.$message({
                    message: err,
                    type: 'error',
                    duration: 1000
                })
            } finally {
                // this.dialogVisible = false;
                this.$emit('visible:close', false);
                this.mixinsLoading = false;
                this.towerPoints = [];
            }
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        // update:visible
        handleClose(done) {
            this.$emit('update:visible', done);
        },
        showToast(msg) {
            this.$layer.msg(msg)
        }

    } //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类</style>
