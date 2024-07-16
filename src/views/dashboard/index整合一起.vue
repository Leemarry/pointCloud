<template>
  <div class="main">
    <!-- 左侧面板 -->
    <transition name="fade-transform" :duration="200" mode="in-out">
      <div v-show="!isLeftFold" class="left">
        <!-- 无人机面板 -->
        <div v-show="!isEditWps" class="leftuav">
          <div class="top">
            <!-- <svg-icon :icon-class="getOnlineStyle(selectedUavItem)?'uav_green':'uav_black'" /> -->
            <el-button style="width:100%;text-align:center" @click="isShowUavs = true">
              <svg-icon icon-class="uav_black" style="width:18px; height:18px;fill:gray" :style="getUavOnlineStatus(selectedUavItem)" />
              {{ (selectedUavItem == null || !selectedUavItem.uavId) ? "未选择" : selectedUavItem.uavName }}
            </el-button>
          </div>
          <!-- 实时无人机参数显示 -->
          <div class="parmitem">
            <div class="div">
              {{ ProgressShow }}
              <el-tooltip class="item" effect="dark" content="打开/关闭无人机电源" placement="top-start" v-show="isCanOpter">
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
              <el-col :span="17" :style="'color:' + getRealdataWarn('batt')">
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
              <el-col :span="17" :style="'color:' + getRealdataWarn('sign')">
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
                充电状态
              </el-col>
              <el-col :span="6" :style="'color:' + getRealdataWarn('charging')">
                {{ getRealdataDes('charging') }}
                <el-tooltip class="item" effect="dark" content="开始/停止充电" placement="top-start" v-show="isCanOpter">
                  <i v-if="getRealdataDes('chargingbool') === true" class="el-icon-loading" style="cursor:pointer" @click="startOrStopCharging()" />
                  <i v-else class="el-icon-thumb" style="cursor:pointer" @click="startOrStopCharging()" />
                </el-tooltip>
              </el-col>
              <el-col :span="6" class="parmName">
                遥控器
              </el-col>
              <el-col :span="6" :style="'color:' + getRealdataWarn('remote')">
                {{ getRealdataDes('remote') }}
                <el-tooltip class="item" effect="dark" content="打开/关闭遥控器" placement="top-start" v-show="isCanOpter">
                  <i class="el-icon-thumb" style="cursor:pointer" @click="openOrCloseRemote()" />
                </el-tooltip>
              </el-col>
            </el-row>
            <el-row v-show="selectedUavType === 1" :gutter="20">
              <el-col :span="6" class="parmName">
                地面站
              </el-col>
              <el-col :span="6" :style="'color:' + getRealdataWarn('gcs')">
                {{ getRealdataDes('gcs') }}
                <el-tooltip class="item" effect="dark" content="打开/关闭大疆地面站" placement="top-start" v-show="isCanOpter">
                  <i class="el-icon-thumb" style="cursor:pointer" @click="openOrCloseGcs()" />
                </el-tooltip>
              </el-col>
              <el-col :span="6" class="parmName">
                服务后台
              </el-col>
              <el-col :span="6" :style="'color:' + getRealdataWarn('server')">
                {{ getRealdataDes('server') }}
                <el-tooltip class="item" effect="dark" :content="getRealdataDes('boottime')" placement="top-start">
                  <i class="el-icon-timer" />
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
          <div class="button" v-show="isCanOpter">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-button :loading="loading" style="width:100%" type="" icon="el-icon-caret-right" size="medium" round @click="beforeDoCommand(1007, 0, 0, 0, 0, 10, '是否开始自动执行任务?')">执行任务</el-button>
              </el-col>
              <el-col :span="12">
                <el-button :loading="loading" style="width:100%" type="" icon="el-icon-s-home" size="medium" round @click="beforeDoCommand(1009, 0, 0, 0, 0, 10, '是否返航无人机?')">自动返航</el-button>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-button :loading="loading" style="width:100%" type="" icon="el-icon-d-caret" size="medium" round @click="beforeDoCommand(1104, 0, 0, 0, 0, 10, '是否立即悬停无人机?')">立即悬停</el-button>
              </el-col>
              <el-col :span="12">
                <el-dropdown size="mini" style="width:100%" @command="MoreHandleCommandUav">
                  <span class="el-dropdown-link">
                    <el-button :loading="loading" icon="el-icon-more" size="medium" round style="width:100%">更多操作
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="beforeMoreHandleCommandUav(1100, 0, 0, 0, 0, 10, '是否起飞无人机?')">起 飞
                    </el-dropdown-item>
                    <el-dropdown-item v-show="selectedUavType === 1" :command="beforeMoreHandleCommandUav(1105, 0, 0, 0, 0, 10, '是否精确起飞无人机?')">精确起飞</el-dropdown-item>
                    <el-dropdown-item :command="beforeMoreHandleCommandUav(1103, 0, 0, 0, 0, 10, '是否降落无人机?')">降 落
                    </el-dropdown-item>
                    <el-dropdown-item :command="beforeMoreHandleCommandUav(1102, 0, 0, 0, 0, 10, '是否返航无人机?')">返 航
                    </el-dropdown-item>

                    <el-dropdown-item :command="beforeMoreHandleCommandUav(1101, 0, 0, 0, 0, 10, '(需先上传任务) 是否开始执行任务?')" divided>执行任务</el-dropdown-item>
                    <el-dropdown-item v-show="selectedUavType === 1" :command="beforeMoreHandleCommandUav(1106, 0, 0, 0, 0, 10, '是否开始精确起飞执行任务?')">精确起飞执行任务</el-dropdown-item>

                    <el-dropdown-item icon="el-icon-upload2" :command="beforeMoreHandleCommandUav(1003, 0, 0, 0, 0, 10, '是否全自动起飞')" divided>全自动起飞</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-caret-right" :command="beforeMoreHandleCommandUav(1006, 0, 0, 0, 0, 10, '是否全自动执行任务?')">全自动执行任务</el-dropdown-item>
                    <el-dropdown-item v-show="selectedUavType === 1" icon="el-icon-upload2" :command="beforeMoreHandleCommandUav(1004, 0, 0, 0, 0, 10, '是否全自动起飞(视觉辅助模式)?')">全自动起飞(视觉辅助模式)
                    </el-dropdown-item>
                    <el-dropdown-item v-show="selectedUavType === 1" icon="el-icon-caret-right" :command="beforeMoreHandleCommandUav(1007, 0, 0, 0, 0, 10, '是否全自动执行任务(视觉辅助模式)?')">全自动执行任务(视觉辅助模式)
                    </el-dropdown-item>
                    <el-dropdown-item icon="el-icon-s-home" :command="beforeMoreHandleCommandUav(1009, 0, 0, 0, 0, 10, '是否开始全自动返航?')">全自动返航</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-close" :command="beforeMoreHandleCommandUav(1, 0, 0, 0, 0, 10, '是否终止全自动任务?')">终止全自动任务</el-dropdown-item>
                    <!-- <el-dropdown-item v-show="selectedUavType===1" :command="beforeMoreHandleCommandUav(1028,0,0,0,0,10,'是否打开大疆地面站?')" divided>打开大疆地面站</el-dropdown-item>
                    <el-dropdown-item v-show="selectedUavType===1" :command="beforeMoreHandleCommandUav(1030,0,0,0,0,10,'是否重启大疆地面站?')">重启大疆地面站</el-dropdown-item>
                    <el-dropdown-item v-show="selectedUavType===1" :command="beforeMoreHandleCommandUav(1029,0,0,0,0,10,'是否关闭大疆地面站?')">关闭大疆地面站</el-dropdown-item> -->
                    <el-dropdown-item v-show="selectedUavType === 1" :command="beforeMoreHandleCommandUav('openSystem', 0, 0, 0, 0, 10, '是否大疆系统所有模块电源?')" divided>一键打开系统电源
                    </el-dropdown-item>
                    <el-dropdown-item v-show="selectedUavType === 1" :command="beforeMoreHandleCommandUav('closeSystem', 0, 0, 0, 0, 10, '是否关闭系统所有模块电源?')">一键关闭系统电源
                    </el-dropdown-item>
                    <el-dropdown-item v-show="selectedUavType === 1" :command="beforeMoreHandleCommandUav(1199, 0, 0, 0, 0, 10, '是否启用模拟环境?')" divided>启用模拟环境
                    </el-dropdown-item>
                    <el-dropdown-item icon="el-icon-warning-outline" :command="beforeMoreHandleCommandUav(1150, 0, 0, 0, 0, 10, '是否请求远程控制?')" divided>请求远程控制
                    </el-dropdown-item>
                    <el-dropdown-item icon="el-icon-warning" :command="beforeMoreHandleCommandUav(1151, 0, 0, 0, 0, 10, '是否结束远程控制?')">结束远程控制</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </div>
          <!-- 无人机 视频 -->
          <div class="bottom">
            <div id="videoUav" class="videomain" @mouseover="isVideo1MouseOver = true" @mouseleave="isVideo1MouseOver = false">
              <div class="tools" v-show="isVideo1MouseOver">
                <el-button-group>
                  <el-tooltip class="item" effect="dark" content="刷新视频源" placement="bottom">
                    <el-button size="mini" icon="el-icon-refresh" circle @click="refreshVideo('uav')" />
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="停止播放" placement="bottom">
                    <el-button size="mini" icon="el-icon-video-pause" circle @click="stopVideo1()" />
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="拍照" placement="bottom">
                    <el-button size="mini" icon="el-icon-camera-solid" circle @click="doCommand(1162, 0, 0, 0, 0)" />
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="开始录像" placement="bottom">
                    <el-button size="mini" icon="el-icon-video-camera-solid" circle @click="doCommand(1163, 0, 0, 0, 0)" />
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="停止录像" placement="bottom">
                    <el-button size="mini" icon="el-icon-video-camera" circle @click="doCommand(1164, 0, 0, 0, 0)" />
                  </el-tooltip>
                </el-button-group>
              </div>
              <div v-show="isVideo1MouseOver && isCanOpter" class="cameracmd">
                <table>
                  <tr>
                    <td colspan="3">
                      <el-tooltip class="item" effect="dark" content="上" placement="top">
                        <el-button size="mini" icon="el-icon-top" circle @mousedown.native="sendCommandToWebsocketThread(1153, 0, 2, 0, 0)" @mouseup.native="sendCommandToWebsocketThread(1153, 0, 0, 0, 0)" />
                      </el-tooltip>
                    </td>
                    <td>
                      <el-tooltip class="item" effect="dark" content="缩放+" placement="left">
                        <el-button size="mini" icon="el-icon-plus" circle></el-button>
                      </el-tooltip>
                    </td>
                    <td>
                      <el-tooltip class="item" effect="dark" content="缩放-" placement="right">
                        <el-button size="mini" icon="el-icon-minus" circle></el-button>
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
                      <el-tooltip class="item" effect="dark" content="变焦+" placement="left">
                        <el-button size="mini" icon="el-icon-zoom-in" circle></el-button>
                      </el-tooltip>
                    </td>
                    <td>
                      <el-tooltip class="item" effect="dark" content="变焦-" placement="right">
                        <el-button size="mini" icon="el-icon-zoom-out" circle></el-button>
                      </el-tooltip>
                    </td>
                  </tr>
                </table>
              </div>
              <div id="video1" style="width:100%;height:100%" class="video" v-loading="isRequestStream1" :element-loading-text="textRequestStream1" element-loading-background="rgba(0, 0, 0, 0.5)"></div>
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
                  <el-tag effect="dark" size="mini" :type="selectedUavType === 2 ? 'primary' : 'success'" disable-transitions>{{ getUavTypeName(selectedUavType) + '航线任务' }}</el-tag>
                </el-col>
              </el-row>
              <el-row style="margin-top:10px">
                <el-col :span="12">航点总数：</el-col>
                <el-col :span="12" class="value">{{ wps.length }}</el-col>
              </el-row>
              <el-row>
                <el-col :span="12">航程：</el-col>
                <el-col :span="12" class="value">{{ (wpsInfo.wpsDistance / 1000).toFixed(2) }} 千米</el-col>
              </el-row>
              <el-row>
                <el-col :span="12">预计耗时：</el-col>
                <el-col :span="12" class="value">{{ (wpsInfo.wpsUserTime / 60).toFixed(2) }} 分钟</el-col>
              </el-row>
              <el-row>
                <el-col :span="12">默认高度：</el-col>
                <el-col :span="10" class="value">{{ defaultWpParm.alt }} 米</el-col>
                <el-col :span="2"><i style="cursor:pointer" class="el-icon-edit" @click="startSetDefaultAlt" />
                </el-col>
              </el-row>
              <div class="div" v-show="selectedUavType === 1">
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
                    <el-input-number style="width:100%" size="mini" v-model="wpsInfo.wpsRepeatTimes" :min="1" :max="100" label="次数"></el-input-number>
                  </el-col>
                </el-row>
              </div>
            </div>
            <el-scrollbar wrap-style="overflow-x:hidden;flex:1">
              <el-card v-for="(item) in wps" :key="item.wpIndex" :body-style="{ padding: '0px' }" shadow="hover" :class="item.selected ? 'cardBgWpsSelected' : 'cardBgWps'" @click.native="clickWpsItem(item)">
                <div class="cardLeftWps">
                  {{ item.wpIndex + 1 }}
                </div>
                <div class="cardRightWps">
                  <el-dropdown size="medium" @command="MoreHandleCommandWps">
                    <span class="el-dropdown-link">
                      <i class="el-icon-more" style="cursor:pointer" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :command="beforeMoreHandleCommandWps(item, item.wpIndex, 'edit')">修改
                      </el-dropdown-item>
                      <el-dropdown-item :command="beforeMoreHandleCommandWps(item, item.wpIndex, 'editall')">全部修改
                      </el-dropdown-item>
                      <el-dropdown-item :command="beforeMoreHandleCommandWps(item, item.wpIndex, 'insert')">插入航点
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-popconfirm :title="'确定删除[ ' + (item.wpIndex + 1) + ' ]号航点？'" @onConfirm="deleteWp(item.wpIndex)">
                    <svg-icon slot="reference" style="position:absolute;bottom:5px;right:5px" icon-class="delete_black" />
                  </el-popconfirm>
                  <!-- <svg-icon style="position:absolute;bottom:5px;right:5px" icon-class="delete_black" @click="deleteWpBefore(item)" /> -->
                </div>
                <div class="cardMiddleWps">
                  <table>
                    <tr v-show="selectedUavType === 2">
                      <td>命令：</td>
                      <td><strong>{{ getCommandDes(item) }}</strong></td>
                    </tr>
                    <tr>
                      <td>纬度：</td>
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
                    <tr v-show="selectedUavType === 1">
                      <td>动作：</td>
                      <td><strong>{{ getActionDes(item) }}</strong></td>
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
      <div id="container" class="mainbody">
        <el-amap vid="amap" :center="centerPosition" :zoom="zoom" :events="mapEvents" :plugin="plugin" :keyboardEnable="false" :mapStyle="mapStyle" style="width:100%;height:100%">
          <!-- 无人机起飞点图标 -->
          <el-amap-marker :visible="getUavHomeMarkerVisble()" :title="getUavHomeTitle()" :position="getMarkerUavHomePostion()" :offset="markerGridOffset" :content="getHomeMarkerContent(20, 20)" />
          <!-- 航点路径 -->
          <el-amap-polyline :path="wpsPath" strokeColor="#3CB371" />
          <el-amap-polygon :events="polygonEvents" :path="grids" fillColor="#2b83f9" fillOpacity="0.5" strokeWeight="0" strokeColor="#2b83f9" strokeOpacity="0.5" />
          <!-- 航点图标 -->
          <el-amap-marker :clickable="isEditWps" v-for="item in wps" :key="item.wpIndex" :position="getMarkerPostion(item.wpLat, item.wpLng)" :ext-data="item" :content="getMarkerContent(item, 26, 26)" :events="markerEvents" :offset="markerOffset" :draggable="isEditWps" class="selectedMarker" />
          <!-- 区域边界点 -->
          <el-amap-marker :clickable="isEditGrid" v-for="item in gridsWps" :key="item.index" :position="getMarkerPostion(item.lat, item.lng)" :ext-data="item" :content="getGridMarkerContent(item, 20, 20)" :events="markerGridEvents" :offset="markerGridOffset" :draggable="isEditGrid" class="selectedMarker" />
          <!-- 根据区域生成航线时，起始点位置 -->
          <el-amap-marker v-for="item in markerOthersModel" :key="item.tag" :clickable="isEditGrid" :position="getMarkerPostion(item.lat, item.lng)" :ext-data="item" :content="getOtherMarkerContent(item, 20, 20)" :offset="markerGridOffset" class="selectedMarker" />
          <!-- 机巢图标 -->
          <el-amap-marker v-for="item in hives" :key="item.hiveId" :title="getHiveTitle(item)" :position="getMarkerHivePostion(item)" :offset="markerUavHiveOffset" :ext-data="item" :icon="getHiveIco(item)" class="selectedMarker" />
          <!-- 无人机图标 -->
          <el-amap-marker v-for="item in uavs" :key="item.uavId" :visible="getUavMarkerVisble(item)" :title="getUavTitle(item)" :position="getMarkerUavPostion(item)" :offset="markerUavHiveOffset" :ext-data="item" :icon="getUavIco(item)" :angle="getMarkerUavRoute(item)" class="selectedMarker" />
          <!-- <el-amap-marker v-for="item in uavs" :key="item.uavId" :visible="getUavMarkerVisble(item)" :title="getUavTitle(item)" :position="getMarkerUavPostion(item)" :offset="markerUavHiveOffset" :ext-data="item" :content="getUavMarkerContent(item, 20, 20)" :angle="getMarkerUavRoute(item)" class="selectedMarker" /> -->
          <!-- :icon="getUavIco(item)" -->
        </el-amap>
      </div>
      <div class="leftHideButton">
        <i :class="isLeftFold ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'" @click="isLeftFold = !isLeftFold"></i>
      </div>
      <div class="rightHideButton" v-show="isHasHive">
        <i :class="isRightFold ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right'" @click="isRightFold = !isRightFold"></i>
      </div>
      <!-- 无人机控制 -->
      <div class="divUavControl" v-show="false">
        <div style="background-color:">
          <el-row :gutter="10" type="flex" justify="center" align="middle">
            <el-button icon="el-icon-top" circle>W</el-button>
          </el-row>
          <el-row :gutter="10" type="flex" justify="center" align="middle">
            <el-col :span="8">
              <el-button icon="el-icon-back" circle>A</el-button>
            </el-col>
            <el-col :span="8">
              <el-button icon="el-icon-refresh-right" circle>Q</el-button>
            </el-col>
            <el-col :span="8">
              <el-button icon="el-icon-right" circle>D</el-button>
            </el-col>
          </el-row>
          <el-row :gutter="10" type="flex" justify="center" align="middle">
            <el-button icon="el-icon-bottom" circle>S</el-button>
          </el-row>
        </div>
        <div style="background-color:">
          <el-row :gutter="10" type="flex" justify="center" align="middle">
            <el-button icon="el-icon-caret-top" circle>U</el-button>
          </el-row>
          <el-row :gutter="10" type="flex" justify="center" align="middle">
            爬升/下降
          </el-row>
          <el-row :gutter="10" type="flex" justify="center" align="middle">
            <el-button icon="el-icon-caret-bottom" circle>I</el-button>
          </el-row>
        </div>
        <el-button type="" icon="el-icon-delete" size="mini" round>重新选择</el-button>
      </div>
      <!-- 中间 航线编辑按钮 -->
      <div class="divTopMiddle" v-show="isEditWps">
        <el-button-group round size="mini">
          <el-button :type="isEditGrid ? 'success' : ''" icon="el-icon-news" round size="mini" @click="enableGrid()">
            {{ isEditGrid ? '关闭区域选择' : '选择区域' }}</el-button>
          <el-button type="" icon="el-icon-upload2" size="mini" @click="uploadWps()">上传</el-button>
          <el-button type="" icon="el-icon-download" size="mini" @click="downloadWps()">下载</el-button>
          <el-button type="" icon="el-icon-delete" size="mini" @click="clearWps()">清空</el-button>
          <el-button type="" icon="el-icon-close" round @click="enableEditWps(false)" size="mini">退出编辑</el-button>
        </el-button-group>
      </div>
      <!-- 左下角，键盘操作说明 -->
      <div class="divBottomLeftTool" v-show="isRemoteEnable || true">
        <span style="color:black;font-size:12px;font-weight: bold;">键盘操作说明 </span></br>
        <span style="color:black;font-size:12px;font-weight: bold;">- 无人机</span></br>
        <span style="color:yellow;font-size:12px;font-weight: bold;">W: 前进,S: 后退,A: 左移,S: 右移</span></br>
        <span style="color:yellow;font-size:12px;font-weight: bold;">U: 上升,I: 下降,J: 转向,K: 转向</span></br>
        <span style="color:black;font-size:12px;font-weight: bold;">- 云台控制</span></br>
        <span style="color:yellow;font-size:12px;font-weight: bold;">↑ ↓: 俯仰</span></br>
        <span style="color:yellow;font-size:12px;font-weight: bold;">← →: 偏航</span></br>
      </div>
      <!-- 右下角 遥控器 -->
      <div class="divBottomRightToolRemote" v-show="isRemoteConnect || isRemoteEnable">
        <span style="color:yellow;font-size:12px;font-weight: bold;">最大速度</span>
        <el-slider v-model="moveSpeed" :min="moveMinSpeed" :max="moveMaxSpeed" :show-stops="true" :step="0.5" :format-tooltip="formatMoveSpeedTooltip"></el-slider>
        <span style="color:yellow;font-size:12px;font-weight: bold;" v-show="isRemoteConnect">油门值</span>
        <el-progress :text-inside="true" :stroke-width="20" :percentage="getThrottle()" status="exception" style="margin-bottom:5px" v-show="isRemoteConnect"></el-progress>
        <el-tag v-show="isRemoteConnect" :type="isRemoteEnable ? 'danger' : 'success'" effect="dark" style="cursor: pointer" @click="isDialogRemoteHelp = true">已连接摇杆</el-tag>
      </div>
      <!-- 右上角工具 -->
      <div class="divBottomRightTool">
        <table>
          <tr>
            <el-tooltip class="item" effect="light" content="航线编辑" placement="left">
              <el-button :type="isEditWps ? 'success' : ''" icon="el-icon-edit" size="mini" @click="enableEditWps()" circle>
              </el-button>
            </el-tooltip>
          </tr>
          <tr>
            <el-tooltip class="item" effect="light" content="下载航线任务" placement="left">
              <el-button type="" icon="el-icon-download" size="mini" @click="downloadWps()" circle></el-button>
            </el-tooltip>
          </tr>
          <tr>
            <el-tooltip class="item" effect="light" content="从云端获取任务" placement="left">
              <el-button type="" icon="el-icon-cloudy" size="mini" @click="showAllTaskWps()" circle></el-button>
            </el-tooltip>
          </tr>
          <tr>
            <el-tooltip class="item" effect="light" content="距离测量" placement="left">
              <el-button :type="isMapRuler ? 'success' : ''" icon="el-icon-watermelon" size="mini" circle @click="enableRuler()" />
            </el-tooltip>
          </tr>
          <tr>
            <el-tooltip class="item" effect="light" content="面积测量" placement="left">
              <el-button :type="isMapArea ? 'success' : ''" icon="el-icon-crop" size="mini" circle @click="enableArea()" />
            </el-tooltip>
          </tr>
          <tr>
            <el-tooltip class="item" effect="light" content="设置" placement="left">
              <el-button type="" icon="el-icon-setting" size="mini" circle @click="isDialogConfig = true" />
            </el-tooltip>
          </tr>
        </table>
      </div>
      <!-- 中间 区域编辑按钮 -->
      <div class="sideLeftGridBtn" v-show="isEditGrid">
        <el-button-group round size="mini">
          <el-button type="" icon="el-icon-delete" size="mini" v-show="isEditGrid" @click="grids = [], gridsWps = []" round>
            重新选择</el-button>
          <el-button type="" icon="el-icon-download" size="mini" v-show="isEditGrid" round @click="autoWps()">生成航线
          </el-button>
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
            <el-link type="success" @click="isEditGridChoiceStartPoint = !isEditGridChoiceStartPoint">
              {{ isEditGridChoiceStartPoint ? '选取中...' : '选择起始点' }}</el-link>
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
            <el-input-number style="width:100%" size="mini" v-model="gridAutoParms.yaw" :min="0" :max="180" label="朝向">
            </el-input-number>
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
      <div class="right" v-show="isHasHive && !isRightFold">
        <div class="righthive">
          <div class="top">
            <el-button @click="isShowThisUavHives = true" v-show="getIsThisUavContainsHive()" style="width:100%">
              <svg-icon :icon-class="getOnlineStyle(selectedHiveItem) ? 'hive_green' : 'hive_black'" />
              {{ (selectedHiveItem == null) ? "未选择" : selectedHiveItem.hiveName }}
            </el-button>
          </div>
          <div class="parmitem">
            <div class="div">{{ getHiveRealdataDes('hive') }}</div>
            <el-row type="flex" justify="space-around" :gutter="20">
              <el-col :span="7" class="parmName">
                机舱温度
              </el-col>
              <el-col :span="10">
                {{ getHiveRealdataDes('hivetemp') }}
              </el-col>
              <el-col :span="7" class="parmName">
                ℃
              </el-col>
            </el-row>
            <el-row type="flex" justify="space-around" :gutter="20">
              <el-col :span="7" class="parmName">
                海拔高度
              </el-col>
              <el-col :span="10">
                {{ getHiveRealdataDes('altabs') }}
              </el-col>
              <el-col :span="7" class="parmName">
                米
              </el-col>
            </el-row>
            <el-row type="flex" justify="space-around" :gutter="20">
              <el-col :span="7" class="parmName">
                开启次数
              </el-col>
              <el-col :span="10">
                {{ getHiveRealdataDes('usetime') }}
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
                未运行
              </el-col>
              <el-col :span="7" class="parmName">
                <el-tooltip class="item" effect="dark" content="打开/关闭空调" placement="top-start" v-show="isCanOpter">
                  <i class="el-icon-thumb" style="cursor:pointer" @click="openOrCloseAirConditioner()" />
                </el-tooltip>
              </el-col>
            </el-row>
            <el-row type="flex" justify="space-around" :gutter="20">
              <el-col :span="7" class="parmName">
                运行时长
              </el-col>
              <el-col :span="17">
                {{ getHiveRealdataDes('runtime') }}
              </el-col>
            </el-row>
            <el-row type="flex" justify="space-around" :gutter="20">
              <el-col :span="7" class="parmName">
                安装位置
              </el-col>
              <el-col :span="17">
                {{ getHiveRealdataDes('address') }}
              </el-col>
            </el-row>
          </div>
          <div class="parmitem2">
            <el-row>
              <el-col :span="6" class="parmName">
                风力
              </el-col>
              <el-col :span="6">
                {{ getHiveWeatherDes('windPower') }} 级
              </el-col>
              <el-col :span="6" class="parmName">
                风速
              </el-col>
              <el-col :span="6">
                {{ getHiveWeatherDes('windSpeed') }} 米/秒
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6" class="parmName">
                温度
              </el-col>
              <el-col :span="6">
                {{ getHiveWeatherDes('airTemp') }} ℃
              </el-col>
              <el-col :span="6" class="parmName">
                湿度
              </el-col>
              <el-col :span="6">
                {{ getHiveWeatherDes('airHumidity') }} %
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6" class="parmName">
                雨雪
              </el-col>
              <el-col :span="6">
                {{ getHiveWeatherDes('rainSnow') }}
              </el-col>
              <el-col :span="6" class="parmName">
                降雨量
              </el-col>
              <el-col :span="6">
                {{ getHiveWeatherDes('rainWater') }} mm
              </el-col>
            </el-row>
          </div>
          <div class="button" v-show="isCanOpter">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-button :loading="loading" style="width:100%" icon="el-icon-open" size="medium" round @click="beforeDoCommandHive(4, 1, 0, 0, 0, 10, '是否打开停机坪?')">打开</el-button>
              </el-col>
              <el-col :span="8">
                <el-button :loading="loading" style="width:100%" icon="el-icon-video-pause" size="medium" round @click="beforeDoCommandHive(4, 3, 0, 0, 0, 10, '是否暂停停机坪开关?')">暂停</el-button>
              </el-col>
              <el-col :span="8">
                <el-button :loading="loading" style="width:100%" icon="el-icon-turn-off" size="medium" round @click="beforeDoCommandHive(4, 2, 0, 0, 0, 10, '是否关闭停机坪?')">关闭</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="bottom">
            <!-- 机巢视频 -->
            <div id="videoHive" class="videomain" @mouseover="isVideo2MouseOver = true" @mouseleave="isVideo2MouseOver = false" v-show="isShowHiveVideo && getIsThisUavContainsHive()">
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
              <div id="video2" class="video" v-loading="isRequestStream2" :element-loading-text="textRequestStream2" element-loading-background="rgba(0, 0, 0, 0.5)"></div>
            </div>
            <!-- 视频切换按钮 -->
            <div class="switchBtn2"><i class="el-icon-top-left" @click="switchVideoMap('hive')"></i></div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 编辑单个航点 -->
    <el-dialog title="航点编辑" :visible.sync="isDialogEditWp" width="350px">
      <el-form :model="editWpDialogModel" size="mini">
        <el-form-item label="命令" :label-width="formLabelWidth" v-show="selectedUavType === 2">
          <el-select v-model="editWpDialogModel.wpAction" placeholder="请选择命令" style="width:100%">
            <el-option v-for="item in efCommands" :key="item.cmdId" :label="item.cmdNameZh" :value="item.cmdId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="纬度" :label-width="formLabelWidth">
          <el-input v-model="editWpDialogModel.wpLat" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="经度" :label-width="formLabelWidth">
          <el-input v-model="editWpDialogModel.wpLng" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="高度" :label-width="formLabelWidth">
          <el-input v-model="editWpDialogModel.wpAlt" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="动作" :label-width="formLabelWidth" v-show="selectedUavType === 1">
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
        <el-form-item label="动作" :label-width="formLabelWidth" v-show="selectedUavType === 1">
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
        <el-form-item label="命令" :label-width="formLabelWidth" v-show="selectedUavType === 2 && editWpsDialogModel.type === 1">
          <el-select v-model="editWpsDialogModel.wpAction" placeholder="请选择命令" style="width:100%">
            <el-option v-for="item in efCommands" :key="item.cmdId" :label="item.cmdNameZh" :value="item.cmdId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="高度" :label-width="formLabelWidth" v-show="editWpsDialogModel.type === 0">
          <el-input v-model="editWpsDialogModel.wpAlt" oninput="value=value.replace(/[^0-9.]/g,'')" autocomplete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="动作" :label-width="formLabelWidth" v-show="selectedUavType === 1 && editWpsDialogModel.type === 1">
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
    <el-dialog title="我的无人机" :visible.sync="isShowUavs" width="50%">
      <el-table :data="uavs" border height="300" @row-dblclick="clickUavRow" highlight-current-row :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }" :row-style="getUavSelectedRowStyle" empty-text="没有拥有权限的无人机">
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column label="类型" width="100">
          <template slot-scope="scope">
            <el-tag effect="dark" size="mini" :type="scope.row.uavFactoryId === 2 ? 'primary' : 'success'" disable-transitions>{{ getUavTypeName(scope.row.uavFactoryId) }}</el-tag>
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
        <el-table-column label="选择" width="100">
          <template slot-scope="scope">
            <el-button @click="clickUavItem(scope.row, true)" type="text" size="small">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowUavs = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 切换停机坪 -->
    <el-dialog title="我的停机坪" :visible.sync="isShowThisUavHives" width="50%">
      <el-table :data="hivesNowUav" border height="300" @row-dblclick="clickHiveRow" highlight-current-row :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }" :row-style="getHiveSelectedRowStyle" empty-text="当前无人机未绑定停机坪">
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="hiveId" label="编号">
        </el-table-column>
        <el-table-column prop="hiveName" label="名称">
        </el-table-column>
        <el-table-column prop="hiveAddress" label="位置">
        </el-table-column>
        <el-table-column prop="hiveDes" label="描述">
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
          <p v-for="(item, i) in remoteAxis">轴 :{{ i }} --- 值:{{ item.toFixed(5) }}</p>
        </el-col>
        <el-col :span="10" align="right">
          <p v-for="(item, i) in remoteButtons">按键:{{ i }} --- 值:{{ item.value }}</p>
        </el-col>
      </el-row>
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
          <el-col :span="6">地图风格:</el-col>
          <el-col :span="18">
            <el-select size="mini" v-model="mapStyle" placeholder="请选择风格" style="width:100%">
              <el-option label="默认" value="normal" />
              <el-option label="深色" value="dark" />
              <el-option label="浅色" value="light" />
              <el-option label="清新风格" value="fresh" />
            </el-select>
          </el-col>
        </el-row>
        <el-row style="margin-top:30px" type="flex" align="middle">
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
    <el-drawer title="云端任务" :visible.sync="isDialogTasks" size="450px" :withHeader="false">
      <div style="height:100%;display: flex;flex-direction: column;">
        <div style="padding:10px;font:20px">
          云端任务列表
        </div>
        <div v-loading="loadingWps" style="flex:1" element-loading-text="加载中...">
          <el-scrollbar style="height:100%" wrap-style="overflow-x:hidden;flex:1">
            <el-card v-for="(item) in taskWps" :key="item.id" :body-style="{ padding: '0px' }" shadow="hover" :class="item.selected ? 'cardBgSelected_task' : 'cardBg_task'" @click.native="clickTaskItem(item)" @dblclick.native="clickTaskItem(item, true)">
              <div class="cardLeft" style="display: flex;flex-direction: column;">
                <svg-icon icon-class="file" style="width:32px; height:32px;fill:blue" />
                <strong style="postion:absolute;bottom:0px">{{ item.id }}</strong>
              </div>
              <div class="cardMiddle">
                <table style="width:100%;table-layout:fixed;word-break:break-all">
                  <tr>
                    <td width="80">任务名称：</td>
                    <td width="30%"><strong>{{ item.wpsName }}</strong></td>
                    <td width="80">航点数量：</td>
                    <td width="40%"><strong>{{ item.wpsWpCount }} 个</strong></td>
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
                    <td><strong>{{ $dateUtil.convertMillSecToDateStr(item.wpsCreateTime, 'yyyy-MM-dd HH:mm') }}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>位置：</td>
                    <td colspan="3"><strong>{{ item.wpsLocation }}</strong></td>
                  </tr>
                  <tr>
                    <td>描述：</td>
                    <td colspan="3"><strong>{{ item.wpsDes }}</strong></td>
                  </tr>
                </table>
              </div>
              <div style="top:5px;right:5px;position:absolute">
                <el-dropdown size="mini" @command="MoreHandleCommandTask">
                  <span class="el-dropdown-link">
                    <el-button type="text">操作</el-button>
                    <!-- <i class="el-icon-more" style="cursor:pointer" /> -->
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="beforeMoreHandleCommandTask(item, item.id, 'download')">下载任务
                    </el-dropdown-item>
                    <el-dropdown-item :command="beforeMoreHandleCommandTask(item, item.id, 'update')">修改任务
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-popover placement="top-start" title="航线详情" width="250" trigger="hover">
                  <p>所在纬度：{{ item.wpsLat }}</p>
                  <p>所在经度：{{ item.wpsLng }}</p>
                  <p>飞行高度：{{ item.wpsAlt }} 米</p>
                  <p>飞行海拔：{{ item.wpsAltAbs }} 米</p>
                  <p v-show="item.wpsType === 1">飞行速度：{{ item.wpsSpeed }} 米/秒</p>
                  <p v-show="item.wpsType === 1">最大速度：{{ item.wpsMaxSpeed }} 米/秒</p>
                  <p v-show="item.wpsType === 1">遥控链路中断：{{ item.wpsRcSignalLost }}</p>
                  <p v-show="item.wpsType === 1">航线路径类型：{{ item.wpsFlightPathMode }}</p>
                  <p v-show="item.wpsType === 1">飞行路径方式：{{ item.wpsGotoWaypointMode }}</p>
                  <p v-show="item.wpsType === 1">飞行时朝向：{{ item.wpsHeadingMode }}</p>
                  <p v-show="item.wpsType === 1">完成任务后：{{ item.wpsFinishedAction }}</p>
                  <p v-show="item.wpsType === 1">执行次数：{{ item.wpsRepeatTimes }} 次</p>
                  <p>创建时间：{{ $dateUtil.convertMillSecToDateStr(item.wpsCreateTime) }}</p>
                  <p>创建人：{{ item.efUserCreate.uname }}</p>
                  <p>更新时间：{{ $dateUtil.convertMillSecToDateStr(item.wpsUpdateTime) }}</p>
                  <p>更新人：{{ item.efUserUpdate.uname }}</p>
                  <el-button slot="reference" type="text" size="mini"> 详细</el-button>
                </el-popover>
              </div>
              <div style="bottom:5px;right:30px;position:absolute">
                <el-tag effect="dark" size="mini" :type="item.wpsType === 0 ? 'primary' : 'success'" disable-transitions>
                  {{ item.wpsType == 1 ? '大疆任务' : '普通任务' }}</el-tag>
              </div>
              <div style="bottom:5px;right:5px;position:absolute">
                <el-popconfirm :title="'确定删除任务[ ' + item.wpsName + ' (' + item.id + ')' + ' ]吗?'" @onConfirm="deleteTaskById(item.id)">
                  <svg-icon slot="reference" style="position:absolute;bottom:5px;right:5px" icon-class="delete_black" />
                </el-popconfirm>
              </div>
            </el-card>
          </el-scrollbar>
        </div>
        <div style="padding:5px;text-align:center">
          <el-button @click="isDialogTasks = false">关 闭</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script src='https://web.sdk.qcloud.com/player/tcplayerlite/release/v2.4.1/TcPlayer-2.4.1.js' charset='utf-8'></script>
