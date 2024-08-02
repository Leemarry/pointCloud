<!--  -->
<template>
  <div v-loading="mixinsLoading" element-loading-background="rgba(0, 0, 0, 0.3)" class="media">
    <div class="media-top">
      <el-form :inline="true" :rules="rules" :model="formInline" class="demo-form-inline">
        <el-form-item label="杆塔数目">
          <el-input v-model="formInline.total" placeholder="杆塔数目" disabled class="custom-input" />
        </el-form-item>
        <el-form-item label="杆塔描述" prop="mark">
          <el-input v-model="formInline.mark" placeholder="杆塔标注详情..." />
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
        <el-button type="primary" @click="queryTowerlist()">查询</el-button>
        <el-button type="primary" @click="addTower()">新增</el-button>
      </div>
    </div>
    <div class="media-container">
      <el-table :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)" stripe height="100%" style="width: 100%">
        <el-table-column prop="createTime" label="日期" width="120">
          <template slot-scope="scope">
            <span size="medium">{{ parseTime(scope.row.createTime ) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="杆塔标注" width="150">
          <template slot-scope="scope">
            <el-tag size="medium">{{ scope.row.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="fileType" label="经纬高">
          <template slot-scope="scope">
            <span>{{ `${scope.row.lon},${scope.row.lat},${scope.row.alt}` }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="des" label="描述">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <h3>其他：</h3>
              <p>导地线弧垂:{{ `${scope.row.lineLineDis}m` }}</p>
              <p>导地线间距:{{ `${scope.row.lineLineDis}m` }}</p>
              <div slot="reference" class="name-wrapper">
                <span>{{ scope.row.des ? `${scope.row.des}` : '暂无' }}</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="lastpath" label="全貌图">
          <template slot-scope="scope">
            <el-image style="width: 100px; height: 100px" :src="scope.row.lastpath" fit="fit" />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="beforeView(scope.row)">查看</el-button>
            <el-button type="text" size="small" @click="updateTower(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column type="expand">
          <!-- <template slot="header" slot-scope="scope">
            <el-button type="text" size="mini">展开</el-button>
          </template> -->
          <!-- 根据规划的巡检航线可实现对杆塔部位采集可见光图片，
            拍摄部位应包括塔全貌、塔头、塔身、杆号牌、塔基、导线端挂点、绝缘子整串、横担端挂点、地线、跳线、小号侧通道和大号侧通道 -->
          <template slot-scope="props">
            <div class="tower-details">
              <div style="flex: 1;">
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
              <div style="width: 70%; display: flex;">
                <div v-for="(item, index) in 5" :key="index" style="display: flex; flex-direction: column ; flex: 1;">
                  <label for="">图片{{ index }}:</label>
                  <el-image style="width: 100px; height: 100px" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" fit="fit" />
                </div>
              </div>
            </div>
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
    <TowerDrawer :drawer="drawerVisible" :tower="{...towerInfo}" @update:visible="handleClose" />
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
