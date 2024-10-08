<!-- eslint-disable no-undef -->
<!--
 * @Date: 2024-07-18 10:33:53
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\views\routeManage\kmzManage\index.vue
 * @Description: Do not edit
-->
<!-- kmz管理 -->
<template>
  <div v-loading="mixinsLoading" class="kmzManage" element-loading-background="rgba(0, 0, 0, 0.3)">
    <div class="kmzManage-aside">
      <el-date-picker
        v-model="choiseTime"
        type="datetimerange"
        align="right"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['06:00:00', '23:45:00']"
        @change="handleDateChange"
      />
      <el-alert v-if="kmzData && kmzData.length <= 0" title="当前航线信息为空!" type="warning" show-icon />
      <template v-else>
        <el-card v-for="(item, index) in kmzData" :key="index" class="box-card">
          <div slot="header" class="clearfix">
            <span> {{ item.kmzName }}</span>
            <div style="float: right;">
              <el-button type="text" size="small" style="margin-right: 10px;" @click="openVideoTag(item)">查看</el-button>
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  <el-button type="text" size="small">更多</el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="downloadVideos(item)">下载</el-dropdown-item>
                  <el-dropdown-item @click.native="deletekml(item)">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div>
            {{ `创建时间：${parseTime(item.createTime)}` }}
          </div>
          <div>
            {{ `文件大小：${filtersType(Number(item.kmzSize).toFixed(2))}` }}
          </div>
        </el-card>
      </template>
      <div class="upload-content">
        <!-- :on-change="changeFile" :before-upload="beforeAvatarUpload"  :show-file-list="false" :limit="1"  -->
        <div class="upload-header">
          <el-upload
            class="upload-demo"
            :on-change="changeFile"
            :on-preview="handlePreview"
            action="/"
            multiple
            :auto-upload="false"
            :file-list="fileList"
            :show-file-list="false"
            :on-exceed="handleExceed"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
          <div>
            <el-button size="small" type="success" @click="beforeSubmit">确定上传</el-button>
          </div>
        </div>
        <div v-for="(file, index) in fileList" :key="index" class="file-item">
          <span @click="handlePreview(file)">{{ file.name }}</span>
          <span @click="handleRemove(file, fileList)">X</span>
        </div>
      </div>
    </div>
    <div class="Map-viewer">
      <OlMaps :center-position="[115.20445022502247,30.839853465243316]" :points="points" />
    </div>
  </div>
