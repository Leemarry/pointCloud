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
        <el-dropdown split-button type="primary" style="margin-left: 5px;" @click="addTowers(reqData)">
          {{ title }}
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="operationType('手动新增',{ operation: 'hand' , id : 0, reqUrl:'/business/hand/addOrupdateTower' })">手动新增</el-dropdown-item>
            <el-dropdown-item @click.native="operationType('批量xlsx导入',{ operation: 'batch' , id : 1, reqUrl:'/business/batch/batchInsertTower' })">批量xlsx导入</el-dropdown-item>
            <el-dropdown-item @click.native="operationType('导入kml坐标',{ operation: 'batchkml' , id : 1, reqUrl:'/business/batch/batchkmlInsertTower' })">导入kml坐标</el-dropdown-item>
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
        <el-table-column prop="mark">
          <template slot="header">
            <span>杆塔号</span>
          </template>
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <h4>其他：</h4>
              <p>塔型:{{ `${scope.row.type ? scope.row.type:'未填写'}` }}</p>
              <p>竣工杆号:{{ `${ scope.row.name ? scope.row.name : '未填写'}` }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.mark }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="geo">
          <template slot="header">
            <span>位置</span>
          </template>
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>经纬度:{{ `${scope.row.lonStr},${scope.row.latStr},${scope.row.absaltStr}` }}</p>
              <div slot="reference" class="name-wrapper">
                <span>{{ `${scope.row.geo},${scope.row.xian},${scope.row.zheng}` }}</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="span" label="档距m">
          <template slot-scope="scope">
            <span>{{ `${scope.row.endSpan? scope.row.endSpan :'未填写'}` }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="terrain" label="地形">
          <template slot-scope="scope">
            <span>{{ `${scope.row.terrain? scope.row.terrain :'未填写'}` }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="des" label="联系">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <h3>村民：{{ scope.row.topTel }}</h3>
              <div slot="reference" class="name-wrapper">
                <span>村干：{{ scope.row.topTel ? `${scope.row.topTel}` : '暂无' }}</span>
                <br>
                <span>村民:{{ scope.row.endTel ? `${scope.row.endTel}` : '暂无' }}</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="lastpath" label="全貌图">
          <template slot-scope="scope">
            <el-image style="width: 100px; height: 100px; cursor: pointer;" :src="scope.row.lastpath" fit="fit" @click="beforeView(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="130">
          <template slot-scope="scope">
            <!-- <template slot="header" slot-scope="scope">
            <span v-if="multipleSelection.length==0">操作</span>
            <el-tag v-else size="small" @click="delectChecked('/media/video/delects')">删除选中</el-tag>
          </template> -->
            <el-button type="text" size="small" @click="updateTower(scope.row)">编辑</el-button>
            <el-popconfirm
              confirm-button-text="是的"
              cancel-button-text="仅附带图片"
              icon="el-icon-info"
              icon-color="red"
              title="确定该杆塔所有信息删除吗？"
              @confirm="delectTower(scope.row,true)"
              @cancel="delectTower(scope.row,false)"
            >
              <el-button slot="reference" type="text">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
        <template slot="header" slot-scope="scope">
          <el-button type="text" size="mini">展开</el-button>
        </template>
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="tower-details">
              <div style="flex: 1;">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="竣工杆号">
                    <span>{{ props.row.name ? props.row.name : '未填写' }}</span>
                  </el-form-item>
                  <el-form-item label="杆塔类型">
                    <span>{{ props.row.type }}</span>
                  </el-form-item>
                  <el-form-item label="维修建议">
                    <span>{{ props.row.advise }}</span>
                  </el-form-item>
                  <el-form-item label="故障隐患">
                    <span>{{ props.row.faultHazard }}</span>
                  </el-form-item>
                  <el-form-item label="前耐张塔">
                    <span>{{ props.row.startTower }}</span>
                  </el-form-item>
                  <el-form-item label="后耐张塔">
                    <span>{{ props.row.endTower }}</span>
                  </el-form-item>
                  <el-form-item label="故障类型">
                    <span>{{ props.row.faultType }}</span>
                  </el-form-item>
                  <el-form-item label="杆塔故障">
                    <span>{{ props.row.towerHazard }}</span>
                  </el-form-item>
                  <el-form-item label="前档距（米）">
                    <span>{{ props.row.startSpan }}</span>
                  </el-form-item>
                  <el-form-item label="后档距（米）">
                    <span>{{ props.row.endSpan }}</span>
                  </el-form-item>
                  <el-form-item label="导线故障">
                    <span>{{ props.row.lineHazard }}</span>
                  </el-form-item>
                  <el-form-item label="绝缘子故障">
                    <span>{{ props.row.insulatorHazard }}</span>
                  </el-form-item>
                  <el-form-item label="塔基面是否硬化">
                    <span>{{ props.row.ishard }}</span>
                  </el-form-item>
                  <el-form-item label="地形">
                    <span>{{ props.row.terrain }}</span>
                  </el-form-item>
                  <el-form-item label="金具故障">
                    <span>{{ props.row.glodHazard }}</span>
                  </el-form-item>
                  <el-form-item label="接地故障">
                    <span>{{ props.row.groundingHazard }}</span>
                  </el-form-item>
                  <el-form-item label="是否跨越">
                    <span>{{ props.row.isCross }}</span>
                  </el-form-item>
                  <el-form-item label="跨越情况">
                    <span>{{ props.row.crossingSituation }}</span>
                  </el-form-item>
                  <el-form-item label="杆塔基础故障">
                    <span>{{ props.row.towerBasicHazard }}</span>
                  </el-form-item>
                  <el-form-item label="故障">
                    <span>{{ props.row.address }}</span>
                  </el-form-item>
                  <el-form-item label="村干联系">
                    <span>{{ props.row.topTel }}</span>
                  </el-form-item>
                  <el-form-item label="村民联系">
                    <span>{{ props.row.endTel }}</span>
                  </el-form-item>
                  <el-form-item v-if="props.row.var1" label="字段1">
                    <span>{{ props.row.var1 }}</span>
                  </el-form-item>
                  <el-form-item v-if="props.row.var2" label="字段2">
                    <span>{{ props.row.var2 }}</span>
                  </el-form-item>
                  <el-form-item v-if="props.row.var3" label="字段3">
                    <span>{{ props.row.var3 }}</span>
                  </el-form-item>
                  <el-form-item v-if="props.row.var4" label="字段4">
                    <span>{{ props.row.var4 }}</span>
                  </el-form-item>
                  <el-form-item v-if="props.row.var5" label="字段5">
                    <span>{{ props.row.var5 }}</span>
                  </el-form-item>
                  <el-form-item v-if="props.row.verticalLineArc" label="导地线弧垂">
                    <span>{{ props.row.verticalLineArc }}</span>
                  </el-form-item>
                  <el-form-item v-if="props.row.lineLineDis" label="导地线间距">
                    <span>{{ props.row.lineLineDis }}</span>
                  </el-form-item>
                  <el-form-item v-if="props.row.lineTowerDis" label="引流线到塔身距离">
                    <span>{{ props.row.lineTowerDis }}</span>
                  </el-form-item>
                  <el-form-item v-if="props.row.towerRotationAngle" label="耐张塔转角度数">
                    <span>{{ props.row.towerRotationAngle }}</span>
                  </el-form-item>
                </el-form>
              </div>
              <!-- <div style="width: 40%; display: flex;">
                <div v-for="(item, index) in 4" :key="index" style="display: flex; flex-direction: column ; flex: 1;">
                  <label for="">图片{{ index }}:</label>
                  <el-image style="width: 100px; height: 100px" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" fit="fit" />
                </div>
              </div> -->
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
    <TowerDrawer :drawer="drawerVisible" :tower="{...towerInfo}" @update:visible="handleClose" @hand:tower="handTower" />
    <KmlDrawer :drawer="kmlVisible" :title="title" :reqdata="reqData" @update:visible="handleClosekml" @hand:tower="handTower" @visible:close="(v)=>{kmlVisible=v}" />
    <AlDialog title="弹窗" :visible="dialogVisible" height="200px" width="280px" @close="dialogVisible = false">
      <el-upload
        ref="upload"
        class="upload-demo"
        action="/"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        :on-preview="handlePreview"
        size="mini"
        :before-remove="beforeRemove"
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="false"
        :on-change="changeFile"
      >
        <el-button slot="trigger" size="mini" type="primary">点击导入</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xlsx文件，且不超过50M</div>
        <el-button
          style="margin-left: 10px;"
          size="mini"
          type="success"
          @click="submitUploadExcel"
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
    padding: 2px 20px;
  }
}
  .demo-table-expand .el-form-item {
    margin-right: 0px;
    margin-bottom: 0;
    width: 24%;
  }
</style>
