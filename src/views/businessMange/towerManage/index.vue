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
            <el-date-picker v-model="formInline.startTime" type="datetime" placeholder="选择起始时间" align="right"
              :picker-options="pickerOptions" />
          </el-col>
          <el-col class="line" :span="2">至</el-col>
          <el-col :span="10">
            <el-date-picker v-model="formInline.endTime" type="datetime" placeholder="选择日期时间" default-time="12:00:00" />
          </el-col>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="queryTowerlist2()">查询</el-button>
        <el-dropdown split-button type="primary" style="margin-left: 5px;" @click="addTowers(reqData)">
          {{ title }}
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              @click.native="operationType('手动新增', { operation: 'hand', id: 0, reqUrl: '/business/hand/addOrupdateTower' })">手动新增</el-dropdown-item>
            <el-dropdown-item
              @click.native="operationType('批量xlsx导入', { operation: 'batch', id: 1, reqUrl: '/business/batch/batchInsertTower' })">批量xlsx导入</el-dropdown-item>
            <el-dropdown-item
              @click.native="operationType('导入kml坐标', { operation: 'batchkml', id: 1, reqUrl: '/business/batch/batchkmlInsertTower' })">导入kml坐标</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="media-container">
      <el-table :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)" stripe height="100%"
        style="width: 100%">
        <el-table-column prop="createTime" label="日期">
          <template slot-scope="scope">
            <span size="medium">{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mark">
          <template slot="header">
            <span>杆塔号</span>
          </template>
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <h4>其他：</h4>
              <p>塔型:{{ `${scope.row.type ? scope.row.type : '未填写'}` }}</p>
              <p>竣工杆号:{{ `${scope.row.isCross ? scope.row.isCross : '未填写'}` }}</p>
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
                <span>
                  <span v-if="
                    scope.row.geo !== null &&
                    scope.row.geo !== undefined &&
                    scope.row.geo.trim() !== '' &&
                    scope.row.geo !== '空' &&
                    scope.row.geo !== '无'
                  ">
                    {{ scope.row.geo }}
                  </span>
                  <span v-if="
                    scope.row.xian !== null &&
                    scope.row.xian !== undefined &&
                    scope.row.xian.trim() !== '' &&
                    scope.row.xian !== '空' &&
                    scope.row.xian !== '无'
                  ">
                    ,{{ scope.row.xian }}
                  </span>
                  <span v-if="
                    scope.row.zheng !== null &&
                    scope.row.zheng !== undefined &&
                    scope.row.zheng.trim() !== '' &&
                    scope.row.zheng !== '空' &&
                    scope.row.zheng !== '无'
                  ">
                    ,{{ scope.row.zheng }}
                  </span>
                </span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="span" label="档距m">
          <template slot-scope="scope">
            <span>{{ `${scope.row.endSpan ? scope.row.endSpan : '未填写'}` }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="terrain" label="地形">
          <template slot-scope="scope">
            <span>{{ `${scope.row.terrain ? scope.row.terrain : '未填写'}` }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="des" label="联系">
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
        </el-table-column> -->
        <el-table-column prop="lastpath" label="全貌图">
          <template slot-scope="scope">
            <el-image style="width: 100px; height: 100px; cursor: pointer;" :src="scope.row.lastpath" fit="fit"
              @click="beforeView(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="130">
          <template slot-scope="scope">
            <!-- <template slot="header" slot-scope="scope">
            <span v-if="multipleSelection.length==0">操作</span>
            <el-tag v-else size="small" @click="delectChecked('/media/video/delects')">删除选中</el-tag>
          </template> -->
            <el-button type="text" size="small" @click="updateTower(scope.row)">编辑</el-button>
            <el-popconfirm confirm-button-text="是的" cancel-button-text="仅附带图片" icon="el-icon-info" icon-color="red"
              title="确定该杆塔所有信息删除吗？" @confirm="delectTower(scope.row, true)" @cancel="delectTower(scope.row, false)">
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
                    <span>{{ props.row.isCross ? props.row.isCross : '未填写' }}</span>
                  </el-form-item>
                  <el-form-item label="杆塔类型">
                    <span>{{ props.row.type }}</span>
                  </el-form-item>
                  <!-- 绝缘子故障 -->
                  <el-form-item label="绝缘子">
                    <span>{{ props.row.insulatorHazard }}</span>
                  </el-form-item>
                  <!-- 跨越情况  -->
                  <el-form-item label="基础跟开">
                    <span>{{ props.row.crossingSituation }}</span>
                  </el-form-item>
                  <!-- 1 -->
                  <el-form-item v-if="props.row.var1" label="基坑深">
                    <span>{{ props.row.var1 }}</span>
                  </el-form-item>
                  <el-form-item v-if="props.row.var2" label="基础混凝土">
                    <span>{{ props.row.var2 }}</span>
                  </el-form-item>
                  <el-form-item v-if="props.row.var3" label="防振锤">
                    <span>{{ props.row.var3 }}</span>
                  </el-form-item>
                  <el-form-item v-if="props.row.var4" label="接地装置">
                    <span>{{ props.row.var4 }}</span>
                  </el-form-item>
                  <el-form-item v-if="props.row.var5" label="阻值要求">
                    <span>{{ props.row.var5 }}</span>
                  </el-form-item>
                  <el-form-item label="维修建议" v-if="
                    props.row.advise !== null &&
                    props.row.advise !== undefined &&
                    typeof props.row.advise === 'string' &&
                    props.row.advise.trim() !== '' &&
                    props.row.advise !== '空' &&
                    props.row.advise !== '无'
                  ">
                    <span>
                      {{ props.row.advise }}
                    </span>
                  </el-form-item>
                  <el-form-item label="故障隐患" v-if="
                    props.row.faultHazard !== null &&
                    props.row.faultHazard !== undefined &&
                    typeof props.row.faultHazard === 'string' &&
                    props.row.faultHazard.trim() !== '' &&
                    props.row.faultHazard !== '空' &&
                    props.row.faultHazard !== '无'
                  ">
                    <span>
                      {{ props.row.faultHazard }}
                    </span>
                  </el-form-item>
                  <el-form-item label="前耐张塔" v-if="
                    props.row.startTower !== null &&
                    props.row.startTower !== undefined &&
                    typeof props.row.startTower === 'string' &&
                    props.row.startTower.trim() !== '' &&
                    props.row.startTower !== '空' &&
                    props.row.startTower !== '无'
                  ">
                    <span>
                      {{ props.row.startTower }}
                    </span>
                  </el-form-item>
                  <el-form-item label="后耐张塔" v-if="
                    props.row.endTower !== null &&
                    props.row.endTower !== undefined &&
                    typeof props.row.endTower === 'string' &&
                    props.row.endTower.trim() !== '' &&
                    props.row.endTower !== '空' &&
                    props.row.endTower !== '无'
                  ">
                    <span>
                      {{ props.row.endTower }}
                    </span>
                  </el-form-item>
                  <el-form-item label="故障类型" v-if="
                    props.row.faultType !== null &&
                    props.row.faultType !== undefined &&
                    typeof props.row.faultType === 'string' &&
                    props.row.faultType.trim() !== '' &&
                    props.row.faultType !== '空' &&
                    props.row.faultType !== '无'
                  ">
                    <span>
                      {{ props.row.faultType }}
                    </span>
                  </el-form-item>
                  <el-form-item label="杆塔故障" v-if="
                    props.row.towerHazard !== null &&
                    props.row.towerHazard !== undefined &&
                    typeof props.row.towerHazard === 'string' &&
                    props.row.towerHazard.trim() !== '' &&
                    props.row.towerHazard !== '空' &&
                    props.row.towerHazard !== '无'
                  ">
                    <span>
                      {{ props.row.faultType }}
                    </span>
                  </el-form-item>
                  <el-form-item label="前档距（米）" v-if="
                    props.row.startSpan !== null &&
                    props.row.startSpan !== undefined &&
                    typeof props.row.startSpan === 'string' &&
                    props.row.startSpan.trim() !== '' &&
                    props.row.startSpan !== '空' &&
                    props.row.startSpan !== '无'
                  ">
                    <span>
                      {{ props.row.startSpan }}
                    </span>
                  </el-form-item>
                  <el-form-item label="后档距（米）" v-if="
                    props.row.endSpan !== null &&
                    props.row.endSpan !== undefined &&
                    typeof props.row.endSpan === 'string' &&
                    props.row.endSpan.trim() !== '' &&
                    props.row.endSpan !== '空' &&
                    props.row.endSpan !== '无'
                  ">
                    <span>
                      {{ props.row.endSpan }}
                    </span>
                  </el-form-item>
                  <el-form-item label="导线故障" v-if="
                    props.row.lineHazard !== null &&
                    props.row.lineHazard !== undefined &&
                    typeof props.row.lineHazard === 'string' &&
                    props.row.lineHazard.trim() !== '' &&
                    props.row.lineHazard !== '空' &&
                    props.row.lineHazard !== '无'
                  ">
                    <span>
                      {{ props.row.lineHazard }}
                    </span>
                  </el-form-item>
                  <el-form-item label="塔基面是否硬化" v-if="
                    props.row.ishard !== null &&
                    props.row.ishard !== undefined &&
                    typeof props.row.ishard === 'string' &&
                    props.row.ishard.trim() !== '' &&
                    props.row.ishard !== '空' &&
                    props.row.ishard !== '无'
                  ">
                    <span>
                      {{ props.row.ishard }}
                    </span>
                  </el-form-item>
                  <el-form-item label="地形" v-if="
                    props.row.terrain !== null &&
                    props.row.terrain !== undefined &&
                    typeof props.row.terrain === 'string' &&
                    props.row.terrain.trim() !== '' &&
                    props.row.terrain !== '空' &&
                    props.row.terrain !== '无'
                  ">
                    <span>
                      {{ props.row.terrain }}
                    </span>
                  </el-form-item>
                  <el-form-item label="金具故障" v-if="
                    props.row.glodHazard !== null &&
                    props.row.glodHazard !== undefined &&
                    typeof props.row.glodHazard === 'string' &&
                    props.row.glodHazard.trim() !== '' &&
                    props.row.glodHazard !== '空' &&
                    props.row.glodHazard !== '无'
                  ">
                    <span>
                      {{ props.row.glodHazard }}
                    </span>
                  </el-form-item>
                  <el-form-item label="接地故障" v-if="
                    props.row.groundingHazard !== null &&
                    props.row.groundingHazard !== undefined &&
                    typeof props.row.groundingHazard === 'string' &&
                    props.row.groundingHazard.trim() !== '' &&
                    props.row.groundingHazard !== '空' &&
                    props.row.groundingHazard !== '无'
                  ">
                    <span>
                      {{ props.row.groundingHazard }}
                    </span>
                  </el-form-item>
                  <!-- <el-form-item label="是否跨越">
                    <span>{{ props.row.isCross }}</span>
                  </el-form-item> -->
                  <el-form-item label="杆塔基础故障" v-if="
                    props.row.towerBasicHazard !== null &&
                    props.row.towerBasicHazard !== undefined &&
                    typeof props.row.towerBasicHazard === 'string' &&
                    props.row.towerBasicHazard.trim() !== '' &&
                    props.row.towerBasicHazard !== '空' &&
                    props.row.towerBasicHazard !== '无'
                  ">
                    <span>
                      {{ props.row.towerBasicHazard }}
                    </span>
                  </el-form-item>
                  <el-form-item label="故障" v-if="
                    props.row.address !== null &&
                    props.row.address !== undefined &&
                    typeof props.row.address === 'string' &&
                    props.row.address.trim() !== '' &&
                    props.row.address !== '空' &&
                    props.row.address !== '无'
                  ">
                    <span>
                      {{ props.row.address }}
                    </span>
                  </el-form-item>
                  <el-form-item label="村干联系" v-if="
                    props.row.topTel !== null &&
                    props.row.topTel !== undefined &&
                    typeof props.row.topTel === 'string' &&
                    props.row.topTel.trim() !== '' &&
                    props.row.topTel !== '空' &&
                    props.row.topTel !== '无'
                  ">
                    <span>
                      {{ props.row.topTel }}
                    </span>
                  </el-form-item>
                  <el-form-item label="村民联系" v-if="
                    props.row.endTel !== null &&
                    props.row.endTel !== undefined &&
                    typeof props.row.endTel === 'string' &&
                    props.row.endTel.trim() !== '' &&
                    props.row.endTel !== '空' &&
                    props.row.endTel !== '无'
                  ">
                    <span>
                      {{ props.row.endTel }}
                    </span>
                  </el-form-item>
                  <el-form-item label="导地线弧垂" v-if="
                    props.row.verticalLineArc !== null &&
                    props.row.verticalLineArc !== undefined &&
                    typeof props.row.verticalLineArc === 'string' &&
                    props.row.verticalLineArc.trim() !== '' &&
                    props.row.verticalLineArc !== '空' &&
                    props.row.verticalLineArc !== '无'
                  ">
                    <span>
                      {{ props.row.verticalLineArc }}
                    </span>
                  </el-form-item>
                  <el-form-item label="导地线间距" v-if="
                    props.row.lineLineDis !== null &&
                    props.row.lineLineDis !== undefined &&
                    typeof props.row.lineLineDis === 'string' &&
                    props.row.lineLineDis.trim() !== '' &&
                    props.row.lineLineDis !== '空' &&
                    props.row.lineLineDis !== '无'
                  ">
                    <span>
                      {{ props.row.lineLineDis }}
                    </span>
                  </el-form-item>
                  <el-form-item label="引流线到塔身距离" v-if="
                    props.row.lineTowerDis !== null &&
                    props.row.lineTowerDis !== undefined &&
                    typeof props.row.lineTowerDis === 'string' &&
                    props.row.lineTowerDis.trim() !== '' &&
                    props.row.lineTowerDis !== '空' &&
                    props.row.lineTowerDis !== '无'
                  ">
                    <span>
                      {{ props.row.lineTowerDis }}
                    </span>
                  </el-form-item>
                  <el-form-item label="耐张塔转角度数" v-if="
                    props.row.towerRotationAngle !== null &&
                    props.row.towerRotationAngle !== undefined &&
                    typeof props.row.towerRotationAngle === 'string' &&
                    props.row.towerRotationAngle.trim() !== '' &&
                    props.row.towerRotationAngle !== '空' &&
                    props.row.towerRotationAngle !== '无'
                  ">
                    <span>
                      {{ props.row.towerRotationAngle }}
                    </span>
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
      <el-pagination align="center" :current-page="currentPage" :page-sizes="[1, 5, 10, 20]" :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="tableData.length" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
    <AlImagePreview :visible="previewVisible" />
    <el-image-viewer v-if="imgViewerVisible" :on-close="closeImgViewer" :url-list="imgList" />
    <!--弹窗 -->
    <TowerDrawer :drawer="drawerVisible" :tower="{ ...towerInfo }" @update:visible="handleClose"
      @hand:tower="handTower" />
    <KmlDrawer :drawer="kmlVisible" :title="title" :reqdata="reqData" @update:visible="handleClosekml"
      @hand:tower="handTower" @visible:close="(v) => { kmlVisible = v }" />
    <AlDialog title="弹窗" :visible="dialogVisible" height="200px" width="280px" @close="dialogVisible = false">
      <el-upload ref="upload" class="upload-demo" action="/"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" :on-preview="handlePreview"
        size="mini" :before-remove="beforeRemove" :on-remove="handleRemove" :file-list="fileList" :auto-upload="false"
        :on-change="changeFile">
        <el-button slot="trigger" size="mini" type="primary">点击导入</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xlsx文件，且不超过50M</div>
        <el-button style="margin-left: 10px;" size="mini" type="success" @click="submitUploadExcel">提交上传</el-button>
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

  .tower-details {
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
