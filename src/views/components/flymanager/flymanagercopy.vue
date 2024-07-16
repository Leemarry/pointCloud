<!--
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2023-11-23 17:02:54
 * @LastEditors: Andy
 * @LastEditTime: 2023-11-23 17:02:54
-->
<!--
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2023-11-22 14:06:00
 * @LastEditors: Andy
 * @LastEditTime: 2023-11-23 16:59:43
-->
<!-- 左侧面板 -->
<template>
    <div class='transition-out'>
      <!-- 左侧面板 -->
      <transition name="fade-transform" :duration="200" mode="in-out">
          <div v-show="!isLeftFold" class="left">
            <!-- 无人机面板 -->
            <div v-show="!isEditWps" class="leftuav">
              <div class="top">
                <!-- <svg-icon :icon-class="getOnlineStyle(selectedUavItem)?'uav_green':'uav_black'" /> -->
                <el-button style="width:100%;text-align:center" @click="isShowUavs=true">
                  <svg-icon icon-class="uav_black" style="width:18px; height:18px;fill:gray" :style="getUavOnlineStatus(selectedUavItem)" />
                  {{(selectedUavItem==null || !selectedUavItem.uavId)?"未选择":selectedUavItem.uavName }}
                </el-button>
              </div>
              <!-- 实时无人机参数显示 -->
              <div class="parmitem">
                <div class="div">
                  {{ ProgressShow }}
                  <el-tooltip class="item" effect="dark" content="打开/关闭无人机电源" placement="top-start" v-show="isCanOpter  && isCanOpterUav">
                    <i class="el-icon-thumb" style="cursor:pointer" @click="openOrCloseUav()" />
                  </el-tooltip>
                  <!-- {{getRealdataDes('uav')}} -->
                </div>
                <!-- <router-link style="color: red;" to="/flying"><i class="el-icon-thumb" style="cursor:pointer" @click="openOrCloseUav()" /> 进入平台 </router-link> -->
                <!-- <el-row :gutter="20">
                  <el-col :span="24" class="parmName">
                    <a href="/indexxxx" class="bullshit__return-home">进入平台</a>
                  </el-col>
                </el-row> -->
                <el-row type="flex" justify="space-between" :gutter="20">
                  <el-col :span="7" class="parmName">
                    飞行高度
                  </el-col>
                  <el-col :span="10">
                    {{ getRealdataDes('alt') }}
                  </el-col>
                  <el-col :span="7" class="parmName">
                    米
                  </el-col>
                </el-row>
                <el-row type="flex" justify="space-between" :gutter="20">
                  <el-col :span="7" class="parmName">
                    飞行速度
                  </el-col>
                  <el-col :span="10">
                    {{ getRealdataDes('speed') }}
                  </el-col>
                  <el-col :span="7" class="parmName">
                    米/秒
                  </el-col>
                </el-row>
                <el-row type="flex" justify="space-between" :gutter="20">
                  <el-col :span="7" class="parmName">
                    海拔高度
                  </el-col>
                  <el-col :span="10">
                    {{ getRealdataDes('altabs') }}
                  </el-col>
                  <el-col :span="7" class="parmName">
                    米
                  </el-col>
                </el-row>

                <el-row type="flex" justify="space-between" :gutter="20">
                  <el-col :span="7" class="parmName">
                    飞行模式
                  </el-col>
                  <el-col :span="17">
                    {{ getRealdataDes('flightMode') }}
                  </el-col>
                </el-row>
                <el-row type="flex" justify="space-between" :gutter="20">
                  <el-col :span="7" class="parmName">
                    飞行时长
                  </el-col>
                  <el-col :span="17">
                    {{ getRealdataDes('flightTimeInSeconds') }}
                  </el-col>
                </el-row>
                <el-row type="flex" justify="space-between" :gutter="20">
                  <el-col :span="7" class="parmName">
                    剩余电量
                  </el-col>
                  <el-col :span="17" :style="'color:'+getRealdataWarn('batt')">
                    {{ getRealdataDes('batt') }}
                  </el-col>
                </el-row>
                <el-row type="flex" justify="space-between" :gutter="20">
                  <el-col :span="7" class="parmName">
                    通讯质量
                  </el-col>
                  <el-col :span="17" :style="'color:'+getRealdataWarn('sign')">
                    {{ getRealdataDes('sign') }}
                  </el-col>
                </el-row>
              </div>
              <!-- 参数显示 -->
              <div class="parmitem2">
                <el-row :gutter="20">
                  <el-col :span="6" class="parmName">
                    定位状态
                  </el-col>
                  <el-col :span="6">
                    {{ getRealdataDes('gpsStatusText') }}
                  </el-col>
                  <el-col :span="6" class="parmName">
                    卫星数量
                  </el-col>
                  <el-col :span="6">
                    {{ getRealdataDes('satecount') }}颗
                  </el-col>
    
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="6" class="parmName">
                    定位精度
                  </el-col>
                  <el-col :span="6">
                    /
                  </el-col>
                  <el-col :span="6" class="parmName">
                    机头朝向
                  </el-col>
                  <el-col :span="6">
                    {{ getRealdataDes('yaw') }} °
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="6" class="parmName">
                    充电
                    <el-tooltip class="item" effect="dark" :content="getChargingTooltip()" placement="top-start">
                      <i class="el-icon-timer" />
                    </el-tooltip>
                  </el-col>
                  <el-col :span="6" :style="'color:'+getChargingColor()">
                    {{ getChargingText() }}
                    <!-- v-show="isCanOpter && isCanOpterUav"  -->
                    <el-tooltip class="item" effect="dark" content="开始/停止充电" placement="top-start">
                      <i v-if="getChargingBool()===true" class="el-icon-loading" style="cursor:pointer" @click="startOrStopCharging()" />
                      <i v-else class="el-icon-thumb" style="cursor:pointer" @click="startOrStopCharging()" />
                    </el-tooltip>
                  </el-col>
                  <el-col :span="6" class="parmName">
                    遥控器
                  </el-col>
                  <el-col :span="6" :style="'color:'+getRealdataWarn('remote')">
                    {{ getRealdataDes('remote') }}
                    <el-tooltip class="item" effect="dark" content="打开/关闭遥控器" placement="top-start" v-show="isCanOpter && isCanOpterUav">
                      <i class="el-icon-thumb" style="cursor:pointer" @click="openOrCloseRemote()" />
                    </el-tooltip>
                  </el-col>
                </el-row>
                <!-- <el-row v-show="selectedUavType===1 && getIsUavServerOnline()" :gutter="20">
                  <el-col :span="6" class="parmName">
                    地面站
                  </el-col>
                  <el-col :span="6" :style="'color:'+getRealdataWarn('gcs')">
                    {{ getRealdataDes('gcs') }}
                    <el-tooltip class="item" effect="dark" content="打开/关闭大疆地面站" placement="top-start" v-show="isCanOpter && isCanOpterUav">
                      <i class="el-icon-thumb" style="cursor:pointer" @click="openOrCloseGcs()" />
                    </el-tooltip>
                  </el-col>
                  <el-col :span="6" class="parmName">
                    服务后台
                  </el-col>
                  <el-col :span="6" :style="'color:'+getRealdataWarn('server')">
                    {{ getRealdataDes('server') }}
                    <el-tooltip class="item" effect="dark" :content="getRealdataDes('boottime')" placement="top-start" v-show="isCanOpter && isCanOpterUav">
                      <i class="el-icon-timer" @click="restartMpServer()" />
                    </el-tooltip>
                  </el-col>
                </el-row> -->
              </div>
              <!-- 控制按钮 v-show="isCanOpter&&isCanOpterUav" -->
              <!-- <div class="button" >
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-button :loading="loading" style="width:100%" type="" icon="el-icon-caret-right" size="medium" round @click="beforeDoCommand(1007,0,0,0,0,10,'是否开始自动执行任务?')">执行任务</el-button>
                  </el-col>
                  <el-col :span="12">
                    <el-button :loading="loading" style="width:100%" type="" icon="el-icon-s-home" size="medium" round @click="beforeDoCommand(1009,0,0,0,0,10,'是否返航无人机?')">自动返航</el-button>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-button :loading="loading" style="width:100%" type="" icon="el-icon-d-caret" size="medium" round @click="beforeDoCommand(1104,0,0,0,0,10,'是否立即悬停无人机?')">立即悬停</el-button>
                  </el-col>
                  <el-col :span="12">
                    <el-dropdown size="mini" style="width:100%" @command="MoreHandleCommandUav">
                      <span class="el-dropdown-link">
                        <el-button :loading="loading" icon="el-icon-more" size="medium" round style="width:100%">更多操作</el-button>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command="beforeMoreHandleCommandUav(1100,0,0,0,0,10,'是否起飞无人机?')">起 飞</el-dropdown-item>
                        <el-dropdown-item v-show="selectedUavType===1" :command="beforeMoreHandleCommandUav(1105,0,0,0,0,10,'是否精确起飞无人机?')">精确起飞</el-dropdown-item>
                        <el-dropdown-item :command="beforeMoreHandleCommandUav(1103,0,0,0,0,10,'是否降落无人机?')">降 落</el-dropdown-item>
                        <el-dropdown-item :command="beforeMoreHandleCommandUav(1102,0,0,0,0,10,'是否返航无人机?')">返 航</el-dropdown-item>
    
                        <el-dropdown-item :command="beforeMoreHandleCommandUav(1101,0,0,0,0,10,'(需先上传任务) 是否开始执行任务?')" divided>执行任务</el-dropdown-item>
                        <el-dropdown-item v-show="selectedUavType===1" :command="beforeMoreHandleCommandUav(1106,0,0,0,0,10,'是否开始精确起飞执行任务?')">精确起飞执行任务</el-dropdown-item>
    
                        <el-dropdown-item icon="el-icon-upload2" :command="beforeMoreHandleCommandUav(1003,0,0,0,0,10,'是否全自动起飞')" divided>全自动起飞</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-caret-right" :command="beforeMoreHandleCommandUav(1006,0,0,0,0,10,'是否全自动执行任务?')">全自动执行任务</el-dropdown-item>
                        <el-dropdown-item v-show="selectedUavType===1" icon="el-icon-upload2" :command="beforeMoreHandleCommandUav(1004,0,0,0,0,10,'是否全自动起飞(视觉辅助模式)?')">全自动起飞(视觉辅助模式)</el-dropdown-item>
                        <el-dropdown-item v-show="selectedUavType===1" icon="el-icon-caret-right" :command="beforeMoreHandleCommandUav(1007,0,0,0,0,10,'是否全自动执行任务(视觉辅助模式)?')">全自动执行任务(视觉辅助模式)</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-s-home" :command="beforeMoreHandleCommandUav(1009,0,0,0,0,10,'是否开始全自动返航?')">全自动返航</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-close" :command="beforeMoreHandleCommandUav(1,0,0,0,0,10,'是否终止全自动任务?')">终止全自动任务</el-dropdown-item>
                        <!== <el-dropdown-item v-show="selectedUavType===1" :command="beforeMoreHandleCommandUav(1028,0,0,0,0,10,'是否打开大疆地面站?')" divided>打开大疆地面站</el-dropdown-item>
                        <el-dropdown-item v-show="selectedUavType===1" :command="beforeMoreHandleCommandUav(1030,0,0,0,0,10,'是否重启大疆地面站?')">重启大疆地面站</el-dropdown-item>
                        <el-dropdown-item v-show="selectedUavType===1" :command="beforeMoreHandleCommandUav(1029,0,0,0,0,10,'是否关闭大疆地面站?')">关闭大疆地面站</el-dropdown-item> ==>
                        <el-dropdown-item v-show="selectedUavType===1" :command="beforeMoreHandleCommandUav('openSystem',0,0,0,0,10,'是否打开系统所有模块电源?')" divided>一键打开系统电源</el-dropdown-item>
                        <el-dropdown-item v-show="selectedUavType===1" :command="beforeMoreHandleCommandUav('closeSystem',0,0,0,0,10,'是否关闭系统所有模块电源?')">一键关闭系统电源</el-dropdown-item>
                        <!== <el-dropdown-item v-show="selectedUavType===1" :command="beforeMoreHandleCommandUav(1030,0,0,0,0,10,'是否重启地面站！')">重启地面站</el-dropdown-item> ==>
                        <el-dropdown-item v-show="selectedUavType===1" :command="beforeMoreHandleCommandUav(1037,0,0,0,0,10,'是否重启主机，重启后请等待1分钟左右！')">重启主机</el-dropdown-item>
                        <el-dropdown-item v-show="selectedUavType===1" :command="beforeMoreHandleCommandUav(1199,0,0,0,0,10,'是否启用模拟环境?')" divided>启用模拟环境</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-warning-outline" :command="beforeMoreHandleCommandUav(1150,0,0,0,0,10,'是否请求远程控制?')" divided>请求远程控制</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-warning" :command="beforeMoreHandleCommandUav(1151,0,0,0,0,10,'是否结束远程控制?')">结束远程控制</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>
              </div> -->
            </div>
   
          </div>
        </transition>
      <!-- 切换无人机 -->
      <el-dialog title="我的无人机" :visible.sync="isShowUavs" width="850px">
      <el-table :data="uavs" border height="300" @row-dblclick="clickUavRow" highlight-current-row :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" :row-style="getUavSelectedRowStyle" empty-text="没有拥有权限的无人机">
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column label="类型" width="100">
          <template slot-scope="scope">
            <el-tag effect="dark" size="mini" :type="scope.row.uavFactoryId===2 ? 'primary' : 'success'" disable-transitions>{{ getUavTypeName(scope.row.uavFactoryId)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="" width="100">
          <template slot-scope="scope">
            <svg-icon icon-class="uav_black" style="width:32px; height:32px;fill:gray" :style="getUavOnlineStatus(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="uavId" label="编号">
        </el-table-column>
        <el-table-column prop="uavName" label="名称">
        </el-table-column>
        <el-table-column label="权限" width="100">
          <template slot-scope="scope">
            <el-tooltip effect="light" :content="getUavLimitText(scope.row,'tooltip')" placement="top-start">
              <span><i class="el-icon-warning-outline" :style="'color:'+(!getUavLimitText(scope.row,'bool')?'red':'green')" />{{ getUavLimitText(scope.row) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="选择" width="100">
          <template slot-scope="scope">
            <el-button @click="clickUavItem(scope.row,true)" type="text" size="small">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowUavs = false">关 闭</el-button>
      </div>
    </el-dialog>
    </div>
    </template>
    
    <script src="./flymanager.js"></script>
    <style lang="scss" src="./flymanager.scss" scoped>
    </style>
    <style lang='scss' scoped>
    //@import url(); 引入公共css类 
    </style>