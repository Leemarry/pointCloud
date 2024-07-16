<template>
  <el-container>
    <el-header height="40px">
      <el-button type="primary" @click="startAdd" size="mini">新增无人机</el-button>
    </el-header>
    <el-main>
      <el-table v-loading="loading" :data="uavsInfo" style="width: 100%" height="100%" empty-text="暂无无人机">
        <el-table-column type="index" width="50" />
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" size="mini">
              <el-form-item label="出厂日期">
                <span>{{ $dateUtil.convertMillSecToYYYYMMDD(props.row.uavSellDate) }}</span>
              </el-form-item>
              <el-form-item label="出厂操作人">
                <span>{{ props.row.uavSellByUser }}</span>
              </el-form-item>
              <el-form-item label="生产日期">
                <span>{{ $dateUtil.convertMillSecToYYYYMMDD(props.row.uavProductDate) }}</span>
              </el-form-item>
              <el-form-item label="生产责任人">
                <span>{{ props.row.uavProductByUser }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="uavId" label="编号" width="200">
        </el-table-column>
        <el-table-column prop="uavName" label="昵称">
        </el-table-column>
        <el-table-column prop="uavWheelbase" label="轴距/米">
        </el-table-column>
        <el-table-column prop="uavEnduranceTime" label="续航/分钟">
        </el-table-column>
        <el-table-column prop="uavMaxpayload" label="载重/千克">
        </el-table-column>
        <el-table-column prop="uavMaxspeed" label="飞行速度/米每秒">
        </el-table-column>
        <el-table-column label="厂家">
          <template slot-scope="props">
            {{ props.row.efFactory.pname }}
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="props">
            {{ props.row.efUavType.typeName}}
            <!-- {{ props.row.efUavType.typeName +' '+ props.row.efUavType.typeNo }} -->
          </template>
        </el-table-column>
        <!-- <el-table-column label="图片" width="80">
          <template slot-scope="props">
            <el-image style="width: 25px; height: 25px" :src="props.row.efUavType.typeImage +'?'+ Date.now()">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" style="font-size: 25px;" />
              </div>
            </el-image>
          </template>
        </el-table-column> -->
        <el-table-column prop="uavSellDate" label="出厂日期">
          <template slot-scope="props">
            {{ $dateUtil.convertMillSecToYYYYMMDD(props.row.uavSellDate) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click="deleteUav(scope.row)" type="text" size="small">删除</el-button>
            <el-button type="text" size="small" @click="startUpdate(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <el-drawer title="无人机" :visible.sync="isShowDialogInsert" :with-header="true" size="400px">
      <el-scrollbar wrap-style="overflow-x:hidden" style="width: 100%; height:100%;">
        <el-form label-width="140px" :model="uavInfo" ref="uavInfo" :rules="uavInfoRules" label-position="left" style="margin:10px" size="mini" v-loading="loadingUpdateInsert">
          <el-form-item label="无人机编号" prop="uavId">
            <el-input v-model="uavInfo.uavId" :disabled="isInsert==false"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="uavName">
            <el-input v-model="uavInfo.uavName"></el-input>
          </el-form-item>
          <el-form-item label="轴距/米" prop="uavWheelbase">
            <el-input v-model="uavInfo.uavWheelbase"></el-input>
          </el-form-item>
          <el-form-item label="续航/分钟" prop="uavEnduranceTime">
            <el-input v-model="uavInfo.uavEnduranceTime"></el-input>
          </el-form-item>
          <el-form-item label="载重/千克" prop="uavMaxpayload">
            <el-input v-model="uavInfo.uavMaxpayload"></el-input>
          </el-form-item>
          <el-form-item label="飞行速度/米每秒" prop="uavMaxspeed">
            <el-input v-model="uavInfo.uavMaxspeed"></el-input>
          </el-form-item>
          <el-form-item label="厂家" prop="uavFactoryId">
            <el-select v-model="uavInfo.uavFactoryId" style="width: 100%;" placeholder="请选择无人机厂家">
              <el-option v-for="item in uavFactorys" :key="item.id" :label="item.pname" :value="item.id">
                <span style="float: left">{{ item.pname }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.pphone }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型" prop="uavTypeId">
            <el-select v-model="uavInfo.uavTypeId" style="width: 100%;" placeholder="请选择无人机类型">
              <el-option v-for="item in uavTypes" :key="item.id" :label="item.typeName" :value="item.id">
                <span style="float: left">{{ item.typeName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.typeNo }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="生产日期" prop="uavProductDate">
            <el-date-picker type="date" placeholder="请选择生产日期" v-model="uavInfo.uavProductDate" style="width: 100%;" value-format="timestamp"></el-date-picker>
          </el-form-item>
          <el-form-item label="生产责任人" prop="uavProductByUser">
            <el-input v-model="uavInfo.uavProductByUser"></el-input>
          </el-form-item>
          <el-form-item label="出厂日期" prop="uavSellDate">
            <el-date-picker type="date" placeholder="请选择出厂日期" v-model="uavInfo.uavSellDate" style="width: 100%;" value-format="timestamp"></el-date-picker>
          </el-form-item>
          <el-form-item label="出厂操作人">
            <el-input v-model="uavInfo.uavSellByUser"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="beforeUpdateUav('uavInfo')">{{ isInsert ? '新增' : '修改' }}</el-button>
            <el-button @click="cancelUpdateUav()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-drawer>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: "Uavs",
  data() {
    var valiNumberPass1 = (rule, value, callback) => {// 包含小数的数字
      // const reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
      const reg = /^(\-|\+)?\d+(\.\d+)?$/
      if (value === '') {
        callback(new Error('请输入内容'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    var valiNumberPass2 = (rule, value, callback) => {// 正整数
      const reg = /^[+]{0,1}(\d+)$/g;
      if (value === '') {
        callback(new Error('请输入内容'));
      } else if (!reg.test(value)) {
        callback(new Error('请输入正整数'));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      loadingUpdateInsert: false,
      isShowDialogInsert: false,
      isInsert: true,
      uavsInfo: [],
      uavInfo: {},
      uavFactorys: [],
      uavTypes: [],
      uavInfoTemp: {
        "uavId": "",
        "uavName": "",
        "uavProductDate": 0,
        "uavProductByUser": "",
        "uavSellDate": null,
        "uavSellByUser": null,
        "uavWheelbase": 0,
        "uavMaxpayload": 0,
        "uavEnduranceTime": 0,
        "uavMaxspeed": 0,
        "uavContractNo": null,
        "uavFactoryId": 0,
        "uavTypeId": 0,
        "uavStatus": 0,
        "uavDefaultHiveId": "",
        "efFactory": {
          "id": "1",
          "pname": "",
          "pback": "",
          "pphone": ""
        },
        "efUavType": {
          "id": "",
          "typeName": "",
          "typeNo": "",
          "typeImage": ""
        }
      },
      uavInfoRules: {
        uavId: [
          { required: true, message: '请输入无人机编号', trigger: 'blur' },
          { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
        ],
        uavName: [
          { required: true, message: '请输入无人机昵称', trigger: 'change' }
        ],
        uavWheelbase: [
          { required: true, validator: valiNumberPass1, message: '请输入轴距(数字)', trigger: 'change' }
        ],
        uavEnduranceTime: [
          { required: true, validator: valiNumberPass1, message: '请输入最大续航时长(数字)', trigger: 'change' }
        ],
        uavMaxpayload: [
          { required: true, validator: valiNumberPass1, message: '请输入最大载重量(数字)', trigger: 'change' }
        ],
        uavMaxspeed: [
          { required: true, validator: valiNumberPass1, message: '请输入最大飞行速度(数字)', trigger: 'change' }
        ],
        uavProductDate: [
          { required: true, message: '请选择生产日期', trigger: 'change' }
        ],
        uavProductByUser: [
          { required: true, message: '请输入生产责任人', trigger: 'change' }
        ],
        uavSellDate: [
          { required: true, message: '请选择出厂日期', trigger: 'change' }
        ],
        uavFactoryId: [
          { required: true, message: '请选择厂家', trigger: 'change' }
        ],
        uavTypeId: [
          { required: true, message: '请选择无人机类型', trigger: 'change' }
        ]
      }
    };
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    this.init();
  },
  beforeDestroy() { },
  onDestroy() { },
  methods: {
    async init() {
      await this.queryAllFactory()
      await this.queryAllUavTypes()
      await this.queryAllUav()
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
      this.isInsert = true
      this.uavInfo = this.$toolUtil.copyDeep(this.uavInfoTemp)
      this.uavInfo.uavFactoryId = '2'
      this.uavInfo.uavTypeId = '2'
      this.uavInfo.uavProductDate = Date.now()
      this.uavInfo.uavSellDate = Date.now()
      this.uavInfo.uavSellByUser = this.name
      this.uavInfo.uavProductByUser = this.name
      this.isShowDialogInsert = true
      this.resetForm()
    },
    startUpdate(row) {
      this.isInsert = false
      this.uavInfo = this.$toolUtil.copyDeep(row)
      this.uavInfo.uavFactoryId = this.uavInfo.uavFactoryId + ''
      this.uavInfo.uavTypeId = this.uavInfo.uavTypeId + ''
      this.isShowDialogInsert = true
      this.resetForm()
    },
    resetForm() {
      this.$refs['uavInfo'].resetFields()
    },
    async deleteUav(row) {
      this.$confirm("确定删除无人机 [ " + row.uavName + " ] ?", "警告",
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
              .dispatch('uav/deleteUav', { uavId: row.uavId })
              .then((response) => {
                this.loading = false;
                const { code, message } = response;
                if (code === 1) {
                  const index = this.uavsInfo.findIndex(
                    (item) => {
                      return item.uavId === row.uavId;
                    }
                  );
                  if (index >= 0) {
                    this.uavsInfo.splice(index, 1);
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
    cancelUpdateUav() {
      this.isShowDialogInsert = false
    },
    beforeUpdateUav(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateUav()
        } else {
          return false
        }
      })
    },
    async updateUav() {
      this.loadingUpdateInsert = true
      const parms = {
        uavId: this.uavInfo.uavId,
        uavName: this.uavInfo.uavName,
        uavProductDate: this.uavInfo.uavProductDate,
        uavProductByUser: this.uavInfo.uavProductByUser,
        uavSellDate: this.uavInfo.uavSellDate,
        uavSellByUser: this.uavInfo.uavSellByUser,
        uavWheelbase: this.uavInfo.uavWheelbase,
        uavMaxpayload: this.uavInfo.uavMaxpayload,
        uavEnduranceTime: this.uavInfo.uavEnduranceTime,
        uavMaxspeed: this.uavInfo.uavMaxspeed,
        uavContractNo: this.uavInfo.uavContractNo,
        uavFactoryId: this.uavInfo.uavFactoryId,
        uavTypeId: this.uavInfo.uavTypeId,
        uavStatus: 0
      }
      let url = "uav/updateUav";
      if (this.isInsert) {
        url = "uav/addUav";
      }
      await this.$store
        .dispatch(url, parms)
        .then((response) => {
          this.loadingUpdateInsert = false;
          const { code, message, data } = response;
          if (code === 1) {
            if (this.isInsert) {
              this.uavsInfo.unshift(data)
            } else {
              const index = this.uavsInfo.findIndex((item) => {
                return item.uavId === data.uavId
              }
              )
              if (index >= 0) {
                this.uavsInfo.splice(index, 1, data)
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
    async queryAllUav() {
      this.loading = true;
      this.uavsInfo = [];
      try {
        await this.$store
          .dispatch('uav/queryAllUav')
          .then((response) => {
            this.loading = false;
            const { code, message, data } = response;
            if (code === 1) {
              this.uavsInfo = data;
              // for (let i = 0; i < 5; i++) {
              //   for (let index = 0; index < data.length; index++) {
              //     this.uavsInfo.push(data[index])
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
    // 查询所有厂家
    async queryAllFactory() {
      this.loading = true;
      this.uavFactorys = [];
      try {
        await this.$store
          .dispatch('efFactory/queryAll')
          .then((response) => {
            this.loading = false;
            const { code, message, data } = response;
            if (code === 1) {
              this.uavFactorys = data;
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
    // 查询所有无人机类型
    async queryAllUavTypes() {
      this.loading = true;
      this.uavTypes = [];
      try {
        await this.$store
          .dispatch('efUavType/queryAll')
          .then((response) => {
            this.loading = false;
            const { code, message, data } = response;
            if (code === 1) {
              this.uavTypes = data;
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
