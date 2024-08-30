/*
 * @Date: 2024-07-18 18:05:48
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\api\media.js
 * @Description: Do not edit
 */
/*
 * @Date: 2024-07-18 18:05:48
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\api\media.js
 * @Description: Do not edit
 */

import request from '@/utils/request'
import axios from 'axios'
import { data } from 'jquery'
// axios 重新点击取消上一次请求  // 取消重复请求  // 取消路由跳转所有请求
const { CancelToken } = axios
const cancel = ''

export function queryDistanceWithDis(formdata) {
    return request({
        url: '/media/photo/distance',
        method: 'post',
        data: formdata,
        timeout: 30000 // 设置超时时间为30秒
    })
}

export function delectPhotos(data) {
    const { url, formdata } = data
    return request({
        url,
        method: 'post',
        data: formdata,
        timeout: 30000 // 设置超时时间为30秒
    })
}
export function delectVideos(formdata) {
    return request({
        url: '/media/video/delects',
        method: 'post',
        data: formdata,
        timeout: 30000 // 设置超时时间为30秒
    })
}

export function deleteMdia(data) {
    const { url, formdata } = data
    return request({
        url,
        method: 'post',
        data: formdata,
        timeout: 30000 // 设置超时时间为30秒
    })
}

export function queryPhotolist(formdata) {
    return request({
        url: '/media/photo/querylist',
        method: 'post',
        data: formdata,
        timeout: 30000 // 设置超时时间为30秒
        // cancelToken: new axios.CancelToken(function executor(c) { // 设置 cancel token
        //     cancel && cancel() //这里的source为使用接口的页面设置的，需要取消请求的时候直接调用在这里已被赋值为函数的source就行了
        //     cancel = c
        // })
        // cancelToken: new CancelToken(cancelFn => {
        //     cancel && cancel()
        //     cancel = cancelFn
        // })
    })
}
export function updatePointCloud(data) {
    return request({
        url: '/media/updatePointCloud',
        method: 'post',
        data: data,
        timeout: 30000 // 设置超时时间为30秒
    })
}
export function queryList1(data) {
    const { url, formdata } = data
    return request({
        url,
        method: 'post',
        data: formdata,
        timeout: 30000 // 设置超时时间为30秒
        // cancelToken: new axios.CancelToken(function executor(c) { // 设置 cancel token
        //     cancel && cancel() //这里的source为使用接口的页面设置的，需要取消请求的时候直接调用在这里已被赋值为函数的source就行了
        //     cancel = c
        // })
    })
}

export function downimg(formdata) {
    return request({
        url: '/media/otherDownload',
        method: 'get',
        timeout: 30000 // 设置超时时间为30秒
        // cancelToken: new axios.CancelToken(function executor(c) { // 设置 cancel token
        //     cancel && cancel() //这里的source为使用接口的页面设置的，需要取消请求的时候直接调用在这里已被赋值为函数的source就行了
        //     cancel = c
        // })
    })
}

export function miniodownload(data) {
    const { url, self } = data
    console.log(data);
    return request({
        url,
        method: 'get',
        responseType: 'blob', // 设置响应类型为blob
        timeout: 30000, // 设置超时时间为30秒
        onDownloadProgress: (progressEvent) => {
            if (progressEvent.lengthComputable) {
                // console.log(Math.round(progressEvent.loaded * 100 / progressEvent.total) + '%')
                self.downLoadProgress = Math.round(progressEvent.loaded * 100 / progressEvent.total)
                // console.log(progressEvent,self)
            }
        }
    })
}
