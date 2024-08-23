/*
 * @Date: 2024-07-22 10:39:31
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\api\business.js
 * @Description: Do not edit
 */
import request from '@/utils/request'
// import axios from 'axios'
// const { CancelToken } = axios
// let cancel = ''
export function getDangerPointList(formdata) {
    return request({
        url: '/business/dangerPoint/querylist',
        method: 'post',
        data: formdata
    })
}
//#regin ta
export function getTowerAllList(formdata) {
    return request({
        url: '/business/tower/queryAlllist',
        method: 'post',
        data: formdata
    })
}

export function getTowerList(formdata) {
    return request({
        url: '/business/tower/querylist',
        method: 'post',
        data: formdata
        // cancelToken: new CancelToken(cancelFn => {
        //     cancel && cancel()
        //     cancel = cancelFn
        // })
    })
}

export function delectTower(data) {
    return request({
        url: '/business/tower/delect',
        method: 'post',
        data: data
    })
}

export function delectTowerLine(data) {
    return request({
        url: '/business/line/delect',
        method: 'post',
        data: data
    })
}

export function getTowerLineList(formdata) {
    return request({
        url: '/business/line/querylist',
        method: 'post',
        data: formdata
        // cancelToken: new CancelToken(cancelFn => {
        //     cancel && cancel()
        //     cancel = cancelFn
        // })
    })
}

export function handTower(reqData) {
    const { data, url } = reqData
    return request({
        url,
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json'
        }
        // cancelToken: new CancelToken(cancelFn => {
        //     cancel && cancel()
        //     cancel = cancelFn
        // })
    })
}
export function handTowerLine(reqData) {
    const { data, url } = reqData
    return request({
        url,
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
//#endregion
