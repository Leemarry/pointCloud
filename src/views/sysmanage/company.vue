<template>
  <el-container>
    <el-header height="40px">
      <el-button type="primary" @click="startAdd" size="mini">新增公司信息</el-button>
      
    </el-header>
    <el-main>
      <el-table v-loading="loading" :data="companysInfo" style="width: 100%" height="100%" empty-text="无公司信息">
        <el-table-column type="index" width="50" />
       
        <el-table-column label="logo" width="80">
          <template slot-scope="props">
            <el-image style="width: 25px; height: 25px" :src="props.row.clogoIco +'?'+ Date.now()">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" style="font-size: 25px;" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="cName" label="公司简称">
        </el-table-column>
        <el-table-column prop="cNameZh" label="公司名称">
        </el-table-column>
        <!-- <el-table-column prop="efSysteminfo.sysNameZh" label="系统名称">
        </el-table-column> -->
        <el-table-column prop="cPhone" label="手机">
        </el-table-column>
        <el-table-column prop="cAddress" label="地址">
        </el-table-column>
        <el-table-column prop="cLimitDate" label="到期时间">
          <template slot-scope="props">
            {{ getLimitDateStr(props.row.cLimitDate) }}
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

    <!-- 新增 -->
    <el-drawer title="公司信息" :visible.sync="isShowDialogInsert" :with-header="true">
      <el-scrollbar wrap-style="overflow-x:hidden" style="width: 100%; height:100%;">
        <el-form label-width="140px" label-position="left" :model="companyInfo" style="margin:10px" size="mini" v-loading="loadingUpdateInsert">
          <el-form-item label="英文名称">
            <el-input v-model="companyInfo.cName"></el-input>
          </el-form-item>
          <el-form-item label="中文名称">
            <el-input v-model="companyInfo.cNameZh"></el-input>
          </el-form-item>
          <el-form-item label="公司主页">
            <el-input v-model="companyInfo.cHomePage"></el-input>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="companyInfo.cTelephone"></el-input>
          </el-form-item>
          <el-form-item label="手机">
            <el-input v-model="companyInfo.cPhone"></el-input>
          </el-form-item>
          <!-- logo图片 -->
          <el-form-item label="公司LOGO">
            <el-image :src="companyInfo.cLogoIco" style="width:250px;height:100px" fit="scale-down">
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" style="font-size: 100px;" />
              </div>
            </el-image>
          </el-form-item>
          <!--  -->
          <el-form-item>
            <el-upload class="upload-demo" action="#" :multiple="false" :on-change="handleChangeLogo" :auto-upload="false" :file-list="fileListLogo">
              <el-button slot="trigger" size="mini">选择图片</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <!--  cHomePage-->
          <el-form-item v-if="companyInfo.efSysteminfo!==undefined" label="系统英文名称">
            <el-input v-model="companyInfo.efSysteminfo.sysName"></el-input>
          </el-form-item>
          <el-form-item v-if="companyInfo.efSysteminfo!==undefined" label="系统中文名称">
            <el-input v-model="companyInfo.efSysteminfo.sysNameZh"></el-input>
          </el-form-item>
          <el-form-item v-if="companyInfo.efSysteminfo!==undefined" label="系统描述说明">
            <el-input v-model="companyInfo.efSysteminfo.sysInfo"></el-input>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="companyInfo.cAddress"></el-input>
          </el-form-item>
          <el-form-item label="到期时间">
            <el-date-picker type="date" placeholder="为空则表示立即过期" v-model="companyInfo.cLimitDate" style="width: 100%;" value-format="timestamp"></el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="是否可操作无人机" prop="delivery">
            <el-switch v-model="companyInfo.climitUav" :active-value="0" :inactive-value="-1"></el-switch>
          </el-form-item>
          <el-form-item label="是否可操作停机坪" prop="delivery">
            <el-switch v-model="companyInfo.climitHive" :active-value="0" :inactive-value="-1"></el-switch>
          </el-form-item> -->
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
import { parseTime, filtersType } from "@/utils/index";
export default {
  name: "Company",
  data() {
    return {
      loading: false,
      loadingUpdateInsert: false,
      isShowDialogInsert: false,
      isInsert: 999,
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
        "cLimitUav": -1,
        "cNameZh": "",
        "cPhone": "",
        "cLimitDate": null,
        "cLogoIco": "",
        "cTelephone": "",
        "cParentId": 0,
        "cCreateDate": 0,
        "cAddress": "",
        "cLimitHive": -1,
        "csystemId": 1,
        "cName": ""
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

    // :on-change="handleChangeLogo"
    handleChangeLogo(file, fileList) {
      this.fileListLogo = [];
      if (this.beforeUpload(file.raw)) {
        this.fileListLogo.push(file);
        this.companyInfo.clogoIco = URL.createObjectURL(file.raw);
      }
    },
    // 规则校验
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
    //点击新增--isInsert = true
    startAdd() {
      this.isInsert = true;
      this.fileListLogo = [];
      this.companyInfo = {};
      this.companyInfo = this.$toolUtil.copyDeep(this.companyInfoTemp)
      this.isShowDialogInsert = true
    },
    //点击编辑--isInsert = false
    startUpdate(row) {
      this.isInsert = false;
      this.fileListLogo = [];
      console.log(row);
      this.companyInfo = this.$toolUtil.copyDeep(row);
      if(row.efSysteminfo==null){
      this.companyInfo.efSysteminfo = {
        sysName: '',
        sysNameZh: '',
        sysInfo: '',
      }
    }
      this.isShowDialogInsert = true;
    },
    
    async deleteCompany(row) {
      console.log("123333333333");
      console.log(row);
      // {companyId: row.id,  }
      this.$confirm(
        "确定删除 [ " +
        row.cNameZh +
        " ] 的全部信息吗? 删除后无法恢复,是否继续?",
        "警告",
        {
          confirmButtonText: "确定删除",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        let formdata= new FormData()
formdata.append("companyId",row.id)

          this.loading = true;
          try {
            return this.$store
              .dispatch("efCompany/deleteCompany",formdata)
              .then((response) => {
                this.loading = false;
                const { code, message } = response;
                if (code === 1) {
                  // 
                  const index = this.companysInfo.findIndex(
                    (item) => {
                      return item.id === row.id;
                    }
                  );
                  if (index >= 0) {
                    this.companysInfo.splice(index, 1);
                  }
                  // 
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

//关闭
    cancelUpdateCompany() {
      this.isShowDialogInsert = false;
    },
// 确认提交
    async updateCompany(row) {
      
      this.loadingUpdateInsert = true;
      let imageBase64 = null;
      if (this.fileListLogo.length > 0) {
        await this.$toolUtil
          .convertImageToBase64(this.fileListLogo[0].raw)
          .then((file) => {
            imageBase64 = file;
          })
          .catch((error) => {
            imageBase64 = null;
            this.showMessage("图片转换失败: " + error, "warning");
          });
      }
      // debugger
      const parms = {
        id: this.companyInfo.id,
        cName:this.companyInfo.cName,
        cNameZh:this.companyInfo.cNameZh,
        cHomePage:this.companyInfo.cHomePage,
        cAddress:this.companyInfo.cAddress,
        cPhone:this.companyInfo.cPhone,
        cTelephone:this.companyInfo.cTelephone,
        cLimitDate:this.companyInfo.cLimitDate,
        cSystemId:this.companyInfo.cSystemId,
        efSysteminfo:{
          sysName:this.companyInfo.efSysteminfo.sysName,
          sysNameZh:this.companyInfo.efSysteminfo.sysNameZh,
          sysInfo:this.companyInfo.efSysteminfo.sysInfo,
        },
        cLimitUavCount:0,
        cLimitHiveCount:0
      };
      if (imageBase64 !== null) {
        parms.cLogoIco = imageBase64;
      }
console.log('----------------');
      console.log(parms);
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

      //常用工具函数*****************************************
        //格式化
        parseTime(cellValue) {
            if (
                cellValue == null ||
                cellValue == undefined ||
                cellValue == ""
            ) {
                return cellValue;
            }
            return parseTime(cellValue);
        },
        filtersType(cellValue) {
            if (
                cellValue == null ||
                cellValue == undefined ||
                cellValue == ""
            ) {
                return cellValue;
            }
            return filtersType(cellValue);
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
