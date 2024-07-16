<template>
  <el-container>
    <el-main>
      <el-row :gutter="20" type="flex" justify="center" align="middle" style="height:50px">
        <el-col :span="12" align="left">
          <el-button type="primary" size="mini" @click="startAddUavSn">新增无人机映射</el-button>
        </el-col>
        <el-col :span="12" align="left">
          <el-button type="primary" size="mini" @click="startAddHiveSn">新增停机坪映射</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="flex:1;">
        <el-col :span="12" style="height:100%">
          <!-- 无人机SN码为无人机唯一编码，系统编号为在本系统中无人机使用的编号。 -->
          <el-table v-loading="loading" :data="allUavRel" style="width: 100%" height="100%" empty-text="暂未配置无人机映射记录">
            <el-table-column type="index" width="50" />
            <!-- <el-table-column prop="id" label="编号" width="80" /> -->
            <el-table-column prop="uavSn" label="无人机SN码" />
            <el-table-column prop="uavId" label="系统编号" />
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="beforeDeleteUavSnRel(scope.row)" type="text" size="small">删除</el-button>
                <el-button type="text" size="small" @click="startUpdateUavSn(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12" style="height:100%">
          <el-table v-loading="loading" :data="allHiveRel" style="width: 100%" height="100%" empty-text="暂未配置停机坪映射记录">
            <el-table-column type="index" width="50" />
            <!-- <el-table-column prop="id" label="编号" width="80" /> -->
            <el-table-column prop="hiveSn" label="停机坪SN码" />
            <el-table-column prop="hiveId" label="系统编号" />
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="beforeDeleteHiveSnRel(scope.row)">删除</el-button>
                <el-button type="text" size="small" @click="startUpdateHiveSn(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-main>

    <el-dialog title="无人机编码映射" :visible.sync="isShowDialogUav" width="350px">
      <el-form label-position="left" size="mini" :rules="rulesUavSn" :model="uavRel" ref="uavRel" :inline="false">
        <el-form-item label="无人机SN码" :label-width="formLabelWidth" prop="uavSn">
          <el-input v-model="uavRel.uavSn" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="系统编号" :label-width="formLabelWidth" prop="uavId">
          <el-input v-model="uavRel.uavId" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowDialogUav = false">取 消</el-button>
        <el-button type="primary" @click="beforeUpdateOrAddUavSnRel('uavRel')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="停机坪编码映射" :visible.sync="isShowDialogHive" width="350px">
      <el-form label-position="left" size="mini" :rules="rulesHiveSn" :model="hiveRel" ref="hiveRel">
        <el-form-item label="停机坪SN码" :label-width="formLabelWidth" prop="hiveSn">
          <el-input v-model="hiveRel.hiveSn" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="系统编号" :label-width="formLabelWidth" prop="hiveId">
          <el-input v-model="hiveRel.hiveId" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowDialogHive = false">取 消</el-button>
        <el-button type="primary" @click="beforeupdateOrAddHiveSnRel('hiveRel')">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>

