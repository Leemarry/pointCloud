<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <el-image :src="avatar+'?'+Date.now()" class="user-avatar">
            <div slot="error" class="image-slot">
              <!-- <i class="el-icon-picture-outline-round" style="font-size: 40px;"></i> -->
              <i class="el-icon-user-solid" style="font-size: 40px;"></i>
            </div>
          </el-image>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <a target="_blank">
            <el-dropdown-item icon="el-icon-user" @click.native="showMyInfo">个人中心</el-dropdown-item>
          </a>
          <a target="_blank">
            <el-dropdown-item icon="el-icon-shopping-bag-2" @click.native="showCommpanyInfo">公司信息</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <!-- <i class="el-icon-switch-button"></i> -->
            <span class="el-icon-switch-button"> 注销登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="right-menu-name">
      <table>
        <tr>
          <td>
            <span style="font-size:13px">{{ getCommanyName() }}</span>
          </td>
        </tr>
        <tr>
          <td>
            <span style="font-size:13px;font-weight:bold;cursor: pointer" @click="showMyInfo()">{{ name }} [ {{ getRoleName() }} ]</span>
          </td>
        </tr>
      </table>
    </div>
    <!-- <div class="right-menu-name">
      <h6>欢迎您:</h6>
    </div> -->
    <!-- <el-drawer title="聊天室" :visible.sync="isShowChatroom" :direction="direction" :before-close="handleCloseChatroom">
      <span>我来啦!</span>
    </el-drawer> -->
    <el-drawer title="我的信息" :visible.sync="isShowMyInfo" :direction="direction" :before-close="handleCloseMyInfo" size="400px">
      <el-scrollbar wrap-style="overflow-x:hidden" style="width: 100%; height:100%;padding:10px">
        <el-form v-if="userInfoTemp!==null" ref="userInfoTemp" :model="userInfoTemp" label-width="100px" label-position="left" size="mini" style="height:auto">
          <el-form-item label="姓名" prop="uname">
            <el-input v-model="userInfoTemp.uname" />
          </el-form-item>
          <el-form-item label="登录名">
            {{ userInfoTemp.uloginName }}
          </el-form-item>
          <el-form-item label="登录密码">
            <el-link type="primary" @click="showUpdatePwdDialog()">修改密码</el-link>
            {{ isSetPassword?"已暂存新密码,保存后生效":"" }}
          </el-form-item>
          <el-form-item label="头像">
            <el-image :src="userInfoTemp.uico" style="width:100px;height:100px" fit="scale-down">
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
              <div slot="error" class="image-slot">
                <i class="el-icon-user-solid" style="font-size: 100px;"></i>
              </div>
            </el-image>
          </el-form-item>
          <el-form-item>
            <el-upload class="upload-demo" action="#" :multiple="false" :on-change="handleChangeIco" :auto-upload="false" :file-list="fileListIco">
              <el-button slot="trigger" size="mini">选择头像</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input v-model="userInfoTemp.uage"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="userInfoTemp.usex" size="small" fill="#409EFF">
              <el-radio-button :label="true">男</el-radio-button>
              <el-radio-button :label="false">女</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="userInfoTemp.uphone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userInfoTemp.uemail"></el-input>
          </el-form-item>
          <el-form-item label="描述信息">
            <el-input v-model="userInfoTemp.udescription"></el-input>
          </el-form-item>
          <el-form-item label="到期时间">
            {{$dateUtil.convertMillSecToYYYYMMDD(userInfoTemp.ulimitDate)}}
          </el-form-item>
          <el-form-item size="large">
            <el-button type="primary" @click="saveMyInfo()">保存修改</el-button>
            <el-button @click="isShowMyInfo=false;isSetPassword=false">关闭</el-button>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-drawer>
    <el-dialog title="设置新密码" :visible.sync="isShowDialogSetPwd" width="400px">
      <el-form :model="formNewPwd">
        <el-form-item label="请输入新密码" :label-width="formLabelWidthSetPwd">
          <el-input v-model="formNewPwd.newPwd1" placeholder="请输入密码" show-password autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="请确认新密码" :label-width="formLabelWidthSetPwd">
          <el-input v-model="formNewPwd.newPwd2" placeholder="请确认密码" show-password autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowDialogSetPwd = false">取 消</el-button>
        <el-button type="primary" @click="saveUpdatePwd()">确 定</el-button>
      </span>
    </el-dialog>
    <el-drawer title="我的公司" :visible.sync="isShowCommpanyInfo" :direction="direction" :before-close="handleCloseCommpanyInfo" size="500px">
      <el-scrollbar wrap-style="overflow-x:hidden" style="width: 100%; height:100%;padding:10px">
        <el-form v-if="companyInfoTemp!==null" v-loading="loadingUpdateCompany" ref="companyInfoTemp" :model="companyInfoTemp" label-width="150px" label-position="left" size="mini" style="">
          <el-form-item label="名称">
            <el-input v-model="companyInfoTemp.cname"></el-input>
          </el-form-item>
          <el-form-item label="中文名">
            <el-input v-model="companyInfoTemp.cnameZh"></el-input>
          </el-form-item>
          <el-form-item label="公司LOGO">
            <el-image :src="companyInfoTemp.clogoIco" style="width:250px;height:100px" fit="scale-down">
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
              <div slot="error" class="image-slot">
                <!-- <i class="el-icon-picture-outline" /> -->
                <i class="el-icon-picture-outline" style="font-size: 40px"></i>
              </div>
            </el-image>
          </el-form-item>
          <el-form-item v-show="getIsRole()">
            <el-upload class="upload-demo" action="#" :multiple="false" :on-change="handleChangeLogo" :auto-upload="false" :file-list="fileListLogo">
              <el-button slot="trigger" size="mini">选择图片</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input v-model="companyInfoTemp.ctelephone"></el-input>
          </el-form-item>
          <el-form-item v-if="companyInfoTemp.efSysteminfo!==undefined" @input="$forceUpdate()" label="系统英文名称">
            <el-input v-model="companyInfoTemp.efSysteminfo.sysName"></el-input>
          </el-form-item>
          <el-form-item v-if="companyInfoTemp.efSysteminfo!==undefined" label="系统中文名称">
            <el-input v-model="companyInfoTemp.efSysteminfo.sysNameZh"></el-input>
          </el-form-item>
          <el-form-item v-if="companyInfoTemp.efSysteminfo!==undefined" label="系统描述说明">
            <el-input v-model="companyInfoTemp.efSysteminfo.sysInfo"></el-input>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="companyInfoTemp.caddress"></el-input>
          </el-form-item>
          <!-- <el-form-item label="是否可操作无人机" prop="delivery">
            <el-switch :disabled="!getIsRole()" v-model="companyInfoTemp.climitUav" :active-value="0" :inactive-value="-1"></el-switch>
          </el-form-item>
          <el-form-item label="是否可操作停机坪" prop="delivery">
            <el-switch :disabled="!getIsRole()" v-model="companyInfoTemp.climitHive" :active-value="0" :inactive-value="-1"></el-switch>
          </el-form-item> -->
          <el-form-item label="创建日期">
            {{$dateUtil.convertMillSecToYYYYMMDD(companyInfoTemp.ccreateDate)}}
          </el-form-item>
          <el-form-item label="到期时间">
            {{ getLimitDateStr(companyInfoTemp.climitDate) }}
          </el-form-item>
          <el-form-item size="large">
            <el-button v-show="getIsRole()" type="primary" @click="saveCompanyInfo()">保存修改</el-button>
            <el-button @click="isShowCommpanyInfo=false">关闭</el-button>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";
