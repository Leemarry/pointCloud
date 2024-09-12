<!--
 * @Date: 2024-07-16 14:50:40
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\views\mediaUpload\index.vue
 * @Description: Do not edit
-->
<!--  -->
<template>
  <div class="uploadc">
    <!-- <progress id="progressBar" value="50" max="100" style="width: 100%;" />
    <div id="progressText">0%</div> -->
    <!-- 文件上传Ui -->
    <div class="al-input">
      <div id="drop_zone">媒体文件拖放文件到这里</div>
      <div class="flex">
        <div class="flex" style="flex: 8;">
          <label for="fileUpload">选择文件</label>
          <input id="fileUpload" type="file" webkitdirectory directory multiple @change="handleFolderSelect">
          <div style="margin-right: 10px;"> 文件总数：{{ totalNum }}</div>
          <div style="margin-right: 10px;"> 上传成功：{{ successNum }}</div>
          <div> 上传失败：{{ errorList.length }}</div>
        </div>
        <div style="flex: 2;">
          <el-button type="primary" @click="submitTask(uploadTotalFilesList)">确认上传</el-button>
          <el-button v-if="!isCancelUpload" type="warning" @click="cancelUpload">取消上传</el-button>
          <el-button v-else type="primary" @click="resumeUpload">恢复</el-button>
        </div>
      </div>
    </div>
    <div class="message" />
    <div class="footer">
      <hr>
      <!-- <List ref="vlist" :items="uploadTotalFilesList" total="6000" :size="50" :shownumber="9" /> -->
      <List ref="vlist" :items="showData" :total="totalNum" :size="50" :shownumber="shownumber" :end="end" :start="start" @send:handleScroll="toHandleScroll" />
    </div>
  </div>

