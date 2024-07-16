<template>
  <el-container>
    <!-- <el-header height="50px">
      <h3>公司 - 管理员账户信息管理</h3>
    </el-header> -->
    <!-- <el-aside width="800px">
    </el-aside> -->
    <el-main>
      <el-table v-loading="loading" :data="companysBigManInfo" height="100%" empty-text="暂无公司信息">
        <el-table-column type="index" width="50" />
        <!-- <el-table-column prop="cid" label="编号" width="80">
        </el-table-column> -->
        <el-table-column prop="cName" label="公司" width="250">
        </el-table-column>
        <el-table-column label="管理员账号列表">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.users!==null" effect="dark" style="margin:5px" type="success" size="medium" v-for="admin in scope.row.users" closable @close="handelRemoveAdmin(admin)" @click="startShowLimit(admin)">{{ admin.uname +'('+ admin.uloginName+')' }}</el-tag>
            <el-tag style="margin:5px" type="danger" effect="dark" v-if="scope.row.users===null">未添加管理员账户</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column label="管理员账号列表">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top" v-for="(item i) in scope.row.users">
              <p>姓名: {{ item.uname }}</p>
              <p>管理员账号: {{ item.uloginName }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ item.uname }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column> -->
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="startAdd(scope.row)">新增</el-button>
            <el-button type="text" size="small" @click="startDelete(scope.row)">删除所有管理员</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-dialog title="到期时间" :visible.sync="isShowDialogUpdateDur" width="350px" :inline="false">
      <el-form label-position="left" size="mini" :model="userModelUupdateLimit" :inline="false" :rules="userModelUupdateLimitRules" ref="userModelUupdateLimit" v-loading="updateloading">
        <el-form-item label="管理员账号:" :label-width="formLabelWidthUpdate" prop="uloginName">
          {{ userModelUupdateLimit.uloginName }}
        </el-form-item>
        <el-form-item label="到期时间:" :label-width="formLabelWidthUpdate" prop="ulimitDate">
          <el-date-picker size="mini" type="date" placeholder="请设置到期日期" v-model="userModelUupdateLimit.ulimitDate" style="width:100%" value-format="timestamp"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="isShowDialogUpdateDur = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="beforeUpdateAdminDurTime('userModelUupdateLimit')">更新到期时间</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新增管理员账户信息" :visible.sync="isShowDialogInsert" width="380px">
      <el-form label-position="left" size="mini" :model="userModel" :inline="false" :rules="userModelRules" ref="userModel" v-loading="addloading">
        <el-form-item label="名称:" :label-width="formLabelWidth" prop="uname">
          <el-input style="width:180px" v-model="userModel.uname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="管理员账号:" :label-width="formLabelWidth" prop="uloginName">
          <el-input style="width:180px" v-model="userModel.uloginName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="请输入登录密码:" :label-width="formLabelWidth" prop="uloginPassword1">
          <el-input v-model="userModel.uloginPassword1" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="请确认登录密码:" :label-width="formLabelWidth" prop="uloginPassword2">
          <el-input v-model="userModel.uloginPassword2" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="到期时间:" :label-width="formLabelWidth" prop="ulimitDate">
          <el-date-picker size="mini" type="date" placeholder="请设置到期日期" v-model="userModel.ulimitDate" style="width:100%" value-format="timestamp"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowDialogInsert = false">取 消</el-button>
        <el-button type="primary" @click="beforeAddCompanyBigMan('userModel')">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import md5 from 'js-md5'

