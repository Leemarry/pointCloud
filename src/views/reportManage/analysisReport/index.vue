<!--
 * @Date: 2024-07-16 14:42:13
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\views\reportManage\analysisReport\index.vue
 * @Description: Do not edit
-->
<!--  -->
<template>
  <div v-loading="mixinsLoading" element-loading-background="rgba(0, 0, 0, 0.3)" class="media">
    <div class="media-top">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="文件类型">
          <el-select v-model="formInline.type" placeholder="请选择" @change="changeType">
            <el-option v-for="item in reportOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
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
        <el-button type="primary" @click="queryList1()">查询</el-button>
        <el-dropdown split-button type="primary" style="margin-left: 5px;" @click="uploadFiles(data)">
          {{ title }}
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="uploadReport('危险点分析报告',{ fileType: 'peril_point_report' , id : 0, reqUrl:'efapi/pointcloud/media/peril_point_report/upload' })">危险点分析报告</el-dropdown-item>
            <el-dropdown-item @click.native="uploadReport('交跨报告',{ fileType: 'cross_border_report' , id : 0, reqUrl:'efapi/pointcloud/media/cross_border_report/upload' })">交跨报告</el-dropdown-item>
            <el-dropdown-item @click.native="uploadReport('输电线路杆塔缺陷分析报告',{ fileType: 'line_towers_analysis_report' , id : 0, reqUrl:'efapi/pointcloud/media/line_towers_analysis_report/upload' })">输电线路杆塔缺陷分析报告</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="media-container">
      <el-table :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)" stripe style="width: 100%">
        <el-table-column prop="createTime" label="日期" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mark" label="文件名" width="180" />
        <el-table-column prop="type" label="类型">
          <template slot-scope="scope">
            <span>{{ typeMap.get(scope.row.type) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="大小">
          <template slot-scope="scope">
            <span>{{ filtersType(scope.row.size) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fileUrl" label="地址" />
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="beforeView(scope.row)">查看</el-button>
            <el-button type="text" size="small" @click="downloadFile(scope.row, scope.$index)">下载</el-button>
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
<script src="./index.js"></script>
<!-- <style lang="scss" src="./index.scss" scoped></style> -->
<style lang='scss' scoped>
//@import url(); 引入公共css类
.media {
    background-color: #F3F6F8;
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
    background-color: #FAFAFA;
    overflow: auto;
}
</style>
