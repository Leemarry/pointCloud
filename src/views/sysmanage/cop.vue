<template>
    <el-container>
      <el-header height="40px">
        <el-button type="primary" @click="startAdd" size="mini">新增公司信息</el-button>
      </el-header>
      <el-main>
        <el-table v-loading="loading" :data="companysInfo" style="width: 100%" height="100%" empty-text="无公司信息">
          <el-table-column type="index" width="50" />
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" size="mini">
                <el-form-item label="联系方式">
                  <span>{{ props.row.ctelephone }}</span>
                </el-form-item>
                <el-form-item label="公司官网">
                  <span>{{ props.row.chomePage }}</span>
                </el-form-item>
                <el-form-item label="是否可操作无人机">
                  <span>{{ props.row.climitUav=== 0 ? "可操作" : "不可操作" }}</span>
                </el-form-item>
                <el-form-item label="是否可操作停机坪">
                  <span>{{ props.row.climitHive=== 0 ? "可操作" : "不可操作" }}</span>
                </el-form-item>
                <el-form-item label="系统英文名称">
                  <span>{{ props.row.efSysteminfo.sysName }}</span>
                </el-form-item>
                <el-form-item label="系统描述说明">
                  <span>{{ props.row.efSysteminfo.sysInfo }}</span>
                </el-form-item>
                <el-form-item label="创建日期">
                  <!-- {{ $dateUtil.convertMillSecToDateStr(props.row.ccreateDate) }} -->
                  <span> {{ parseTime(props.row.ccreateDate) }} </span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="id" label="编号" width="80">
          </el-table-column> -->
          <el-table-column label="logo" width="80">
            <template slot-scope="props">
              <el-image style="width: 25px; height: 25px" :src="props.row.clogoIco +'?'+ Date.now()">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" style="font-size: 25px;" />
                </div>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column prop="cname" label="公司简称">
          </el-table-column>
          <el-table-column prop="cnameZh" label="公司名称">
          </el-table-column>
          <el-table-column prop="efSysteminfo.sysNameZh" label="系统名称">
          </el-table-column>
          <el-table-column prop="cphone" label="手机">
          </el-table-column>
          <el-table-column prop="caddress" label="地址">
          </el-table-column>
          <el-table-column prop="climitDate" label="到期时间">
            <template slot-scope="props">
              {{ getLimitDateStr(props.row.climitDate) }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <el-button @click="deleteCompany(scope.row)" type="text" size="small">删除</el-button>
              <el-button type="text" size="small" @click="startUpdate(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
  
      <el-drawer title="公司信息" :visible.sync="isShowDialogInsert" :with-header="true">
        <el-scrollbar wrap-style="overflow-x:hidden" style="width: 100%; height:100%;">
          <el-form label-width="140px" label-position="left" :model="companyInfo" style="margin:10px" size="mini" v-loading="loadingUpdateInsert">
            <el-form-item label="英文名称">
              <el-input v-model="companyInfo.cname"></el-input>
            </el-form-item>
            <el-form-item label="中文名称">
              <el-input v-model="companyInfo.cnameZh"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="companyInfo.ctelephone"></el-input>
            </el-form-item>
            <el-form-item label="手机">
              <el-input v-model="companyInfo.cphone"></el-input>
            </el-form-item>
            <el-form-item label="公司LOGO">
              <el-image :src="companyInfo.clogoIco" style="width:250px;height:100px" fit="scale-down">
                <div slot="placeholder" class="image-slot">
                  加载中<span class="dot">...</span>
                </div>
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" style="font-size: 100px;" />
                </div>
              </el-image>
            </el-form-item>
            <el-form-item>
              <el-upload class="upload-demo" action="#" :multiple="false" :on-change="handleChangeLogo" :auto-upload="false" :file-list="fileListLogo">
                <el-button slot="trigger" size="mini">选择图片</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
            <el-form-item v-if="companyInfo.efSysteminfo!==undefined" @input="$forceUpdate()" label="系统英文名称">
              <el-input v-model="companyInfo.efSysteminfo.sysName"></el-input>
            </el-form-item>
            <el-form-item v-if="companyInfo.efSysteminfo!==undefined" label="系统中文名称">
              <el-input v-model="companyInfo.efSysteminfo.sysNameZh"></el-input>
            </el-form-item>
            <el-form-item v-if="companyInfo.efSysteminfo!==undefined" label="系统描述说明">
              <el-input v-model="companyInfo.efSysteminfo.sysInfo"></el-input>
            </el-form-item>
            <el-form-item label="地址">
              <el-input v-model="companyInfo.caddress"></el-input>
            </el-form-item>
            <el-form-item label="到期时间">
              <el-date-picker type="date" placeholder="为空则表示立即过期" v-model="companyInfo.climitDate" style="width: 100%;" value-format="timestamp"></el-date-picker>
            </el-form-item>
            <el-form-item label="是否可操作无人机" prop="delivery">
              <el-switch v-model="companyInfo.climitUav" :active-value="0" :inactive-value="-1"></el-switch>
            </el-form-item>
            <el-form-item label="是否可操作停机坪" prop="delivery">
              <el-switch v-model="companyInfo.climitHive" :active-value="0" :inactive-value="-1"></el-switch>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateCompany('ruleForm')">保存</el-button>
              <el-button @click="cancelUpdateCompany()">取消</el-button>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </el-drawer>


       <el-drawer title="公司信息" :visible.sync="isShowDialogupadte" :with-header="true">
        <el-scrollbar wrap-style="overflow-x:hidden" style="width: 100%; height:100%;">
          <el-form label-width="140px" label-position="left" :model="companyIn" style="margin:10px" size="mini" v-loading="loadingUpdateInsert">
            <el-form-item label="英文名称">
              <el-input v-model="companyIn.cname"></el-input>
            </el-form-item>
            <el-form-item label="中文名称">
              <el-input v-model="companyIn.cnameZh"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="companyIn.ctelephone"></el-input>
            </el-form-item>
            <el-form-item label="手机">
              <el-input v-model="companyIn.cphone"></el-input>
            </el-form-item>
            <el-form-item label="公司LOGO">
              <el-image :src="companyIn.clogoIco" style="width:250px;height:100px" fit="scale-down">
                <div slot="placeholder" class="image-slot">
                  加载中<span class="dot">...</span>
                </div>
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" style="font-size: 100px;" />
                </div>
              </el-image>
            </el-form-item>
            <el-form-item>
              <el-upload class="upload-demo" action="#" :multiple="false" :on-change="handleChangeLogo" :auto-upload="false" :file-list="fileListLogo">
                <el-button slot="trigger" size="mini">选择图片</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
            <el-form-item  @input="$forceUpdate()" label="系统英文名称">
              <el-input v-model="companyInfo.efSysteminfo.sysName"></el-input>
            </el-form-item>
            <el-form-item  label="系统中文名称">
              <el-input v-model="companyInfo.efSysteminfo.sysNameZh"></el-input>
            </el-form-item>
            <el-form-item  label="系统描述说明">
              <el-input v-model="companyInfo.efSystemin.sysInfo"></el-input>
            </el-form-item>
            <el-form-item label="地址">
              <el-input v-model="companyIn.caddress"></el-input>
            </el-form-item>
            <el-form-item label="到期时间">
              <el-date-picker type="date" placeholder="为空则表示立即过期" v-model="companyIn.climitDate" style="width: 100%;" value-format="timestamp"></el-date-picker>
            </el-form-item>
            <el-form-item label="是否可操作无人机" prop="delivery">
              <el-switch v-model="companyIn.climitUav" :active-value="0" :inactive-value="-1"></el-switch>
            </el-form-item>
            <el-form-item label="是否可操作停机坪" prop="delivery">
              <el-switch v-model="companyIn.climitHive" :active-value="0" :inactive-value="-1"></el-switch>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateCompany('ruleForm')">保存</el-button>
              <el-button @click="cancelUpdateCompany()">取消</el-button>
            </el-form-item>
          </el-form>
        </el-scrollbar>
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
        companysInfo: [],
        companyInfo: {},
        companyInfoTemp: {
          "id": '',
          "cHomePage": null,
          "efSysteminfo": {
            "id": "0",
            "sysName": "",
            "sysNameZh": "",
            "sysIco": "",
            "sysInfo": "",
            "sysCreateDate": 0
          },
          "climitUav": -1,
          "cnameZh": "",
          "cphone": "",
          "climitDate": null,
          "clogoIco": "",
          "ctelephone": "",
          "cparentId": 0,
          "ccreateDate": 0,
          "caddress": "",
          "climitHive": -1,
          "csystemId": 1,
          "cname": ""
        },
        fileListLogo: [],
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
        await this.queryAllCompany();
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
      handleChangeLogo(file, fileList) {
        this.fileListLogo = [];
        if (this.beforeUpload(file.raw)) {
          this.fileListLogo.push(file);
          this.companyInfo.clogoIco = URL.createObjectURL(file.raw);
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
      startAdd() {
        this.isInsert = true;
        this.fileListLogo = [];
        this.companyInfo = {};
        // this.companyInfo.efSysteminfo = {
        //   sysName: '',
        //   sysNameZh: '',
        //   sysInfo: '',
        // };
        this.companyInfo = this.$toolUtil.copyDeep(this.companyInfoTemp)
        this.isShowDialogInsert = true
      },
      startUpdate(row) {
        this.isInsert = false;
        this.fileListLogo = [];
        this.companyInfo = this.$toolUtil.copyDeep(row);
        this.isShowDialogInsert = true;
      },
      async deleteCompany(row) {
        this.$confirm(
          "确定删除 [ " +
          row.cnameZh +
          " ] 的全部信息吗? 删除后无法恢复,是否继续?",
          "警告",
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
                .dispatch("efCompany/deleteCompany", {
                  id: row.id,
                  sysId: row.csystemId,
                })
                .then((response) => {
                  this.loading = false;
                  const { code, message } = response;
                  if (code === 1) {
                    const index = this.companysInfo.findIndex(
                      (item) => {
                        return item.id === row.id;
                      }
                    );
                    if (index >= 0) {
                      this.companysInfo.splice(index, 1);
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
        if (this.fileListLogo.length > 0) {
          await this.$toolUtil
            .convertImageToBase64(this.fileListLogo[0].raw)
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
          id: this.companyInfo.id,
          cName: this.companyInfo.cname,
          cNameZh: this.companyInfo.cnameZh,
          cAddress: this.companyInfo.caddress,
          cPhone: this.companyInfo.cphone,
          cTelephone: this.companyInfo.ctelephone,
          cLimitUav: this.companyInfo.climitUav,
          cLimitHive: this.companyInfo.climitHive,
          cLimitDate: this.companyInfo.climitDate,
          sysName: this.companyInfo.efSysteminfo.sysName,
          sysNameZh: this.companyInfo.efSysteminfo.sysNameZh,
          sysInfo: this.companyInfo.efSysteminfo.sysInfo,
          csystemId: this.companyInfo.csystemId,
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
                this.companysInfo.unshift(data);
              } else {
                const index = this.companysInfo.findIndex(
                  (item) => {
                    return item.id === data.id;
                  }
                );
                if (index >= 0) {
                  this.companysInfo.splice(index, 1, data);
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
      async queryAllCompany() {
        this.loading = true;
        this.companysInfo = [];
        try {
          await this.$store
            .dispatch("efCompany/queryAllCompany")
            .then((response) => {
              this.loading = false;
              const { code, message, data } = response;
              if (code === 1) {
                this.companysInfo = data;
                // for (let i = 0; i < 5; i++) {
                //   for (let index = 0; index < data.length; index++) {
                //     this.companysInfo.push(data[index])
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
  