export default {
  name: 'Company',
  data() {
    return {
      loading: false,
      isShowDialogUav: false,
      isShowDialogHive: false,
      isAddUavSn: false,
      isAddHiveSn: false,
      formLabelWidth: '100px',
      companysInfo: [],
      uavRel: {},
      hiveRel: {},
      allUavRel: [],
      allHiveRel: [],
      rulesUavSn: {
        uavSn: [
          { required: true, message: '请输入无人机SN码', trigger: 'blur' },
          { min: 3, max: 100, message: '长度在 3 到 60 个字符', trigger: 'blur' }
        ],
        uavId: [
          { required: true, message: '请输入系统编号', trigger: 'blur' },
          { min: 3, max: 100, message: '长度在 3 到 60 个字符', trigger: 'blur' }
        ]
      },
      rulesHiveSn: {
        hiveSn: [
          { required: true, message: '请输入停机坪SN码', trigger: 'blur' },
          { min: 3, max: 100, message: '长度在 3 到 60 个字符', trigger: 'blur' }
        ],
        hiveId: [
          { required: true, message: '请输入系统编号', trigger: 'blur' },
          { min: 3, max: 100, message: '长度在 3 到 60 个字符', trigger: 'blur' }
        ]
      },
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
      await this.queryAllUavRel()
      await this.queryAllHiveRel()
    },
    showToast(msg) {
      this.$layer.msg(msg)
    },
    showMessage(msg, type) {
      this.$message({ message: msg, type: type })
    },
    startAddUavSn() {
      this.uavRel = {}
      this.isShowDialogUav = true
      this.isAddUavSn = true
      this.resetForm('uavRel')
    },
    startAddHiveSn() {
      this.hiveRel = {}
      this.isShowDialogHive = true
      this.isAddHiveSn = true
      this.resetForm('hiveRel')
    },
    startUpdateUavSn(row) {
      this.isAddUavSn = false
      this.uavRel = this.$toolUtil.copyDeep(row)
      this.isShowDialogUav = true
      this.resetForm('uavRel')
    },
    startUpdateHiveSn(row) {
      this.isAddHiveSn = false
      this.hiveRel = this.$toolUtil.copyDeep(row)
      this.isShowDialogHive = true
      this.resetForm('hiveRel')
    },
    resetForm(formName) {
      if (this.$refs[formName] && this.$refs[formName] !== null) {
        this.$refs[formName].resetFields()
      }
    },
    // 查询所有无人机编号映射
    async queryAllUavRel() {
      this.loading = true
      this.allUavRel = []
      try {
        await this.$store
          .dispatch('efRelationUavHive/queryAllUavRel')
          .then((response) => {
            this.loading = false
            const { code, message, data } = response
            if (code === 1) {
              this.allUavRel = data
              // for (let i = 0; i < 5; i++) {
              //   for (let index = 0; index < data.length; index++) {
              //     this.allUavRel.push(data[index])
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
    // 查询所有停机坪编号映射
    async queryAllHiveRel() {
      this.loading = true
      this.allHiveRel = []
      try {
        await this.$store
          .dispatch('efRelationUavHive/queryAllHiveRel')
          .then((response) => {
            this.loading = false
            const { code, message, data } = response
            if (code === 1) {
              this.allHiveRel = data
              // for (let i = 0; i < 10; i++) {
              //   for (let index = 0; index < data.length; index++) {
              //     this.allHiveRel.push(data[index])
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
    async beforeDeleteUavSnRel(item) {
      return this.$confirm('是否删除无人机编码 ' + item.uavSn + ' 的映射?', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteUavSnRel(item)
      }).catch(() => {
      })
    },
    async beforeDeleteHiveSnRel(item) {
      return this.$confirm('是否删除停机坪编码 ' + item.hiveSn + ' 的映射?', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteHiveSnRel(item)
      }).catch(() => {
      })
    },
    // 删除无人机编号映射
    async deleteUavSnRel(item) {
      this.loading = true
      try {
        const parms = {
          id: item.id
        }
        await this.$store
          .dispatch('efRelationUavHive/deleteUavSn', parms)
          .then((response) => {
            this.loading = false
            const { code, message } = response
            if (code === 1) {
              this.showToast(message)
              const index = this.allUavRel.findIndex((uav) => {
                return uav.id === parms.id
              })
              if (index >= 0) {
                this.allUavRel.splice(index, 1)
              }
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
    // 删除停机坪编号映射
    async deleteHiveSnRel(item) {
      this.loading = true
      try {
        const parms = {
          id: item.id
        }
        await this.$store
          .dispatch('efRelationUavHive/deleteHivesn', parms)
          .then((response) => {
            this.loading = false
            const { code, message } = response
            if (code === 1) {
              const index = this.allHiveRel.findIndex((hive) => {
                return hive.id === parms.id
              })
              if (index >= 0) {
                this.allHiveRel.splice(index, 1)
              }
              this.showToast(message)
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
    async beforeUpdateOrAddUavSnRel(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateOrAddUavSnRel()
        } else {
          return false
        }
      })
    },
    // 新增，修改无人机编号映射
    async updateOrAddUavSnRel() {
      this.loading = true
      try {
        let url = 'efRelationUavHive/updateUavSn'
        if (this.isAddUavSn) {
          url = 'efRelationUavHive/addUavSn'
        }
        const parms = {
          id: this.uavRel.id,
          uavSn: this.uavRel.uavSn,
          uavId: this.uavRel.uavId
        }
        await this.$store
          .dispatch(url, parms)
          .then((response) => {
            this.loading = false
            const { code, message, data } = response
            if (code === 1) {
              this.showToast(message)
              if (this.isAddUavSn) {
                this.allUavRel.unshift(data)
              } else {
                const index = this.allUavRel.findIndex((uav) => {
                  return uav.id === parms.id
                })
                if (index >= 0) {
                  this.allUavRel.splice(index, 1, parms)
                }
              }
              this.isShowDialogUav = false
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
    async beforeupdateOrAddHiveSnRel(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateOrAddHiveSnRel()
        } else {
          return false
        }
      })
    },
    // 新增，修改停机坪编号映射
    async updateOrAddHiveSnRel() {
      this.loading = true
      try {
        let url = 'efRelationUavHive/updateHivesn'
        if (this.isAddHiveSn) {
          url = 'efRelationUavHive/addHivesn'
        }
        const parms = {
          id: this.hiveRel.id,
          hiveSn: this.hiveRel.hiveSn,
          hiveId: this.hiveRel.hiveId
        }
        await this.$store
          .dispatch(url, parms)
          .then((response) => {
            this.loading = false
            const { code, message, data } = response
            if (code === 1) {
              this.showToast(message)
              if (this.isAddHiveSn) {
                this.allHiveRel.unshift(data)
              } else {
                const index = this.allHiveRel.findIndex((hive) => {
                  return hive.id === parms.id
                })
                if (index >= 0) {
                  this.allHiveRel.splice(index, 1, parms)
                }
              }
              this.isShowDialogHive = false
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
    }
  }
}
</script>

<style lang="scss" scoped>
.el-header {
  // background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}
.el-container {
  // background: blue;
  position: absolute;
  padding: 1px;
  width: 100%;
  height: 100%;
  display: flex;
}
.el-main {
  // background:red;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.el-row {
  // background: blue;
  // height: 50%;
}
</style>
