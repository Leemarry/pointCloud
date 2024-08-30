<template>
  <div class="container">
    <dv-border-box-12>
      <div class="fullscreencontainer">
        <div class="head">
          <div class="mainleft" style="justify-content: bottom">
            <dv-decoration-1 style="width:200px;height:40px;" />
            <realDatetime />
          </div>
          <div class="mainMiddle ">
            <span class="headText">
              <dv-decoration-7 style="width:auto;height:30px;">{{ '智能无人机杆塔巡线平台' }}</dv-decoration-7>
            </span>
            <dv-decoration-5 style="width:100%;height:30px;" />
          </div>
          <div class="mainRight">
            <el-image v-if="logo" :src="logo" class="sidebar-logo" fit="contain">
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
              <div slot="error" class="image-slot">
                <!-- <i class="el-icon-picture-outline"></i> -->
                <i class="el-icon-picture" />
              </div>
            </el-image>
            <!-- <dv-decoration-8 :reverse="true" style="width:100%;height:40px;" /> -->
            <div style="height:50%;text-align:right;" @mouseover="isHeaderMouse = true" @mouseout="isHeaderMouse = false">
              <router-link to="/mediaManage" style="color:#3de7c9;margin-right:15px;font-size:12px"><i class="el-icon-s-home" />
                进入平台</router-link>
              <el-button type="text" style="color:#3de7c9;font-size:12px;margin-right:15px;" @click="logout"><i class="el-icon-switch-button" />
                退出系统</el-button>
            </div>
          </div>
        </div>
        <div v-loading="mixinsLoading" class="main" element-loading-text="拼命加载中" element-loading-background="rgba(0, 0, 0, 0.8)">
          <div ref="mainleft" class="mainleft">
            <dv-border-box-7 class="main_left_uav_count">
              <div class="main_left_uav_count_body">
                <el-row :gutter="10">
                  <el-col :span="11">
                    <div class="uav_count">无人杆塔数量</div>
                  </el-col>
                  <el-col :span="13">
                    <div class="uav_item">当前杆塔编号</div>
                  </el-col>
                  <el-col :span="10">
                    <div class="uav_num">
                      <dv-digital-flop :config="numberAllUavCount" style="width:100px;height:50px;display: inline-block;" />
                    </div>
                  </el-col>
                  <el-col :span="14">
                    <div class="uav_iteminfo">
                      <div v-if="defaultTowerMark === null ||defaultTowerMark == ''" class="no_uav"><i class="el-icon-warning-outline">未选中</i></div>
                      <div class="haveSn">{{ defaultTowerMark }}</div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </dv-border-box-7>
            <div class="main_right_parms_title" @click="senddoFlyCommandsEvent(1006)">杆塔列表</div>
            <dv-border-box-7 class="main_left_uav">
              <div class="main_left_uav_body">
                <el-date-picker
                  v-model="value1"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['3:00:00', '23:00:00']"
                  @change="handleChange"
                />
                <div v-if="tableData.length>0" class="uav-list">
                  <el-scrollbar style="width:98%" wrap-style="overflow-x:hidden;flex:1">
                    <el-row v-for="(item,index) in tableData" :key="index" :gutter="1" justify="flex" align="middle" style="margin:8px">
                      <TowerItem ref="TowerItem" :uav-name="item.mark" :uav-sn="item.id" :online="item.checked" :cloudchecked="item.cloudChecked" @click.native="clickTowerItem(item)" @sendOpenWeb="OpenWeb" @sendToFocus="toFocus" @sendShowCloud="showCloud" @sendHideCloud="hideCloud" />
                    </el-row>
                  </el-scrollbar>
                </div>
                <div v-else class="no_uav"><i class="el-icon-warning-outline">未绑定杆塔信息</i></div>
              </div>
            </dv-border-box-7>
            <div class="main_right_parms_title" @click="createWebWorker()">航线任务</div>
            <dv-border-box-7 class="main_left_exception">
              <div class="main_left_routes_body">
                <div class="statistics-top-box">
                  <el-row>
                    <el-col :span="4">
                      <div style="text-align: center;" :class="{cursorStyle:true, active: isActive == '1' }" @click="SelectTime(1)">半年</div>
                    </el-col>
                    <el-col :span="4">
                      <div style="text-align: center;" :class="{ cursorStyle:true, active: isActive == '3' }" @click="SelectTime(3)">本月</div>
                    </el-col>
                    <el-col :span="4">
                      <div style="text-align: center;" :class="'cursorStyle' + (isActive == '2' ? 'active' :'') " @click="SelectTime(2)">本周</div>
                    </el-col>
                    <el-col :span="9">
                      <i style="margin:0px 5px; float: right;" title="解析航线" class="iconfont  icon-hangxianxinxi cursorStyle" :class="{ disabled: maploading }" @click="maploading ? null :openVideoTag()" />
                    </el-col>
                  </el-row>
                </div>
                <el-scrollbar v-if="!tasksLoading" class="scrollbar" style="width:98%;" wrap-style="overflow-x:hidden;flex:1;font-size:small;">
                  <div v-for="(item,index) in kmzData.slice((currentPage-1)*pagesize,currentPage*pagesize)" :key="index" :class="'route_item plusInborder cursorStyle' + (currentIndex === index ? ' showplusInborder' : '')" @click="changeColor(index,item)">
                    <span>{{ time(item.kmzUpdateTime) }}</span>
                    <span>{{ item.kmzName }}</span>
                  </div>
                </el-scrollbar>
                <div v-else v-loading="tasksLoading" class="scrollbar" element-loading-text="正在加载中" element-loading-background="rgba(15, 15, 15, 0.3)" />
                <div class="pageNaN">
                  <el-pagination class="pagination" layout="prev, pager, next" :pager-count="5" :current-page.sync="currentPage" :total="tasksRoutes.length" :page-size="pagesize" @current-change="current_change" />
                </div>
              </div>
            </dv-border-box-7>
          </div>
          <div ref="mainMiddle" v-loading="maploading" element-loading-spinner="el-icon-loading" :element-loading-text="loadingText" :element-loading-background="this.loadingBackground" class="mainMiddle height-calc zindex include_cesium_blocks">
            <CesiumMap ref="CesiumMap" :visible="CesiumDrawVisible" :maploading="maploading" :tasks-routes="tasksRoutes" :tasks-name="tasksName" :default-uav-sn="defaultUavSn" @senddoFlyCommands="senddoFlyCommandsEvent" @getClickPoint="getClickPoint" />
            <div v-show="isMap" class="drawButton">
              <i class="el-icon-edit clickstyle" :title="'绘制'" @click="CesiumDrawVisible=!CesiumDrawVisible" />
            </div>
          </div>
          <div class="mainRight">
            <dv-border-box-7 class="main_right_hud">
                <el-image :src="clickPhoto&&clickPhoto.path" style="width: 100%; height: 200px;">
                    <div slot="placeholder" class="image-slot">
                      加载中<span class="dot">...</span>
                    </div>
                  </el-image>
            </dv-border-box-7>
            <div class="main_right_parms_title">杆塔数据</div>
            <dv-border-box-7 class="main_right_parms  hei500">
              <template v-if="defaultTowerInfo.photos&&defaultTowerInfo.photos.length>0">
                <virtual-list
                  class="list virtual-list"
                  style="height:calc(100% - 2px); overflow-y: auto;"
                  :data-key="'id'"
                  :data-sources="defaultTowerInfo.photos"
                  :data-component="EImage"
                  :estimate-size="50"
                  :extra-props="{
                    itemClick: itemClick,
                    current: current
                  }"
                />
              </template>
              <template v-else>
                <el-image v-for="fit in 2" :key="fit" style="width: 100%; height: 200px;" title="暂无图片">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline" title="暂无图片数据" />
                  </div>
                </el-image>
              </template>
            </dv-border-box-7>
          </div>
        </div>

      </div>
    </dv-border-box-12>
  </div>
</template>

<script src="./index.js"></script>
<style lang="scss" src="./index.scss" scoped></style>
