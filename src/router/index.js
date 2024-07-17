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
export const constantRoutes = [{
        path: '/login',
        component: () =>import ('@/views/login/index'),
        hidden: true,
        children: []
    },
    {
        path: '/',
        redirect: '/login',
        hidden: true,
        children: []
    },
    {
        path: "/index",
        component: () =>import ('@/views/main/index.vue'),
        meta: { icon: "main", title: "我的首页" },
        name: "index"
    },
  
//#region 无人机监控管理
    //     {
    //     path: '/uavsmanage', 
    //     component: Layout,
    //     name: 'uavsmanage',
    //     meta: { title: '监控管理', icon: 'el-icon-setting' },
    //     // 重定向
    //     redirect: '/lookmanager',
    //     children: [
    //         {
    //             path: '/lookmanager',
    //             name: 'look',
    //             component: () =>
    //                 import ('@/views/lookmanager/lookmanager.vue'),
    //             meta: { title: '1识别管理', icon: 'uav_manage' },
    //             // hidden: true
    //         },{
    //             path: '/planningManager',
    //             name: 'planningManager',
    //             component: () =>
    //                 import ('@/views/planningManager/planningManager.vue'),
    //             meta: { title: '2规划补播管理', icon: 'uav_manage' }
    //         },{
    //             path: '/uavmanager',
    //             name: 'index',
    //             component: () =>
    //                 import ('@/views/uavManager/uavmanager.vue'),
    //             meta: { title: '3无人机监控管理', icon: 'uav_manage' },
    //             // hidden: true
    //         },
    //     ]
    // },
    // #endregion
    {
        path:'/uploadpage',
        meta: { title: '上传窗口', icon: 'el-icon-setting' },
        name: "uploadpage",
        component: () => import ('@/views/mediaUpload/index.vue'),
        hidden:true
    },
    {
        path:'/preview',
        meta: { title: '预览', icon: 'el-icon-setting' },
        name: "preview",
        component: () => import ('@/views/mediaPreview/index.vue'),
        hidden:true
    },
    {
        path:'/previewPointcloud',
        meta: { title: '预览', icon: 'el-icon-setting' },
        name: "previewPointcloud",
        component: () => import ('@/views/mediaPreviewPointCloud/index.vue'),
        hidden:true
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
                component: () => import ('@/views/mediaManage/index.vue'),
                meta: { title: '图片媒体', icon: 'el-icon-picture' },
            },
            {
                path: '/videoMeia',
                name: 'videoMeia',
                component: () =>
                    import ('@/views/mediaManage/videoMedia/index.vue'),
                meta: { title: '视频媒体', icon: 'el-icon-camera-solid' },
            },
            {
                path: '/pointCloud',
                name: 'pointCloud',
                component: () =>
                    import ('@/views/mediaManage/pointcloudMedia/index.vue'),
                meta: { title: '点云数据', icon: 'el-icon-s-help' },
            },
            {
                path: '/reportMedia',
                name: 'reportMedia',
                component: () =>
                    import ('@/views/mediaManage/analysisReport/index.vue'),
                meta: { title: '分析报告', icon: 'uav_manage' },
            }
        ]
    },
    //#endregion

    //  //#region 媒体
    //  {
    //     path: '/mediaManage', 
    //     component: Layout,
    //     name: 'mediaManage',
    //     meta: { title: '数据管理', icon: 'el-icon-setting' },
    //     // 重定向
    //     redirect: '/photoMedia',
    //     children: [
    //         {
    //             path: '/photoMedia',
    //             name: 'photoMedia',
    //             component: () =>
    //                 import ('@/views/mediaManage/index.vue'),
    //             meta: { title: '图片媒体', icon: 'uav_manage' },
    //         }
    //     ]
    // },
    // //#endregion
    //系统管理(超管)
    // {
    //     path: '/sysmanage', // menu id : 70
    //     component: Layout,
    //     name: 'sysmanage',
    //     meta: { title: '系统管理(超管)', icon: 'el-icon-setting' },
    //     children: [{
    //             path: 'company',
    //             name: 'company',
    //             component: () =>
    //                 import ('@/views/sysmanage/company'),
    //             meta: { title: '公司管理', icon: 'el-icon-goods' }
    //         },
    //         {
    //             path: 'uavfactory',
    //             name: 'uavfactory',
    //             component: () =>
    //                 import ('@/views/sysmanage/uavFactory'),
    //             meta: { title: '无人机厂商', icon: 'factory' }
    //         },
    //         {
    //             path: 'uavtype',
    //             name: 'uavtype',
    //             component: () =>
    //                 import ('@/views/sysmanage/uavType'),
    //             meta: { title: '无人机类型', icon: 'uav_type' }
    //         },
    //         {
    //             path: 'uav',
    //             name: 'uav',
    //             component: () =>
    //                 import ('@/views/sysmanage/uav'),
    //             meta: { title: '无人机管理', icon: 'uav_manage' }
    //         },
    //         {
    //             path: 'hive',
    //             name: 'hive',
    //             component: () =>
    //                 import ('@/views/sysmanage/hive'),
    //             meta: { title: '停机坪管理', icon: 'hive_gray' }
    //         },
    //         {
    //             path: 'uavhiverel',
    //             name: 'uavhiverel',
    //             component: () =>
    //                 import ('@/views/sysmanage/uavHiveSnIdRel'),
    //             meta: { title: '设备映射', icon: 'uavhiverel' }
    //         },
    //         {
    //             path: 'useradmin',
    //             name: 'useradmin',
    //             component: () =>
    //                 import ('@/views/sysmanage/userAdmin'),
    //             meta: { title: '管理员账户', icon: 'user_admin' }
    //         }
    //     ]
    // },
    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    mode: 'history',//'hash',
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router