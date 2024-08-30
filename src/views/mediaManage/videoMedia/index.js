/*
 * @Date: 2024-07-24 18:40:36
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\views\mediaManage\videoMedia\index.js
 * @Description: Do not edit
 */
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等!）
import currencyMinins from '@/utils/currencyMinins'
import { data } from 'jquery';
export default {
    name: 'Video',
    mixins: [currencyMinins],
    //import引入的组件需要注入到对象中才能使用
    components: {},
    //让组件接收外部传来的数据
    props: {
    },
    data() {
    //这里存放数据
        return {
            reqUrl: '/media/video/querylist',
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
        // this.queryVideolist()
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
        },
        async  delectChecked() {
            const ids = this.multipleSelection.map(item => {
                return item.id
            })
            try {
                this.mixinsLoading = true;
                const formData = new FormData();
                formData.append('ids', ids);
                const res = await this.$store.dispatch('media/delectVideos', formData)
                const { code, message, data } = res;
                if (code > 0) {
                    // 使用 filter 方法过滤出不在 idsToRemove 中的数据
                    // this.tableData = this.tableData.filter(item =>!data.includes(item.id));
                    const newData = this.tableData.filter(item => !data.includes(item.id));
                    // 更新响应式数组
                    this.tableData.splice(0, this.tableData.length, ...newData);
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
        async downloadVideo(row) {
            const url = row.path;
            if (!url) {
                return;
            }
            let fileName = 'text.mp4'
            const lastIndex = url.lastIndexOf('/');
            if (lastIndex !== -1) {
                fileName = url.substring(lastIndex + 1);
            }
            var index = this.tableData.findIndex(item => item.id === row.id);
            const options = {
                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                responseType: 'blob', //重要代码
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            const res = await this.fetchToDownlod(url, options, (progress) => {
                // console.log('Download progress:', progress);
                if (index !== -1) {
                    this.tableData[index].downLoadProgress = progress
                }
            })
            console.log('res', res);
            if (!res || res.status !== 200) {
                return this.$message.error('下载失败')
            }
            this.downloadFile(res.blob, fileName)
        },
        // , options, onProgress, onSuccess, onError
        fetchToDownlod(url, options, onProgress, onSuccess, onError) {
            try {
                // eslint-disable-next-line no-async-promise-executor
                return new Promise(async(resolve, reject) => {
                    const response = await fetch(url, options);
                    const reader = response.body.getReader();
                    // Step 2：获得总长度（length）
                    const contentLength = +response.headers.get('Content-Length');
                    // console.log('contentLength', contentLength);
                    // Step 3：读取数据
                    let receivedLength = 0; // 当前接收到了这么多字节
                    const chunks = []; // 接收到的二进制块的数组（包括 body）

                    // eslint-disable-next-line no-constant-condition
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) {
                            // 如果没有更多的数据可读，则退出循环
                            break;
                        }
                        chunks.push(value);
                        receivedLength += value.length;
                        const progress = Math.round(receivedLength / contentLength * 100);
                        onProgress && onProgress(progress);
                    }
                    // 将响应体转换为 Blob 对象
                    const blob = new Blob(chunks, { type: 'application/octet-stream' });
                    if (response.status === 200) {
                        resolve({ status: response.status, blob });
                    }
                    if (response.status === 404) {
                        reject({ status: response.status, blob });
                    }
                });
            } catch (err) {
                console.log('err', err);
                return Promise.reject(err);
            }
        },

        xhrToDownload(options, onProgress, onSuccess, onError) {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open(options.method || 'GET', options.url);
                xhr.responseType = options.responseType || 'blob';

                xhr.onprogress = function(e) {
                    if (e.lengthComputable) {
                        const progress = (e.loaded / e.total) * 100;
                        onProgress && onProgress(progress);
                    }
                };

                xhr.onload = function(e) {
                    if (xhr.status === 200) {
                        // onSuccess && onSuccess(xhr.response);
                        console.log('上传成功', xhr);
                        resolve({ status: xhr.status, data: xhr.response })
                    } else {
                        onError && onError(xhr.statusText);
                        reject({ status: xhr.status, data: xhr.statusText }); // 拒绝 Promise
                    }
                }
                xhr.onerror = function(e) {
                    onError && onError(xhr.statusText);
                    reject({ status: xhr.status, data: xhr.statusText }); // 拒绝 Promise
                };
                xhr.send();
            });
        },
        downloadFile(blob, fileName = '2.mp4') {
            // 创建a 标签
            const a = document.createElement('a');
            const blobUrl = URL.createObjectURL(blob);
            a.setAttribute('href', blobUrl);
            a.setAttribute('download', fileName);
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl)
        },

        async getMethod(url, data = {}) {
            console.log('getMethod');
            const res = await fetch(url, {
                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                responseType: 'blob', //重要代码
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return res.blob();
        }
    }
    //如果页面有keep-alive缓存功能，这个函数会触发
}
