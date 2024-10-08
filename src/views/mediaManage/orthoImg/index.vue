<!--  -->
<template>
  <div v-loading="mixinsLoading" element-loading-background="rgba(0, 0, 0, 0.3)" class="media">
    <div class="media-top">
      <el-form :inline="true" :model="formInline" :rules="rules" class="demo-form-inline">
        <el-form-item label="正射标注" prop="mark">
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
        <!-- <el-button type="primary" @click="uploadFiles({ fileType: 'orthoimg' , id : 0,reqUrl:'efapi/pointcloud/media/orthoimg/uploads' })">上传</el-button> -->
        <el-dropdown split-button type="primary" style="margin-left: 5px;" @click="beforeUpload()">
          {{ title }}
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="operationType('正射图级',{ fileType: 'orthoimg' , id : 0, reqUrl:'efapi/pointcloud/media/orthoimg/mapupload',title: '地图图级' })">正射图级</el-dropdown-item>
            <!-- <el-dropdown-item @click.native="operationType('正射tif',{ fileType: 'orthoimg' , id : 1, reqUrl:'efapi/pointcloud/media/orthoimgTif/uploads',title: 'TIF' })">正射tif</el-dropdown-item> -->
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
        <el-table-column prop="mark" label="标注名" width="220" />
        <el-table-column prop="formats" label="类型" />
        <el-table-column prop="lat" label="经纬度">
          <template slot-scope="scope">
            <span>{{ scope.row.lat }} , {{ scope.row.lon }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mapPath" label="正射文件地址">
          <!-- danger -->
          <template slot-scope="scope">
            <el-tag
              :type=" scope.row.mapPath ? 'info' :'danger'"
              effect="plain"
              :hit="true"
              style="cursor: pointer;"
              @click="copy(scope.row.mapPath,scope.row.id)"
            >
              {{ }}
              <i v-if="scope.row.copy " class="el-icon-finished" />
              <i v-else class="el-icon-document" />
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="markTag" label="杆塔区间" width="200">
          <template slot-scope="scope">
            <el-tag type="success">{{ `${scope.row.markTag}-${formatNumber(scope.row.startMarkNum)}-${formatNumber( scope.row.endMarkNum)}` }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot="header" slot-scope="scope">
            <el-tag size="small" style="cursor: pointer" @click="clickAdd()">数据新增</el-tag>
          </template>
          <template slot-scope="scope">
            <!-- <el-button type="text" size="small" @click="beforeView(scope.row.id,scope.row.path,scope.row.formats)">查看</el-button> -->
            <el-button type="text" size="small" @click="previewPointCloud(scope.row)">查看</el-button>
            <el-button type="text" size="small" @click="beforeDelect(scope.row,'/media/orthoimg/delect')">删除</el-button>
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
    <el-dialog :visible.sync="dialogAddVisible">
      <span slot="title">
        <el-tooltip content="数据存储代理文件下" placement="bottom" effect="light">
          <span>{{ `新增数据` }}<i class="el-icon-warning" style="color: #E6A23C" /></span>
        </el-tooltip>
      </span>
      <el-form ref="form" :model="form" :rules="rules" style="height: 200px;">
        <el-col :span="24">
          <el-form-item label="文件路径" :label-width="'120px'" prop="fullpath">
            <span slot="label">
              <i class="el-icon-edit" />
              文件路径
            </span>
            <el-input v-model="form.fullpath" class="elinput" autocomplete="off" placeholder="格式：E:\dockerv\nginx\html\proxy\map_0723_A001_A026\map\gsddsm.tfw" @input="inputText($event)" @change="changeText($event)" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="类型" :label-width="'120px'" prop="markTag">
            <el-select v-model="form.markTag" placeholder="请选择" style="width: 130px;">
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
            <el-form-item label="区间" :label-width="'100px'" prop="startMarkNumStr">
              <el-input v-model="form.startMarkNumStr" style="width: 130px;" class="elinput" autocomplete="off" placeholder="格式：B001" />
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2" style="text-align: center; line-height: 40px;">-</el-col>
          <el-col :span="11">
            <el-form-item prop="endMarkNumStr">
              <el-input v-model="form.endMarkNumStr" style="width: 130px;" class="elinput" autocomplete="off" placeholder="格式：B065" />
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="8">
          <el-form-item label="文件夹" :label-width="'120px'" prop="mark">
            <el-input v-model="form.mark" style="width: 130px;" class="elinput" autocomplete="off" placeholder="格式：map_0723_A001_A026" />
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-col :span="11">
            <el-form-item label="经纬度" :label-width="'100px'" prop="lon">
              <el-input v-model="form.lon" style="width: 130px;" class="elinput" autocomplete="off" placeholder="请输入经度" />
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2" style="text-align: center; line-height: 40px;">-</el-col>
          <el-col :span="11">
            <el-form-item prop="lat">
              <el-input v-model="form.lat" style="width: 130px;" class="elinput" autocomplete="off" placeholder="请输入纬度" />
            </el-form-item>
          </el-col>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('form')">取 消</el-button>
        <el-button type="primary" :loading="mixinsLoading" @click="submitForm('form')">确 定</el-button>
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
        // eslint-disable-next-line no-unused-vars
        const validateLongitude = (rule, value, callback) => {
            //经度,整数部分为0-180小数部分为0到15位
            var longreg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,15})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,15}|180)$/
            if (!longreg.test(value)) {
                callback(new Error('经度整数部分为0-180,小数部分为0到15位!'))
            }
            callback()
        }
        // eslint-disable-next-line no-unused-vars
        const validateLatitude = (rule, value, callback) => {
            //纬度,整数部分为0-90小数部分为0到15位
            var latreg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,15}|90\.0{0,15}|[0-8]?\d{1}|90)$/
            if (!latreg.test(value)) {
                callback(new Error('纬度整数部分为0-90,小数部分为0到15位!'))
            }
            callback()
        }
        const validatePrefixAndNumber = (rule, value, callback) => {
            // 字符串以'A'或'B'开头，后续跟随一个或多个数字 并且 value 含有 markTag
            if (!value || !value.includes(this.form.markTag)) {
                callback(new Error('请与类型保持!'));
                return
            }
            var reg = /^[AB]\d+$/;
            if (!reg.test(value)) {
                callback(new Error('以A或B开头，且后续只能跟随数字!'));
            } else {
                callback(); // 验证通过
            }
        };
        const validateIncludes = (rule, value, callback) => {
            // 验证文件目录标识是否包含map_
            const target = '/map/';
            const index = value.indexOf(target);
            if (index !== -1 || value.includes('\\map\\')) {
                callback()
            } else {
                callback(new Error('请检查目录机构是否正确，文件目录标识必须包含map'))
            }
        };
        //这里存放数据
        return {
            cities: [{
                value: 'B',
                label: '东西线'
            }, {
                value: 'A',
                label: '南北线'
            }],
            dialogAddVisible: false,
            form: {
                fullpath: '',
                mapPath: '',
                lat: null,
                lon: null,
                mark: null,
                markTag: 'B',
                startMarkNumStr: null,
                startMarkNum: null,
                endMarkNumStr: null,
                endMarkNum: null
            },
            rules: {
                fullpath: [
                    { required: true, message: '请输入文件目录标识,如:map_0731_B001_B006', trigger: 'blur' },
                    { min: 9, max: 165, message: '长度在 9 到 165 个字符', trigger: 'blur' },
                    { validator: validateIncludes, trigger: 'blur' },
                    { validator: validateIncludes, trigger: 'change' }
                ],
                mark: [
                    { required: true, message: '请输入文件目录标识,如:map_0731_B001_B006', trigger: 'blur' },
                    { min: 6, max: 50, message: '长度在 6 到 50 个字符', trigger: 'blur' }
                ],
                endMarkNumStr: [
                    // { required: true, message: '请填写杆塔号B002', trigger: 'blur' },
                    { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' },
                    { validator: validatePrefixAndNumber, trigger: 'blur' },
                    { validator: validatePrefixAndNumber, trigger: 'change' }
                ],
                startMarkNumStr: [
                    // { required: true, message: '请填写杆塔号B002', trigger: 'blur' },
                    { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' },
                    { validator: validatePrefixAndNumber, trigger: 'blur' },
                    { validator: validatePrefixAndNumber, trigger: 'change' }
                ],
                lon: [
                    { validator: validateLongitude, trigger: 'blur' },
                    { validator: validateLongitude, trigger: 'change' }
                ],
                lat: [
                    { validator: validateLatitude, trigger: 'blur' },
                    { validator: validateLatitude, trigger: 'change' }
                ]
            },
            title: '正射图级',
            reqData: { fileType: 'orthoimg', id: 1, reqUrl: 'efapi/pointcloud/media/orthoimg/mapupload', title: '地图图级' },
            reqUrl: '/media/orthoImg/querylist'
        };
    },
    // url ="miniosource/efuav-ortho-img/pointcloud/zseimage_202408160833_001_B0041064/zseimage_202408160833_001_B004/map/{z}/{x}/{y}.png";
    // F:\document\map\map_2024_831_0731\map_2024_831_07311\map\gsddsm.tfw
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
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
    activated() { },
    //方法集合
    methods: {
        clickAdd() {
            this.dialogAddVisible = true
            this.$nextTick(() => {
                this.$refs['form'].resetFields()
            })
        },
        inputText(e) {
            this.debounce(this.printInputValue, 500)
        },
        async changeText(e) {
            // const newPath = this.form.path.replace(/\//g, '/');
            // console.log(newPath);
            const replacedPath = e.replace(/\\/g, '/');
            console.log(replacedPath);
            const startIndex = replacedPath.indexOf('proxy');
            const result = replacedPath.substring(startIndex);
            this.fetchAndRead(result)
            //取出 result 第一个/ 与第二个/ 中间的字符串 有可能不存在第二个/
            const startIndex2 = result.indexOf('/') + 1;
            const endIndex2 = result.indexOf('/', startIndex2 + 1);
            let middleString = result.substring(startIndex2);
            if (endIndex2 !== -1) {
                middleString = result.substring(startIndex2, endIndex2);
                console.log(middleString);
            }
            this.form.mark = middleString
            this.form.mapPath = this.zxy(result)
        },
        async fetchAndRead(result) {
            try {
                const response = await fetch(result);
                if (response.ok) {
                    const textContent = await response.text();
                    console.log(textContent);
                    const lines = textContent.split('\n');
                    const latitudeCandidate = lines[5];
                    const longitudeCandidate = lines[4];

                    const isLatitudeValid = !isNaN(parseFloat(latitudeCandidate)) && (parseFloat(latitudeCandidate) >= -90 && parseFloat(latitudeCandidate) <= 90);
                    const isLongitudeValid = !isNaN(parseFloat(longitudeCandidate)) && (parseFloat(longitudeCandidate) >= -180 && parseFloat(longitudeCandidate) <= 180);

                    if (isLatitudeValid && isLongitudeValid) {
                        console.log(`纬度：${latitudeCandidate}`);
                        // latitudeCandidate 只保留小数点后六位
                        const latNum = Number(latitudeCandidate);
                        if (!isNaN(latNum)) {
                            this.form.lat = latNum.toFixed(6);
                        } else {
                            // 处理错误情况，例如设置为默认值或抛出错误
                            console.error('Invalid latitude:', latitudeCandidate);
                            this.form.lat = '0.000000'; // 或者其他默认值
                        }
                        const lonNum = Number(longitudeCandidate);
                        if (!isNaN(lonNum)) {
                            this.form.lon = lonNum.toFixed(6);
                        } else {
                            // 处理错误情况，例如设置为默认值或抛出错误
                            console.error('Invalid latitude:', longitudeCandidate);
                            this.form.lon = '0.000000'; // 或者其他默认值
                        }
                        console.log(`经度：${longitudeCandidate}`);
                    } else {
                        // console.log('数据不是有效的经纬度格式，需要校验。');
                    }
                } else {
                    console.error('请求失败，状态码：', response.status);
                    this.$message.error('请检查是否存放proxy文件夹下');
                }
                console.log(response);
            } catch (error) {
                console.error('Error:', error);
                this.$message.error('请检查是否存放proxy文件夹下');
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log('submitForm', this.form);
                    this.addMap()
                } else {
                    // console.log('error submit!!');
                    return false;
                }
            });
        },
        async addMap() {
            this.mixinsLoading = true;
            try {
            // efapi/pointcloud/media/orthoimg/mapupload
                this.form.startMarkNum = this.extractNumberAsString(this.form.startMarkNumStr)
                this.form.endMarkNum = this.extractNumberAsString(this.form.endMarkNumStr)
                const reqData = { url: 'media/orthoimg/insertOrUpdate', data: this.form }
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
        zxy(str) {
            const target = '/map/';
            const index = str.indexOf(target);
            if (index !== -1) {
                const before = str.slice(0, index + target.length);
                const after = '{z}/{x}/{y}.png';
                const newStr = before + after;
                console.log(newStr);
                return newStr;
            } else {
                console.log('原始字符串中不存在目标子串。');
            }
        },
        extractNumberAsString(str) {
            const match = str.match(/\d+/); // 匹配一个或多个数字
            return match ? match[0] : null; // 如果没有匹配到数字，则返回null
        },

        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.dialogAddVisible = false
        },
        printInputValue(e) {
            console.log('e', e);
        },
        debounce(fn, delay) {
            let timer = null;
            return function() {
                const context = this;
                const args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function() {
                    fn.apply(context, args);
                }, delay);
            };
        },
        operationType(title, data) {
            this.title = title
            this.reqData = data
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
                const queryString = `?id=${item.id}&src=${encodeURIComponent(item.reqUrl)}&type=${encodeURIComponent(item.fileType)}&title=${encodeURIComponent(item.title)}`; //data=${encodeURIComponent(JSON.stringify(item))}
                const url = '/uploadphoto' + queryString;
                existingWindow.location.href = url; //'/uploadpage' + '?id=' + item.id + '&fileType=' + item.fileType;
                this.windows[windowName] = existingWindow;
            } else {
                this.windows[windowName].focus();
            }
        },
        previewPointCloud(row) {
            const windowName = 'orthoimgPreview-' + row.id;
            if (!this.windows[windowName] || this.windows[windowName].closed) {
                const queryString = `?id=${row.id}&src=${encodeURIComponent(row.mapPath)}&data=${encodeURIComponent(JSON.stringify(row))}&title=${encodeURIComponent('正射瓦片')}`;
                const url = '/previewPointcloud' + queryString;
                const existingWindow = window.open(url, windowName);
                existingWindow.tableData = this.tableData;
                this.windows[windowName] = existingWindow;
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
        // #region ------------------------------------------------------------- 查询 ----------------------------------------------------
        beforeDelect(row, url) {
            try {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const prams = { id: row.id, url: row.mapPath, url2: undefined }
                    this.delete(prams, url)
                })
            } catch (err) {
                this.$message({
                    message: '操作失败',
                    type: 'warning',
                    duration: 1000
                })
            }
        },
        // #endregion

        // #region ---------------------------------------------------------- 打开新标签页 ---------------------------------------------------
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
        },

        // #endregion
        formatNumber(num) {
            let str = num.toString();
            while (str.length < 4) {
                str = '0' + str;
            }
            return str;
        }

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
