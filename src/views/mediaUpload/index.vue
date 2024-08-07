<!--
 * @Date: 2024-07-16 14:50:40
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\views\mediaUpload\index.vue
 * @Description: Do not edit
-->
<!--  -->
<template>
  <div class="">
    <!-- <div class="top">
          <p>
            <span class="tips"> 该页面仅为临时上传页面! 模型上传请使用文件夹上传，并保证模型格式[D3BM]正确！解析过程：由于模型过大，可能出现解析延迟，请您耐心等待！ 上传途中！ 请勿关闭页面 ~ </span>
            <span>该页面仅为临时上传页面! 模型上传请使用文件夹上传，并保证模型格式[D3BM]正确！解析过程：由于模型过大，可能出现解析延迟，请您耐心等待！ 上传途中！ 请勿关闭页面 ~ </span>
          </p>
        </div> -->
    <!-- 文件上传Ui -->
    <div class="al-input">
      <!-- <div id="drop_zone">拖放文件到这里</div> -->
      <!-- <input type="file" multiple> -->
      <el-upload
        class="upload-demo"
        drag
        action="/"
        multiple
        :auto-upload="false"
        :show-file-list="false"
        :file-list="uploadFilesList"
        :on-preview="handlePreview"
        :on-change="changeFile"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </div>
    <div class="message" />

    <div>
      <el-table :data="uploadFilesList" style="width: 100%">
        <!-- 文件名  -->
        <el-table-column prop="name" :show-overflow-tooltip="true" label="名称" width="300">
          <template slot-scope="scope">
            <i style="color:#409EFF" class=" el-icon-s-order" />{{ scope.row.name }}
          </template>
        </el-table-column>
        <!-- 文件级联 -->
        <el-table-column prop="name" :show-overflow-tooltip="true" label="文件层级">
          <template slot-scope="scope">
            <i style="color:#409EFF" class=" el-icon-s-order" />{{ scope.row.webkitRelativePath == "" ? "单文件" : scope.row.webkitRelativePath }}
          </template>
        </el-table-column>
        <!-- 进度 -->
        <el-table-column prop="name" label="是否成功" width="380">
          <template slot-scope="scope">
            <template v-if="scope.row.status === 'success' || scope.row.progress == 100">上传成功！</template>
            <template v-else-if="scope.row.status === 'error'">上传失败!</template>
            <template v-else-if="scope.row.status === 'warning'">解析中!</template>
            <el-progress v-else :text-inside="true" :stroke-width="24" :percentage="scope.row.progress" />
          </template>
        </el-table-column>
        <el-table-column width="200" prop="size" label="大小" />
        <el-table-column prop="name" width="280" label="功能">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="fileUrl(scope.row, scope.$index)">查看路径</el-button>
            <el-button v-if="scope.row.progress !== 100" type="primary" size="mini" @click="awaitUpload(scope.row, scope.$index)">等待</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等!）
//例如：import 《组件名称》 from '《组件路径》';
import { uploadFiles } from './upload'
export default {
    name: '',
    //import引入的组件需要注入到对象中才能使用
    components: {},
    //让组件接收外部传来的数据
    props: {
    },
    data() {
    //这里存放数据
        return {
            uploadFilesList: [],
            fileList: [],
            reqUrl: '',
            fileType: ''
        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        console.log('生命周期 - 创建完成（可以访问当前this实例）');
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        const urlParams = new URLSearchParams(window.location.search);
        // const id = parseInt(urlParams.get('id'), 10); // 假设 id 是整数
        const src = decodeURIComponent(urlParams.get('src'));
        const type = decodeURIComponent(urlParams.get('type'));
        // const dataString = urlParams.get('data');
        // const data = JSON.parse(decodeURIComponent(dataString));
        // const myObject = {  src, data };
        console.log(src, type); // 输出: { id: 1, name: 'Example', data: 'Some data' }
        this.fileType = type;
        this.reqUrl = src;
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
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        fileRule(file, type = this.fileType) {
            let fileName = file.name;
            fileName = fileName.substring(fileName.lastIndexOf('.'))
            let flag = true;
            console.log('file.type', file.type);
            if (type === 'image') {
                const suffix = (fileName.toLowerCase() === '.jpg' || fileName.toLowerCase() === '.png');
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isGIF = file.type === 'image/gif';
                const isLt15M = file.size / 1024 / 1024 < 15;
                if (!isJPG && !isPNG && !isGIF && !suffix) {
                    flag = false;
                    this.$message.error('上传图片只能是 JPG、PNG')
                    return flag;
                }
                if (!isLt15M) {
                    flag = false;
                    this.$message.error('上传文件大小不能超过 15MB!');
                    return flag;
                }
            } else if (type === 'video') {
                const isMP4 = file.type === 'video/mp4';
                const suffix = (fileName.toLowerCase() === '.mp4' || fileName.toLowerCase() === '.mp3');
                if (!isMP4 && !suffix) {
                    flag = false;
                    this.$message.error('上传视频只能是 音频 格式!');
                    return flag;
                }
            } else if (type === 'report') {
                const suffix = (fileName.toLowerCase() === '.doc' || fileName.toLowerCase() === '.docx' || fileName.toLowerCase() === '.pdf' || fileName.toLowerCase() === '.xls' || fileName.toLowerCase() === '.xlsx');
                if (!suffix) {
                    flag = false;
                    this.$message.error('上传报告只能是 文档doc, docx, pdf, xls, xlsx格式!');
                    return flag;
                }
            } else if (type === 'orthoimg') {
                const suffix = (fileName.toLowerCase() === '.tif' || fileName.toLowerCase() === '.tiff');
                if (!suffix) {
                    flag = false;
                    this.$message.error('上传图像只能是 tif, tiff格式!');
                    return flag;
                }
            } else if (type === 'cloud') {
                // 只能是压缩包类
                const suffix = (fileName.toLowerCase() === '.zip' || fileName.toLowerCase() === '.rar' || fileName.toLowerCase() === '.7z');
                if (!suffix) {
                    flag = false;
                    this.$message.error('上传点云请先压缩 zip, rar, 7z格式!');
                    return flag;
                }
            }
            // else if (type === 'cloud') {
            //     const suffix = (fileName.toLowerCase() === '.pnts' || fileName.toLowerCase() === '.pnts');
            //     if (!suffix) {
            //         flag = false;
            //         this.$message.error('上传点云只能是 pnts 格式!');
            //         return flag;
            //     }
            // }
            return flag;
        },
        async changeFile(file) {
            const flag = this.fileRule(file, this.fileType)
            if (flag) {
                const obj = { ...file, progress: 20, status: 'uploading' };
                this.uploadFilesList.push(obj);
                const res = await uploadFiles(obj, this.uploadFilesList, this.reqUrl);
                // obj.status = res.status;
                console.log('res', res); // mark
            }
        },
        fileUrl(row, index) {
            alert('前往主标签页')
        }
    } //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
#drop_zone {
  width: 300px;
  height: 200px;
  border: 2px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px;
  border-radius: 5px;
}

#drop_zone.over {
  border-color: #0087F7;
}
</style>
