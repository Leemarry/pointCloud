/*
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2023-12-06 10:25:24
 * @LastEditors: likai ‘766173427@qq.com’
 * @LastEditTime: 2024-06-20 11:29:37
 */
/**
 * 此处导入store，是想要在mutations中的socketInit中调用start和reconnect
 * 不这样写的话，mutations中的方法在当前文件只有在actions中才能调用（我实现时是这样的），因此导入了再使用
 */
//  import store from "../index";
import store from '@/store';
let timer = null;

const state = {
  socket: null,
  wsMessage: null,
  sellerid: '',
  account: '',
  close: false,
  time: 6000,
  emptyUavHeartbeatTimer: null,
  emptyUavHeartbeatTimerList: [],
  emptyUavHeartbeatTimers: null,
  emptyUavHeartbeatTimerLists: [],
  isItConnected: false, // 是否连接

  /**当前在线无人机 */
  currentlyOnlineUavId: '',
  /**当前-默认显示的心跳包--uavHeartbeatNow--用于显示false */
  onlineUavHeartbeat: {},
  /**默认无人机 */
  defaultUavSn: null, // 修改
  /**默认无人机心跳包--uavHeartbeatNow--用于显示true */
  defaultUavHeartbeat: {
    alt: 0,
    areMotorsOn: 0,
    aremd: 0,
    batteryValue: 0,
    dataDate: 0,
    flightModeText: "-",
    linkAirUpload: 0,
    linkAirDownload: 0,
    batteryPert: 0,
    gpsStatusText: "-",
    satecount: 0,
    altabs: 0,
    lng: 0,
    lat: 0,
    xySpeed: 0,
    zSpeed: 0,
    roll: 0,
    pitch: 0,
    yaw: 0,
    flightTimeInSeconds: 0,
    uavId: null,
    messageId: null,
  },

  /**10010 实时回传图片列表 --每一个无人机（uavId，图片列表,数据包列，最新url)  */
  imageHeartbeatList: [],
  imageHeartbeatData: [],
  /**默认无人机实时回传图片信息--无人机（uavId，图片列表,数据包列，最新url) */
  defaultUavImageData: {
    url: '',
    uavId: null,
    array: [],
    imgarray: [],
  },
  /**默认无人机拍摄图片信息列表--用于显示列表 */
  defaultUavImageList: [],

  /***10021 分析图片包列表 --每一个无人机（uavId，图片列表,数据包列，最新url) */
  resultimageHeartbeatList: [],
  /**默认无人机 分析结果图片无人机（uavId，图片列表,数据包列，最新url) */
  defaultUavResultImageData: {
    url: '', //  currentResultImg
    uavId: null, //currentuavId
    array: [],
  },

  processBlockAllList: [], // 处理信息
  ProcessWsMessage: { msg: '', show: false },//false,

};
/**处理信息 */
function handle(state, { processList, isAdd }) {
  if (isAdd === undefined) {
    state.processBlockAllList.push(processList); //
    return;
  }
  if (isAdd) {
    const processBlockAllList = state.processBlockAllList
    const index = processBlockAllList.findIndex(processBlockAll => {
      return processBlockAll.handleUuid == processList.handleUuid
    })
    if (index <= -1) {
      state.processBlockAllList.push(processList)
    } else {
      processBlockAllList.splice(index, 1, { ...processList, expand: true });
      state.processBlockAllList = [...processBlockAllList]
    }

  } else {
    const processBlockAllList = state.processBlockAllList
    const index = processBlockAllList.findIndex(processBlockAll => {
      return processBlockAll.handleUuid == processList.handleUuid
    })
    if (index >= 0) {
      processBlockAllList.splice(index, 1);
      state.processBlockAllList = [...processBlockAllList]
    }
  }
}
/**心跳置空 */
function resetUavHeart(state) {
  state.defaultUavHeartbeat.alt = 0;
  state.defaultUavHeartbeat.altabs = 0;
  state.defaultUavHeartbeat.areMotorsOn = 0;
  state.defaultUavHeartbeat.aremd = 0;
  state.defaultUavHeartbeat.batteryValue = 0;
  state.defaultUavHeartbeat.dataDate = 0;
  state.defaultUavHeartbeat.flightModeText = '-';
  state.defaultUavHeartbeat.linkAirUpload = 0;
  state.defaultUavHeartbeat.linkAirDownload = 0;
  state.defaultUavHeartbeat.batteryPert = 0;
  state.defaultUavHeartbeat.gpsStatusText = '-';
  state.defaultUavHeartbeat.satecount = 0;
  state.defaultUavHeartbeat.lng = 0;
  state.defaultUavHeartbeat.lat = 0;
  state.defaultUavHeartbeat.xySpeed = 0;
  state.defaultUavHeartbeat.zSpeed = 0;
  state.defaultUavHeartbeat.roll = 0;
  state.defaultUavHeartbeat.pitch = 0;
  state.defaultUavHeartbeat.yaw = 0;
  state.defaultUavHeartbeat.flightTimeInSeconds = 0;
  state.defaultUavHeartbeat.uavId = 0;
  state.defaultUavHeartbeat.messageId = 0;

}
/**测试模拟无用 */
function printMessage(state) {


  const uavHeart = {
    "code": 1,
    "data": {
      "alt": 0,
      "altabs": 99.9,
      "areMotorsOn": 0,
      "aremd": 0,
      "batteryPert": 82,
      "batteryTemp": 0,
      "batteryValue": 0,
      "cameraLens": 1,
      "dataDate": 1712020877459,
      "distToHome": 139.52,
      "distToTarget": 0,
      "electricCurrent": -0.69,
      "flightMode": "GPS_ATTI",
      "flightModeText": "GPS姿态模式",
      "flightTimeInSeconds": 0,
      "fpvSign": 100,
      "gimbalMode": 2,
      "gimbalPitch": 12.300000190734863,
      "gimbalRelToUavHeading": 0.5,
      "gimbalRoll": 0,
      "gimbalYaw": -2,
      "gpsStatus": 5,
      "gpsStatusText": "高质量",
      "id": 0,
      "lat": 30.4595223,
      "linkAirDownload": 100,
      "linkAirUpload": 100,
      "lng": 114.4693154,
      "mountDevice": 1,
      "pdop": 0,
      "pitch": 0.4,
      "remoteSign": 100,
      "roll": 0.1,
      "satecount": 18,
      "systemStatus": 0,
      "uavAbnormal": 0,
      "uavCurentHive": "",
      "uavId": "1ZNBJ5F00C008L",
      "uavStatus": 0,
      "uavType": 2,
      "voltage": 49.81,
      "wpCount": 0,
      "wpFirstWpTime": 0,
      "wpFlyedTime": 0,
      "wpMayFinlishTime": 0,
      "wpNo": 0,
      "wpProgress": 0,
      "wpStartTime": 0,
      "xySpeed": 0,
      "yaw": 0,
      "zSpeed": 0
    },
    "message": "",
    "messageId": 2200
  };

  console.log("定时器执行中...", uavHeart);
  store.dispatch('ws/CE_SHI_SOCKET_ONMESSAGE', uavHeart)

}
/*模拟0.5心跳无用 */
function putHeartMessage(state) {
  console.log("定时器开启...");

  // 设置定时器，每0.5秒执行一次printMessage函数
  let timerId = setInterval(printMessage(state), 500);

  // 如果需要在某个时间点停止定时器，可以调用clearInterval函数
  // 例如，以下代码会在10秒后停止定时器
  // setTimeout(() => {
  //   clearInterval(timerId);
  //   console.log("定时器停止");
  // }, 10000);
}

