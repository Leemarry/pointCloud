<!--  -->
<template>
  <div class="media">
    <div class="media-top">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="文件描述">
          <el-input v-model="formInline.name" placeholder="文件详情..." />
        </el-form-item>
        <el-form-item label="时间范围">
          <el-col :span="12">
            <!-- <el-date-picker type="date" placeholder="选择日期" v-model="formInline.date1" style="width: 100%;"></el-date-picker> -->
            <el-date-picker v-model="formInline.startTime" type="datetime" placeholder="选择起始时间" align="right" :picker-options="pickerOptions" />
          </el-col>
          <el-col class="line" :span="2">至</el-col>
          <el-col :span="10">
            <el-date-picker v-model="formInline.endTime" type="datetime" placeholder="选择日期时间" default-time="12:00:00" />
          </el-col>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="queryPhotolist()">查询</el-button>
        <el-button type="primary" @click="openUploadDialog()">上传</el-button>
      </div>
    </div>
    <div class="media-container">
      <el-table :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)" stripe style="width: 100%">
        <el-table-column prop="date" label="日期" width="180" />
        <el-table-column prop="fileName" label="文件名" width="180" />
        <el-table-column prop="fileType" label="类型" />
        <el-table-column prop="fileSize" label="大小" />
        <el-table-column prop="fileUrl" label="地址" />
        <el-table-column prop="fileUrl" label="地址">
          <el-image
            style="width: 100px; height: 100px"
            src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            fit="fit"
          />
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
            <el-button type="text" size="small" @click="downimg()">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="media-footer">
      <el-pagination
        align="center"
        :current-page="currentPage"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- <AlDialog title='弹窗' :visible="dialogVisible" height='200px' width='280px' @close="dialogVisible=false">
      <el-upload class="upload-demo" ref="upload" action="/" :on-preview="handlePreview" size="mini" :before-remove="beforeRemove" :on-remove="handleRemove" :file-list="fileList" :auto-upload="false"
        :on-change="changeFile">
        <el-button slot="trigger" size="mini" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传zip文件，且不超过50M</div>
      </el-upload>
    </AlDialog> -->
    <AlDialog title="弹窗" :visible="dialogVisible" height="200px" width="280px" @close="dialogVisible = false">
      <el-upload
        ref="upload"
        class="upload-demo"
        action="/"
        :on-preview="handlePreview"
        size="mini"
        :before-remove="beforeRemove"
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="false"
        :on-change="changeFile"
      >
        <el-button slot="trigger" size="mini" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传zip文件，且不超过50M</div>
      </el-upload>
    </AlDialog>
    <AlImagePreview :visible="previewVisible" />
    <el-image-viewer v-if="imgViewerVisible" :on-close="closeImgViewer" :url-list="imgList" />
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等!）
//例如：import 《组件名称》 from '《组件路径》';
import AlDialog from '@/views/AlDialog/index.vue'
import AlImagePreview from '@/views/AlImagePreview/index.vue'
export default {
    name: 'PhotoManager',
    //import引入的组件需要注入到对象中才能使用
    components: {
        AlDialog,
        AlImagePreview,
        'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer')
    },
    //让组件接收外部传来的数据
    props: {
    },
    data() {
    //这里存放数据
        const tableData = [];
        const fileTypes = ['Text', 'Image', 'Video', 'Audio', 'Document'];
        const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };

        for (let i = 1; i <= 200; i++) {
            const randomDate = new Date(Math.random() * (new Date().getTime() - new Date('2023-01-01').getTime()) + new Date('2023-01-01').getTime()).toLocaleDateString(undefined, dateOptions);
            const fileName = `file_${i}.${['txt', 'jpg', 'p4', 'p3', 'pdf'][Math.floor(Math.random() * 5)]}`;
            const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
            const fileSize = `${Math.floor(Math.random() * 1000)} KB`;
            const fileUrl = `https://example.com/file${i}`;

            tableData.push({
                date: randomDate,
                fileName,
                fileType,
                fileSize,
                fileUrl
            });
        }
        return {
            pickerOptions: {
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                        picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24);
                        picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', date);
                    }
                }]
            },
            value1: '',
            value2: '',
            value3: '',
            formInline: {
                name: '',
                startTime: '',
                endTime: ''
            },
            tableData,
            //分页
            currentPage: 1,
            pageSize: 10,
            dialogVisible: false,
            fileList: [],
            imgViewerVisible: false,
            imgList: [
                'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
                'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
            ],
            previewVisible: false
        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.formInline.startTime = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        this.formInline.endTime = new Date(Date.now());
        this.queryPhotolist()
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
        onSubmit() {

        },
        openUploadDialog() {
            this.dialogVisible = true;
        },

        /**擦靠3 */
        handleClick(row) {
            this.showImgViewer()
        },
        downimg() {

        },

        //#region ---------------------------------------------------   查询   ---------------------------------------------------
        async queryPhotolist() {
            try {
                const formdata = new FormData();
                formdata.append('startTime', this.formInline.startTime);
                formdata.append('endTime', this.formInline.endTime);
                formdata.append('name', this.formInline.name)
                const res = await this.$store.dispatch('media/queryPhotolist', formdata)
                const { code, message, data } = res;
                if (code === 1) {

                }
            } catch (err) {
                this.showToast(error, 'error');
            } finally {

            }
        },

        //#endregion

        // #region ---------------------------------------------------  图片预览 ---------------------------------------------------
        showImgViewer() {
            this.imgViewerVisible = true;
            const m = (e) => { e.preventDefault() };
            document.body.style.overflow = 'hidden';
            document.addEventListener('touchmove', m, false); // 禁止页面滑动
        },
        closeImgViewer() {
            this.imgViewerVisible = false;
            const m = (e) => { e.preventDefault() };
            document.body.style.overflow = 'auto';
            document.removeEventListener('touchmove', m, true);
        },
        //#endregion
        // #region ---------------------------------------------------  分页 ---------------------------------------------------
        //每页条数改变时触发 选择一页显示多少行
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.currentPage = 1;
            this.pageSize = val;
        },
        //当前页改变时触发 跳转其他页
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val;
        },

        // #endregion
        // #region ---------------------------------------------------------------- 上传 ----------------------------------------------------------------------
        handleRemove(file, fileList) {
            this.fileList = []
        },
        handlePreview(file) {
            console.log(file, 'file');
        },
        changeFile(file, fileList) {
            this.fileList = [];
            let fileName = file.name;
            const size = file.size;
            fileName = fileName.substring(fileName.lastIndexOf('.'))
            console.log('fileName', fileName);

            const isKmz = fileName === '.zip'; // ||'.kml'
            const isLt2M = file.size / 1024 / 1024 < 50;
            if (!isKmz) {
                this.showToast('上传航线文件只能是 zip 格式!');
            }
            if (!isLt2M) {
                this.showToast('上传航线文件不能超过 50MB!');
            }
            if (isKmz && isLt2M) {
                this.fileList.push(file);
            }
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`);
        },
        fileSubmit() {
            this.btnloading = true
            console.log('fileSubmit', this.fileList[0]);
            const file = this.fileList[0] || null;
            const handleDate = (new Date()).getTime(); // 439c-1711335601702-53646
            const handleUuid = this.generateId(handleDate);
            const formData = new FormData()
            formData.append('handleUuid', handleUuid) // 额外参数
            formData.append('file', file.raw)
            formData.append('handleDate', handleDate)

            this.$store.dispatch('uavs/uploadFile', formData).then(res => {
                //   console.log('res', res);
                this.fileList = [];
                //   this.showMessage('上传成功', 'success')
            }).catch(err => {
                this.showMessage(err, 'error')
            }).finally(() => {
                this.btnloading = false
            })
        }
        // #endregion

    } //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.media {
  background-color: #F3F6F8;
  height: 100%;
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1;
}

.media-top {
  display: flex;
  justify-content: space-between;
  .demo-form-inline{
    flex: 1;
  }

}

.media-container {
  flex: 1;
  background-color: #FAFAFA;
  overflow: auto;
}
</style>
