/*
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2023-12-18 17:16:36
 * @LastEditors: Andy
 * @LastEditTime: 2024-03-21 13:53:12
 */
/*
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2023-12-06 10:25:24
 * @LastEditors: Andy
 * @LastEditTime: 2023-12-18 17:12:12
 */
/**
 * 此处导入store，是想要在mutations中的socketInit中调用start和reconnect
 * 不这样写的话，mutations中的方法在当前文件只有在actions中才能调用（我实现时是这样的），因此导入了再使用
 */
//  import store from "../index";
import store from '@/store';
let socket = null;
let timer = null;
let state = {
  wsMessage: null,
  sellerid: '',
  account: '',
  close: false,
  time: 6000,

  /**当前在线无人机 */
  currentlyOnlineUavId:'',
  /**当前-默认显示的心跳包--uavHeartbeatNow--用于显示false */
  onlineUavHeartbeat:{},
  /**默认无人机 */
  defaultUavSn:null,  // 修改
  /**默认无人机心跳包--uavHeartbeatNow--用于显示true */
  defaultUavHeartbeat:{},
  /**10010 图片  */
  imageHeartbeatList:[],
  /**默认无人机拍摄图片信息 */
  defaultUavImageData:{},
  /**默认无人机拍摄图片信息列表--用于显示列表 */
  defaultUavImageList:[]
  
};

