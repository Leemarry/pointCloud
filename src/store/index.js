/*
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2023-11-13 10:49:39
 * @LastEditors: Andy
 * @LastEditTime: 2023-12-18 10:27:58
 */
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import uavs from './modules/uav'
// import uavi from './modules/uav'

import publicData from './modules/publicData'; // 公用数据仓库
import websocket from './modules/websocket'
import routeData from './modules/routeData'
import ws from './modules/ws'


// import permission from './modules/permission'
Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        app,
        settings,
        // permission,
        user,
        uavs,
        publicData,
        websocket,
        routeData,
        ws,
    },
    getters
})

export default store