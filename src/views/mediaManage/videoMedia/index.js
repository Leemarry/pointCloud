/*
 * @Date: 2024-07-24 18:40:36
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\views\mediaManage\videoMedia\index.js
 * @Description: Do not edit
 */
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等!）
import currencyMinins from '@/utils/currencyMinins'
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
            reqUrl: '/media/video/querylist'
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

        downloadVideo(row) {
            this.getMethod(row.path).then((blob) => {
                this.downloadFile(blob)
            })
        },
        downloadFile(blob, fileName = '') {
            // 创建a 标签
            const a = document.createElement('a');
            const blobUrl = URL.createObjectURL(blob);
            console.log('downloadFile', blob, fileName, blobUrl);
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
        },
        sendXhr(row) {
            const url = row.path;
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'blob';
            xhr.onload = function() {
                if (this.status === 200) {
                    const blob = xhr.response;
                    this.downloadFile(blob, Date.now() + '.mp4');
                }
            }
            xhr.send();
        }
    }
    //如果页面有keep-alive缓存功能，这个函数会触发
}
