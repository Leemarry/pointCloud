<!--  -->
<template>
  <div v-loading="mixinsLoading" element-loading-background="rgba(0, 0, 0, 0.3)" class="media">
    <div class="media-top">
      <el-form :inline="true" :model="formInline" :rules="rules" class="demo-form-inline">
        <el-form-item label="点云标注描述" prop="mark">
          <el-input v-model="formInline.mark" placeholder="文件详情..." />
        </el-form-item>
        <el-form-item label="时间范围" prop="startTime">
          <el-col :span="12">
            <el-date-picker v-model="formInline.startTime" type="datetime" placeholder="选择起始时间" align="right" :picker-options="pickerOptions" />
          </el-col>
          <el-col class="line" :span="2">至</el-col>
          <el-col :span="10">
            <el-date-picker v-model="formInline.endTime" type="datetime" placeholder="选择日期时间" default-time="12:00:00" />
          </el-col>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="queryList1">查询</el-button>
        <!-- <el-button type="primary" @click="uploadFiles({ fileType: 'cloud' , id : 0, reqUrl:'efapi/pointcloud/media/cloud/uploads2' })">上传</el-button> -->
        <el-dropdown split-button type="primary" style="margin-left: 5px;" @click="uploadFiles({ fileType: 'cloud' , id : 0, reqUrl:'efapi/pointcloud/media/cloud/uploads2' })">
          {{ title }}
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="operationType('上传',{ operation: 'hand' , id : 0, reqUrl:'efapi/pointcloud/media/cloud/uploads2' })">上传</el-dropdown-item>
            <!-- <el-dropdown-item>批量导入</el-dropdown-item> -->
            <!-- <el-dropdown-item @click.native="operationType('手动新增',{ operation: 'hand' , id : 0, reqUrl:'/business/hand/addOrupdateTower' })">手动新增</el-dropdown-item>
            <el-dropdown-item @click.native="operationType('批量导入',{ operation: 'batch' , id : 1, reqUrl:'/business/batch/batchInsertTower' })">批量导入</el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="media-container">
      <el-table
        :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="date" label="日期" width="180">
          <template slot-scope="scope">
            {{ parseTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="mark" label="标注名" width="120" />
        <el-table-column prop="amendType" label="类型" width="80" />
        <el-table-column prop="amendSize" label="大小" width="80">
          <template slot-scope="scope">
            <span>{{ filtersType(scope.row.amendSize) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amendCloudUrl" label="地址">
          <template slot-scope="scope">
            <el-tag
              :type="'info'"
              effect="plain"
              :hit="true"
              style="cursor: pointer;"
              @click="copy(scope.row.amendCloudUrl,scope.row.id)"
            >
              {{ scope.row.amendCloudUrl }}
              <i v-if="scope.row.copy " class="el-icon-finished" />
              <i v-else class="el-icon-document" />
              <!-- <i :class="scope.row.active ? 'el-icon-finished' : 'el-icon-document'" /> -->
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="previewPointCloud(scope.row)">查看</el-button>
            <el-button type="text" size="small" @click="previewWebCloud(scope.row)">web查看</el-button>
            <el-button type="text" size="small" @click="openupadte(scope.row)">编辑</el-button>
            <!-- <el-button type="text" size="small" @click="openfull(scope.row)">web查看</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="media-footer">
      <el-pagination
        align="center"
        :current-page="currentPage"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog title="引用链接更改" :visible.sync="Urldialog" width="30%">
      <el-form :model="form">
        <el-form-item label="html链接" :label-width="'80px'">
          <el-input v-model="form.webUrl" size="small" autocomplete="off" />
        </el-form-item>
        <el-form-item label="json链接" :label-width="'80px'">
          <el-input v-model="form.amendCloudUrl" size="small" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Urldialog = false">取 消</el-button>
        <el-button type="primary" @click="submitUpdate()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import currencyMinins from '@/utils/currencyMinins'
export default {
    name: 'PointCloud',
    //import引入的组件需要注入到对象中才能使用
    components: {},
    mixins: [currencyMinins],
    //让组件接收外部传来的数据
    props: {
    },
    data() {
    //这里存放数据
        return {
            Urldialog: false,
            form: {
                id: '',
                webUrl: '',
                amendCloudUrl: ''
            },
            title: '上传',
            reqData: {},
            reqUrl: '/media/cloud/querylist',
            //分页
            currentPage: 1,
            pageSize: 10
        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {},
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {},
    beforeCreate() { }, //生命周期 - 创建之前
    beforeMount() { }, //生命周期 - 挂载之前
    beforeUpdate() { }, //生命周期 - 更新之前
    updated() { }, //生命周期 - 更新之后
    beforeDestroy() { }, //生命周期 - 销毁之前
    destroyed() { }, //生命周期 - 销毁完成
    activated() { },
    //方法集合
    methods: {
        openupadte(row) {
            this.Urldialog = true;
            this.form = {
                id: row.id,
                webUrl: row.webUrl,
                amendCloudUrl: row.amendCloudUrl
            }
        },
        async  submitUpdate() {
            const id = this.form.id
            // tableData
            // const item = { ... this.tableData.find(item => item.id === id) }
            const index = this.tableData.findIndex(item => item.id === id)
            const item = { ... this.tableData[index] }
            item.webUrl = this.form.webUrl
            item.amendCloudUrl = this.form.amendCloudUrl
            try {
                const res = await this.$store.dispatch('media/updatePointCloud', item)
                const { code, data, message } = res
                if (code === 1) {
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    })

                    this.tableData.splice(index, 1, data)
                } else {
                    this.$message.error(message);
                }
            } catch (err) {
                console.log(err)
            } finally {
                this.Urldialog = false
            }
        },
        operationType(title, obj) {
            this.title = title;
            this.reqData = obj;
        },
        openfull(row) {
        // row.id, row.webUrl, 'web', row.mark
            const { id, webUrl, formats, mark } = row;
            const windowName = 'windowName-' + formats + mark;
            if (!this.windows[windowName] || this.windows[windowName].closed) {
            // 创建新窗口
                const existingWindow = window.open('', windowName);
                const queryString = `?id=${id}&src=${encodeURIComponent(webUrl)}&formats=${encodeURIComponent(formats)}`;
                existingWindow.location.href = '/full' + queryString;
                this.windows[windowName] = existingWindow;
            // // 为新窗口添加 message 事件监听器
            // existingWindow.addEventListener('message', handleMessage);
            } else {
                this.windows[windowName].focus();
            }
        },
        copy(textToCopy, id) {
            console.log(textToCopy);
            const self = this;
            if (!navigator.clipboard) {
                console.error('Clipboard API not supported');
                // 如通过创建一个临时的 <textarea> 元素，将其设置为只读并设置为选中状态，然后使用 document.execCommand('copy')
                this.copyTextToClipboard(textToCopy)
                const index = self.tableData.findIndex(item => item.id === id);
                if (index >= 0) {
                    self.tableData[index].copy = true;
                }
                return;
            }
            navigator.clipboard.writeText(textToCopy).then(() => {
                const index = self.tableData.findIndex(item => item.id === id);
                console.log('文本已复制到剪贴板', index);
                if (index >= 0) {
                // self.tableData[index].copy = true;
                    this.$set(this.tableData[index], 'copy', true);
                }
            }).catch(function(err) {
                console.error('复制失败: ', err);
            });
        },
        copyTextToClipboard(text) {
        // 创建一个临时的textarea元素
            const textarea = document.createElement('textarea');
            // 设置textarea的值为要复制的文本
            textarea.value = text;
            // 将textarea添加到文档中（这一步是可选的，但有时候可以帮助某些浏览器）
            document.body.appendChild(textarea);
            // 选中textarea中的所有文本
            textarea.select();
            try {
            // 尝试执行复制命令
                const successful = document.execCommand('copy');
                const msg = successful ? '成功复制' : '复制失败';
                console.log(msg);
            } catch (err) {
                console.error('复制失败:', err);
            }
            // 移除textarea元素
            document.body.removeChild(textarea);
        },

        // #region ------------------------------------------------------------- 查询 ----------------------------------------------------
        // #endregion

        // #region ---------------------------------------------------------- 打开新标签页 ----------------------------------------------------
        /**查看 */
        previewPointCloud(row) {
            const windowName = 'pointCloudPreview-' + row.id;
            if (!this.windows[windowName] || this.windows[windowName].closed) {
                const queryString = `?id=${row.id}&src=${encodeURIComponent(row.amendCloudUrl)}&data=${encodeURIComponent(JSON.stringify(row))}`;
                const url = '/previewPointcloud' + queryString;
                const existingWindow = window.open(url, windowName);
                console.log('this.windows', window.tableData);
                console.log('this.windows', existingWindow);
                existingWindow.tableData = this.tableData;
                this.windows[windowName] = existingWindow;
            } else {
                this.windows[windowName].focus();
            }
        },
        previewWebCloud(row) {
        // webUrl
        // const windowName = 'pointCloudPreview-' + row.id;
        // if (!this.windows[windowName] || this.windows[windowName].closed) {
        //     const queryString = `?id=${row.id}&src=${encodeURIComponent(row.webUrl)}&data=${encodeURIComponent(JSON.stringify(row))}`;
        //     const url = '/preview' + queryString;
        //     const existingWindow = window.open(url, windowName);
        //     console.log('this.windows', window.tableData);
        //     console.log('this.windows', existingWindow);
        //     existingWindow.tableData = this.tableData;
        //     this.windows[windowName] = existingWindow;
        // } else {
        //     this.windows[windowName].focus();
        // }
            this.beforeView(row.id, row.webUrl, 'web', row.mark)
        },

        //vue打开新窗口并且实现传参--目的
        openpage(item) {
            console.log('   console.log(this.$router.options.routes)', this.$router.options.routes)
            window.open(this.$router.resolve({ path: '/uploadpage?ip=' + item.fileType }).href, '_blank')
        },
        // #endregion

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

    } //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
.media {
  background-color: #f3f6f8;
  height: 100%;
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1;
}

.media-top {
  display: flex;
  justify-content: space-between;
}

.media-container {
  flex: 1;
  background-color: #fafafa;
  overflow: auto;
}
</style>
