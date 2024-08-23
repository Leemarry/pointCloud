
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等!）
//例如：import 《组件名称》 from '《组件路径》';
import AlImagePreview from '@/views/AlImagePreview/index.vue'
import currencyMinins from '@/utils/currencyMinins'
import TowerDrawer from './TowerdDetails/index.vue'
import AlDialog from '@/views/AlDialog/index.vue'
// import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
    name: 'Tower',
    mixins: [currencyMinins],
    //import引入的组件需要注入到对象中才能使用
    components: {
        AlImagePreview,
        TowerDrawer,
        AlDialog
    },
    data() {
    //这里存放数据
        return {
            title: '手动新增',
            reqData: { operation: 'hand', id: 0, reqUrl: '/business/hand/addOrupdateTower' },
            fileList: [],
            imgViewerVisible: false,
            imgList: [],
            previewVisible: false,
            drawerVisible: false,
            towerInfo: {
            },
            dialogVisible: false
        };
    },
    //让组件接收外部传来的数据
    props: {
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {
        // 监听 tableData 变化
        'tableData': {
            handler(newVal, oldVal) {
                console.log('tableData', this.tableData.length);
                if (this.tableData.length && this.tableData.length > 0) {
                    this.formInline.total = this.tableData.length;
                } else {
                    this.formInline.total = 0;
                }
            },
            deep: true
        }
    },
    //方法集合
    methods: {
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    this.drawerVisible = false;
                })
                .catch(_ => {});
        },
        operationType(title, obj) {
            this.title = title;
            this.reqData = obj;
        },
        addTowers(data) {
            console.log('data', data);
            const { id, operation } = data;
            if (operation === 'hand') {
                this.addTower();
            } else if (operation === 'batch') {
                this.dialogVisible = true;
                // this.updateTower({ ...this.towerInfo, id });
            }
        },
        addTower() {
            // this.towerInfo 清空
            this.towerInfo = { ...this.towerInfo, mark: '', id: null };
            this.drawerVisible = true;
        },
        updateTower(row) {
            this.drawerVisible = true;
            this.towerInfo = row;
        },

        //#region ---------------------------------------------------   查询   ---------------------------------------------------
        async  delectTower(row, delectAll) {
            try {
                this.mixinsLoading = true;
                const id = row.id;
                const mark = row.mark;
                const formdata = new FormData();
                formdata.append('id', id);
                formdata.append('mark', mark)
                formdata.append('delectAll', delectAll)
                const res = await this.$store.dispatch('business/delectTower', formdata)
                if (res.code === 1) {
                    this.$message.success('删除成功')
                    // tableData 删除 id 等于 row.id 的数据
                    this.tableData = this.tableData.filter(item => item.id !== id)
                }
            } catch (e) {
                this.$message.error(e.message)
            } finally {
                this.mixinsLoading = false;
            }
        },
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
        async  handTower(towerInfo) {
            // 是否存在id 存在为修改 否则为新增
            try {
                const res = await this.$store.dispatch('business/handTower', { data: towerInfo, url: this.reqData.reqUrl })
                const { code, message, data } = res;
                if (code === 1) {
                    const temp = this.formatTowerData([data])
                    // temp 与 tableData 合并 并放入头部
                    const firstData = temp[0];
                    if (this.tableData.some(item => item.id === firstData.id)) {
                        // 存在id 存在为修改 否则为新增
                        this.tableData = this.tableData.map(item => {
                            if (item.id === firstData.id) {
                                return firstData;
                            }
                            return item;
                        })
                    } else {
                        this.tableData = [...temp, ...this.tableData]
                    }
                    // this.tableData = [...temp, ...this.tableData]
                    this.showToast(message, 'success');
                } else {
                    this.showToast(message, 'error');
                }
            } catch (err) {
                this.showToast(err, 'error');
            } finally {
                this.mixinsLoading = false;
                this.drawerVisible = false;
            }
        },
        async submitUpload() {
            // reqUrl:'/business/batch/batchInsertTower'
            try {
                const file = this.fileList[0] || null;
                const formData = new FormData()
                formData.append('file', file.raw)
                const res = await this.$store.dispatch('business/handTower', { data: formData, url: this.reqData.reqUrl })
                const { code, message } = res;
                if (code === 1) {
                    this.showToast(message, 'success');
                    this.queryTowerlist();
                } else {
                    this.showToast(message, 'error');
                }
            } catch (err) {
                this.showToast(err, 'error');
            } finally {
                this.dialogVisible = false;
                this.mixinsLoading = false;
                this.fileList = [];
            }
        },

        //#endregion

        //#region ---------------------------------------------------  数据格式 ---------------------------------------------------
        formatTowerData(towerData) {
            return towerData.map(item => {
                let url = '';
                let urlList = [];
                if (item.photos && item.photos.length > 0) {
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
            fileName = fileName.substring(fileName.lastIndexOf('.'))
            // 格式
            const isKmz = (fileName === '.xlsx' || fileName === '.xls');
            const isLt2M = file.size / 1024 / 1024 < 20;
            if (!isKmz) {
                console.log('fileName', fileName);
                this.$message.warning('上传文件大小不能超过 20MB!');
                return false;
            }
            if (!isLt2M) {
                this.$message.warning('上传航线文件不能超过 50MB!');
                return false;
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
