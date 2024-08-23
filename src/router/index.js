/*
 * @Date: 2024-07-16 09:54:47
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\router\index.js
 * @Description: Do not edit
 */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* 后台 */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
    {
        path: '/',
        redirect: '/login',
        hidden: true,
        children: []
    }, {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },
    {
        path: '/index',
        component: () => import('@/views/main/index.vue'),
        meta: { icon: 'main', title: '我的首页' },
        name: 'index'
    },
    {
        path: '/uploadphoto',
        meta: { title: '上传窗口', icon: 'el-icon-setting' },
        name: 'uploadpage',
        component: () => import('@/views/mediaUpload/index.vue'),
        hidden: true
    },
    {
        path: '/uploadpage',
        meta: { title: '上传窗口', icon: 'el-icon-setting' },
        name: 'uploadpage',
        component: () => import('@/views/mediaUpload/indexss.vue'),
        hidden: true
    },
    {
        path: '/preview',
        meta: { title: '预览文本', icon: 'el-icon-setting' },
        name: 'preview',
        component: () => import('@/views/mediaPreview/index.vue'),
        hidden: true
    },
    {
        path: '/full',
        meta: { title: '测试全屏', icon: 'el-icon-setting' },
        name: 'full',
        component: () => import('@/views/mediaPreview/full.vue'),
        hidden: true
    },
    {
        path: '/previewPointcloud',
        meta: { title: '预览点云', icon: 'el-icon-setting' },
        name: 'previewPointcloud',
        component: () => import('@/views/mediaPreviewPointCloud/index.vue'),
        hidden: true
    },
    {
        path: '/routeManage',
        component: Layout,
        name: 'routeManage',
        meta: { title: '航线管理', icon: 'el-icon-setting' },
        // 重定向
        redirect: '/kmzManage',
        children: [
            {
                path: '/kmzManage',
                name: 'kmzManage',
                component: () => import('@/views/routeManage/kmzManage/index.vue'),
                meta: { title: 'Kmz管理', icon: 'el-icon-picture' }
            }

        ]
    },
    {
        path: '/serviceManage',
        component: Layout,
        name: 'serviceManage',
        meta: { title: '服务管理', icon: 'el-icon-setting' },
        // 重定向
        redirect: '/point',
        children: [
            {
                path: '/tower',
                name: 'tower',
                component: () => import('@/views/businessMange/towerManage/index.vue'),
                meta: { title: '杆塔管理', icon: 'el-icon-picture' }
            },
            {
                path: '/towerline',
                name: 'towerline',
                component: () => import('@/views/businessMange/towerLineManage/index.vue'),
                meta: { title: '杆线管理', icon: 'el-icon-picture' }
            },
            {
                path: '/point',
                name: 'point',
                component: () => import('@/views/businessMange/dangerousPointManage/index.vue'),
                meta: { title: '危险点管理', icon: 'el-icon-picture' }
            }

        ]
    },
    //#region 媒体
    {
        path: '/mediaManage',
        component: Layout,
        name: 'mediaManage',
        meta: { title: '数据管理', icon: 'el-icon-setting' },
        // 重定向
        redirect: '/photoMedia',
        children: [
            {
                path: '/photoMedia',
                name: 'photoMedia',
                component: () => import('@/views/mediaManage/photoMedia/index.vue'),
                meta: { title: '图片媒体', icon: 'el-icon-picture' }
            },
            {
                path: '/videoMeia',
                name: 'videoMeia',
                component: () =>
                    import('@/views/mediaManage/videoMedia/index.vue'),
                meta: { title: '视频媒体', icon: 'el-icon-camera-solid' }
            },
            {
                path: '/pointCloud',
                name: 'pointCloud',
                component: () =>
                    import('@/views/mediaManage/pointcloudMedia/index.vue'),
                meta: { title: '点云数据', icon: 'el-icon-s-help' }
            },
            {
                path: '/orthoImg',
                name: 'orthoImg',
                component: () =>
                    import('@/views/mediaManage/orthoImg/index.vue'),
                meta: { title: '正射影像', icon: 'el-icon-picture' }
            }

        ]
    },
    {
        path: '/reportManage',
        component: Layout,
        name: 'reportManage',
        meta: { title: '报告管理', icon: 'el-icon-setting' },
        // 重定向
        redirect: '/analysisReport',
        children: [
            {
                path: '/analysisReport',
                name: 'analysisReport',
                component: () =>
                    import('@/views/reportManage/analysisReport/index.vue'),
                meta: { title: '分析报告', icon: 'uav_manage' }
            }

        ]
    },
    // //#endregion
    // // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true },
    // 通配符路由，用于处理未匹配到的路由
    { path: '/404', component: () => import('@/views/404.vue') }
]
const createRouter = () => new Router({
    // mode: 'history', // require service support
    // scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
    mode: 'history' //'hash',
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    // const newRouter = createRouter()
    // router.matcher = newRouter.matcher // reset router
}

export default router
