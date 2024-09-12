/*
 * @Date: 2024-07-19 11:00:32
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\store\modules\routeManage.js
 * @Description: Do not edit
 * 
 */

import * as routeApi from '@/api/routeManage';

const getDefaultState = () => {
    return {
        name: 'routeManage'
    }
}

const state = getDefaultState()

const mutations = {
}

const actions = {
    /**查询Kmz文件列表 */
    queryKmzlist({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            routeApi.queryKmzlist(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    queryKmzInfo({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            routeApi.queryKmzInfo(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    uploadKmz({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            routeApi.uploadKmz(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    delect({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            routeApi.delect(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}
