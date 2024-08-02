import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// 创建一个全局变量，用于存储所有未完成的 Axios 请求的 cancel 函数
window._axiosPromiseArr = [];
// 草地补斑 注意 ************** 去掉redirect，否则可能一直死循环
var getRouter
const whiteList = ['/login', '/flying'] // no redirect whitelist
router.beforeEach(async(to, from, next) => {
    // 遍历所有未完成的请求，并调用 cancel 方法
    window._axiosPromiseArr.forEach(({ cancel }, index) => {
        cancel(); // 取消请求
        delete window._axiosPromiseArr[index]; // 删除已取消的请求项
    });

    // 原文链接：https://blog.csdn.net/weixin_45366905/article/details/110134795
    // start progress bar
    NProgress.start()
    // set page title
    document.title = getPageTitle(to.meta.title)

    console.log('当前页面：' + from.path + ', 准备去页面：' + to.path)
    // determine whether the user has logged in
    const hasToken = getToken()
    // console.log(hasToken);
    if (to.path === '/404') {
        next()
        NProgress.done()
    }
    if (hasToken) {
        // 应该已经登录
        if (to.path === '/login') {
            next(); // 如果进登录界面，则直接进，不用重定向到主页
            // next({ path: '/index' }) // 如果已登录，重定向到主页
            // NProgress.done()
        } else {
            console.log('数据全都正常，正常方向');
            next() // 数据全都正常，正常方向
            // const hasGetUserInfo = store.getters.name
            //     // console.log('当前登录用户信息：' + hasGetUserInfo)
            // let accessRoutes = store.getters.permission_routes
            // let isLogin = false // 是否已经登录
            // let hasRoute = true // 是否有路由表
            // if (hasGetUserInfo) {
            //     isLogin = true
            // }
            // if (accessRoutes && accessRoutes.length > 0) {
            //     hasRoute = true
            // }
            // if (isLogin === true && hasRoute === true && getRouter === true) {
            //     next() // 数据全都正常，正常方向
            // } else {
            //     next(`/login?` + Date.now())
            //     NProgress.done()
            // }
        }
    } else {
        // 没有登录
        getRouter = null
        /* 没有 token */
        if (whiteList.indexOf(to.path) !== -1) {
            // 在免费登录白名单中，直接进入
            next()
        } else {
            // 没有访问权限的其他页面将重定向到登录页面。
            next(`/login?` + Date.now())
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})

// async function routerGo(to, next) {
//     try {
//         getRouter = filterAsyncRouter(getRouter) //过滤路由
//     } catch (error) {}
//     router.addRoutes(getRouter) //动态添加路由
//     global.antRouter = getRouter //将路由数据传递给全局变量，做侧边栏菜单渲染工作
//     next({
//         ...to,
//         replace: true

