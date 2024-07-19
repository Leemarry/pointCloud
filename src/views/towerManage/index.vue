<!--  -->
<template>
  <div class='media'>
    <div class='media-top'>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="杆塔数目">
          <el-input v-model="formInline.total" placeholder="杆塔数目" disabled class='custom-input'></el-input>
        </el-form-item>
        <el-form-item label="杆塔描述">
          <el-input v-model="formInline.name" placeholder="杆塔标注详情..."></el-input>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-col :span="12">
            <!-- <el-date-picker type="date" placeholder="选择日期" v-model="formInline.date1" style="width: 100%;"></el-date-picker> -->
            <el-date-picker v-model="formInline.startTime" type="datetime" placeholder="选择起始时间" align="right" :picker-options="pickerOptions">
            </el-date-picker>
          </el-col>
          <el-col class="line" :span="2">至</el-col>
          <el-col :span="10">
            <el-date-picker v-model="formInline.endTime" type="datetime" placeholder="选择日期时间" default-time="12:00:00">
            </el-date-picker>
          </el-col>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="queryPhotolist()">查询</el-button>
        <el-button type="primary" @click="openUploadDialog()">新增</el-button>
      </div>
    </div>
    <div class='media-container'>
      <el-table :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)" stripe height="100%" style="width: 100%">
        <el-table-column prop="date" label="日期" width="120" >
        </el-table-column>
        <el-table-column prop="name" label="杆塔标注" width="150">
          <template slot-scope="scope">
            <el-tag size="medium">{{ scope.row.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="fileType" label="位置">
          <span>{{ `111.4444,52.3666665` }}</span>
        </el-table-column>
        <el-table-column prop="fileSize" label="高度">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <h3>危险点与电力线</h3>
              <p>水平:{{ `${Math.floor(Math.random() * 1000)} km` }}</p>
              <p>垂直:{{ `${Math.floor(Math.random() * 1000)} km` }}</p>
              <p>净空距离:{{ `${Math.floor(Math.random() * 1000)} km` }}</p>
              <div slot="reference" class="name-wrapper">
                <span>{{ `${Math.floor(Math.random() * 1000)} km/${Math.floor(Math.random() * 1000)} km/${Math.floor(Math.random() * 1000)} km` }}</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="fileUrl" label="俯视图">
          <el-image style="width: 100px; height: 100px" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" fit="fit"></el-image>
        </el-table-column>
        <el-table-column prop="fileUrl" label="全貌图">
          <el-image style="width: 100px; height: 100px" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" fit="fit"></el-image>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button type="text" size="small" @click='downimg()'>编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column type="expand">
          <!-- <template slot="header" slot-scope="scope">
            <el-button type="text" size="mini">展开</el-button>
          </template> -->
          <!-- 根据规划的巡检航线可实现对杆塔部位采集可见光图片，
            拍摄部位应包括塔全貌、塔头、塔身、杆号牌、塔基、导线端挂点、绝缘子整串、横担端挂点、地线、跳线、小号侧通道和大号侧通道 -->
          <template slot-scope="props">
            <div class='tower-details'>
            <div style='flex: 1;'> 
              <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="杆号牌">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="绝缘子整串状态">
                <span>{{ props.row.shop }}</span>
              </el-form-item>
              <el-form-item label="其他详情">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="其他详情">
                <span>{{ props.row.desc }}</span>
              </el-form-item>
              <el-form-item label="杆号牌">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="绝缘子整串状态">
                <span>{{ props.row.shop }}</span>
              </el-form-item>
              <el-form-item label="其他详情">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="其他详情">
                <span>{{ props.row.desc }}</span>
              </el-form-item>
              <el-form-item label="杆号牌">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="绝缘子整串状态">
                <span>{{ props.row.shop }}</span>
              </el-form-item>
              <el-form-item label="其他详情">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="其他详情">
                <span>{{ props.row.desc }}</span>
              </el-form-item>
              <el-form-item label="杆号牌">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="绝缘子整串状态">
                <span>{{ props.row.shop }}</span>
              </el-form-item>
              <el-form-item label="其他详情">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="其他详情">
                <span>{{ props.row.desc }}</span>
              </el-form-item>
            </el-form>
            </div>
            <div style='width: 70%; display: flex;' >
              <div style='display: flex; flex-direction: column ; flex: 1;' v-for='(item, index) in 5' :key='index'>
                <label for="">图片{{ index }}:</label>
                <el-image style="width: 100px; height: 100px" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" fit="fit"></el-image>
              </div>
            </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class='media-footer'>
      <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[1, 5, 10, 20]" :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
      </el-pagination>
    </div>
    <AlDialog title='弹窗' :visible="dialogVisible" height='200px' width='280px' @close="dialogVisible = false">
      <el-upload class="upload-demo" ref="upload" action="/" :on-preview="handlePreview" size="mini" :before-remove="beforeRemove" :on-remove="handleRemove" :file-list="fileList" :auto-upload="false"
        :on-change="changeFile">
        <el-button slot="trigger" size="mini" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传zip文件，且不超过50M</div>
      </el-upload>
    </AlDialog>
    <AlImagePreview :visible='previewVisible'></AlImagePreview>
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