/*
 * @Date: 2024-07-18 18:05:09
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\store\modules\media.js
 * @Description: Do not edit
 */

import * as mediaApi from '@/api/media';
const getDefaultState = () => {
    return {
        name: 'media'
    }
}

const state = getDefaultState()

const mutations = {

}

const actions = {

    /**查询该架次图片 */
    queryPhotolist({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            mediaApi.queryPhotolist(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    queryList1({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            mediaApi.queryList1(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    downimg({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            mediaApi.downimg(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

}

export default {

    namespaced: true,
    state,
    mutations,
    actions
}
