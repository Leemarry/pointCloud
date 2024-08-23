//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等!）
//例如：import 《组件名称》 from '《组件路径》';
import AlDialog from '@/views/AlDialog/index.vue'
import AlImagePreview from '@/views/AlImagePreview/index.vue'
import currencyMinins from '@/utils/currencyMinins'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import * as mediaApi from '@/api/media';
export default {
    name: 'PhotoManager',
    mixins: [currencyMinins],
    //import引入的组件需要注入到对象中才能使用
    components: {
        AlDialog,
        AlImagePreview,
        ElImageViewer
    },
    //让组件接收外部传来的数据
    props: {
    },
    data() {
    //这里存放数据
        return {
            reqUrl: '/media/photo/querylist',
            dialogVisible: false,
            fileList: [],
            imgViewerVisible: false,
            imgList: [],
            previewVisible: false,
            multipleSelection: []
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
        handleSelectionChange(val) {
            this.multipleSelection = val;
            console.log('multipleSelection', val);
        },
        async  delectChecked() {
            const ids = this.multipleSelection.map(item => {
                return item.id
            })
            try {
                this.mixinsLoading = true;
                const formData = new FormData();
                formData.append('ids', ids);

                const res = await this.$store.dispatch('media/delectPhotos', formData)
                const { code, message, data } = res;
                if (code > 0) {
                    // 使用 filter 方法过滤出不在 idsToRemove 中的数据
                    // this.tableData = this.tableData.filter(item =>!data.includes(item.id));
                    const newData = this.tableData.filter(item =>!data.includes(item.id));
                    // 更新响应式数组
                    this.tableData.splice(0, this.tableData.length,...newData);
                } else {
                    this.$message.error(message);
                }
            } catch (err) {
                this.showToast(err, 'error');
            } finally {
                this.mixinsLoading = false;
            }
        },
        uploadFiles(item, index) {
            const windowName = 'uploadWindow-' + item.fileType; // 设定窗口名称
            if (!this.windows[windowName] || this.windows[windowName].closed) {
                // 如果窗口存在并且关闭了就在this.windows中删除
                if (this.windows[windowName]) {
                    delete this.windows[windowName];
                }
                const existingWindow = window.open('', windowName);
                const queryString = `?id=${item.id}&src=${encodeURIComponent(item.reqUrl)}&type=${encodeURIComponent(item.fileType)}&title=${encodeURIComponent(item.title)}`; //data=${encodeURIComponent(JSON.stringify(item))}
                const url = '/uploadphoto' + queryString;
                existingWindow.location.href = url; //'/uploadpage' + '?id=' + item.id + '&fileType=' + item.fileType;
                this.windows[windowName] = existingWindow;
            } else {
                this.windows[windowName].focus();
            }
        },
        onSubmit() {

        },
        openUploadDialog() {
            this.dialogVisible = true;
        },
        async downimgbyAxios(row, name = Date.now()) {
            const url = row.path;
            if (!url) {
                this.showToast('请选择图片路径异常');
                return false;
            }
            // 获取链接的图片名 为最后一个/
            const nameArr = url.split('/');
            name = nameArr[nameArr.length - 1]
            const self = this
            const data = {
                self: row,
                url
            }
            const response = await mediaApi.miniodownload(data)
            var url2 = URL.createObjectURL(response);
            var link = document.createElement('a');
            link.href = url2;
            // eslint-disable-next-line quotes
            link.download = name || "DJI_20231223122702_0008_D.JPG";
            document.body.appendChild(link);
            link.click();
            URL.revokeObjectURL(url);
            // 删除 a 标签
            document.body.removeChild(link);
        },

        downimg(row, name = Date.now()) {
            console.log('downimg');
            const url = row.path;
            if (!url) {
                this.showToast('请选择图片');
                return false;
            }
            // 获取链接的图片名 为最后一个/
            const nameArr = url.split('/');
            name = nameArr[nameArr.length - 1]
            // 使用 XMLHttpRequest 发起 GET 请求
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            // eslint-disable-next-line quotes
            xhr.responseType = "blob"; // 设置响应类型为 blob
            xhr.onload = function() {
                if (this.status === 200) {
                    // 将 blob 数据赋值给变量 a
                    var a = this.response;
                    // 在这里可以进行后续的处理，例如创建下载链接
                    var url = URL.createObjectURL(a);
                    var link = document.createElement('a');
                    link.href = url;
                    // eslint-disable-next-line quotes
                    link.download = name || "DJI_20231223122702_0008_D.JPG";
                    document.body.appendChild(link);
                    link.click();
                    URL.revokeObjectURL(url);
                    // 删除 a 标签
                    document.body.removeChild(link);
                }
            };

            xhr.send();
            // this.$store.dispatch('media/downimg').then(res => {

            // }).catch(error => {
            //     console.log('sss', error);
            // })
        },

        // #region ---------------------------------------------------  图片预览 ---------------------------------------------------
        beforeView(row) {
            this.imgList.length = 0;
            //row为对象取出 path pathscale 组成新数组
            const { path, pathScale } = row;
            this.imgList.push(path, pathScale)
            this.showImgViewer()
        },
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
