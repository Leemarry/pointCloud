/*
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2023-11-23 11:39:32
 * @LastEditors: Andy
 * @LastEditTime: 2024-04-24 13:27:08
 */
import * as uavApi from '@/api/uav';
 //头部引入： import * as uavApi from '@/api/uav';

const getDefaultState = () => {
    return {
        name: 'uav'
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        // Object.assign() 对象实现拷贝。
        Object.assign(state, getDefaultState())
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    increment(state, payload) {
        console.log(payload);
        state.name = payload;
    }
}

const actions = {
    /** 下一作业*/
    nextwork({ commit, state }, formdata) {
        return new Promise((resolve, reject) => {
            uavApi.nextwork().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    /**作业完毕 */
    finishwork({ commit, state },) {
        console.log(state.name); // 打印状态中的 count 属性
        return new Promise((resolve, reject) => {
            uavApi.finishwork().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    /**开始作业 */
    startwork({ commit, state },) {
        return new Promise((resolve, reject) => {
            uavApi.startwork().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    /**投放 */
    throwObject({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            uavApi.throwObject(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    /**无人机操作 */
    doCommand({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            uavApi.doCommand(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    /**查询该架次图片 */
    queryPhotoInfo({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            uavApi.queryPhotoInfo(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    /**getUavs 获取无人机xx */
    getUavs({ commit, state },) {
        return new Promise((resolve, reject) => {
            uavApi.getUavs().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    //#region  控制指令

    /**任务上传无人机 */
    uploadMission({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            uavApi.uploadMission(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    /**历史任务上传无人机 */
    uploadTaskToUav({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            uavApi.uploadTaskToUav(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    /**解析kml航线信息 */
    readerKml({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            uavApi.readerKml(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    /**上传至minio */
    saveRouteToMinio({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            uavApi.saveRouteToMinio(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    /**编辑历史航线信息 */
    editRouteTask({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            uavApi.editRouteTask(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    /**通过时间查询架次  */
    queryKmzInfo({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            uavApi.queryKmzInfo(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    /**执行任务 */
    startMission({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            uavApi.startMission(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    /**暂停任务 */
    pauseMission({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            uavApi.pauseMission(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    /**停止任务 */
    stopMission({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            uavApi.stopMission(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    /**恢复任务 */
    resumeMission({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            uavApi.resumeMission(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    /**起飞操作 */
    takeoff({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            uavApi.takeoff(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    /**返航操作 */
    rtl({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            uavApi.rtl(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    /**控制无人机微调移动 */
    moveUav({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            uavApi.moveUav(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    guidToHere({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            uavApi.guidToHere(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    MappingUtil({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            uavApi.MappingUtil(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    uploadMediaResult({ commit, state }, payload) {
        return new Promise((resolve, reject) => {
            uavApi.uploadMediaResult(payload).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },












 //头部引入： import * as uavApi from '@/api/uav';


    
    uploadMediaResults({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            uavApi.uploadMediaResults(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },




















    //#endregion
    //
    // 重新天气

    queryWeather({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            uavApi.queryWeather(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // #region 规划补播管理

    /**查询飞行架次 */
    queryFlightNumber({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            uavApi.queryFlightNumber(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    /**查询该架次下 或者图片下 的洞斑 */
    queryHoleInfo({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            uavApi.queryHoleInfo(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    /**根据架次查询空斑补播信息 */
    queryHoleSeedingInfoByeachsortieId({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            uavApi.queryHoleSeedingInfoByeachsortieId(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    /**c处理 */
    queryHandle({ commit, state }, payload) {
        return new Promise((resolve, reject) => {
            uavApi.queryHandle(payload).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    queryBlockList({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            uavApi.queryBlockList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
            // setTimeout(() => {
            //     const response  = {code:1,message:1,data:1}
            //     resolve(response)
            // }, 8000);
        })
    },
    queryPointList({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            uavApi.queryPointList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
            // setTimeout(() => {
            //     const response  = {code:1,message:6,data:1}
            //     resolve(response)
            // }, 8000);
        })
    },

    queryLineList({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            uavApi.queryLineList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },


    

    confirmHandle({ commit, state }, payload) {
        return new Promise((resolve, reject) => {
            uavApi.confirmHandle(payload).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    /**规划管理页面下载航线 */
    downloadRouteTask({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            uavApi.downloadRouteTask(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    /**上传*/
    uploadRouteTask({ commit, state }, payload) {
        return new Promise((resolve, reject) => {
            uavApi.uploadRouteTask(payload).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    /**确认处理信息无误 */
    finalHandle({ commit, state }, payload) {
        return new Promise((resolve, reject) => {
            uavApi.finalHandle(payload).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    uploadFile({ commit, state }, payload) {
        return new Promise((resolve, reject) => {
            uavApi.uploadFile(payload).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    




    // #endregion




}

export default {

    namespaced: true,
    state,
    mutations,
    actions
}