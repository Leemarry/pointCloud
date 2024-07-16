/*
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2023-12-06 09:17:59
 * @LastEditors: likai 2806699104@qq.com
 * @LastEditTime: 2024-07-15 08:59:01
 */
const state = {
  name: 'socketData公用数据',
  dailyData: {}, //用于存储每一天的数据
  ws: null, // socket
  tt: null, // 重连时的定时器
  wsUrl: "", // socket链接地址
  webSocketMsg: null, // socket推送回来的消息
  lockReconnect: false, // 是否真正建立连接
  timeout: 4000, //4秒一次心跳
  timeoutObj: null, //心跳心跳倒计时
  serverTimeoutObj: null, //心跳心跳倒计时
  webSocketData: null, // 心跳数据包
  messageId: null,
  deviceID: null,
  uavId: null,
  /**接收航线间距，航向间距，高度 */
  sliderValueObj: {
    spacing: 20,
    headingSpacing: 20,
    flyalt: 50
  }

};

/**
 * @name: 
 * @msg: 
 * @return {*}
 */
const mutations = {
  // getsocketData(state, payload) {
  //   console.log(payload);
  //   state.name = payload;
  // },
  SetSocketData(state, webSocketMsg) {
    const {
      messageId,
      code, // 1
      deviceID = webSocketMsg.data.uavId,
      message, // " "
      data, // data -- 数据
    } = webSocketMsg;
    state.messageId = messageId;
    state.deviceID = deviceID;
    state.webSocketData = data;
    state.uavId = deviceID;
  },
  setSocketDatabyDate(state, { date, webSocketMsg }) {
    console.log(webSocketMsg);
    const {
      messageId,
      code, // 1
      deviceID = webSocketMsg.data.uavId,
      message, // " "
      data, // data -- 数据
    } = webSocketMsg;
    state.messageId = messageId;
    state.deviceID = deviceID;
    state.webSocketData = data;
    state.uavId = deviceID;
    // if (!state.dailyData[date]) {  // 检查是否已存在当前日期的数据
    //     state.dailyData[date] = webSocketMsg;
    //   }
    // 如果该日期已经存在，则将数据添加到现有数组中
    if (state.dailyData[date]) {
      state.dailyData[date].push(data);
    } else { // 如果该日期不存在，则创建一个新数组，并将数据存储在其中
      state.dailyData[date] = [data];
    }
  },
  setRoutePointList(state, { mid, positions, unifiedHeight }) {
  },
  setSliderValueObj(state, {spacing ,headingSpacing ,flyalt}) {
    state.sliderValueObj.spacing=spacing;
    state.sliderValueObj.headingSpacing=headingSpacing;
    state.sliderValueObj.flyalt=flyalt;
  },

  // increment(state, payload) {
  //   console.log(payload);
  //   state.name = payload;
  // },


};

const actions = {
  setSocketData({ commit,   state}, webSocketMsg) {
  commit('SetSocketData', webSocketMsg); // 触发 mutation
  },
  setSocketDatabyDate({ commit,  state }, { date,   webSocketMsg }) {
    console.log(date);
    commit('setSocketDatabyDate', {
      date,
      webSocketMsg
    }); // 触发 mutation
  },
  /**当前上传航线信息 */
  setRoutePointList({  commit,  state }, { mid,  positions,  unifiedHeight }) {
    commit('setRoutePointList', { mid,  positions,  unifiedHeight
    })
  },

    /**当前上传航线信息 */
    setSliderValueObj({  commit,  state }, {spacing ,headingSpacing ,flyalt}) {
      commit('setSliderValueObj', {spacing ,headingSpacing ,flyalt})
    },




};


export default {

  namespaced: true,
  state,
  mutations,
  actions
}
