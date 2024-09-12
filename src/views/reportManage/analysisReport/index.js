//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等!）
//例如：import 《组件名称》 from '《组件路径》';
import currencyMinins from '@/utils/currencyMinins'
import { data } from 'jquery';
export default {
    name: 'Reports',
    //import引入的组件需要注入到对象中才能使用
    components: {},
    mixins: [currencyMinins],
    data() {
        //这里存放数据
        // const fileTypes = ['全部', '危险点分析报告', '交跨报告', '输电线路杆塔缺陷分析报告'];
        const fileTypes = [{ url: '/media/reports/querylist', name: '未区分', label: '全部' }, { url: '/media/peril_point_report/querylist', name: '危险点分析报告', label: '危险点分析报告' }, { url: '/media/cross_border_report/querylist', name: '交跨报告',label: '交跨报告' }, { url: '/media/line_towers_analysis_report/querylist', name: '输电线路杆塔缺陷分析报告' ,label: '输电线路杆塔缺陷分析报告' }, { url: '/media/line_analysis_report/querylist', name: '塔线缺陷分析报告', label: '塔线缺陷分析报告'}];
        const typeMap = new Map(fileTypes.map((item, index) => [index, item.name]));
        const reportOptions = fileTypes.map((item, index) => ({ value: index, label: item.label, url: item.url }))
        return {
            typeMap,
            reqUrl: '/media/reports/querylist',
            reportOptions,
            data: { fileType: 'peril_point_report', id: 0, reqUrl: 'efapi/pointcloud/media/peril_point_report/upload' },
            title: '危险点分析报告',
            multipleSelection: []
        };
    },
    //让组件接收外部传来的数据
    props: {},
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
        changeType(val) {
            // this.reportOptions 根据value 获取对应url
            const iten = this.reportOptions.find(item => item.value === val);
            this.reqUrl = iten.url;
        },

        uploadReport(title, data) {
            this.title = title;
            this.data = data;
        },

        uploadFiles(item, index) {
            const windowName = 'uploadWindow-' + item.fileType; // 设定窗口名称

            if (!this.windows[windowName] || this.windows[windowName].closed) {
                // 如果窗口存在并且关闭了就在this.windows中删除
                if (this.windows[windowName]) {
                    delete this.windows[windowName];
                }
                const existingWindow = window.open('', windowName);
                const queryString = `?id=${item.id}&src=${encodeURIComponent(item.reqUrl)}&type=${encodeURIComponent(item.fileType)}&title=${encodeURIComponent('文档' + item.fileType)}`; //data=${encodeURIComponent(JSON.stringify(item))}
                const url = '/uploadphoto' + queryString;
                existingWindow.location.href = url; //'/uploadpage' + '?id=' + item.id + '&fileType=' + item.fileType;
                this.windows[windowName] = existingWindow;
            } else {
                this.windows[windowName].focus();
            }
        },
        beforeView(row) {
            console.log('row', row);
            const windowName = 'windowName-' + row.mark;
            if (!this.windows[windowName] || this.windows[windowName].closed) {
                // 创建新窗口
                const existingWindow = window.open('', windowName);
                const queryString = `?id=${row.id}&src=${encodeURIComponent(row.path)}&formats=${encodeURIComponent(row.formats)}`;
                existingWindow.location.href = '/preview' + queryString;
                this.windows[windowName] = existingWindow;
                // // 为新窗口添加 message 事件监听器
                // existingWindow.addEventListener('message', handleMessage);
            } else {
                this.windows[windowName].focus();
            }
        },

        handleMessage(event) {
            // 在这里处理接收到的消息
            if (event.data === '窗口关闭') {
                // 执行相应的操作，例如显示提示信息等
                console.log('收到父窗口的消息：窗口关闭');
            }
        },

        async downloadFile(row, index) {
            const url = row.path
            if (!url) {
                this.$message.error('文件路径为空')
            }
            const lastIndex = url.lastIndexOf('/')
            let fileName = 'text.docx'
            if (lastIndex !== -1) {
                fileName = url.substring(lastIndex + 1)
            }
            // 判断fileName 字符长度是否超过30
            if (fileName.length > 30) {
                fileName = Date.now() + fileName.substring(fileName.lastIndexOf('.'))
            }

            const response = await this.xhrToDowdload(url, (process) => {
                if (index !== -1) {
                    this.tableData[index].downLoadProgress = process
                }
            }, (res) => {}, (err) => { console.error('Download failed:', err) })

            if (response.status !== 200) {
                return this.$message.error('下载失败')
            }
            this.downloadFile2(response.data, fileName)
        },
        xhrToDowdload(url, onProgress, onSuccess, onError) {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.open('GET', url, true);
                xhr.onprogress = function(e) {
                    if (e.lengthComputable) {
                        const process = Math.ceil(e.loaded / e.total * 100);
                        onProgress && onProgress(process);
                    }
                }
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        // onSuccess && onSuccess({ status: xhr.status, data: xhr.response });
                        resolve({ status: xhr.status, data: xhr.response });
                    } else {
                        // onError && onError({ status: xhr.status, data: xhr.response });
                        reject({ status: xhr.status, data: xhr.response });
                    }
                }
                xhr.send()
            }).catch(err => {
                Promise.reject({ status: 400, data: err })
            });
        },
        fetchToDowdload(url, options, onProgress, onSuccess, onError) {
            // eslint-disable-next-line no-async-promise-executor
            return new Promise(async(resolve, reject) => {
                const response = await fetch(url, options)
                const reader = response.body.getReader()
                const contentLength = +response.headers.get('Content-Length')
                let receivedLength = 0; // 当前接收到了这么多字节
                const chunks = []
                // eslint-disable-next-line no-constant-condition
                while (true) {
                    const { done, value } = await reader.read()
                    if (done) {
                        break;
                    }
                    chunks.push(value)
                    receivedLength += value.length
                    const process = Math.ceil(receivedLength / contentLength * 100)
                    onProgress && onProgress(process)
                }
                const blob = new Blob(chunks)
                console.log(blob);
            })
        },
        downloadFile2(blob, fileName) {
            const a = document.createElement('a')
            a.href = URL.createObjectURL(blob)
            a.download = fileName
            a.click()
            URL.revokeObjectURL(blob)
        },

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
        }

        // #endregion
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() { },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() { },
    beforeCreate() { }, //生命周期 - 创建之前
    beforeMount() { }, //生命周期 - 挂载之前
    beforeUpdate() { }, //生命周期 - 更新之前
    updated() { }, //生命周期 - 更新之后
    beforeDestroy() { }, //生命周期 - 销毁之前
    destroyed() { }, //生命周期 - 销毁完成
    activated() { } //如果页面有keep-alive缓存功能，这个函数会触发
};
