<template>
  <el-container>
    <el-header height="40px" style="letter-spacing:34px">
      <el-select v-model="selectedUser" clearable placeholder="默认所有用户" size="mini" v-loading="loadingUser">
        <el-option v-for="item in users" :key="item.id" :label="item.uname" :value="item.id">
          <span style="float: left">{{ item.uname }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.uloginName }}</span>
        </el-option>
      </el-select>
      <el-date-picker style="margin-left:10px" size="mini" v-model="timeRange" value-format="timestamp" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
      </el-date-picker>
      <el-button style="margin-left:10px" type="primary" @click="queryAll()" size="mini">查询</el-button>
    </el-header>
    <el-main>
      <el-table v-loading="loading" element-loading-text="拼命加载中" :data="userOpterInfo" style="width: 100%" size="mini" height="100%" empty-text="暂无登录记录！">
        <el-table-column type="index" width="50" />
        <el-table-column prop="userid" label="用户ID" width="100">
        </el-table-column>
        <el-table-column prop="efUser.uname" label="操作人员" width="100">
        </el-table-column>
        <el-table-column prop="efUser.uloginName" label="登录名" width="100">
        </el-table-column>
        <!-- <el-table-column prop="ipWww" label="登录IP(外网)" width="120">
        </el-table-column> -->
        <el-table-column label="操作时间" width="150">
          <template slot-scope="props">
            {{ $dateUtil.convertMillSecToDateStr(props.row.optdate) }}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="操作记录">
        </el-table-column>
        <el-table-column label="操作级别" width="150">
          <template slot-scope="props">
            <el-rate :value="getLevel(props.row.level)" :max="3" disabled text-color="#ff9900" show-text :colors="colors" :texts="texts" score-template="{value}">
            </el-rate>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <el-drawer title="无人机类型" :visible.sync="isShowDialogInsert" :with-header="true">
      <el-form label-width="140px" label-position="left" :model="typeInfo" style="margin:10px" size="mini" v-loading="loadingUpdateInsert">
        <el-form-item label="无人机类型">
          <el-input v-model="typeInfo.typeName"></el-input>
        </el-form-item>
        <el-form-item label="型号">
          <el-input v-model="typeInfo.typeNo"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <el-image :src="typeInfo.typeImage" style="width:250px;height:100px" fit="scale-down">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" style="font-size: 100px;" />
            </div>
          </el-image>
        </el-form-item>
        <el-form-item>
          <el-upload class="upload-demo" action="#" :multiple="false" :on-change="handleChangeImage" :auto-upload="false" :file-list="fileListImages">
            <el-button slot="trigger" size="mini">选择图片</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateCompany('ruleForm')">保存</el-button>
          <el-button @click="cancelUpdateCompany()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </el-container>
</template>

