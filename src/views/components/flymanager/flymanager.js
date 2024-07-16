//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import {
  mapGetters
} from 'vuex'
import Cookies from 'js-cookie'
import {
  parseTime,
  filtersType
} from '@/utils/index'
import $ from 'jquery'
import flvjs from 'flv.js'
import store from '@/store'
import MyModule from './myModule.js';
var myModuleInstance;
export default {
  name: '',
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
        selectedUavItem:{},
      selectedHiveItem: {},
      isShowUavs: false,
      isCanOpter: false, // 是否可以操作无人机或停机坪
      isCanOpterUav: false, // 是否可以操作无人机
      isCanOpterHive: false, // 是否可以操作停机坪
    };
  },
  //让组件接收外部传来的数据
  props: {
    ProgressShow: {
      type: String,
      default: '离线'
    },
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
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
      }).catch(() => {
        this.isDoingCommand = false
      });
    },
    /**判断无人机缩放到期 */
    getUavLimitText(uav, type) {
      let igGetTooltip = false
      let igGetBoolean = false
      if (type) {
        if (type === 'tooltip') {
          igGetTooltip = true
        } else {
          igGetBoolean = true
        }
      }
      let text = '-'
      let limitOfCompany = true //true表示已到期
      let limitOfUser = true //true表示已到期
      let limitOfCompanyTime = 0 //期限
      let limitOfUserTime = 0 //期限
      if (uav) {
        console.log(uav.limitOfCompany);
        if (uav.limitOfCompany) {
          limitOfCompanyTime = uav.limitOfCompany
          if (uav.limitOfCompany > Date.now()) {
            limitOfCompany = false
            console.log('Company没有');
          }
        }
        if (uav.limitOfUser) {
          limitOfUserTime = uav.limitOfUser
          if (uav.limitOfUser > Date.now()) {
            limitOfUser = false
            console.log('yh没有');
          }
        }
      }
      if (limitOfCompany) {
        text = '已到期'
        if (igGetTooltip) {
          text = '公司授权已到期[' + this.$dateUtil.convertMillSecToYYYYMMDD(limitOfCompanyTime) + ']'
        }
      } else {
        if (limitOfUser) {
          text = '已到期'
          if (igGetTooltip) {
            text = '用户授权已到期[' + this.$dateUtil.convertMillSecToYYYYMMDD(limitOfUserTime) + ']'
          }
        } else {
          text = '正常'
          if (igGetTooltip) {
            text = '正常使用[' + this.$dateUtil.convertMillSecToYYYYMMDD(limitOfUserTime) + ']'
          }
        }
      }
      if (igGetBoolean) {
        // 都没有到期，则返回true
        return !limitOfCompany && !limitOfUser
      }
      return text
    },
    /**无人机状态 */
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

    clickUavItem(item, needclose=true) {
      let goon = true
      if (needclose && needclose === true) {
        this.isShowUavs = false
      }
      this.selectedUavType = item.uavFactoryId // 当前选择的无人机类型

      if (goon) {
        this.switchUav(item)
      }

      this.$emit("sendswitchUav",item)
    },
    // 切换无人机
    switchUav(item) {
      let changed = true
      this.ProgressShow = "离线";
      if (this.selectedUavItem && this.selectedUavItem != null && this.selectedUavItem.uavId === item.uavId) {
        changed = false
      }
      this.selectedUavItem = item
      this.selectedUavItem.selected = true

      // 判断当前无人机是否到期
      this.isCanOpterUav = this.getUavLimitText(item, 'bool')
      console.log(this.isCanOpterUav);
      // this.changedUav(changed)
    },
    getRealdataDes(type) {
      try {
        if (this.selectedHiveItem) {
          switch (type) {
            case 'hive':
              if (this.selectedHiveItem.isOnline) {
                return '在线'
              } else {
                return '离线'
              }
              case 'hivestream':
                return this.selectedHiveItem.streamType
          }
          if (this.selectedHiveItem.heartbeatData && this.selectedHiveItem.heartbeatData != null) {
            switch (type) {
              case 'hivetemp':
                return this.selectedHiveItem.heartbeatData.hiveTemperature
              case 'chargingText':
                let ChargeVoltage = this.selectedHiveItem.heartbeatData.chargeVoltage
                let ChargeCurrent = this.selectedHiveItem.heartbeatData.chargeCurrent
                let ChargePert = this.selectedHiveItem.heartbeatData.chargePert
                let ChargeNeedTime = this.selectedHiveItem.heartbeatData.chargeNeedTime
                return '充电电压: ' + ChargeVoltage.toFixed(3) + '伏' +
                  ',\r\n 充电电流: ' + ChargeCurrent.toFixed(3) + '安'
            }
          }
        }
        if (this.selectedUavItem && this.selectedUavItem != null) {
          switch (type) {
            case 'uavstream':
              return this.selectedUavItem.streamType
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
      } catch (error) {
        console.log('获取参数值 getRealdataDes：' + type + " 异常：" + error)
      }
    },
    /**充电 */
    // 是否正在充电
    getChargingBool() {
      let charging = false
      if (this.selectedUavItem && this.selectedUavItem != null) {
        charging = this.selectedUavItem.isCharging
      }
      return charging;
    },
    getChargingColor() {
      let charging = this.getChargingBool();
      return charging ? 'blue' : '#67c23a';
    },
    getChargingTooltip() {
      let text = "未知"
      if (this.selectedUavItem && this.selectedUavItem != null && this.selectedUavItem.ChargeStatus) {
        // 0：未知，1：未充电，2：充电中，3：已充满
        switch (this.selectedUavItem.ChargeStatus) {
          case 0:
            text = '未知状态';
            break;
          case 1:
            text = '未充电';
            break;
          case 2:
            text = '正在充电中';
            break;
          case 3:
            text = '已充满';
            break;
        }
      } else {
        if (this.selectedHiveItem.heartbeatData && this.selectedHiveItem.heartbeatData != null) {
          let ChargeVoltage = this.selectedHiveItem.heartbeatData.chargeVoltage
          let ChargeCurrent = this.selectedHiveItem.heartbeatData.chargeCurrent
          let ChargePert = this.selectedHiveItem.heartbeatData.chargePert
          let ChargeNeedTime = this.selectedHiveItem.heartbeatData.chargeNeedTime
          return '充电电压: ' + ChargeVoltage.toFixed(3) + '伏' +
            ',\r\n 充电电流: ' + ChargeCurrent.toFixed(3) + '安'
        }
      }
      return text;
    },
    /**遥控器 */
    getChargingText() {
      let text = "未知"
      if (this.selectedUavItem && this.selectedUavItem != null) {
        text = this.selectedUavItem.isChargingText
      }
      return text;
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
    /**打开无人机 */
    openOrCloseUav() {
      if (this.selectedUavItem && this.selectedUavItem != null) {
        if (this.selectedUavItem.isOnline) {
          this.$confirm('是否关闭无人机？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.doCommand(1021, 0, 0, 0, 0, 5)
          }).catch(() => {});
        } else {
          this.$confirm('是否打开无人机？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.doCommand(1020, 0, 0, 0, 0, 5)
          }).catch(() => {});
        }
      }
    },
    openOrCloseRemote() {
      // 如果已经从机巢打开了遥控器，则不用从dji服务后台打开遥控器了。
        if (this.selectedUavItem && this.selectedUavItem != null) {
          if (this.selectedUavItem.isRomoteControlOnline) {
            this.$confirm('是否关闭遥控器？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.doCommand(1025, 0, 0, 0, 0, 5)
            }).catch(() => {});
          } else {
            this.$confirm('是否打开遥控器？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.doCommand(1024, 0, 0, 0, 0, 5)
            }).catch(() => {});
          }
      }
    },

  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    myModuleInstance = new MyModule();
    this.uavs = myModuleInstance.uavs
    console.log(this.uavs);

  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {


  },
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
}
