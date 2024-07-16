<template>
  <el-container>
    <el-header height="40px" v-show="false">
      <el-button type="primary" @click="startAdd" size="mini">新增无人机类型</el-button>
    </el-header>
    <el-main>
      <el-table v-loading="loading" :data="uavTypesInfo" style="width: 100%" height="100%" empty-text="暂无无人机类型信息" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
        <el-table-column type="index" width="50" />
        <el-table-column prop="typeName" label="无人机类型">
        </el-table-column>
        <el-table-column prop="typeNo" label="型号">
        </el-table-column>
        <el-table-column label="图片" v-if="false">
          <template slot-scope="props">
            <el-image style="width: 25px; height: 25px" :src="props.row.typeImage +'?'+ Date.now()">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" style="font-size: 25px;" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120" v-if="false">
          <template slot-scope="scope">
            <el-button @click="deleteUavType(scope.row)" type="text" size="small">删除</el-button>
            <el-button type="text" size="small" @click="startUpdate(scope.row)">编辑</el-button>
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
          <el-button type="primary" @click="updateUavType('ruleForm')">保存</el-button>
          <el-button @click="cancelUpdateCompany()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </el-container>
</template>

<script>
export default {
  name: "UavType",
  data() {
    return {
      loading: false,
      loadingUpdateInsert: false,
      isShowDialogInsert: false,
      isInsert: true,
      uavTypesInfo: [],
      typeInfo: {},
      typeInfoTemp: {
        id: null,
        typeName: '',
        typeNo: '',
        typeImage: ''
      },
      fileListImages: []
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
    startAdd() {
      this.isInsert = true;
      this.fileListImages = [];
      this.typeInfo = {};
      // this.typeInfo.efSysteminfo = {
      //   sysName: '',
      //   sysNameZh: '',
      //   sysInfo: '',
      // };
      this.typeInfo = this.$toolUtil.copyDeep(this.typeInfoTemp)
      this.isShowDialogInsert = true
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
                  const index = this.uavTypesInfo.findIndex(
                    (item) => {
                      return item.id === row.id;
                    }
                  );
                  if (index >= 0) {
                    this.uavTypesInfo.splice(index, 1);
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
    async updateUavType(row) {
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
      };
      if (imageBase64 !== null) {
        parms.cLogoIco = imageBase64;
      }
      let url = "uav/updateUavType";
      if (this.isInsert) {
        url = "uav/insertUavType";
      }
      await this.$store
        .dispatch(url, parms)
        .then((response) => {
          this.loadingUpdateInsert = false;
          const { code, message, data } = response;
          if (code === 1) {
            if (this.isInsert) {
              this.uavTypesInfo.unshift(data);
            } else {
              const index = this.uavTypesInfo.findIndex(
                (item) => {
                  return item.id === data.id;
                }
              );
              if (index >= 0) {
                this.uavTypesInfo.splice(index, 1, data);
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
      this.uavTypesInfo = [];
      try {
        await this.$store
          .dispatch('efUavType/queryAll')
          .then((response) => {
            this.loading = false;
            const { code, message, data } = response;
            if (code === 1) {
              this.uavTypesInfo = data;
              // for (let i = 0; i < 5; i++) {
              //   for (let index = 0; index < data.length; index++) {
              //     this.uavTypesInfo.push(data[index])
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