const mutations = {
  //开启
  SOCKET_ONOPEN(state, info) {

    console.log('开启WebSocket连接', info);
    state.isItConnected = true
    info = {
      'msg': '我来了，同志们！'
    }
    // socket.send(JSON.stringify(info)); // 发送心跳消息
  },
  // 关闭
  SOCKET_ONCLOSE(state, { commit, event }) {
    console.log('WebSocket连接已关闭');
    if (state.close) { //浏览器关闭
      // clearInterval(timer); // 关闭心跳定时器
      // state.socket.send('close'); // 发送心跳消息
    } else { //连接错误 || 服务器连接已关闭 || 收到消息返回信息不对
      commit('againRequest')
      state.isItConnected = false
    }
  },
  // 收到消息
  SOCKET_ONMESSAGE(state, { commit, wsMessage }) {
    state.wsMessage = wsMessage;
    console.log('收到消息:', wsMessage);
    // if ((wsMessage && wsMessage.code) || wsMessage.code == 0) localStorage.setItem(`messageId-${wsMessage.messageId}`, wsMessage.messageId)
    const { messageId, code, deviceID = wsMessage.data.uavId, message, data } = wsMessage;
    let onlineUavHeartbeatMessage = wsMessage
    commit('Process_Message', { messageId, code, deviceID, message, data }) //  处理信息 ？？？？？？？？ 这个地方 
    // store.dispatch('ws/ProcessMessage',onlineUavHeartbeatMessage)  
  },

  //处理信息
  async Process_Message(state, { messageId, code, deviceID, message, data }) {
    let index = -1; // 当前无人机在数组中的索引 
    let isNowUav = false; // 是不是默认无人机
    let isNowHive = false; // 是不是默认
    var defaultData = null;

    var datas = await store.dispatch('ws/someAction')
    let key = 'defaultUav-' + datas.userId;

    state.defaultUavSn = localStorage.getItem(key)
    console.log(datas, key, state.defaultUavSn);
    // 是否是当前默认无人机
    if (deviceID == state.defaultUavSn) {
      isNowUav = true;
      defaultData = data;
      index = 1
    }
    if (state.emptyUavHeartbeatTimer != null) {
      clearTimeout(state.emptyUavHeartbeatTimer); // 清除之前的定时器
      state.emptyUavHeartbeatTimer = null;
    }
    // // 我的逻辑是有三台无人机信息 页面左侧是无人机列表 用于选择默认无人机，和右侧只显示当前 默认无人机在线的信息    现在无人机发信息  存在是用户选择的默认无人机 接收消息显示在右侧默认无人机在线的信息
    // // 没有的右侧默认无人机为空 
    // 重新设置定时器，确保在 0.5 秒后执行逻辑
    state.emptyUavHeartbeatTimer = setTimeout(() => {
      resetUavHeart(state); // 心跳置空
    }, 5000);
    switch (messageId) {
      case 2200: // 大疆无人机心跳包
        console.log('大疆无人机心跳包-2200', data);
        if (isNowUav) {
          state.defaultUavHeartbeat.alt = data.alt;
          state.defaultUavHeartbeat.altabs = data.altabs;
          state.defaultUavHeartbeat.areMotorsOn = data.areMotorsOn;
          state.defaultUavHeartbeat.aremd = data.aremd;
          state.defaultUavHeartbeat.batteryValue = data.batteryValue; //
          state.defaultUavHeartbeat.dataDate = data.dataDate;
          state.defaultUavHeartbeat.flightModeText = data.flightModeText; //大疆心跳包文字
          state.defaultUavHeartbeat.linkAirUpload = data.linkAirUpload;
          state.defaultUavHeartbeat.linkAirDownload = data.linkAirDownload;
          state.defaultUavHeartbeat.batteryPert = data.batteryPert;
          state.defaultUavHeartbeat.gpsStatusText = data.gpsStatusText;
          state.defaultUavHeartbeat.satecount = data.satecount;
          state.defaultUavHeartbeat.lng = (Number(data.lng)).toFixed(5);
          state.defaultUavHeartbeat.lat = (Number(data.lat)).toFixed(5);
          state.defaultUavHeartbeat.xySpeed = data.xySpeed;
          state.defaultUavHeartbeat.zSpeed = data.zSpeed;
          // var degree = 45; // 假设要将该角度值转换为弧度 var radian = degree * (Math.PI / 180); //
          var rollRadian = parseFloat(data.roll) * (Math.PI / 180);
          state.defaultUavHeartbeat.roll = rollRadian;
          var pitchRadian = parseFloat(data.pitch) * (Math.PI / 180);
          state.defaultUavHeartbeat.pitch = pitchRadian;
          var yawRadian = parseFloat(data.yaw) * (Math.PI / 180);
          state.defaultUavHeartbeat.yaw = yawRadian;
          state.defaultUavHeartbeat.flightTimeInSeconds = data.flightTimeInSeconds;
          state.defaultUavHeartbeat.uavId = defaultData.uavId;
          state.defaultUavHeartbeat.messageId = 2200;
        } else { }
        break;
      case 2000: // 开源无人机心跳包
        console.log('开源无人机心跳包-2000', data,isNowUav,);
        if (isNowUav) {
          state.defaultUavHeartbeat.alt = (Number(defaultData.alt)).toFixed(1);
          state.defaultUavHeartbeat.altabs = (Number(defaultData.altabs)).toFixed(1);
          state.defaultUavHeartbeat.areMotorsOn = defaultData.areMotorsOn;
          state.defaultUavHeartbeat.aremd = defaultData.aremd;
          state.defaultUavHeartbeat.batteryValue = (Number(defaultData.batteryValue) / 100).toFixed(2);
          state.defaultUavHeartbeat.dataDate = defaultData.dataDate;
          state.defaultUavHeartbeat.flightModeText = defaultData.flightModeText;
          state.defaultUavHeartbeat.linkAirUpload = defaultData.linkAirUpload;
          state.defaultUavHeartbeat.linkAirDownload = defaultData.linkAirDownload;
          state.defaultUavHeartbeat.batteryPert = defaultData.batteryPert;
          state.defaultUavHeartbeat.gpsStatusText = defaultData.gpsStatusText;
          state.defaultUavHeartbeat.satecount = defaultData.satecount;
          state.defaultUavHeartbeat.lng = (Number(defaultData.lng)).toFixed(5); // / 10000000
          state.defaultUavHeartbeat.lat = (Number(defaultData.lat)).toFixed(5); //  / 10000000
          state.defaultUavHeartbeat.xySpeed = (Number(defaultData.xySpeed) / 100).toFixed(1);
          state.defaultUavHeartbeat.zSpeed = (Number(defaultData.zSpeed) / 100);
          state.defaultUavHeartbeat.roll = defaultData.roll;
          state.defaultUavHeartbeat.pitch = defaultData.pitch;
          state.defaultUavHeartbeat.yaw = Number(defaultData.yaw);
          state.defaultUavHeartbeat.flightTimeInSeconds = defaultData.flightTimeInSeconds;
          state.defaultUavHeartbeat.uavId = defaultData.uavId;
          state.defaultUavHeartbeat.messageId = 2000;
        } else { }
        break;
      case 10010: // 10010 图片 所有无人机图片包
        console.log('10010 图片 所有无人机图片包', data);
        if (state.imageHeartbeatList && state.imageHeartbeatList.length > 0) {
          for (let i = 0; i < state.imageHeartbeatList.length; i++) {
            const element = state.imageHeartbeatList[i]; // 0
            if (element && element.uavId) {
              if (element.uavId === deviceID) {
                index = i;
                break;
              }
            }
          }
          if (index >= 0) {
            state.imageHeartbeatList[index].imgarray.unshift(data.url);
            state.imageHeartbeatList[index].array.unshift(data);
            state.imageHeartbeatList[index].url = data.url; // 当前最新实时照片
            // state.imageHeartbeatList[index] = { imgarray: [data.url, ...state.imageHeartbeatList[index].imgarray], array: [data, ...state.imageHeartbeatList[index].array], url: data.url };

          } else {

            //后来修改 修改成 里面有 数据包列表 图片列表 ， 当前无人机 ，当前最新url
            state.imageHeartbeatList.push({ uavId: deviceID, array: [data], imgarray: [data.url], url: data.url });
            index = state.imageHeartbeatList.length - 1;

          }
        } else {
          // 是第一个 构造对象数组
          state.imageHeartbeatList.push({ uavId: deviceID, array: [data], imgarray: [data.url], url: data.url });
          index = 0;
        }
        if (isNowUav) {
          // 现在是
          if (index >= 0 && state.imageHeartbeatList.length > index) {
            state.defaultUavImageData = state.imageHeartbeatList[index]; //数据包列表 图片列表 ， 当前无人机 ，当前最新url
          }

        } else {
          state.defaultUavImageData = {
            url: '',
            uavId: null,
            array: [],
            imgarray: []
          };
          // state.defaultUavImageList.splice(0, state.defaultUavImageList.length); //清空
        }
        break;
      case 10021: // 10021 分析图片 所有无人机分析图片包
     setTimeout(() => {
      console.log('10021 图片 所有无人机图片包', data);
      if (state.resultimageHeartbeatList && state.resultimageHeartbeatList.length > 0) {
        for (let i = 0; i < state.resultimageHeartbeatList.length; i++) {
          const element = state.resultimageHeartbeatList[i]; // 0
          if (element && element.uavId) {
            if (element.uavId === deviceID) {
              index = i;
              break;
            }
          }
        }
        if (index >= 0) {
          // console.log('当前图片数', state.resultimageHeartbeatList[index].array.length, state.resultimageHeartbeatList[index].array);
          state.resultimageHeartbeatList[index].array.unshift(data);
          // state.resultimageHeartbeatList[index].imgarray.unshift(data.url);
          const Imgarray = state.resultimageHeartbeatList[index].imgarray;
          Imgarray.unshift(data.url)
          const uniqueImgarray = new Set(Imgarray);
          state.resultimageHeartbeatList[index].imgarray = Array.from(uniqueImgarray);
          state.resultimageHeartbeatList[index].url = data.url; // 当前分析结果图片
        } else {
          state.resultimageHeartbeatList.push({ uavId: deviceID, imgarray: [data.url], array: [data], url: data.url });
          index = state.resultimageHeartbeatList.length - 1;
        }
      } else {
        // 第一个 构造对象数组
        state.resultimageHeartbeatList.push({ uavId: deviceID, imgarray: [data.url], array: [data], url: data.url });
        index = 0;
      }
      if (isNowUav) {
        // 当前 分析结果的图片list

        state.defaultUavResultImageData = state.resultimageHeartbeatList[index]
      } else {
        state.defaultUavResultImageData = {
          url: '',
          uavId: null,
          array: [],
          imgarray: [],
        };
        // state.defaultUavImageList.splice(0, state.defaultUavImageList.length);
      }
     }, 300);
        break;
      case 2250: // 大疆服务后台心跳包
        break;
      case 2251:
        break;
      case 2300: // 机巢心跳包
        if (isNowHive) {
          this.refreshHiveHeart(data);
        }
        break;
      case 5000: // 处理返回的数据包
        console.log('处理返回的数据包', data);
        state.ProcessWsMessage = { msg: "有数据，待确认", show: true };
        // state.processBlockAllList.push(data)
        handle(state, { processList: data, isAdd: true })
        break;
      case 5001: // 处理返回的数据包
        const { efHandle, efHandleBlockLists, efHandleWaypointList } = data
        console.log('处理返回的数据包5001', data, efHandle);
        handle(state, { processList: efHandle, isAdd: false }); //接收到二次处理整个包 异常处理信息
        state.ProcessWsMessage = { msg: "二次信息回传,请刷新页面", show: true };
        break;
    }


  },

  /**mutations 重置信息 */
  Set_ResetWsHeart(state) {
    resetUavHeart(state);
  },
  // 连接错误
  SOCKET_ONERROR(state, { commit, event }) {
    state.defaultUavHeartbeat = {};
    console.error('WebSocket连接错误:', event);
    commit('againRequest')
  },
  // 重新开启ws
  againRequest(state) {
    console.log(`${state.time},重新开启ws`);
    // clearInterval(timer); // 关闭心跳定时器
    // localStorage.removeItem('workerID')
    // localStorage.removeItem('connectionID')
    setTimeout(() => {
      const data = {
        id: '101',
        token: store.getters.token,
      }
      store.dispatch('ws/onopenWebSocket', data)
    }, state.time)
  },
  Set_UavImageListAboutAll(state, { imageHeartbeatList, defaultUavImageData, resultimageHeartbeatList, defaultUavResultImageData }) {
    /**10010 图片  */
    state.imageHeartbeatList = imageHeartbeatList; // []

    /**默认无人机拍摄图片信息 */
    if (defaultUavImageData !== null) {
      state.defaultUavImageData = { ...defaultUavImageData };
    } else {
      state.defaultUavImageData = {
        url: '',
        uavId: null,
        array: [],
        imgarray: []
      };
    }
    // 10021分析结果清除
    state.resultimageHeartbeatList = resultimageHeartbeatList
    if (defaultUavResultImageData !== null) {
      state.defaultUavResultImageData = { ...defaultUavResultImageData };
    } else {
      state.defaultUavResultImageData = {
        url: '',
        uavId: null,
        array: [],
        imgarray: []
      };
    }
  },

  Clear_defaultUavImageData(state, { uavId }) {
    /**10010 图片  */
    const index = state.imageHeartbeatList.findIndex(imageData => {
      return imageData.uavId === uavId
    })
    if (index >= 0) {
      //执行删除这一列数据
      state.imageHeartbeatList.splice(index, 1);
    }

    // 10021分析结果清除
    const resultindex = state.resultimageHeartbeatList.findIndex(imageData => {
      return imageData.uavId === uavId
    })
    if (resultindex >= 0) {
      //执行删除这一列数据
      state.resultimageHeartbeatList.splice(resultindex, 1)
    }

  },
  // 心跳检测
  start(state) {
    state.timeoutObj && clearTimeout(state.timeoutObj);
    state.serverTimeoutObj && clearTimeout(state.serverTimeoutObj);
    this.timeoutObj = setTimeout(function () {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      var message = {
        msgType: "sub",
        data: {
          // ..... 发送的数据
        }
      };
      state.ws.send(JSON.stringify(message));
      store.commit("websocket/start");
    }, state.timeout);
  },
  // 初始化socket
  socketInit(state) {
    console.log('webSocketInit');
    console.log(state);
    //  if (process.env.NODE_ENV == "development") {
    //    state.wsUrl = "socket地址";
    //  } else if (process.env.NODE_ENV == "test") {
    //    state.wsUrl = "socket地址";
    //  } else {
    //    state.wsUrl = "socket地址";
    //  }
    //  state.ws = new WebSocket(state.wsUrl);
    //  state.ws.onopen = res => {
    //    console.log("连接成功");
    //    // 心跳检测
    //    store.commit("websocket/start");
    //  };
    //  state.ws.onmessage = res => {
    //    var msg = JSON.parse(res.data);
    //    // 这里的判断是根据服务端返回来的参数判断本条数据是需要的数据还是心跳检测数据
    //    // if (msg.des != "subscrib success") {
    //      state.msg = msg;
    //    // }
    //  };
    //  state.ws.onclose = res => {
    //    console.log("连接关闭");
    //    store.commit("websocket/reconnect"); // 重连
    //  };
    //  state.ws.onerror = res => {
    //    console.log("连接错误");
    //    store.commit("websocket/reconnect"); // 重连
    //  };
  },
  reconnect(state) {
    if (state.lockReconnect) {
      return;
    }
    state.lockReconnect = true;
    //没连接上会一直重连，设置延迟避免请求过多
    state.tt && clearTimeout(state.tt);
    state.tt = setTimeout(function () {
      store.commit("websocket/socketInit");
      state.lockReconnect = false;
    }, 2000);
  },
  /**处理信息 */
  Set_ProcessList(state, { processList, isAdd }) {
    // 调用共用逻辑
    handle(state, { processList, isAdd });
  }
};

