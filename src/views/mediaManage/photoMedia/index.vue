<!--  -->
<template>
  <div class="media">
    <div class="media-top">
      <el-form :inline="true" :model="formInline" :rules="rules" class="demo-form-inline">
        <el-form-item label="杆塔/图片描述" prop="mark">
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
        <el-button type="primary" @click="uploadFiles({ fileType: 'image' , id : 0,reqUrl:'efapi/pointcloud/media/photo/upload' })">上传</el-button>
      </div>
    </div>
    <div class="media-container">
      <el-table :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)" stripe style="width: 100%">
        <el-table-column prop="date" label="日期" width="180">
          <template slot-scope="scope">
            <span size="medium">{{ parseTime(scope.row.createTime ) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fileName" label="文件名" width="180">
          <template slot-scope="scope">
            <span size="medium">{{ scope.row.imageTag }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="formats" label="类型">
          <template slot-scope="scope">
            <span size="medium">{{ scope.row.formats }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="大小">
          <template slot-scope="scope">
            <span size="medium">{{ filtersType(scope.row.size) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="towerId" label="杆塔标注" />
        <el-table-column prop="path" label="地址">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.path"
              fit="fit"
            />
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
    <AlDialog title="弹窗" :visible="dialogVisible" height="200px" width="280px" @close="dialogVisible=false">
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
  .demo-form-inline{
    flex: 1;
  }

}

.media-container {
  flex: 1;
  background-color: #FAFAFA;
  overflow: auto;
}
</style>
