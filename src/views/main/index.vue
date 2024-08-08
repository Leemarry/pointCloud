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
        <div v-loading="loading" class="main" element-loading-text="拼命加载中" element-loading-background="rgba(0, 0, 0, 0.8)">
          <div ref="mainleft" class="mainleft">
            <dv-border-box-7 class="main_left_uav_count">
              <div class="main_left_uav_count_body">
                <el-row :gutter="10">
                  <el-col :span="11">
                    <div class="uav_count">无人机总数</div>
                  </el-col>
                  <el-col :span="13">
                    <div class="uav_item">当前无人机</div>
                  </el-col>
                  <el-col :span="10">
                    <div class="uav_num">
                      <dv-digital-flop :config="numberAllUavCount" style="width:100px;height:50px;display: inline-block;" />
                    </div>
                  </el-col>
                  <el-col :span="14">
                    <div class="uav_iteminfo">
                      <div v-if="defaultUavSn === null ||defaultUavSn == ''" class="no_uav"><i class="el-icon-warning-outline">未选中</i></div>
                      <div class="haveSn">{{ defaultUavSn }}</div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </dv-border-box-7>
            <div class="main_right_parms_title" @click="senddoFlyCommandsEvent(1006)">无人机</div>
            <dv-border-box-7 class="main_left_uav">
              <div class="main_left_uav_body">
                <div v-if="uavs.length>0" class="uav-list">
                  <!-- <label class="label-text">巡检无人机</label> -->
                  <el-scrollbar style="width:98%" wrap-style="overflow-x:hidden;flex:1">
                    <el-row v-for="(item,index) in uavs" :key="index" :gutter="1" justify="flex" align="middle" style="margin:8px">
                      <uavItem ref="uavItems" :uav-name="item.uavName" :uav-sn="item.uavId" :online="item.online" @dblclick.native="cameraSettingVisible = !cameraSettingVisible" @click.native="clickUavItem(item)" />
                    </el-row>
                  </el-scrollbar>
                </div>
                <div v-else class="no_uav"><i class="el-icon-warning-outline">未绑定无人机</i></div>
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
                      <!-- <el-button disabled></el-button> -->
                      <i style="margin:0px 5px; float: right;" title="上传无人机" class="iconfont icon-icon_update cursorStyle" :class="{ disabled: maploading }" @click="maploading ? null : uploadKmzBefore()" />
                      <i style="margin:0px 5px; float: right;" title="解析航线" class="iconfont  icon-hangxianxinxi cursorStyle" :class="{ disabled: maploading }" @click="maploading ? null :readerKml()" />
                    </el-col>
                  </el-row>
                </div>
                <el-scrollbar v-if="!tasksLoading" class="scrollbar" style="width:98%;" wrap-style="overflow-x:hidden;flex:1;font-size:small;">
                  <div v-for="(item,index) in tasksRoutes.slice((currentPage-1)*pagesize,currentPage*pagesize)" :key="index" :class="'route_item plusInborder cursorStyle' + (currentIndex === index ? ' showplusInborder' : '')" @click="changeColor(index,item)">
                    <span>{{ time(item.kmzUpdateTime) }}</span>
                    <span>{{ item.kmzName }}</span>
                  </div>

                </el-scrollbar>
                <div v-else v-loading="tasksLoading" class="scrollbar" element-loading-text="正在加载中" element-loading-background="rgba(15, 15, 15, 0.3)" />
                <div class="pageNaN">
                  <el-pagination class="pagination" layout="prev, pager, next" :pager-count="5" :current-page.sync="currentPage" :total="tasksRoutes.length" :page-size="pagesize" @current-change="current_change" />
                  <!-- <scrollbar :total="tasksRoutes.length" :pagesize="pagesize" :currentpagesync="currentPage"></scrollbar> -->
                </div>
              </div>

            </dv-border-box-7>
            <!-- v-Focus:color="'yellow'" -->
            <div ref="opp" class="main_right_parms_title" @click="reElement">巡检视频</div>
            <!-- <button v-copy="copyText">复制</button> -->
            <dv-border-box-7 class="main_left_total">
              <VideoModule id="VideoModule" ref="VideoModule" :default-uav-info="defaultUavInfo" @send:switchMapOrVideo="switchMapOrVideo" />
              <!-- <CesiumMap ref="CesiumMap" :visible="CesiumDrawVisible" :tasksRoutes="tasksRoutes" :defaultUavSn="defaultUavSn" @senddoFlyCommands='senddoFlyCommandsEvent'></CesiumMap> -->
            </dv-border-box-7>
          </div>
          <!-- rgba(0, 0, 0, ${this.newOpacity}) -->
          <div ref="mainMiddle" v-loading="maploading" element-loading-spinner="el-icon-loading" :element-loading-text="loadingText" :element-loading-background="this.loadingBackground" class="mainMiddle height-calc zindex include_cesium_blocks" :style="{ height: divHeight + 'px' }">
            <!-- 组件 videoViews -->
            <!-- <op></op> -->
            <!-- <div v-show="true" class="ToLockTheViewport">
                            <div class="margin-b">
                                <div class="paddbut">
                                    <i :class="this.whetherToLockTheViewport?'el-icon-lock':'el-icon-unlock'" style="margin-right:6px"></i>
                                    <!== <img src="../../assets/images/startRoute.png" alt="" style="margin-right:6px"> ==>
                                    <span>{{this.whetherToLockTheViewport ? '已锁定' :'锁定视口' }}</span>
                                </div>
                            </div>
                        </div> -->
            <!-- ref="CesiumMap"  -->
            <!--    <VideoModule ref="VideoModule" @send:switchMapOrVideo="switchMapOrVideo" :defaultUavInfo="defaultUavInfo"></VideoModule> -->
            <CesiumMap ref="CesiumMap" :visible="CesiumDrawVisible" :maploading="maploading" :tasks-routes="tasksRoutes" :tasks-name="tasksName" :default-uav-sn="defaultUavSn" @senddoFlyCommands="senddoFlyCommandsEvent" />
            <div v-show="isMap" class="drawButton">
              <i class="el-icon-edit clickstyle" :title="'绘制'" @click="CesiumDrawVisible=!CesiumDrawVisible" />
            </div>
            <div v-show="isMap" class="icon-list">
              <!-- <el-button title="起飞-1100" icon="el-icon-s-promotion" circle size="mini" @click="takeoff(1100)"></el-button> -->
              <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="red" title="确认起飞？" @confirm="takeoff(1100)">
                <el-button slot="reference" title="起飞-1100" icon="el-icon-s-promotion" circle size="mini" />
              </el-popconfirm>
              <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="red" title="确认降落？" @confirm="land(1103)">
                <el-button slot="reference" title="降落-1103" icon="el-icon-place" circle size="mini" />
              </el-popconfirm>

              <div class="not_commonly_used-icon">
                <el-button icon="el-icon-caret-top" circle size="mini" class="top-icon" />
                <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="red" title="确认返航？" @confirm="rtl(1102)">
                  <el-button slot="reference" title="返航-1102" icon="el-icon-location-information" circle size="mini" class="custom-button" />
                </el-popconfirm>

                <el-button title="执行任务" icon="el-icon-wind-power" circle size="mini" class="custom-button" @click="startMission(1006)" />
                <!-- 悬停1104  -->
                <el-button title="暂停-1142" icon="el-icon-alarm-clock" circle size="mini" class="custom-button" @click="pauseMission(1142)" />
                <el-button title="停止=1144" icon="el-icon-timer" circle size="mini" class="custom-button" @click="stopMission(1144)" />
                <el-button title="恢复-1143" icon="el-icon-time" circle size="mini" class="custom-button" @click="resumeMission(1143)" />
              </div>
            </div>
          </div>
          <div v-if="createARouteOrNot" class="mainRight">
            <dv-border-box-7 class="main_right_hud">
              <el-row style="height:100%;">
                <el-col :span="24" align="middle" style="height:100%">
                  <Attitude :size="200" :showbox="true" :pitch="defaultUavHeartbeat.pitch" :roll="defaultUavHeartbeat.roll" />
                </el-col>
              </el-row>
            </dv-border-box-7>
            <div class="main_right_parms_title">无人机参数</div>
            <dv-border-box-7 class="main_right_parms">
              <div :key="key_div_uav_parm" class="main_right_parms_body">
                <parmItem class="parmItem" parm-image="parm_mode" parm-name="模式" :parm-value="defaultUavHeartbeat && defaultUavHeartbeat.flightModeText !== undefined && defaultUavHeartbeat.flightModeText !== null ? checkIsNaN(defaultUavHeartbeat.flightModeText) : '-' " />
                <!-- checkIsNaN(defaultUavHeartbeat.flightModeText) 4 指点  9 降落模型  6 返航 5 起飞 16 位置锁定  2 定高  -->
                <parmItem v-if="defaultUavHeartbeat.flightTimeInSeconds ==0 ? false : true" class="parmItem" parm-image="parm_time" parm-name="飞行时间" :parm-value="defaultUavHeartbeat && defaultUavHeartbeat.flightTimeInSeconds !== undefined && defaultUavHeartbeat.flightTimeInSeconds !== null ? convertSecondToTime(defaultUavHeartbeat.flightTimeInSeconds) : '-'" />
                <parmItem v-else class="parmItem" parm-image="parm_time" parm-name="GPS" :parm-value="defaultUavHeartbeat && defaultUavHeartbeat.gpsStatusText !== undefined && defaultUavHeartbeat.gpsStatusText !== null ? defaultUavHeartbeat.gpsStatusText : '-'" />
                <parmItem class="parmItem" parm-image="parm_uplink" parm-name="上行信号" :parm-value="defaultUavHeartbeat.linkAirUpload" parm-unit="%" :warn-min-value="60" />
                <parmItem class="parmItem" parm-image="parm_downlink" parm-name="下行信号" :parm-value="defaultUavHeartbeat.linkAirDownload" parm-unit="%" :warn-min-value="60" />
                <parmItem class="parmItem" parm-image="parm_alt" parm-name="对地高度" :parm-value="defaultUavHeartbeat.alt" parm-unit="米" :warn-min-value="0" />
                <parmItem class="parmItem" parm-image="parm_altabs" parm-name="海拔高" :parm-value="defaultUavHeartbeat.altabs" parm-unit="米" :warn-min-value="0" />
                <parmItem class="parmItem" parm-image="parm_yaw" parm-name="朝向" :parm-value="defaultUavHeartbeat &&defaultUavHeartbeat.yaw ? toFixed(defaultUavHeartbeat.yaw,2) : '-' " parm-unit="°" />
                <parmItem v-if="defaultUavHeartbeat.batteryPert==0 ? false :true" class="parmItem" parm-image="parm_batt" parm-name="无人机电量" :parm-value="defaultUavHeartbeat.batteryPert" parm-unit="%" :warn-min-value="50" />
                <parmItem v-else class="parmItem" parm-image="parm_batt" parm-name="电压" :parm-value="defaultUavHeartbeat.batteryValue" parm-unit="V" :warn-min-value="50" />
              </div>
            </dv-border-box-7>
            <div class="main_right_gps_title">定位</div>
            <dv-border-box-7 :key="key_div_gps_parm" class="main_right_gps">
              <div class="main_right_gps_body">
                <parmItem class="parmItem" parm-image="parm_gps" parm-name="定位状态" :parm-value="defaultUavHeartbeat.gpsStatusText" />
                <parmItem class="parmItem" parm-image="parm_sate" parm-name="卫星颗数" :parm-value="defaultUavHeartbeat.satecount" parm-unit="颗" :warn-min-value="10" />
                <parmItem class="parmItem" parm-image="tools" parm-name="精度" parm-value="-" parm-unit="米" :warn-min-value="2" />
                <parmItem class="parmItem" parm-image="parm_altabs" parm-name="海拔" :parm-value="defaultUavHeartbeat.altabs" parm-unit="米" :warn-min-value="0" />
                <parmItem class="parmItem" parm-image="parm_latlng" parm-name="经度" :parm-value="defaultUavHeartbeat.lng" parm-unit="°" />
                <parmItem class="parmItem" parm-image="parm_latlng" parm-name="纬度" :parm-value="defaultUavHeartbeat.lat" parm-unit="°" />
              </div>
            </dv-border-box-7>
          </div>
          <div v-else class="mainRight" />
        </div>
        <div class="foot" />
      </div>
    </dv-border-box-12>
    <!-- 相机设置弹窗 -->
    <el-dialog :visible.sync="cameraSettingVisible" class="cameraDialog" width="345px">
      <template slot="title">
        测绘参数设置
      </template>
      <!-- 组件相机设置 -->
      <cameraSettingsPopup ref="cameraSettingsPopup" :uavs="uavs" :default-uav-sn="defaultUavSn" class="cameraSettingsPop-up-out" />
    </el-dialog>

    <el-dialog :visible.sync="uploadUavVisible" :before-close="handleCancelClick" class="cameraDialog" width="345px">
      <template slot="title">
        续点提示
      </template>
      <el-radio-group v-model="kmzCurrentIndex">
        <el-radio :label="0">{{ `从头上传` }}</el-radio>
        <el-radio :disabled="!currentTask.kmzCurrentWpNo" :label="currentTask.kmzCurrentWpNo">{{ `从续点${currentTask.kmzCurrentWpNo}开始上传` }}</el-radio>
      </el-radio-group>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCancelClick">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSumitClick">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./index.js"></script>
<style lang="scss" src="./index.scss" scoped></style>
