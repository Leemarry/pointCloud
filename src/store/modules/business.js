/*
 * @Date: 2024-07-18 18:05:09
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\store\modules\business.js
 * @Description: Do not edit
 */

import * as businessApi from '@/api/business';
const getDefaultState = () => {
    return {
        name: 'point'
    }
}

const state = getDefaultState()

const mutations = {

}

const actions = {
    getDangerPointList({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            businessApi.getDangerPointList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // #region ta
    getTowerList({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            businessApi.getTowerList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    handTower({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            businessApi.handTower(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    //#endregion

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
