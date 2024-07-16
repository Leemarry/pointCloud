<template>
  <div class="main">
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
              <el-tooltip class="item" effect="dark" content="打开/关闭无人机电源" placement="top-start" v-show="isCanOpter && isCanOpterUav">
                <i class="el-icon-thumb" style="cursor:pointer" @click="openOrCloseUav()" />
              </el-tooltip>
              <!-- {{getRealdataDes('uav')}} -->
            </div>
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
            <!-- <el-row type="flex" justify="space-between" :gutter="20">
              <el-col :span="7" class="parmName">
                朝向
              </el-col>
              <el-col :span="10">
                {{ getRealdataDes('yaw') }}
              </el-col>
              <el-col :span="7" class="parmName">
                度
              </el-col>
            </el-row> -->
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
                <!-- <h6 v-if="selectedUavType !== 1"> {{ getRealdataDes('batt') }} </h6>
                <el-progress v-else :text-inside="true" :stroke-width="24" :percentage="getRealdataDes('batt')" status="success"></el-progress> -->
              </el-col>
            </el-row>
            <!-- <el-row type="flex" justify="space-between" :gutter="20">
              <el-col :span="7" class="parmName">
                定位状态
              </el-col>
              <el-col :span="17" :style="'color:'+getRealdataWarn('sate')">
                {{selectedUavItem.heartbeatData&&selectedUavItem.heartbeatData!=null?selectedUavItem.heartbeatData.gpsStatusText:'未知'}}
              </el-col>
            </el-row> -->
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
                <el-tooltip v-show="isCanOpter && isCanOpterUav" class="item" effect="dark" content="开始/停止充电" placement="top-start">
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
            <el-row v-show="selectedUavType===1 && getIsUavServerOnline()" :gutter="20">
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
            </el-row>
            <!-- <el-row :gutter="20" v-show="selectedUavType===1">
              <el-col :span="12" class="parmName">
                <el-tooltip class="item" effect="dark" content="一键打开系统电源" placement="top-start" v-show="isCanOpter">
                  <el-button size="mini" type="text" @click="openOrCloseSystem(true)">一键通电</el-button>
                </el-tooltip>
              </el-col>
              <el-col :span="12">
                <el-tooltip effect="dark" content="一键关闭系统电源" placement="top-start" v-show="isCanOpter">
                  <el-button size="mini" type="text" @click="openOrCloseSystem(false)">一键断电</el-button>
                </el-tooltip>
              </el-col>
            </el-row> -->
          </div>
          <!-- 控制按钮 -->
          <div class="button" v-show="isCanOpter && isCanOpterUav">
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
                    <!-- <el-dropdown-item v-show="selectedUavType===1" :command="beforeMoreHandleCommandUav(1028,0,0,0,0,10,'是否打开大疆地面站?')" divided>打开大疆地面站</el-dropdown-item>
                    <el-dropdown-item v-show="selectedUavType===1" :command="beforeMoreHandleCommandUav(1030,0,0,0,0,10,'是否重启大疆地面站?')">重启大疆地面站</el-dropdown-item>
                    <el-dropdown-item v-show="selectedUavType===1" :command="beforeMoreHandleCommandUav(1029,0,0,0,0,10,'是否关闭大疆地面站?')">关闭大疆地面站</el-dropdown-item> -->
                    <el-dropdown-item v-show="selectedUavType===1" :command="beforeMoreHandleCommandUav('openSystem',0,0,0,0,10,'是否打开系统所有模块电源?')" divided>一键打开系统电源</el-dropdown-item>
                    <el-dropdown-item v-show="selectedUavType===1" :command="beforeMoreHandleCommandUav('closeSystem',0,0,0,0,10,'是否关闭系统所有模块电源?')">一键关闭系统电源</el-dropdown-item>
                    <el-dropdown-item v-show="selectedUavType===1" :command="beforeMoreHandleCommandUav(1037,0,0,0,0,10,'是否重启主机，重启后请等待1分钟左右！')">重启主机</el-dropdown-item>
                    <el-dropdown-item v-show="selectedUavType===1" :command="beforeMoreHandleCommandUav(1199,0,0,0,0,10,'是否启用模拟环境?')" divided>启用模拟环境</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-warning-outline" :command="beforeMoreHandleCommandUav(1150,0,0,0,0,10,'是否请求远程控制?')" divided>请求远程控制</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-warning" :command="beforeMoreHandleCommandUav(1151,0,0,0,0,10,'是否结束远程控制?')">结束远程控制</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </div>
          <!-- 无人机 视频 -->
          <div class="bottom">
            <div id="videoUav" class="videomain" @mouseover="isVideo1MouseOver=true" @mouseleave="isVideo1MouseOver=false">
              <div class="tools" v-show="isVideo1MouseOver">
                <el-button-group>
                  <el-tooltip class="item" effect="dark" content="刷新视频源" placement="bottom">
                    <el-button size="mini" icon="el-icon-refresh" circle @click="refreshVideo('uav')" />
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="停止播放" placement="bottom">
                    <el-button size="mini" icon="el-icon-video-pause" circle @click="stopVideo1()" />
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="拍照" placement="bottom">
                    <el-button :disabled="!(isCanOpter && isCanOpterUav)" size="mini" icon="el-icon-camera-solid" circle @click="doCommand(1162, 0, 0, 0, 0)" />
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="开始录像" placement="bottom">
                    <el-button :disabled="!(isCanOpter && isCanOpterUav)" size="mini" icon="el-icon-video-camera-solid" circle @click="doCommand(1163, 0, 0, 0, 0)" />
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="停止录像" placement="bottom">
                    <el-button :disabled="!(isCanOpter && isCanOpterUav)" size="mini" icon="el-icon-video-camera" circle @click="doCommand(1164, 0, 0, 0, 0)" />
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="相机设置" placement="bottom">
                    <el-button :disabled="!(isCanOpter && isCanOpterUav)" size="mini" icon="el-icon-setting" circle @click="isDialogCameraSetting=true" />
                  </el-tooltip>
                </el-button-group>
              </div>
              <div @mouseover="isVideo1MouseOver=true" v-show="isVideo1MouseOver && isCanOpter && isCanOpterUav" class="cameracmd">
                <table>
                  <tr>
                    <td colspan="3">
                      <el-tooltip class="item" effect="dark" content="上" placement="top">
                        <el-button size="mini" icon="el-icon-top" circle @mousedown.native="sendCommandToWebsocketThread(1153, 0, 2, 0, 0)" @mouseup.native="sendCommandToWebsocketThread(1153, 0, 0, 0, 0)" />
                      </el-tooltip>
                    </td>
                    <td>
                      <el-tooltip class="item" effect="dark" content="缩放+" placement="top">
                        <el-button size="mini" icon="el-icon-plus" circle @click="doCommand(1171, 1, 3, 0, 0)"></el-button>
                      </el-tooltip>
                    </td>
                    <td>
                      <el-tooltip class="item" effect="dark" content="缩放-" placement="top">
                        <el-button size="mini" icon="el-icon-minus" circle @click="doCommand(1171, 0, 3, 0, 0)"></el-button>
                      </el-tooltip>
                    </td>
                    <td>
                      <el-tooltip class="item" effect="dark" content="停止缩放" placement="top">
                        <el-button size="mini" icon="el-icon-video-pause" circle @click="doCommand(1172, 0, 0, 0, 0)"></el-button>
                      </el-tooltip>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <el-tooltip class="item" effect="dark" content="左" placement="left">
                        <el-button size="mini" icon="el-icon-back" circle @mousedown.native="sendCommandToWebsocketThread(1153, 0, 0, -2, 0)" @mouseup.native="sendCommandToWebsocketThread(1153, 0, 0, 0, 0)"></el-button>
                      </el-tooltip>
                    </td>
                    <td>
                      <el-tooltip class="item" effect="dark" content="一键朝下/朝前" placement="right">
                        <el-button size="mini" icon="el-icon-rank" circle @click="sendCommandToWebsocketThread(1153, 0, 0, 0, 5)"></el-button>
                      </el-tooltip>
                    </td>
                    <td>
                      <el-tooltip class="item" effect="dark" content="右" placement="right">
                        <el-button size="mini" icon="el-icon-right" circle @mousedown.native="sendCommandToWebsocketThread(1153, 0, 0, 2, 0)" @mouseup.native="sendCommandToWebsocketThread(1153, 0, 0, 0, 0)"></el-button>
                      </el-tooltip>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3">
                      <el-tooltip class="item" effect="dark" content="下" placement="right">
                        <el-button size="mini" icon="el-icon-bottom" circle @mousedown.native="sendCommandToWebsocketThread(1153, 0, -2, 0, 0)" @mouseup.native="sendCommandToWebsocketThread(1153, 0, 0, 0, 0)"></el-button>
                      </el-tooltip>
                    </td>
                    <td>
                      <el-tooltip class="item" effect="dark" content="变焦+" placement="left" v-show="false">
                        <el-button size="mini" icon="el-icon-zoom-in" circle></el-button>
                      </el-tooltip>
                    </td>
                    <td>
                      <el-tooltip class="item" effect="dark" content="变焦-" placement="right" v-show="false">
                        <el-button size="mini" icon="el-icon-zoom-out" circle></el-button>
                      </el-tooltip>
                    </td>
                    <td>
                      <el-tooltip class="item" effect="dark" content="停止变焦" placement="top" v-show="false">
                        <el-button size="mini" icon="el-icon-video-pause" circle></el-button>
                      </el-tooltip>
                    </td>
                  </tr>
                </table>
              </div>
              <div id="video1" class="video" v-loading="isRequestStream1" :element-loading-text="textRequestStream1" element-loading-background="rgba(0, 0, 0, 0.5)">
                <video v-if="streamType !== 'webrtc'" id="flvvideo1" ref="flvvideo1" controls muted style="width:100%;height:100%"></video>
              </div>
              <div class="mode">
                <i v-show="!isYuntaiMode" class="el-icon-video-camera">录像模式</i>
              </div>
            </div>
            <!-- 视频切换按钮 -->
            <div class="switchBtn1"><i class="el-icon-top-right" @click="switchVideoMap('uav')"></i></div>
          </div>
        </div>
        <!-- 所有航点面板 -->
        <div class="leftwps" v-show="isEditWps">
          <div class="sideLeftWps">
            <div class="top">
              <el-row>
                <el-col :span="24" class="value" align="left">
                  <el-tag effect="dark" size="mini" :type="selectedUavType===2 ? 'primary' : 'success'" disable-transitions>{{ getUavTypeName(selectedUavType)+'航线任务' }}</el-tag>
                </el-col>
              </el-row>
              <el-row style="margin-top:10px">
                <el-col :span="12">航点总数：</el-col>
                <el-col :span="12" class="value">{{ wps.length }}</el-col>
              </el-row>
              <el-row>
                <el-col :span="12">航程：</el-col>
                <el-col :span="12" class="value">{{ (wpsInfo.wpsDistance/1000).toFixed(2) }} 千米</el-col>
              </el-row>
              <el-row>
                <el-col :span="12">预计耗时：</el-col>
                <el-col :span="12" class="value">{{ (wpsInfo.wpsUserTime/60).toFixed(2) }} 分钟</el-col>
              </el-row>
              <el-row>
                <el-col :span="12">默认高度：</el-col>
                <el-col :span="10" class="value">{{ defaultWpParm.alt }} 米</el-col>
                <el-col :span="2"><i style="cursor:pointer" class="el-icon-edit" @click="startSetDefaultAlt" />
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" align="center" v-show="selectedUavType===1">
                  <el-button size="mini" type="text" @click="isShowDjiMoreMissionParm=!isShowDjiMoreMissionParm">{{ isShowDjiMoreMissionParm ? "折叠详细参数" : "显示更多参数" }}</el-button>
                </el-col>
              </el-row>
              <div class="div" v-show="selectedUavType===1 && isShowDjiMoreMissionParm">
                <el-row type="flex" align="middle">
                  <el-col :span="12">航线任务版本：</el-col>
                  <el-col :span="12" class="value">
                    <el-select size="mini" v-model="wpsInfo.wpsVersion" placeholder="请选择">
                      <el-option v-for="item in djiMissionVersion" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <el-row type="flex" align="middle">
                  <el-col :span="12">
                    高度类型：
                    <el-tooltip effect="light" content="相对于起飞点高度或海拔高度飞行" placement="top-start">
                      <i class="el-icon-warning" />
                    </el-tooltip>
                  </el-col>
                  <el-col :span="12" class="value">
                    <el-select size="mini" v-model="wpsInfo.wpsAltMode" placeholder="请选择">
                      <el-option v-for="item in missionAltMode" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <el-row type="flex" align="middle" v-if="wpsInfo.wpsAltMode===true">
                  <el-col :span="12">海拔获取：
                    <el-tooltip effect="light" content="海拔高度设置：自动获取，自动从无人机获取当前起飞点的海拔" placement="top-start">
                      <i class="el-icon-warning" />
                    </el-tooltip>
                  </el-col>
                  <el-col :span="12" class="value" align="left">
                    <el-radio-group v-model="wpsInfo.wpsUseThisHomeAltAbs" size="mini">
                      <el-radio-button :label="false">自动获取</el-radio-button>
                      <el-radio-button :label="true">手动</el-radio-button>
                    </el-radio-group>
                  </el-col>
                </el-row>
                <el-row type="flex" align="middle" v-if="wpsInfo.wpsAltMode===true && wpsInfo.wpsUseThisHomeAltAbs===true">
                  <el-col :span="12">设置起飞点海拔：</el-col>
                  <el-col :span="12" class="value">
                    <el-input size="mini" v-model="wpsInfo.wpsHomeAltAbs" placeholder="请输入"></el-input>
                  </el-col>
                </el-row>
                <el-row type="flex" align="middle">
                  <el-col :span="12">云台控制：
                    <el-tooltip effect="light" content="设置为[航点控制]后,航点中的云台俯仰生效." placement="top-start">
                      <i class="el-icon-warning" />
                    </el-tooltip>
                  </el-col>
                  <el-col :span="12" class="value">
                    <el-radio-group v-model="wpsInfo.wpsGimbalPitchRotationEnabled" size="mini">
                      <el-radio-button :label="false">手动</el-radio-button>
                      <el-radio-button :label="true">航点控制</el-radio-button>
                    </el-radio-group>
                  </el-col>
                </el-row>
                <el-row type="flex" align="middle">
                  <el-col :span="12">飞行速度(m/s)：</el-col>
                  <el-col :span="12" class="value">
                    <el-input size="mini" v-model="wpsInfo.wpsSpeed" placeholder="请输入"></el-input>
                  </el-col>
                </el-row>
                <el-row type="flex" align="middle">
                  <el-col :span="12">最大飞行速度(m/s)：</el-col>
                  <el-col :span="12" class="value">
                    <el-input size="mini" v-model="wpsInfo.wpsMaxSpeed" placeholder="请输入"></el-input>
                  </el-col>
                </el-row>
                <el-row type="flex" align="middle">
                  <el-col :span="12">遥控链路中断：</el-col>
                  <el-col :span="12" class="value">
                    <el-select size="mini" v-model="wpsInfo.wpsRcSignalLost" placeholder="请选择">
                      <el-option v-for="item in wpsRcSignalLostOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <el-row type="flex" align="middle">
                  <el-col :span="12">飞到第一个航点：</el-col>
                  <el-col :span="12" class="value">
                    <el-select size="mini" v-model="wpsInfo.wpsGotoWaypointMode" placeholder="请选择">
                      <el-option v-for="item in wpsGotoWaypointModeOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <el-row type="flex" align="middle">
                  <el-col :span="12">航线转弯：</el-col>
                  <el-col :span="12" class="value">
                    <el-select size="mini" v-model="wpsInfo.wpsFlightPathMode" placeholder="请选择">
                      <el-option v-for="item in wpsFlightPathModeOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <el-row type="flex" align="middle">
                  <el-col :span="12">机头朝向：</el-col>
                  <el-col :span="12" class="value">
                    <el-select size="mini" v-model="wpsInfo.wpsHeadingMode" placeholder="请选择">
                      <el-option v-for="item in wpsHeadingModeOptons" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <el-row type="flex" align="middle">
                  <el-col :span="12">任务结束后：</el-col>
                  <el-col :span="12" class="value">
                    <el-select size="mini" v-model="wpsInfo.wpsFinishedAction" placeholder="请选择">
                      <el-option v-for="item in wpsFinishedActionOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <el-row type="flex" align="middle">
                  <el-col :span="12">任务执行次数：</el-col>
                  <el-col :span="12" class="value">
                    <el-input-number style="width:100%" size="mini" v-model="wpsInfo.wpsRepeatTimes" :min="1" :max="15" label="次数"></el-input-number>
                  </el-col>
                </el-row>
              </div>
            </div>
            <el-scrollbar wrap-style="overflow-x:hidden;flex:1">
              <el-card v-for="(item) in wps" :key="item.wpIndex" :body-style=" { padding: '0px' }" shadow="hover" :class="item.selected ? 'cardBgWpsSelected' : 'cardBgWps'" @click.native="clickWpsItem(item)">
                <div class="cardLeftWps">
                  {{item.wpIndex+1}}
                </div>
                <div class="cardRightWps">
                  <el-dropdown size="medium" @command="MoreHandleCommandWps">
                    <span class="el-dropdown-link">
                      <i class="el-icon-more" style="cursor:pointer" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :command="beforeMoreHandleCommandWps(item,item.wpIndex,'edit')">修改</el-dropdown-item>
                      <el-dropdown-item :command="beforeMoreHandleCommandWps(item,item.wpIndex,'editall')">全部修改</el-dropdown-item>
                      <el-dropdown-item :command="beforeMoreHandleCommandWps(item,item.wpIndex,'insert')">插入航点</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-popconfirm :title="'确定删除[ '+ (item.wpIndex+1) +' ]号航点？'" @onConfirm="deleteWp(item.wpIndex)">
                    <svg-icon slot="reference" style="position:absolute;bottom:5px;right:5px" icon-class="delete_black" />
                  </el-popconfirm>
                  <!-- <svg-icon style="position:absolute;bottom:5px;right:5px" icon-class="delete_black" @click="deleteWpBefore(item)" /> -->
                </div>
                <div class="cardMiddleWps">
                  <table>
                    <tr v-show="selectedUavType===2">
                      <td style="width:80px">命令：</td>
                      <td><strong>{{ getCommandDes(item) }}</strong></td>
                    </tr>
                    <tr>
                      <td style="width:80px">纬度：</td>
                      <td><strong>{{ item.wpLat }}</strong></td>
                    </tr>
                    <tr>
                      <td>经度：</td>
                      <td><strong>{{ item.wpLng }}</strong></td>
                    </tr>
                    <tr>
                      <td>高度：</td>
                      <td><strong>{{ item.wpAlt }}</strong></td>
                    </tr>
                    <tr v-show="selectedUavType===1">
                      <td>动作：</td>
                      <td><strong>{{ getActionDes(item) }}</strong></td>
                    </tr>
                    <tr v-show="selectedUavType===1">
                      <td colspan="2">
                        <el-button size="mini" type="text" @click="isShowDjiMorePointParm=!isShowDjiMorePointParm">{{ isShowDjiMorePointParm ? "折叠参数" : "显示更多参数" }}</el-button>
                      </td>
                    </tr>
                    <tr v-if="isShowDjiMorePointParm">
                      <td>飞机朝向：</td>
                      <td><strong>{{ item.wpParm2 }}</strong></td>
                    </tr>
                    <tr v-if="isShowDjiMorePointParm">
                      <td>云台俯仰：</td>
                      <td><strong>{{ item.wpParm1 }}</strong></td>
                    </tr>
                    <tr v-if="isShowDjiMorePointParm">
                      <td>定时拍照：</td>
                      <td><strong>{{ item.wpParm3 }}</strong></td>
                    </tr>
                    <tr v-if="isShowDjiMorePointParm">
                      <td>定距拍照：</td>
                      <td><strong>{{ item.wpParm4 }}</strong></td>
                    </tr>
                    <tr v-if="isShowDjiMorePointParm">
                      <td>动作次数：</td>
                      <td><strong>{{ item.wpDjiActionRepeatTimes }}</strong></td>
                    </tr>
                  </table>
                </div>
              </el-card>
            </el-scrollbar>
            <div class="bottom">
              <el-row>
                <el-col :span="24" align="middle">
                  <el-button type="success" icon="el-icon-cloudy" size="mini" @click="saveWps()">保存任务</el-button>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 中间 -->
    <div v-loading="loading" :element-loading-text="loadingText" class="middle">
      <!-- 地图 -->
      <div class="mainbody">
        <div id="container" style="width:100%;height:100%">
          <measureTool v-if="map" :map="map"></measureTool>
        </div>
      </div>
      <div class="leftHideButton">
        <i :class="isLeftFold?'el-icon-d-arrow-right':'el-icon-d-arrow-left'" @click="isLeftFold=!isLeftFold"></i>
      </div>
      <div class="rightHideButton" v-show="isHasHive">
        <i :class="isRightFold?'el-icon-d-arrow-left':'el-icon-d-arrow-right'" @click="isRightFold=!isRightFold"></i>
      </div>
      <!-- 中间 航线编辑按钮 -->
      <div class="divTopMiddle" v-show="isEditWps">
        <el-button-group round size="mini">
          <el-button :type="isEditGrid?'success':''" icon="el-icon-news" round size="mini" @click="enableGrid()">{{isEditGrid?'关闭区域选择':'选择区域'}}</el-button>
          <el-button type="" icon="el-icon-upload2" size="mini" @click="uploadWps()">上传</el-button>
          <el-button type="" icon="el-icon-download" size="mini" @click="downloadWpsV2()">下载</el-button>
          <el-button type="" icon="el-icon-delete" size="mini" @click="clearWps()">清空</el-button>
          <el-button type="" icon="el-icon-close" round @click="enableEditWps(false)" size="mini">退出编辑</el-button>
        </el-button-group>
        <el-upload style="margin-top:10px" class="upload-demo" action="#" :multiple="false" :on-change="handleChangeKmlMission" :auto-upload="false" :file-list="fileListKmlMission" :before-upload="beforeKmlUpload">
          <el-button icon="el-icon-document-add" size="mini">导入Kml任务</el-button>
        </el-upload>
      </div>
      <!-- 上传，下载航线进度显示 -->
      <div class="divTopMiddleLoading" v-show="isShowMessageTip">
        <el-alert :title="messageTip" type="success" effect="dark" :closable="false">
        </el-alert>
      </div>
      <!-- 左下角，键盘操作说明 v-show="isRemoteEnable||true"-->
      <div class="divBottomLeftTool" v-show="isCanOpter && isCanOpterUav">
        <el-popover placement="top-start" title="无人机键盘操作说明" width="200" trigger="hover">
          <span style="color:black;font-size:12px;font-weight: bold;">- 无人机</span></br>
          <span style="color:green;font-size:12px;font-weight: bold;">W: 前进,S: 后退,A: 左移,D: 右移</span></br>
          <span style="color:green;font-size:12px;font-weight: bold;">U: 上升,I: 下降,J/K: 转向</span></br>
          <span style="color:black;font-size:12px;font-weight: bold;">- 云台控制</span></br>
          <span style="color:green;font-size:12px;font-weight: bold;">↑ ↓: 俯仰 , ← →: 偏航</span>
          <el-button slot="reference" type="text" size="mini" style="color:yellow"> 键盘控制</el-button>
        </el-popover>
      </div>
      <!-- 右下角 遥控器 -->
      <div class="divBottomRightToolRemote" v-show="isRemoteConnect||isRemoteEnable">
        <span style="color:yellow;font-size:12px;font-weight: bold;">最大速度</span>
        <el-slider v-model="moveSpeed" :min="moveMinSpeed" :max="moveMaxSpeed" :show-stops="true" :step="0.5" :format-tooltip="formatMoveSpeedTooltip"></el-slider>
        <span style="color:yellow;font-size:12px;font-weight: bold;" v-show="isRemoteConnect">油门值</span>
        <el-progress :text-inside="true" :stroke-width="20" :percentage="getThrottle()" status="exception" style="margin-bottom:5px" v-show="isRemoteConnect"></el-progress>
        <el-tag v-show="isRemoteConnect" :type="isRemoteEnable?'danger':'success'" effect="dark" style="cursor: pointer" @click="isDialogRemoteHelp=true">已连接摇杆</el-tag>
      </div>
      <!-- 右上角工具 -->
      <div class="divBottomRightTool" v-show="isCanOpter && isCanOpterUav">
        <table>
          <tr>
            <el-tooltip class="item" effect="light" content="航线编辑" placement="left">
              <el-button :type="isEditWps?'success':''" icon="el-icon-edit" size="mini" @click="enableEditWps()" circle></el-button>
            </el-tooltip>
          </tr>
          <tr>
            <el-tooltip class="item" effect="light" content="上传KMZ航线任务" placement="left">
              <el-button icon="el-icon-tickets" size="mini" @click="showKmz()" circle></el-button>
            </el-tooltip>
          </tr>
          <tr>
            <el-tooltip class="item" effect="light" content="下载航线任务" placement="left">
              <el-button type="" icon="el-icon-download" size="mini" @click="downloadWpsV2()" circle></el-button>
            </el-tooltip>
          </tr>
          <tr>
            <el-tooltip class="item" effect="light" content="从云端获取任务" placement="left">
              <el-button type="" icon="el-icon-cloudy" size="mini" @click="showAllTaskWps()" circle></el-button>
            </el-tooltip>
          </tr>
          <tr>
            <el-tooltip class="item" effect="light" content="设置" placement="left">
              <el-button type="" icon="el-icon-setting" size="mini" circle @click="isDialogConfig=true" />
            </el-tooltip>
          </tr>
        </table>
      </div>
      <!-- 中间 区域编辑按钮 -->
      <div class="sideLeftGridBtn" v-show="isEditGrid">
        <el-button-group round size="mini">
          <el-button type="" icon="el-icon-delete" size="mini" v-show="isEditGrid" @click="resetGrid" round>重新选择</el-button>
          <el-button type="" icon="el-icon-download" size="mini" v-show="isEditGrid" round @click="autoWps()">生成航线</el-button>
        </el-button-group>
      </div>
      <!-- 自动生成航线 参数面板 -->
      <div v-show="isEditGrid" class="sideLeftGridParm">
        <el-row type="flex" align="middle" style="padding-bottom:10px">
          <el-col :span="24" class="value" align="middle">
            <el-upload class="upload-demo" action="#" :multiple="false" :on-change="handleChangeKml" :auto-upload="false" :file-list="fileListKml" :before-upload="beforeKmlUpload">
              <el-button slot="trigger" size="mini">导入KML区域文件</el-button>
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件,文件大小不超过500kb</div> -->
            </el-upload>
          </el-col>
        </el-row>
        <el-row type="flex" align="middle">
          <el-col :span="10" class="value" align="left">
            起飞点位置
          </el-col>
          <el-col :span="14" class="value" align="right">
            <el-link type="success" @click="isEditGridChoiceStartPoint=!isEditGridChoiceStartPoint">{{isEditGridChoiceStartPoint?'选取中...':'选择起始点'}}</el-link>
          </el-col>
        </el-row>
        <el-row type="flex" align="middle" style="margin-top:10px">
          <el-col :span="10" class="value" align="left">
            飞行高度
          </el-col>
          <el-col :span="12" class="value" align="right">
            <el-input-number style="width:100%" size="mini" v-model="gridAutoParms.alt" :min="5" :max="1000" label="请输入"></el-input-number>
          </el-col>
          <el-col :span="2" class="value" align="left">
            米
          </el-col>
        </el-row>
        <el-row type="flex" align="middle">
          <el-col :span="10" class="value" align="left">
            航线间距
          </el-col>
          <el-col :span="12" class="value" align="right">
            <el-input-number style="width:100%" size="mini" v-model="gridAutoParms.spacing" :min="5" :max="1000" label="间距"></el-input-number>
          </el-col>
          <el-col :span="2" class="value" align="left">
            米
          </el-col>
        </el-row>
        <el-row type="flex" align="middle">
          <el-col :span="10" class="value" align="left">
            朝向
          </el-col>
          <el-col :span="12" class="value" align="right">
            <el-input-number style="width:100%" size="mini" v-model="gridAutoParms.yaw" :min="0" :max="180" label="朝向"></el-input-number>
          </el-col>
          <el-col :span="2" class="value" align="left">
            度
          </el-col>
        </el-row>
        <el-row type="flex" align="middle">
          <el-col :span="10" class="value" align="left">
            外扩距离
          </el-col>
          <el-col :span="12" class="value" align="right">
            <el-input-number style="width:100%" size="mini" v-model="gridAutoParms.outlineDistance" :min="-200" :max="1000" label="外扩距离"></el-input-number>
          </el-col>
          <el-col :span="2" class="value" align="left">
            米
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 右侧面板 -->
    <transition name="fade-transform" :duration="200" mode="in-out">
      <div v-show="isHasHive && !isRightFold" class="right">
        <div class="righthive">
          <div class="top">
            <el-button @click="isShowThisUavHives=true" v-show="getIsThisUavContainsHive()" style="width:100%">
              <svg-icon :icon-class="getOnlineStyle(selectedHiveItem)?'hive_green':'hive_black'" />
              {{(selectedHiveItem==null)?"未选择":selectedHiveItem.hiveName }}
            </el-button>
          </div>
          <div class="parmitem">
            <div class="div">{{getHiveRealdataDes('hive')}}</div>
            <el-row type="flex" justify="space-around" :gutter="20">
              <el-col :span="7" class="parmName">
                机舱温度
              </el-col>
              <el-col :span="10">
                {{getHiveRealdataDes('hivetemp')}}
              </el-col>
              <el-col :span="7" class="parmName">
                ℃
              </el-col>
            </el-row>
            <el-row type="flex" justify="space-around" :gutter="20">
              <el-col :span="7" class="parmName">
                机舱湿度
              </el-col>
              <el-col :span="10">
                {{getHiveRealdataDes('hivehumidity')}}
              </el-col>
              <el-col :span="7" class="parmName">
                %
              </el-col>
            </el-row>
            <!-- <el-row type="flex" justify="space-around" :gutter="20">
              <el-col :span="7" class="parmName">
                海拔高度
              </el-col>
              <el-col :span="10">
                {{getHiveRealdataDes('altabs')}}
              </el-col>
              <el-col :span="7" class="parmName">
                米
              </el-col>
            </el-row> -->
            <el-row type="flex" justify="space-around" :gutter="20">
              <el-col :span="7" class="parmName">
                开启次数
              </el-col>
              <el-col :span="10">
                {{getHiveRealdataDes('usetime')}}
              </el-col>
              <el-col :span="7" class="parmName">
                次
              </el-col>
            </el-row>
            <el-row type="flex" justify="space-around" :gutter="20">
              <el-col :span="7" class="parmName">
                空调状态
              </el-col>
              <el-col :span="10">
                自动
              </el-col>
              <el-col :span="7" class="parmName">
                <el-tooltip class="item" effect="dark" content="打开/关闭空调" placement="top-start" v-show="isCanOpter && isCanOpterHive">
                  <i class="el-icon-thumb" style="cursor:pointer" @click="openOrCloseAirConditioner()" />
                </el-tooltip>
              </el-col>
            </el-row>
            <el-row type="flex" justify="space-around" :gutter="20">
              <el-col :span="7" class="parmName">
                运行时长
              </el-col>
              <el-col :span="12">
                {{getHiveRealdataDes('runtime')}}
              </el-col>
              <el-col :span="5" class="parmName">
                <el-tooltip class="item" effect="dark" content="UPS电源状态查询" placement="top-start" v-show="isCanOpter  && isCanOpterHive">
                  <i style="cursor:pointer" @click="isDialogUpsSetting=true">UPS</i>
                </el-tooltip>
              </el-col>
            </el-row>
            <el-row type="flex" justify="space-around" :gutter="20">
              <el-col :span="7" class="parmName">
                安装位置
              </el-col>
              <el-col :span="17">
                {{getHiveRealdataDes('address')}}
              </el-col>
            </el-row>
          </div>
          <div class="parmitem2">
            <el-row>
              <el-col :span="6" class="parmName">
                风力
              </el-col>
              <el-col :span="6">
                {{getHiveWeatherDes('windPowerText')}}
              </el-col>
              <el-col :span="6" class="parmName">
                风速
              </el-col>
              <el-col :span="6">
                {{getHiveWeatherDes('windSpeed')}} 米/秒
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6" class="parmName">
                风向
              </el-col>
              <el-col :span="6">
                {{getHiveWeatherDes('WindDirection')}} 度
              </el-col>
              <el-col :span="6" class="parmName">
                环境湿度
              </el-col>
              <el-col :span="6">
                {{getHiveWeatherDes('airHumidity')}} %
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6" class="parmName">
                雨雪
              </el-col>
              <el-col :span="6">
                {{getHiveWeatherDes('rainSnow')}}
              </el-col>
              <el-col :span="6" class="parmName">
                环境温度
              </el-col>
              <el-col :span="6">
                {{getHiveWeatherDes('airTemp')}} ℃
              </el-col>
              <!-- <el-col :span="6" class="parmName">
                降雨量
              </el-col>
              <el-col :span="6">
                {{getHiveWeatherDes('rainWater')}} mm
              </el-col> -->
            </el-row>
          </div>
          <div class="button" v-show="isCanOpter && isCanOpterHive">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-button :loading="loading" style="width:100%" icon="el-icon-open" size="medium" round @click="beforeDoCommandHive(4,1,0,0,0,10,'是否打开停机坪?')">打开</el-button>
              </el-col>
              <el-col :span="8">
                <el-button :loading="loading" style="width:100%" icon="el-icon-video-pause" size="medium" round @click="beforeDoCommandHive(4,3,0,0,0,10,'是否暂停停机坪开关?')">暂停</el-button>
              </el-col>
              <el-col :span="8">
                <el-button :loading="loading" style="width:100%" icon="el-icon-turn-off" size="medium" round @click="beforeDoCommandHive(4,2,0,0,0,10,'是否关闭停机坪?')">关闭</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="bottom">
            <!-- 机巢视频 -->
            <div id="videoHive" class="videomain" @mouseover="isVideo2MouseOver=true" @mouseleave="isVideo2MouseOver=false" v-show="isShowHiveVideo&&getIsThisUavContainsHive()">
              <div v-show="isVideo2MouseOver" class="tools">
                <el-button-group>
                  <el-tooltip class="item" effect="dark" content="刷新视频源" placement="bottom">
                    <el-button size="mini" icon="el-icon-refresh" circle @click="refreshVideo('hive')"></el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="停止播放" placement="bottom">
                    <el-button size="mini" icon="el-icon-video-pause" circle @click="stopVideo2()"></el-button>
                  </el-tooltip>
                </el-button-group>
              </div>
              <div class="cameracmd" v-show="isVideo2MouseOver">
                <!-- <el-tooltip class="item" effect="dark" content="云台控制" placement="bottom">
                  <el-button size="mini" icon="el-icon-video-camera" circle></el-button>
                </el-tooltip> -->
              </div>
              <div id="video2" class="video" v-loading="isRequestStream2" :element-loading-text="textRequestStream2" element-loading-background="rgba(0, 0, 0, 0.5)">
                <video v-if="streamType !== 'webrtc'" id="flvvideo2" ref="flvvideo2" controls muted style="width:100%;height:100%"></video>
              </div>
            </div>
            <!-- 视频切换按钮 -->
            <div class="switchBtn2"><i class="el-icon-top-left" @click="switchVideoMap('hive')"></i></div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 编辑单个航点 -->
    <el-dialog title="航点编辑" :visible.sync="isDialogEditWp" width="400px">
      <el-form :model="editWpDialogModel" size="mini">
        <el-form-item label="命令" :label-width="formLabelWidthWp" v-show="selectedUavType===2">
          <el-select v-model="editWpDialogModel.wpAction" placeholder="请选择命令" style="width:100%">
            <el-option v-for="item in efCommands" :key="item.cmdId" :label="item.cmdNameZh" :value="item.cmdId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="纬度" :label-width="formLabelWidthWp">
          <el-input v-model="editWpDialogModel.wpLat" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="经度" :label-width="formLabelWidthWp">
          <el-input v-model="editWpDialogModel.wpLng" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="高度" :label-width="formLabelWidthWp">
          <el-input v-model="editWpDialogModel.wpAlt" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="飞机朝向" :label-width="formLabelWidthWp" v-show="selectedUavType===1">
          <el-input v-model="editWpDialogModel.wpParm2" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="云台俯仰" :label-width="formLabelWidthWp" v-show="selectedUavType===1">
          <el-input v-model="editWpDialogModel.wpParm1" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="定时拍照" :label-width="formLabelWidthWp" v-show="selectedUavType===1">
          <el-input v-model="editWpDialogModel.wpParm3" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="定距拍照" :label-width="formLabelWidthWp" v-show="selectedUavType===1">
          <el-input v-model="editWpDialogModel.wpParm4" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="动作次数" :label-width="formLabelWidthWp" v-show="selectedUavType===1">
          <el-input v-model="editWpDialogModel.wpDjiActionRepeatTimes" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="动作" :label-width="formLabelWidthWp" v-show="selectedUavType===1">
          <el-row>
            <el-col :span="16">{{ getActionDes(editWpDialogModel) }}</el-col>
            <el-col :span="4"><i style="cursor: pointer;" class="el-icon-plus" @click="beaforeAddDjiAction('one')">增加</i></el-col>
            <el-col :span="4"><i style="cursor: pointer;" class="el-icon-delete" @click="clearDjiAction(editWpDialogModel)">清除</i></el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isDialogEditWp = false">取 消</el-button>
        <el-button type="primary" @click="saveWp()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑大疆指令 -->
    <el-dialog title="大疆动作" :visible.sync="isDialogEditDjiAction" width="350px">
      <el-form :model="editWpDjiActionDialogModel" size="mini">
        <el-form-item label="动作" :label-width="formLabelWidth" v-show="selectedUavType===1">
          <el-select v-model="editWpDjiActionDialogModel.action" placeholder="请选择动作" style="width:100%">
            <el-option v-for="item in djiActions" :key="item.actId" :label="item.actNameZh" :value="item.actId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参数" :label-width="formLabelWidth">
          <el-input v-model="editWpDjiActionDialogModel.parm" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isDialogEditDjiAction = false">取 消</el-button>
        <el-button type="primary" @click="addDjiAction()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑多个航点 -->
    <el-dialog title="多航点编辑" :visible.sync="isDialogEditWps" width="350px">
      <el-form :model="editWpsDialogModel" size="mini">
        <el-form-item label="修改" :label-width="formLabelWidth">
          <el-select v-model="editWpsDialogModel.type" :model="editWpsDialogModel" placeholder="请选择修改对象" style="width:100%">
            <el-option label="高度" :value="0" />
            <el-option label="动作指令" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="命令" :label-width="formLabelWidth" v-show="selectedUavType===2 && editWpsDialogModel.type===1">
          <el-select v-model="editWpsDialogModel.wpAction" placeholder="请选择命令" style="width:100%">
            <el-option v-for="item in efCommands" :key="item.cmdId" :label="item.cmdNameZh" :value="item.cmdId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="高度" :label-width="formLabelWidth" v-show="editWpsDialogModel.type===0">
          <el-input v-model="editWpsDialogModel.wpAlt" oninput="value=value.replace(/[^0-9.]/g,'')" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="动作" :label-width="formLabelWidth" v-show="selectedUavType===1 && editWpsDialogModel.type===1">
          <el-row>
            <el-col :span="16">{{ getActionDes(editWpsDialogModel) }}</el-col>
            <el-col :span="4"><i style="cursor: pointer;" class="el-icon-plus" @click="beaforeAddDjiAction('all')">增加</i></el-col>
            <el-col :span="4"><i style="cursor: pointer;" class="el-icon-delete" @click="clearDjiAction(editWpsDialogModel)">清除</i></el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isDialogEditWps = false">取 消</el-button>
        <el-button type="primary" @click="updateAllWp()">确 定</el-button>
      </div>
    </el-dialog>
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
    <!-- 切换停机坪 -->
    <el-dialog title="我的停机坪" :visible.sync="isShowThisUavHives" width="850px">
      <el-table :data="hivesNowUav" border height="300" @row-dblclick="clickHiveRow" highlight-current-row :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" :row-style="getHiveSelectedRowStyle" empty-text="当前无人机未绑定停机坪">
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="hiveId" label="编号">
        </el-table-column>
        <el-table-column prop="hiveName" label="名称">
        </el-table-column>
        <el-table-column prop="hiveAddress" label="位置">
        </el-table-column>
        <el-table-column prop="hiveDes" label="描述">
        </el-table-column>
        <el-table-column label="权限" width="100">
          <template slot-scope="scope">
            <el-tooltip effect="light" :content="getHiveLimitText(scope.row,'tooltip')" placement="top-start">
              <span><i class="el-icon-warning-outline" :style="'color:'+(!getHiveLimitText(scope.row,'bool')?'red':'green')" />{{ getHiveLimitText(scope.row) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="选择" width="80">
          <template slot-scope="scope">
            <el-button @click="switchHive(scope.row)" type="text" size="small">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowThisUavHives = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 遥控器调试用 -->
    <el-dialog title="摇杆调试" :visible.sync="isDialogRemote" width="300px">
      <el-row>
        <el-col :span="12">
          <p v-for="(item,i) in remoteAxis">轴 :{{i}} --- 值:{{item.toFixed(5)}}</p>
        </el-col>
        <el-col :span="10" align="right">
          <p v-for="(item,i) in remoteButtons">按键:{{i}} --- 值:{{item.value}}</p>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- UPS -->
    <el-dialog title="UPS状态查询" :visible.sync="isDialogUpsSetting" width="450px">
      <div v-loading="loadingUps">
        <el-row style="margin-top:10px">
          <el-col :span="8">
            <el-tooltip effect="dark" content="UPS将在1分钟后关闭,并在1分钟后重启" placement="top-start">
              <el-button style="width:100px" type="warning" round size="mini" @click="upsCommand('5',1,1)">关机并重启</el-button>
            </el-tooltip>
          </el-col>
          <el-col :span="8">
            <el-tooltip effect="dark" content="UPS将在1分钟后关闭,并在10秒后重启" placement="top-start">
              <el-button style="width:100px" type="warning" round size="mini" @click="upsCommand('5',1,0)">重启</el-button>
            </el-tooltip>
          </el-col>
          <el-col :span="8">
            <el-button style="width:100px" type="success" round size="mini" @click="upsCommand('4')">10秒自检</el-button>
          </el-col>
        </el-row>
        <el-row style="margin-top:10px">
          <el-col :span="24" align="middle">
            <el-button style="width:200px" type="success" round size="mini" @click="upsCommand('6')">取消关机与重启命令的执行</el-button>
          </el-col>
          <!-- <el-col :span="8" align="middle">
            <el-button type="success" round size="mini" @click="upsCommand('7',1,0)">打开蜂鸣器</el-button>
          </el-col>
          <el-col :span="8" align="right">
            <el-button type="success" round size="mini" @click="upsCommand('7',0,0)">关闭蜂鸣器</el-button>
          </el-col> -->
        </el-row>
        <el-row style="margin-top:10px">
          <el-col :span="24" align="middle">
            <el-button style="width:200px" type="primary" round size="mini" @click="upsCommand('2')">查询UPS状态及参数</el-button>
          </el-col>
        </el-row>
        <el-row style="margin-top:10px">
          <el-col :span="24" align="middle" style="text-align:left;" v-html="UpsStatus" />
        </el-row>
        <el-row style="margin-top:10px">
          <el-col :span="24" align="middle">
            <el-button style="width:200px" type="primary" round size="mini" @click="upsCommand('3')">查询UPS额定信息</el-button>
          </el-col>
        </el-row>
        <el-row style="margin-top:10px">
          <el-col :span="24" align="middle" style="text-align:left;" v-html="UpsRatedMsg" />
        </el-row>
        <!-- <el-row style="margin-top:10px">
          <el-col :span="12">
            <el-button style="width:100%" type="primary" round size="mini" @click="upsCommand('1')">查询UPS密码</el-button>
          </el-col>
          <el-col :span="12" align="middle">
            {{ UpsPassword==null ? "未知" : UpsPassword}}
          </el-col>
        </el-row> -->
      </div>
    </el-dialog>
    <!-- 相机设置 -->
    <el-dialog title="相机" :visible.sync="isDialogCameraSetting" width="600px">
      <div v-loading="loadingUps">
        <el-row style="margin-top:10px;text-align:center" type="flex" align="middle" :gutter="20">
          <el-col :span="6" align="left">
            相机模式
          </el-col>
          <el-col :span="17" align="right">
            <el-button-group>
              <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1165, 0, 0, 0, 0)">拍照</el-button>
              <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1165, 1, 0, 0, 0)">录像</el-button>
              <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1165, 2, 0, 0, 0)">回放</el-button>
              <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1165, 3, 0, 0, 0)">媒体下载</el-button>
              <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1165, 4, 0, 0, 0)">广播</el-button>
            </el-button-group>
          </el-col>
        </el-row>
        <el-row style="margin-top:10px;text-align:center" type="flex" align="middle" :gutter="20">
          <el-col :span="6" align="left">
            拍照
          </el-col>
          <el-col :span="17" align="right">
            <el-button-group>
              <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1166, 0, 0, 0, 0)">单拍</el-button>
              <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1166, 2, 0, 0, 0)">连拍</el-button>
              <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1166, 1, 0, 0, 0)">HDR</el-button>
              <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1166, 4, 0, 0, 0)">间隔拍照</el-button>
              <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1166, 5, 0, 0, 0)">定时拍照</el-button>
              <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1166, 6, 0, 0, 0)">全景</el-button>
            </el-button-group>
            <!-- <el-button-group>
              <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1166, 0, 0, 0, 0)">单拍</el-button>
              <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1166, 1, 0, 0, 0)">HDR</el-button>
              <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1166, 2, 0, 0, 0)">连拍</el-button>
              <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1166, 3, 0, 0, 0)">AEB</el-button>
              <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1166, 4, 0, 0, 0)">间隔拍照</el-button>
              <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1166, 5, 0, 0, 0)">定时拍照</el-button>
              <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1166, 6, 0, 0, 0)">全景</el-button>
              <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1166, 7, 0, 0, 0)">EHDR</el-button>
              <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1166, 8, 0, 0, 0)">HyperLight</el-button>
              <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1166, 9, 0, 0, 0)">高分辨率</el-button>
              <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1166, 10, 0, 0, 0)">RAW连拍</el-button>
              <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1166, 11, 0, 0, 0)">SHALLOW_FOCUS</el-button>
            </el-button-group> -->
          </el-col>
        </el-row>
        <el-row style="margin-top:10px;text-align:center" type="flex" align="middle" :gutter="20">
          <el-col :span="6" align="left">
            镜头切换
          </el-col>
          <el-col :span="17" align="right">
            <el-button-group>
              <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1159, 0, 0, 0, 0)">刷新视频</el-button>
              <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1167, 0, 0, 0, 0)">默认</el-button>
              <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1167, 1, 0, 0, 0)">广角镜头</el-button>
              <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1167, 2, 0, 0, 0)">变焦镜头</el-button>
              <el-button type="" round size="mini" @click="isDialogCameraSetting=false;doCommand(1167, 3, 0, 0, 0)">红外镜头</el-button>
            </el-button-group>
          </el-col>
        </el-row>
        <el-row style="margin-top:10px;text-align:center" type="flex" align="middle" :gutter="20">
          <el-col :span="6" align="left">
            媒体管理
          </el-col>
          <el-col :span="17" align="right">
            <el-button-group>
              <el-button type="danger" round size="mini" @click="isDialogCameraSetting=false;doCommand(1175, 0, 0, 0, 0)">格式化SD卡</el-button>
              <el-button type="danger" round size="mini" @click="isDialogCameraSetting=false;doCommand(1176, 0, 0, 0, 0)">格式化SSD</el-button>
              <el-button type="danger" round size="mini" @click="isDialogCameraSetting=false;doCommand(1177, 0, 0, 0, 0)">格式化储存</el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!-- 遥控器 帮助图片 -->
    <el-dialog title="摇杆操作说明" :visible.sync="isDialogRemoteHelp">
      <el-row>
        <el-col :span="12">
          <el-image :src="t16000" fit="fill"></el-image>
        </el-col>
        <el-col :span="12">
          <h4>---- 按键说明 ---- </h4>
          <h6>0 : 上下控制云台俯仰,左右控制云台转向</h6>
          <h6>1 : 拍照 ， 2 : 拍照模式与录像模式切换 ， 3 : 开始录像 ， 4 : 停止录像</h6>
          <h6>5 : 起飞 ， 6 : 精确起飞 ， 7 : 悬停 ， 8 : 执行任务 ， 9 : 降落 ， 10 : 返航</h6>
          <h4>---- 全自动动作: 自动通电,打开停机坪舱门,飞行 ----</h4>
          <h6>11 : 全自动起飞</h6>
          <h6>12 : 全自动精确起飞</h6>
          <h6>13 : 全自动起飞后 - 执行任务</h6>
          <h6>14 : 全自动精确起飞后 - 执行任务</h6>
          <h6>15 : 全自动返航</h6>
          <h6>16 : 终止全自动任务动作</h6>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isDialogRemote = true">摇杆调试</el-button>
        <el-button type="primary" @click="isDialogRemoteHelp = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 设置 -->
    <el-dialog title="设置" :visible.sync="isDialogConfig" width="300px">
      <div>
        <el-row type="flex" align="middle">
          <el-col :span="6">地图:</el-col>
          <el-col :span="18">
            <el-radio-group style="width:100%" v-model="mapOnline" size="small">
              <el-radio-button label="online">在线地图</el-radio-button>
              <el-radio-button label="offline">离线地图</el-radio-button>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row style="margin-top:10px" type="flex" align="middle">
          <el-col :span="6">风格:</el-col>
          <el-col :span="18">
            <el-select size="mini" v-model="mapStyle" placeholder="请选择风格" style="width:100%">
              <el-option label="默认" value="normal" />
              <el-option label="深色" value="dark" />
              <el-option label="浅色" value="light" />
              <el-option label="清新风格" value="fresh" />
            </el-select>
          </el-col>
        </el-row>
        <el-row style="margin-top:20px" type="flex" align="middle">
          <el-checkbox v-model="isShowHiveVideo">默认显示停机坪视频窗口</el-checkbox>
        </el-row>
        <el-row style="margin-top:10px" type="flex" align="middle">
          <el-checkbox v-model="isMapFollowUav">地图跟随无人机移动</el-checkbox>
        </el-row>
        <el-row style="margin-top:10px" type="flex" align="middle">
          <el-checkbox v-model="isShowUavFlyedPath">显示无人机运动轨迹</el-checkbox>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="saveConfig(true)">取 消</el-button>
        <el-button type="primary" @click="saveConfig(false)">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 云端任务 -->
    <el-drawer title="云端任务" :visible.sync="isDialogTasks" size="450px" :withHeader="true">
      <div style="height:100%;display:flex; flex-direction: column;overflow: hidden;">
        <el-scrollbar style="width: 100%; height:100%" wrap-style="overflow-x:hidden;" v-loading="loadingWps" element-loading-text="加载中...">
          <el-card v-for="(item) in taskWps" :key="item.id" :body-style=" { padding: '0px' }" shadow="hover" :class="item.selected ? 'cardBgSelected_task' : 'cardBg_task'" @dblclick.native="clickTaskItem(item,true)">
            <div class="cardLeft" style="display: flex;flex-direction: column;">
              <svg-icon icon-class="file" style="width:32px; height:32px;fill:blue" />
              <strong style="postion:absolute;bottom:0px">{{ item.id }}</strong>
            </div>
            <div class="cardMiddle">
              <table style="width:100%;table-layout:fixed;word-break:break-all">
                <tr>
                  <td width="80">任务名称：</td>
                  <td width="30%"><strong>{{ item.wpsName}}</strong></td>
                  <td width="80">航点数量：</td>
                  <td width="40%"><strong>{{ item.wpsWpCount}} 个</strong></td>
                </tr>
                <tr>
                  <td>航程：</td>
                  <td><strong>{{ $toolUtil.convertMeterToFrendly(item.wpsDistance) }}</strong></td>
                  <td>预计用时：</td>
                  <td><strong>{{ $dateUtil.convertSecondToFrendly(item.wpsUserTime) }}</strong></td>
                </tr>
                <tr>
                  <td>更新人员：</td>
                  <td><strong>{{ item.efUserUpdate.uname }}</strong></td>
                  <td>更新时间：</td>
                  <td><strong>{{ $dateUtil.convertMillSecToDateStr(item.wpsCreateTime,'yyyy-MM-dd HH:mm') }}</strong></td>
                </tr>
                <tr>
                  <td>位置：</td>
                  <td colspan="3"><strong>{{ item.wpsLocation}}</strong></td>
                </tr>
                <tr>
                  <td>描述：</td>
                  <td colspan="3"><strong>{{ item.wpsDes}}</strong></td>
                </tr>
              </table>
            </div>
            <div style="top:5px;right:5px;position:absolute">
              <el-dropdown size="mini" @command="MoreHandleCommandTask">
                <span class="el-dropdown-link">
                  <el-button size="mini" type="text">操作</el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="beforeMoreHandleCommandTask(item,item.id,'download')">下载任务</el-dropdown-item>
                  <el-dropdown-item :command="beforeMoreHandleCommandTask(item,item.id,'update')">修改任务</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-popover placement="top-start" title="航线详情" width="300" trigger="hover">
                <span>所在纬度：{{ item.wpsLat }}</span></br>
                <span>所在经度：{{ item.wpsLng }}</span></br>
                <span>飞行高度：{{ item.wpsAlt }} 米</span></br>
                <span>飞行海拔：{{ item.wpsAltAbs }} 米</span></br>
                <span v-show="item.wpsType === 1">飞行速度：{{ item.wpsSpeed }} 米/秒</span></br>
                <span v-show="item.wpsType === 1">最大速度：{{ item.wpsMaxSpeed }} 米/秒</span></br>
                <span v-show="item.wpsType === 1">遥控链路中断：{{ item.wpsRcSignalLost===0?'继续任务':'终止任务' }}</span></br>
                <span v-show="item.wpsType === 1">航线路径类型：{{ getLableByValue(wpsFlightPathModeOptions,item.wpsFlightPathMode) }}</span></br>
                <span v-show="item.wpsType === 1">飞行路径方式：{{ getLableByValue(wpsGotoWaypointModeOptions,item.wpsGotoWaypointMode) }}</span></br>
                <span v-show="item.wpsType === 1">飞行时朝向：{{ getLableByValue(wpsHeadingModeOptons,item.wpsHeadingMode) }}</span></br>
                <span v-show="item.wpsType === 1">完成任务后：{{ getLableByValue(wpsFinishedActionOptions,item.wpsFinishedAction) }}</span></br>
                <span v-show="item.wpsType === 1">任务高度模式：{{ item.wpsAltMode===true?'海拔飞行':'相对高度飞行' }} </span></br>
                <span v-show="item.wpsType === 1">起飞点海拔类型：{{ item.wpsUseThisHomeAltAbs===true?'手动设置':'自动获取起飞点海拔' }} </span></br>
                <span v-show="item.wpsType === 1">起飞点海拔：{{ item.wpsHomeAltAbs }} 米</span></br>
                <span v-show="item.wpsType === 1">云台控制方式：{{ item.wpsGimbalPitchRotationEnabled===true?'航点控制':'手动控制' }} </span></br>
                <span v-show="item.wpsType === 1">执行次数：{{ item.wpsRepeatTimes }} 次</span></br>
                <span v-show="item.wpsType === 1">任务版本：{{ item.wpsVersion===1?'v2.0':'v1.0' }} </span></br>
                <span>创建时间：{{ $dateUtil.convertMillSecToDateStr(item.wpsCreateTime) }}</span></br>
                <span>创建人：{{ item.efUserCreate?item.efUserCreate.uname:'/' }}</span></br>
                <span>更新时间：{{ $dateUtil.convertMillSecToDateStr(item.wpsUpdateTime) }}</span></br>
                <span>更新人：{{ item.efUserUpdate?item.efUserUpdate.uname:'/' }}</span></br>
                <el-button slot="reference" type="text" size="mini"> 详细</el-button>
              </el-popover>
            </div>
            <div style="bottom:5px;right:30px;position:absolute">
              <el-tag effect="dark" size="mini" :type="item.wpsType===0 ? 'primary' : 'success'" disable-transitions>{{ item.wpsType==1?'大疆任务':'普通任务'}}</el-tag>
            </div>
            <div style="bottom:5px;right:5px;position:absolute">
              <el-popconfirm :title="'确定删除任务[ '+ item.wpsName+' ('+item.id+')' +' ]吗?'" @onConfirm="deleteTaskById(item.id)">
                <svg-icon slot="reference" style="position:absolute;bottom:5px;right:5px" icon-class="delete_black" />
              </el-popconfirm>
            </div>
          </el-card>
        </el-scrollbar>
        <div style="padding:5px;text-align:center">
          <el-button @click="isDialogTasks=false">关 闭</el-button>
        </div>
      </div>
    </el-drawer>
    <!-- Kmz文件 -->
    <el-drawer title="航线任务(Kmz)" :visible.sync="isDialogKmz" size="330px" :withHeader="true">
      <div style="height:100%;display:flex; flex-direction: column;overflow: hidden;">
        <el-scrollbar style="width: 100%; height:100%" wrap-style="overflow-x:hidden;" v-loading="loadingKmz" element-loading-text="加载中...">
          <el-card v-for="(item,index) in kmzFileList" :key="item.id" :body-style=" { padding: '0px' }" shadow="hover" class="cardKmz" @dblclick.native="clickTaskItem(item,true)">
            <div slot="header" class="clearfix">
              <span style="font-weight: bold">{{item.kmzName}}</span>
              <el-dropdown style="float: right; padding: 3px 0" size="mini" @command="MoreHandleCommandKmz">
                <span class="el-dropdown-link">
                  <el-button type="text" size="mini">操作</el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <!-- <el-dropdown-item :command="beforeMoreHandleCommandKmz(item,index,'export')">导出</el-dropdown-item>
                  <el-dropdown-item :command="beforeMoreHandleCommandKmz(item,index,'rename')">重命名</el-dropdown-item>
                  <el-dropdown-item :command="beforeMoreHandleCommandKmz(item,index,'delete')">删除航线</el-dropdown-item> -->
                  <el-dropdown-item :command="beforeMoreHandleCommandKmz(item,index,'upload')">上传航线文件至无人机</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="text item">
              <el-row align="middle">
                <el-col :span="10">
                  大小:
                </el-col>
                <el-col :span="14">
                  {{filtersType(item.kmzSize)}}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  创建日期:
                </el-col>
                <el-col :span="14">
                  {{parseTime(item.kmzCreateTime)}}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  更新日期:
                </el-col>
                <el-col :span="14">
                  {{parseTime(item.kmzUpdateTime)}}
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-scrollbar>
        <div style="padding:5px;text-align:center">
          <el-button @click="isDialogKmz=false">关 闭</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
</script>
<script src="./indexol.js"></script>

<style lang="scss" src="./indexol.scss" scoped>
</style>