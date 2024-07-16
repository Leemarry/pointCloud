import request from '@/utils/request'

export function connect(data) {
    return request({
        url: '/efUser/connect',
        method: 'post',
        data
    })
}
export function login(data) {
    return request({
        url: '/user/login',
        method: 'post',
        data
    })
}
export function getMyUavHive() {
    return request({
        url: '/user/getMyUavHive',
        method: 'post'
    })
}
export function getMyUavHiveVideo() {
    return request({
        url: '/user/getMyUavHiveVideo',
        method: 'post'
    })
}

export function getInfo(data) {
    return request({
        url: '/efUser/getInfo',
        method: 'post'
    })
}

export function updateEfuser(data) {
    return request({
        url: '/efUser/updateEfuser',
        method: 'post'
    })
}

export function logout(data) {
    return request({
        url: '/efUser/logout',
        method: 'post',
        data
    })
}
export function queryAllBigMan() {
    return request({
        url: '/user/queryAllBigMan',
        method: 'post'
    })
}
export function addBigMan(data) {
    return request({
        url: '/user/addBigMan',
        method: 'post',
        data
    })
}
export function deleteBigMan(data) {
    return request({
        url: '/user/deleteBigMan',
        method: 'post',
        data
    })
}
export function deleteBigManById(data) {
    return request({
        url: '/user/deleteBigManById',
        method: 'post',
        data
    })    
}

   // 用户绑定
    // 查询所有用户信息
export function queryAllUser() {
    return request({
        url: '/user/queryAllEfuser',
        method: 'post',
        
    })
}
// 查询所有用户绑定的无人机及停机坪信息、光伏板
export function queryAllUserHiveUav() {
    return request({
        url: '/user/queryAllUserRelation',
        method: 'post',
        
    })
}
//新增用户绑定无人机
export function addUserUav(data) {
    return request({
        url: '/user/addUserRelationUav',
        method: 'post',
        data
    })
}
export function addUserHive(data) {
    return request({
        url: '/user/addUserRelationHive',
        method: 'post',
        data
    })
}
// 新增用户绑定光伏板
export function addUserPv(data) {
    return request({
        url: '/user/addUserRelationPv',
        method: 'post',
        data
    })
}
// 删除用户单个无人机
export function deleteUserUav(data) {
    return request({
        url: '/user/deleteUserRelationUav',
        method: 'post',
        data
    })
}
// 删除用户所有无人机
export function deleteUserAllUav(data) {
    return request({
        url: '/user/deleteAllUserRelationUav',
        method: 'post',
        data
    })
}
// 删除用户单个停机坪
export function deleteUserHive(data) {
    return request({
        url: '/user/deleteUserRelationHive',
        method: 'post',
        data
    })
}
// 删除用户所有停机坪
export function deleteUserAllHive(data) {
    return request({
        url: '/user/deleteAllUserRelationHive',
        method: 'post',
        data
    })
}
// 删除用户所有光伏板 deleteUserAllPv
export function deleteUserAllPv(data) {
    return request({
        url: '/user/deleteAllUserRelationPv',
        method: 'post',
        data
    })
}
// 删除单个
export function deleteUserPv(data) {
    return request({
        url: '/user/deleteUserRelationPv',
        method: 'post',
        data
    })
}
// 查询用户操作记录
export function queryAllUserOperation(data) {
    return request({
        url: '/efUserOperation/queryAllUserOperation',
        method: 'post',
        data
    })
}
// 查询登录记录
export function queryAllUserLogin(data) {
    return request({
        url: '/efUserLogin/queryAllUserLogin',
        method: 'post',
        data
    })
}
// 查询路由接口
export function refreshMenu() {
    return request({
        url: '/user/queryMenu',
        method: 'post'
    })
}
// 查询路由接口
export function getRouters() {
    return request({
        url: '/user/queryMenu',
        method: 'post'
    })
}
// 单独修改收取
export function updateUserLimitTime(data) {
    return request({
        url: '/user/updateUserLimitTime',
        method: 'post',
        data
    })
}

// 注册发送短信验证码
export function sendSmsCode(data) {
    return request({
        url: '/verifycode/sendSmsCode',
        method: 'post',
        data
    })
}

// 注册
export function register(data) {
    return request({
        url: '/verifycode/register',
        method: 'post',
        data
    })
}
// 图像验证码
export function sendImageCode(data) {
    return request({
        url: '/verifycode/sendImageCode',
        method: 'post',
        data
    })
}

// 找回密码时，发送手机验证码
export function forgetSendSmsCode(data) {
    return request({
        url: '/verifycode/forgetSendSmsCode',
        method: 'post',
        data
    })
}

// 找回密码
export function forgetPassword(data) {
    return request({
        url: '/verifycode/forgetPassword',
        method: 'post',
        data
    })
}