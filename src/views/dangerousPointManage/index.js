
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等!）
//例如：import 《组件名称》 from '《组件路径》';
import AlDialog from '@/views/AlDialog/index.vue'
import AlImagePreview from '@/views/AlImagePreview/index.vue'
export default {
  name: 'photoManager',
  //import引入的组件需要注入到对象中才能使用
  components: {
    AlDialog,
    AlImagePreview,
    'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer')
  },
  data() {
    //这里存放数据
    const tableData = [];
    const fileTypes = ['Text', 'Image', 'Video', 'Audio', 'Document'];
    const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };

    for (let i = 1; i <= 200; i++) {
      const randomDate = new Date(Math.random() * (new Date().getTime() - new Date('2023-01-01').getTime()) + new Date('2023-01-01').getTime()).toLocaleDateString(undefined, dateOptions);
      const name = `#0${i}`;
      const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
      const fileSize = `${Math.floor(Math.random() * 1000)} KB`;
      const fileUrl = `https://example.com/file${i}`;

      tableData.push({
        date: randomDate,
        name,
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
        total: 500,
        name: '',
        startTime: '',
        endTime: '',
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
  //让组件接收外部传来的数据
  props: {
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
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
        let formdata = new FormData();
        formdata.append('startTime', this.formInline.startTime);
        formdata.append('endTime', this.formInline.endTime);
        formdata.append('name', this.formInline.name)
        const res = await this.$store.dispatch('media/queryPhotolist', formdata)
        const { code, message, data } = res;
        // if (code === 1) {


        // }
      } catch (err) {
        this.showToast(error, "error");
      } finally {

      }

    },

    //#endregion

    // #region ---------------------------------------------------  图片预览 ---------------------------------------------------
    showImgViewer() {
      this.imgViewerVisible = true;
      const m = (e) => { e.preventDefault() }
      document.body.style.overflow = 'hidden'
      document.addEventListener("touchmove", m, false); // 禁止页面滑动

    },
    closeImgViewer() {
      this.imgViewerVisible = false
      const m = (e) => { e.preventDefault() }
      document.body.style.overflow = 'auto'
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
      let size = file.size;
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
      let formData = new FormData()
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

    },
    // #endregion


  },
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
  activated() { }, //如果页面有keep-alive缓存功能，这个函数会触发
}
