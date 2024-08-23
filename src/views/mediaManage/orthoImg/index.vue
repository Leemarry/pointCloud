<!--  -->
<template>
  <div v-loading="mixinsLoading" element-loading-background="rgba(0, 0, 0, 0.3)" class="media">
    <div class="media-top">
      <el-form :inline="true" :model="formInline" :rules="rules" class="demo-form-inline">
        <el-form-item label="正射标注" prop="mark">
          <el-input v-model="formInline.mark" placeholder="文件详情..." />
        </el-form-item>
        <el-form-item label="时间范围" prop="startTime">
          <el-col :span="12">
            <el-date-picker v-model="formInline.startTime" type="datetime" placeholder="选择起始时间" align="right" :picker-options="pickerOptions" />
          </el-col>
          <el-col class="line" :span="2">至</el-col>
          <el-col :span="10">
            <el-date-picker v-model="formInline.endTime" type="datetime" placeholder="选择日期时间" default-time="12:00:00" />
          </el-col>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="queryList1">查询</el-button>
        <!-- <el-button type="primary" @click="uploadFiles({ fileType: 'orthoimg' , id : 0,reqUrl:'efapi/pointcloud/media/orthoimg/uploads' })">上传</el-button> -->
        <el-dropdown split-button type="primary" style="margin-left: 5px;" @click="beforeUpload()">
          {{ title }}
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="operationType('正射图级',{ fileType: 'orthoimg' , id : 0, reqUrl:'efapi/pointcloud/media/orthoimg/mapupload',title: '地图图级' })">正射图级</el-dropdown-item>
            <!-- <el-dropdown-item @click.native="operationType('正射tif',{ fileType: 'orthoimg' , id : 1, reqUrl:'efapi/pointcloud/media/orthoimgTif/uploads',title: 'TIF' })">正射tif</el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="media-container">
      <el-table
        :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="date" label="日期" width="180">
          <template slot-scope="scope">
            {{ parseTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="mark" label="标注名" width="120" />
        <el-table-column prop="formats" label="类型" />
        <el-table-column prop="lat" label="经纬度">
          <template slot-scope="scope">
            <span>{{ scope.row.lat }} , {{ scope.row.lon }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="towerMark" label="杆塔编号" width="200">
          <template slot-scope="scope">
            <el-tag type="success">{{ scope.row.towerMark }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <!-- <el-button type="text" size="small" @click="beforeView(scope.row.id,scope.row.path,scope.row.formats)">查看</el-button> -->
            <el-button type="text" size="small" @click="previewPointCloud(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="media-footer">
      <el-pagination
        align="center"
        :current-page="currentPage"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import currencyMinins from '@/utils/currencyMinins'
export default {
    name: 'PointCloud',
    //import引入的组件需要注入到对象中才能使用
    components: {},
    mixins: [currencyMinins],
    //让组件接收外部传来的数据
    props: {
    },
    data() {
    //这里存放数据
        return {
            title: '正射图级',
            reqData: { fileType: 'orthoimg', id: 1, reqUrl: 'efapi/pointcloud/media/orthoimg/mapupload', title: '地图图级' },
            reqUrl: '/media/orthoImg/querylist'
        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
    beforeCreate() { }, //生命周期 - 创建之前
    beforeMount() { }, //生命周期 - 挂载之前
    beforeUpdate() { }, //生命周期 - 更新之前
    updated() { }, //生命周期 - 更新之后
    beforeDestroy() { }, //生命周期 - 销毁之前
    destroyed() { }, //生命周期 - 销毁完成
    activated() { },
    //方法集合
    methods: {
        operationType(title, data) {
            this.title = title
            this.reqData = data
        },
        beforeUpload() {
            this.uploadFiles(this.reqData, 0)
        },
        uploadFiles(item, index) {
            const windowName = 'uploadWindow-' + item.fileType; // 设定窗口名称
            if (!this.windows[windowName] || this.windows[windowName].closed) {
                // 如果窗口存在并且关闭了就在this.windows中删除
                if (this.windows[windowName]) {
                    delete this.windows[windowName];
                }
                const existingWindow = window.open('', windowName);
                const queryString = `?id=${item.id}&src=${encodeURIComponent(item.reqUrl)}&type=${encodeURIComponent(item.fileType)}&title=${encodeURIComponent(item.title)}`; //data=${encodeURIComponent(JSON.stringify(item))}
                const url = '/uploadphoto' + queryString;
                existingWindow.location.href = url; //'/uploadpage' + '?id=' + item.id + '&fileType=' + item.fileType;
                this.windows[windowName] = existingWindow;
            } else {
                this.windows[windowName].focus();
            }
        },
        previewPointCloud(row) {
            const windowName = 'orthoimgPreview-' + row.id;
            if (!this.windows[windowName] || this.windows[windowName].closed) {
                const queryString = `?id=${row.id}&src=${encodeURIComponent(row.mapPath)}&data=${encodeURIComponent(JSON.stringify(row))}&title=${encodeURIComponent('正射瓦片')}`;
                const url = '/previewPointcloud' + queryString;
                const existingWindow = window.open(url, windowName);
                existingWindow.tableData = this.tableData;
                this.windows[windowName] = existingWindow;
            } else {
                this.windows[windowName].focus();
            }
        },
        // #region ------------------------------------------------------------- 查询 ----------------------------------------------------
        // #endregion

        // #region ---------------------------------------------------------- 打开新标签页 ---------------------------------------------------
        openpage(item) {
            console.log('   console.log(this.$router.options.routes)', this.$router.options.routes)
            window.open(this.$router.resolve({ path: '/uploadpage?ip=' + item.fileType }).href, '_blank')
        },
        // #endregion

        // #region ---------------------------------------------------  分页 ---------------------------------------------------
        //每页条数改变时触发 选择一页显示多少行
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.currentPage = 1;
            this.pageSize = val;
        },
        //当前页改变时触发 跳转其他页
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val;
        }

        // #endregion

    } //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
.media {
  background-color: #f3f6f8;
  height: 100%;
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1;
}

.media-top {
  display: flex;
  justify-content: space-between;
}

.media-container {
  flex: 1;
  background-color: #fafafa;
  overflow: auto;
}
</style>
