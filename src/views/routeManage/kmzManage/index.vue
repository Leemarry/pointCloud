<!--
 * @Date: 2024-07-18 10:33:53
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\views\routeManage\kmzManage\index.vue
 * @Description: Do not edit
-->
<!-- kmz管理 -->
<template>
    <div class='kmzManage'>
        <div class='kmzManage-aside'>
            <el-alert v-if='kmzData && kmzData.length <= 0' title="当前航线信息为空!" type="warning" show-icon>
            </el-alert>

            <el-card class="box-card" v-else v-for='(item, index) in kmzData'>
                <div slot="header" class="clearfix">
                    <span> {{ item.name }}</span>
                    <div style='float: right;'>
                        <el-button @click="openVideoTag(item)" type="text" size="small">查看</el-button>
                        <el-button @click="downloadVideo(item)" type="text" size="small">下载</el-button>
                    </div>
                </div>
                <div>
                    {{ `创建时间：${item.time}` }}
                </div>
                <div>
                    {{ `文件大小：${Number(item.size).toFixed(2)}kb` }}
                </div>
            </el-card>

            <div class='upload-content'>
                <!-- :on-change="changeFile" :before-upload="beforeAvatarUpload"  :show-file-list="false" :limit="1"  -->

                <div class='upload-header'>
                    <el-upload class="upload-demo" :on-change="changeFile" :on-preview="handlePreview" action="/" multiple :auto-upload="false" :file-list="fileList"  :show-file-list="false"
                        :on-exceed="handleExceed">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                    <div>
                        <el-button size="small" type="success" @click="submitUpload">确定上传</el-button>
                    </div>
                </div>
                <div v-for='(file, index) in fileList' class='file-item'>
                    <span @click='handlePreview(file)'>{{ file.name }}</span> <span @click='handleRemove(file, fileList)'>X</span>
                </div>
            </div>
        </div>
        <div class='Map-viewer'>
            <OlMaps :centerPosition='[114.27932686576446, 37.540419484036846]' :points='points'></OlMaps>
        </div>
        <!-- <div></div> -->
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等!）
//例如：import 《组件名称》 from '《组件路径》';
import OlMaps from '@/views/components/mapManage/OpenLayersMap/index.vue'
import { parseXML } from '@/utils/currency'
export default {
    name: '',
    //import引入的组件需要注入到对象中才能使用
    components: { OlMaps },
    data() {
        //这里存放数据
        const kmzData = []
        for (let index = 0; index < 2; index++) {
            const time = new Date().toLocaleString();
            const size = `${Math.random() * 1000}`;
            const url = 'http://127.0.0.1:9090/efuavkmz/wpmz%20%282%29.kmz';
            const name = `kmz${index}`;
            kmzData.push({
                name,
                file: '',
                url,
                type: 'kmz',
                size,
                time
            })
        }

        return {
            fileList: [],
            kmzData,
            points: [],

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
        //#regin ------------------------------------------------------ 查询 ------------------------------------------------------------
        queryPhotolist() {
            
        },
        //#endregion
        openVideoTag(item) {
            const url = item.url;
            this.fetchAndExtractZipContent(url).then(res => {
                this.points = parseXML(res);
            }, rej => {
                this.showMessage('获取kmz文件失败', 'error')
            }
            )
        },
        async fetchAndExtractZipContent(url) {
            try {
                const response = await fetch(url);
                console.log('response', response);

                if (response.status === 200) {
                    const arrayBuffer = await response.arrayBuffer();
                    const zip = await JSZip.loadAsync(arrayBuffer);

                    // 假设您要获取的文件名是 'file.txt'
                    const file = zip.file('waylines.wpml');
                    if (file) {
                        const content = await file.async('text');
                        return Promise.resolve(content);
                    } else {
                        console.error('指定的文件未在压缩包中找到');
                        return Promise.reject('指定的文件未在压缩包中找到');
                    }
                } else {
                    console.error(`获取压缩包失败，状态码: ${response.status}`);
                    return Promise.reject(`获取压缩包失败，状态码: ${response.status}`);
                }
            } catch (error) {
                console.error('发生错误:', error);
                return Promise.reject(error);
            }
        },

   
        async downloadVideo(item) {
            this.getMethod(item.url).then((blob) => {
                this.downloadFile(blob)
            })
        },
        downloadFile(blob, fileName = `${Date.now()}.kmz`) {
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
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return res.blob();

        },

         submitUpload() {
            
          
        },
        handleRemove(file, fileList) {
            fileList.splice(fileList.indexOf(file), 1);
        },
        /**上传前 */
        changeFile(file, fileList) {
            let fileName = file.name;
            let size = file.size;
            fileName = fileName.substring(fileName.lastIndexOf('.'))
            const isKmz = fileName === '.kmz'; // ||'.kml'
            const isLt2M = file.size / 1024 / 1024 < 10;
            if (!isKmz) {
                this.showToast('上传航线文件只能是 kmz 格式!');
            }
            if (!isLt2M) {
                this.showToast('上传航线文件不能超过 10MB!');
            }
            if (isKmz && isLt2M) {
                this.fileList.push(file);
            }
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制文件上传数量，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        async handlePreview(file) {
            var xmlString = null;
            try {
                const zip = await JSZip.loadAsync(file.raw);
                for (const filename of Object.keys(zip.files)) {
                    if (filename.indexOf('.wpml') > -1) {
                        const content = await zip.files[filename].async('text');
                        xmlString = content;
                        if (!xmlString) return;
                        this.points = parseXML(xmlString);
                    }
                }
            } catch (err) {
                console.error('Error reading zip:', err);
                this.points = []
            }
        },


        showToast(msg) {
            this.$layer.msg(msg);
        },
        showMessage(msg, type) {
            this.$message({
                message: msg,
                type: type,
            });
        },

    },
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
    activated() { }, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.kmzManage {
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    background-color: #f3f6f8;
}

.kmzManage-aside {
    width: 300px;
    position: relative;
    overflow-y: auto;

    .upload-content {
        position: fixed;
        bottom: 0px;

        background-color: rgba($color: #000000, $alpha: .3);

        .upload-header {
            display: flex;
            width: 100%;
        }

        .file-item {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            padding: 5px 10px;
            color: #606266;
            margin-top: 5px;

            &:hover {
                background-color: #f3f6f8;
                cursor: pointer;
            }
        }
    }

}

.Map-viewer {
    flex: 1;
}

::v-deep .box-card {
    margin-bottom: 10px;

    .el-card__header {
        padding: 5px 20px
    }

}
</style>