const mutations = {
  //开启
  SOCKET_ONOPEN(state, info) {
    console.log('开启WebSocket连接', info);
  },
  // 关闭
  SOCKET_ONCLOSE(state, { commit, event }) {
    console.log('WebSocket连接已关闭');
    if (state.close) { //浏览器关闭
      clearInterval(timer); // 关闭心跳定时器
      socket.send('close'); // 发送心跳消息
    } else { //连接错误 || 服务器连接已关闭 || 收到消息返回信息不对
        commit('againRequest')
    }
  },
  // 收到消息
  SOCKET_ONMESSAGE(state,  { commit, message }) {
    state.wsMessage = message;

    state.defaultUavSn= message.data.uavId // 为什么这里可以修改 
    console.log(state.defaultUavSn);
    console.log('收到消息:', message);
    if ((message && message.code) || message.code == 0) localStorage.setItem(`messageId-${message.messageId}`, message.messageId)
    let onlineUavHeartbeatMessage =  message
    commit('Process_Message',onlineUavHeartbeatMessage)
  },

  //处理信息
  Process_Message({state,commit},onlineUavHeartbeatMessage){
    let index = -1; // 当前无人机在数组中的索引
    let isNowUav = false; // 是不是默认无人机
    let isNowHive = false; // 是不是默认
    var defaultData = null;
    let needForceUpdate = false;
    
    const {
        messageId, 
        code, // 1
        deviceID = onlineUavHeartbeatMessage.data.uavId, 
        message, // " "
        data, // data -- 数据
    } = onlineUavHeartbeatMessage;
                state.defaultUavHeartbeat.alt = data.alt;
                state.defaultUavHeartbeat.altabs = data.altabs;
                state.defaultUavHeartbeat.areMotorsOn = data.areMotorsOn;
                state.defaultUavHeartbeat.aremd = data.aremd;
                state.defaultUavHeartbeat.batteryValue = data.batteryValue;
                state.defaultUavHeartbeat.dataDate = data.dataDate;
                state.defaultUavHeartbeat.flightModeText = data.flightModeText;
                state.defaultUavHeartbeat.linkAirUpload = data.linkAirUpload;
                state.defaultUavHeartbeat.linkAirDownload = data.linkAirDownload;
                state.defaultUavHeartbeat.batteryPert = data.batteryPert;
                state.defaultUavHeartbeat.gpsStatusText = data.gpsStatusText;
                state.defaultUavHeartbeat.satecount = data.satecount;
                state.defaultUavHeartbeat.lng = data.lng;
                state.defaultUavHeartbeat.lat = data.lat;
                state.defaultUavHeartbeat.xySpeed = data.xySpeed;
                state.defaultUavHeartbeat.zSpeed = data.zSpeed;
                state.defaultUavHeartbeat.roll = data.roll;
                state.defaultUavHeartbeat.pitch = data.pitch;
                state.defaultUavHeartbeat.yaw = data.yaw.toFixed(2);
                state.defaultUavHeartbeat.flightTimeInSeconds = data.flightTimeInSeconds;
           

  },
    //处理信息
    async Process_Messages(state, {messageId,code, deviceID,message, data}) {
      let index = -1; // 当前无人机在数组中的索引 
      let isNowUav = false; // 是不是默认无人机
      let isNowHive = false; // 是不是默认
      var defaultData = null;
      
      var datas = await store.dispatch('ws/someAction')
      let key = 'defaultUav-' + datas.userId;
  
      state.defaultUavSn = localStorage.getItem(key)
      console.log(datas,key,state.defaultUavSn);
      if (deviceID == state.defaultUavSn) {
        isNowUav = true;
        defaultData = data;
        index = 1
      } 
      switch (messageId) {
        case 2200: // 大疆无人机心跳包
          // console.log('大疆无人机心跳包-2200',defaultData);
          if (isNowUav) {
            // console.log('当前无人机-2200');
            if(state.emptyUavHeartbeatTimer){
              // console.log('进入计时器-凄楚-大疆');
              for (var i = 0; i < state.emptyUavHeartbeatTimerList.length; i++) {
                clearTimeout(state.emptyUavHeartbeatTimerList[i]);
              }
              
              state.emptyUavHeartbeatTimerList = []; // 清空数组
              // clearTimeout(state.emptyUavHeartbeatTimer) 
            }
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
          }  else {
            // console.log('不是当前无人机-2200');
            state.emptyUavHeartbeatTimer = setTimeout(() => {
              // console.log('进入计时器2');
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
            }, 1000);
            state.emptyUavHeartbeatTimerList.push(state.emptyUavHeartbeatTimer)
          }
          break;
        case 2000: // 开源无人机心跳包
          // console.log('开源无人机心跳包-2000',defaultData);
          if (isNowUav) {
            console.log('当前无人机-2000');
            if(state.emptyUavHeartbeatTimer){
              // console.log('进入计时器- 清除-开源');
              // clearTimeout(state.emptyUavHeartbeatTimer) 
              for (var i = 0; i < state.emptyUavHeartbeatTimerList.length; i++) {
                clearTimeout(state.emptyUavHeartbeatTimerList[i]);
              }
              
              state.emptyUavHeartbeatTimerList = []; // 清空数组
            }
            state.defaultUavHeartbeat.alt = (Number(defaultData.alt) ).toFixed(1);
            state.defaultUavHeartbeat.altabs = (Number(defaultData.altabs) ).toFixed(1);
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
            state.defaultUavHeartbeat.lng = (Number(defaultData.lng) ).toFixed(5);  // / 10000000
            state.defaultUavHeartbeat.lat = (Number(defaultData.lat)).toFixed(5); //  / 10000000
            state.defaultUavHeartbeat.xySpeed = (Number(defaultData.xySpeed) / 100).toFixed(1);
            state.defaultUavHeartbeat.zSpeed = (Number(defaultData.zSpeed) / 100);
            state.defaultUavHeartbeat.roll = defaultData.roll;
            state.defaultUavHeartbeat.pitch = defaultData.pitch;
            state.defaultUavHeartbeat.yaw = Number(defaultData.yaw);
            state.defaultUavHeartbeat.flightTimeInSeconds = defaultData.flightTimeInSeconds;
            state.defaultUavHeartbeat.uavId = defaultData.uavId;
            state.defaultUavHeartbeat.messageId = 2000;
          }  else {
            console.log('不是当前无人机-2000');
      
            state.emptyUavHeartbeatTimer =    setTimeout(() => {
              console.log('进入计时器');
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
             }, 1000);
  
             state.emptyUavHeartbeatTimerList.push(state.emptyUavHeartbeatTimer)
            
          }
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
              state.imageHeartbeatList[index].array.unshift(data);
            } else {
              state.imageHeartbeatList.push({
                uavId: deviceID,
                array: [data],
              });
              index = state.imageHeartbeatList.length - 1;
            }
          } else {
            // 第一个 构造对象数组
            state.imageHeartbeatList.push({
              uavId: deviceID,
              array: [data],
            });
            index = 0;
          }
          if (isNowUav) {
            state.defaultUavImageData = defaultData; // 图片覆盖
            if (index >= 0 && state.imageHeartbeatList.length > index) {
              state.defaultUavImageList = state.imageHeartbeatList[index].array; // 设置为显示
            }
          } else {
            state.defaultUavImageData = {
              url:'',
            };
            state.defaultUavImageList.splice(0, state.defaultUavImageList.length); //清空
          }
          break;
        case 10021: // 10021 分析图片 所有无人机分析图片包
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
              console.log('当前图片数',state.resultimageHeartbeatList[index].array.length,state.resultimageHeartbeatList[index].array);
              state.resultimageHeartbeatList[index].array.unshift(data.url);
              state.resultimageHeartbeatList[index].url=data.url; // 当前分析结果图片
            } else {
              state.resultimageHeartbeatList.push({
                uavId: deviceID,
                array: [data.url],
                url:data.url
              });
              index = state.resultimageHeartbeatList.length - 1;
            }
          } else {
            // 第一个 构造对象数组
            state.resultimageHeartbeatList.push({
              uavId: deviceID,
              array: [data.url],
              url:data.url
              
            });
            index = 0;
          }
          if (isNowUav) {
            // 当前 分析结果的图片list 
            state.defaultUavResultImageData = state.resultimageHeartbeatList[index]
          } else {
            state.defaultUavResultImageData = {
              url:'',
              uavId:null,
              array:[],
            };
            // state.defaultUavImageList.splice(0, state.defaultUavImageList.length);
          }
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
        console.log('处理返回的数据包');
          break;
      }
  
  
    },
  // 连接错误
  SOCKET_ONERROR(state, { commit, event }) {
    console.error('WebSocket连接错误:', event);
    commit('againRequest')
  },
  // 重新开启ws
  againRequest(state) {
    console.log(`${state.time},重新开启ws`);
    clearInterval(timer); // 关闭心跳定时器
    localStorage.removeItem('workerID')
    localStorage.removeItem('connectionID')
    console.log();
    setTimeout(() => {
        const data= {
            id:'101',
            token:store.getters.token,
          }
        store.dispatch('ws/onopenWebSocket',data)  
    }, state.time)
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
  }
};

