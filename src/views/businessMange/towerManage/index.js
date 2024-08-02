
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等!）
//例如：import 《组件名称》 from '《组件路径》';
import AlImagePreview from '@/views/AlImagePreview/index.vue'
import currencyMinins from '@/utils/currencyMinins'
import TowerDrawer from './TowerdDetails/index.vue'
// import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
    name: 'Tower',
    mixins: [currencyMinins],
    //import引入的组件需要注入到对象中才能使用
    components: {
        AlImagePreview,
        TowerDrawer
        // ElImageViewer
    },
    data() {
    //这里存放数据
        return {
            fileList: [],
            imgViewerVisible: false,
            imgList: [],
            previewVisible: false,
            drawerVisible: false,
            towerInfo: {
            }
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
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    this.drawerVisible = false;
                })
                .catch(_ => {});
        },
        onSubmit() {

        },
        addTower() {
            // this.towerInfo 清空
            this.towerInfo = { ...this.towerInfo, mark: '' };
            this.drawerVisible = true;
        },
        updateTower(row) {
            this.drawerVisible = true;
            this.towerInfo = row;
        },

        //#region ---------------------------------------------------   查询   ---------------------------------------------------
        async queryTowerlist(formatFu = this.formatTowerData) {
            try {
                this.mixinsLoading = true;
                this.beforeFormMixin()
                const formData = new FormData();
                formData.append('startTime', this.formInline.startTime.getTime());
                formData.append('endTime', this.formInline.endTime.getTime()); //
                formData.append('mark', this.formInline.mark)
                const res = await this.$store.dispatch('business/getTowerList', formData)
                const { code, message, data } = res;
                if (code === 1) {
                    this.tableData = formatFu(data)
                } else {
                    this.$message.error(message);
                }
            } catch (err) {
                this.showToast(err, 'error');
            } finally {
                this.mixinsLoading = false;
            }
        },

        //#endregion

        //#region ---------------------------------------------------  数据格式 ---------------------------------------------------
        formatTowerData(towerData) {
            return towerData.map(item => {
                let url = '';
                let urlList = [];
                if (item.photos.length > 0) {
                    url = item.photos[0].path
                    //并且将path放入到urllist
                    urlList = item.photos.map(item => item.path)
                }
                // 移除photos
                delete item.photos;
                const obj = { lastpath: url, urlList, ...item }
                return obj;
            })
        },
        //#endregion
        // 图片预览
        // #region ---------------------------------------------------  图片预览 ---------------------------------------------------
        beforeView(row) {
            this.imgList = row.urlList
            this.showImgViewer()
        },
        showImgViewer() {
            this.imgViewerVisible = true;
            const m = (e) => { e.preventDefault() }
            document.body.style.overflow = 'hidden'
            document.addEventListener('touchmove', m, false); // 禁止页面滑动
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

    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.queryTowerlist(this.formatTowerData)
    },
    beforeCreate() { }, //生命周期 - 创建之前
    beforeMount() { }, //生命周期 - 挂载之前
    beforeUpdate() { }, //生命周期 - 更新之前
    updated() { }, //生命周期 - 更新之后
    beforeDestroy() { }, //生命周期 - 销毁之前
    destroyed() { }, //生命周期 - 销毁完成
    activated() { } //如果页面有keep-alive缓存功能，这个函数会触发
}