import md5 from "js-md5";

export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  data() {
    return {
      isShowChatroom: false,
      isShowMyInfo: false,
      isSetPassword: false,
      isShowDialogSetPwd: false,
      formLabelWidthSetPwd: "100px",
      loadingUpdateCompany: false,
      isShowCommpanyInfo: false,
      direction: "rtl",
      userInfoTemp: null,
      companyInfoTemp: null,
      fileListIco: [],
      fileListLogo: [],
      formNewPwd: {
        oldPwd: "",
        newPwd1: "",
        newPwd2: "",
      },
    };
  },
  computed: {
    ...mapGetters([
      "sidebar",
      "avatar",
      "companyInfo",
      "userInfo",
      "roleInfo",
      "name",
    ]),
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.userInfoTemp = this.$toolUtil.copyDeep(this.userInfo);
      this.companyInfoTemp = this.$toolUtil.copyDeep(this.companyInfo);
      // this.companyInfoTemp.clogoIco += '?' + Date.now()
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
    showToast(msg) {
      this.$layer.msg(msg);
    },
    showMessage(msg, type) {
      this.$message({ message: msg, type: type });
    },
    // 选择头像
    choseImg(item) {
    },
    getIsRole() {
      if (this.roleInfo) {
        return this.roleInfo.roleId > 0 && this.roleInfo.roleId <= 3;
      } else {
        return false;
      }
    },
    showMyInfo() {
      this.fileListIco = [];
      this.userInfoTemp = this.$toolUtil.copyDeep(this.userInfo);
      if (this.userInfoTemp && this.userInfoTemp.uico) {
        this.userInfoTemp.uico + "?" + Date.now();
      }
      this.userInfoTemp.uloginPassword = ""
      this.isShowMyInfo = true
      this.isSetPassword = false
    },
    showCommpanyInfo() {
      this.fileListLogo = [];
      this.companyInfoTemp = this.$toolUtil.copyDeep(this.companyInfo);
      if (this.companyInfoTemp && this.companyInfoTemp.clogoIco) {
        this.companyInfoTemp.clogoIco + "?" + Date.now();
      }
      this.isShowCommpanyInfo = true;
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    getLimitOper(value) {
      let result = "不允许操作";
      if (value && value !== null) {
        if (value === 0) {
          result = "允许";
        }
      }
      return result;
    },
    getCommanyName() {
      let result = "";
      if (this.companyInfoTemp && this.companyInfoTemp !== null) {
        result = this.companyInfoTemp.cnameZh;
      }
      return result;
    },
    getRoleName() {
      let result = "";
      if (this.roleInfo && this.roleInfo !== null) {
        result += this.roleInfo.roleName;
      }
      return result;
    },
    handleChangeIco(file, fileList) {
      this.fileListIco = [];
      if (this.beforeUpload(file.raw)) {
        this.fileListIco.push(file);
        this.userInfoTemp.uico = URL.createObjectURL(file.raw);
      }
    },
    handleChangeLogo(file, fileList) {
      this.fileListLogo = [];
      if (this.beforeUpload(file.raw)) {
        this.fileListLogo.push(file);
        this.companyInfoTemp.clogoIco = URL.createObjectURL(file.raw);
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
    showUpdatePwdDialog() {
      this.formNewPwd.oldPwd = "";
      this.formNewPwd.newPwd1 = "";
      this.formNewPwd.newPwd2 = "";
      this.isShowDialogSetPwd = true;
    },
    saveUpdatePwd() {
      if (
        this.formNewPwd.newPwd1 === "" ||
        this.formNewPwd.newPwd2 === ""
      ) {
        this.$message({
          message: "请输入完整的密码!",
          type: "warning",
        });
      } else if (
        this.formNewPwd.newPwd1.length < 6 ||
        this.formNewPwd.newPwd2 < 6
      ) {
        this.$message({ message: "密码最少6位字符!", type: "warning" });
      } else if (this.formNewPwd.newPwd1 !== this.formNewPwd.newPwd2) {
        this.$message({
          message: "输入密码不一致,请重新输入!",
          type: "warning",
        });
      } else {
        this.userInfoTemp.uloginPassword = md5(this.formNewPwd.newPwd1);
        this.isSetPassword = true
        this.isShowDialogSetPwd = false
      }
    },
    async saveMyInfo() {
      let imageBase64 = null;
      if (this.fileListIco.length > 0) {
        await this.$toolUtil
          .convertImageToBase64(this.fileListIco[0].raw)
          .then((file) => {
            imageBase64 = file;
          })
          .catch(() => {
            imageBase64 = null;
          });
      }
      const param = {
        // id: this.userInfoTemp.id,
        // uName: this.userInfoTemp.uname,
        // uLoginPassword: this.userInfoTemp.uloginPassword,
        // uAge: this.userInfoTemp.uage,
        // uPhone: this.userInfoTemp.uphone,
        // uAddress: this.userInfoTemp.uaddress,
        // uEmail: this.userInfoTemp.uemail,
        // uSex: this.userInfoTemp.usex,

        id: this.userInfoTemp.id,
        uloginName: this.userInfoTemp.uloginName,
        uname: this.userInfoTemp.uname,
        uage: this.userInfoTemp.uage,
        uphone: this.userInfoTemp.uphone,
        uaddress: this.userInfoTemp.uaddress,
        uemail: this.userInfoTemp.uemail,
        usex: this.userInfoTemp.usex,
        udescription: this.userInfoTemp.udescription,
        ustatus: this.userInfoTemp.ustatus,
        urid: this.userInfoTemp.urid,
        ucid: this.userInfoTemp.ucid,
        uparentId: this.userInfoTemp.uparentId,
        ulimitUav: this.userInfoTemp.ulimitUav,
        ulimitHive: this.userInfoTemp.ulimitHive,
        ulimitDate: this.userInfoTemp.ulimitDate,
      };
      if (imageBase64 !== null) {
        param.uico = imageBase64
      }
      if (
        this.userInfoTemp.uloginPassword !== null &&
        this.userInfoTemp.uloginPassword !== ""
      ) {
        param.uloginPassword = this.userInfoTemp.uloginPassword;
      }
      await this.$store
        .dispatch('efUser/updateEfuser', param)
        .then((response) => {
          const { code, message } = response;
          if (code === 1) {
            this.isShowMyInfo = false
            this.$layer.msg(message)
            this.$store.commit('user/SET_NAME', this.userInfoTemp.uname)
            this.userInfo.uname = this.userInfoTemp.uname
            this.userInfo.uage = this.userInfoTemp.uage
            this.userInfo.uphone = this.userInfoTemp.uphone
            this.userInfo.uaddress = this.userInfoTemp.uaddress
            this.userInfo.uemail = this.userInfoTemp.uemail
            this.userInfo.usex = this.userInfoTemp.usex
            this.userInfo.udescription = this.userInfoTemp.udescription
            // this.$store.commit('user/SET_USER_INFO', param)
          } else {
            this.$message({ message: message, type: 'warning' });
          }
        })
        .catch((error) => {
          this.$message({ message: error, type: 'error' });
        });
    },
    async saveCompanyInfo() {
      let imageBase64 = null;
      if (this.fileListLogo.length > 0) {
        await this.$toolUtil
          .convertImageToBase64(this.fileListLogo[0].raw)
          .then((file) => {
            imageBase64 = file;
            // data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAwICQoJBwwKCQoNDAwOER0TERAQESMZGxUdKiUsKyklKCguNEI4LjE/MigoOk46P0R
            // if (file != null && file.length > 24) {
            //   imageBase64 = file.slice(23, file.length);
            // }
          })
          .catch(() => {
            imageBase64 = null;
          });
      }
      const param = {
        id: this.companyInfoTemp.id,
        cName: this.companyInfoTemp.cname,
        cNameZh: this.companyInfoTemp.cnameZh,
        cAddress: this.companyInfoTemp.caddress,
        cPhone: this.companyInfoTemp.cphone,
        cTelephone: this.companyInfoTemp.ctelephone,
        cSystemId: this.companyInfoTemp.csystemId,
        cParentId: this.companyInfoTemp.cparentId,
        cLimitUav: this.companyInfoTemp.climitUav,
        cLimitHive: this.companyInfoTemp.climitHive,
        cLimitDate: this.companyInfoTemp.climitDate,
        sysName: this.companyInfoTemp.efSysteminfo.sysName,
        sysNameZh: this.companyInfoTemp.efSysteminfo.sysNameZh,
        sysInfo: this.companyInfoTemp.efSysteminfo.sysInfo,
        csystemId: this.companyInfoTemp.csystemId,
      };
      if (imageBase64 !== null) {
        param.cLogoIco = imageBase64;
      }
      this.loadingUpdateCompany = true;
      await this.$store
        .dispatch("efCompany/updateCompany", param)
        .then((response) => {
          this.loadingUpdateCompany = false;
          const { code, message, data } = response;
          if (code === 1) {
            // const index = this.companysInfo.findIndex((item) => {
            //   return item.id === data.id
            // })
            // if (index >= 0) {
            //   this.companysInfo.splice(index, 1, data)
            // }
            this.$store.commit("user/SET_COMPANY_INFO", data);
            this.$store.commit(
              "user/SET_SYSTEM_INFO",
              data.efSysteminfo
            );
            this.isShowCommpanyInfo = false;
            this.showToast(
              message + " 部分信息需刷新页面或重新登录。"
            );
          } else {
            this.showMessage(message, "warning");
          }
        })
        .catch((error) => {
          this.loadingUpdateCompany = false;
          this.$message({ message: error, type: "error" });
        });
    },
    async logout() {
      this.$confirm("是否注销登录?", "提示", {
        confirmButtonText: "注销",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.logouting();
        })
        .catch(() => { });
    },
    async logouting() {
      // await this.$store.dispatch('user/logout')
      await this.$store
        .dispatch("user/logout")
        .then(() => {
          this.$router.push(`/login?` + Date.now());
        })
        .catch(() => {
          removeToken();
          resetRouter();
          this.$store.commit("user/RESET_STATE");
          this.$router.push(`/login?` + Date.now());
        });
    },
    showChatRoom() {
      this.isShowChatroom = true;
    },
    handleCloseChatroom(done) {
      this.$confirm("是否关闭聊天室面板？")
        .then((_) => {
          this.isShowChatroom = false;
        })
        .catch((_) => { });
    },
    handleCloseMyInfo(done) {
      this.isShowMyInfo = false;
    },

    handleCloseCommpanyInfo(done) {
      this.isShowCommpanyInfo = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }
  .right-menu-name {
    float: right;
    height: 100%;
    margin-right: 10px;
    line-height: 20px;
  }
  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