<script>
export default {
  name: 'Opter',
  data() {
    return {
      loading: false,
      loadingUser: false,
      loadingUpdateInsert: false,
      isShowDialogInsert: false,
      isInsert: true,
      userOpterInfo: [],
      typeInfo: {},
      typeInfoTemp: {
        id: null,
        typeName: '',
        typeNo: '',
        typeImage: ''
      },
      fileListImages: [],
      selectedUser: null,
      users: [],
      // colors: ['#8CEA00', '#FFFF00', '#FF0000'], // 等同于 { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' }
      colors: { 1: '#8CEA00', 2: '#FFD700', 3: '#FF0000' },
      texts: ['普通', '警告', '危险'],
      pickerMinDate: '', // 第一次选中的时间
      pickerOptions: {
        onPick: obj => {
          this.pickerMinDate = new Date(obj.minDate).getTime()
        },
        disabledDate: time => {
          if (this.pickerMinDate) {
            const day1 = 32 * 24 * 3600 * 1000;
            const maxTime = this.pickerMinDate + day1;
            const minTime = this.pickerMinDate - day1;
            return time.getTime() > maxTime || time.getTime() < minTime;
          }
        },
        shortcuts: [{
          text: '最近一天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      timeRange: ''
    };
  },
  computed: {
    message() {
      return "你不能进入这个页面...";
    },
  },
  mounted() {
    this.init();
  },
  beforeDestroy() { },
  onDestroy() { },
  methods: {
    async init() {
      this.timeRange = []
      this.timeRange[0] = Date.now() - 1 * 24 * 60 * 60 * 1000
      this.timeRange[1] = Date.now()
      await this.queryAllUser()
      await this.queryAll()
    },
    showToast(msg) {
      this.$layer.msg(msg);
    },
    showMessage(msg, type) {
      this.$message({ message: msg, type: type })
    },
    getLevel(levelvalue) {
      let level = levelvalue + 1
      if (level < 1) {
        level = 1
      } else if (level > 3) {
        level = 3
      }
      return level
    },
    getLimitDateStr(timestamp) {
      if (timestamp === null) {
        return "已过期";
      }
      const date = this.$dateUtil.convertMillSecToYYYYMMDD(timestamp);
      if (timestamp < Date.now()) {
        return "已过期(" + date + ")";
      } else {
        return date;
      }
    },
    handleChangeImage(file, fileList) {
      this.fileListImages = [];
      if (this.beforeUpload(file.raw)) {
        this.fileListImages.push(file);
        this.typeInfo.typeImage = URL.createObjectURL(file.raw);
      }
    },
    beforeUpload(file) {
      const isJPG =
        file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("只能是 JPG 或 PNG 格式图片!");
      }
      if (!isLt2M) {
        this.$message.error("图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    startUpdate(row) {
      this.isInsert = false;
      this.fileListImages = [];
      this.typeInfo = this.$toolUtil.copyDeep(row);
      this.isShowDialogInsert = true;
    },

    async deleteUavType(row) {
      this.$confirm("确定删除无人机类型 [ " + row.typeName + " ] 吗?", "警告",
        {
          confirmButtonText: "确定删除",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.loading = true;
          try {
            return this.$store
              .dispatch("efCompany/deleteUavType", {
                id: row.id,
                sysId: row.csystemId,
              })
              .then((response) => {
                this.loading = false;
                const { code, message } = response;
                if (code === 1) {
                  const index = this.userOpterInfo.findIndex(
                    (item) => {
                      return item.id === row.id;
                    }
                  );
                  if (index >= 0) {
                    this.userOpterInfo.splice(index, 1);
                  }
                  this.showToast(message);
                } else {
                  this.showMessage(message, "warning");
                }
              })
              .catch((error) => {
                this.loading = false;
                this.showMessage(error, "error");
              });
          } catch (error) {
            this.loading = false;
          }
        })
        .catch(() => { });
    },
    cancelUpdateCompany() {
      this.isShowDialogInsert = false;
    },
    async updateCompany(row) {
      this.loadingUpdateInsert = true;
      let imageBase64 = null;
      if (this.fileListImages.length > 0) {
        await this.$toolUtil
          .convertImageToBase64(this.fileListImages[0].raw)
          .then((file) => {
            // console.log(file)
            // data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAwICQoJBwwKCQoNDAwOER0TERAQESMZGxUdKiUsKyklKCguNEI4LjE/MigoOk46P0R
            // if (file != null && file.length > 24) {
            //   imageBase64 = file.slice(23, file.length)
            //   // this.showMessage('图片转换: ' + file.length + ' , ' + imageBase64.length, 'warning')
            // }
            imageBase64 = file;
          })
          .catch((error) => {
            imageBase64 = null;
            this.showMessage("图片转换失败: " + error, "warning");
          });
      }
      const parms = {
        id: this.typeInfo.id,
        cName: this.typeInfo.cname,
        cNameZh: this.typeInfo.cnameZh,
        cAddress: this.typeInfo.caddress,
        cPhone: this.typeInfo.cphone,
        cTelephone: this.typeInfo.ctelephone,
        cLimitUav: this.typeInfo.climitUav,
        cLimitHive: this.typeInfo.climitHive,
        cLimitDate: this.typeInfo.climitDate,
        sysName: this.typeInfo.efSysteminfo.sysName,
        sysNameZh: this.typeInfo.efSysteminfo.sysNameZh,
        sysInfo: this.typeInfo.efSysteminfo.sysInfo,
        csystemId: this.typeInfo.csystemId,
      };
      if (imageBase64 !== null) {
        parms.cLogoIco = imageBase64;
      }
      let url = "efCompany/updateCompany";
      if (this.isInsert) {
        url = "efCompany/insertCompany";
      }
      await this.$store
        .dispatch(url, parms)
        .then((response) => {
          this.loadingUpdateInsert = false;
          const { code, message, data } = response;
          if (code === 1) {
            if (this.isInsert) {
              this.userOpterInfo.unshift(data);
            } else {
              const index = this.userOpterInfo.findIndex(
                (item) => {
                  return item.id === data.id;
                }
              );
              if (index >= 0) {
                this.userOpterInfo.splice(index, 1, data);
              }
            }
            this.showToast(message);
            this.isShowDialogInsert = false;
          } else {
            this.showMessage(message, "warning");
          }
        })
        .catch((error) => {
          this.loadingUpdateInsert = false;
          this.showMessage(error, "error");
        });
    },
    // 查询当前登录用户下属的用户
    async queryAllUser() {
      this.loading = true;
      this.users = [];
      try {
        await this.$store
          .dispatch('efUser/queryAllEfuser')
          .then((response) => {
            this.loading = false;
            const { code, message, data } = response;
            if (code === 1) {
              if (data && data.length > 0) {
                for (let j = 0, len = data.length; j < len; j++) {
                  data[j].uico = data[j].uico + '?' + Date.now()
                }
              }
              this.users = data
            } else {
              this.showMessage(message, "warning");
            }
          })
          .catch((error) => {
            this.loading = false;
            this.showMessage(error, "error");
          });
      } catch (error) {
        this.loading = false;
      }
    },
    // 查询所有公司
    async queryAll() {
      if (!this.timeRange || this.timeRange.length !== 2) {
        this.showToast('请选择时间！')
        return
      }
      this.loading = true
      this.userOpterInfo = []
      try {
        const timeStart = this.$dateUtil.getDateZeroMilliseconds(this.timeRange[0], 'last')
        const timeEnd = this.$dateUtil.getDateZeroMilliseconds(this.timeRange[1], 'newst')
        const parms = {
          userId: this.selectedUser,
          startTime: timeStart,
          endTime: timeEnd
        }
        await this.$store
          .dispatch('user/queryAllUserOperation', parms)
          .then((response) => {
            this.loading = false
            const { code, message, data } = response
            if (code === 1) {
              this.userOpterInfo = data
            } else {
              this.showMessage(message, "warning")
            }
          })
          .catch((error) => {
            this.loading = false
            this.showMessage(error, "error")
          });
      } catch (error) {
        this.loading = false
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.el-container {
  // background: blue;
  position: absolute;
  padding: 1px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.el-header {
  // background-color: #b3c0d1;
  color: #333;
  // text-align: center;
  // line-height: 20px;
  padding-top: 10px;
}

.el-main {
  // background:red;
  width: 100%;
  height: 100%;
  padding: 5px;
  flex: 1;
}
</style>