const actions = {

  /**测试接收到信息 */
  CE_SHI_SOCKET_ONMESSAGE({ state, commit }, data) {
    commit('SOCKET_ONMESSAGE', {
      commit,
      wsMessage: data
    });
  },
  someAction({ state, commit, rootState }) {
    // 通过 rootState 来访问其他模块的状态
    return rootState.user
  },
  webSocketInit({ commit }, url) {
    commit("socketInit", url);
  },
  /**重置无人机心跳 */
  ResetWsHeart({ state, commit }, data) {
    commit('Set_ResetWsHeart');//心跳置空
  },
  ProcessMessage({ state, commit }, data) {
    commit("Process_Message", data)
  },
  someActions({ state, commit, rootState }) {
    // 通过 rootState 来访问其他模块的状态
    return rootState.user
  },
  // 创建WebSocket连接
  onopenWebSocket({ state, commit }, data) {
    let hasExecuted = false;
    state.id = data.id;
    // 获取token
    if (store.getters.token) {
      if (state.socket !== null) {
        console.log('state.socket不为null');
        try {
          // socket  this.webSocket
          // console.log('socket', socket);
          state.socket.destroy()
          // state.socket.close();
          // return;

        } catch (error) { } finally {
          state.socket = null
        }

      }
      commit('Set_ResetWsHeart');// 心跳置空
      // socket = new WebSocket(`ws://地址?id=${data.id}`);
      const URL = (location.protocol === "https:" ? "wss" : "ws") + '://' + location.host + '/websocketapi/' + store.getters.token

      console.log('连接地址：' + URL)
      state.socket = new WebSocket(URL)
      // 监听WebSocket事件
      //   socket.onopen = this.websocketonopen
      state.socket.onopen = (event) => {
        // console.log('actions-监听WebSocket事件-----连接ws', event);
        commit('SOCKET_ONOPEN', { id: state.sellerid });
      };
      //   socket.onerror = this.websocketonerror
      state.socket.onerror = (event) => {
        console.log('actions-监听WebSocket事件-----连接ws错误');
        if (!hasExecuted) {
          commit('SOCKET_ONERROR', { commit, event });
          hasExecuted = true;
        }
      };
      //   socket.onclose = this.websocketclose
      state.socket.onclose = (event) => {
        console.log('actions-监听WebSocket事件-----关闭ws', event);
        if (!hasExecuted) {
          commit('SOCKET_ONCLOSE', { commit, event });
          hasExecuted = true;
        }
      };
      //   socket.onmessage = this.websocketonmessage  发送信息
      state.socket.onmessage = (event) => {
        commit('SOCKET_ONMESSAGE', {
          commit,
          wsMessage: JSON.parse(event.data)
        });
      };
    }
  },
  // 关闭浏览器  关闭WebSocket连接
  // disconnectWebSocket({ state }) {
  //   if (state.socket) {
  //     state.close = true
  //     state.socket.send(JSON.stringify('close')); // 发送心跳消息
  //     state.socket.close();
  //     if (state.socket != null) {
  //       // state.socket.destroy()
  //       state.socket = null
  //     }
  //   }
  // },

  disconnectWebSocket({ state }) {
    if (state.socket) {
      state.close = true;
      if (state.socket.readyState === WebSocket.OPEN) {
        state.socket.send(JSON.stringify('发送心跳消息:close')); // 发送心跳消息
      }

      state.socket.close();
      state.socket = null;
      state.isItConnected = false;
    }
  },
  /**移除图片心跳包 清空图片列表 所有信息 */
  setUavImageListAboutAll({ state, commit }, data) {
    commit("Set_UavImageListAboutAll", data)
  },
  /** */
  cleardefaultUavImageData({ state, commit }, data) {
    commit("Clear_defaultUavImageData", data)
  },

  /**清理信息 */
  clearMessage({ state }) {
    state.ProcessWsMessage = { msg: "", show: false };
  },

  setProcessList({ state, commit }, processList) {
    commit("Set_ProcessList", { processList, isAdd: undefined })
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
