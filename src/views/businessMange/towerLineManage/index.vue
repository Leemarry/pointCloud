<!--  -->
<template>
  <div v-loading="mixinsLoading" element-loading-background="rgba(0, 0, 0, 0.3)" class="media">
    <div class="media-top">
      <el-form :inline="true" :rules="rules" :model="formInline" class="demo-form-inline">
        <el-form-item label="杆线数目">
          <el-input v-model="tableData.length" placeholder="杆塔数目" disabled class="custom-input" />
        </el-form-item>
        <el-form-item label="杆线描述" prop="mark">
          <el-input v-model="formInline.mark" placeholder="塔线编号详情..." />
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
        <el-button type="primary" @click="queryTowerLinelist()">查询</el-button>
        <el-dropdown split-button type="primary" style="margin-left: 5px;" @click="addTowers(reqData)">
          {{ title }}
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="operationType('手动新增',{ operation: 'hand' , id : 0, reqUrl:'/business/hand/addOrupdateLine' })">手动新增</el-dropdown-item>
            <el-dropdown-item @click.native="operationType('批量导入',{ operation: 'batch' , id : 1, reqUrl:'/business/batch/batchInsertToweLine' })">批量导入</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="media-container">
      <el-table :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)" stripe height="100%" style="width: 100%">
        <el-table-column prop="createTime" label="日期">
          <template slot-scope="scope">
            <span size="medium">{{ parseTime(scope.row.createTime ) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mark" width="115">
          <template slot="header">
            <span>塔线编号</span>
          </template>
          <template slot-scope="scope">
            <el-tag size="medium">{{ scope.row.mark }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lineLength" label="塔线长度">
          <template slot-scope="scope">
            <span v-if="scope.row.lineLength">{{ scope.row.lineLength }}</span>
            <span v-else>{{ scope.row.lineLengthStr }}</span>
            <!-- lineLengthStr lineLength -->
          </template>
        </el-table-column>
        <el-table-column prop="des" label="备注">
          <template slot-scope="scope">
            <span>{{ scope.row.des ? `${scope.row.des}` : '暂无' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="lastpath" label="塔线图片">
          <template slot-scope="scope">
            <el-image style="width: 100px; height: 100px" :src="scope.row.lastpath" fit="fit" @click="beforeView(scope.row.urlList)">
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="startTowerMark" label="起始杆塔" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.startTowerMark }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="startUrl" label="杆塔图片">
          <template slot-scope="scope">
            <el-image style="width: 100px; height: 100px;cursor: pointer;" :src="scope.row.startUrl" fit="fit" @click="beforeView(scope.row.startUrlList)" />
          </template>
        </el-table-column>
        <el-table-column prop="endTowerMark" label="终点杆塔" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.endTowerMark }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="endUrl" label="杆塔图片">
          <template slot-scope="scope">
            <el-image style="width: 100px; height: 100px" :src="scope.row.endUrl" fit="fit" @click="beforeView(scope.row.endUrlList)" />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="130">
          <template slot-scope="scope">

            <el-button type="text" size="small" @click="updateTower(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="delectTower(scope.row)">删除</el-button>
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
    <AlImagePreview :visible="previewVisible" />
    <el-image-viewer v-if="imgViewerVisible" :on-close="closeImgViewer" :url-list="imgList" />
    <!--弹窗 -->
    <TowerDrawer :drawer="drawerVisible" :tower="{...towerInfo}" @update:visible="handleClose" @hand:tower="handTowerLine" />
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
        <el-button slot="trigger" size="mini" type="primary">点击导入</el-button>
        <div slot="tip" class="el-upload__tip">只能上传zip文件，且不超过50M</div>
        <el-button
          style="margin-left: 10px;"
          size="mini"
          type="success"
          @click="submitUpload"
        >提交上传</el-button>
      </el-upload>
    </AlDialog>
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

    .custom-input {
      width: 100px;
    }
  }

}

.media-container {
  flex: 1;
  background-color: #FAFAFA;
  overflow: auto;

  .tower-details{
    display: flex;
    // justify-content: space-between;
  }
}
.demo-table-expand {
    // font-size: 0;
  }
  // .demo-table-expand label {
  //   width: 90px;
  //   color: #99a9bf;
  // }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
