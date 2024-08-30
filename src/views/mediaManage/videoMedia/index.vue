<!--
 * @Date: 2024-07-16 14:09:40
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\views\mediaManage\videoMedia\index.vue
 * @Description: Do not edit
-->
<!--  -->
<template>
  <div v-loading="mixinsLoading" element-loading-background="rgba(0, 0, 0, 0.3)" class="media">
    <div class="media-top">
      <el-form :inline="true" :model="formInline" :rules="rules" class="demo-form-inline">
        <el-form-item label="杆塔/视频描述" prop="mark">
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
        <el-button type="primary" @click="queryList1()">查询</el-button>
        <el-button type="primary" @click="uploadFiles({ fileType: 'video' , id : 0,reqUrl:'efapi/pointcloud/media/video/upload',title:'视频' })">上传</el-button>
      </div>
    </div>
    <div class="media-container">
      <el-table :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)" stripe style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column prop="date" label="日期" width="180">
          <template slot-scope="scope">
            <span size="medium">{{ parseTime(scope.row.createTime ) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mark" label="文件名" width="180" />
        <el-table-column prop="towerMark" label="杆塔编号" width="200">
          <template slot-scope="scope">
            <el-tag type="success">{{ scope.row.towerMark }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="大小">
          <template slot-scope="scope">
            <span size="medium">{{ filtersType(scope.row.size) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="地址">
          <template slot-scope="scope">
            <video :src="scope.row.path" style="height: 80px;" />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot="header" slot-scope="scope">
            <span v-if="multipleSelection.length==0">操作</span>
            <el-tag v-else size="small" @click="delectChecked('/media/video/delects')">删除选中</el-tag>
          </template>
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="beforeView(scope.row.id,scope.row.path,scope.row.formats)">查看</el-button>
            <el-button v-if="!scope.row.downLoadProgress" type="text" size="small" @click="downloadVideo(scope.row)">下载</el-button>
            <el-button v-else type="text" size="small" @click="downloadVideo(scope.row)">{{ scope.row.downLoadProgress >= 99 ? '已下载':`${Number(scope.row.downLoadProgress).toFixed(1)}下载中。。` }}</el-button>
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

<script src='./index.js'></script>
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
