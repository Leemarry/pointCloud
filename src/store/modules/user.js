 import {
    connect,
    login,
    logout,
    getInfo,
    getMyUavHive,
    getMyUavHiveVideo,
    updateEfuser,
    queryAllBigMan,
    addBigMan,
    deleteBigMan,
    deleteBigManById,
    queryAllUser,
    queryAllUserHiveUav,
    addUserUav,
    addUserHive,
    addUserPv,
    deleteUserUav,
    deleteUserAllUav,
    deleteUserHive,
    deleteUserAllHive,
    deleteUserAllPv,
    deleteUserPv,
    queryAllUserLogin,
    queryAllUserOperation,
    updateUserLimitTime,
    refreshMenu,
    getRouters,
    sendSmsCode,
    sendImageCode,
    register,
    forgetSendSmsCode,
    forgetPassword
} from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { v4 as uuidv4 } from 'uuid'
import { constantRoutes } from '@/router'
import Layout from '@/layout/index'
const _import = require('@/router/_import_' + process.env.NODE_ENV) // 获取组件的方法

const getDefaultState = () => {
    return {
        minke:'minke',
        token: getToken(),
        refreshPage: true, // 是否是刷新页面，登录后变为false,如果刷新，则恢复为默认值true
        routes: [],
        addRoutes: [],
        clientId: '',
        userId: localStorage.getItem('userId') || '',
        loginId: '',
        name: '',
        companyInfo: null,
        userInfo: null,
        roleInfo: null,
        systemInfo: null,
        avatar: '',
        SM2PrivateKey: '',
        SM2PublicKey: '',
        trtcModel: {},
    }
}

// 1、存储状态,也就是变量
const state = getDefaultState()

// 2、get方法， 派生状态。也就是set、get中的get，有两个可选参数：state、getters分别可以获取state中的变量和其他的getters。外部调用方式：store.getters.personInfo()。就和vue的computed差不多；
// getters

