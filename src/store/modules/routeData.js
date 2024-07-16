/*
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2024-02-23 15:43:55
 * @LastEditors: Andy
 * @LastEditTime: 2024-04-03 13:27:52
 */

const state = {
  /**当前上传航线信 */
  name: 'routeData公用数据',
  uavId: null,
  /**航线id currentMid */
  mid: null,
  /**统一高度 currentMidUnifiedHeight */
  unifiedHeight: null,
  /**经纬度数组  */
  geoCoordinates: [],
  positions: [],
  /**当前作业点 */
  currentWorkPoint: {
    /**当前Id */
    pointId: null,
    /**当前前作业点坐标 */
    positions: []
  }

};

/**
 * @name: 
 * @msg: 
 * @return {*}
 */
const mutations = {
  /**mutations上传航线信息 */
  setNewRouteData(state, { mid, geoCoordinates, unifiedHeight }) {
    state.unifiedHeight = unifiedHeight;
    state.geoCoordinates = geoCoordinates;
    state.mid = mid;
    /**随便移除 上一次作业数据 */
    if (state.currentWorkPoint) {
      state.currentWorkPoint.pointId = null;
  }
    if (state.currentWorkPoint.positions) {
      state.currentWorkPoint.positions.length = 0;
  }
  },

  setRoutePointList(state, { mid, positions, unifiedHeight }) {

  },
  SetCurrentWorkPoint(state, { pointId, positions }) {
    state.currentWorkPoint.pointId= pointId;
    state.currentWorkPoint.positions= positions
  }


};

const actions = {
  /**actions上传航线信息 */
  setRouteData({ commit, state }, { mid, geoCoordinates, unifiedHeight }) {
    commit('setNewRouteData', { mid, geoCoordinates, unifiedHeight }); // 触发 mutation
  },

  /**当前上传航线信息 */
  setRoutePointList({ commit, state }, { mid, positions, unifiedHeight }) {
    commit('setRoutePointList', {mid,positions,unifiedHeight})
  },
  /**作业当前到当前航点 */
  setcurrentWorkPoint({ commit, state }, { pointId, positions }) {
    commit('SetCurrentWorkPoint', { pointId, positions })
  },


};


export default {

  namespaced: true,
  state,
  mutations,
  actions
}