<script>
import { mapGetters } from 'vuex'
import Cookies from 'js-cookie'
import { parseTime } from '@/utils/index'
import $ from 'jquery'

export default {
  name: 'index',
  data() {
    const self = this
    return {
      centerPosition: [114.5273285, 30.56789], // 用户当前位置经纬度
      zoom: 16,
      ProgressShow: '离线',
      ttlMessage: null, // ttl语音播放对象
      ProgressShowTime: 0, // 刷新的时间戳，超过30秒则赋值为空
      djiUavOnline: require('@/assets/images/uavOnline.png'),
      djiUavOffline: require('@/assets/images/uavOffline.png'),
      efUavOnline: require('@/assets/images/uavOnline.png'),
      efUavOffline: require('@/assets/images/uavOffline.png'),
      hiveOnline: require('@/assets/images/hiveOnline.png'),
      hiveOffline: require('@/assets/images/hiveOffline.png'),
      t16000: require('@/assets/images/T16000.png'),
      formLabelWidth: '50px',
      fileListKml: [],
      webSocket: null,
      isLeftFold: false,
      isRightFold: false,
      loading: false,
      loadingWps: false,
      loadingText: '拼命干活中...',
      taskWps: [], // 航线任务
      messageType: 'info',
      isShowMessageTip: false,
      messageTip: '拼命干活中',
      isShowUavs: false,
      isCanOpter: false, // 是否可以操作无人机或停机坪
      isShowThisUavHives: false,
      isEditWps: false,
      isEditGrid: false,
      isEditGridChoiceStartPoint: false,
      isDialogEditWp: false,
      isDialogEditWps: false,
      isDialogConfig: false,
      isDialogTasks: false,
      isDialogEditDjiAction: false,
      isSendRemoteData: false,
      mapStyle: 'normal', // 地图样式，支持normal（默认样式）、dark（深色样式）、light（浅色样式）、fresh(osm清新风格样式)四种
      bigView: 'map',
      isMapFollowUav: true,
      isFirstGpsFixed: false, // 第一次定位，刷新位置到无人机位置
      isShowUavFlyedPath: true,
      isShowHiveVideo: true,
      isHasHive: false, // 当前无人机是否有停机坪
      // 视频
      isVideo1MouseOver: false,
      isVideo2MouseOver: false,
      isRequestStream1: false,
      isRequestStream2: false,
      textRequestStream1: '加载中',
      textRequestStream2: '加载中',
      TcPlayerUav: null, // 无人机视频播放控件
      TcPlayerHive: null, // 停机坪视频播放控件
      markerUavsModel: [], // 多无人机图标
      markerOthersModel: [{
        index: 0,
        tag: '',
        lat: 0,
        lng: 0
      }], // 其它特殊图标，通过tag区分
      hives: [],
      uavs: [],
      hivesNowUav: [],
      // 当前选中的无人机
      selectedUavItem: {},
      // 当前选中的停机坪
      selectedHiveItem: {},
      // 当前选择的无人机类型 ，1 大疆，2 翼飞，3 xxx
      selectedUavType: 2,
      // 遥控器
      // 键盘按键
      lastPressKeyCode: -1,
      moveSpeed: 3,
      moveMinSpeed: 0.5, // 摇杆操作运动速度范围
      moveMaxSpeed: 10, // 摇杆操作运动速度范围
      isYuntaiMode: true, // 默认为拍照模式，false为录像模式
      isDoingCommand: false, // 是否正在执行动作命令
      isRemoteConnect: false,
      isRemoteEnable: false,
      isDialogRemote: false,
      isDialogRemoteHelp: false,
      timerSendRemoteData: false,
      timerSendPanData: null, // 按下按钮时，需要定时发送数据
      remoteAxis: [],
      remoteButtons: [],

      isKeyboardKeydown: false,
      roll: 0,
      pitch: 0,
      yaw: 0,
      alt: 0,
      rollKey: 0,
      pitchKey: 0,
      yawKey: 0,
      altKey: 0,
      rollYuntai: 0,
      pitchYuntai: 0,
      yawYuntai: 0,

      timerRefreshUi: null, // 定时器名称,
      markerOffset: [-13, -13],
      markerGridOffset: [-10, -10],
      markerUavHiveOffset: [-32, -32],
      defaultWpParm: { // 默认航线值
        type: 'ef', // ef,dji
        command: 16,
        action: 0,
        alt: 30
      },
      efCommands: [], // 翼飞命令
      djiActions: [], // 大疆动作
      editWpDialogModel: {}, // 当前编辑的航点对象
      editWpDjiActionDialogModel: {
        action: 0,
        parm: 0
      }, // 编辑大疆指令
      //  修改全部航点
      editWpsDialogModel: {
        type: 0, // 0:高度，1：命令
        wpAlt: 30,
        wpAction: 16,
        wpDjiActions: ''
      },
      grids: [],
      gridsWps: [],
      wpsPath: [],
      gridAutoParms: {
        alt: 50,
        homePos: { lat: 0, lng: 0 },
        spacing: 50,
        headSpacing: 30,
        yaw: 90,
        outlineDistance: 0
      },
      // 航点数组
      wps: [{
        wpIndex: 0,
        wpLat: 0,
        wpLng: 0,
        wpAlt: 0,
        wpAltAbs: 0,
        wpAction: 0,
        wpDjiActions: '',
        wpParm1: 0,
        wpParm2: 0,
        wpParm3: 0,
        wpParm4: 0
      }],
      wpsGotoWaypointModeOptions: [{ label: '空', value: 0 }],
      wpsHeadingModeOptons: [{ label: '空', value: 0 }],
      wpsFlightPathModeOptions: [{ label: '空', value: 0 }],
      wpsFinishedActionOptions: [{ label: '空', value: 0 }],
      wpsRcSignalLostOptions: [{ label: '空', value: 0 }],
      wpsInfo: { // 当前任务的描述，航程，飞行时长等
        wpsName: '',
        wpsType: 0, // 0 翼飞，1 大疆
        wpsLat: 30.456,
        wpsLng: 114.567,
        wpsAlt: 30,
        wpsDistance: 0,
        wpsUserTime: 0,
        wpsWpCount: 0,
        wpsLocation: '湖北省武汉市',
        wpsAltAbs: 0,
        wpsDes: '任务描述',
        wpsSpeed: 5, // 任务飞行速度
        wpsMaxSpeed: 15, // 最大速度
        wpsRcSignalLost: 0, // 遥控信号丢失
        wpsFinishedAction: 1, // 任务结束后执行动作
        wpsFlightPathMode: 0, // 航点或曲线航点
        wpsGotoWaypointMode: 0, // 如何飞到第一个航点
        wpsHeadingMode: 0, // 机头朝向
        wpsRepeatTimes: 1 // 任务执行次数
      },
      // mapRangingTool: {},
      mapTools: {},
      isMapRuler: false,
      isMapArea: false,
      mapEvents: {
        init(map) {
          // console.log(map.getCenter());
          // self.mapRangingTool = new window.AMap.RangingTool(map) // MouseTool
          self.mapTools = new window.AMap.MouseTool(map) // RangingTool
        },
        zoomchange: (e) => {
          // console.log(e);
        },
        zoomend: (e) => {
          // 获取当前缩放zoom值
          // console.log(this.$refs.map.$$getInstance().getZoom());
          // console.log(e);
        },
        click: e => {
          this.mapClick(e)
        }
      },
      plugin: [
        'ToolBar',
        {
          pName: 'MapType',
          // 1为卫星图 0为默认
          defaultType: 1,
          // showRoad和showTraffic 为路况和路网
          showRoad: true,
          showTraffic: false,
          position: 'LT',
          events: {
            init(o) {
              // console.log(o);
            },
          },
        },
        //   {
        //   pName: 'Geolocation',
        //   events: {
        //     init(o) {
        //       // o 是高德地图定位插件实例
        //       // o.getCurrentPosition((status, result) => {
        //       //   if (result && result.position) {
        //       //     self.lng = result.position.lng;
        //       //     self.lat = result.position.lat;
        //       //     self.center = [self.lng, self.lat];
        //       //     self.markers[0].position = self.center;
        //       //     self.loaded = true;
        //       //     self.$nextTick();
        //       //   }
        //       // });
        //     }
        //   }
        // },
        {
          pName: 'Geocoder',
          events: {
            init(o) {
              // 定位第一次逆解码
              // o.getAddress(self.center, (status, result) => {
              //   if (status === 'complete' && result.info === 'OK') {
              //     self.formattedAddress = result.regeocode.formattedAddress
              //   }
              // })
            }
          }
        }
      ],
      markerEvents: {
        click: e => {
          // alert(e)
        },
        dragend: (e) => { // 移动坐标点
          const marker = e.target
          // const position = [e.lnglat.lng, e.lnglat.lat]
          const positionGps = this.$gisUtil.ConvertAmapToGps(e.lnglat.lat, e.lnglat.lng)
          // marker.position = [e.lnglat.lng, e.lnglat.lat]
          const position = [positionGps.lng, positionGps.lat]
          this.updateWpPostion(marker.getExtData(), position)
        }
      },
      polygonEvents: {
        click: e => {
          // this.$layer.msg('点击了多边形：' + e)
        }
      },
      markerGridEvents: {
        click: e => {
          const marker = e.target
          const wp = marker.getExtData()
          this.$confirm('是否移除 ' + (wp.index + 1) + ' 号边界点?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.removeWpGrid(wp)
          }).catch(() => { })
        },
        dragend: (e) => { // 移动坐标点
          const marker = e.target
          // const position = [e.lnglat.lng, e.lnglat.lat]
          const gps = this.$gisUtil.ConvertAmapToGps(e.lnglat.lat, e.lnglat.lng)
          const positionGps = [gps.lng, gps.lat]
          const positionAmap = [e.lnglat.lng, e.lnglat.lat]
          this.updateGridWpPostion(marker.getExtData(), positionGps, positionAmap)
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'userId',
      'name',
      'defaultUavIndex',
      'roleInfo',
      'defaultHiveIndex'
    ])
  },
  created() {
    if (this.roleInfo) {
      this.isCanOpter = (this.roleInfo.roleId === 1 || this.roleInfo.roleId === 2 || this.roleInfo.roleId === 4)
    } else {
      this.isCanOpter = false
    }
    var _this = this
    // 监听游戏手柄
    window.addEventListener('gamepadconnected', function (e) {
      console.log('已插入遥控手柄:' + e.gamepad.id)
      _this.showToast('已插入遥控手柄' + e.gamepad.id)
      // var gp = navigator.getGamepads()[e.gamepad.index]
      _this.startgamepad() // 启动手柄
    })
    // 监听游戏手柄拔出
    window.addEventListener('gamepaddisconnected', function (e) {
      console.log('遥控手柄已拔出！' + e.gamepad.id)
      _this.showToast('遥控手柄已拔出！')
      _this.isRemoteConnect = false
      _this.isRemoteEnable = false
      _this.remoteAxis = []
      _this.remoteButtons = []
      clearInterval(_this.intervalRemote) // 停止获取手柄数据
    })
    document.onkeydown = function (e) {
      // 事件对象兼容
      const key = e || event || window.event || arguments.callee.caller.arguments[0]
      // _this.showToast('按下按键：' + key + ',Code:' + key.keyCode)
      _this.sendKeyboardCommand(key.keyCode, true)
    }
    document.onkeyup = function (e) {
      // 事件对象兼容
      const key = e || event || window.event || arguments.callee.caller.arguments[0]
      // _this.showMessage('松开按键：' + key + ',Code:' + key.keyCode)
      _this.sendKeyboardCommand(key.keyCode, false)
    }
  },
  mounted() {
    this.init()
  },
  // created() {},
  beforeDestroy() {
    document.onkeydown = null
    document.onkeyup = null

    this.remoteAxis = []
    this.remoteButtons = []
    this.stopVideo()

    clearInterval(this.timerRefreshUi)
    this.timerRefreshUi = null
    clearInterval(this.intervalRemote) // 停止获取手柄数据
    this.intervalRemote = null
  },
  onDestroy() {
    if (this.webSocket !== null) {
      this.webSocket.destroy()
      this.webSocket = null
    }
  },
  methods: {
    async init() {
      this.wps = []
      this.markerOthersModel = []
      this.loading = true
      try {
        this.mapStyle = this.getCookieString('efuav_map_style', 'normal')
        this.isMapFollowUav = this.getCookieBool('efuav_isMapFollowUav', true)
        this.isShowUavFlyedPath = this.getCookieBool('efuav_isShowUavFlyedPath', true)
        this.isShowHiveVideo = this.getCookieBool('efuav_isShowHiveVideo', true)
        if (this.timerRefreshUi !== null) {
          clearInterval(this.timerRefreshUi)
        }
        this.timerRefreshUi = setInterval(this.refreshUi, 1000)
        await this.initWebSocket()
        await this.queryAllCommands()
        await this.queryAllDjiEnum()
        await this.queryAllDjiActions()
        await this.initMyUavHives()
        // setTimeout(() => { this.initMyUavHives() }, 1000)
      } catch (error) {
        console.error('初始化失败：' + error)
      }
      this.loading = false
    },
    handleChangeKml(file, fileList) {
      this.fileListKml = []
      if (this.beforeKmlUpload(file.raw)) {
        this.fileListKml.push(file)
        var reader = new FileReader()
        reader.readAsText(file.raw)
        const that = this
        reader.onload = function () {
          console.log('加载文件 ' + file.raw.name + ':\r\n' + reader.result)
          const points = that.$gisUtil.getKmlData(reader.result) // 解析kml文件
          // console.log('解析路径:\r\n ' + points)
          let firstPoint = null
          for (let index = 0; index < points.length; index++) {
            const positionGps = { lat: points[index].lat, lng: points[index].lng }
            const positionAmap = that.$gisUtil.ConvertGpsToAmap(positionGps.lat, positionGps.lng)
            if (firstPoint === null) {
              firstPoint = { lat: positionAmap.lat, lng: positionAmap.lng }
            }
            that.addGridItem(positionGps, positionAmap)
          }
          if (firstPoint !== null) {
            that.setMapCenter(firstPoint.lat, firstPoint.lng)
          }
        }
      }
    },
    beforeKmlUpload(file) {
      // name: "123.kml"
      const fullName = file.name
      var first = fullName.lastIndexOf('.')
      var filesuffix = fullName.substring(first + 1, fullName.length) // 截取获得后缀名
      const isKml = (filesuffix.toLowerCase() === 'kmz' || filesuffix.toLowerCase() === 'kml')
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isKml) {
        this.$message.error('选择文件只能是 Kml/Kmz 格式!')
      }
      if (!isLt2M) {
        this.$message.error('文件大小不能超过 2MB!')
      }
      return isKml && isLt2M
    },
    // 语音播报
    speechSynthesis(msg) {
      if (this.ttlMessage == null) {
        this.ttlMessage = new window.SpeechSynthesisUtterance()
      }
      // this.ttlMessage.lang = 'zh-CN'
      // this.ttlMessage.volume = 1 // 音量 0-1
      // this.ttlMessage.rate = 1 // 语速，0.1-10
      // this.ttlMessage.pitch = 1 // 音调高低，0-2
      this.ttlMessage.text = msg
      window.speechSynthesis.speak(this.ttlMessage)
    },
    // 视频  ---------------------------------------------------------
    refreshVideo(type) {
      let isRefreshUav = false
      let isRefreshHive = false
      let urlUav, urlHive

      if (type) {
        if (type === 'uav') {
          isRefreshUav = true
        } else if (type === 'hive') {
          isRefreshHive = true
        }
      } else {
        this.stopVideo()
        isRefreshUav = true
        isRefreshHive = true
      }
      if (this.selectedUavItem && this.selectedUavItem !== null) {
        urlUav = this.selectedUavItem.playUrl1
      }
      if (this.selectedHiveItem && this.selectedHiveItem !== null) {
        urlHive = this.selectedHiveItem.playUrl
      }
      if (isRefreshUav && urlUav) {
        this.playVideo1(urlUav)
      }
      if (isRefreshHive && urlHive) {
        this.playVideo2(urlHive)
      }
    },

    async playVideo1(url) {
      if (url && url.length > 0) {
        let goon = true
        const StreamState = await this.getLineStreamOnline(url, 'uav')
        if (StreamState !== null) {
          if (StreamState === true) {
            goon = true
          } else {
            goon = false
          }
        }
        this.stopVideo1()
        if (goon) {
          console.log('无人机视频播放地址：' + "webrtc://" + url)
          console.log('无人机视频播放地址：' + "http://" + url)
          this.TcPlayerUav = new TcPlayer('video1', {
            "webrtc": "webrtc://" + url,
            "flv": "http://" + url,
            // "live": "true",
            "volume": "0", // 设置初始音量，范围：0 到 1 [v2.2.0+]。
            "autoplay": "true", // iOS 下 safari 浏览器是不开放这个能力的
            "controls": "false", // 是否显示播放器的控制栏 none
            "webrtcConfig": { streamType: 'video' }, // 仅拉取视频流，auto：拉取视频流和音频流
            // "width": '480',//视频的显示宽度，请尽量使用视频分辨率宽度
            // "height": '320',//视频的显示高度，请尽量使用视频分辨率高度
            "wording": {
              2003: "连接视频超时",
              2032: "请求视频失败，请检查网络",
              2048: '请求m3u8文件失败，可能是网络错误或者跨域问题'
            }
          })
          // this.TcPlayerUav.on('error', function(error) {
          //     this.showToast('播放失败:' + error)
          // })
          this.TcPlayerUav.play()
        }
      }
    },
    async playVideo2(url) {
      if (this.isShowHiveVideo && this.getIsThisUavContainsHive() === true) {
        if (url && url.length > 0) {
          let goon = true
          const StreamState = await this.getLineStreamOnline(url, 'hive')
          if (StreamState !== null) {
            if (StreamState === true) {
              goon = true
            } else {
              goon = false
            }
          }
          this.stopVideo2()
          // console.log('当前加载视频流为:' + url)
          if (goon) {
            this.TcPlayerHive = new TcPlayer('video2', {
              'webrtc': 'webrtc://' + url,
              "flv": "http://" + url,
              // "live": "true",
              "volume": "0", // 设置初始音量，范围：0 到 1 [v2.2.0+]。
              "autoplay": "true", // iOS 下 safari 浏览器是不开放这个能力的
              "controls": "false", // 是否显示播放器的控制栏 none
              "webrtcConfig": { streamType: 'video' }, // 仅拉取视频流，auto：拉取视频流和音频流
              // "width": '480',//视频的显示宽度，请尽量使用视频分辨率宽度
              // "height": '320',//视频的显示高度，请尽量使用视频分辨率高度
              "wording": {
                2003: "连接视频超时",
                2032: "请求视频失败，请检查网络",
                2048: '请求m3u8文件失败，可能是网络错误或者跨域问题'
              }
            })
            // this.TcPlayerHive.on('error', function(error) {
            //     this.showToast('播放失败:' + error)
            // })
            this.TcPlayerHive.play()
          }
        }
      }
    },
    stopVideo() {
      this.stopVideo1()
      this.stopVideo2()
    },
    stopVideo1() {
      try {
        if (this.TcPlayerUav != null) {
          this.TcPlayerUav.pause()
          this.TcPlayerUav.destroy()
          this.TcPlayerUav = null
        }
      } catch (error) { }
    },
    stopVideo2() {
      try {
        if (this.TcPlayerHive != null) {
          this.TcPlayerHive.pause()
          this.TcPlayerHive.destroy()
          this.TcPlayerHive = null
        }
      } catch (error) { }
    },
    // 工具函数 ---------------------------------------------------------

    // 获取实时数据值
    getRealdataDes(type) {
      if (this.selectedHiveItem) {
        switch (type) {
          case 'hive':
            if (this.selectedHiveItem.isOnline) {
              return '在线'
            } else {
              return '离线'
            }
        }
        if (this.selectedHiveItem.heartbeatData && this.selectedHiveItem.heartbeatData != null) {
          switch (type) {
            case 'hivetemp':
              return this.selectedHiveItem.heartbeatData.hiveTemperature
          }
        }
      }
      if (this.selectedUavItem && this.selectedUavItem != null) {
        switch (type) {
          case 'uav':
            if (this.selectedUavItem.isOnline) {
              return '在线'
            } else {
              return '离线'
            }
          case 'boottime':
            return '已运行 ' + this.$dateUtil.convertSecondToFrendly2(this.selectedUavItem.djiServerBootTime)
          case 'charging':
            return this.selectedUavItem.isChargingText
          case 'chargingbool':
            return this.selectedUavItem.isCharging
          case 'remote':
            return this.selectedUavItem.isRomoteControlOnline ? '在线' : '离线'
          case 'gcs':
            return this.selectedUavItem.isGcsOnline ? '在线' : '离线'
          case 'server':
            return this.selectedUavItem.isDjiServerOnline ? '在线' : '离线'
        }
        if (this.selectedUavItem.heartbeatData && this.selectedUavItem.heartbeatData != null) {
          switch (type) {
            case 'flightMode':
              return this.selectedUavItem.heartbeatData.flightModeText
            case 'gpsStatusText':
              return this.selectedUavItem.heartbeatData.gpsStatusText
            case 'satecount':
              return this.selectedUavItem.heartbeatData.satecount
            case 'flightTimeInSeconds':
              if (this.selectedUavType === 1) {
                return this.$dateUtil.convertSecondToTime(this.selectedUavItem.heartbeatData.flightTimeInSeconds)
              } else {
                return this.$dateUtil.convertSecondToTime(this.selectedUavItem.heartbeatData.flightTimeInSeconds)
              }
            case 'batt':
              if (this.selectedUavType === 1) {
                return this.selectedUavItem.heartbeatData.batteryPert + ' %'
              } else {
                return this.selectedUavItem.heartbeatData.batteryValue + ' 伏'
              }
            case 'sign':
              if (this.selectedUavType === 1) {
                return '下行' + this.selectedUavItem.heartbeatData.linkAirDownload + '% 上行' + this.selectedUavItem.heartbeatData.linkAirUpload + '%'
              } else {
                return this.selectedUavItem.heartbeatData.linkAirDownload + ' %'
              }
            case 'yaw':
              let yaw = this.selectedUavItem.heartbeatData.yaw
              if (yaw < 0) {
                yaw += 360
              }
              return yaw.toFixed(2)
            case 'alt':
              return this.selectedUavItem.heartbeatData.alt.toFixed(2)
            case 'altabs':
              return this.selectedUavItem.heartbeatData.altabs.toFixed(2)
            case 'speed':
              return this.selectedUavItem.heartbeatData.xySpeed.toFixed(2)
          }
        } else {
          return '/'
        }
      } else {
        return '/'
      }
    },
    getHiveRealdataDes(type) {
      if (this.selectedHiveItem && this.selectedHiveItem !== null) {
        switch (type) {
          case 'address':
            return this.selectedHiveItem.hiveAddress
            break
          case 'hive':
            if (this.selectedHiveItem.isOnline) {
              let hivestatus = '在线'
              if (this.selectedHiveItem.heartbeatData && this.selectedHiveItem.heartbeatData != null) {
                switch (this.selectedHiveItem.heartbeatData.hiveSwitchStatus) {
                  case 0:
                    hivestatus = "未知";
                    break;
                  case 1:
                    hivestatus = "已开启";
                    break;
                  case 2:
                    hivestatus = "已关闭";
                    break;
                  case 5:
                    hivestatus = "暂停中";
                    break;
                  case 3:
                    hivestatus = "开启中";
                    if (this.selectedHiveItem.heartbeatData.doorSwitchStatus === 3) {
                      hivestatus = "开启舱门";
                    } else if (this.selectedHiveItem.heartbeatData.upDownSwitchStatus === 3) {
                      hivestatus = "开启升降";
                    } else if (this.selectedHiveItem.heartbeatData.pushSwitchStatus === 3) {
                      hivestatus = "开启推杆";
                    }
                    break;
                  case 4:
                    hivestatus = "关闭中";
                    if (this.selectedHiveItem.heartbeatData.doorSwitchStatus === 4) {
                      hivestatus = "关闭舱门";
                    } else if (this.selectedHiveItem.heartbeatData.upDownSwitchStatus === 4) {
                      hivestatus = "关闭升降";
                    } else if (this.selectedHiveItem.heartbeatData.pushSwitchStatus === 4) {
                      hivestatus = "关闭推杆";
                    }
                    break;
                }
              }
              return hivestatus
            } else {
              return '离线'
            }
        }
        if (this.selectedHiveItem.heartbeatData && this.selectedHiveItem.heartbeatData != null) {
          switch (type) {
            case 'altabs':
              return this.selectedHiveItem.heartbeatData.altabs.toFixed(2)
            case 'hivetemp':
              return this.selectedHiveItem.heartbeatData.hiveTemperature.toFixed(2)
            case 'usetime':
              return this.selectedHiveItem.heartbeatData.useTime
            case 'runtime':
              return this.$dateUtil.convertSecondToFrendly2(this.selectedHiveItem.heartbeatData.runTime)
          }
        } else {
          return '/'
        }
      }
    },
    getHiveWeatherDes(type) {
      if (this.selectedHiveItem && this.selectedHiveItem !== null) {
        if (this.selectedHiveItem.heartbeatDataWeather && this.selectedHiveItem.heartbeatDataWeather != null) {
          switch (type) {
            case 'windSpeed':
              return this.selectedHiveItem.heartbeatDataWeather.windSpeed.toFixed(2)
            case 'windPower':
              return this.selectedHiveItem.heartbeatDataWeather.windPower
            case 'WindDirection':
              return this.selectedHiveItem.heartbeatDataWeather.WindDirection.toFixed(2)
            case 'airTemp':
              return this.selectedHiveItem.heartbeatDataWeather.airTemp.toFixed(2)
            case 'airHumidity':
              return this.selectedHiveItem.heartbeatDataWeather.airHumidity.toFixed(0)
            case 'Light':
              return this.selectedHiveItem.heartbeatDataWeather.Light.toFixed(0)
            case 'PM1':
              return this.selectedHiveItem.heartbeatDataWeather.PM1.toFixed(2)
            case 'PM2':
              return this.selectedHiveItem.heartbeatDataWeather.PM2.toFixed(2)
            case 'rainSnow':
              return (this.selectedHiveItem.heartbeatDataWeather.rainSnow === 1) ? "有雨雪" : "无";
            case 'rainWater':
              return this.selectedHiveItem.heartbeatDataWeather.rainWater.toFixed(0)
          }
        } else {
          return '/'
        }
      } else {
        return '/'
      }
    },
    // 获取实时数据状态，告警
    getRealdataWarn(type) {
      if (this.selectedUavItem && this.selectedUavItem != null) {
        switch (type) {
          case 'uav':
            if (this.selectedUavItem.isOnline) {
              return '#67c23a'
            } else {
              return 'red'
            }
          case 'charging':
            return this.selectedUavItem.isCharging ? 'red' : '#67c23a'
          case 'remote':
            return this.selectedUavItem.isRomoteControlOnline ? '#67c23a' : 'red'
          case 'gcs':
            return this.selectedUavItem.isGcsOnline ? '#67c23a' : 'red'
          case 'server':
            return this.selectedUavItem.isDjiServerOnline ? '#67c23a' : 'red'
        }
        if (this.selectedUavItem.heartbeatData && this.selectedUavItem.heartbeatData != null) {
          switch (type) {

            case 'batt':
              if (this.selectedUavType === 1) {
                if (this.selectedUavItem.heartbeatData.batteryPert > 60) {
                  return '#67c23a'
                }
              } else {
                if (this.selectedUavItem.heartbeatData.batteryValue >= 18) {
                  return '#67c23a'
                }
              }
              break
            case 'sign':
              if (this.selectedUavType === 1) {
                if (this.selectedUavItem.heartbeatData.linkAirDownload >= 60 || this.selectedUavItem.heartbeatData.linkAirUpload >= 60) {
                  return '#67c23a'
                }
              } else {
                if (this.selectedUavItem.heartbeatData.linkAirDownload >= 60) {
                  return '#67c23a'
                }
              }
              break
            case 'sate':
              if (this.selectedUavItem.heartbeatData.satecount >= 10) {
                return '#67c23a'
              }
              break
            case 'charging':
              return this.selectedUavItem.isCharging ? 'red' : '#67c23a'
            case 'remote':
              return this.selectedUavItem.isRomoteControlOnline ? '#67c23a' : 'red'
            case 'gcs':
              return this.selectedUavItem.isGcsOnline ? '#67c23a' : 'red'
            case 'server':
              return this.selectedUavItem.isDjiServerOnline ? '#67c23a' : 'red'
          }
        } else {
          return 'red'
        }
      } else {
        return 'red'
      }

    },

    enableRuler(enable) {
      if (this.isMapArea) {
        this.enableArea(false)
      }
      if (enable) {
        this.isMapRuler = enable
      } else {
        this.isMapRuler = !this.isMapRuler
      }
      if (this.isMapRuler) {
        this.mapTools.rule()
      } else {
        this.mapTools.close(true) // 关闭，并清除覆盖物
      }
    },
    enableArea(enable) {
      if (this.isMapRuler) {
        this.enableRuler(false)
      }
      if (enable) {
        this.isMapArea = enable
      } else {
        this.isMapArea = !this.isMapArea
      }
      if (this.isMapArea) {
        this.mapTools.measureArea({
          strokeColor: '#80d8ff',
          fillColor: '#80d8ff',
          fillOpacity: 0.3
        })
      } else {
        this.mapTools.close(true) // 关闭，并清除覆盖物
      }
    },
    saveConfig(reset) {
      this.isDialogConfig = false
      if (reset === true) {
        this.mapStyle = this.getCookieString('efuav_map_style', 'normal')
        this.isMapFollowUav = this.getCookieBool('efuav_isMapFollowUav', true)
        this.isShowUavFlyedPath = this.getCookieBool('efuav_isShowUavFlyedPath', true)
        this.isShowHiveVideo = this.getCookieBool('efuav_isShowHiveVideo', true)
      } else {
        Cookies.set('efuav_map_style', this.mapStyle)
        Cookies.set('efuav_isMapFollowUav', this.isMapFollowUav)
        Cookies.set('efuav_isShowUavFlyedPath', this.isShowUavFlyedPath)
        Cookies.set('efuav_isShowHiveVideo', this.isShowHiveVideo)
      }
    },
    getCookieString(key, defaultStr) {
      const temp = Cookies.get(key)
      if (temp) {
        defaultStr = temp
      }
      return defaultStr
    },
    getCookieBool(key, defaultBool) {
      const temp = Cookies.get(key)
      if (temp) {
        if (temp.toLowerCase() === 'true') {
          defaultBool = true
        } else {
          defaultBool = false
        }
      }
      return defaultBool
    },
    showToast(msg) {
      this.$layer.msg(msg)
    },
    showMessage(msg, type) {
      this.$message({ message: msg, type: type })
    },
    switchVideoMap(type) {
      // if (this.bigView === 'map') {
      //     if (type === 'video1') {
      //         this.stopVideo1()
      //         setTimeout(() => this.refreshVideo('uav'), 180)
      //     } else if (type === 'video2') {
      //         this.stopVideo2()
      //         setTimeout(() => this.refreshVideo('hive'), 180)
      //     }
      //     this.bigView = type
      // } else {
      //     this.bigView = type
      //     this.stopVideo()
      //     setTimeout(() => this.refreshVideo(), 180)
      // }
      let maxView = document.getElementById("container"); // 地图所在div
      let miniViewUav = document.getElementById("videoUav"); // 无人机视频所在div
      let miniViewHive = document.getElementById("videoHive"); // 停机坪视频所在div
      if (type === "uav") {
        if (this.bigView === "map") {
          this.changePostion(miniViewUav, maxView);
          this.bigView = "uav";
        } else if (this.bigView === "uav") {
          this.changePostion(miniViewUav, maxView);
          this.bigView = "map";
        } else {
          // 当前最大的是另外的视频
          this.changePostion(miniViewHive, maxView);
          this.changePostion(miniViewUav, maxView);
          this.bigView = "uav";
        }
      } else if (type === "hive") {
        if (this.bigView === "map") {
          this.changePostion(miniViewHive, maxView);
          this.bigView = "hive";
        } else if (this.bigView === "hive") {
          this.changePostion(miniViewHive, maxView);
          this.bigView = "map";
        } else {
          // 当前最大的是另外的视频
          this.changePostion(miniViewUav, maxView);
          this.changePostion(miniViewHive, maxView);
          this.bigView = "hive";
        }
      } else {
        //TODO 后期支持更多视频类型
      }
      setTimeout(() => this.refreshVideo(), 180)
    },
    changePostion(view1, view2) {
      let view1Parent = view1.parentNode;
      let view2Parent = view2.parentNode;
      let index1 = Array.prototype.indexOf.call(view1Parent.children, view1);
      let index2 = Array.prototype.indexOf.call(view2Parent.children, view2);
      console.log("父节点1：" + view1Parent + "父节点2：" + view2Parent + "，索引1：" + index1 + "，索引2：" + index2)
      view2Parent.insertBefore(view1, view2Parent.children[index2]);
      view1Parent.insertBefore(view2, view1Parent.children[index1]);
      //  document.body.replaceChild(view1, view2);
    },
    // 修改航点默认高度
    startSetDefaultAlt() {
      const that = this
      this.$layer.prompt({
        title: '请输入默认高度值',
        formType: 0, // 输入框类型，支持0（文本）默认1（密码）2（多行文本）
        value: this.defaultWpParm.alt,
        maxlength: 4, // 可输入文本的最大长度，默认500
        area: ['400px', '170px'], // 自定义文本域宽高
        scrollbar: false,
        zIndex: 2000 // 层优先级
      }, function (value, index) {
        if (value === '' || isNaN(value)) {
          that.$layer.msg('请输入数字！', { icon: 6 })
          return
        }
        that.defaultWpParm.alt = value
        that.$layer.close(index)
      })
    },
    // 检测在线状态
    refreshUi() {
      let isNeedForceUpdate = false
      // 进度提示
      if (this.ProgressShowTime + 15000 < Date.now()) {
        this.ProgressShowTime = Date.now();
        if (this.selectedUavItem && this.selectedUavItem != null && this.selectedUavItem.heartbeatData && this.selectedUavItem.heartbeatData != null) {
          if (this.selectedUavItem.isOnline) {
            if (this.selectedUavItem.heartbeatData.areMotorsOn === 1) {
              this.ProgressShow = "飞行中";
            } else {
              this.ProgressShow = "地面待命";
            }
          } else {
            this.ProgressShow = "离线";
          }
        } else {
          this.ProgressShow = "离线";
        }
      }
      if (this.uavs && this.uavs.length > 0) {
        this.uavs.forEach((item, index) => {
          if (item.isOnline && item.heartbeatDataTime + 10000 < Date.now()) {
            item.isOnline = false
            isNeedForceUpdate = true
            // this.$set(this.uavs, index, {
            //   ...this.uavs[index],
            //   isOnline: false
            // })
          }
          if (item.isDjiServerOnline && item.djiServerTime + 30000 < Date.now()) {
            item.isDjiServerOnline = false // 服务后台在线状态
            item.isGcsOnline = false // 地面站在线状态
            item.isUavOnline = false // 无人机在线状态
            item.isRomoteControlOnline = false // 遥控器在线状态
            item.isAirLinkOnline = false // 无人机与遥控器链接
            item.isCameraOnline = false // 相机
            item.djiServerBootTime = 0 //大疆服务启动时间

            isNeedForceUpdate = true
          }
        })

      }
      if (this.hives && this.hives.length > 0) {
        this.hives.forEach((item, index) => {
          if (item.isOnline && item.heartbeatDataTime + 10000 < Date.now()) {
            item.isOnline = false
            isNeedForceUpdate = true
          }
          if (item.isOnlineBasestation && item.heartbeatDataBasestationTime + 30000 < Date.now()) {
            item.isOnlineBasestation = false
            isNeedForceUpdate = true
          }
        })
      }
      if (isNeedForceUpdate) {
        this.$forceUpdate()
      }
    },
    // 获得开源的命令描述
    getCommandDes(wp) {
      const cmd = wp.wpAction
      var item = this.efCommands.find(a => { return a.cmdId === cmd })
      if (item) {
        return item.cmdNameZh
      } else { return cmd }
    },
    // 获得大疆的动作指令内容
    getActionDes(wp) {
      let show = '无'
      const cmds = wp.wpDjiActions //  5,0|6,1|7,5
      if (cmds && cmds.length > 0) {
        const actionsArr = cmds.split('|')
        if (actionsArr && actionsArr.length > 0) {
          actionsArr.forEach((item, index) => {
            // 5,0
            if (item && item.length > 0) {
              const action = item.split(',')
              if (action && action.length >= 2) {
                const actId = parseInt(action[0])
                const actValue = parseFloat(action[1])
                var find = this.djiActions.find(a => {
                  return a.actId === actId
                })
                if (find) {
                  if (show === '无') { show = '' }
                  show += find.actNameZh + '(' + actValue + ')' + ' '
                }
              }
            }
          })
        } else {
          show = cmds
        }
      }
      return show
    },
    parseTime(date) {
      return parseTime(date)
    },
    // 获取航线任务鼠标悬浮，显示更多信息
    getTaskInfo(item) {
      let info = ''
      if (item) {
        info += '所在纬度：' + item.wpsLat + '<br>'
        info += '所在经度：' + item.wpsLng + '<br>'
        info += '飞行高度：' + item.wpsAlt + '米' + '<br>'
        info += '飞行海拔：' + item.wpsAltAbs + '米' + '<br/>'
        if (item.wpsType === 1) {
          info += '飞行速度：' + item.wpsSpeed + '米/秒' + '<br/>'
          info += '最大速度：' + item.wpsMaxSpeed + '米/秒' + '<br/>'
          info += '遥控链路中断：' + item.wpsRcSignalLost + '<br>'
          info += '航线路径类型：' + item.wpsFlightPathMode
          info += '飞行路径方式：' + item.wpsGotoWaypointMode
          info += '飞行时朝向：' + item.wpsHeadingMode
          info += '完成任务后：' + item.wpsFinishedAction
          info += '执行次数：' + item.wpsRepeatTimes + '<br/>' + '<br/>'
        }
        info += '创建时间：' + parseTime(item.wpsCreateTime)
        info += '创建人：' + item.wpsCreateByUserId
        info += '更新时间：' + parseTime(item.wpsUpdateTime)
        info += '更新人：' + item.wpsUpdateByUserId
      } else {
        info = '无'
      }
      return info
    },
    getUavOnlineStatus(item) {
      if (item) {
        if (item.isOnline) {
          return 'fill:green'
        } else {
          if (item && item.uavFactoryId === 1) {
            if (item.isDjiServerOnline) {
              return 'fill:red'
            } else {
              return 'fill:gray'
            }
          } else {
            return 'fill:gray'
          }
        }
      } else {
        return 'fill:red'
      }
    },
    getOnlineStyle(item) {
      if (item && item.isOnline !== undefined && item.isOnline) {
        return true
      } else {
        return false
      }
    },
    getUavTypeName(type) {
      switch (type) {
        case 1:
          return '大疆'
        case 2:
          return '开源'
      }
    },
    getUavSelectedRowStyle(e) {
      const { row, rowindex } = e
      let background = {}
      if (this.selectedUavItem && this.selectedUavItem != null) {
        if (row.uavId === this.selectedUavItem.uavId) {
          background.background = '#E6E6FA'
        }
      }
      return background
    },
    getHiveSelectedRowStyle(e) {
      const { row, rowindex } = e
      let background = {}
      if (this.selectedHiveItem && this.selectedHiveItem != null) {
        if (row.hiveId === this.selectedHiveItem.hiveId) {
          background.background = '#E6E6FA'
        }
      }
      return background
    },
    clickWpsItem(item, needclose) {

    },
    beforeMoreHandleCommandUav(command, parm1, parm2, parm3, parm4, timeout, msg) {
      return { "command": command, "parm1": parm1, "parm2": parm2, "parm3": parm3, "parm4": parm4, "timeout": timeout, "msg": msg };
    },
    MoreHandleCommandUav(parms) {
      const { command, parm1, parm2, parm3, parm4, timeout, msg } = parms
      if (msg && msg.length > 0) {
        this.beforeDoCommand(command, parm1, parm2, parm3, parm4, timeout, msg)
      } else {
        this.doCommand(command, parm1, parm2, parm3, parm4, timeout)
      }
    },
    beforeMoreHandleCommandTask(item, index, command) {
      return { "item": item, "index": index, "command": command };
    },
    async MoreHandleCommandTask(parms) {
      const { item, index, command } = parms
      switch (command) {
        case 'download':
          await this.queryByWpsIndex(index, item.wpsName, item)
          break
        case 'update':
          this.showToast('功能未开放，敬请期待！')
          break
      }
    },
    async clickTaskItem(item, b) {

    },
    // 更多按钮，传入自定义参数
    beforeMoreHandleCommandWps(item, index, command) {
      return { "item": item, "index": index, "command": command };
    },
    // 更多按钮点击事件
    MoreHandleCommandWps(parms) {
      const { item, index, command } = parms
      switch (command) {
        case 'insert':
          const wp = {
            wpIndex: index,
            wpLat: 0,
            wpLng: 0,
            wpAlt: this.defaultWpParm.alt,
            wpAltAbs: 0,
            wpAction: this.defaultWpParm.command,
            wpDjiActions: '',
            wpParm1: 0,
            wpParm2: 0,
            wpParm3: 0,
            wpParm4: 0
          }
          this.insertWpDetail(wp)
          break
        case 'edit':
          this.editWpDialogModel = JSON.parse(JSON.stringify(item))
          this.isDialogEditWp = true
          break
        case 'editall':
          // this.editWpsDialogModel = JSON.parse(JSON.stringify(item))
          this.editWpsDialogModel.wpAlt = this.defaultWpParm.alt
          this.isDialogEditWps = true
          break
      }
    },

    // 地图事件 --------------------------------------------------------
    setMapCenter(lat, lng, zoom) {
      const latlng = this.$gisUtil.ConvertGpsToAmap(lat, lng)
      if (latlng.lng !== 0 && latlng.lat !== 0) {
        this.centerPosition = [latlng.lng, latlng.lat]
      }
      if (zoom) {
        this.zoom = zoom
      }
    },
    mapClick(mapsEvent) {
      const positionAmap = { lat: mapsEvent.lnglat.lat, lng: mapsEvent.lnglat.lng }
      const positionGps = this.$gisUtil.ConvertAmapToGps(mapsEvent.lnglat.lat, mapsEvent.lnglat.lng)
      if (this.isEditGridChoiceStartPoint) {
        this.gridAutoParms.homePos = { lat: positionGps.lat, lng: positionGps.lng }

        const index = this.markerOthersModel.findIndex(item => item.tag === 'grid_start_point')
        if (index >= 0) {
          this.markerOthersModel.splice(index, 1)
        }
        this.markerOthersModel.push({
          index: this.markerOthersModel.length,
          tag: 'grid_start_point',
          lat: positionGps.lat,
          lng: positionGps.lng
        })
        this.isEditGridChoiceStartPoint = false
      } else if (this.isEditGrid) {
        this.addGridItem(positionGps, positionAmap)
      } else if (this.isEditWps) {
        this.addWp(positionGps)
      }
      // this.getAddress([positionAmap.lng, positionAmap.lat])
    },
    // 逆解码函数
    getAddress(lnglat) {
      let self = this
      AMap.plugin('AMap.Geocoder', function () {
        var geocoder = new AMap.Geocoder({
          // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
          city: '010'
        })
        geocoder.getAddress(lnglat, function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            self.formattedAddress = result.regeocode.formattedAddress
            // result为对应的地理位置详细信息
          }
        })
      })
    },
    // 摇杆控制 ---------------------------------------------------------
    // 启动手柄
    startgamepad() {
      var _this = this;
      _this.isRemoteConnect = true;
      // 每200ms 获取一次手柄数据，查看是否按下手柄按键
      this.intervalRemote = setInterval(function () {
        var gamepad = navigator.getGamepads()[0];
        if (_this.isRemoteConnect !== true) {
          _this.isRemoteConnect = true;
        }
        _this.remoteSensing(gamepad.axes);
        _this.pressKey(gamepad.buttons);
      }, 100);
    },
    formatMoveSpeedTooltip(value) {
      return value + '米/秒'
    },
    getThrottle() {
      let value = 0
      if (this.remoteAxis && this.remoteAxis != null && this.remoteAxis.length >= 9) {
        value = this.convertRomoteDataToPwm(-this.remoteAxis[6], 0, 100)
      }
      if (value < 0) {
        value = 0
      } else if (value > 100) {
        value = 100
      }
      return Math.round(value * 10) / 10
    },
    // 手柄遥感
    remoteSensing(arr) {
      // 判断云台控制是否有变化，有变化则实时发送
      if (this.remoteAxis && this.remoteAxis != null && this.remoteAxis.length >= 9 && arr && arr != null && arr.length >= 9) {
        //if (Math.abs(this.remoteAxis[9] - arr[9]) > 0.2) {
        if (arr[9] >= -1 && arr[9] <= 1) {
          let panValue = arr[9] // -1到1，顺时针旋转增加，上为-1，下为0.1428，默认为3.285
          this.rollYuntai = 0
          this.pitchYuntai = 0
          this.yawYuntai = 0
          if (panValue >= 2 || panValue === 0) {
            // 居中状态
          } else if (panValue >= 0.75 || panValue <= -0.75) {
            this.pitchYuntai = 2; //上
          } else if (panValue <= 0.25 && panValue >= -0.25) {
            this.pitchYuntai = -2; //下
          } else if (panValue >= 0.25 && panValue <= 0.75) {
            this.yawYuntai = -2; //左
          } else if (panValue >= -0.75 && panValue <= -0.25) {
            this.yawYuntai = 2; //右
          }
          // mode，0是相对角度，1是绝对角度，2是速度模式
          this.sendCommandToWebsocket(1153, this.rollYuntai, this.pitchYuntai, this.yawYuntai, 0)
        }
      }
      this.remoteAxis = arr
    },
    // 手柄按键
    pressKey(arr) {
      let needWarn = false
      let warnMsg = '是否执行?'
      let command = 0,
        p1 = 0,
        p2 = 0,
        p3 = 0,
        p4 = 0
      if (this.remoteButtons && this.remoteButtons != null && this.remoteButtons.length >= 16 && arr && arr != null && arr.length >= 16) {
        if (this.remoteButtons[1].value !== 1 && arr[1].value === 1) {
          // this.showToast('已发送拍照/录像模式切换指令!')
          // 切换拍照/录像模式 
          if (this.isYuntaiMode === true) {
            command = 1161 //  1161	录像模式
          } else {
            command = 1160 //  1160	拍照模式
          }
        } else if (this.remoteButtons[0].value !== 1 && arr[0].value === 1) {
          command = 1162 // 拍照
          // console.log('原始的：' + this.remoteButtons[0].value + ',新的值：' + arr[0].value)
        } else if (this.remoteButtons[2].value !== 1 && arr[2].value === 1) {
          command = 1163 // 开始录像
        } else if (this.remoteButtons[3].value !== 1 && arr[3].value === 1) {
          command = 1164 // 停止录像
        } else if (this.remoteButtons[10].value !== 1 && arr[10].value === 1) {
          needWarn = true
          warnMsg = '是否执行全自动起飞!'
          command = 1003
        } else if (this.remoteButtons[11].value !== 1 && arr[11].value === 1) {
          needWarn = true
          warnMsg = '是否执行全自动精确起飞!'
          command = 1004
        } else if (this.remoteButtons[12].value !== 1 && arr[12].value === 1) {
          needWarn = true
          warnMsg = '是否开始全自动起飞 - 执行任务!'
          command = 1006
        } else if (this.remoteButtons[13].value !== 1 && arr[13].value === 1) {
          needWarn = true
          warnMsg = '是否开始全自动精确起飞 - 执行任务!'
          command = 1007
        } else if (this.remoteButtons[14].value !== 1 && arr[14].value === 1) {
          needWarn = true
          warnMsg = '是否开始全自动返航!'
          command = 1009
        } else if (this.remoteButtons[15].value !== 1 && arr[15].value === 1) {
          needWarn = true
          warnMsg = '是否终止全自动任务!'
          command = 1
        } else if (this.remoteButtons[4].value !== 1 && arr[4].value === 1) {
          needWarn = true
          warnMsg = '是否立即起飞无人机!'
          command = 1100
        } else if (this.remoteButtons[5].value !== 1 && arr[5].value === 1) {
          needWarn = true
          warnMsg = '是否立即精确起飞无人机!'
          command = 1105
        } else if (this.remoteButtons[6].value !== 1 && arr[6].value === 1) {
          needWarn = true
          warnMsg = '是否立即悬停无人机!'
          command = 1104
        } else if (this.remoteButtons[7].value !== 1 && arr[7].value === 1) {
          needWarn = true
          warnMsg = '是否开始执行任务!'
          command = 1101
        } else if (this.remoteButtons[8].value !== 1 && arr[8].value === 1) {
          needWarn = true
          warnMsg = '是否立即降落无人机!'
          command = 1103
        } else if (this.remoteButtons[9].value !== 1 && arr[9].value === 1) {
          needWarn = true
          warnMsg = '是否立即返航无人机!'
          command = 1102
        }
      }
      this.remoteButtons = arr
      // console.log('循环中...')
      if (command !== 0) {
        if (needWarn) {
          if (this.isDoingCommand) {
            this.showToast('正在执行命令中...')
          } else {
            // this.showToast('执行命令...' + command + '  ' + warnMsg)
            this.isDoingCommand = true
            this.beforeDoCommand(command, p1, p2, p3, p4, 10, warnMsg)
          }
        } else {
          this.doCommand(command, p1, p2, p3, p4)
        }
      }
    },
    sendKeyboardCommand(keyCode, keydownOrUp) {
      let command = 0
      let p1 = 0,
        p2 = 0,
        p3 = 0,
        p4 = 0
      switch (keyCode) {
        // 无人机控制
        case 87: // W
          this.isKeyboardKeydown = keydownOrUp
          if (keydownOrUp === true) {
            this.pitchKey = this.moveSpeed
          } else {
            this.pitchKey = 0
          }
          break
        case 83: // S
          this.isKeyboardKeydown = keydownOrUp
          if (keydownOrUp === true) {
            this.pitchKey = -this.moveSpeed
          } else {
            this.pitchKey = 0
          }
          break
        case 65: // A
          this.isKeyboardKeydown = keydownOrUp
          if (keydownOrUp === true) {
            this.rollKey = -this.moveSpeed
          } else {
            this.rollKey = 0
          }
          break
        case 68: // D
          this.isKeyboardKeydown = keydownOrUp
          if (keydownOrUp === true) {
            this.rollKey = this.moveSpeed
          } else {
            this.rollKey = 0
          }
          break
        case 85: // U 上升
          this.isKeyboardKeydown = keydownOrUp
          if (keydownOrUp === true) {
            this.altKey = 1
          } else {
            this.altKey = 0
          }
          break
        case 73: // I 下降
          this.isKeyboardKeydown = keydownOrUp
          if (keydownOrUp === true) {
            this.altKey = -1
          } else {
            this.altKey = 0
          }
          break
        case 74: // J 转向
          this.isKeyboardKeydown = keydownOrUp
          if (keydownOrUp === true) {
            this.yawKey = -15
          } else {
            this.yawKey = 0
          }
          break
        case 75: // K 转向
          this.isKeyboardKeydown = keydownOrUp
          if (keydownOrUp === true) {
            this.yawKey = 15
          } else {
            this.yawKey = 0
          }
          break
        // 云台控制
        case 37: // ←
          command = 1153
          if (keydownOrUp === true) {
            p3 = -2
          }
          break
        case 38: // ↑
          command = 1153
          if (keydownOrUp === true) {
            p2 = 2
          }
          break
        case 39: // →
          command = 1153
          if (keydownOrUp === true) {
            p3 = 2
          }
          break
        case 40: // ↓
          command = 1153
          if (keydownOrUp === true) {
            p2 = -2
          }
          break
      }
      if (keydownOrUp === false) {
        this.lastPressKeyCode = -1
      }
      if (command !== 0) {
        if (this.lastPressKeyCode !== keyCode) {
          this.sendCommandToWebsocketThread(command, p1, p2, p3, p4)
        }
      }
      if (keydownOrUp === true) {
        this.lastPressKeyCode = keyCode
      }
    },
    sendCommandToWebsocketThread(command, parm1, parm2, parm3, parm4) {
      if (this.timerSendPanData !== null) {
        clearInterval(this.timerSendPanData)
        this.timerSendPanData = null
      }
      let that = this
      const data = {
        MessageID: 3050,
        uavId: that.selectedUavItem.uavId,
        command: command,
        parm1: parm1,
        parm2: parm2,
        parm3: parm3,
        parm4: parm4
      }
      if (parm1 === 0 && parm2 === 0 && parm3 === 0 && parm4 === 0) {

      } else if (parm4 === 5) {
        that.websocketsend(JSON.stringify(data))
      } else {
        this.timerSendPanData = setInterval(function () {
          that.websocketsend(JSON.stringify(data))
        }, 100);
      }
    },
    sendCommandToWebsocket(command, parm1, parm2, parm3, parm4) {
      const data = {
        MessageID: 3050,
        uavId: this.selectedUavItem.uavId,
        command: command,
        parm1: parm1,
        parm2: parm2,
        parm3: parm3,
        parm4: parm4
      }
      this.websocketsend(JSON.stringify(data))
    },
    // 遥控器数据，每隔250毫秒发送一次 ---------------------------------------------------------
    convertRomoteDataToPwm(value, newMini, newMax) {
      if (Math.abs(value) <= 0.06) {
        // 死区为3%，即范围1000为30，范围2为0.06
        value = 0
      }
      let pert = (value + 1) / 2 //转为0-2，计算百分比
      let speed = newMini + (newMax - newMini) * pert
      return speed
    },
    sendDjiRemoteData() {
      if (this.isRemoteEnable == false) {
        this.isRemoteEnable = true
      }
      this.roll = 0
      this.pitch = 0
      this.yaw = 0
      this.alt = 0
      if (this.isKeyboardKeydown === true) {
        // 按下了键盘按键
        this.roll = this.rollKey
        this.pitch = this.pitchKey
        this.yaw = this.yawKey
        this.alt = this.altKey
      } else if (this.remoteAxis && this.remoteAxis.length > 6) {
        this.roll = this.convertRomoteDataToPwm(this.remoteAxis[0], -this.moveSpeed, this.moveSpeed) // 值范围为-1到1
        this.pitch = this.convertRomoteDataToPwm(-this.remoteAxis[1], -this.moveSpeed, this.moveSpeed) // 值范围为-1到1
        this.yaw = this.convertRomoteDataToPwm(this.remoteAxis[5], -15, 15) // 值范围为-1到1
        // this.roll = this.convertRomoteDataToPwm(this.remoteAxis[0], -5, 5) // 值范围为-1到1
        // this.pitch = this.convertRomoteDataToPwm(-this.remoteAxis[1], -5, 5) // 值范围为-1到1
        // this.yaw = this.convertRomoteDataToPwm(this.remoteAxis[5], -15, 15) // 值范围为-1到1
        this.alt = this.convertRomoteDataToPwm(-this.remoteAxis[6], -3, 3) // 值范围为-1到1
      }
      // 对应大疆无人机为 -5到5 m/s ，开源无人机为1000-2000
      const data = {
        MessageID: 3050,
        uavId: this.selectedUavItem.uavId,
        command: 1152,
        parm1: this.roll,
        parm2: this.pitch,
        parm3: this.yaw,
        parm4: this.alt
      }
      // console.log('实时发送大疆遥控数据:' + JSON.stringify(data));
      this.websocketsend(JSON.stringify(data))
    },
    // 区域编辑 ---------------------------------------------------------
    enableGrid() {
      this.isEditGrid = !this.isEditGrid
      if (!this.isEditGrid) {
        const index = this.markerOthersModel.findIndex(item => item.tag === 'grid_start_point')
        if (index >= 0) {
          this.markerOthersModel.splice(index, 1)
        }
      }
    },
    // 自动生成航线
    autoWps() {
      if (this.gridsWps == null || this.gridsWps.length < 3) {
        this.showToast('请选择飞行区域！', 'warning')
        return
      }
      const pointsGps = []
      this.gridsWps.forEach(item => {
        const latlng = this.$gisUtil.ConvertAmapToGps(item.lat, item.lng)
        pointsGps.push({ lat: latlng.lat, lng: latlng.lng })
      })
      const homePos = this.gridAutoParms.homePos
      const spacing = this.gridAutoParms.spacing
      const headSpacing = this.gridAutoParms.headSpacing // TODO 航向间距
      const yaw = this.gridAutoParms.yaw
      const outlineDistance = this.gridAutoParms.outlineDistance // 外扩距离
      const listAutoWps = this.$gisUtil.GenerationWaypointsByGrid(pointsGps, homePos, spacing, headSpacing, yaw, outlineDistance)
      if (listAutoWps && listAutoWps.length > 500) {
        this.showToast('航点数量超过500个，无法渲染', 'warning')
      } else {
        this.clearWps()
        listAutoWps.forEach(item => {
          const lnglat = this.$gisUtil.ConvertGpsToAmap(item.lat, item.lng)
          this.addWp(lnglat)
        })
      }
    },
    addGridItem(lnglatGps, lnglatAmap) {
      // const gridItem = { lat: lnglat.lat, lng: lnglat.lng }
      this.grids.push([lnglatAmap.lng, lnglatAmap.lat])
      const gridItem = {
        index: 0,
        lat: lnglatGps.lat,
        lng: lnglatGps.lng,
        alt: this.defaultWpParm.alt,
        altAbs: 0,
        action: this.defaultWpParm.command,
        djiActions: '',
        parm1: 0,
        parm2: 0,
        parm3: 0,
        parm4: 0
      }
      gridItem.index = this.gridsWps.length
      this.gridsWps.push(gridItem)
    },
    removeWpGrid(wp) {
      this.gridsWps.splice(wp.index, 1)
      this.grids.splice(wp.index, 1)
      this.refreshGrid()
    },
    updateGridWpPostion(wp, positionGps, positionAmap) {
      wp.lat = positionGps[1]
      wp.lng = positionGps[0]
      this.gridsWps.splice(wp.index, 1, wp)
      this.grids.splice(wp.index, 1, positionAmap)
    },

    getGridMarkerContent(wp, width, height, isRotate = false) {
      const bgRoate = isRotate ? 'transform: rotate(45deg);' : ''
      const txRotate = isRotate ? 'transform: rotate(-45deg);' : ''
      let backgroundColor = '#4169E1'
      if (isRotate) {
        backgroundColor = '#0893FF'
      }
      const show = (wp.index + 1) + ''
      const content = `<div style="display: flex;
                                      justify-content: center;
                                      align-items: center;
                                      height: ${width}px;
                                      width: ${height}px;
                                      border-radius: 0.1rem;
                                      ${bgRoate}
                                      font-family: Arial-BoldMT;
                                      font-size: 10px;
                                      color: #FFFFFF;
                                      box-shadow: 2px 2px 4px 0 rgba(0,0,0,0.30);
                                      background-color: ${backgroundColor};">
                                      <div style="${txRotate}"> ${show} </div>
                           </div>`
      return content
      // return '航点' + wp.index + ',命令：' + wp.action
    },
    getOtherMarkerContent(wp, width, height, isRotate = false) {
      const bgRoate = isRotate ? 'transform: rotate(45deg);' : ''
      const txRotate = isRotate ? 'transform: rotate(-45deg);' : ''
      const backgroundColor = '#4169E1'
      let show = wp.tag
      switch (wp.tag) {
        case 'grid_start_point':
          show = '起'
          break
      }
      const content = `<div style="display: flex;
                                      justify-content: center;
                                      align-items: center;
                                      height: ${width}px;
                                      width: ${height}px;
                                      border-radius: 0.8rem;
                                      ${bgRoate}
                                      font-family: Arial-BoldMT;
                                      font-size: 8px;
                                      color: #FFFFFF;
                                      box-shadow: 2px 2px 4px 0 rgba(0,0,0,0.30);
                                      background-color: ${backgroundColor};">
                                      <div style="${txRotate}"> ${show} </div>
                           </div>`
      return content
      // return '航点' + wp.index + ',命令：' + wp.action
    },
    getUavMarkerContent(item, width, height, isRotate = false) {
      const bgRoate = isRotate ? 'transform: rotate(45deg);' : ''
      const txRotate = isRotate ? 'transform: rotate(-45deg);' : ''
      const backgroundColor = '#4169E1'
      let show = item.uavId + ''
      if (item && item != null) {
        show = item.uavName
      }
      const content = `<div style="display: flex;
                                      justify-content: center;
                                      align-items: center;
                                      height: ${width}px;
                                      width: ${height}px;
                                      border-radius: 0.8rem;
                                      ${bgRoate}
                                      font-family: Arial-BoldMT;
                                      font-size: 8px;
                                      color: #FFFFFF;
                                      box-shadow: 2px 2px 4px 0 rgba(0,0,0,0.30);
                                      background-color: ${backgroundColor};">
                                      <div style="${txRotate}"> ${show} </div>
                           </div>`
      return content
      // return '航点' + item.index + ',命令：' + item.action
    },
    getHomeMarkerContent(width, height, isRotate = false) {
      const bgRoate = isRotate ? 'transform: rotate(45deg);' : ''
      const txRotate = isRotate ? 'transform: rotate(-45deg);' : ''
      const backgroundColor = '#EAC100'
      // this.selectedUavItem
      let show = 'H'
      const content = `<div style="display: flex;
                                      justify-content: center;
                                      align-items: center;
                                      height: ${width}px;
                                      width: ${height}px;
                                      border-radius: 0.8rem;
                                      ${bgRoate}
                                      font-family: Arial-BoldMT;
                                      font-size: 8px;
                                      color: #FFFFFF;
                                      box-shadow: 2px 2px 4px 0 rgba(0,0,0,0.30);
                                      background-color: ${backgroundColor};">
                                      <div style="${txRotate}"> ${show} </div>
                           </div>`
      return content
    },
    refreshGrid() {
      this.gridsWps.forEach((wp, index) => {
        wp.index = index
      })
    },
    // 航点编辑 ---------------------------------------------------------
    getMarkerContent(wp, width, height, isRotate = false) {
      if (wp.wpLat === 0 || wp.wpLng === 0) {
        return null
      }
      const bgRoate = isRotate ? 'transform: rotate(45deg);' : ''
      const txRotate = isRotate ? 'transform: rotate(-45deg);' : ''
      let backgroundColor = (wp.wpIndex === 0 ? '#8D3ECD' : '#2DCD72')
      if (isRotate) {
        backgroundColor = '#0893FF'
      }
      const show = (wp.wpIndex === 0 ? '1' : (wp.wpIndex + 1) + '')
      const content = `<div style="display: flex;
                                      justify-content: center;
                                      align-items: center;
                                      height: ${width}px;
                                      width: ${height}px;
                                      border-radius: 20rem;
                                      ${bgRoate}
                                      font-family: Arial-BoldMT;
                                      font-size: 10px;
                                      color: #FFFFFF;
                                      box-shadow: 2px 2px 4px 0 rgba(0,0,0,0.30);
                                      background-color: ${backgroundColor};">
                                      <div style="${txRotate}"> ${show} </div>
                           </div>`
      return content
      // return '航点' + wp.wpIndex + ',命令：' + wp.action
    },
    getMarkerPostion(lat, lng) {
      // const target = [lnglat.lng, lnglat.lat]
      if (lat === 0 || lng === 0) return null
      const position = this.$gisUtil.ConvertGpsToAmap(lat, lng)
      return [position.lng, position.lat]
    },
    insertWpDetail(wp) {
      if (wp.wpIndex >= this.wps.length) {
        this.addWpDetail(wp, true)
      } else {
        this.wps.splice(wp.wpIndex, 0, wp)
        this.refreshWps()
      }
    },
    addWp(lnglat) {
      const wp = {
        wpIndex: 0,
        wpLat: lnglat.lat,
        wpLng: lnglat.lng,
        wpAlt: this.defaultWpParm.alt,
        wpAltAbs: 0,
        wpAction: this.defaultWpParm.command,
        wpDjiActions: '',
        wpParm1: 0,
        wpParm2: 0,
        wpParm3: 0,
        wpParm4: 0
      }
      this.addWpDetail(wp, true)
    },
    addWpDetail(wp, refreshLine) {
      wp.wpIndex = this.wps.length
      this.wps.push(wp)
      if (refreshLine && refreshLine === true) {
        this.refreshLine()
      }
    },

    updateWpPostion(wp, position) {
      wp.wpLat = position[1]
      wp.wpLng = position[0]
      this.updateWpDetail(wp)
    },
    updateWpDetail(wp) {
      this.wps.splice(wp.wpIndex, 1, wp)
      this.refreshLine()
    },
    saveWp() {
      const temp = JSON.parse(JSON.stringify(this.editWpDialogModel))
      temp.wpLat = parseFloat(temp.wpLat)
      temp.wpLng = parseFloat(temp.wpLng)
      this.updateWpDetail(temp)
      this.isDialogEditWp = false
    },
    updateAllWp() {
      this.isDialogEditWps = false
      const newAlt = parseFloat(this.editWpsDialogModel.wpAlt)
      const newWpAction = this.editWpsDialogModel.wpAction
      const newWpDjiActions = this.editWpsDialogModel.wpDjiActions
      this.wps.forEach((wp, index) => {
        if (this.editWpsDialogModel.type === 0) {
          wp.wpAlt = newAlt // 修改全部高度
        } else if (this.editWpsDialogModel.type === 1) {
          if (this.selectedUavType === 2) {
            wp.wpAction = newWpAction // 修改全部命令
          } else if (this.selectedUavType === 1) {
            wp.wpDjiActions = newWpDjiActions // 大疆动作
          }
        }
      })
    },
    deleteWp(index) {
      this.wps.splice(index, 1)
      this.refreshWps()
    },
    // 添加一个大疆动作
    beaforeAddDjiAction(type) {
      this.editWpDjiActionDialogModel.type = type
      this.editWpDjiActionDialogModel.action = 0
      this.editWpDjiActionDialogModel.parm = 0
      this.isDialogEditDjiAction = true
    },
    // 添加一个大疆动作
    addDjiAction() {
      const action = this.editWpDjiActionDialogModel.action
      const parm = this.editWpDjiActionDialogModel.parm
      if (this.editWpDjiActionDialogModel.type === 'one') {
        if (this.editWpDialogModel) {
          if (!this.editWpDialogModel.wpDjiActions || this.editWpDialogModel.wpDjiActions === '') {
            this.editWpDialogModel.wpDjiActions = action + ',' + parm
          } else {
            this.editWpDialogModel.wpDjiActions = this.editWpDialogModel.wpDjiActions + '|' + action + ',' + parm
          }
        }
      } else if (this.editWpDjiActionDialogModel.type === 'all') {
        if (!this.editWpsDialogModel.wpDjiActions || this.editWpsDialogModel.wpDjiActions === '') {
          this.editWpsDialogModel.wpDjiActions = action + ',' + parm
        } else {
          this.editWpsDialogModel.wpDjiActions = this.editWpsDialogModel.wpDjiActions + '|' + action + ',' + parm
        }
      }
      this.isDialogEditDjiAction = false
    },
    // 清除大疆动作
    clearDjiAction() {
      if (this.editWpDjiActionDialogModel.type === 'one') {
        this.editWpDialogModel.wpDjiActions = ''
      } else if (this.editWpDjiActionDialogModel.type === 'all') {
        this.editWpsDialogModel.wpDjiActions = ''
      }
    },
    // 删除单个航点
    deleteWpBefore(wp) {
      this.$confirm('是否删除[' + wp.index + ']号航点?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteWp(wp.index)
      }).catch(() => { })
    },
    refreshLine() {
      const wpsPathTemp = []
      let wpsAlt = 0
      let wpsDistance = 0
      let wpsLat = 0
      let wpsLng = 0
      const lastLatLng = { lat: 0, lng: 0 }
      this.wps.forEach((wp, index) => {
        if (wp.wpLat !== 0 && wp.lng !== 0) {
          if (wpsAlt === 0) wpsAlt = wp.wpAlt
          if (wpsLat === 0) wpsLat = wp.wpLat
          if (wpsLng === 0) wpsLng = wp.wpLng
          wpsPathTemp.push(this.getMarkerPostion(wp.wpLat, wp.wpLng))
          if (lastLatLng.lat !== 0 && lastLatLng.lng !== 0) {
            wpsDistance += this.$gisUtil.getDistance(lastLatLng.lat, lastLatLng.lng, 0, wp.wpLat, wp.wpLng, 0)
          }
          lastLatLng.lat = wp.wpLat
          lastLatLng.lng = wp.wpLng
        }
      })
      this.wpsPath = wpsPathTemp

      this.wpsInfo.wpsType = this.selectedUavType === 1 ? 1 : 0
      this.wpsInfo.wpsLat = wpsLat
      this.wpsInfo.wpsLng = wpsLng
      this.wpsInfo.wpsAlt = wpsAlt
      this.wpsInfo.wpsDistance = wpsDistance
      this.wpsInfo.wpsUserTime = wpsDistance / 5 // 预计飞行耗时
      this.wpsInfo.wpsWpCount = this.wps.length
      this.wpsInfo.wpsLocation = ''
      this.wpsInfo.wpsAltAbs = 30
    },
    // 刷新全部航点
    refreshWps() {
      // const wpsPathTemp = []
      let wpIndexTemp = 0
      this.wps.forEach((wp, index) => {
        wp.wpIndex = wpIndexTemp
        // if (wp.lat !== 0 && wp.lng !== 0) {
        //   wpsPathTemp.push(this.getMarkerPostion(wp.lat, wp.lng))
        // }
        wpIndexTemp++
      })
      // this.wpsPath = wpsPathTemp
      this.refreshLine()
    },
    enableEditWps(enable) {
      if (enable) {
        this.isEditWps = enable
      } else {
        this.isEditWps = !this.isEditWps
      }
      if (!this.isEditWps) {
        this.isEditGrid = false
      }
      this.$notify({ title: '', message: this.isEditWps ? '您可以开始编辑航线任务了。' : '已结束航线编辑模式！', type: this.isEditWps ? 'success' : 'info' })
    },
    clearWps() {
      this.wpsPath = []
      this.wps = []
      this.wpsInfo.wpsLat = 0
      this.wpsInfo.wpsLng = 0
      this.wpsInfo.wpsAlt = 0
      this.wpsInfo.wpsDistance = 0
      this.wpsInfo.wpsUserTime = 0 // 预计飞行耗时
      this.wpsInfo.wpsWpCount = 0
      this.wpsInfo.wpsLocation = ''
      this.wpsInfo.wpsAltAbs = 0
    },
    // 停机坪 ---------------------------------------------------------

    // 当前无人机是否绑定了停机坪
    getIsThisUavContainsHive() {
      return this.hivesNowUav && this.hivesNowUav != null && this.hivesNowUav.length > 0
    },
    clickHiveRow(row) {
      this.switchHive(row)
    },
    // 切换停机坪
    switchHive(hive) {
      let changed = true
      if (this.selectedHiveItem && this.selectedHiveItem != null && this.selectedHiveItem.hiveId === hive.hiveId) {
        changed = false
      }
      this.selectedHiveItem = hive
      this.isShowThisUavHives = false
      if (changed) {
        this.refreshVideo('hive')
      }
    },

    getMarkerHivePostion(item) {
      if (item && item != null) {
        if (!item.hiveLat || !item.hiveLng) return null
        if (item.hiveLat === 0 || item.hiveLng === 0) return null
        const position = this.$gisUtil.ConvertGpsToAmap(item.hiveLat, item.hiveLng)
        return [position.lng, position.lat]

      } else {
        return null
      }
    },
    getHiveTitle(item) {
      let title = '停机坪'
      if (item && item != null) {
        title = '名称:' + item.hiveName +
          '\r\n编号:' + item.hiveId +
          '\r\n位置:' + item.hiveAddress +
          '\r\n状态:' + ((item.isOnline && item.isOnline === true) ? '在线' : '离线')
      }
      return title
    },
    getHiveIco(item) {
      // return this.hiveOnline
      if (item) {
        if (!item.hasOwnProperty('isOnline')) return this.hiveOffline
        if (item.isOnline) return this.hiveOnline
        else return this.hiveOffline
      } else {
        return null
      }
    },
    // 无人机 ---------------------------------------------------------
    clickUavRow(row) {
      this.clickUavItem(row, true)
    },
    clickUavItem(item, needclose) {
      let goon = true
      if (needclose && needclose === true) {
        this.isShowUavs = false
      }
      this.selectedUavType = item.uavFactoryId // 当前选择的无人机类型
      if (this.selectedUavItem === null || this.selectedUavItem.uavId !== item.uavId) {
        // 切换了无人机
        if (this.wps.length > 0) {
          if (this.selectedUavItem == null || this.selectedUavItem.uavFactoryId !== item.uavFactoryId) {
            goon = false
            this.$confirm('当前选择的无人机类型变化，继续将会清除航线任务，是否切换?', '提示', {
              confirmButtonText: '切换',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.clearWps()
              this.switchUav(item)
            }).catch(() => { })
          }
        }
      }
      if (goon) {
        this.switchUav(item)
      }
    },
    // 切换无人机
    switchUav(item) {
      let changed = true
      this.ProgressShow = "离线";
      if (this.selectedUavItem && this.selectedUavItem != null && this.selectedUavItem.uavId === item.uavId) {
        changed = false
      }
      if (!item.selected) {
        if (this.selectedUavItem !== null) {
          this.selectedUavItem.selected = false
        }
      }
      this.selectedUavItem = item
      this.selectedUavItem.selected = true
      this.changedUav(changed)
    },
    async changedUav(changed) {
      if (changed && changed === true) {
        // this.$store.dispatch('settings/SET_defaultUavIndex', 2).then((response) => {})
        let index = this.uavs.findIndex((item) => { return item.uavId === this.selectedUavItem.uavId })
        this.$store.commit('settings/setDefaultUavIndex', index)
        this.$store.commit('settings/setDefaultHiveIndex', 0)
        // this.showToast('默认无人机：' + this.defaultUavIndex)
        this.refreshVideo()
      }
      this.isFirstGpsFixed = false
      let position = [0, 0]
      if (this.selectedUavItem) {
        if (this.selectedUavItem.heartbeatData && this.selectedUavItem.heartbeatData != null) {
          if (!this.selectedUavItem.heartbeatData.lat || !this.selectedUavItem.heartbeatData.lng) { }
          if (this.selectedUavItem.heartbeatData.lat !== 0 && this.selectedUavItem.heartbeatData.lng !== 0) {
            position = [this.selectedUavItem.heartbeatData.lat, this.selectedUavItem.heartbeatData.lng]
          }
        }
        if (changed && changed === true) {
          // 根据当前无人机获取停机坪
          await this.getHiveByUavId(this.selectedUavItem.uavId, this.selectedUavItem.uavDefaultHiveId)
          this.refreshVideo('hive')
        }
      }
      if (position[0] !== 0 && position[1] !== 0) {
        this.setMapCenter(position[0], position[1], 16)
      }
    },

    getMarkerUavPostion(item) {
      let position = [0, 0]
      if (item) {
        if (item.heartbeatData && item.heartbeatData != null) {
          if (!item.heartbeatData.lat || !item.heartbeatData.lng) { }
          if (item.heartbeatData.lat === 0 || item.heartbeatData.lng === 0) { }
          const temp = this.$gisUtil.ConvertGpsToAmap(item.heartbeatData.lat, item.heartbeatData.lng)
          position = [temp.lng, temp.lat]
        }
      }
      return position
    },
    getMarkerUavHomePostion() {
      let position = [0, 0]
      if (this.selectedUavItem && this.selectedUavItem != null) {
        if (this.selectedUavItem.homePosition && this.selectedUavItem.homePosition != null) {
          if (this.selectedUavItem.homePosition.lat !== 0 && this.selectedUavItem.homePosition.lng !== 0) {
            const temp = this.$gisUtil.ConvertGpsToAmap(this.selectedUavItem.homePosition.lat, this.selectedUavItem.homePosition.lng)
            position = [temp.lng, temp.lat]
          }
        }
      }
      return position
    },
    getUavTitle(item) {
      let title = '无人机'
      if (item && item != null) {
        title = '名称:' + item.uavName +
          '\r\n编号:' + item.uavId +
          '\r\n状态:' + ((item.isOnline && item.isOnline === true) ? '在线' : '离线')
      }
      return title
    },
    getUavHomeTitle() {
      let title = '起飞点'
      if (this.selectedUavItem && this.selectedUavItem != null) {
        title += '\r\n无人机:' + this.selectedUavItem.uavName +
          '\r\n编号:' + this.selectedUavItem.uavId
      }
      return title
    },
    getUavMarkerVisble(item) {
      let visble = false
      if (item) {
        if (item.heartbeatData && item.heartbeatData != null) {
          if (!item.heartbeatData.lat || !item.heartbeatData.lng) { }
          if (item.heartbeatData.lat === 0 || item.heartbeatData.lng === 0) { }
          visble = true
        }
      }
      return visble
    },
    getUavHomeMarkerVisble() {
      let visble = false
      if (this.selectedUavItem && this.selectedUavItem != null) {
        if (this.selectedUavItem.homePosition && this.selectedUavItem.homePosition != null) {
          if (this.selectedUavItem.homePosition.lat !== 0 && this.selectedUavItem.homePosition.lng !== 0) {
            visble = true
          }
        }
      }
      return visble
    },
    getUavIco(uav) {
      let ico = null
      if (uav) {
        if (uav.heartbeatData && uav.heartbeatData != null) {
          if (!uav.heartbeatData.lat || !uav.heartbeatData.lng) { }
          if (uav.heartbeatData.lat === 0 || uav.heartbeatData.lng === 0) { } else {
            if (uav.isOnline && uav.heartbeatData.areMotorsOn === 1) ico = this.djiUavOnline
            else ico = this.djiUavOffline
          }
        }
      }
      return ico
    },
    getMarkerUavRoute(uav) {
      let yaw = 0
      if (uav) {
        if (uav.heartbeatData && uav.heartbeatData != null) {
          if (uav.heartbeatData.yaw) {
            return uav.heartbeatData.yaw
          }
        }
      }
      return yaw
    },

    // 后台交互 ---------------------------------------------------------
    getCurrentTime() {
      const data = new Date()
      const yy = data.getFullYear()
      const mm = data.getMonth() + 1
      const dd = data.getDate()
      const hh = data.getHours()
      const mf = data.getMinutes() < 10 ? '0' + data.getMinutes() : data.getMinutes()
      const ss = data.getSeconds() < 10 ? '0' + data.getSeconds() : data.getSeconds()
      return yy + '-' + mm + '-' + dd + '-' + hh + '' + mf + '' + ss
    },
    openOrCloseGcs() {
      if (this.selectedUavItem && this.selectedUavItem != null) {
        if (this.selectedUavItem.isGcsOnline) {
          this.$confirm('是否关闭大疆地面站？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.doCommand(1029, 0, 0, 0, 0, 5)
          }).catch(() => { });
        } else {
          this.$confirm('是否打开大疆地面站？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.doCommand(1028, 0, 0, 0, 0, 5)
          }).catch(() => { });
        }
      }
    },
    startOrStopCharging() {
      if (this.selectedUavItem && this.selectedUavItem != null) {
        if (this.selectedUavItem.isCharging) {
          this.$confirm('是否停止充电？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.doCommand(1033, 0, 0, 0, 0, 5)
          }).catch(() => { });
        } else {
          this.$confirm('是否开始充电？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.doCommand(1032, 0, 0, 0, 0, 5)
          }).catch(() => { });
        }
      }
    },
    openOrCloseSystem(open) {
      if (this.selectedUavItem && this.selectedUavItem != null) {
        if (!open) {
          this.doCommand(1012, 0, 0, 0, 0, 5)
          // this.$confirm('是否关闭系统？', '提示', {
          //     confirmButtonText: '确定',
          //     cancelButtonText: '取消',
          //     type: 'warning'
          // }).then(() => {
          //     this.doCommand(1012, 0, 0, 0, 0, 5)
          // }).catch(() => {});
        } else {
          this.doCommand(1000, 0, 0, 0, 0, 5)
          // this.$confirm('是否打开系统？', '提示', {
          //     confirmButtonText: '确定',
          //     cancelButtonText: '取消',
          //     type: 'warning'
          // }).then(() => {
          //     this.doCommand(1000, 0, 0, 0, 0, 5)
          // }).catch(() => {});
        }
      }
    },
    openOrCloseUav() {
      if (this.selectedUavItem && this.selectedUavItem != null) {
        if (this.selectedUavItem.isOnline) {
          this.$confirm('是否关闭无人机？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.doCommand(1021, 0, 0, 0, 0, 5)
          }).catch(() => { });
        } else {
          this.$confirm('是否打开无人机？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.doCommand(1020, 0, 0, 0, 0, 5)
          }).catch(() => { });
        }
      }
    },
    openOrCloseRemote() {
      if (this.selectedUavItem && this.selectedUavItem != null) {
        if (this.selectedUavItem.isRomoteControlOnline) {
          this.$confirm('是否关闭遥控器？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.doCommand(1025, 0, 0, 0, 0, 5)
          }).catch(() => { });
        } else {
          this.$confirm('是否打开遥控器？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.doCommand(1024, 0, 0, 0, 0, 5)
          }).catch(() => { });
        }
      }
    },
    // 打开关闭空调
    openOrCloseAirConditioner() {
      this.$confirm('是否启动空调？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.showToast('功能暂未开放！')
      }).catch(() => { });
      // if (this.selectedUavItem && this.selectedUavItem != null) {
      //     if (this.selectedUavItem.isRomoteControlOnline) {
      //         this.$confirm('是否关闭空调？', '提示', {
      //             confirmButtonText: '确定',
      //             cancelButtonText: '取消',
      //             type: 'warning'
      //         }).then(() => {
      //             this.showToast('功能暂未开放！')
      //                 // this.doCommand(1025, 0, 0, 0, 0, 5)
      //         }).catch(() => {});
      //     } else {
      //         this.$confirm('是否启动空调？', '提示', {
      //             confirmButtonText: '确定',
      //             cancelButtonText: '取消',
      //             type: 'warning'
      //         }).then(() => {
      //             this.showToast('功能暂未开放！')
      //         }).catch(() => {});
      //     }
      // }
    },
    saveWps() {
      if (this.wps.length <= 0) {
        this.showToast('请先规划航线路径！')
      } else {
        this.$layer.prompt({
          title: '请输入任务信息',
          formType: 0, // 输入框类型，支持0（文本）默认1（密码）2（多行文本）
          // value: '航线任务' + this.getCurrentTime(), // 初始时的值，默认空字符
          value: '暂无任务描述',
          maxlength: 140, // 可输入文本的最大长度，默认500
          area: ['400px', '270px'], // 自定义文本域宽高
          scrollbar: false,
          zIndex: 2000 // 层优先级
        },
          (taskDescriptions, index) => {
            if ($('#taskName').val() === '' || taskDescriptions === '') {
              this.$layer.msg('任务名称和描述不能为空！')
              return
            } else {
              // console.log(`获取弹框的信息 任务名称 ${$('#taskName').val()} 任务描述:${taskDescriptions}`)
              this.addTaskWps($('#taskName').val(), taskDescriptions)
              this.$layer.close(index)
            }
          }
        )
        // 往class=vl-input元素前插入
        $('.vl-input').before(
          `<div style="margin-bottom:8px">任务名称</div><input id="taskName" data-v-6c69dd9a type="text" style="margin-bottom:10px" class="vl-input"/><div style="margin-bottom:8px">任务描述</div>`
        )
      }
    },
    async queryAllCommands() {
      this.efCommands = []
      // 调用的是src/store/modules中的login方法
      return this.$store.dispatch('efCommands/queryAllCommands').then((response) => {
        const { code, data } = response
        if (code === 1 && data) {
          this.efCommands = data
        }
      }).catch(() => { })
    },
    // 查询指令集
    async queryAllDjiEnum() {
      await this.$store
        .dispatch('efTaskWps/queryAllDjiEnum')
        .then((response) => {
          if (response.code === 1) {
            this.wpsGotoWaypointModeOptions = response.data.efDjiEnumGotoFirstWp
            this.wpsHeadingModeOptons = response.data.efDjiEnumHeadingMode
            this.wpsFlightPathModeOptions = response.data.efDjiEnumPathModes
            this.wpsFinishedActionOptions = response.data.efDjiEnumFinlishTask
            this.wpsRcSignalLostOptions = response.data.efDjiEnumRcSignLosts
          } else {
            this.showMessage(response.message, 'error')
          }
        })
        .catch((error) => {
          this.showMessage(error, 'error')
        })
    },
    async queryAllDjiActions() {
      this.djiActions = []
      // 调用的是src/store/modules中的login方法
      return this.$store.dispatch('efDjiActions/queryAllDjiActions').then((response) => {
        const { code, data } = response
        if (code === 1 && data) {
          this.djiActions = data
        }
      }).catch(() => { })
    },
    // 查询拥有权限的无人机和停机坪
    async initMyUavHives() {
      this.hives = []
      this.uavs = []
      // 调用的是src/store/modules中的login方法
      return this.$store.dispatch('user/getMyUavHive').then((response) => {
        const { code, data, message } = response
        if (code === 1 && data) {
          this.selectedUavItem = null
          this.hives = data.hives

          let uavsTemp = data.uavs
          if (uavsTemp && uavsTemp.length > 0) {
            for (let i = 0; i < uavsTemp.length; i++) {
              // 给数组增加字段
              // uavFactoryId 无人机类型，大疆或翼飞
              uavsTemp[i].selected = false
              uavsTemp[i].isOnline = false
              uavsTemp[i].isCharging = false // 充电状态
              uavsTemp[i].isChargingText = "未知";
              uavsTemp[i].isDjiServerOnline = false // 服务后台在线状态
              uavsTemp[i].isGcsOnline = false // 地面站在线状态
              uavsTemp[i].isUavOnline = false // 无人机在线状态
              uavsTemp[i].isRomoteControlOnline = false // 遥控器在线状态
              uavsTemp[i].isAirLinkOnline = false // 无人机与遥控器链接
              uavsTemp[i].isCameraOnline = false // 相机
              uavsTemp[i].djiServerBootTime = 0 //大疆服务启动时间

              uavsTemp[i].djiServerTime = 0 // 大疆服务的心跳包时间
              uavsTemp[i].heartbeatData = null // 实时心跳包数据
              uavsTemp[i].heartbeatDataTime = 0 // 实时心跳包的时间
            }
            this.uavs = uavsTemp

            let index = 0
            if (this.defaultUavIndex && this.defaultUavIndex !== null && !isNaN(this.defaultUavIndex) && this.defaultUavIndex < this.uavs.length) {
              index = this.defaultUavIndex
            }
            this.clickUavItem(this.uavs[index])
          }
        } else {
          this.showMessage(message, 'error')
        }
      }).catch(() => { })
    },

    // 保存任务文件到云端
    async addTaskWps(name, des) {
      // let that = this
      this.wpsInfo.wpsName = name
      this.wpsInfo.wpsDes = des
      this.loading = true
      // 调用的是src/store/modules中的login方法
      return this.$store.dispatch('efTaskWps/addTaskWps', { wpsInfo: this.wpsInfo, wpsDetail: this.wps }).then((response) => {
        this.loading = false
        const { code, message } = response
        this.showMessage(message, code === 1 ? 'success' : 'error')
      }).catch(() => {
        this.loading = false
      })
    },
    // 上传任务至无人机
    async uploadWps() {
      if (this.wps.length <= 0) {
        this.showToast('请先规划航线路径！')
      } else {
        const data = {
          tag: 0,
          timeout: 10,
          uavId: this.selectedUavItem.uavId,
          wpsInfo: this.wpsInfo,
          wpsDetail: this.wps
        }
        this.loading = true
        this.loadingText = '上传航线任务中...'
        return this.$store.dispatch('uav/uploadWps', data).then((response) => {
          const { code, message } = response
          this.loading = false
          this.showMessage(message, code === 1 ? 'success' : 'error')
          if (code === 1) {
            setTimeout(() => { this.isShowMessageTip = false }, 30000) // 最多30秒后强制关闭提示
          }
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 从无人机下载任务
    async downloadWps() {
      if (this.selectedUavItem == null) {
        this.showToast('请选择无人机!')
      } else {
        this.$confirm('是否从无人机下载航线任务?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const data = {
            tag: 0,
            timeout: 20,
            uavId: this.selectedUavItem.uavId,
            wpsType: this.selectedUavType
          }
          this.loading = true
          this.loadingText = '下载航线任务中...'
          return this.$store.dispatch('uav/downloadWps', data).then((response) => {
            const { code, message, data } = response
            this.loading = false
            this.showMessage(message, code === 1 ? 'success' : 'error')
            if (code === 1) {
              setTimeout(() => { this.isShowMessageTip = false }, 30000) // 最多30秒后强制关闭提示
              const { msg3108, msg3109 } = data
              if (msg3108 && msg3109) {
                // 1、航线描述信息赋值
                // this.wpsInfo.wpsLat = 0
                // this.wpsInfo.wpsLng = 0
                this.wpsInfo.wpsType = msg3108.missionType
                this.wpsInfo.wpsWpCount = msg3108.wpsCount
                this.wpsInfo.wpsSpeed = msg3108.speed / 100
                this.wpsInfo.wpsMaxSpeed = msg3108.maxSpeed / 100
                this.wpsInfo.wpsRcSignalLost = msg3108.missionOnRCSignalLostEnabled
                this.wpsInfo.wpsFinishedAction = msg3108.missionFinishedAction
                this.wpsInfo.wpsFlightPathMode = msg3108.missionFlightPathMode
                this.wpsInfo.wpsGotoWaypointMode = msg3108.missionGotoWaypointMode
                this.wpsInfo.wpsHeadingMode = msg3108.missionHeadingMode
                this.wpsInfo.wpsRepeatTimes = msg3108.missionRepeatTimes
                // 1、航线航点赋值
                const wps = msg3109.waypointDjiList
                if (wps.length > 0) {
                  this.clearWps()
                  const latlng = { lat: 0, lng: 0 }
                  for (let i = 0; i < wps.length; i++) {
                    const actionCount = wps[i].actionCount
                    const actions = wps[i].waypointDjiActionList
                    let wpDjiActions = ''
                    if (actionCount > 0 && actions.length > 0) {
                      actions.forEach((item) => {
                        wpDjiActions += item.actionType + ',' + item.actionParam
                        wpDjiActions += '|'
                      })
                    }
                    if (wpDjiActions.length > 0) {
                      wpDjiActions = wpDjiActions.substring(0, wpDjiActions.length - 1)
                    }
                    const wp = {
                      wpIndex: wps[i].wpNo,
                      wpLat: wps[i].lat / 1E7,
                      wpLng: wps[i].lng / 1E7,
                      wpAlt: wps[i].altRel / 100,
                      wpAltAbs: wps[i].altAbs / 100,
                      wpAction: 16,
                      wpDjiActions: wpDjiActions,
                      wpParm1: 0,
                      wpParm2: 0,
                      wpParm3: 0,
                      wpParm4: 0
                    }
                    if (latlng.lat === 0 || latlng.lng === 0) {
                      latlng.lat = wp.wpLat
                      latlng.lng = wp.wpLng
                    }
                    if (msg3108.missionType !== 1) {
                      wp.wpParm1 = 0
                      wp.wpParm2 = 0
                      wp.wpParm3 = 0
                      wp.wpParm4 = 0
                    }
                    this.addWpDetail(wp, false)
                  }
                  if (latlng.lat !== 0 && latlng.lng !== 0) {
                    this.setMapCenter(latlng.lat, latlng.lng, 16)
                  }
                  this.refreshLine()
                }
              }
            }
          }).catch(() => {
            this.loading = false
          })
        }).catch(() => { })
      }
    },
    async beforeDoCommand(command, p1, p2, p3, p4, timeout, msg) {
      this.isDoingCommand = true
      let tip = msg
      if (!this.selectedUavItem.isOnline) {
        tip = "[无人机离线] " + msg
      }
      this.$confirm(tip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (command === 'openSystem') {
          this.openOrCloseSystem(true)
        } else if (command === 'closeSystem') {
          this.openOrCloseSystem(false)
        } else {
          this.doCommand(command, p1, p2, p3, p4, timeout)
        }
      }).catch(() => { this.isDoingCommand = false });
    },
    // 操作停机坪命令
    async beforeDoCommandHive(command, p1, p2, p3, p4, timeout, msg) {
      if (!this.selectedHiveItem || this.selectedHiveItem == null) {
        this.showMessage('未绑定或配置停机坪!', 'error')
        return
      }
      let tip = msg
      if (!this.selectedHiveItem.isOnline) {
        tip = "[停机坪离线] " + msg
      }
      this.$confirm(tip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doCommandHive(command, p1, p2, p3, p4, timeout)
      }).catch(() => { });
    },
    // 无人机控制指令
    async doCommand(command, p1, p2, p3, p4, timeout) {
      if (!timeout) {
        timeout = 5
      }
      const data = {
        tag: this.$tag++,
        timeout: timeout,
        uavId: this.selectedUavItem.uavId,
        command: command,
        parm1: p1,
        parm2: p2,
        parm3: p3,
        parm4: p4
      }
      if (command === 1151) {
        // 结束远程控制
        this.isRemoteEnable = false
        if (this.timerSendRemoteData) {
          if (this.timerSendRemoteData != null) {
            clearInterval(this.timerSendRemoteData);
          }
        }
      }
      this.loading = true
      this.loadingText = '执行命令中...'
      return this.$store.dispatch('uav/doCommand', data).then((response) => {
        this.isDoingCommand = false
        const { code, message } = response
        this.loading = false
        let showTip = message
        if (command === 1150) {
          // 开始远程控制成功
          this.isRemoteEnable = false
          if (this.timerSendRemoteData && this.timerSendRemoteData != null) {
            clearInterval(this.timerSendRemoteData);
          }
          this.isRemoteEnable = true
          this.timerSendRemoteData = setInterval(this.sendDjiRemoteData, 350);
        }
        if (code === 1) {
          if (command === 1160) {
            this.isYuntaiMode = true
            showTip = '切换到拍照模式' + showTip
          } else if (command === 1161) {
            this.isYuntaiMode = false
            showTip = '切换到录像模式' + showTip
          } else if (command === 1162) {
            showTip = '拍照' + showTip
            this.isYuntaiMode = true
          } else if (command === 1163) {
            showTip = '开始录像' + showTip
            this.isYuntaiMode = false
          } else if (command === 1164) {
            showTip = '结束录像' + showTip
            this.isYuntaiMode = false
          }
        }
        if (code === 1) {
          this.showToast(showTip)
        } else {
          this.showMessage(showTip, 'error')
        }
        //this.showMessage(showTip, code === 1 ? 'success' : 'error')
      }).catch(() => {
        this.isDoingCommand = false
        this.loading = false
      })
    },
    // 停机坪控制控制指令
    async doCommandHive(command, p1, p2, p3, p4, timeout) {
      const data = {
        tag: this.$tag++,
        timeout: timeout,
        hiveId: this.selectedHiveItem.hiveId,
        command: command,
        parm1: p1,
        parm2: p2,
        parm3: p3,
        parm4: p4
      }
      this.loading = true
      this.loadingText = '执行命令中...'
      return this.$store.dispatch('hive/doCommand', data).then((response) => {
        const { code, message } = response
        this.loading = false
        if (code === 1) {
          this.showToast(message)
        } else {
          this.showMessage(message, 'error')
        }
        // this.showMessage(message, code === 1 ? 'success' : 'error')
      }).catch(() => {
        this.loading = false
      })
    },
    // 下载云端任务
    async showAllTaskWps() {
      this.isDialogTasks = true
      await this.queryAllTaskWps()
    },
    // 删除任务
    async deleteTaskById(id) {
      this.loadingWps = true
      await this.$store
        .dispatch("efTaskWps/deleteTimedTask", { id: id })
        .then((response) => {
          this.loadingWps = false
          if (response.code === 1) {
            this.showToast('删除成功')
            const index = this.taskWps.findIndex((item) => {
              if (item.id === id) {
                return
              }
            })
            if (index >= 0) {
              this.taskWps.splice(index, 1)
            }
          } else {
            this.showMessage(response.message, 'error')
          }
        });
    },
    //查询所有航点任务 
    async queryAllTaskWps() {
      this.loadingWps = true;
      this.taskWps = [];
      await this.$store
        .dispatch("timedTask/queryAllTaskWps", { type: null })
        .then((response) => {
          this.loadingWps = false;
          if (response.code === 1) {
            this.taskWps = response.data
          } else {
            this.showToast(response.message);
          }
        })
        .catch((error) => {
          this.loadingWps = false;
          this.showMessage(error, 'error')
        });
    },
    //查询选择任务的所有航点
    async queryByWpsIndex(id, wpsName, item) {
      const msg = '当前任务类型与所选择的无人机不一致！'
      if (item.wpsType === 1) {
        //item.wpsType  0为翼飞任务，1为大疆任务
        //this.selectedUavType 1 大疆，2 翼飞，3 xxx
        if (this.selectedUavType !== 1) {
          this.showMessage(msg, 'warning')
          return
        }
      } else {
        if (this.selectedUavType !== 2) {
          this.showMessage(msg, 'warning')
          return
        }
      }
      this.loadingWps = true;
      this.wpsInfo.id = id;
      this.wpsInfo.wpsName = wpsName;
      this.wpsInfo.wpsType = item.wpsType;
      this.wpsInfo.wpsLat = item.wpsLat;
      this.wpsInfo.wpsLng = item.wpsLng;
      this.wpsInfo.wpsAlt = item.wpsAlt;
      this.wpsInfo.wpsDistance = item.wpsDistance;
      this.wpsInfo.wpsUserTime = item.wpsUserTime;
      this.wpsInfo.wpsWpCount = item.wpsWpCount;
      this.wpsInfo.wpsLocation = item.wpsLocation;
      this.wpsInfo.wpsAltAbs = item.wpsAltAbs;
      this.wpsInfo.wpsCreateTime = item.wpsCreateTime;
      this.wpsInfo.wpsCreateByUserId = item.wpsCreateByUserId;
      this.wpsInfo.wpsUpdateTime = item.wpsUpdateTime;
      this.wpsInfo.wpsUpdateByUserId = item.wpsUpdateByUserId;
      this.wpsInfo.wpsDes = item.wpsDes;
      this.wpsInfo.wpsCompanyId = item.wpsCompanyId;
      this.wpsInfo.wpsSpeed = item.wpsSpeed;
      this.wpsInfo.wpsMaxSpeed = item.wpsMaxSpeed;
      this.wpsInfo.wpsRcSignalLost = item.wpsRcSignalLost;
      this.wpsInfo.wpsFinishedAction = item.wpsFinishedAction;
      this.wpsInfo.wpsFlightPathMode = item.wpsFlightPathMode;
      this.wpsInfo.wpsGotoWaypointMode = item.wpsGotoWaypointMode;
      this.wpsInfo.wpsHeadingMode = item.wpsHeadingMode;
      this.wpsInfo.wpsRepeatTimes = item.wpsRepeatTimes;
      await this.$store
        .dispatch("efTaskWps/queryByWpsIndex", { id: id, })
        .then((response) => {
          this.loadingWps = false;
          const { code, data, message } = response
          if (code === 1) {
            this.showToast('下载任务成功')
            if (data && data.length > 0) {
              const { efTaskWps, efTaskWpsDetails } = data[0]
              this.clearWps();
              this.wps = efTaskWpsDetails
              this.refreshLine();
              if (this.wps && this.wps.length >= 0) {
                this.setMapCenter(this.wps[0].wpLat, this.wps[0].wpLng, 16)
              }
            }
          } else {
            this.showMessage(message, 'error')
          }
        });
    },
    // 查询当前流是否正在播放
    async getLineStreamOnline(url, type) {
      // url = "www.efuav.xyz/live/asdweqrfdsfds-stream1?txSecret=423c66abf4a948c3c28a623449b9e15b&txTime=61ea3c31"
      if (url && url.length > 10) {
        let temp = url
        try {
          const index = url.indexOf('?')
          if (index > 0) {
            url = url.substring(0, index)
            const index2 = url.lastIndexOf('/')
            url = url.substring(index2 + 1, url.length)
          }
        } catch (error) {
          url = temp
        }
      }
      if (type === 'uav') {
        this.isRequestStream1 = true
        this.textRequestStream1 = '获取视频状态中'
      } else if (type === 'hive') {
        this.isRequestStream2 = true
        this.textRequestStream2 = '获取视频状态中'
      }
      let result = null
      try {
        await this.$store
          .dispatch("efTencent/getLineStreamOnline", { appName: 'live', streamName: url, timeout: 5 })
          .then((response) => {
            const { code, data } = response
            // this.loadingWps = false
            if (code === 1 && data.streamState) {
              result = data.streamState === 'active'
              if (type === 'uav') {
                this.textRequestStream1 = result ? '加载视频中' : '未开始直播'
              } else if (type === 'hive') {
                this.textRequestStream2 = result ? '加载视频中' : '未开始直播'
              }
              setTimeout(() => {
                if (type === 'uav') {
                  this.isRequestStream1 = false
                } else if (type === 'hive') {
                  this.isRequestStream2 = false
                }
              }, 1500)
            }
          });
      } catch (error) {
        setTimeout(() => {
          if (type === 'uav') {
            this.isRequestStream1 = false
          } else if (type === 'hive') {
            this.isRequestStream2 = false
          }
        }, 1500)
      }
      return result
    },
    // 根据无人机编号获取对应绑定的停机坪 
    async getHiveByUavId(uavId, uavDefaultHiveId) {
      this.loading = true
      this.selectedHiveItem = {}
      this.hivesNowUav = []
      this.isHasHive = false
      try {
        await this.$store
          .dispatch("efRelationUavHive/queryByUavId", { uavId: uavId })
          .then((response) => {
            this.loading = false;
            const { code, message, data } = response
            if (code === 1) {
              if (data && data.length >= 0) {
                for (let i = 0; i < data.length; i++) {
                  for (let j = 0; j < this.hives.length; j++) {
                    if (this.hives[j].hiveId === data[i].hiveId) {
                      this.hivesNowUav.push(this.hives[j])
                      break
                    }
                  }
                }
                if (this.hivesNowUav.length > 0) {
                  let index = -1
                  this.isHasHive = true
                  if (uavDefaultHiveId && uavDefaultHiveId !== null && uavDefaultHiveId !== "") {
                    index = this.hivesNowUav.findIndex(x => x.hiveId === uavDefaultHiveId)
                  }
                  if (index < 0) {
                    if (this.defaultHiveIndex && this.defaultHiveIndex !== null && !isNaN(this.defaultHiveIndex) && this.defaultHiveIndex < this.hivesNowUav.length) {
                      index = this.defaultHiveIndex
                    }
                  }
                  if (index < 0) {
                    index = 0
                  }
                  this.selectedHiveItem = this.hivesNowUav[index]
                }
                // for (let index = 0; index < 20; index++) {
                //     let item = JSON.parse(JSON.stringify(this.selectedHiveItem))
                //     item.hiveId = this.selectedHiveItem.hiveId + (index + 1)
                //     this.hivesNowUav.push(item)
                // }
              } else {
                this.showToast('当前无人机未绑定停机坪！')
              }
            } else {
              this.showMessage(message, 'warning');
            }
          })
          .catch((error) => {
            this.loading = false;
            this.showMessage(error, 'error')
          });
      } catch (error) {
        this.loading = false;
      }
    },
    // websocket ---------------------------------------------------------
    // 初始化weosocket
    async initWebSocket() {
      // console.log('initWebSocket 1')
      if (this.userId && this.name) {
        if (this.userId !== '' && this.name !== '') {
          if (this.webSocket !== null) {
            this.webSocket.destroy()
            this.webSocket = null
          }
          // let webSocketPath = this.$webSocketPath
          // let webSocketPath = process.env.WEB_SOCKET_URL
          // console.log('web socket 连接地址:' + webSocketPath)
          // const wsuri = 'ws://127.0.0.1:8765/efapi/uavsystem/websocket/' + this.userId + '/' + this.name
          const URL = (location.protocol === "https:" ? "wss" : "ws") + '://' + location.host + '/websocketapi/' + this.userId + '/' + this.name
          console.log('连接地址：' + URL)
          this.webSocket = new WebSocket(URL)
          // console.log('initWebSocket 2')
          this.webSocket.onmessage = this.websocketonmessage
          this.webSocket.onopen = this.websocketonopen
          this.webSocket.onerror = this.websocketonerror
          this.webSocket.onclose = this.websocketclose
        }
      }
    },
    // 连接建立之后执行send方法发送数据
    websocketonopen() {
      // console.log('websocketonopen')
      const actions = { 'msg': '我来了，同志们！' }
      this.websocketsend(JSON.stringify(actions))
    },
    // 连接建立失败重连
    websocketonerror(e) {
      console.log('websocketonerror：' + e)
      this.initWebSocket()
    },
    // 数据接收
    websocketonmessage(e) {
      // console.log('接收WebSocket数据：' + e.data)
      let index = -1 // 当前无人机在数组中的索引
      let indexHive = -1 // 当前停机坪在数组中的索引
      let isNowUav = false
      let isNowHive = false
      const resultUtil = JSON.parse(e.data)
      const { messageID, code, deviceID, message, data } = resultUtil
      let needForceUpdate = false
      if (this.uavs && this.uavs.length > 0) {
        index = this.uavs.findIndex(x => x.uavId === deviceID)
      }
      if (this.hives && this.hives.length > 0) {
        indexHive = this.hives.findIndex(x => x.hiveId === deviceID)
      }
      if (this.selectedUavItem && this.selectedUavItem !== null && this.selectedUavItem.uavId === deviceID) {
        isNowUav = true
      }
      if (this.selectedHiveItem && this.selectedHiveItem !== null && this.selectedHiveItem.hiveId === deviceID) {
        isNowHive = true
      }
      switch (messageID) {
        case 2200: // 大疆无人机心跳包
          if (index >= 0) {
            needForceUpdate = true
            this.uavs[index].isOnline = true
            this.uavs[index].heartbeatData = data
            this.uavs[index].heartbeatDataTime = Date.now()
            if (isNowUav) {
              // this.speechSynthesis()
              if (this.isMapFollowUav) {
                this.setMapCenter(data.lat, data.lng)
              }
              // 首次定位，跳转到对应的地图位置
              if (data.lat === 0 && data.lng === 0) {
                this.isFirstGpsFixed = false
              } else {
                if (this.selectedUavItem.heartbeatData.aremd === 0) {
                  this.selectedUavItem.homePosition = { lat: data.lat, lng: data.lng }
                }
                if (this.isFirstGpsFixed === false) {
                  if (data.lat !== 0 && data.lng !== 0) {
                    this.isFirstGpsFixed = true
                    this.selectedUavItem.homePosition = { lat: data.lat, lng: data.lng }
                  }
                }
              }
              if (this.ProgressShowTime + 5000 < Date.now()) {
                this.ProgressShowTime = Date.now();
                if (this.selectedUavItem.isOnline) {
                  if (this.selectedUavItem.heartbeatData.areMotorsOn === 1) {
                    this.ProgressShow = "飞行中";
                  } else {
                    this.ProgressShow = "地面待命";
                  }
                } else {
                  this.ProgressShow = "离线";
                }
              }
            }
          }
          break
        case 2250: // 大疆服务后台心跳包
          const { bootTime, isAirLinkOnline, isCameraOnline, isGcsOnline, isRomoteControlOnline, isUavOnline, machineCode } = data
          if (index >= 0) {
            needForceUpdate = true
            this.uavs[index].isDjiServerOnline = true // 服务后台在线状态
            this.uavs[index].isGcsOnline = (isGcsOnline === 1) // 地面站在线状态
            this.uavs[index].isUavOnline = (isUavOnline === 1) // 无人机在线状态
            this.uavs[index].isRomoteControlOnline = (isRomoteControlOnline === 1) // 遥控器在线状态
            this.uavs[index].isAirLinkOnline = (isAirLinkOnline === 1) // 无人机与遥控器链接
            this.uavs[index].isCameraOnline = (isCameraOnline === 1) // 相机
            this.uavs[index].djiServerBootTime = bootTime //大疆服务启动时间
            this.uavs[index].djiServerTime = Date.now()
          }
          break
        case 2251: // 
          // const { bootTime, isAirLinkOnline, isCameraOnline, isGcsOnline, isRomoteControlOnline, isUavOnline, machineCode } = data
          // if (this.uavs && this.uavs.length > 0) {
          //   uavIndex = this.uavs.findIndex(x => x.uavId === deviceID)
          //   if (uavIndex >= 0) {
          //     this.uavs[uavIndex].isDjiServerOnline = true
          //   }
          // }
          break
        case 3101: // 无人机上传航线中
          if (data) {
            this.isShowMessageTip = true
            const { progress, progressCount, progressText, result, tag } = data
            if (result === 1) {
              this.messageType = 'success'
              if (progressText !== '') {
                this.messageTip = progressText
              }
            } else {
              this.messageType = 'warning'
              if (progressText !== '') {
                this.messageTip = progressText
              }
            }
            if (progress === progressCount) {
              setTimeout(() => { this.isShowMessageTip = false }, 3000)
            }
          }
          break
        case 3109: // 下载无人机任务
          if (data) {
            console.log('下载航线：' + data)
          }
          break
        case 2300: // 机巢心跳包
          if (indexHive >= 0) {
            needForceUpdate = true
            this.hives[indexHive].isOnline = true
            this.hives[indexHive].heartbeatData = data
            this.hives[indexHive].heartbeatDataTime = Date.now()
            if (this.selectedHiveItem && this.selectedHiveItem !== null && this.selectedHiveItem.hiveId === deviceID) {
              this.selectedHiveItem.isOnline = true
              if (this.selectedUavItem && this.selectedUavItem != null) {
                this.selectedUavItem.isCharging = (data.chargeStatus === 2 || data.chargeStatus === 3); // 是否正在充电，0：未知，1：未充电，2：充电中，3：已充满
                this.selectedUavItem.isChargingText = "未知";
                switch (data.chargeStatus) {
                  case 1:
                    this.selectedUavItem.isChargingText = "未充电";
                    break;
                  case 2:
                    this.selectedUavItem.isChargingText = "充电中";
                    break;
                  case 3:
                    this.selectedUavItem.isChargingText = "已充满";
                    break;
                }
              }
            }
          }
          break
        case 2350: // 气象站数据
          if (indexHive >= 0) {
            needForceUpdate = true
            this.hives[indexHive].isOnlineWeather = true
            this.hives[indexHive].heartbeatDataWeather = data
            this.hives[indexHive].heartbeatDataWeatherTime = Date.now()
            if (this.selectedHiveItem && this.selectedHiveItem !== null && this.selectedHiveItem.hiveId === deviceID) {
              this.selectedHiveItem.isOnlineWeather = true
            }
          }
          break
        case 2370: // 基站心跳包
          if (indexHive >= 0) {
            needForceUpdate = true
            this.hives[indexHive].isOnlineBasestation = true
            this.hives[indexHive].heartbeatDataBasestation = data
            this.hives[indexHive].heartbeatDataBasestationTime = Date.now()
            if (this.selectedHiveItem && this.selectedHiveItem !== null && this.selectedHiveItem.hiveId === deviceID) {
              this.selectedHiveItem.isOnlineBasestation = true
            }
          }
          break
        case 3052: // 全自动指令，后续回复 
          // console.log(resultUtil)
          if (isNowUav) {
            // needForceUpdate = true
            // 界面显示提示信息
            let ProgressText = data.progressTextDes; // 进度信息
            let ProgressError = data.errorText; // 错误信息
            let Progress = data.progress; // 倒计时
            this.ProgressShowTime = Date.now();
            if (ProgressError !== "") {
              this.ProgressShow = ProgressError;
            } else {
              if (Progress > 0) {
                this.ProgressShow = ProgressText + "[" + Progress + "]";
              } else {
                this.ProgressShow = ProgressText;
              }
            }
          }
          break
      }
      if (needForceUpdate) {
        this.$forceUpdate()
      }
    },
    // 数据发送
    websocketsend(data) {
      try {
        // console.log('发送WebSocket数据：' + data)
        if (this.webSocket != null) {
          // this.webSocket.send({data: data})
          this.webSocket.send(data)
          // console.warn('云台控制：' + data)
        }
      } catch (error) {
        console.error('websocket: ' + error)
      }
    },
    // 关闭
    websocketclose(e) {
      console.log('断开连接：' + e)
    },
    async logout() { }
  }
}
</script>

