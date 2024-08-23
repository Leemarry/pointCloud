<!--
 * @Date: 2024-07-16 14:50:40
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\views\mediaUpload\index.vue
 * @Description: Do not edit
-->
<!--  -->
<template>
  <div class="">
    <!-- <progress id="progressBar" value="50" max="100" style="width: 100%;" />
    <div id="progressText">0%</div> -->
    <!-- 文件上传Ui -->
    <div class="al-input">
      <div id="drop_zone">拖放文件到这里</div>
      <input type="file" multiple :accept="accept" @change="handleFilerSelect">
      <input type="file" webkitdirectory directory multiple @change="handleFolderSelect">
      <!-- <button @click="sub()">确认删除</button> -->
    </div>
    <div class="message" />
    <div>
      <el-table :data="tempFilelist" style="width: 100%">
        <el-table-column prop="name" :show-overflow-tooltip="true" label="名称" width="300">
          <template slot-scope="scope">
            <i style="color:#409EFF" class=" el-icon-s-order" />{{ scope.row.file.name }}
          </template>
        </el-table-column>
        <el-table-column prop="name" :show-overflow-tooltip="true" label="文件层级">
          <template slot-scope="scope">
            <i style="color:#409EFF" class=" el-icon-s-order" />{{ scope.row.file.webkitRelativePath == "" ? scope.row.path : scope.row.file.webkitRelativePath }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="是否成功1" width="380">
          <template slot-scope="scope">
            <template v-if="scope.row.status === 'success' || scope.row.progress == 100">上传成功！</template>
            <template v-else-if="scope.row.status === 'error'">上传失败!</template>
            <template v-else-if="scope.row.status === 'warning'">解析中!</template>
            <el-progress v-else :text-inside="true" :stroke-width="24" :percentage="scope.row.progress" />
          </template>
        </el-table-column>
        <el-table-column width="200" prop="size" label="大小" />
        <el-table-column prop="name" width="280" label="功能">
          <template slot-scope="scope">
            <el-button v-if="scope.row.progress !== 100" type="primary" size="mini" @click="awaitUpload(scope.row, scope.$index)">等待</el-button>
            <el-button v-else type="primary" size="mini" @click="goToHomePage">查看路径</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等!）
//例如：import 《组件名称》 from '《组件路径》';
import { uploadFile1, concurRequestfiles } from './upload'
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
            tempFilelist: [],
            uploadFilesList: [],
            reqUrl: '',
            fileType: ''
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
            const fileList = await self.getFilesFromDrops(items)
            console.log('拖放文件', fileList);
            // eslint-disable-next-line require-atomic-updates
            self.tempFilelist = [...self.tempFilelist, ...fileList];
            self.submitTask(fileList)
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
                if (entry.isFile) {
                    return new Promise((resolve, reject) => {
                        entry.file((file) => {
                            self.checkFileType(file, self.fileType)
                                .then(() => {
                                    // 如果文件类型正确，继续执行添加文件到列表的操作
                                    const obj = { file, folder, name: file.name, progress: 0, status: 'uploading' };
                                    fileList.push(obj);
                                    resolve();
                                })
                                .catch((error) => {
                                    // 如果文件类型不正确，则拒绝Promise
                                    reject(error);
                                });
                            // const fileType = file.type;
                            // console.log('fileType', fileType);
                            // //fileType 含有 video
                            // if (!fileType.includes(self.fileType)) {
                            //     // 如果文件不是视频类型，则拒绝 Promise
                            //     reject(new Error(`Incorrect-Type file found: ${file.name}`));
                            // } else {
                            //     // 添加文件到列表
                            //     const obj = { file, folder, progress: 0, status: 'uploading' };
                            //     fileList.push(obj);
                            //     resolve();
                            // }
                        }, (error) => {
                            // 处理读取文件时发生的错误
                            reject(error);
                        });
                    });
                } else if (entry.isDirectory) {
                    const reader = entry.createReader();
                    return new Promise((resolve, reject) => {
                        reader.readEntries((entries) => {
                            const folder = entry.fullPath || entry.name
                            console.log('folder', entries);
                            const subPromises = entries.map((subEntry) => processEntry(subEntry, folder));
                            Promise.all(subPromises)
                                .then(() => resolve())
                                .catch((error) => {
                                    reject(error)
                                });
                        }, (error) => {
                            reject(error);
                        });
                    })
                } else {
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
                    promises.push(Promise.resolve());
                }
            }
            try {
                await Promise.all(promises);
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
            const fileType = file.type;
            // orthoimg
            if (selfFileType === 'orthoimg') {
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
        async  getFilesFromDropss(items) {
            const fileList = [];
            const promises = [];
            function processEntry(entry, folder) {
                return new Promise((resolve) => {
                    if (entry.isFile) {
                        entry.file(res => {
                            res.folder = folder;
                            const obj = { file: res, folder, progress: 0, status: 'uploading' };
                            fileList.push(obj);
                            resolve();
                        });
                    } else if (entry.isDirectory) {
                        const reader = entry.createReader();
                        reader.readEntries(entries => {
                            const folder = entry.name || entry.fullPath
                            const subPromises = entries.map(subEntry => processEntry(subEntry, folder));
                            Promise.all(subPromises).then(() => resolve());
                        });
                    } else {
                        // 如果既不是文件也不是目录，则直接解决（这里可能需要根据你的情况调整）
                        resolve();
                    }
                });
            }

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const entry = item.webkitGetAsEntry(); // 注意：这可能不是所有浏览器都支持
                if (entry) {
                    const folder = entry.name || entry.fullPath || entry.webkitRelativePath;
                    promises.push(processEntry(entry, folder));
                } else {
                    // 如果 item.webkitGetAsEntry() 返回 null 或 undefined，我们添加一个已解决的 Promise
                    promises.push(Promise.resolve());
                }
            }
            return new Promise((resolve, reject) => {
                Promise.all(promises).then(() => {
                    resolve(fileList);
                });
            });
        },
        async getFiles(dataTransferItemList) {
            const fileList = [];
            async function processEntry(entry) {
                if (entry.isFile) {
                    const res = await new Promise((resolve) => entry.file(resolve));
                    fileList.push(res);
                } else if (entry.isDirectory) {
                    const reader = entry.createReader();
                    const entries = await new Promise((resolve) => reader.readEntries(resolve));
                    for (const subEntry of entries) {
                        await processEntry(subEntry);
                    }
                }
            }

            for (let i = 0; i < dataTransferItemList.length; i++) {
                const entry = dataTransferItemList[i].webkitGetAsEntry();
                await processEntry(entry);
            }

            return fileList;
        },
        async getFile(dataTransferItemList) {
            const fileList = [];
            async function processEntry(entry) {
                if (entry.isFile) {
                    const res = await new Promise((resolve) => entry.file(resolve));
                    fileList.push(res);
                } else if (entry.isDirectory) {
                    const reader = entry.createReader();
                    const entries = await new Promise((resolve) => reader.readEntries(resolve));
                    for (const subEntry of entries) {
                        await processEntry(subEntry);
                    }
                }
            }

            for (let i = 0; i < dataTransferItemList.length; i++) {
                const entry = dataTransferItemList[i].webkitGetAsEntry();
                await processEntry(entry);
            }

            return fileList;
        },
        // 选择文件夹的处理函数
        async handleFolderSelect(event) {
            const files = event.target.files;
            if (files.length === 0) {
                console.log('请获取正确的文件');
                return;
            }
            const temp = Array.from(files).map((file, index) => {
                const webkitRelativePath = file.webkitRelativePath || '';
                const folder = this.extractString(webkitRelativePath) // 用于知道父目录

                const obj = { file, folder, progress: 0, status: 'uploading' };
                return obj
            })
            this.tempFilelist = [...this.tempFilelist, ...temp];
            this.submitTask(temp)
        },
        extractString(str) {
            const lastSlashIndex = str.lastIndexOf('/');
            if (lastSlashIndex === -1) {
                return '';
            }
            const startIndex = str.lastIndexOf('/', lastSlashIndex - 1) + 1;
            return str.substring(startIndex, lastSlashIndex);
        },
        async handleFilerSelect(event) {
            const files = event.target.files;
            if (files.length === 0) {
                console.log('请获取正确的文件');
                return;
            }
            const obj = { file: files[0], progress: 0, status: 'uploading' };
            this.tempFilelist.push(obj);
            // 发送上传
            this.submitTask([obj])
        },
        goToHomePage() {
            alert('返回主页');
        },
        sub() {
            for (let i = 0; i < this.tempFilelist.length; i++) {
                uploadFile1(this.tempFilelist[i], this.fileType, new Date()).then(res => {
                    console.log(res)
                })
            }
        },
        submitTask(files) {
            concurRequestfiles(files, this.tempFilelist, this.reqUrl)
        },
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
</style>
