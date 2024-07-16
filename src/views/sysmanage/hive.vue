<template>
  <el-container>
    <el-header height="40px">
      <el-button type="primary" size="mini">新增停机坪</el-button>
      <el-button type="primary" @click="startAdd" size="mini">新增停机坪</el-button>
    </el-header>
    <el-main>
      <el-table v-loading="loading" :data="hivesInfo" style="width: 100%" height="100%" empty-text="暂无停机坪">
        <el-table-column type="index" width="50" />
        <el-table-column prop="hiveId" label="编号" width="200">
        </el-table-column>
        <el-table-column prop="hiveName" label="昵称">
        </el-table-column>
        <el-table-column prop="hiveLat" label="纬度">
        </el-table-column>
        <el-table-column prop="hiveLng" label="经度">
        </el-table-column>
        <el-table-column prop="hiveAltabs" label="海/米">
        </el-table-column>
        <el-table-column prop="hiveAddress" label="位置">
        </el-table-column>
        <el-table-column prop="hiveCreateDate" label="生产日期">
          <template slot-scope="props">
            {{ $dateUtil.convertMillSecToYYYYMMDD(props.row.hiveCreateDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="hiveDes" label="描述">
        </el-table-column>
        <el-table-column prop="hiveInstallDate" label="安装12日期">
          <template slot-scope="props">
            {{ $dateUtil.convertMillSecToYYYYMMDD(props.row.hiveInstallDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="hiveInstall" label="是否安装">
          <template slot-scope="props">
            <el-tag v-if="props.row.hiveInstall === true" type="success">已安装</el-tag>
            <el-tag v-else type="danger">未安装</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操123作" width="120">
          <template slot-scope="scope">
            <el-button @click="deleteHive(scope.row)" type="text" size="small">删除</el-button>
            <el-button type="text" size="small" @click="startUpdate(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <el-drawer title="停机坪" :visible.sync="isShowDialogInsert" :with-header="true" size="400px">
      <el-scrollbar wrap-style="overflow-x:hidden" style="width: 100%; height:100%;">
        <el-form label-width="140px" :model="hiveInfo" ref="hiveInfo" :rules="hiveInfoRules" label-position="left" style="margin:10px" size="mini" v-loading="loadingUpdateInsert">
          <el-form-item label="停机坪编号" prop="hiveId">
            <el-input v-model="hiveInfo.hiveId" :disabled="isInsert==false"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="hiveName">
            <el-input v-model="hiveInfo.hiveName"></el-input>
          </el-form-item>
          <el-form-item label="纬度" prop="hiveLat">
            <el-input v-model="hiveInfo.hiveLat"></el-input>
          </el-form-item>
          <el-form-item label="经度" prop="hiveLng">
            <el-input v-model="hiveInfo.hiveLng"></el-input>
          </el-form-item>
          <el-form-item label="海拔高度" prop="hiveAltabs">
            <el-input v-model="hiveInfo.hiveAltabs"></el-input>
          </el-form-item>
          <el-form-item label="生产日期" prop="hiveCreateDate">
            <el-date-picker type="date" placeholder="请选择生产日期" v-model="hiveInfo.hiveCreateDate" style="width: 100%;" value-format="timestamp"></el-date-picker>
          </el-form-item>
          <el-form-item label="是否安装" prop="hiveInstall">
            <el-switch v-model="hiveInfo.hiveInstall"></el-switch>
          </el-form-item>
          <el-form-item label="安装位置" prop="hiveAddress">
            <el-input v-model="hiveInfo.hiveAddress" :disabled="hiveInfo.hiveInstall===false"></el-input>
          </el-form-item>
          <el-form-item label="安装日期" prop="hiveInstallDate">
            <el-date-picker :disabled="hiveInfo.hiveInstall===false" type="date" placeholder="请选择出厂日期" v-model="hiveInfo.hiveInstallDate" style="width: 100%;" value-format="timestamp"></el-date-picker>
          </el-form-item>
          <el-form-item label="描述1">
            <el-input v-model="hiveInfo.hiveDes"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="beforeUpdateHive('hiveInfo')">{{ isInsert ? '新增' : '修改' }}</el-button>
            <el-button @click="cancelUpdateHive()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-drawer>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: "Hives",
  data() {
    var valiNumberPass1 = (rule, value, callback) => {// 包含小数的数字
      const reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
      if (value === '') {
        callback(new Error('请输入内容'));
      } else if (!reg.test(value)) {
        callback(new Error('请输入数字'));
      } else {
        callback();
      }
    };
    var valiNumberPass2 = (rule, value, callback) => {// 正整数
      const reg = /^[+]{0,1}(\d+)$/g;
      if (value === '') {
        callback(new Error('请输入内容'));
      } else if (!reg.test(value)) {
        callback(new Error('请输入0及0以上的整数'));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      loadingUpdateInsert: false,
      isShowDialogInsert: false,
      isInsert: true,
      hivesInfo: [],
      hiveInfo: {},
      uavFactorys: [],
      uavTypes: [],
      hiveInfoTemp: {
        "hiveId": "",
        "hiveName": "",
        "hiveDes": "",
        "hiveAddress": "",
        "hiveCreateDate": null,
        "hiveInstallDate": null,
        "hiveLat": 0,
        "hiveLng": 0,
        "hiveAltabs": 0,
        "hiveInstall": false,
        "hiveStatus": 0
      },
      hiveInfoRules: {
        hiveId: [
          { required: true, message: '请输入停机坪编号', trigger: 'blur' },
          { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
        ],
        hiveName: [
          { required: true, message: '请输入停机坪昵称', trigger: 'change' }
        ],
        hiveLat: [
          { required: true, validator: valiNumberPass1, trigger: 'change' }
        ],
        hiveLng: [
          { required: true, validator: valiNumberPass1, trigger: 'change' }
        ],
        hiveAltabs: [
          { required: true, validator: valiNumberPass1, trigger: 'change' }
        ],
        hiveCreateDate: [
          { required: true, message: '请选择生产日期', trigger: 'change' }
        ]
      }
    };
  },
  computed: {

  },
  mounted() {
    this.init();
  },
  beforeDestroy() { },
  onDestroy() { },
  methods: {
    async init() {
      await this.queryAllHive()
    },
    showToast(msg) {
      this.$layer.msg(msg);
    },
    showMessage(msg, type) {
      this.$message({ message: msg, type: type });
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
    startAdd() {
      this.isInsert = true
      this.hiveInfo = this.$toolUtil.copyDeep(this.hiveInfoTemp)
      this.isShowDialogInsert = true
      this.resetForm()
    },
    startUpdate(row) {
      this.isInsert = false
      this.hiveInfo = this.$toolUtil.copyDeep(row)
      this.isShowDialogInsert = true
      this.resetForm()
    },
    resetForm() {
      this.$refs['hiveInfo'].resetFields()
    },
    async deleteHive(row) {
      this.$confirm("确定删除停机坪 [ " + row.hiveName + " ] ?", "警告",
        {
          confirmButtonText: "确定删除",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.loading = true
          try {
            return this.$store
              .dispatch('hive/deleteHive', { hiveId: row.hiveId })
              .then((response) => {
                this.loading = false;
                const { code, message } = response;
                if (code === 1) {
                  const index = this.hivesInfo.findIndex(
                    (item) => {
                      return item.hiveId === row.hiveId;
                    }
                  );
                  if (index >= 0) {
                    this.hivesInfo.splice(index, 1);
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
    cancelUpdateHive() {
      this.isShowDialogInsert = false
    },
    beforeUpdateHive(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateHive()
        } else {
          return false
        }
      })
    },
    async updateHive() {
      this.loadingUpdateInsert = true
      const parms = {
        hiveId: this.hiveInfo.hiveId,
        hiveName: this.hiveInfo.hiveName,
        hiveDes: this.hiveInfo.hiveDes,
        hiveAddress: this.hiveInfo.hiveAddress,
        hiveCreateDate: this.hiveInfo.hiveCreateDate,
        hiveInstallDate: this.hiveInfo.hiveInstallDate,
        hiveLat: this.hiveInfo.hiveLat,
        hiveLng: this.hiveInfo.hiveLng,
        hiveAltabs: this.hiveInfo.hiveAltabs,
        hiveInstall: this.hiveInfo.hiveInstall === true ? 1 : 0,
        hiveStatus: 0
      }
      let url = "hive/updateHive";
      if (this.isInsert) {
        url = "hive/addHive";
      }
      await this.$store
        .dispatch(url, parms)
        .then((response) => {
          this.loadingUpdateInsert = false;
          const { code, message, data } = response;
          if (code === 1) {
            if (this.isInsert) {
              this.hivesInfo.unshift(data)
            } else {
              const index = this.hivesInfo.findIndex((item) => {
                return item.hiveId === data.hiveId
              }
              )
              if (index >= 0) {
                this.hivesInfo.splice(index, 1, data)
              }
            }
            this.showToast(message)
            this.isShowDialogInsert = false
          } else {
            this.showMessage(message, "warning");
          }
        })
        .catch((error) => {
          this.loadingUpdateInsert = false;
          this.showMessage(error, "error");
        });
    },
    // 查询所有公司
    async queryAllHive() {
      this.loading = true;
      this.hivesInfo = [];
      try {
        await this.$store
          .dispatch('hive/queryAllHive')
          .then((response) => {
            this.loading = false;
            const { code, message, data } = response;
            if (code === 1) {
              this.hivesInfo = data;
              // for (let i = 0; i < 5; i++) {
              //   for (let index = 0; index < data.length; index++) {
              //     this.hivesInfo.push(data[index])
              //   }
              // }
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
