/*
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2023-11-23 11:47:45
 * @LastEditors: likai 2806699104@qq.com
 * @LastEditTime: 2024-07-16 10:41:11
 */
import request from '@/utils/request'
/**获取无人机信息 /efapi/reseeding */
export function getUavs() {
    return request({
        url: '/uav/getUavs',
        method: 'post',
        timeout: 30000, // 设置超时时间为30秒
    })
}

/**下一个 */
export function nextwork() {
    return request({
        url: '/uav/nextwork',
        method: 'post',
    })
}
/**作业完毕 */
export function finishwork() {
    return request({
        url: '/uav/finishwork',
        method: 'post',
    })
}
/**开始作业 */
export function startwork() {
    return request({
        url: '/uav/startwork',
        method: 'post',
    })
}
/*投放 */
export function throwObject(data) {
    return request({
        url: '/uav/throwObject',
        method: 'post',
        data,
        timeout: 30000, // 设置超时时间为30秒
    })
}
/**无人机操作 */
export function doCommand() {
    return request({
        url: '/uav/doCommand',
        method: 'post',
    })
}


/**查询无人机该架次的图片列表 */
export function queryPhotoInfo(data) {
    return request({
        url: '/uav/queryPhotoInfo',
        method: 'post',
        data,
        timeout: 30000, // 设置超时时间为30秒
    })
}




//#region  控制命令


export function uploadTaskToUav(data) {
    return request({
        url: '/uav/uploadTaskToUav',
        method: 'post',
        data,
        timeout: 30000, // 设置超时时间为30秒
    })
}
/**解析kml航线信息经纬度 */
export function readerKml(data) {
    return request({
        url: 'uav/readkmz',
        method: 'post',
        data,
        timeout: 12000
    })

}


/**上传航线无人机 */
export function uploadMission(data) {
    const config = {}
    config.data = data.mission
    config.params = data.formdata;
    return request({
        url: '/uav/uploadMission',
        method: 'post',
        ...config,
        timeout: 30000, // 设置超时时间为30秒
    })
}

/**上传航线至minio */
export function saveRouteToMinio(data) {
    const config = {}
    config.data = data.mission
    config.params = data.formdata;
    return request({
        url: '/uav/saveRouteToMinioAll',
        method: 'post',
        ...config,
        timeout: 30000, // 设置超时时间为30秒
    })
}
export function editRouteTask(data) {
    return request({
        url: '/uav/editRouteTask',
        method: 'post',
        data,
    })
}

/**通过时间查询航线任务 */
export function queryKmzInfo(data) {
    return request({
        url: '/uav/queryKmzInfo',
        method: 'post',
        data,
        timeout: 30000, // 设置超时时间为30秒
    })
}

/**执行任务 飞行任务*/
export function startMission(data) {
    const config = {}
    // config.data=data.RequestBody
    // config.params= data.formdata;
    return request({
        url: '/uav/startMission',
        method: 'post',
        // ...config,
        data,
        timeout: 30000, // 设置超时时间为30秒
    })
}

/**暂停航线任务 */
export function pauseMission(data) {
    const config = {}
    // config.data=data.RequestBody
    // config.params= data.formdata;
    return request({
        url: '/uav/pauseMission',
        method: 'post',
        // ...config,
        data,
        timeout: 30000, // 设置超时时间为30秒
    })
}

/**停止航线任务 */
export function stopMission(data) {
    const config = {}
    // config.data=data.RequestBody
    // config.params= data.formdata;
    return request({
        url: '/uav/stopMission',
        method: 'post',
        // ...config,
        data,
        timeout: 30000, // 设置超时时间为30秒
    })
}

/**恢复航线任务 */
export function resumeMission(data) {
    const config = {}
    // config.data=data.RequestBody
    // config.params= data.formdata;
    return request({
        url: '/uav/resumeMission',
        method: 'post',
        // ...config,
        data,
        timeout: 30000, // 设置超时时间为30秒
    })
}

/**起飞操作 */
export function takeoff(data) {
    const config = {}
    // config.data=data.RequestBody
    // config.params= data.formdata;
    return request({
        url: '/uav/takeoff',
        method: 'post',
        // ...config,
        data,
        timeout: 30000, // 设置超时时间为30秒
    })
}

