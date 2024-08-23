<!--
 * @Date: 2024-07-16 14:50:40
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\views\mediaUpload\index.vue
 * @Description: Do not edit
-->
<!--  -->
<template>
  <div class="">
    <!-- <div class="top">
          <p>
            <span class="tips"> 该页面仅为临时上传页面! 模型上传请使用文件夹上传，并保证模型格式[D3BM]正确！解析过程：由于模型过大，可能出现解析延迟，请您耐心等待！ 上传途中！ 请勿关闭页面 ~ </span>
            <span>该页面仅为临时上传页面! 模型上传请使用文件夹上传，并保证模型格式[D3BM]正确！解析过程：由于模型过大，可能出现解析延迟，请您耐心等待！ 上传途中！ 请勿关闭页面 ~ </span>
          </p>
        </div> -->
    <!-- 文件上传Ui -->
    <div class="al-input">
      <div id="drop_zone">拖放文件到这里</div>
      <input type="file" multiple @change="handleFilerSelect">
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
    computed: {},
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
        async getFilesFromDrop(items) {
            const fileList = [];
            const promises = [];
            async function processEntry(entry) {
                if (entry.isFile) {
                    const res = await new Promise(resolve => {
                        entry.file(file => resolve(file));
                    });
                    promises.push(res);
                } else if (entry.isDirectory) {
                    const reader = entry.createReader();
                    const entries = await new Promise(resolve => {
                        reader.readEntries(entries => resolve(entries))
                    });

                    const subPromises = [];
                    for (let i = 0; i < entries.length; i++) {
                        subPromises.push(processEntry(entries[i]));
                    }
                    console.log('subPromises', subPromises.length);
                    await Promise.all(subPromises);
                }
            }

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                console.log(' items.length', items, items.length);
                const entry = item.webkitGetAsEntry();
                if (entry) {
                    await processEntry(entry);
                } else {
                    promises.push(Promise.resolve());
                }
            }
            return new Promise((resolve) => {
                Promise.all(promises).then(results => {
                    results.forEach(result => fileList.push(result));
                    console.log('fileListsss', fileList, fileList.length);
                    resolve(fileList);
                });
            });
        },
        async  getFilesFromDrops(items) {
            const fileList = [];
            const promises = [];
            function processEntry(entry, folder) {
                return new Promise((resolve) => {
                    if (entry.isFile) {
                        entry.file(res => {
                            // 在res 添加 path
                            res.folder = folder;
                            const obj = { file: res, folder, progress: 0, status: 'uploading' };
                            fileList.push(obj);
                            resolve();
                        });
                    } else if (entry.isDirectory) {
                        // const reader = entry.createReader();
                        // reader.readEntries(entries => {
                        //     const subPromises = entries.map(subEntry => processEntry(subEntry));
                        //     Promise.all(subPromises).then(() => resolve());
                        // });
                        // const reader = entry.createReader();
                    // const entries = await new Promise((resolve) => reader.readEntries(resolve));
                    // for (const subEntry of entries) {
                    //     await processEntry(subEntry);
                    // }
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
            return new Promise((resolve) => {
                Promise.all(promises).then(() => {
                    console.log('遍历完成', fileList);
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
            // this.submitTask(temp)
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
