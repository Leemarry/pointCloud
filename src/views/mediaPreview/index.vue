<!--
 * @Date: 2024-07-16 16:49:09
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\views\mediaPreview\index.vue
 * @Description: Do not edit
-->
<!--  -->
<template>
  <div style="height: 100vh; width: 100wh; display: flex;">
    <div ref="container" />
    <video v-if="formats === &quot;video&quot;" oncontextmenu="return false" controls controlslist="nodownload">
      <source :src="src" type="video/mp4">
      您的浏览器不支持 video 标签。
    </video>
    <iframe
      v-if="formats === 'pdf' || formats === 'web'"
      className="pdf-iframe"
      preload="metadata"
      title="预览文档"
      :src="src"
      width="100%"
      height="100%"
    />
    <div v-if="formats === &quot;docx&quot; || formats === &quot;doc&quot;" id="preview" />
    <div id="progressBar" /> <!-- 添加进度条容器 -->
    <p id="statusMessage" /> <!-- 添加状态消息显示区域 -->
    <div v-if="formats === 'tif' || formats === 'tiff'" class="tif">
      <img id="img" src="">
    </div>
    <!-- <img id="img" src=""> -->
    <!-- https://view.officeapps.live.com/op/view.aspx?src=你的地址（一定得是全路径，带http的那种） -->
    <!-- http://view.xdocin.com/xdoc?_xdoc=你的地址（一定得是全路径，带http的那种） -->
    <!-- http://127.0.0.1:9090/efuavkmz/pointcloud/kmzTasks/2/Cloud-API-Demo-Web.docx -->
    <!-- http://127.0.0.1:9090/ceshi1/video/layout-header.mp4 -->
    <!-- http://127.0.0.1:9090/ceshi/11.pdf -->
    <!-- https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg -->
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等!）
//例如：import 《组件名称》 from '《组件路径》';
// import { defaultOptions, renderAsync } from 'docx-preview'
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
            src: '',
            fileRef: '',
            formats: ''
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
        // 获取当前页面的 URL
        const url = new URL(window.location.href);
        console.log('Current URL:', url);
        // const urlParams = new URLSearchParams(window.location.search);
        // console.log('Parameter Value:', urlParams);
        // // 获取指定参数的值
        // const parameterValue = url.searchParams.get('id');
        // // 现在 parameterValue 就包含了传递的参数值
        // console.log('parameterValue',parameterValue);
        const urlParams = new URLSearchParams(window.location.search);
        // const id = parseInt(urlParams.get('id'), 10);
        const src = decodeURIComponent(urlParams.get('src'));
        const formats = decodeURIComponent(urlParams.get('formats'));

        console.log('formats', formats);
        this.formats = formats;
        this.src = src; // `https://view.officeapps.live.com/op/view.aspx?src=https://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/solution/demo.docx`
        console.log('src', this.src);
        // const sn = this.$route.query.ip
        // document.title = "临时上传-"+ sn;  // 设置页面标题
        if (formats === 'docx' || formats === 'doc') {
            this.httpRequest()
        } else if (formats === 'tif' || formats === 'tiff') {
            this.tifHttpRequest()
        }
    },
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {},
    //方法集合
    methods: {
        // async previewFile() {
        //     // 获取文档
        //     await this.getFile()
        //     // 获取 arraybuffer
        //     const file = this.fileRef

        //     // ref="container"

        //     if (file && this.$refs.container) {
        //         // 调用 renderAsync 方法来渲染文档
        //         await renderAsync(file, this.$refs.container, undefined, {
        //             ...defaultOptions,
        //             className: 'docx',
        //             inWrapper: true,
        //             ignoreWidth: false,
        //             ignoreHeight: false,
        //             ignoreFonts: false,
        //             breakPages: true,
        //             ignoreLastRenderedPageBreak: true,
        //             experimental: false,
        //             trimXmlDeclaration: true,
        //             debug: false
        //         })
        //     }
        // },
        // async getFile() {
        //     const res = await axios({
        //         method: 'get',
        //         url: 'https://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/solution/demo.docx',
        //         // 返回类型为 arraybuffer
        //         responseType: 'arraybuffer'
        //     })
        //     this.fileRef = res.data
        // },
        tifHttpRequest() {
            // 'http://127.0.0.1:9090/efuav-ortho-img/pointcloud/kmzTasks/2/yingDeMap.tif'
            const xhr = new XMLHttpRequest();
            xhr.open('GET', this.src, true);
            xhr.responseType = 'arraybuffer';
            // 监听进度事件 如果太大了 大于10m 就停止下载
            xhr.onloadstart = function() {
                const fileSize = xhr.getResponseHeader('Content-Length');
                console.log('文件大小超过10MB，停止下载', fileSize);
                if (fileSize > 10 * 1024 * 1024) {
                    xhr.abort();
                }
            };
            xhr.onprogress = function(event) {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    document.getElementById('progressBar').style.width = `${percentComplete}%`; // 更新进度条宽度
                    const fileSize = xhr.getResponseHeader('Content-Length');
                    console.log(`下载进度: ${percentComplete}%`, fileSize);
                }
            };
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const img = document.getElementById('img')
                    // eslint-disable-next-line no-undef
                    const tiff = new Tiff({ buffer: xhr.response }) //  arrayBuffer: xhr.response
                    const imgData = tiff.toDataURL() // 使用base64调此方法
                    img.src = imgData
                }
            };
            xhr.send();
        },
        httpRequest() {
            // 发起文件下载请求
            const xhr = new XMLHttpRequest();
            xhr.open('GET', this.src, true);
            xhr.responseType = 'arraybuffer';

            // 监听进度事件
            xhr.onprogress = function(event) {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    document.getElementById('progressBar').style.width = `${percentComplete}%`; // 更新进度条宽度
                }
            };

            xhr.onload = async function() {
                if (xhr.status === 200) {
                    try {
                        // 使用 mammoth.js 进行转换
                        // eslint-disable-next-line no-undef
                        const result = await mammoth.convertToHtml({ arrayBuffer: xhr.response });
                        document.getElementById('preview').innerHTML = result.value;
                        document.getElementById('statusMessage').innerHTML = '转换完成'; // 显示转换完成消息
                    } catch (error) {
                        console.error('解析失败', error);
                        document.getElementById('statusMessage').innerHTML = '解析失败，请重试'; // 显示失败消息
                    }
                } else {
                    console.error('内容获取失败，状态码:', xhr.status);
                    document.getElementById('statusMessage').innerHTML = '下载失败，请检查网络'; // 显示下载失败消息
                }
            };

            xhr.onerror = function() {
                console.error('发生网络错误');
                document.getElementById('statusMessage').innerHTML = '发生网络错误，请稍后重试'; // 显示网络错误消息
            };

            xhr.ontimeout = function() {
                console.error('下载超时');
                document.getElementById('statusMessage').innerHTML = '下载超时，请稍后重试'; // 显示超时消息
            };

            xhr.send();
        }
    } //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
video{
    width: 60%;
    height: auto;
    margin: 0 auto;
}

</style>
