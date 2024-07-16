<template>
  <el-container>
    <el-header height="40px" v-show="false">
      <el-button type="primary" @click="startAdd" size="mini">新增无人机厂商</el-button>
    </el-header>
    <el-main>
      <el-table v-loading="loading" :data="uavFactorysInfo" style="width: 100%" height="100%" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" empty-text="暂无无人机厂商信息">
        <el-table-column type="index" width="50" />
        <el-table-column prop="pname" label="厂家">
        </el-table-column>
        <el-table-column prop="pphone" label="联系方式">
        </el-table-column>
        <!-- <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click="deleteUavFactory(scope.row)" type="text" size="small">删除</el-button>
            <el-button type="text" size="small" @click="startUpdate(scope.row)">编辑</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </el-main>

    <el-drawer title="厂商" :visible.sync="isShowDialogInsert" :with-header="true">
      <el-form label-width="140px" label-position="left" :model="factoryInfo" style="margin:10px" size="mini" v-loading="loadingUpdateInsert">
        <!-- <el-form-item label="编号">
          <el-input v-model="factoryInfo.id"></el-input>
        </el-form-item> -->
        <el-form-item label="厂家">
          <el-input v-model="factoryInfo.pname"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="factoryInfo.pphone"></el-input>
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
  name: "Company",
  data() {
    return {
      loading: false,
      loadingUpdateInsert: false,
      isShowDialogInsert: false,
      isInsert: true,
      uavFactorysInfo: [],
      factoryInfo: {},
      factoryInfoTemp: {
        id: null,
        pname: '',
        pphone: '',
        pback: ''
      },
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
      await this.queryAll();
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
      this.isInsert = true;
      this.factoryInfo = {};
      // this.factoryInfo.efSysteminfo = {
      //   sysName: '',
      //   sysNameZh: '',
      //   sysInfo: '',
      // };
      this.factoryInfo = this.$toolUtil.copyDeep(this.factoryInfoTemp)
      this.isShowDialogInsert = true
    },
    startUpdate(row) {
      this.isInsert = false;
      this.factoryInfo = this.$toolUtil.copyDeep(row);
      this.isShowDialogInsert = true;
    },
    async deleteUavFactory(row) {
      this.$confirm("确定删除厂商 [ " + row.pname + " ] ?", "警告", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        type: "warning",
      }
      )
        .then(() => {
          this.loading = true;
          try {
            return this.$store
              .dispatch("efCompany/deleteUavFactory", {
                id: row.id,
                sysId: row.csystemId,
              })
              .then((response) => {
                this.loading = false;
                const { code, message } = response;
                if (code === 1) {
                  const index = this.uavFactorysInfo.findIndex(
                    (item) => {
                      return item.id === row.id;
                    }
                  );
                  if (index >= 0) {
                    this.uavFactorysInfo.splice(index, 1);
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
      const parms = {
        id: this.factoryInfo.id,
        cName: this.factoryInfo.cname,
        cNameZh: this.factoryInfo.cnameZh,
        cAddress: this.factoryInfo.caddress,
        cPhone: this.factoryInfo.cphone,
        cTelephone: this.factoryInfo.ctelephone,
        cLimitUav: this.factoryInfo.climitUav,
        cLimitHive: this.factoryInfo.climitHive,
        cLimitDate: this.factoryInfo.climitDate,
        sysName: this.factoryInfo.efSysteminfo.sysName,
        sysNameZh: this.factoryInfo.efSysteminfo.sysNameZh,
        sysInfo: this.factoryInfo.efSysteminfo.sysInfo,
        csystemId: this.factoryInfo.csystemId,
      };
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
              this.uavFactorysInfo.unshift(data);
            } else {
              const index = this.uavFactorysInfo.findIndex(
                (item) => {
                  return item.id === data.id;
                }
              );
              if (index >= 0) {
                this.uavFactorysInfo.splice(index, 1, data);
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
    // 查询所有公司
    async queryAll() {
      this.loading = true;
      this.uavFactorysInfo = [];
      try {
        await this.$store
          .dispatch('efFactory/queryAll')
          .then((response) => {
            this.loading = false;
            const { code, message, data } = response;
            if (code === 1) {
              this.uavFactorysInfo = data;
              // for (let i = 0; i < 5; i++) {
              //   for (let index = 0; index < data.length; index++) {
              //     this.uavFactorysInfo.push(data[index])
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