<style lang="scss" scoped>
.mainbody {
  // position: absolute;
  // padding: 0px;
  width: 100%;
  height: 100%;
  display: flex; // 弹性布局
  justify-content: center; // 内容水平居中
}

.main {
  position: absolute;
  padding: 0px;
  width: 100%;
  height: 100%;
  display: flex;
}

.middle {
  flex: 1;
  width: 100%;
  height: 100%;
  background-color: #dbdbdb;
  text-align: center;
  display: flex; // 弹性布局
  justify-content: center; // 内容水平居中
  align-items: center; // 内容垂直居中
  position: relative;
  // align-items: center; // 内容垂直居中
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  padding: 0 2px 0 2px;

  .leftHideButton {
    cursor: pointer;
    position: absolute;
    left: 0;
  }

  .rightHideButton {
    cursor: pointer;
    position: absolute;
    right: 0px;
  }
}

.left,
.right {
  width: 300px;
  background-color: #fafafa;
  text-align: center;

  .leftuav,
  .righthive {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .top {
      // box-shadow: 0 2px 1px rgba(0, 0, 0, .12), 0 0 1px rgba(0, 0, 0, .04);
      height: 50px;
    }

    .parmitem {
      position: relative;
      flex: 1;
      padding: 0px 20px 5px 20px; // 上右下左
      display: flex;
      flex-direction: column;

      .div {
        padding: 10px 0px 10px 0px; // 上右下左
        margin: -1px -20px -5px -20px;
        color: #0095f8;
        // border: solid;
        // border-radius: 5px;
        // border-color: rgb(235, 235, 235);
      }

      .el-row {
        flex: 1;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        border-radius: 25px;
        // padding: 10px 0px 10px 5px; // 上右下左
        display: flex;
        align-items: center; //*垂直方向居中*
        // justify-content: center; // 水平方向居中
        margin: 5px 0px;

        .el-col {
          font-size: 13px;
          color: #67c23a;
          font-style: bold;
        }

        .parmName {
          color: #000000;
        }
      }
    }

    .parmitem2 {
      position: relative;
      height: auto;
      padding: 0px 10px 0px 10px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

      .el-row {
        // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        padding: 5px;

        .el-col {
          font-size: 10px;
          font-family: "13px Small,Helvetica Neue", Helvetica, "PingFang SC",
            "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
          color: #67c23a;
        }

        .parmName {
          color: #000000;
        }
      }
    }

    .button {
      padding: 10px;
      position: relative;
      height: auto;

      .el-row {
        padding: 1px;
      }
    }

    .bottom {
      position: relative;
      height: 200px;

      .switchBtn1 {
        position: absolute;
        top: 2px;
        right: 2px;
        cursor: pointer;
      }

      .switchBtn2 {
        position: absolute;
        top: 2px;
        left: 2px;
        cursor: pointer;
      }
    }
  }

  .leftwps {
    height: 100%;
    width: 100%;

    .sideLeftWps {
      flex: 1;
      // overflow-y: auto;
      border: 2px solid rgb(235, 232, 232);
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      z-index: 1000;
      top: 0px;
      left: 0px;
      bottom: 0px;
      width: 100%;
      height: 100%;
      background-color: rgb(255, 255, 255);

      // opacity: 0.9;
      // border-radius: 15px; // 圆角
      .el-scrollbar {
        height: 100%;
      }

      .el-scrollbar__bar {
        &.is-vertical {
          width: 100px; //滚动条宽度
        }
      }

      .el-scrollbar__wrap {
        overflow-y: auto;
        overflow-x: hidden;
      }

      .el-scrollbar__thumb {
        background: red;
      }

      .top {
        padding: 5px 10px 5px 10px; // 上右下左
        background: rgb(250, 250, 250);
        font-size: 13px;
        color: rgb(0, 0, 0);
        border: 2px solid rgb(235, 232, 232);

        .div {
          font-size: 13px;
          color: rgb(0, 0, 0);
          margin-top: 10px;
        }

        .el-row {
          width: 100%;
          display: flex;
          justify-content: space-between;
          text-align: left;
        }

        .el-col {
          font-style: bold;
        }

        .value {
          font-style: bold;
          color: #67c23a;
          font-size: 14px;
        }
      }

      .bottom {
        background: rgb(250, 250, 250);
        padding: 5px;
        border: 2px solid rgb(235, 232, 232);
      }
    }
  }
}

