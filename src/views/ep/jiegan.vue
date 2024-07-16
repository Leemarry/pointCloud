<template>
  <el-container>
    <!-- 工具条 -->
    <el-header class="toolbar">
      <el-select size="mini" v-model="deviceid" placeholder="未选择无人机" v-loading="loadingUavs">
        <el-option v-for="item in uavIdOption" :key="item.uavId" :label="item.uavName" :value="item.uavId">
          <span style="float: left;margin-right:10px;">{{ item.uavName }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.uavId }}</span>
        </el-option>
      </el-select>
      <el-date-picker size="mini" style="margin-left:10px" v-model="timeSelectRange" format="yyyy年MM月dd日" type="daterange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
      </el-date-picker>

      <el-button-group size="mini" style="margin-left:10px" v-loading="loading">
        <el-button size="mini" type="" icon="el-icon-search" @click="queryData()">查询
        </el-button>
        <!-- <el-button round size="mini" type="" @click.native="deleteMore()">
          <svg-icon icon-class="delete" /> 删除选中
        </el-button> -->
        <el-button size="mini" type="" @click.native="dialogExport=true">
          <svg-icon icon-class="download" /> 按天导出报告
        </el-button>
        <el-checkbox v-model="autoSelectChecked" border size="small" style="margin-left:10px" @change="handleCheckChange">自动刷新数据</el-checkbox>
      </el-button-group>
      <!-- <el-button round size="mini" style="margin-left:10px" type="" icon="el-icon-search" @click="queryData()" v-loading="loading">查询
      </el-button>
      <el-checkbox v-model="autoSelectChecked" border size="small" style="margin-left:10px" @change="handleCheckChange">自动刷新数据</el-checkbox> -->
    </el-header>

    <!-- 主体表格 -->
    <el-main>
      <el-scrollbar style="height:100%">
        <el-table ref="filterTable" v-loading="loading" :data="data" border style="width: 100%" :cell-style="tableCellStyle" @row-click="rowClick" @cell-mouse-enter="cellMouseEnter" @cell-mouse-leave="cellMouseLeave">
          <el-table-column type="selection" width="50" />
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="无人机">
                  <span>{{ props.row.deviceid }}</span>
                </el-form-item>
                <el-form-item label="名称">
                  <span>{{ props.row.imageTag }}</span>
                </el-form-item>
                <el-form-item label="飞行高度">
                  <span>{{ props.row.alt }} 米</span>
                </el-form-item>
                <el-form-item label="海拔高度">
                  <span>{{ props.row.altabs }} 米</span>
                </el-form-item>
                <el-form-item label="云台横滚角度">
                  <span>{{ props.row.gimbalRoll }} 度</span>
                </el-form-item>
                <el-form-item label="云台俯仰角度">
                  <span>{{ props.row.gimbalPitch }} 度</span>
                </el-form-item>
                <el-form-item label="云台偏航角度">
                  <span>{{ props.row.gimbalYaw }} 度</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <!-- <el-table-column type="index" width="50" /> -->
          <el-table-column label="拍摄时间" width="200">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="名称">
            <template slot-scope="scope">
              <span>{{ getShowValue(scope.row.nickname) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" width="90" :filters="[{text: '黑斑', value: 2}, {text: '火点', value: 1}]" :filter-method="filterExceptionTypeHandler" filter-placement="bottom-end">
            <template slot-scope="props">
              <el-tag style="cursor:pointer" v-if="props.row.exceptionType==1" type="danger" size="mini" effect="dark" @click.native="updateExceType(props.row)">
                火点
              </el-tag>
              <el-tag style="cursor:pointer" v-else-if="props.row.exceptionType==2" type="info" size="mini" effect="dark" @click.native="updateExceType(props.row)">
                黑斑
              </el-tag>
              <el-tag style="cursor:pointer" v-else size="mini" @click.native="updateExceType(props.row)">
                普通
              </el-tag>
              <!-- <span v-if="props.row.exceptionType==1" style="color:red">
              </span>
              <span v-else-if="props.row.exceptionType==2" style="color:black">黑斑</span>
              <span v-else>普通</span> -->
            </template>
          </el-table-column>
          <el-table-column label="航拍影像" width="210">
            <template slot-scope="props">
              <el-image style="width:200px; height: 100px" :src="props.row.pathImage" :preview-src-list="props.row.pathImageList">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" style="font-size: 25px;" />
                </div>
              </el-image>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="province" label="巡逻面积" width="120" /> -->
          <el-table-column label="异常数量" width="100">
            <template slot-scope="scope">
              <span>{{ getShowValue(scope.row.blackspotNum,'-') }} 个</span>
              <el-button v-show="scope.row.isMouseEnter" icon="el-icon-edit" size="mini" style="float:right" @click="updateBlackSpotNum(scope.row)" round></el-button>
            </template>
          </el-table-column>
          <el-table-column label="异常面积" width="100">
            <template slot-scope="scope">
              <span>{{ getShowValue(scope.row.blackspotArea,'-')}} ㎡</span>
              <el-button v-show="scope.row.isMouseEnter" icon="el-icon-edit" size="mini" style="float:right" @click="updateBlackSpotArea(scope.row)" round></el-button>
            </template>
          </el-table-column>
          <el-table-column label="云台姿态" width="250" v-if="false">
            <template slot-scope="scope">
              <span>{{ getShowValue(scope.row.gimbalRoll) + " " + getShowValue(scope.row.gimbalPitch)  + " " + getShowValue(scope.row.gimbalYaw) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="纬度/经度/高度" width="250">
            <template slot-scope="scope">
              <span>{{ getShowValue(scope.row.lat) + " " + getShowValue(scope.row.lng)  + " " + getShowValue(scope.row.alt) }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="place" label="拍摄位置" /> -->
          <el-table-column label="地理位置">
            <template slot-scope="scope">
              <span>{{ scope.row.place}}</span>
              <el-button-group size="mini" style="float:right">
                <el-button v-show="scope.row.isMouseEnter" icon="el-icon-edit" size="mini" @click="updatePlace(scope.row)" round></el-button>
                <el-button v-show="scope.row.isMouseEnter" icon="el-icon-position" size="mini" @click="seePlace(scope.row)" round></el-button>
              </el-button-group>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <!-- <el-button type="text" style="color:black" @click="seeDetail(scope.row)" size="small">查看</el-button> -->
              <el-button type="text" style="color:" @click="deleteRow(scope.row)" size="small">删除</el-button>
              <el-button type="text" style="color:" @click="exportReport(scope.row)" size="small">导出报告</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </el-main>

    <el-drawer title="航拍数据" :visible.sync="drawerDetail" direction="rtl">
      <div class="drawer__content">
        <el-form :model="dataRow" label-position="left">
          <el-form-item label="拍摄时间" :label-width="formLabelWidth">
            <span>{{ parseTime(dataRow.createDate) }}</span>
          </el-form-item>
          <el-form-item label="拍摄坐标" :label-width="formLabelWidth">
            <span>{{ getShowValue(dataRow.lat) + " " + getShowValue(dataRow.lng)  + " " + getShowValue(dataRow.alt) }}</span>
          </el-form-item>
          <el-form-item label="拍摄位置" :label-width="formLabelWidth">
            <el-input v-model="dataRow.place"></el-input>
          </el-form-item>
          <el-form-item label="云台姿态" :label-width="formLabelWidth">
            <span>{{ getShowValue(dataRow.gimbalRoll) + " " + getShowValue(dataRow.gimbalPitch)  + " " + getShowValue(dataRow.gimbalYaw) }}</span>
          </el-form-item>
          <el-form-item label="黑斑数量" :label-width="formLabelWidth">
            <el-input-number v-model="dataRow.blackspotNum" :step="1" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="异常面积(㎡)" :label-width="formLabelWidth">
            <el-input-number v-model="dataRow.blackspotArea" :step="0.05" :precision="2" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="可见光影像" :label-width="formLabelWidth">
            <el-image :src="dataRow.pathImage +'?'+ Date.now()">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" style="font-size: 25px;" />
              </div>
            </el-image>
          </el-form-item>
          <el-form-item label="红外影像" :label-width="formLabelWidth">
            <el-image :src="dataRow.pathImage2 +'?'+ Date.now()">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" style="font-size: 25px;" />
              </div>
            </el-image>
          </el-form-item>
        </el-form>
        <div class="drawer__footer">
          <el-button @click="closeItemDetail()">取 消</el-button>
          <el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div>
    </el-drawer>

    <el-dialog title="面积测量" :visible.sync="dialogMapVisible" width="60%" @closed="closeImageOnMap">
      <div class="divMapMain">
        <div class="mapLeft">
          <el-form label-position="left" label-width="0px">
            <el-form-item>
              <el-input-number v-model="blackspotArea" :step="0.05" :precision="2" :min="0"></el-input-number>
              平方米
            </el-form-item>
            <el-form-item>
              <el-tooltip class="item" effect="light" :content="isMapArea?'点击结束测量':'点击开始面积测量'" placement="bottom">
                <el-button :type="isMapArea?'success':''" icon="el-icon-crop" size="mini" @click="enableArea()">面积测量</el-button>
              </el-tooltip>
              <el-button type="success" icon="el-icon-crop" size="mini" @click="saveBlackSpotArea()">保存面积</el-button>
            </el-form-item>
            <el-form-item>
            </el-form-item>
          </el-form>
        </div>
        <div class="mapRight">
          <el-amap vid="amap" :center="centerPosition" :zoom="zoom" :plugin="plugin" :events="mapEvents" :keyboardEnable="false" :mapStyle="mapStyle" style="width:100%;height:100%">
            <el-amap-ground-image v-for="item in groundimages" :opacity="0.9" :key="item.tag" :url="item.url" :bounds="item.bounds" :events="item.events" />
          </el-amap>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="航拍位置" :visible.sync="dialogMapPointVisible" width="60%">
      <div class="divMapMain">
        <el-amap vid="amap" :center="centerPosition" :zoom="zoom" :plugin="plugin" :events="mapEvents" :keyboardEnable="false" :mapStyle="mapStyle" style="width:100%;height:100%">
          <!-- 拍摄位置图标 -->
          <el-amap-marker :position="centerPosition" :offset="markerCenterOffset" :icon="imgCenter" class="selectedMarker" />
        </el-amap>
      </div>
    </el-dialog>

    <el-dialog title="照片类型" :visible.sync="dialogExceTypeVisible" width="250px">
      <el-radio-group v-model="exceptionTypeTemp" size="small" style="width:100%;text-align:center">
        <el-radio-button label="0">普通</el-radio-button>
        <el-radio-button label="1">火点</el-radio-button>
        <el-radio-button label="2">黑斑</el-radio-button>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" style="width:100%" @click="updatingExceType()">修 改</el-button>
      </span>
    </el-dialog>

    <el-dialog title="导出报告" :visible.sync="dialogExport" width="380px">
      <el-date-picker v-model="selectedDateDay" type="date" format="yyyy年MM月dd日" :picker-options="pickerOptionsDay" placeholder="选择日期">
      </el-date-picker>
      <el-button style="margin-left:20px" type="primary" plain @click="exportReportDay()" size="small">开始导出</el-button>
    </el-dialog>
  </el-container>

</template>

<script>
import axios from "axios";
import { mapGetters } from 'vuex'
import { parseTime, filtersType } from "@/utils/index";

export default {
  components: {},
  data() {
    const self = this
    return {
      tag: 1,
      timer: null,
      loadingUavs: false,
      loading: false,
      isMapArea: false, // 是否正在进行面积测量
      autoSelectChecked: false,
      dialogMapVisible: false,
      dialogMapPointVisible: false,
      dialogExceTypeVisible: false,
      dialogExport: false,
      drawerDetail: false,
      formLabelWidth: '150px',
      zipProgress: '下载中 [0/0] ...',
      blackspotArea: 0, // 正在编辑的异常面积
      exceptionTypeTemp: 0,
      statusMessage: '', // 用于显示从无人机同步媒体的进度

      // 地图
      imgCenter: require('@/assets/images/wpx64.png'),
      markerCenterOffset: [-32, -32],
      centerPosition: [114.474721, 30.457096], // 用户当前位置经纬度
      zoom: 16,
      mapStyle: 'normal', // 地图样式，支持normal（默认样式）、dark（深色样式）、light（浅色样式）、fresh(osm清新风格样式)四种
      mapTools: {},
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
          // this.mapClick(e)
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
      groundimages: [
        {
          id: '55',
          url: 'https://amappc.cn-hangzhou.oss-pub.aliyun-inc.com/lbs/static/img/dongwuyuan.jpg',
          bounds: [[114.4680762, 30.4571039], [114.4718528, 30.4596795]],  // 图片左下坐标，和图标右上坐标
          events: {
            click() {
              alert('click groundimage');
            }
          }
        }
      ],
      // 无人机编号
      deviceid: null,
      uavIdOption: [],

      // 媒体数据
      data: [],
      selectedRow: {},
      dataRow: {},

      // 时间选择器
      // time: [new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), new Date()],
      selectedDateDay: new Date(),
      selectedDate: null,
      timeSelectRange: [new Date(), new Date()],
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.selectedDate = minDate.getTime();
          this.selectedDateDay = minDate;
          if (maxDate) {
            this.selectedDate = null;
          }
        },
        disabledDate: time => {
          if (this.selectedDate && this.selectedDate != null) {
            const day1 = 7 * 24 * 3600 * 1000;
            const maxTime = this.selectedDate + day1;
            const minTime = this.selectedDate - day1;
            return time.getTime() > maxTime || time.getTime() < minTime;
          }
        },
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime())
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(
                start.getTime() - 3600 * 1000 * 24 * 7
              );
              picker.$emit("pick", [start, end]);
            },
          }
        ],
      },
      pickerOptionsDay: {
        disabledDate(time) {
          // let startTime = new Date(self.timeSelectRange[0]);
          // let endTime = new Date(self.timeSelectRange[1]);
          // // console.log("开始时间：" + startTime.getTime() + ",结束时间：" + endTime.getTime() + ",当前选择时间：" + time.getTime())
          // if (startTime == endTime) {
          //   return false;
          // } else {
          //   return time.getTime() > endTime || time.getTime() < startTime;
          // }
        }
      },
    }
  },
  computed: {
    ...mapGetters([
      'userId',
      'name',
      'companyInfo'
    ])
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    if (this.timer != null) {
      clearInterval(this.timer);
    }
  },
  onDestroy() {

  },
  methods: {
    async init() {
      await this.queryAllUav();
      await this.queryData();
    },
    showToast(msg) {
      this.$layer.msg(msg)
    },
    showMessage(msg, type) {
      this.$message({ message: msg, type: type })
    },
    getShowValue(value, defaultValue) {
      let result = "-";
      if (defaultValue) {
        result = defaultValue;
      }
      if (value != null && value !== '') {
        result = value;
      }
      return result;
    },
    // 已导出的显示不同颜色
    tableCellStyle(row) {
      if (row.rowIndex % 2 == 0) {
        // 已处理的颜色
        return '';
        // return 'background-color:#e8fffc;';  // C1DAD7  E6EAE9
        // return 'background-color:#E6EAE9;color:red !important;';
      } else {
        // 未处理的数据
        return '';
      }
    },

    handleCheckChange(value) {
      // this.showToast("状态：" + value);
      if (value == true) {
        this.startTimer();  // 自动刷新
      } else {
        this.showToast('自动刷新数据已关闭！');
        this.stopTimer();  // 停止自动刷新
      }
    },

    startTimer() {
      this.stopTimer();
      this.timer = setInterval(this.queryDataByTimer, 20000);
      this.showToast('自动刷新数据已开启');
    },

    stopTimer() {
      if (this.timer != null) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    // 全选，全不选
    allChecked(checked) {

    },

    // 删除选中的记录
    async deleteMore() {

    },

    // 修改异常类型，火点、黑斑、普通
    updateExceType(row) {
      this.selectedRow = row;
      this.exceptionTypeTemp = row.exceptionType;
      this.dialogExceTypeVisible = true;
    },
    updatingExceType() {
      this.dialogExceTypeVisible = false;
      try {
        this.loading = true;
        let id = this.selectedRow.id;
        let index = this.selectedRow.index;
        this.$store
          .dispatch("efPhotoEp/updateExceptionType", { id: id, exceptionType: this.exceptionTypeTemp })
          .then((response) => {
            this.loading = false;
            if (response.code === 1) {
              let rowNew = this.data[index];
              rowNew.exceptionType = this.exceptionTypeTemp;
              this.data.splice(index, 1, rowNew);  // 替换旧数据
              this.showToast('修改成功.');
            } else {
              this.showToast(response.message);
            }
          })
          .catch((error) => {
            this.loading = false;
            this.$message.error(error);
          });
      } catch (error) {
        this.loading = false;
        this.$message.error(error);
      }
    },
    // 修改黑斑数量
    updateBlackSpotNum(row) {
      const that = this
      this.selectedRow = row;
      let blackspotNum = row.blackspotNum;
      this.$layer.prompt({
        title: '请输入异常数量',
        formType: 0, // 输入框类型，支持0（文本）默认1（密码）2（多行文本）
        value: blackspotNum,
        maxlength: 4, // 可输入文本的最大长度，默认500
        area: ['400px', '170px'], // 自定义文本域宽高
        scrollbar: false,
        zIndex: 2000 // 层优先级
      }, function (value, index) {
        if (value == null || value === '' || isNaN(value)) {
          that.$layer.msg('请输入数字！', { icon: 6 })
          return
        }
        that.$layer.close(index)

        that.updateData(row.index, row.id, value, row.blackspotArea, row.place)
      })
    },
    // 修改位置
    updatePlace(row) {
      const that = this
      this.selectedRow = row;
      let place = row.place;
      this.$layer.prompt({
        title: '请修改地理位置',
        formType: 1, // 输入框类型，支持0（文本）默认1（密码）2（多行文本）
        value: place,
        maxlength: 4, // 可输入文本的最大长度，默认500
        area: ['400px', '170px'], // 自定义文本域宽高
        scrollbar: false,
        zIndex: 2000 // 层优先级
      }, function (value, index) {
        if (value == null || value === '') {
          that.$layer.msg('请输入地理位置！', { icon: 6 })
          return
        }
        that.$layer.close(index)
        that.updateData(row.index, row.id, row.blackspotNum, row.blackspotArea, value)
      })
    },

    // 查看拍照位置
    seePlace(row) {
      const lat = row.lat;
      const lng = row.lng;
      this.setMapCenter(lat, lng, 18);
      this.dialogMapPointVisible = true;
      this.selectedRow = row;
    },

    // 修改黑斑面积
    updateBlackSpotArea(row) {
      this.showImageOnMap(row);
      // const that = this
      // let blackspotArea = row.blackspotArea;
      // this.$layer.prompt({
      //   title: '请输入黑斑面积(平方米)',
      //   formType: 0, // 输入框类型，支持0（文本）默认1（密码）2（多行文本）
      //   value: blackspotArea,
      //   maxlength: 4, // 可输入文本的最大长度，默认500
      //   area: ['400px', '170px'], // 自定义文本域宽高
      //   scrollbar: false,
      //   zIndex: 2000 // 层优先级
      // }, function (value, index) {
      //   if (value == null || value === '' || isNaN(value)) {
      //     that.$layer.msg('请输入数字！', { icon: 6 })
      //     return
      //   }
      //   that.$layer.close(index)
      //   that.updateData(row.index, row.id, row.blackspotNum, value, row.place)
      // })
    },

    // 点击行
    rowClick(row, column, event) {
      // if (column) {
      //   if (column.label == '操作' || column.label == '黑斑数量' || column.label == '异常面积' || column.label == '航拍影像') {
      //     return;
      //   }
      // }
      // this.dataRow = row;
      // this.drawerDetail = true;
    },
    // 鼠标悬浮
    cellMouseEnter(row, column, cell, event) {
      let index = row.index;
      if (column) {
        if (column.label == '异常数量' || column.label == '异常面积' || column.label == '地理位置') {
          this.$set(this.data[index], 'isMouseEnter', true);
        }
      }
    },
    // 鼠标悬浮
    cellMouseLeave(row, column, cell, event) {
      let index = row.index;
      this.$set(this.data[index], 'isMouseEnter', false);
    },
    closeItemDetail() {
      this.drawerDetail = false;
    },
    // 异常类型删选
    filterExceptionTypeHandler(value, row, column) {
      return row.exceptionType === value;
    },
    // 点击查看按钮
    seeDetail(row) {
      this.dataRow = row;
      this.drawerDetail = true;
    },
    async exportReportDay() {
      let time = this.selectedDateDay.getTime();
      let startTime = new Date(this.timeSelectRange[0]);
      let endTime = new Date(this.timeSelectRange[1]);
      var startTimeMisec = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate()).getTime() //获取毫秒
      var endTimeMisec = new Date(endTime.getFullYear(), endTime.getMonth(), endTime.getDate(), 23, 59, 59).getTime() //获取毫秒
      if (time < startTimeMisec || time > endTimeMisec) {
        this.showMessage("请选择当前查询时间段的日期！");
      } else {
        try {
          this.dialogExport = false;
          this.loading = true;
          let timeDate = this.selectedDateDay;
          var timeMisec = new Date(timeDate.getFullYear(), timeDate.getMonth(), timeDate.getDate()).getTime() //获取毫秒
          await this.$store
            .dispatch("efPhotoEp/exportedEpByTime", { startTime: timeMisec })
            .then((response) => {
              this.loading = false;
              if (response.code === 1) {
                // 获取到报告路径，开始下载
                this.downloadUrl(response.message);
              } else {
                this.showToast(response.message);
              }
            })
            .catch((error) => {
              this.loading = false;
              this.$message.error(error);
            });
        } catch (error) {
          this.loading = false;
          this.$message.error(error);
        }
      }
    },
    async exportReport(row) {
      this.loading = true;
      // setTimeout(function () { that.downloadUrl('') }, 5000);
      try {
        this.loading = true;
        await this.$store
          .dispatch("efPhotoEp/exportReport", { id: row.id })
          .then((response) => {
            this.loading = false;
            if (response.code === 1) {
              // 获取到报告路径，开始下载
              this.downloadUrl(response.message);
            } else {
              this.showToast(response.message);
            }
          })
          .catch((error) => {
            this.loading = false;
            this.$message.error(error);
          });
      } catch (error) {
        this.loading = false;
        this.$message.error(error);
      }
    },
    // 导出报告
    downloadUrl(url) {
      this.loading = false;
      // url = 'https://dl.djicdn.com/downloads/DJI_Mini_3/UM/20230328/DJI_Mini_3_User_Manual_v1.0_CHS.pdf';
      // window.open(url);
      try {
        const elemIF = document.createElement(`iframe`);
        elemIF.src = url;
        elemIF.style.display = `none`;
        document.body.appendChild(elemIF);
      } catch (e) {
        console.log(e);
      }
    },

    deleteRow(row) {
      this.$confirm('是否删除当前记录?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteData(row.index, row.id);
      }).catch(() => {
      });
    },
    // 删除数据
    async deleteData(index, id) {
      try {
        this.loading = true;
        await this.$store
          .dispatch("efPhotoEp/deletePhotoEp", { id: id })
          .then((response) => {
            this.loading = false;
            if (response.code === 1) {
              this.data.splice(index, 1);
              this.showToast('删除成功!');
            } else {
              this.showToast(response.message);
            }
          })
          .catch((error) => {
            this.loading = false;
            this.$message.error(error);
          });
      } catch (error) {
        this.loading = false;
        this.$message.error(error);
      }
    },
    // 修改数据
    async updateData(index, id, blackspotNum, blackspotArea, place) {
      try {
        this.loading = true;
        let model = {
          id: id,
          blackspotNum: blackspotNum,
          blackspotArea: blackspotArea,
          place: place
        };
        await this.$store
          .dispatch("efPhotoEp/updatePhotoEp", model)
          .then((response) => {
            this.loading = false;
            if (response.code === 1) {
              let rowNew = this.data[index];
              rowNew.blackspotNum = blackspotNum;
              rowNew.blackspotArea = blackspotArea;
              rowNew.place = place;
              this.data.splice(index, 1, rowNew);  // 替换旧数据
              this.showToast('修改成功.');
            } else {
              this.showToast(response.message);
            }
          })
          .catch((error) => {
            this.loading = false;
            this.$message.error(error);
          });
      } catch (error) {
        this.loading = false;
        this.$message.error(error);
      }
    },
    //查询所有无人机的信息
    async queryAllUav() {
      this.loadingUavs = true
      this.uavIdOption = []
      this.deviceid = null
      await this.$store
        .dispatch("timedTask/queryAllUav")
        .then((response) => {
          this.loadingUavs = false;
          if (response.code === 1) {
            this.uavIdOption = response.data;
            // if (this.uavIdOption && this.uavIdOption.length > 0) {
            //   this.deviceid = response.data[0].uavId;
            // } else {
            //   this.deviceid = null
            // }
            if (this.uavIdOption) {
              this.uavIdOption.unshift({ uavId: '-', uavName: '全部无人机' })
              this.deviceid = '-'
            }
          } else {
            this.$message.error(response.message);
          }
        })
        .catch((error) => {
          this.loadingUavs = false;
          this.$message.error(error);
        });
    },
    // 定时查询媒体文件
    async queryDataByTimer() {
      this.showMessage('更新记录中...')
      this.queryData(true);
    },
    // 查询媒体文件
    async queryData(becomeSilent) {
      try {
        let tips = true;
        if (becomeSilent) {
          tips = !becomeSilent;
        }
        if (this.uavIdOption == null || this.uavIdOption.length <= 1) {
          if (tips) {
            this.showToast("未绑定无人机！");
          }
          return;
        }
        let deviceId = null;
        if (this.deviceid != null && this.deviceid != '-') {
          deviceId = this.deviceid;
        }
        let startTime = new Date(this.timeSelectRange[0]);
        let endTime = new Date(this.timeSelectRange[1]);
        var startTimeMisec = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate()).getTime() //获取毫秒
        var endTimeMisec = new Date(endTime.getFullYear(), endTime.getMonth(), endTime.getDate(), 23, 59, 59).getTime() //获取毫秒
        let model = {
          startTime: startTimeMisec,
          endTime: endTimeMisec,
          deviceId: deviceId
        };
        if (tips) {
          this.loading = true;
        }
        await this.$store
          .dispatch("efPhotoEp/queryAllPhotoEp", model)
          .then((response) => {
            if (tips) {
              this.loading = false;
            }
            if (response.code === 1) {
              let dataTemp = response.data;
              if (dataTemp && dataTemp.length > 0) {
                for (let index = 0; index < dataTemp.length; index++) {
                  // dataTemp[index].pathImage = 'http://www.efuav.vip/' + dataTemp[index].pathImage;
                  // dataTemp[index].pathImage2 = 'http://www.efuav.vip/' + dataTemp[index].pathImage2;
                  // dataTemp[index].pathImage3 = 'http://www.efuav.vip/' + dataTemp[index].pathImage3;
                  // dataTemp[index].pathImage4 = 'http://www.efuav.vip/' + dataTemp[index].pathImage4;
                  // dataTemp[index].pathImage5 = 'http://www.efuav.vip/' + dataTemp[index].pathImage5;

                  // 添加属性
                  dataTemp[index].pathImageList = [];

                  if (dataTemp[index].pathImage != null) {
                    // dataTemp[index].pathImage = 'http://www.efuav.vip/' + dataTemp[index].pathImage;
                    dataTemp[index].pathImageList.push(dataTemp[index].pathImage);
                  }
                  if (dataTemp[index].pathImage2 != null) {
                    // dataTemp[index].pathImage2 = 'http://www.efuav.vip/' + dataTemp[index].pathImage2;
                    dataTemp[index].pathImageList.push(dataTemp[index].pathImage2);
                  }
                  if (dataTemp[index].pathImage3 != null) {
                    // dataTemp[index].pathImage3 = 'http://www.efuav.vip/' + dataTemp[index].pathImage3;
                    dataTemp[index].pathImageList.push(dataTemp[index].pathImage3);
                  }
                  if (dataTemp[index].pathImage4 != null) {
                    // dataTemp[index].pathImage4 = 'http://www.efuav.vip/' + dataTemp[index].pathImage4;
                    dataTemp[index].pathImageList.push(dataTemp[index].pathImage4);
                  }
                  if (dataTemp[index].pathImage5 != null) {
                    // dataTemp[index].pathImage5 = 'http://www.efuav.vip/' + dataTemp[index].pathImage5;
                    dataTemp[index].pathImageList.push(dataTemp[index].pathImage5);
                  }
                  dataTemp[index].index = index;
                  dataTemp[index].isMouseEnter = false;
                }
              }
              this.data = dataTemp;
            } else {
              this.$message.error(response.message);
            }
          })
          .catch((error) => {
            if (tips) {
              this.loading = false;
            }
            this.$message.error(error);
          });
      } catch (error) {
        this.loading = false;
        this.$message.error(error);
      }
    },

    // 地图操作  *****************************************

    saveBlackSpotArea() {
      this.dialogMapVisible = false;
      this.updateData(this.selectedRow.index, this.selectedRow.id, this.selectedRow.blackspotNum, this.blackspotArea, this.selectedRow.place)
    },

    setMapCenter(lat, lng, zoom) {
      const latlng = this.$gisUtil.ConvertGpsToAmap(lat, lng)
      if (latlng.lng !== 0 && latlng.lat !== 0) {
        this.centerPosition = [latlng.lng, latlng.lat]
      }
      if (zoom) {
        this.zoom = zoom
      }
    },

    closeImageOnMap() {
      this.groundimages = [];
      if (this.isMapArea) {
        this.enableArea(); // 关闭面积测量
      }
    },

    showImageOnMap(row) {
      //  getCenter( )  LngLat  获取当前Bounds的中心点经纬度坐标。
      //  getSouthWest( )   LngLat  获取西南角坐标。
      //  getNorthEast( )              LngLat  获取东北角坐标
      this.selectedRow = row;
      const url = row.pathImage;
      const lat = row.lat;
      const lng = row.lng;
      const alt = row.alt;
      const altabs = row.altabs;
      const gimbalRoll = row.gimbalRoll;
      const gimbalPitch = row.gimbalPitch;
      const gimbalYaw = row.gimbalYaw;

      this.blackspotArea = row.blackspotArea;
      // let url = 'https://amappc.cn-hangzhou.oss-pub.aliyun-inc.com/lbs/static/img/dongwuyuan.jpg';
      this.groundimages = [];
      // let center = [114.4699645, 30.4583917];
      // let leftBottomPosGps = [114.4680762, 30.4571039];
      // let rightTopPosGps = [114.4718528, 30.4596795];

      let center = [lng, lat];
      let leftBottomPosGps = [lng - 0.0008, lat - 0.0005];
      let rightTopPosGps = [lng + 0.0008, lat + 0.0005];
      // let leftBottomPosGps = [114.4680762, 30.4571039];
      // let rightTopPosGps = [114.4718528, 30.4596795];

      const leftBottomPosAmap = this.$gisUtil.ConvertGpsToAmap(leftBottomPosGps[1], leftBottomPosGps[0]);
      const rightTopPosAmap = this.$gisUtil.ConvertGpsToAmap(rightTopPosGps[1], rightTopPosGps[0]);
      let leftBottomPosAmapArray = [leftBottomPosAmap.lng, leftBottomPosAmap.lat];
      let rightTopPosAmapArray = [rightTopPosAmap.lng, rightTopPosAmap.lat];

      this.setMapCenter(center[1], center[0], 17);

      let item = {
        id: row.id,
        url: url,
        opacity: 0,
        bounds: [leftBottomPosAmapArray, rightTopPosAmapArray],  // 图片左下坐标，和图标右上坐标
      };

      this.groundimages.push(item);

      this.dialogMapVisible = true;
    },

    enableArea(enable) {
      // if (this.isMapRuler) {
      //   this.enableRuler(false)
      // }
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

    //常用工具函数*****************************************
    //格式化
    parseTime(cellValue) {
      if (
        cellValue == null ||
        cellValue == undefined ||
        cellValue == ""
      ) {
        return cellValue;
      }
      return parseTime(cellValue);
    },
    filtersType(cellValue) {
      if (
        cellValue == null ||
        cellValue == undefined ||
        cellValue == ""
      ) {
        return cellValue;
      }
      return filtersType(cellValue);
    },
  }
};
</script>

<style lang="scss" scoped>
//搜索框
.toolbar {
  margin-top: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 5px;
}

//分页
.pagination {
  bottom: 0px;
  margin: 0px auto;
}

.el-container {
  // background: blue;
  position: absolute;
  padding: 1px;
  width: 100%;
  height: 100%;
  display: flex;
}

.drawer__content {
  padding: 8px;
}
.drawer__footer {
  widows: 100%;
  padding: 10px;
  .el-button {
    width: 48%;
  }
}
.test {
  // cafcf6
  background: #e8fffc;
}
.divMapMain {
  width: 100%;
  height: 500px;
  display: flex; // 弹性布局
  justify-content: center; // 内容水平居中
}
.mapLeft {
  width: 280px;
  height: 100%;
}
.mapRight {
  width: 100%;
  height: 100%;
  flex: 1;
  background: red;
}
.divBottomRightTool {
  position: absolute;
  right: 50px;
  bottom: 50px;
  width: auto;
  height: auto;
  opacity: 0.5;
  filter: alpha(Opacity=50);
  -moz-opacity: 0.5;
}
</style>