//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等!）
//例如：import 《组件名称》 from '《组件路径》';
import currencyMinins from '@/utils/currencyMinins'
export default {
    name: 'Reports',
    //import引入的组件需要注入到对象中才能使用
    components: {},
    mixins: [currencyMinins],
    data() {
        //这里存放数据
        // const fileTypes = ['全部', '危险点分析报告', '交跨报告', '输电线路杆塔缺陷分析报告'];
        const fileTypes = [{ url: '/media/reports/querylist', name: '全部' }, { url: '/media/peril_point_report/querylist', name: '危险点分析报告' }, { url: '/media/cross_border_report/querylist', name: '交跨报告' }, { url: '/media/line_towers_analysis_report/querylist', name: '输电线路杆塔缺陷分析报告' }];
        const typeMap = new Map(fileTypes.map((item, index) => [index, item.name]));
        const reportOptions = fileTypes.map((item, index) => ({ value: index, label: item.name, url: item.url }))
        return {
            typeMap,
            reqUrl: '/media/reports/querylist',
            reportOptions,
            data: { fileType: 'peril_point_report', id: 0, reqUrl: 'efapi/pointcloud/media/peril_point_report/upload' },
            title: '危险点分析报告'
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

        downloadFile(row, index) {
            console.log('下载文件', row.fileUrl, index);
            // this.handleFetchClick()
            this.download(row.fileUrl);
            // var element = document.createElement('a');
            // element.setAttribute('href', row.fileUrl);
            // element.setAttribute('download', 'filename');
            // element.style.display = 'none';
            // document.body.appendChild(element);
            // element.click();
            // document.body.removeChild(element);
            // URL.revokeObjectURL(blobUrl)
        },
        download(url) {
            fetch(url, {
                responseType: 'blob' //重要代码
            })
                .then(res => {
                    const contentType = res.headers['content-type'] || 'application/pdf';
                    let filename = '使用说明文档.pdf'; // 默认文件名
                    // 根据content-type进行判断
                    if (contentType.includes('application/pdf')) {
                        filename = '使用说明文档.pdf';
                    } else if (contentType.includes('image/jpeg')) {
                        filename = '图片.jpg';
                    } else if (contentType.includes('image/png')) {
                        filename = '图片.png';
                    } else {
                        filename = Date.now() + '.unknown';
                    }
                    console.log(filename);
                    if (res.status === 200) {
                        // 返回的.blob()为promise，然后生成了blob对象，此方法获得的blob对象包含了数据类型，十分方便
                        console.log('response', res);
                        // var contentType = res.headers.get('content-type');
                        return res.blob();
                    }
                })
                .then(blob => {
                    console.log('blobUrl', blob);

                    var element = document.createElement('a');
                    const blobUrl = URL.createObjectURL(blob);
                    element.setAttribute('href', blobUrl);
                    element.setAttribute('download', 'filename');
                    element.style.display = 'none';
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                    URL.revokeObjectURL(blobUrl);
                })
                .catch(error => console.log(error));
        },
        handleFetchClick(signal = 1) {
            var url = 'http://127.0.0.1:9090/ceshi/14.jpg'; //http://127.0.0.1:9090/ceshi/14.jpg PvReport.pdf
            console.log('signal', signal);
            fetch(url, {})
                .then(response => {
                    if (response.status === 200) {
                        // 返回的.blob()为promise，然后生成了blob对象，此方法获得的blob对象包含了数据类型，十分方便
                        console.log('response', response);
                        var contentType = response.headers.get('content-type');
                        console.log(contentType);
                        return response.blob();
                    }
                })
                .then(blob => {
                    console.log('blobUrl', blob);

                    var element = document.createElement('a');
                    const blobUrl = URL.createObjectURL(blob);
                    element.setAttribute('href', blobUrl);
                    element.setAttribute('download', 'filename');
                    element.style.display = 'none';
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                    URL.revokeObjectURL(blobUrl);
                })
                .catch(error => {
                    console.warn(`Fetch 2 error: ${error.message}`);
                });

            // 等待 2 秒后取消请求
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