// 视频整体样式，与地图切换后仍旧使用该样式
.videomain {
  height: 100%;
  width: 100%;
  padding-bottom: 15px;
  border-radius: 0px 0px 0px 0px; // 左上角、右上角、右下角、左下角
  position: relative;
  box-shadow: 0 2px 12px 0 rgba(7, 7, 7, 0.1);
  background: rgb(0, 0, 0);
  opacity: 0.9;
  filter: alpha(Opacity=90);
  -moz-opacity: 0.9;

  .video {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .mode {
    position: absolute;
    top: 5px;
    left: 5px;
    width: auto;
    height: auto;
    color: #ff0000;
    font-size: 10px;
  }

  .switchBtn1 {
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
  }

  .switchBtn2 {
    position: absolute;
    top: 5px;
    left: 5px;
    cursor: pointer;
  }

  .tools {
    margin-left: 80px;
    z-index: 901;
    width: auto;
    top: 5px;
    text-align: center;
    position: absolute;
    top: 1px;
    opacity: 0.6;
    filter: alpha(Opacity=60);
    -moz-opacity: 0.6;
  }

  .cameracmd {
    z-index: 901;
    width: auto;
    bottom: 5px;
    margin-left: 30px;
    position: absolute;
    opacity: 0.4;
    filter: alpha(Opacity=40);
    -moz-opacity: 0.4;
  }

  .hivestatus {
    z-index: 905;
    width: auto;
    bottom: 5px;
    margin-left: 30%;
    position: absolute;
    opacity: 0.95;
    color: rgb(10, 157, 255);
    filter: alpha(Opacity=95);
    -moz-opacity: 0.95;
  }
}

.divLeftBottom {
  z-index: 900;
  border-radius: 0 10px 0px 0px; // 左上角、右上角、右下角、左下角
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 300px;
  height: 220px;
  background-color: rgb(0, 0, 0);
  opacity: 0.95;
  filter: alpha(Opacity=95);
  -moz-opacity: 0.95;

  .video {
    position: absolute;
    margin: 2px;
    top: 1px;
    left: 1px;
    right: 1px;
    bottom: 1px;
    background-color: rgb(49, 49, 49);
  }

  .switchBtn1 {
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
  }

  .switchBtn2 {
    position: absolute;
    top: 5px;
    left: 5px;
    cursor: pointer;
  }

  .tools {
    z-index: 901;
    width: 90%;
    top: 5px;
    text-align: center;
    position: absolute;
    top: 1px;
    opacity: 0.6;
    filter: alpha(Opacity=60);
    -moz-opacity: 0.6;
  }

  .cameracmd {
    z-index: 901;
    width: 90%;
    bottom: 5px;
    margin-left: 5%;
    position: absolute;
    opacity: 0.6;
    filter: alpha(Opacity=60);
    -moz-opacity: 0.6;
  }

  .hivestatus {
    z-index: 905;
    width: auto;
    bottom: 5px;
    margin-left: 30%;
    position: absolute;
    opacity: 0.95;
    color: rgb(10, 157, 255);
    filter: alpha(Opacity=95);
    -moz-opacity: 0.95;
  }
}

.divRightBottom {
  z-index: 900;
  border-radius: 10px 0px 0px 0px; // 左上角、右上角、右下角、左下角
  position: absolute;
  bottom: 0px;
  right: 0px;
  width: 300px;
  height: 220px;
  background-color: rgb(0, 0, 0);
  opacity: 0.95;
  filter: alpha(Opacity=95);
  -moz-opacity: 0.95;

  .video {
    position: absolute;
    margin: 2px;
    top: 1px;
    left: 1px;
    right: 1px;
    bottom: 1px;
    background-color: rgb(49, 49, 49);
  }

  .switchBtn1 {
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
  }

  .switchBtn2 {
    position: absolute;
    top: 5px;
    left: 5px;
    cursor: pointer;
  }

  .tools {
    z-index: 901;
    width: auto;
    top: 5px;
    right: 5px;
    position: absolute;
    top: 1px;
    opacity: 0.6;
    filter: alpha(Opacity=60);
    -moz-opacity: 0.6;
  }

  .cameracmd {
    z-index: 901;
    width: 90%;
    bottom: 5px;
    margin-left: 5%;
    position: absolute;
    opacity: 0.6;
    filter: alpha(Opacity=60);
    -moz-opacity: 0.6;
  }

  .hivestatus {
    z-index: 905;
    width: auto;
    bottom: 5px;
    margin-left: 30%;
    position: absolute;
    opacity: 0.95;
    color: rgb(10, 157, 255);
    filter: alpha(Opacity=95);
    -moz-opacity: 0.95;
  }
}

.divStatus {
  position: absolute;
  top: 50%;
  z-index: 3000;
}

.biggerView {
  position: absolute;
  background-color: rgb(82, 80, 80);
  border-radius: 0 20px 0px 0px; // 左上角、右上角、右下角、左下角
  width: 100%;
  height: 100%;

  .video {
    position: absolute;
    width: 100%;
    height: 100%;
    margin: 2px;
    top: 1px;
    left: 1px;
    right: 1px;
    bottom: 1px;
    background-color: rgb(49, 49, 49);
  }

  .switchBtn1 {
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
  }

  .switchBtn2 {
    position: absolute;
    top: 5px;
    left: 5px;
    cursor: pointer;
  }

  .tools {
    z-index: 901;
    width: 90%;
    top: 5px;
    text-align: center;
    position: absolute;
    top: 1px;
    opacity: 0.6;
    filter: alpha(Opacity=60);
    -moz-opacity: 0.6;
  }

  .cameracmd {
    z-index: 901;
    width: 90%;
    bottom: 5px;
    margin-left: 45%;
    position: absolute;
    opacity: 0.6;
    filter: alpha(Opacity=60);
    -moz-opacity: 0.6;
  }

  .hivestatus {
    z-index: 905;
    width: auto;
    bottom: 5px;
    margin-left: 30%;
    position: absolute;
    opacity: 0.95;
    color: rgb(10, 157, 255);
    filter: alpha(Opacity=95);
    -moz-opacity: 0.95;
  }
}

.main2 {
  &-container {
    position: absolute;
    margin: 30px;
    width: 100%;
    height: 100%;
    background-color: red;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.divTopMiddle {
  position: absolute;
  width: auto;
  margin-top: 5px;
  top: 5px;
  // left: 50%;
  // margin-left: -250px;
  height: auto;
}

.divTopRightTool {
  position: absolute;
  top: 0px;
  right: 0px;
  width: auto;
  height: auto;
}

.divBottomLeftTool {
  position: absolute;
  left: 10px;
  bottom: 25px;
  width: auto;
  height: auto;
  opacity: 0.8;
  filter: alpha(Opacity=80);
  -moz-opacity: 0.8;
  z-index: 50;
}

.divBottomRightToolRemote {
  position: absolute;
  right: 35px;
  bottom: 5px;
  width: auto;
  height: auto;
  opacity: 0.8;
  filter: alpha(Opacity=80);
  -moz-opacity: 0.8;
}

.divBottomRightTool {
  position: absolute;
  right: 0px;
  bottom: 0px;
  width: auto;
  height: auto;
  opacity: 0.5;
  filter: alpha(Opacity=50);
  -moz-opacity: 0.5;
}

.sideUavMini {
  position: absolute;
  top: 0px;
  left: 0px;
  width: auto;
  height: auto;
}

.divCommandButton {
  position: absolute;
  // background: black;
  opacity: 0.8;
  filter: alpha(Opacity=80);
  -moz-opacity: 0.8;
  top: 30%;
  left: 5px;
  width: auto;
  height: auto;
  border: 5px rgb(0, 0, 0);
  border-radius: 10 10px 10px 10px; // 左上角、右上角、右下角、左下角
  padding: 10px;

  .el-row {
    margin-top: 5px;

    .el-button {
      width: 100%;
    }
  }
}

.divUavControl {
  position: absolute;
  background: rgb(201, 201, 201);
  opacity: 0.8;
  filter: alpha(Opacity=80);
  -moz-opacity: 0.8;
  bottom: 0px;
  width: 500px;
  height: auto;
  border: 5px rgb(0, 0, 0);
  border-radius: 10px 10px 0px 0px; // 左上角、右上角、右下角、左下角
  padding: 10px;
  display: flex;
  /* 弹性布局 */
  justify-content: space-between;
  /* 横向中间自动空间 */
}

.uavParm {
  position: absolute;
  // overflow-y: auto;
  border: 5px rgb(231, 231, 231);
  overflow-x: hidden;
  top: 0px;
  left: 10px;
  right: 10px;
  height: auto;
  opacity: 0.9;

  // border-radius: 15px; // 圆角
  .el-scrollbar {
    height: 100%;
  }

  .el-scrollbar__bar {
    &.is-vertical {
      width: 100px; //滚动条宽度
    }
  }

  .el-scrollbar__wrap {
    overflow-y: auto;
    overflow-x: hidden;
  }

  .el-scrollbar__thumb {
    background: red;
  }

  .parmitem {
    border-radius: 10px;
    background: rgb(218, 211, 211);
    padding: 5px;
    margin: 5px;
    opacity: 0.65;
    color: rgb(0, 0, 0);
    font-size: 14px;

    .value {
      color: rgb(2, 133, 255);
      font-style: bold;
    }

    .parmname {
      color: rgb(0, 0, 0);
    }

    .unit {
      color: rgb(0, 0, 0);
    }
  }
}

.sideLeft {
  position: absolute;
  border: 0px solid rgb(235, 232, 232);
  overflow-x: hidden;
  flex-direction: row;
  z-index: 1000;
  top: 0px;
  left: 0px;
  bottom: 0px;
  width: auto;
  height: auto;
  display: flex;
  background-color: rgb(255, 255, 255);
}

.sideLeftGridBtn {
  // overflow-y: auto;
  position: absolute;
  top: 5px;
  left: 5px;
  z-index: 150;
}

.sideLeftGridParm {
  // overflow-y: auto;
  position: absolute;
  border: 2px solid rgb(235, 232, 232);
  overflow-x: hidden;
  z-index: 1000;
  padding: 5px;
  top: 50px;
  left: 5px;
  width: 200px;
  height: auto;
  border-radius: 10px;
  background: rgb(250, 250, 250);

  .value {
    font-size: 13px;
    color: rgb(0, 0, 0);
  }
}

.sideLeftUav {
  flex: 1;
  // overflow-y: auto;
  border: 2px solid rgb(235, 232, 232);
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  top: 0px;
  left: 0px;
  bottom: 0px;
  width: 300px;
  height: auto;
  background-color: rgb(255, 255, 255);

  // opacity: 0.9;
  // border-radius: 15px; // 圆角
  .el-scrollbar {
    height: 100%;
  }

  .el-scrollbar__bar {
    &.is-vertical {
      width: 100px; //滚动条宽度
    }
  }

  .el-scrollbar__wrap {
    overflow-y: auto;
    overflow-x: hidden;
  }

  .el-scrollbar__thumb {
    background: red;
  }

  .top {
    padding: 5px 1px 5px 35px; // 上右下左
    background: rgb(250, 250, 250);
    font-size: 13px;
    color: rgb(0, 0, 0);
    border: 2px solid rgb(235, 232, 232);

    .el-col {
      font-style: bold;
    }

    .value {
      color: rgb(9, 72, 124);
    }
  }

  .bottom {
    background: rgb(250, 250, 250);
    padding: 5px;
    border: 2px solid rgb(235, 232, 232);
  }
}

.sideUavHeader {
  width: 100%;
  background: #dfe2df;
  opacity: 0.5;
  padding: 5px;
  text-align: right;
  padding-right: 10px;
  cursor: pointer;
}

.img-box {
  overflow-y: auto;

  ul {
    flex-wrap: wrap;
    justify-content: start;

    li {
      padding: 20px 2.5%;

      .el-card {
        position: relative;
        transition: all 1s;

        .sel-box-bg {
          display: inline-block;
          width: 0;
          height: 0;
          border-top: 35px solid #67c23a;
          border-left: 35px solid transparent;
          position: absolute;
          right: 0;
          z-index: 10;
          top: 0;
        }

        .sel-box-icon {
          display: inline-block;
          position: absolute;
          top: 3px;
          right: 3px;
          z-index: 11;
          color: white;
          font-size: 15px;
        }
      }
    }

    li:hover .el-card {
      box-shadow: 0px 5px 25px 5px rgba(0, 0, 0, 0.1);
      transition: all 1s;
    }

    li:hover .el-card {
      box-shadow: 0px 5px 25px 5px rgba(0, 0, 0, 0.1);
      transition: all 1s;
    }
  }
}

.cardBg {
  position: relative;
  margin: 10px;
  height: 60px;
  padding: 5px;
  opacity: 0.95;
  border: 2px solid rgb(199, 221, 165);
  border-radius: 5px;
  cursor: pointer;
  padding: 2px;
  outline-offset: -1px;
  transition: all 0.3s linear;
  font-size: 12px;

  &:hover {
    background: rgb(181, 211, 233);
  }

  // &:hover {
  //   background: linear-gradient(90deg, #67c23a 50%, transparent 0) repeat-x,
  //     linear-gradient(90deg, #67c23a 50%, transparent 0) repeat-x,
  //     linear-gradient(0deg, #67c23a 50%, transparent 0) repeat-y,
  //     linear-gradient(0deg, #67c23a 50%, transparent 0) repeat-y;
  //   // background: #67c23a 50%;
  //   background-size: 4px 1px, 4px 1px, 1px 4px, 1px 4px;
  //   background-position: 0 0, 0 100%, 0 0, 100% 0;
  //   animation: linearGradientMove 0.3s infinite linear;
  // }
}

.cardBgSelected {
  position: relative;
  margin: 10px;
  height: 60px;
  padding: 5px;
  opacity: 0.99;
  border: 2px solid rgb(0, 140, 255);
  border-radius: 5px;
  cursor: pointer;
  padding: 2px;
  outline-offset: -1px;
  transition: all 0.3s linear;
  font-size: 12px;

  &:hover {
    background: rgb(181, 211, 233);
  }
}

.cardBg_task {
  position: relative;
  margin: 10px;
  height: 130px;
  padding: 5px;
  opacity: 0.95;
  border: 2px solid rgb(199, 221, 165);
  border-radius: 5px;
  cursor: pointer;
  padding: 2px;
  outline-offset: -1px;
  transition: all 0.3s linear;
  font-size: 12px;

  &:hover {
    background: rgb(181, 211, 233);
  }
}

.cardBgSelected_task {
  position: relative;
  margin: 10px;
  height: 130px;
  padding: 5px;
  opacity: 0.99;
  border: 2px solid rgb(0, 140, 255);
  border-radius: 5px;
  cursor: pointer;
  padding: 2px;
  outline-offset: -1px;
  transition: all 0.3s linear;
  font-size: 12px;

  &:hover {
    background: rgb(181, 211, 233);
  }
}

.cardBgWps {
  position: relative;
  margin: 10px;
  height: 80px;
  padding: 5px;
  opacity: 0.95;
  border: 2px solid rgb(199, 221, 165);
  border-radius: 5px;
  cursor: pointer;
  padding: 2px;
  outline-offset: -1px;
  transition: all 0.3s linear;
  font-size: 12px;

  &:hover {
    background: #deffce;
  }
}

.cardBgWpsSelected {
  position: relative;
  margin: 10px;
  height: 80px;
  padding: 5px;
  opacity: 0.99;
  border: 2px solid rgb(0, 140, 255);
  border-radius: 5px;
  cursor: pointer;
  padding: 2px;
  outline-offset: -1px;
  transition: all 0.3s linear;
  font-size: 12px;

  &:hover {
    background: rgb(181, 211, 233);
  }
}

.cardLeft {
  height: 300px;
  width: auto;
  margin: 5px;
  float: left;
  text-align: center;
  line-height: 60px;
}

.cardMiddle {
  // background:red;
  // height: 300px;
  // margin: 0 50px;
  padding: 10px 0;
  display: flex;
  // /*实现垂直居中*/
  align-items: center;
  // /*实现水平居中*/
  // justify-content: center;
  text-align: justify;
  height: auto;
  margin: 0 30px;
  color: red($color: #000000);
}

.cardRight {
  height: 300px;
  width: auto;
  float: right;
}

.cardLeftWps {
  height: 400px;
  width: auto;
  margin: 5px;
  float: left;
  text-align: center;
}

.cardMiddleWps {
  // background:red;
  // height: 300px;
  // margin: 0 50px;
  padding: 0px 0;
  display: flex;
  // /*实现垂直居中*/
  align-items: center;
  // /*实现水平居中*/
  // justify-content: center;
  text-align: justify;
  height: auto;
  margin: 0 30px;
  color: red($color: #000000);
}

.cardRightWps {
  height: 400px;
  width: auto;
  float: right;
}

.sel-file {
  border: 2px solid #67c23a !important;
}

.uavIco {
  height: 100%;
  text-align: center;
}
</style>