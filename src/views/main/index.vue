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
                            <dv-decoration-7 style="width:auto;height:30px;">{{'智能无人机杆塔巡线平台' }}</dv-decoration-7>
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
                                <i class="el-icon-picture"></i>
                            </div>
                        </el-image>
                        <!-- <dv-decoration-8 :reverse="true" style="width:100%;height:40px;" /> -->
                        <div style="height:50%;text-align:right;" @mouseover="isHeaderMouse = true" @mouseout="isHeaderMouse = false">
                            <router-link to="/sysmanage" style="color:#3de7c9;margin-right:15px;font-size:12px"><i class="el-icon-s-home" />
                                进入平台</router-link>
                            <el-button type="text" @click="logout" style="color:#3de7c9;font-size:12px;margin-right:15px;"><i class="el-icon-switch-button"></i>
                                退出系统</el-button>
                        </div>
                        <span v-show="whoIsTaking != null" style="text-align:right;margin-top:5px;margin-right:15px;color:#3de7c9;font-size:10px">{{ whoIsTaking}}</span>
                    </div>
                </div>
                <div class="main" v-loading="loading" element-loading-text="拼命加载中" element-loading-background="rgba(0, 0, 0, 0.8)">
                    <!-- <dv-loading style="fullscreencontainerLoding">Loading...</dv-loading> -->
                    <div ref="mainleft" class="mainleft">
                        <!-- 总数与当前变电站 -->
                        <dv-border-box-7 class="main_left_uav_count">
                            <div class="main_left_uav_count_body" @click="clickSncount">
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
                                            <div v-if="this.defaultUavSn === null || this.defaultUavSn == ''" class="no_uav"><i class="el-icon-warning-outline">未选中</i></div>
                                            <div class="haveSn">{{ this.defaultUavSn }}</div>
                                            <!--  @click="senddoFlyCommandsEvent(1007)" -->
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </dv-border-box-7>
                        <div class="main_right_parms_title" @click="senddoFlyCommandsEvent(1006)">无人机</div>
                        <dv-border-box-7 class="main_left_uav">
                            <div class="main_left_uav_body">
                                <div class="uav-list" v-if="uavs.length>0">
                                    <label class="label-text">巡检无人机</label>
                                    <el-scrollbar style="width:98%" wrap-style="overflow-x:hidden;flex:1">
                                        <el-row v-for="(item,index) in inspectionUavs" :key="index" :gutter="1" justify="flex" align="middle" style="margin:8px">
                                            <uavItem ref="uavItems" :uavName="item.uavName" :uavSn="item.uavId" :online="item.online" @dblclick.native="cameraSettingVisible = !cameraSettingVisible" @click.native="clickUavItem(item)" />
                                        </el-row>
                                    </el-scrollbar>
                                    <label class="label-text">播种无人机</label>
                                    <el-scrollbar style="width:98%" wrap-style="overflow-x:hidden;flex:1">
                                        <el-row v-for="(item,index) in seedingUavs" :key="index" :gutter="1" justify="flex" align="middle" style="margin:8px">
                                            <uavItem ref="uavItems" :uavName="item.uavName" :uavSn="item.uavId" :online="item.online" @dblclick.native="cameraSettingVisible = !cameraSettingVisible" @click.native="clickUavItem(item)" />
                                        </el-row>
                                    </el-scrollbar>

                                </div>
                                <div v-else class="no_uav"><i class="el-icon-warning-outline">未绑定无人机</i></div>
                            </div>
                        </dv-border-box-7>
                        <div class="main_right_parms_title" @click="createWebWorker()">航线任务</div>
                        <dv-border-box-7 class="main_left_exception">
                            <!-- tasksRoutes -->
                            <!-- <div class="routes">
                        <div class="route_item"  v-for="(item,index) in tasksRoutes" :key="index">
                                <span>{{time(item.kmzUpdateTime)}}</span>
                                <span>{{item.kmzName}}</span>
                            </div>
                     </div> -->
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
                                            <i style="margin:0px 5px; float: right;" title="上传无人机" class="iconfont icon-icon_update cursorStyle" :class="{ disabled: maploading }" @click="maploading ? null : uploadKmzBefore()"></i>

                                            <i style="margin:0px 5px; float: right;" title="解析航线" class="iconfont  icon-hangxianxinxi cursorStyle" :class="{ disabled: maploading }" @click="maploading ? null :readerKml()"></i>
                                        </el-col>

                                    </el-row>
                                </div>
                                <el-scrollbar v-if="!tasksLoading" class="scrollbar" style="width:98%;" wrap-style="overflow-x:hidden;flex:1;font-size:small;">
                                    <div :class="'route_item plusInborder cursorStyle' + (currentIndex === index ? ' showplusInborder' : '')" @click="changeColor(index,item)" v-for="(item,index) in tasksRoutes.slice((currentPage-1)*pagesize,currentPage*pagesize)" :key="index">
                                        <span>{{time(item.kmzUpdateTime)}}</span>
                                        <span>{{item.kmzName}}</span>
                                    </div>

                                </el-scrollbar>
                                <div class="scrollbar" v-else v-loading="tasksLoading" element-loading-text="正在加载中" element-loading-background="rgba(15, 15, 15, 0.3)"></div>
                                <div class="pageNaN">
                                    <el-pagination class="pagination" layout="prev, pager, next" @current-change="current_change" :pager-count="5" :current-page.sync="currentPage" :total="tasksRoutes.length" :page-size="pagesize">
                                    </el-pagination>
                                    <!-- <scrollbar :total="tasksRoutes.length" :pagesize="pagesize" :currentpagesync="currentPage"></scrollbar> -->
                                </div>
                            </div>

                        </dv-border-box-7>
                        <!-- v-Focus:color="'yellow'" -->
                        <div ref="opp" class="main_right_parms_title" @click="reElement">巡检视频</div>
                        <!-- <button v-copy="copyText">复制</button> -->
                        <dv-border-box-7 class="main_left_total">
                            <VideoModule ref="VideoModule" id="VideoModule" @send:switchMapOrVideo="switchMapOrVideo" :defaultUavInfo="defaultUavInfo"></VideoModule>
                            <!-- <CesiumMap ref="CesiumMap" :visible="CesiumDrawVisible" :tasksRoutes="tasksRoutes" :defaultUavSn="defaultUavSn" @senddoFlyCommands='senddoFlyCommandsEvent'></CesiumMap> -->

                            <!-- <div class="statistics">
                                <!== 统计上盒子 ==>
                                <div class="statistics-top-box">
                                    <el-row>
                                        <el-col :span="3">
                                            <div :class="{ active: isActive == '1' }" @click="SelectTime(1)">总</div>
                                        </el-col>
                                        <el-col :span="4">
                                            <div :class="{ active: isActive == '2' }" @click="SelectTime(2)">本周</div>
                                        </el-col>
                                        <el-col :span="16">
                                            <div :class="{ active: isActive == '3' }" @click="SelectTime(3)">本月</div>
                                        </el-col>
                                    </el-row>
                                </div>
                                <!== 统计下盒子 ==>
                                <div class="statistics-bottom-box" v-loading="statisticsloading" element-loading-text="拼命加载中" element-loading-background="rgba(21, 21,21, 1)">
                                    <div>
                                        <div class="post" id="EChartPie" style="width: 120px; height: 120px;"></div>
                                    </div>
                                    <div class="scroll-box" style="width:100%">

                                        <div v-for="(item, index) in this.barChartInfo" :key="index" style="font-size:13px;width: 100%;height:40px;display:flex;flex-direction: column;justify-content: center;padding-right: 10px;">
                                            <div class="ranking-info">
                                                <div>{{ item.key }}</div>
                                                <div class="itemright">{{ item.value }}</div>
                                            </div>
                                            <div class="ranking-column">
                                                <div class="inside-column"></div>
                                            </div>
                                        </div>
                                        <!== <dv-scroll-ranking-board :config="configss" style="width:210px;height:120px;padding-right: 10px;" /> ==>
                                    </div>
                                </div>
                            </div> -->
                        </dv-border-box-7>
                    </div>
                    <!-- rgba(0, 0, 0, ${this.newOpacity}) -->
                    <div v-loading="maploading" element-loading-spinner="el-icon-loading" :element-loading-text=loadingText :element-loading-background="this.loadingBackground" ref="mainMiddle" class="mainMiddle height-calc zindex include_cesium_blocks" :style="{ height: divHeight + 'px' }">
                        <!-- <pvmap ref="videoViews" @send="acpectsend" :divHeight="divHeight" :uavSn="defaultUavSn" :selectSn="selectSn" :uavs="uavs" :mapUrl="mapUrl" style="width:100%; height:100%">
                        </pvmap>  -->
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
                        <CesiumMap ref="CesiumMap" :visible="CesiumDrawVisible" :maploading="maploading" :tasksRoutes="tasksRoutes" :tasksName="tasksName" :defaultUavSn="defaultUavSn" @senddoFlyCommands='senddoFlyCommandsEvent'></CesiumMap>
                        <div class="drawButton" v-show="isMap">
                            <i class="el-icon-edit clickstyle" :title="'绘制'" @click="CesiumDrawVisible=!CesiumDrawVisible"></i>
                        </div>
                        <div class="icon-list" v-show="isMap">
                            <!-- <el-button title="起飞-1100" icon="el-icon-s-promotion" circle size="mini" @click="takeoff(1100)"></el-button> -->
                            <el-popconfirm confirm-button-text='确定' cancel-button-text='取消' icon="el-icon-info" icon-color="red" @confirm="takeoff(1100)" title="确认起飞？">
                                <el-button slot="reference" title="起飞-1100" icon="el-icon-s-promotion" circle size="mini"></el-button>
                            </el-popconfirm>
                            <el-popconfirm confirm-button-text='确定' cancel-button-text='取消' icon="el-icon-info" icon-color="red" @confirm="land(1103)" title="确认降落？">
                                <el-button slot="reference" title="降落-1103" icon="el-icon-place" circle size="mini"></el-button>
                            </el-popconfirm>

                            <div class="not_commonly_used-icon">
                                <el-button icon="el-icon-caret-top" circle size="mini" class="top-icon"></el-button>
                                <el-popconfirm confirm-button-text='确定' cancel-button-text='取消' icon="el-icon-info" icon-color="red" @confirm="rtl(1102)" title="确认返航？">
                                    <el-button slot="reference" title="返航-1102" icon="el-icon-location-information" circle size="mini" class="custom-button"></el-button>
                                </el-popconfirm>

                                <el-button title="执行任务" icon="el-icon-wind-power" circle size="mini" class="custom-button" @click="startMission(1006)"></el-button>
                                <!-- 悬停1104  -->
                                <el-button title="暂停-1142" icon="el-icon-alarm-clock" circle size="mini" class="custom-button" @click="pauseMission(1142)"></el-button>
                                <el-button title="停止=1144" icon="el-icon-timer" circle size="mini" class="custom-button" @click="stopMission(1144)"></el-button>
                                <el-button title="恢复-1143" icon="el-icon-time" circle size="mini" class="custom-button" @click="resumeMission(1143)"></el-button>
                            </div>

                            <!-- <div class="commonly_used-icon">
                                <el-button title="起飞" icon="el-icon-s-promotion" circle size="mini"></el-button>
                                <el-button title="降落" icon="el-icon-place" circle size="mini"></el-button>
                                <el-button  icon="el-icon-caret-top" circle size="mini" class="top-icon"></el-button>
                            </div>
                            <div class="not_commonly_used-icon">
                                <el-button title="返航" icon="el-icon-location-information" circle size="mini"></el-button>
                                <el-button title="暂停" icon="el-icon-wind-power" circle size="mini"></el-button>
                                <el-button title="停止--悬停" icon="el-icon-timer" circle size="mini"></el-button>
                                <el-button title="恢复" icon="el-icon-time" circle size="mini"></el-button>
                            </div> -->
                        </div>

                    </div>
                    <div class="mainRight" v-if="this.createARouteOrNot">
                        <dv-border-box-7 class="main_right_hud">
                            <el-row style="height:100%;">
                                <el-col :span="24" align="middle" style="height:100%">
                                    <Attitude :size="200" :showbox="true" :pitch="defaultUavHeartbeat.pitch" :roll="defaultUavHeartbeat.roll" />
                                </el-col>
                            </el-row>
                        </dv-border-box-7>
                        <div class="main_right_parms_title">无人机参数</div>
                        <!-- uavHeartbeatNow -->
                        <dv-border-box-7 class="main_right_parms">
                            <div class="main_right_parms_body" :key="key_div_uav_parm">
                                <parmItem class="parmItem" parmImage="parm_mode" parmName="模式" :parmValue="defaultUavHeartbeat && defaultUavHeartbeat.flightModeText !== undefined && defaultUavHeartbeat.flightModeText !== null ? checkIsNaN(defaultUavHeartbeat.flightModeText)  : '-' " />
                                <!-- checkIsNaN(defaultUavHeartbeat.flightModeText) 4 指点  9 降落模型  6 返航 5 起飞 16 位置锁定  2 定高  -->
                                <parmItem v-if="defaultUavHeartbeat.flightTimeInSeconds ==0 ? false : true" class="parmItem" parmImage="parm_time" parmName="飞行时间" :parmValue="defaultUavHeartbeat && defaultUavHeartbeat.flightTimeInSeconds !== undefined && defaultUavHeartbeat.flightTimeInSeconds !== null ? convertSecondToTime(defaultUavHeartbeat.flightTimeInSeconds) : '-'" />
                                <parmItem v-else class="parmItem" parmImage="parm_time" parmName="GPS" :parmValue="defaultUavHeartbeat && defaultUavHeartbeat.gpsStatusText !== undefined && defaultUavHeartbeat.gpsStatusText !== null ? defaultUavHeartbeat.gpsStatusText : '-'" />
                                <parmItem class="parmItem" parmImage="parm_uplink" parmName="上行信号" :parmValue="defaultUavHeartbeat.linkAirUpload" parmUnit="%" :warnMinValue="60" />
                                <parmItem class="parmItem" parmImage="parm_downlink" parmName="下行信号" :parmValue="defaultUavHeartbeat.linkAirDownload" parmUnit="%" :warnMinValue="60" />
                                <parmItem class="parmItem" parmImage="parm_alt" parmName="对地高度" :parmValue="defaultUavHeartbeat.alt" parmUnit="米" :warnMinValue="0" />
                                <parmItem class="parmItem" parmImage="parm_altabs" parmName="海拔高" :parmValue="defaultUavHeartbeat.altabs" parmUnit="米" :warnMinValue="0" />
                                <parmItem class="parmItem" parmImage="parm_yaw" parmName="朝向" :parmValue="defaultUavHeartbeat &&defaultUavHeartbeat.yaw ?  toFixed(defaultUavHeartbeat.yaw,2) : '-' " parmUnit="°" />
                                <parmItem v-if="defaultUavHeartbeat.batteryPert==0 ? false :true" class="parmItem" parmImage="parm_batt" parmName="无人机电量" :parmValue="defaultUavHeartbeat.batteryPert" parmUnit="%" :warnMinValue="50" />
                                <parmItem v-else class="parmItem" parmImage="parm_batt" parmName="电压" :parmValue="defaultUavHeartbeat.batteryValue" parmUnit="V" :warnMinValue="50" />
                            </div>
                        </dv-border-box-7>
                        <div class="main_right_gps_title">定位</div>
                        <dv-border-box-7 class="main_right_gps" :key="key_div_gps_parm">
                            <div class="main_right_gps_body">
                                <parmItem class="parmItem" parmImage="parm_gps" parmName="定位状态" :parmValue="defaultUavHeartbeat.gpsStatusText" />
                                <parmItem class="parmItem" parmImage="parm_sate" parmName="卫星颗数" :parmValue="defaultUavHeartbeat.satecount" parmUnit="颗" :warnMinValue="10" />
                                <parmItem class="parmItem" parmImage="tools" parmName="精度" parmValue="-" parmUnit="米" :warnMinValue="2" />
                                <parmItem class="parmItem" parmImage="parm_altabs" parmName="海拔" :parmValue="defaultUavHeartbeat.altabs" parmUnit="米" :warnMinValue="0" />
                                <parmItem class="parmItem" parmImage="parm_latlng" parmName="经度" :parmValue="defaultUavHeartbeat.lng" parmUnit="°" />
                                <parmItem class="parmItem" parmImage="parm_latlng" parmName="纬度" :parmValue="defaultUavHeartbeat.lat" parmUnit="°" />
                            </div>
                        </dv-border-box-7>
                    </div>
                    <div v-else class="mainRight">

                    </div>
                </div>
                <div class="foot">
                    <!-- <dv-decoration-4 :reverse="true" style="width:100%;height:50px;" /> -->
                    <!-- <dv-decoration-8 style="width:50%;height:50px;" /> -->
                    <!-- <dv-decoration-8 :reverse="true" style="width:50%;height:50px;" /> -->
                </div>
            </div>
        </dv-border-box-12>
        <!-- 相机设置弹窗 -->
        <el-dialog :visible.sync="cameraSettingVisible" class="cameraDialog" width="345px">
            <template slot="title">
                测绘参数设置
            </template>
            <!-- 组件相机设置 -->
            <cameraSettingsPopup ref="cameraSettingsPopup" :uavs="uavs" :defaultUavSn="defaultUavSn" class="cameraSettingsPop-up-out"></cameraSettingsPopup>
        </el-dialog>

        <el-dialog :visible.sync="uploadUavVisible" :before-close="handleCancelClick" class="cameraDialog" width="345px">
            <template slot="title">
                续点提示
            </template>
            <el-radio-group v-model="kmzCurrentIndex">
                <el-radio :label="0">{{`从头上传`}}</el-radio>
                <el-radio :disabled="!currentTask.kmzCurrentWpNo" :label="currentTask.kmzCurrentWpNo">{{`从续点${currentTask.kmzCurrentWpNo}开始上传`}}</el-radio>
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
