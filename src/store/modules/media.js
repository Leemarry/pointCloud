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
    queryDistanceWithDis({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            mediaApi.queryDistanceWithDis(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    /**查询该架次图片 */
    delectPhotos({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            mediaApi.delectPhotos(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    deleteMdia({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            mediaApi.deleteMdia(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    delectVideos({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            mediaApi.delectVideos(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
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
    updatePointCloud({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            mediaApi.updatePointCloud(data).then(response => {
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
    miniodownload({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            mediaApi.miniodownload(data).then(response => {
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
