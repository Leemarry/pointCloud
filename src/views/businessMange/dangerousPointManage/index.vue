<!--  -->
<template>
  <div class="media">
    <div class="media-top">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="危险点统计">
          <el-input v-model="formInline.total" placeholder="危险点统计" disabled class="custom-input" />
        </el-form-item>
        <el-form-item label="危险点描述">
          <el-input v-model="formInline.mark" placeholder="危险点详情..." />
        </el-form-item>
        <el-form-item label="时间范围">
          <el-col :span="12">
            <!-- <el-date-picker type="date" placeholder="选择日期" v-model="formInline.date1" style="width: 100%;"></el-date-picker> -->
            <el-date-picker v-model="formInline.startTime" type="datetime" placeholder="选择起始时间" align="right" :picker-options="pickerOptions" />
          </el-col>
          <el-col class="line" :span="2">至</el-col>
          <el-col :span="10">
            <el-date-picker v-model="formInline.endTime" type="datetime" placeholder="选择日期时间" default-time="12:00:00" />
          </el-col>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="queryDangerPointList(true)">查询</el-button>
        <!-- <el-button type="primary" @click="openUploadDialog()">上传</el-button> -->
      </div>
    </div>
    <div class="media-container">
      <el-table :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)" stripe height="100%" style="width: 100%">
        <el-table-column prop="date" label="日期" width="120" fixed>
          <template slot-scope="scope">
            <span size="medium">{{ parseTime(scope.row.createTime ) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mark" label="危险点标注" width="150">
          <template slot-scope="scope">
            <el-tag size="medium">{{ scope.row.mark }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lat" label="位置">
          <template slot-scope="scope">
            <span>{{ `${scope.row.lng},${scope.row.lat}` }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dis" label="距离">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <h3>危险点与电力线</h3>
              <p>水平:{{ `${scope.row.levelDis} m` }}</p>
              <p>垂直:{{ `${scope.row.verticalDis} km` }}</p>
              <p>净空距离:{{ `${scope.row.clearDis} m` }}</p>
              <div slot="reference" class="name-wrapper">
                <span>{{ `${scope.row.levelDis} m/${scope.row.verticalDis} m/${scope.row.clearDis} m` }}</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="drawingImg" label="俯视图">
          <template slot-scope="scope">
            <el-image style="width: 100px; height: 100px" :src="scope.row.verticalViewImg" fit="fit" />
          </template>
        </el-table-column>
        <el-table-column prop="drawingImg" label="断面图">
          <template slot-scope="scope">
            <el-image style="width: 100px; height: 100px" :src="scope.row.drawingImg" fit="fit" />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="beforeView(scope.row)">查看</el-button>
            <el-button type="text" size="small" @click="downimg()">下载</el-button>
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
    <AlDialog title="弹窗" :visible="dialogVisible" height="200px" width="280px" @close="dialogVisible = false">
      <el-upload
        ref="upload"
        class="upload-demo"
        action="/"
        :on-preview="handlePreview"
        size="mini"
        :before-remove="beforeRemove"
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="false"
        :on-change="changeFile"
      >
        <el-button slot="trigger" size="mini" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传zip文件，且不超过50M</div>
      </el-upload>
    </AlDialog>
    <AlImagePreview :visible="previewVisible" />
    <el-image-viewer v-if="imgViewerVisible" :on-close="closeImgViewer" :url-list="imgList" />
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

    .demo-form-inline {
        flex: 1;
        .custom-input{
            width: 100px;
        }
    }

}

.media-container {
    flex: 1;
    background-color: #FAFAFA;
    overflow: auto;
}
</style>