const actions = {
  webSocketInit({commit}, url) {
    commit("socketInit", url);
  },
  
  someAction({ state, commit, rootState }) {
    // 通过 rootState 来访问其他模块的状态
    console.log(rootState.user);
    return rootState.user
  },
  // 创建WebSocket连接
  onopenWebSocket({state,commit}, data) {
    let hasExecuted = false;
    state.id = data.id;
    // 获取token
    if (store.getters.token) {
      if (socket !== null) {
        console.log('socket不为null');
        try {
          // socket  this.webSocket
          socket.destroy()
        } catch (error) {}
        socket = null
      }

      // socket = new WebSocket(`ws://地址?id=${data.id}`);
      const URL = (location.protocol === "https:" ? "wss" : "ws") + '://' + location.host + '/websocketapi/' + store.getters.token

      // console.log('连接地址：' + URL)
      socket = new WebSocket(URL)
      // 监听WebSocket事件
      //   socket.onopen = this.websocketonopen
      socket.onopen = (event) => {
        console.log('actions-监听WebSocket事件-----连接ws', event);
        commit('SOCKET_ONOPEN', {
          id: state.sellerid
        });
      };
      //   socket.onerror = this.websocketonerror
      socket.onerror = (event) => {
        console.log('actions-监听WebSocket事件-----连接ws错误');
        if (!hasExecuted) {
          commit('SOCKET_ONERROR', { commit, event });
          hasExecuted = true;
        }
      };
      //   socket.onclose = this.websocketclose
      socket.onclose = (event) => {
        console.log('actions-监听WebSocket事件-----关闭ws', event);
        if (!hasExecuted) {
          commit('SOCKET_ONCLOSE', { commit, event });
          hasExecuted = true;
        }
      };
      //   socket.onmessage = this.websocketonmessage  发送信息
      socket.onmessage = (event) => {
        commit('SOCKET_ONMESSAGE', { commit, message: JSON.parse(event.data) } );
      };
    }
  },
  // 关闭浏览器  关闭WebSocket连接
  disconnectWebSocket ({ state }) {
        if (socket) {
          state.close = true
          socket.send(JSON.stringify('close'));// 发送心跳消息
          socket.close();
          if (socket !== null) {
            socket.destroy()
            socket=null
          }
        }
      },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};

