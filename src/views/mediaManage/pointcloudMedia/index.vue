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
        <el-button type="primary" @click="queryList1()">查询</el-button>
        <!-- <el-button type="primary" @click="uploadFiles({ fileType: 'cloud' , id : 0, reqUrl:'efapi/pointcloud/media/cloud/uploads2' })">上传</el-button> -->
        <el-dropdown split-button type="primary" style="margin-left: 5px;" @click="beforeUpload()">
          {{ title }}
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="operationType('web上传',{ fileType: 'cloud' , id : 0, reqUrl:'efapi/pointcloud/media/cloud/uploadwebcloud' ,title:'web上传'})">web上传</el-dropdown-item>
            <el-dropdown-item @click.native="operationType('pnts上传',{ fileType: 'cloud' , id : 0, reqUrl:'efapi/pointcloud/media/cloud/uploadpntscloud',title:'pnts上传' })">pnts上传</el-dropdown-item>
          </el-dropdown-menu></el-dropdown>
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
        <el-table-column prop="mark" label="标注名" width="250" />
        <el-table-column prop="amendType" label="类型" width="80" />
        <!-- <el-table-column prop="towerMark" label="杆塔编号" width="200">
          <template slot-scope="scope">
            <el-tag type="success">{{ scope.row.towerMark }}</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column prop="markTag" label="杆塔区间" width="200">
          <template slot-scope="scope">
            <el-tag type="success">{{ `${scope.row.markTag}-${formatNumber(scope.row.startMarkNum)}-${formatNumber( scope.row.endMarkNum)}` }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amendCloudUrl" label="Pnts文件地址">
          <!-- danger -->
          <template slot-scope="scope">
            <el-tag
              :type=" scope.row.amendCloudUrl ? 'info' :'danger'"
              effect="plain"
              :hit="true"
              style="cursor: pointer;"
              @click="copy(scope.row.amendCloudUrl,scope.row.id)"
            >
              {{ }}
              <i v-if="scope.row.copy " class="el-icon-finished" />
              <i v-else class="el-icon-document" />
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="webUrl" label="Web文件地址">
          <!-- danger -->
          <template slot-scope="scope">
            <el-tag
              :type=" scope.row.webUrl ? 'info' :'danger'"
              effect="plain"
              :hit="true"
              style="cursor: pointer;"
              @click="copy(scope.row.webUrl,scope.row.id)"
            >
              {{ }}
              <i v-if="scope.row.copy " class="el-icon-finished" />
              <i v-else class="el-icon-document" />
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot="header" slot-scope="scope">
            <el-tag size="small" style="cursor: pointer" @click="clickAdd()">数据新增</el-tag>
          </template>
          <template slot-scope="scope">
            <el-button type="text" size="small" :disabled="!scope.row.amendCloudUrl" @click="previewPointCloud(scope.row)">查看</el-button>
            <el-button type="text" size="small" :disabled="!scope.row.webUrl" @click="previewWebCloud(scope.row)">web查看</el-button>
            <!-- <el-button type="text" size="small" @click="openupadte(scope.row)">编辑</el-button> -->
            <el-button type="text" size="small" @click="beforeDelect(scope.row,'/media/cloud/delect')">删除</el-button>
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
    <el-dialog :visible.sync="dialogAddVisible" width="700px">
      <span slot="title">
        <el-tooltip content="数据存储代理文件下" placement="bottom" effect="light">
          <span>{{ `新增数据` }}<i class="el-icon-warning" :style="{color: iswarn ? '#f56C6C' :'#E6A23C' }" /></span>
        </el-tooltip>
      </span>
      <el-form ref="form2" :model="form2" :rules="rules" style="height: 200px;">
        <el-col :span="24">
          <el-form-item label="文件路径" :label-width="'120px'" prop="fullpath">
            <span slot="label">
              <i class="el-icon-edit" />
              pnts路径
            </span>
            <el-input v-model="form2.fullpath" class="elinput" autocomplete="off" placeholder="格式：D:\dockerv\nginx\html\proxy\cloud_0731_B001_B006\terra_pnts\tileset.json" @change="changeText($event)" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="类型" :label-width="'120px'" prop="markTag">
            <el-select v-model="form2.markTag" placeholder="请选择" style="width: 130px;">
              <el-option
                v-for="item in cities"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-col :span="11">
            <el-form-item label="区间" :label-width="'100px'" prop="endMarkNumStr">
              <el-input v-model="form2.startMarkNumStr" style="width: 130px;" class="elinput" autocomplete="off" placeholder="小区间格式：B001" />
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2" style="text-align: center; line-height: 40px;">-</el-col>
          <el-col :span="11">
            <el-form-item prop="endMarkNumStr">
              <el-input v-model="form2.endMarkNumStr" style="width: 130px;" class="elinput" autocomplete="off" placeholder="小区间：B065" />
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="24">
          <el-form-item label="文件路径" :label-width="'120px'" prop="fullpath2">
            <span slot="label">
              <i class="el-icon-edit" />
              web路径
            </span>
            <el-input v-model="form2.fullpath2" class="elinput" autocomplete="off" placeholder="格式：D:\dockerv\nginx\html\proxy\cloud_0731_B001_B006\out\web.html" @change="changeText2($event)" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="pnts文件夹" :label-width="'120px'" prop="mark">
            <el-input v-model="form2.mark" class="elinput" style="width: 130px;" autocomplete="off" placeholder="格式：map_0723_A001_A026" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="web文件夹" :label-width="'120px'" prop="mark2">
            <el-input v-model="form2.mark2" class="elinput" style="width: 130px;" autocomplete="off" placeholder="格式：map_0723_A001_A026" />
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('form2')">取 消</el-button>
        <el-button type="primary" :loading="mixinsLoading" @click="submitForm('form2')">确 定</el-button>
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
        const validatePrefixAndNumber = (rule, value, callback) => {
            if (!value || !value.includes(this.form2.markTag)) {
                callback(new Error('请与类型保持!'));
                return
            }
            // 字符串以'A'或'B'开头，后续跟随一个或多个数字
            var reg = /^[AB]\d+$/;
            if (!reg.test(value)) {
                callback(new Error('以A或B开头，且后续只能跟随数字!'));
            } else {
                callback(); // 验证通过
            }
        };
        //这里存放数据
        return {
            iswarn: false,
            cities: [{
                value: 'B',
                label: '东西线'
            }, {
                value: 'A',
                label: '南北线'
            }],
            dialogAddVisible: false,
            form2: {
                fullpath: '',
                amendCloudUrl: '',
                fullpath2: '',
                webUrl: '',
                mark: null,
                markTag: 'B',
                startMarkNumStr: null,
                startMarkNum: null,
                endMarkNumStr: null,
                endMarkNum: null
            },
            rules: {
                fullpath: [
                    { required: true, message: '请输入文件目录标识,如:cloud_0731_B001_B006', trigger: 'blur' },
                    { min: 9, max: 165, message: '长度在 9 到 165 个字符', trigger: 'blur' }
                ],
                mark: [
                    { required: true, message: '请输入文件目录标识,如:map_0731_B001_B006', trigger: 'blur' },
                    { min: 6, max: 50, message: '长度在 6 到 50 个字符', trigger: 'blur' }
                ],
                endMarkNumStr: [
                    { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' },
                    { validator: validatePrefixAndNumber, trigger: 'blur' },
                    { validator: validatePrefixAndNumber, trigger: 'change' },
                    { required: true, message: '请填写格式：B002', trigger: 'blur' }
                ],
                startMarkNumStr: [
                    { required: true, message: '请填写格式：B002', trigger: 'blur' },
                    { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' },
                    { validator: validatePrefixAndNumber, trigger: 'blur' },
                    { validator: validatePrefixAndNumber, trigger: 'change' }
                ]
            },
            Urldialog: false,
            form: {
                id: '',
                webUrl: '',
                amendCloudUrl: ''
            },
            title: 'web上传',
            reqData: { fileType: 'cloud', id: 0, reqUrl: 'efapi/pointcloud/media/cloud/uploadwebcloud', title: 'web上传' },
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
        // #region --------------------------------------------------------------- 代理弹窗 ----------------------------------------------------------
        clickAdd() {
            this.dialogAddVisible = true
            this.iswarn = false
            this.$nextTick(() => {
                this.$refs['form2'].resetFields()
	        })
        },
        async changeText(e) {
            const replacedPath = e.replace(/\\/g, '/');
            console.log(replacedPath);
            const startIndex = replacedPath.indexOf('proxy');
            const result = replacedPath.substring(startIndex);
            if (!result.endsWith('.json')) {
                this.$message.warning('请选择tileset.json文件')
                return;
            }
            this.fetchAndRead(result)
            //取出 result 第一个/ 与第二个/ 中间的字符串 有可能不存在第二个/
            const startIndex2 = result.indexOf('/') + 1;
            const endIndex2 = result.indexOf('/', startIndex2 + 1);
            let middleString = result.substring(startIndex2);
            if (endIndex2 !== -1) {
                middleString = result.substring(startIndex2, endIndex2);
                console.log(middleString);
            }
            this.form2.mark = middleString
            this.form2.amendCloudUrl = result
        },
        async changeText2(e) {
            const replacedPath = e.replace(/\\/g, '/');
            console.log(replacedPath);
            const startIndex = replacedPath.indexOf('proxy');
            const result = replacedPath.substring(startIndex);
            // result 为空
            if (result === '') {
                return;
            }
            // result 判断字符串后缀是不是 .zip
            if (!result.endsWith('.html')) {
                this.$message.warning('请选择一个html文件')
                return;
            }
            this.fetchAndRead(result)
            //取出 result 第一个/ 与第二个/ 中间的字符串 有可能不存在第二个/
            const startIndex2 = result.indexOf('/') + 1;
            const endIndex2 = result.indexOf('/', startIndex2 + 1);
            let middleString = result.substring(startIndex2);
            if (endIndex2 !== -1) {
                middleString = result.substring(startIndex2, endIndex2);
                console.log(middleString);
            }
            this.form2.mark2 = middleString
            this.form2.webUrl = result
        },
        async fetchAndRead(url) {
            try {
                const response = await fetch(url)
                if (!response.ok) {
                    this.iswarn = true
                    this.$message.error('请检查是否存放proxy文件夹下');
                }
            } catch (err) {
                this.iswarn = true
                this.$message.error('请检查是否存放proxy文件夹下');
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log('submitForm', this.form2);
                    this.insertOrUpdate()
                } else {
                    // console.log('error submit!!');
                    return false;
                }
            });
        },
        async insertOrUpdate() {
            this.mixinsLoading = true;
            try {
            // efapi/pointcloud/media/orthoimg/mapupload
                this.form2.startMarkNum = this.extractNumberAsString(this.form2.startMarkNumStr)
                this.form2.endMarkNum = this.extractNumberAsString(this.form2.endMarkNumStr)
                const reqData = { url: 'media/cloud/insertOrUpdate', data: this.form2 }
                // const res = await this.$store.dispatch('media/queryList1', reqData)
                const res = await this.$store.dispatch('media/addproxyMap', reqData);
                const { code } = res
                if (code === 1) {
                    this.formInline.endTime = new Date(Date.now() + 3600);
                    this.queryList1()
                }
            } catch (err) {
                this.$message.error('新增失败')
            } finally {
                this.dialogAddVisible = false
                this.mixinsLoading = false;
            }
        },
        extractNumberAsString(str) {
            const match = str.match(/\d+/); // 匹配一个或多个数字
            return match ? match[0] : null; // 如果没有匹配到数字，则返回null
        },
        formatNumber(num) {
            let str = num.toString();
            while (str.length < 4) {
                str = '0' + str;
            }
            return str;
        },
        // #endregion
        beforeDelect(row, url) {
            try {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const prams = { id: row.id, url: row.amendCloudUrl, url2: row.webUrl }
                    this.delete(prams, url)
                })
            } catch (err) {
                this.$message({
                    message: '操作失败c',
                    type: 'warning',
                    duration: 1000
                })
            }
        },
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
        beforeUpload() {
            this.uploadFiles(this.reqData, 0)
        },
        uploadFiles(item, index) {
            const windowName = 'uploadWindow-' + item.fileType; // 设定窗口名称
            if (!this.windows[windowName] || this.windows[windowName].closed) {
                // 如果窗口存在并且关闭了就在this.windows中删除
                if (this.windows[windowName]) {
                    delete this.windows[windowName];
                }
                const existingWindow = window.open('', windowName);
                const queryString = `?id=${item.id}&src=${encodeURIComponent(item.reqUrl)}&type=${encodeURIComponent(item.fileType)}&title=${encodeURIComponent(item.title)}`;
                const url = '/uploadphoto' + queryString;
                existingWindow.location.href = url; //'/uploadpage' + '?id=' + item.id + '&fileType=' + item.fileType;
                this.windows[windowName] = existingWindow;
            } else {
                this.windows[windowName].focus();
            }
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
                const queryString = `?id=${row.id}&src=${encodeURIComponent(row.amendCloudUrl)}&data=${encodeURIComponent(JSON.stringify(row))}&title=${encodeURIComponent('点云瓦片')}`;
                const url = '/previewPointcloud' + queryString;
                const existingWindow = window.open(url, windowName);
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
::v-deep .elinput{

input::-webkit-input-placeholder {
/* WebKit browsers，webkit内核浏览器 */
color: #ccc;
font-size: 12px;
}
input:-moz-placeholder {
/* Mozilla Firefox 4 to 18 */
color: #ccc;
font-size: 12px;
}
input::-moz-placeholder {
/* Mozilla Firefox 19+ */
color: #ccc;
font-size: 12px;
}
input:-ms-input-placeholder {
/* Internet Explorer 10+ */
color: #ccc;
font-size: 12px;
}

}
</style>
