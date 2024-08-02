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

//#endregion