</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等!）
//例如：import 《组件名称》 from '《组件路径》';
import List from './List'
import { getToken } from '@/utils/auth' // get token from cookie
// import {  concurRequestfiles } from './upload'
export default {
    name: '',
    //import引入的组件需要注入到对象中才能使用
    components: {
        List
    },
    //让组件接收外部传来的数据
    props: {
    },
    data() {
    //这里存放数据
        const shownumber = 9
        return {
            end: shownumber,
            start: 0,
            shownumber,

            // allData: Array.from({ length: 120000 }, (_, index) => ({ id: index, value: `Data ${index}` })),
            tempFilelist: [],
            uploadTotalFilesList: [],
            totalNum: 0,
            uploadFilesList: [],
            reqUrl: '',
            fileType: '',
            errorNum: 0,
            errorList: [],
            successNum: 0,
            isCancelUpload: false,
            xhrList: []
        };
    },
    //监听属性 类似于data概念
    computed: {
        // <input type="file" multiple accept=".jpg,.jpeg,.png,.gif">
        accept: {
            set(v) {
            },
            get() {
                if (this.fileType === 'image') {
                    return '.jpg,.jpeg,.png,.gif';
                } else if (this.fileType === 'video') {
                    return '.mp4';
                } else {
                    // 其他默认情况，或者根据您的需求处理
                    return '';
                }
            }
        },
        showData() {
            return this.uploadTotalFilesList.slice(this.start, this.end)
        }
    },
    //监控data中的数据变化
    watch: {},
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        // console.log('生命周期 - 创建完成（可以访问当前this实例）');
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        const urlParams = new URLSearchParams(window.location.search);
        // const id = parseInt(urlParams.get('id'), 10); // 假设 id 是整数
        const src = decodeURIComponent(urlParams.get('src'));
        const type = decodeURIComponent(urlParams.get('type'));
        const title = decodeURIComponent(urlParams.get('title')) || '';
        if (src === '') {
            this.$message.error('未传入上传地址！');
            return;
        }
        this.fileType = type;
        this.reqUrl = src;
        document.title = '临时上传-' + title; // 设置页面标题
        var self = this;

        document.getElementById('drop_zone').addEventListener('dragover', function(e) {
            e.preventDefault(); // 阻止默认处理（默认不允许放置）
            e.dataTransfer.dropEffect = 'copy'; // 明确放置效果
            this.classList.add('over'); // 可选：添加一些视觉效果
        });

        document.getElementById('drop_zone').addEventListener('dragleave', function(e) {
            this.classList.remove('over'); // 移除视觉效果
        });
        document.getElementById('drop_zone').addEventListener('drop', async function(e) {
            e.preventDefault(); // 阻止默认处理（默认处理是打开文件）
            this.classList.remove('over'); // 移除视觉效果
            var items = e.dataTransfer.items; // 获取文件列表
            const arr = []

            const fileList = await self.getFilesFromDrops(items)
            console.log('拖放文件数', fileList.length);
            // eslint-disable-next-line require-atomic-updates
            self.uploadTotalFilesList = [...self.uploadTotalFilesList, ...fileList];
            // eslint-disable-next-line require-atomic-updates
            self.totalNum = self.uploadTotalFilesList.length
            console.log('拖放文件数', this.totalNum);
            // self.submitTask(fileList);
        });
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
        async  getFilesFromDrops(items) {
            const fileList = [];
            const self = this;
            function processEntry(entry, folder) {
                // console.log(`Processing entry: ${entry.name}, Type: ${entry.isFile ? 'File' : 'Directory'}`);
                if (entry.isFile) {
                    return new Promise((resolve, reject) => {
                        entry.file((file) => {
                            // console.log(`File found: ${file.name}, Type: ${file.type}`);
                            // self.checkFileType(file, self.fileType)
                            //     .then(() => {
                            //         const obj = { file, folder, name: file.name, progress: 0, status: 'uploading' };
                            //         fileList.push(obj);
                            //         resolve();
                            //     })
                            //     .catch((error) => {
                            //         console.log(`File type check failed for: ${file.name}`);
                            //         reject(error);
                            //     });
                            const flog = self.newCheckFileType(file, self.fileType)
                            if (flog) {
                                const obj = { file, folder, name: file.name, progress: 0, status: 'uploading' };
                                fileList.push(obj);
                            }
                            resolve();
                        }, (error) => {
                            console.log(`Error reading file: ${error}`);
                            reject(error);
                        });
                    });
                } else if (entry.isDirectory) {
                    const reader = entry.createReader();
                    return new Promise((resolve, reject) => {
                        reader.readEntries((entries) => {
                            const folder = entry.fullPath || entry.name;
                            const subPromises = entries.map((subEntry) => processEntry(subEntry, folder));
                            Promise.all(subPromises)
                                .then(() => resolve())
                                .catch((error) => {
                                    console.log(`Error processing directory: ${error}`);
                                    reject(error);
                                });
                        }, (error) => {
                            console.log(`Error reading directory: ${error}`);
                            reject(error);
                        });
                    });
                } else {
                    console.log(`Unsupported entry type: ${entry.name}`);
                    return Promise.reject('不支持的文件类型');
                }
            }
            const promises = []
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const entry = item.webkitGetAsEntry(); // 注意：这可能不是所有浏览器都支持
                if (entry) {
                    console.log(entry, entry.name);
                    const folder = entry.fullPath || entry.name || entry.webkitRelativePath;
                    promises.push(processEntry(entry, folder));
                } else {
                    // 如果 item.webkitGetAsEntry() 返回 null 或 undefined，我们添加一个已解决的 Promise
                    console.log('处理读取文件时发错误，则拒绝Promise');
                    promises.push(Promise.resolve());
                }
            }
            try {
                await Promise.all(promises);
                console.log(fileList.length);
                return fileList;
            } catch (e) {
                console.log('e:', e);
                this.$message({
                    message: '存在不支持的文件类型',
                    type: 'warning',
                    duration: 1000
                })
                return fileList
            }
        },
        checkFileType(file, selfFileType) {
            const maxFileSize = 120 * 1024 * 1024; // 200MB in bytes
            const fileType = file.type;
            if (selfFileType.includes('report')) {
                return Promise.resolve()
            }
            if (selfFileType === 'orthoimg') {
                const fileNameCheck = !file.name.includes('tif');

                // 检查文件大小是否不超过 200MB
                const fileSizeCheck = file.size <= maxFileSize;
                if (fileNameCheck || fileSizeCheck) {
                    return Promise.reject(new Error(`Incorrect-Type file found: ${file.name}`));
                }
                return Promise.resolve()
            }
            if (selfFileType === 'cloud') {
                return Promise.resolve()
            }
            if (!fileType.includes(selfFileType)) {
                // 如果文件不是指定的类型，则返回一个拒绝的Promise
                return Promise.reject(new Error(`Incorrect-Type file found: ${file.name}`));
            }
            // 如果文件类型正确，则返回一个已解决的Promise（实际上这里不需要返回特定的值，因为后续逻辑会处理）
            return Promise.resolve();
        },
        newCheckFileType(file, selfFileType) {
            const maxFileSize = 120 * 1024 * 1024; // 200MB in bytes
            const fileType = file.type;
            // docx doc
            if (selfFileType.includes('report')) {
                const fileNameCheck = file.name.includes('docx') || file.name.includes('doc');
                if (fileNameCheck) {
                    return true;
                } else {
                    return false
                }
            }
            if (selfFileType === 'orthoimg') {
                const fileNameCheck = !file.name.includes('tif');
                const fileSizeCheck = file.size <= maxFileSize;
                if (fileNameCheck || (fileSizeCheck)) {
                    return true;
                } else {
                    return false
                }
            }
            if (selfFileType === 'cloud') {
                return true
            }
            if (!fileType.includes(selfFileType)) {
                // 如果文件不是指定的类型，则返回一个拒绝的Promise
                return false;
            }
        },
        //input change 事件 处理文件夹选择
        async handleFolderSelect(event) {
            const files = event.target.files;
            if (files.length === 0) {
                console.log('请获取正确的文件');
                return;
            }
            console.time('uploadTotalFiles');
            const maxFileSize = 120 * 1024 * 1024; // 120MB in bytes
            // 过滤并生成 tempFilelist
            const tempFilelist = Array.from(files).reduce((acc, file) => {
                const iscloud = this.fileType === 'cloud';
                const isorthoimg = this.fileType === 'orthoimg';
                const fileNameCheck = !file.name.includes('tif');
                const fileSizeCheck = file.size <= maxFileSize;

                // 检查文件是否符合条件
                if (fileNameCheck || (fileSizeCheck && isorthoimg)) {
                    const webkitRelativePath = file.webkitRelativePath || '';
                    const folder = this.extractString(webkitRelativePath);
                    acc.push({
                        file,
                        folder,
                        name: file.name,
                        progress: 0,
                        status: 'uploading'
                    });
                }
                return acc;
            }, []);
            this.uploadTotalFilesList = [...this.uploadTotalFilesList, ...tempFilelist];
            console.timeEnd('uploadTotalFiles');
            this.totalNum = this.uploadTotalFilesList.length

            // console.log('拖放文件数一般高于15万个文件', this.uploadTotalFilesList);
        },

        // 按钮事件点击提交上传  files 就是文件列表 this.uploadTotalFilesList
        submitTask(files) {
            this.xhrList = [];
            this.isCancelUpload = false;
            this.concurRequestfiles(files, this.uploadTotalFilesList, this.reqUrl)
        },
        // 按钮事件点击取消
        cancelUpload() {
            this.isCancelUpload = true;
            this.xhrList.forEach(xhr => {
                if (xhr.readyState !== 4) {
                    xhr.abort();
                }
            });
            this.xhrList = [];
        },
        //按钮事件点击恢复
        resumeUpload() {
            this.isCancelUpload = false;
            // 将  uploadTotalFilesList  status 不等于 1  progress 不等于100
            const uploadTotalFilesList = this.uploadTotalFilesList.filter(item => item.status !== 4 || item.progress !== 100);
            this.concurRequestfiles(uploadTotalFilesList, this.uploadTotalFilesList, this.reqUrl)
        },
        concurRequestfiles(files, uploadFilesList, url, maxNum = 2) {
            if (!files || !files.length) {
                return Promise.reject('files is empty');
            }
            const slef = this;
            const overallMD5 = files.length
            const fileNum = files.length // 单次提交任务文件数量
            return new Promise((resolve) => {
                let index = 0; // 指向url下标
                const result = []; // 存放请求结果
                let finishCount = 0; // 请求完成数量
                async function _request() {
                    if (slef.isCancelUpload) {
                        return; // 停止上传
                    }
                    const i = index;
                    const file = files[index]; //          获取url
                    index++;
                    try {
                        const resp = await slef.uploadFile2(file, uploadFilesList, url, fileNum, file.file.name, overallMD5);
                        result[i] = resp
                        console.log(resp.data);
                        const { code } = resp.data
                        if (code === 1) {
                            // eslint-disable-next-line require-atomic-updates
                            slef.successNum = slef.successNum + 1
                        } else {
                            if (slef.errorList) {
                                slef.errorList.push(file)
                            }
                        }
                    } catch (err) {
                        result[i] = err;
                        if (slef.errorList) {
                            slef.errorList.push(file)
                        }
                    } finally {
                        finishCount++;
                        if (finishCount === files.length) {
                            resolve(result);
                        }
                        if (index < files.length && !slef.isCancelUpload) {
                            _request();
                        }
                    }
                    // status
                    // const num = result.filter(item => item.status === 200)
                    // console.log('successNum', num);
                }
                for (var i = 0; i < Math.min(maxNum, files.length); i++) {
                    _request();
                }
            });
        },
        uploadFile2(file, filesList, url, fileNum = 2000, filemd5, overallMD5) {
            return new Promise((resolve, reject) => {
                if (this.isCancelUpload) {
                    // 如果已经取消上传，直接拒绝
                    reject(new Error('Upload canceled'));
                    return;
                }
                var formData = new FormData();
                const filename = file.name
                formData.append('file', file.file, filename);
                formData.append('type', 'image');
                formData.append('folder', file.folder);
                formData.append('createTime', new Date());
                //fileNum  filemd5
                formData.append('overallMD5', overallMD5)
                formData.append('filemd5', filemd5)
                formData.append('fileNum', fileNum)
                var xhr = new XMLHttpRequest();
                this.xhrList.push(xhr); // 将新创建的 XMLHttpRequest 对象添加到列表中
                var index = filesList.findIndex(item => item === file);
                const progressHandler = function(event) {
                    if (event.lengthComputable) {
                        const percentComplete = (event.loaded / event.total) * 100;
                        filesList[index].progress = percentComplete;
                        filesList[index].status = xhr.readyState;
                    }
                };

                xhr.upload.addEventListener('progress', progressHandler);
                xhr.onreadystatechange = () => {
                    // 如果请求没有完成, 直接结束
                    if (xhr.readyState !== 4) {
                        return;
                    }
                    // console.log('successNum',xhr);
                    filesList[index].status = xhr.readyState;
                    // 如果响应状态码在[200, 300)之间代表成功, 否则失败
                    const { status, statusText } = xhr;
                    // 2.1. 如果请求成功了, 调用 resolve()
                    if (status >= 200 && status <= 299) {
                        // 准备结果数据对象 response
                        const response = {
                            data: JSON.parse(xhr.response),
                            status,
                            statusText
                        };
                        console.log(response);
                        // 上传成功后移除监听器
                        xhr.upload.removeEventListener('progress', progressHandler);
                        // this.xhrList 移除 xhr
                        this.xhrList.splice(this.xhrList.indexOf(xhr), 1);
                        resolve(response);
                    } else {
                        reject(new Error('request error status is ' + status));
                    }
                };
                // 发送请求
                xhr.open('POST', url);
                xhr.setRequestHeader('token', getToken());
                xhr.send(formData);
            });
        },

        extractString(str) {
            const lastSlashIndex = str.lastIndexOf('/');
            if (lastSlashIndex === -1) {
                return '';
            }
            return '/' + str.substring(0, lastSlashIndex);
        },
        toHandleScroll(scrollTop) {
            console.log('滚动');

            this.start = Math.floor(scrollTop / 50)
            this.end = this.start + this.shownumber
        },
        goToHomePage() {
            alert('返回主页');
        },
        // 将  uploadTotalFilesList  status 不等于 1  progress 不等于100
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`);
        }
    } //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
::v-deep #app{
  overflow: hidden;
 }
#drop_zone {
  width: 300px;
  height: 200px;
  border: 2px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px;
  border-radius: 5px;
}

#drop_zone.over {
  border-color: #0087F7;
}

.virtual-list-container {
  overflow: auto;
  height: 500px;
}
.data-item {
  height: 50px;
}

input[type="file"] {

  display: none;
}

label {
  display: inline-block;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  margin: 2px 20px 2px 20px;
}
.flex{
    display: flex;
    align-items: center;
    // justify-content: space-around;
}
.uploadc{
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.footer{
    flex: 1;
    overflow: hidden;
}
</style>
