/*
 * @Date: 2024-07-19 11:01:28
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\api\routeManage.js
 * @Description: Do not edit
 */

import request from '@/utils/request'
export function queryKmzlist(formdata) {
    return request({
        url: '/route/kmz/querylist',
        method: 'post',
        data: formdata
    })
}
export function queryKmzInfo(formdata) {
    return request({
        url: '/route/kmz/querylistByTime',
        method: 'post',
        data: formdata
    })
}
export function uploadKmz(formdata) {
    return request({
        url: '/route/kmz/upload',
        method: 'post',
        // headers: {
        //     'Content-Type': 'application/json'
        // },
        data: formdata
    })
}