/**返航操作 */
export function rtl(data) {
    const config = {}
    // config.data=data.RequestBody
    // config.params= data.formdata;
    return request({
        url: '/uav/rtl',
        method: 'post',
        // ...config,
        data,
        timeout: 30000, // 设置超时时间为30秒
    })
}


/**控制无人机微调移动 */
export function moveUav(data) {
    const config = {}
    // config.data=data.RequestBody
    // config.params= data.formdata;
    return request({
        url: '/uav/moveUav',
        method: 'post',
        // ...config,
        data,
        timeout: 30000, // 设置超时时间为30秒
    })
}

export function guidToHere(data) {
    const config = {}
    // config.data=data.RequestBody
    // config.params= data.formdata;
    return request({
        url: '/uav/guidToHere',
        method: 'post',
        // ...config,
        data,
        timeout: 30000, // 设置超时时间为30秒
    })
}

//
export function MappingUtil(data) {
    const config = {}
    // config.data=data.RequestBody
    // config.params= data.formdata;
    return request({
        url: '/uav/MappingUtil',
        method: 'post',
        // ...config,
        data,
        timeout: 30000, // 设置超时时间为30秒
    })
}




export function queryWeather(params) {
    // queryWeather
    return request({
        // url:"https://api.seniverse.com/v3/weather/now.json",
        url: 'uav/queryWeather',
        method: 'post',
        params,
        timeout: 30000, // 设置超时时间为30秒
    })
}


//#endregion



/**查询飞行架次 */
export function queryFlightNumber(data) {
    return request({
        url: '/uav/queryFlightNumber',
        method: 'post',
        data,
        timeout: 30000, // 设置超时时间为30秒
    })
}

/**查询该架次下 或者图片下 的洞斑 */
export function queryHoleInfo(data) {
    return request({
        url: '/uav/queryHoleInfo',
        method: 'post',
        data,
        timeout: 30000, // 设置超时时间为30秒
    })
}
/**根据架次查询空斑补播信息 */
export function queryHoleSeedingInfoByeachsortieId(data) {
    return request({
        url: '/uav/queryHoleSeedingInfobyeachsortieId',
        method: 'post',
        data,
        timeout: 30000, // 设置超时时间为30秒
    })
}

export function queryHandle(payload) {
    const { formdata, url, that } = payload
    return request({
        url: '/uav/queryHandle',
        method: 'post',
        params: formdata,
        timeout: 30000, // 设置超时时间为30秒
    })
}

export function queryBlockList(data) {
    return request({
        url: '/uav/queryBlockList',
        method: 'post',
        data,
        timeout: 30000, // 设置超时时间为30秒
    })
}

export function queryPointList(data) {
    return request({
        url: '/uav/queryPointList',
        method: 'post',
        data,
        timeout: 30000, // 设置超时时间为30秒
    })
}

export function queryLineList(data) {
    return request({
        url: '/uav/queryLineList',
        method: 'post',
        data,
        timeout: 30000, // 设置超时时间为30秒
    })
}




export function confirmHandle(payload) {
    const { url, that, formdata } = payload
    return request({
        url: '/uav/confirmHandle',
        method: 'post',
        params: formdata,
        timeout: 30000, // 设置超时时间为30秒
    })
}

export function downloadRouteTask(data) {
    return request({
        url: '/uav/downloadRouteTask',
        method: 'post',
        data,
        timeout: 10000,
    })
}

export function uploadRouteTask(payload) {
    const { url, that, params, data } = payload
    return request({
        url: '/uav/uploadRouteTask',
        method: 'post',
        params,
        data,
        timeout: 35000, // 设置超时时间为30秒
    })
}

/**确认处理信息无误 */
export function finalHandle(payload) {
    const { url, that, params, data } = payload
    return request({
        url: '/uav/finalHandle',
        method: 'post',
        data,
        params,
        timeout: 30000, // 设置超时时间为30秒
    })
}

export function uploadFile(data) {
    return request({
        url: '/uav/uploadFile',
        method: 'post',
        data,
        timeout: 30000, // 设置超时时间为30秒
    })
}



export function uploadMediaResults(data) {
    return request({
        url: '/uav/uploadMediaResults',
        method: 'post',
        data,
        timeout: 30000, // 设置超时时间为30秒
    })
}

export function uploadMediaResult(payload) {
    const { formdata, params } = payload;
    return request({
        url: '/uav/uploadMediaResults',
        method: 'post',
        params,
        data: formdata,
        timeout: 30000, // 设置超时时间为30秒
    })
}
//