export default {
  name: 'Company',
  data() {
    return {
      loading: false,
      addloading: false,
      updateloading: false,
      formLabelWidth: '150px',
      formLabelWidthUpdate: '100px',
      isShowDialogInsert: false,
      isShowDialogUpdateDur: false,
      companysBigManInfo: [],
      companyInfo: [],
      userModelUupdateLimit: {
        companyId: 0,
        userId: -1,
        uname: '',
        uloginName: '',
        ulimitDate: Date.now()
      },
      userModel: {
        companyId: 0,
        uname: '',
        uloginName: '',
        uloginPassword1: '',
        uloginPassword2: '',
        ulimitDate: Date.now()
      },
      userModelUupdateLimitRules: {
        uloginName: [
          { required: true, message: '请输入管理员登录名', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        ulimitDate: [
          { required: true, message: '请设置到期日期', trigger: 'blur' }
        ]
      },
      userModelRules: {
        uname: [
          { required: true, message: '请输入管理员名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        uloginName: [
          { required: true, message: '请输入管理员登录名', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        uloginPassword1: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        uloginPassword2: [
          { required: true, message: '请确认登录密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        ulimitDate: [
          { required: true, message: '请设置到期日期', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    message() {
      return '你不能进入这个页面...'
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {

  },
  onDestroy() {

  },
  methods: {
    async init() {
      await this.queryAllBigMan()
    },
    showToast(msg) {
      this.$layer.msg(msg)
    },
    showMessage(msg, type) {
      this.$message({ message: msg, type: type })
    },
    startAdd(row) {
      this.companyInfo = this.$toolUtil.copyDeep(row)
      this.isShowDialogInsert = true
      this.userModel.companyId = row.cid
      this.userModel.ulimitDate = Date.now() + 366 * 24 * 60 * 60 * 1000 // 默认有效期，一年
    },
    startShowLimit(row) {
      this.userModelUupdateLimit.companyId = row.ucId
      this.userModelUupdateLimit.userId = row.id
      this.userModelUupdateLimit.uname = row.uname
      this.userModelUupdateLimit.uloginName = row.uloginName
      this.userModelUupdateLimit.ulimitDate = row.ulimitDate
      this.isShowDialogUpdateDur = true
    },
    startDelete(row) {
      this.$confirm('是否删除公司 [' + row.cName + '] 下的所有超管账户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteCompanyBigMan(true, row.cid)
      }).catch(() => {
      })
    },
    // 查询所有公司
    async queryAllBigMan() {
      this.loading = true
      this.companysBigManInfo = []
      try {
        await this.$store
          .dispatch('user/queryAllBigMan')
          .then((response) => {
            this.loading = false
            const { code, message, data } = response
            if (code === 1) {
              this.companysBigManInfo = data
              // for (let i = 0; i < 5; i++) {
              //   for (let index = 0; index < data.length; index++) {
              //     this.companysBigManInfo.push(data[index])
              //   }
              // }
            } else {
              this.showMessage(message, 'warning')
            }
          })
          .catch((error) => {
            this.loading = false
            this.showMessage(error, 'error')
          })
      } catch (error) {
        this.loading = false
      }
    },
    beforeUpdateAdminDurTime(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateAdminDurTime()
        } else {
          return false
        }
      })
    },
    beforeAddCompanyBigMan(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.userModel.uloginPassword1 !== this.userModel.uloginPassword2) {
            this.showMessage('输入密码不一致,请重新输入!', 'warning')
          } else {
            this.addCompanyBigMan()
          }
        } else {
          return false
        }
      })
    },
    async updateAdminDurTime() {
      this.updateloading = true
      try {
        const parms = {
          id: this.userModelUupdateLimit.userId,
          uLimitDate: this.userModelUupdateLimit.ulimitDate
        }
        await this.$store
          .dispatch('user/updateUserLimitTime', parms)
          .then((response) => {
            this.updateloading = false
            const { code, message } = response
            if (code === 1) {
              this.isShowDialogUpdateDur = false
              this.init()
              // const index = this.companysBigManInfo.findIndex((item) => { return item.cid === this.userModelUupdateLimit.companyId })
              // if (index >= 0) {
              //   let users = this.companysBigManInfo[index].users
              //   if (!users || users == null) {
              //     users = []
              //   } else {
              //     const indexUser = users.findIndex((item) => {
              //       return item.id === this.userModelUupdateLimit.userId
              //     })
              //     if (indexUser >= 0) {
              //       this.$set(users, 'ulimitDate', this.userModelUupdateLimit.ulimitDate)
              //     }
              //   }
              //   this.$set(this.companysBigManInfo[index], 'users', users)
              // }
              // this.isShowDialogUpdateDur = false
              // this.showToast(message)
            } else {
              this.showMessage(message, 'warning')
            }
          })
          .catch((error) => {
            this.updateloading = false
            this.showMessage(error, 'error')
          })
      } catch (error) {
        this.updateloading = false
        this.showMessage(error, 'error')
      }
    },
    async addCompanyBigMan() {
      this.addloading = true
      const parms = {
        ucId: this.userModel.companyId,
        uloginName: this.userModel.uloginName,
        uloginPassword: md5(this.userModel.uloginPassword1),
        uName: this.userModel.uname,
        ulimitDate: this.userModel.ulimitDate
      }
      await this.$store
        .dispatch('user/addBigMan', parms)
        .then((response) => {
          this.addloading = false
          const { code, message, data } = response
          if (code === 1) {
            const index = this.companysBigManInfo.findIndex((item) => { return item.cid === parms.ucId })
            if (index >= 0) {
              let users = this.companysBigManInfo[index].users
              if (!users || users == null) {
                users = []
              }
              users.unshift(data)
              this.$set(this.companysBigManInfo[index], 'users', users)
            }
            this.showToast(message)
            this.isShowDialogInsert = false
          } else {
            this.showMessage(message, 'warning')
          }
        })
        .catch((error) => {
          this.addloading = false
          this.showMessage(error, 'error')
        })
    },
    handelRemoveAdmin(admin) {
      this.$confirm('是否删除管理员 [' + admin.uname + '] 账户?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteCompanyBigMan(false, admin.ucId, admin.id)
      }).catch(() => {
      })
    },
    async deleteCompanyBigMan(deleteAllAdmin, companyId, userId) {
      this.loading = true
      try {
        let url = ''
        const parms = {}
        if (deleteAllAdmin === true) {
          parms.uId = companyId
          url = 'user/deleteBigMan'
        } else {
          parms.id = userId
          url = 'user/deleteBigManById'
        }
        return this.$store
          .dispatch(url, parms)
          .then((response) => {
            this.loading = false;
            const { code, message } = response;
            if (code === 1) {
              this.showToast(message)
              const index = this.companysBigManInfo.findIndex((item) => { return item.cid === companyId })
              if (index >= 0) {
                if (deleteAllAdmin) {
                  this.$set(this.companysBigManInfo[index], 'users', null)
                } else {
                  let users = this.companysBigManInfo[index].users
                  const userIndex = users.findIndex((item) => { return item.id === userId })
                  if (userIndex >= 0) {
                    users.splice(userIndex, 1)
                    if (users.length === 0) { users = null }
                    this.$set(this.companysBigManInfo[index], 'users', users)
                  }
                }
              }
            } else {
              this.showMessage(message, 'warning')
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
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  // background: blue;
  position: absolute;
  padding: 1px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
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
