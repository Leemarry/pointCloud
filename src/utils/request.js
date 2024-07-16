/*
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2023-11-13 10:49:39
 * @LastEditors: Andy
 * @LastEditTime: 2024-03-07 11:26:46
 */
import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { doEncrypt, doDecryptStr } from '@/utils/smUtil' // get token from cookie
import { encryptDes, decryptDes, encryptAes, decryptAes } from '@/utils/cryptoUtil' // get token from cookie

const needEncrypt = false // 是否需要加密
    // const needEncryptDes = false // 是否需要des加密
const needEncryptAes_S = false // 是否需要des加密
const needEncryptAes_R = false // 是否需要des解密

const iv = '553456qwdscfrtgb'
const aesKey = 'efsdfe124587jshqcgszmghstcw54735'
const urls = ['/efUser/login', 'efapi/uavsystem/efUser/login']
    // create an axios instance
const service = axios.create({
        // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
        baseURL:'efapi/reseeding', // url = base url + request url
        
        timeout: 8000 // request timeout
    })
    // request interceptor
service.interceptors.request.use(
    config => {
        if (config.data && config.data.timeout) {
            config.timeout = config.data.timeout * 1000 + 1000
        }
        if (store.getters.token) {
            config.headers['token'] = store.getters.token
        } else if (getToken()) {
            // 刷新页面时，store.getters.token 没值，从cookie获取
            config.headers['token'] = getToken()
        }
        if (needEncrypt) {
            const encrypt = urls.findIndex(item => (item = config.url))
            if (encrypt < 0) {
                config.data = doEncrypt(config.data, store.getters.sm2publicKey)
                    // console.log('请求[加密]:' + config.url)
            } else {
                // console.log('请求[不加密]:' + config.url)
            }
        }
        if (needEncryptAes_S) {
            config.data = { 'data': encryptAes(config.data, aesKey, iv) };
        }
        return config
    },
    error => {
        // do something with request error
        console.log('拦截器error',error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    /**
     * 对Http请求返回数据进行处理
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        let datas = response.data
        const httpStatus = response.status
        if (httpStatus === 200) {
            if (needEncrypt) {
                datas = doDecryptStr(datas, store.getters.sm2privateKey)
            }
            if (needEncryptAes_R) {
                const dataContent = datas.data
                datas = decryptAes(dataContent, aesKey, iv)
            }
        }
        return datas
    },
    error => {
        console.log('request error:' + error) // errError: timeout of 10000ms exceeded
        let message = error.message // timeout of 10000ms exceeded
        if (message.indexOf('timeout of') >= 0 && message.indexOf('exceeded') >= 0) {
            message = message.replace('timeout of', '执行超时 ')
            message = message.replace('exceeded', '')
            error.message = message
        }
        return Promise.reject(error)
    }
)

export default service