// 3、set 方法, 提交状态修改。也就是set、get中的set，这是vuex中唯一修改state的方式，但不支持异步操作。 第一个参数默认是state。
// 外部调用方式：store.commit('SET_AGE', 18)。和vue中的methods类似。
const mutations = { 
    RESET_STATE: (state) => {
        // Object.assign() 对象实现拷贝。
        Object.assign(state, getDefaultState())
    },
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes
            // console.log('添加之前路由：↓')
            // console.log(constantRoutes)
        state.routes = constantRoutes.concat(routes)
            // console.log('添加之后路由：↓')
            // console.log(state.routes)
            // sessionStorage.setItem('routes', state.routes)
    },
    SET_SM2_PRIKEY: (state, key) => {
        state.SM2PrivateKey = key
    },
    SET_SM2_PUBKEY: (state, key) => {
        state.SM2PublicKey = key
    },
    /**有token连接ws */
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_REFRESH_PAGE: (state, refreshPage) => {
        state.refreshPage = refreshPage
    },
    SET_USER_ID: (state, userId) => {
        localStorage.setItem('userId',userId)
        state.userId = userId
    },
    SET_LOGIN_ID: (state, loginId) => {
        state.loginId = loginId
    },
    SET_CLIENT_ID: (state, clientId) => {
        state.clientId = clientId
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_COMPANY_INFO: (state, companyInfo) => {
        state.companyInfo = companyInfo
    },
    SET_SYSTEM_INFO: (state, systemInfo) => {
        state.systemInfo = systemInfo
    },
    SET_ROLE_INFO: (state, roleInfo) => {
        state.roleInfo = roleInfo
    },
    SET_USER_INFO: (state, userInfo) => {
        state.userInfo = userInfo
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_TRTC: (state, trtcModel) => {
        state.trtcModel = trtcModel
    }
}

function filterAsyncRouter(asyncRouterMap) {
    return asyncRouterMap.filter(route => {
        if (route.component) {
            if (route.component === 'Layout') {
                route.component = Layout
            } else {
                let url = route.component
                if (url.indexOf('views') >= 0) {
                    url = url.replace('/views/', '')
                }
                route.component = loadView(route.component)
            }
        }
        // console.log('filterAsyncRouter : 菜单项 = ' + route.component)
        if (route.children != null && route.children && route.children.length) {
            // console.log('filterAsyncRouter : 子集长度 = ' + route.children.length)
            route.children = filterAsyncRouter(route.children)
        }
        return true
    })
}

// function BuildRoutes(routes) {
//     let element = {
//         name: routes.name,
//         path: routes.path,
//         component: () =>
//             import (`@/${routes.component}.vue`)
//     };
//     if (routes.component == "") {
//         delete element.component;
//     }
//     if (!isNull(routes.children) || !isUndefined(routes.children)) {
//         element.children = [];
//         routes.children.forEach(item => {
//             element.children.push(BuildRoutes(item));
//         });
//         return element;
//     }
//     return element;
// }
// module.exports = file => require('@/views/' + file + '.vue').default
// const loadView = (view) => {
//         return (resolve) => require([`@/views/${view}.vue`], resolve)
//     }
const loadView = (view) => { // 路由懒加载
    try {
        let url = view
        if (url.indexOf('views') >= 0) {
            url = url.replace('/views/', '')
        }
        return _import(url)
    } catch (error) {
        console.error(error.message)
        return _import('404')
    }

    // return (resolve) => require([`@/views/${url}.vue`], resolve)
    // return () => import ('@/views/' + url + '.vue')
}

// 4、和mutations类似。不过actions支持异步操作。
// 第一个参数默认是和store具有相同参数属性的对象。外部调用方式：store.dispatch('nameAsyn')。
const actions = {
    connect({ commit }, userInfo) {
        const uuid = uuidv4()
        userInfo.ClientId = uuid
        return new Promise((resolve, reject) => {
            connect(userInfo).then(response => {
                const { data, code, message } = response
                if (code === 1) {
                    const { secret } = data
                    if (secret && secret != null) {
                        commit('SET_SM2_PRIKEY', secret.privateKey)
                        commit('SET_SM2_PUBKEY', secret.publicKey)
                    }
                    resolve()
                } else {
                    reject(message)
                }
                // 调用resolve方法时，Promise的状态就变成fulfilled，即操作成功状态
            }).catch(error => {
                reject(error)
                    // 意味着操作失败。
            })
        })
    },
    // user login
    login({ commit }, userInfo) {
        // debugger
        const uuid = uuidv4()
        userInfo.ClientId = uuid
        return new Promise((resolve, reject) => {
            login(userInfo).then(response => {
                const { data, code, message } = response
                if (code === 1) {
                    const { user, menu, secret, trtc } = data
                    // commit('SET_TRTC', trtc)
                    // commit('SET_REFRESH_PAGE', false)
                    commit('SET_USER_ID', user.id + '')
                    // commit('SET_CLIENT_ID', uuid)
                    commit('SET_TOKEN', message)
                    // commit('SET_LOGIN_ID', user.uloginName)
                    // commit('SET_NAME', user.uname)
                    // commit('SET_AVATAR', user.uico)
                    // commit('SET_COMPANY_INFO', user.efCompany)
                    // commit('SET_SYSTEM_INFO', user.efCompany.efSysteminfo)
                    // commit('SET_ROLE_INFO', user.efRole)
                    commit('SET_USER_INFO', user)
                    // if (secret && secret != null) {
                    //     commit('SET_SM2_PRIKEY', secret.privateKey)
                    //     commit('SET_SM2_PUBKEY', secret.publicKey)
                    // }
                    // const accessedRoutes = filterAsyncRouter(menu)
                    //     // accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
                    //     // console.log('登录后获取得到路由:↓')
                    //     // console.log(accessedRoutes)
                    // commit('SET_ROUTES', accessedRoutes)
                    setToken(message)
                    resolve()
                } else {
                    reject(message)
                }
                // 调用resolve方法时，Promise的状态就变成fulfilled，即操作成功状态
            }).catch(error => {
                reject(error)
                    // 意味着操作失败。
            })
        })
    },

    // 刷新页面，重新获取路由
    refreshMenu({ commit }) {
        return new Promise((resolve, reject) => {
            refreshMenu().then(response => {
                const { data, code, message } = response
                if (code === 1) {
                    commit('SET_REFRESH_PAGE', false)
                    const accessedRoutes = filterAsyncRouter(data)
                        // accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
                        // console.log(accessedRoutes)
                    commit('SET_ROUTES', accessedRoutes)
                    resolve()
                } else {
                    reject(message)
                }
                // 调用resolve方法时，Promise的状态就变成fulfilled，即操作成功状态
            }).catch(error => {
                reject(error)
                    // 意味着操作失败。
            })
        })
    },
    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo(state.token).then(response => {
                const { data } = response
                if (!data) {
                    return reject('验证失败，请重新登录！')
                }
                const json = JSON.parse(data)
                commit('SET_LOGIN_ID', json.uLoginName)
                commit('SET_NAME', json.uName)
                commit('SET_AVATAR', json.uIco)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    getMyUavHive() {
        return new Promise((resolve, reject) => {
            getMyUavHive().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    getMyUavHiveVideo() {
        return new Promise((resolve, reject) => {
            getMyUavHiveVideo().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // get user info
    updateEfuser({ commit, state }, parms) {
        return new Promise((resolve, reject) => {
            updateEfuser(parms).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout({ Token: state.token, ClientId: state.clientId }).then(() => {
                removeToken() // must remove  token  first
                resetRouter()
                commit('RESET_STATE')
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    queryAllBigMan({ commit, state }) {
        return new Promise((resolve, reject) => {
            queryAllBigMan().then((response) => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 单独修改收取
    updateUserLimitTime({ commit }, parm) {
        return new Promise((resolve, reject) => {
            updateUserLimitTime(parm).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    addBigMan({ commit }, parm) {
        return new Promise((resolve, reject) => {
            addBigMan(parm).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    deleteBigMan({ commit }, parm) {
        return new Promise((resolve, reject) => {
            deleteBigMan(parm).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    deleteBigManById({ commit }, parm) {
        return new Promise((resolve, reject) => {
            deleteBigManById(parm).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // 用户绑定
    // 查询所有用户
    queryAllUser({ commit }, ) {
        return new Promise((resolve, reject) => {
            queryAllUser().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    queryAllUserHiveUav({ commit }, ) {
        return new Promise((resolve, reject) => {
            queryAllUserHiveUav().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    addUserUav({ commit }, parm) {
        return new Promise((resolve, reject) => {
            addUserUav(parm).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    addUserHive({ commit }, parm) {
        return new Promise((resolve, reject) => {
            addUserHive(parm).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    addUserPv({ commit }, parm) {
        return new Promise((resolve, reject) => {
            addUserPv(parm).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // 删除用户单个无人机
    deleteUserUav({ commit }, parm) {
        return new Promise((resolve, reject) => {
            deleteUserUav(parm).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 删除用户所有无人机
    deleteUserAllUav({ commit }, parm) {
        return new Promise((resolve, reject) => {
            deleteUserAllUav(parm).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 删除用户单个停机坪
    deleteUserHive({ commit }, parm) {
        return new Promise((resolve, reject) => {
            deleteUserHive(parm).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // deleteUserAllHive
    deleteUserAllHive({ commit }, parm) {
        return new Promise((resolve, reject) => {
            deleteUserAllHive(parm).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 删除用户所有光伏板 
    deleteUserAllPv({ commit }, parm) {
        return new Promise((resolve, reject) => {
            deleteUserAllPv(parm).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 删除单个
    deleteUserPv({ commit }, parm) {
        return new Promise((resolve, reject) => {
            deleteUserPv(parm).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 查询用户操作记录
    queryAllUserOperation({ commit }, params) {
        return new Promise((resolve, reject) => {
            queryAllUserOperation(params).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // 查询登录记录
    queryAllUserLogin({ commit }, parm) {
        return new Promise((resolve, reject) => {
            queryAllUserLogin(parm).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 查询路由接口
    getRouters({ commit }) {
        return new Promise((resolve, reject) => {
            getRouters().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 发送短信验证码
    sendSmsCode({ commit }, parm) {
        return new Promise((resolve, reject) => {
            sendSmsCode(parm).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 注册
    register({ commit }, parm) {
        return new Promise((resolve, reject) => {
            register(parm).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 找回密码时，发送手机验证码
    forgetSendSmsCode({ commit }, parm) {
        return new Promise((resolve, reject) => {
            forgetSendSmsCode(parm).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 找回密码
    forgetPassword({ commit }, parm) {
        return new Promise((resolve, reject) => {
            forgetPassword(parm).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // 图像验证码
    sendImageCode({ commit }, parm) {
        return new Promise((resolve, reject) => {
            sendImageCode(parm).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken({ commit }) {
        console.log('sssssssssssssssssssssssssssssssssssss + resetToken')
        return new Promise(resolve => {
            removeToken() // must remove  token  first
            resetRouter()
            commit('RESET_STATE')
            resolve()
        })
    }
}

export default {
    // vuex中的store分模块管理，需要在store的index.js中引入各个模块，为了解决不同模块命名冲突的问题，将不同模块的namespaced:true，
    // 之后在不同页面中引入getter、actions、mutations时，需要加上所属的模块名

    namespaced: true,
    state,
    mutations,
    actions

    // 使用模块中的mutations、getters、actions时候，要加上模块名，例如使用commint执行mutations时
    // 格式：模块名/模块中的mutations
    // xxx/setUserInfo
    // this.$store.commit(“userInfo/setUserInfo”,userInfo)

    // 获取属性时同样加上模块名
    // 格式：store.state.模块名.模块属性
    // $store.state.userInfo.userName
}