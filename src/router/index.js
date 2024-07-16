import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
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
        component: () =>
            import ('@/views/login/index'),
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
        component: () =>
            import ('@/views/main/index.vue'),
        meta: {
            icon: "main",
            title: "我的首页"
        },
        name: "index"
    },
    // {
    //     path: "/newpage",
    //     component: () =>
    //         import ('@/views/components/Cesium/drowcesium.vue'),
    //     meta: {
    //         icon: "main",
    //         // target: "_blank" // 在新窗口中打开
    //     },
    //     name: "newpage"
    // },

    // {
    //     path: "/so",
    //     component: () =>
    //         import ('@/views/components/ceshi/so.vue'),
    //     meta: {
    //         icon: "main",
    //         // target: "_blank" // 在新窗口中打开
    //     },
    //     name: "so"
    // },
    // {
    //     path: "/jsresize",
    //     component: () =>
    //         import ('@/views/lookmanager/jsresize.vue'), 
    //     meta: {
    //         icon: "main",
    //         // target: "_blank" // 在新窗口中打开
    //         title: "jsresize"
    //     },
    //     name: "jsresize"
    // },
    // {
    //     path: "/myChart",
    //     component: () =>
    //         import ('@/views/lookmanager/myChart.vue'), 
    //     meta: {
    //         icon: "main",
    //         // target: "_blank" // 在新窗口中打开
    //         title: "myChart"
    //     },
    //     name: "myChart"
    // },
    // myChart
    // {
    //     path: "/indexDb",
    //     component: () =>
    //         import ('@/views/components/ceshi/ceshi.vue'), 
    //     meta: {
    //         icon: "main",
    //         // target: "_blank" // 在新窗口中打开
    //         title: "indexDb"
    //     },
    //     name: "indexDb"
    // },




    // {
    //     path: '/lookmanager',
    //     name: 'index',
    //     component: () =>
    //         import ('@/views/lookmanager/lookmanager.vue'),
    //     meta: { title: '1识别管理', icon: 'uav_manage' },
    //     // hidden: true
    // },