</template>
<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等!）
//例如：import 《组件名称》 from '《组件路径》';
import OlMaps from '@/views/components/mapManage/OpenLayersMap/index.vue'
import { parseXML } from '@/utils/currency'
import currencyMinins from '@/utils/currencyMinins'
export default {
    name: '',
    //import引入的组件需要注入到对象中才能使用
    components: { OlMaps },
    mixins: [currencyMinins],
    //让组件接收外部传来的数据
    props: {
    },
    data() {
        //这里存放数据
        return {
            fileList: [],
            kmzData: [],
            points: [],
            efTaskKmzMap: new Map(),
            choiseTime: [new Date(2024, 7, 10, 10, 10), new Date()]

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
        this.queryKmzlist()
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
        //#regin ------------------------------------------------------ 查询 ------------------------------------------------------------
        /**查询航线信息By分页 */
        queryKmzlist() {
            const startTime = this.choiseTime && this.choiseTime[0] ? this.choiseTime[0] : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); //   console.log(startTime);
            const endTime = this.choiseTime && this.choiseTime[1] ? this.choiseTime[1] : new Date(Date.now());
            const formdata = new FormData();
            formdata.append('startTime', startTime);
            formdata.append('endTime', endTime);
            // queryKmzlist
            this.$store.dispatch('routeManage/queryKmzInfo', formdata).then(res => {
                this.kmzData = res.data;
            }, rej => {
                this.showMessage('查询航线信息失败', 'error')
            }
            )
        },
        handleDateChange() {
            this.choiseTime[1] = new Date(Date.now());
            this.queryKmzlist();
        },

        //#endregion
        openVideoTag(item) {
            const url = item.kmzPath;
            this.fetchAndExtractZipContent(url).then(res => {
                console.log('parseXML(res)', parseXML(res));
                this.points = parseXML(res).points;
            }, rej => {
                this.showMessage('获取kmz文件失败', 'error')
            }
            )
        },
        async fetchAndExtractZipContent(url) {
            try {
                const response = await fetch(url);

                if (response.status === 200) {
                    const arrayBuffer = await response.arrayBuffer();
                    // eslint-disable-next-line no-undef
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

        async downloadVideos(row) {
            const url = row.kmzPath;
            if (!url) {
                return;
            }
            let fileName = 'text.kmz'
            const lastIndex = url.lastIndexOf('/');
            if (lastIndex !== -1) {
                fileName = url.substring(lastIndex + 1);
            }
            // var index = this.tableData.findIndex(item => item.id === row.id);
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
                console.log('Download progress:', progress);
                // if (index !== -1) {
                //     this.tableData[index].downLoadProgress = progress
                // }
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
        async downloadKmz(item) {
            this.getMethod(item.kmzPath).then((blob) => {
                this.downloadFile(blob)
            }).catch((error) => {
                console.error('下载kmz文件失败', error);
            });
        },
        downloadFile(blob, fileName = `${Date.now()}.kmz`) {
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

        beforeSubmit() {
            if (this.fileList.length === 0) {
                this.showMessage('请选择文件', 'error')
                return false;
            }
            const files = []
            this.fileList.forEach(item => {
                files.push(item.raw)
            })
            this.submitUpload(files)
        },
        async submitUpload(files) {
            const formData = new FormData();
            const efTaskKmzs = [];

            for (let index = 0; index < files.length; index++) {
                const file = files[index];
                // const filename = file.name;
                // let kmzInfo = {};
                // // 判断文件名是否在 this.efTaskKmzMap 中
                // if (this.efTaskKmzMap.has(filename)) {
                //     kmzInfo = this.efTaskKmzMap.get(filename);
                // } else {
                //     try {
                //         console.log('efTaskKmzssspar', file);
                //         const res = await this.parseFileToXml(file); // 等待异步操作完成
                //         this.efTaskKmzMap.set(filename, res);
                //         kmzInfo = res;
                //     } catch (error) {
                //         // 处理错误
                //         this.showMessage(`${filename}文件有误,已取消上传!`, 'warning');
                //         this.fileList = this.fileList.filter(item => item.name !== filename);
                //         continue; // 跳过当前循环迭代
                //     }
                // }
                formData.append(`files`, file); // 使用索引生成唯一的字段名
                // efTaskKmzs.push(kmzInfo);
            }

            // 将对象数组转换为JSON字符串
            // var efTaskKmzsStr = JSON.stringify(efTaskKmzs);
            // formData.append('efTaskKmzs', new Blob([efTaskKmzsStr], { type: 'application/json' }));
            // console.log(efTaskKmzs);

            // 发送 formData
            this.$store.dispatch('routeManage/uploadKmz', formData).then(res => {
                this.showToast('上传成功');
                this.handleDateChange();
            }, rej => {
                this.showToast('上传失败');
            });
        },
        async deletekml(item) {
            const id = item.id;
            const ids = [id];
            try {
                this.mixinsLoading = true;
                const formData = new FormData();
                formData.append('ids', ids);
                const res = await this.$store.dispatch('routeManage/delect', formData)
                const { code, message, data } = res;
                if (code > 0) {
                    // 使用 filter 方法过滤出不在 idsToRemove 中的数据
                    // this.tableData = this.tableData.filter(item =>!data.includes(item.id));
                    // const newData = this.tableData.filter(item => !data.includes(item.id));
                    // // 更新响应式数组
                    // this.tableData.splice(0, this.tableData.length, ...newData);
                    this.handleDateChange();
                } else {
                    this.$message.error(message);
                }
            } catch (err) {
                this.showToast(err, 'error');
            } finally {
                this.mixinsLoading = false;
            }
        },
        handleRemove(file, fileList) {
            fileList.splice(fileList.indexOf(file), 1);
        },
        /**上传前 */
        changeFile(file, fileList) {
            let fileName = file.name;
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
        /**预览 */
        handlePreview(file) {
            const kmzname = file.name;
            this.parseFileToXml(file.raw).then(res => {
                this.efTaskKmzMap.set(kmzname, res)
                this.points = res.points;
            },
            reject => {
                this.showMessage('解析kmz文件失败,请勿上传错误文件!', 'error')
            }
            )
        },
        async parseFileToXml(file) {
            let efTaskKmz = {}
            try {
                // eslint-disable-next-line no-undef
                const zip = await JSZip.loadAsync(file);
                // const wpmlFile = zip.file('wpml.xml');
                for (const filename of Object.keys(zip.files)) {
                    if (filename.indexOf('.wpml') > -1) {
                        const xmlString = await zip.files[filename].async('text');
                        if (!xmlString) return;
                        efTaskKmz = parseXML(xmlString);
                        console.log('efTaskKmz:', efTaskKmz);
                        // 文件名 文件大小 文件类型
                        return { kmzName: file.name, kmzCreateTime: new Date(), kmzUpdateTime: new Date(), ...efTaskKmz };
                    }
                }
                return null;
            } catch (err) {
                console.error('Error reading zip:', err);
            }
        },
        showToast(msg) {
            this.$layer.msg(msg);
        },
        showMessage(msg, type) {
            this.$message({
                message: msg,
                type: type
            });
        }

    } //如果页面有keep-alive缓存功能，这个函数会触发
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

::v-deep .kmzManage-aside {
    width: 315px;
    position: relative;
    overflow-y: auto;

    .el-range-editor.el-input__inner{
        width: 315px;
    }
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