// 无人机监控管理
        {
        path: '/uavsmanage', 
        component: Layout,
        name: 'uavsmanage',
        meta: { title: '监控管理', icon: 'el-icon-setting' },
        children: [
            // {
            //     path: '/pointmanager',
            //     name: 'index',
            //     component: () =>
            //         import ('@/views/pointManager/pointmanager.vue'),
            //     meta: { title: '航点管理', icon: 'uav_manage' }
            // },{
            //     path: '/replayAndReturnFlight',
            //     name: 'replayAndReturnFlight',
            //     component: () =>
            //         import ('@/views/replayAndReturnFlight/replayAndReturnFlight.vue'),
            //     meta: { title: '补播返航管理', icon: 'uav_manage' },
            //     // hidden: true
            // },{
            //     path: '/echars',
            //     name: 'echars',
            //     component: () =>
            //         import ('@/views/components/ECharts/waterLevelECharts.vue'),
            //     meta: { title: 'echars', icon: 'uav_manage' },
            //     hidden: true
            // },
            {
                path: '/lookmanager',
                name: 'index',
                component: () =>
                    import ('@/views/lookmanager/lookmanager.vue'),
                meta: { title: '1识别管理', icon: 'uav_manage' },
                // hidden: true
            },{
                path: 'planningManager',
                name: 'planningManager',
                component: () =>
                    import ('@/views/planningManager/planningManager.vue'),
                meta: { title: '2规划补播管理', icon: 'uav_manage' }
            },{
                path: '/uavmanager',
                name: 'index',
                component: () =>
                    import ('@/views/uavManager/uavmanager.vue'),
                meta: { title: '3无人机监控管理', icon: 'uav_manage' },
                // hidden: true
            },
            // {
            //     path: '/margin',
            //     name: 'margin',
            //     component: () =>
            //         import ('@/views/components/ceshi1/margin'),
            //     meta: { title: '巡检任务管理', icon: 'uav_manage' },
            //     // hidden: true
            // },
            // {
            //     path: '/ceshi2',
            //     name: 'ceshi2',
            //     component: () =>
            //         import ('@/views/components/ceshi2/ceshi2'),
            //     meta: { title: '二次定点航飞', icon: 'uav_manage' },
            //     // hidden: true
            // },
            // {
            //     path: '/ceshi3',
            //     name: 'ceshi3',
            //     component: () =>
            //         import ('@/views/components/ceshi3/ceshi3'),
            //     meta: { title: '客户现场实际任务规划', icon: 'uav_manage' },
            //     // hidden: true
            // },
            // {
            //     path: "/newpages",
            //     component: () =>
            //         import ('@/views/components/Cesium/drowcesium.vue'),
            //     meta: {
            //         icon: "main",
            //         title: "新页面",
            //         // target: "_blank" // 在新窗口中打开
            //     },
            //     name: "newpage"
            // },
        ]
    },


    // {
    //     path: '/index',
    //     name: 'index',
    //     redirect: '/index',
    //     component: Layout,
    //     children: [{
    //         path: '/index',
    //         name: 'index',
    //         component: () =>
    //             import ('@/views/main/index.vue'),
    //         meta: { title: '实时', icon: 'index' },
    //         hidden: true
    //     }]
    // },
    //系统管理(超管)
    {
        path: '/sysmanage', // menu id : 70
        component: Layout,
        name: 'sysmanage',
        meta: { title: '系统管理(超管)', icon: 'el-icon-setting' },
        children: [{
                path: 'company',
                name: 'company',
                component: () =>
                    import ('@/views/sysmanage/company'),
                meta: { title: '公司管理', icon: 'el-icon-goods' }
            },
            {
                path: 'uavfactory',
                name: 'uavfactory',
                component: () =>
                    import ('@/views/sysmanage/uavFactory'),
                meta: { title: '无人机厂商', icon: 'factory' }
            },
            {
                path: 'uavtype',
                name: 'uavtype',
                component: () =>
                    import ('@/views/sysmanage/uavType'),
                meta: { title: '无人机类型', icon: 'uav_type' }
            },
            {
                path: 'uav',
                name: 'uav',
                component: () =>
                    import ('@/views/sysmanage/uav'),
                meta: { title: '无人机管理', icon: 'uav_manage' }
            },
            {
                path: 'hive',
                name: 'hive',
                component: () =>
                    import ('@/views/sysmanage/hive'),
                meta: { title: '停机坪管理', icon: 'hive_gray' }
            },
            {
                path: 'uavhiverel',
                name: 'uavhiverel',
                component: () =>
                    import ('@/views/sysmanage/uavHiveSnIdRel'),
                meta: { title: '设备映射', icon: 'uavhiverel' }
            },
            {
                path: 'useradmin',
                name: 'useradmin',
                component: () =>
                    import ('@/views/sysmanage/userAdmin'),
                meta: { title: '管理员账户', icon: 'user_admin' }
            }
        ]
    },
    //系统管理(超管)

    // {
    //     path: '/user',
    //     component: Layout,
    //     name: 'user',
    //     meta: { title: '用户管理', icon: 'el-icon-user' },
    //     children: [{
    //             path: 'add',
    //             name: 'add',
    //             component: () =>
    //                 import ('@/views/user/add'),
    //             meta: { title: '添加用户', icon: 'el-icon-plus' }
    //         },
    //         {
    //             path: 'manage',
    //             name: 'manage',
    //             component: () =>
    //                 import ('@/views/user/manage'),
    //             meta: { title: '用户信息', icon: 'tree' }
    //         }
    //     ]
    // },

    // {
    //     path: '/notice',
    //     component: Layout,
    //     children: [{
    //         path: 'notice',
    //         name: 'notice',
    //         component: () =>
    //             import ('@/views/service/notice'),
    //         meta: { title: '公告', icon: 'notice' }
    //     }]
    // },

    // {
    //     path: 'external-link',
    //     component: Layout,
    //     children: [{
    //         path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
    //         meta: { title: '关于我们', icon: 'user' }
    //     }]
    // },
    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    mode: 'hash',
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router