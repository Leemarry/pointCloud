import defaultSettings from '@/settings'

const { showSettings, fixedHeader, sidebarLogo } = defaultSettings

const state = {
    showSettings: showSettings,
    fixedHeader: fixedHeader,
    sidebarLogo: sidebarLogo,
    defaultUavIndex: 0,
    defaultHiveIndex: 0
}

// 更改值
const mutations = {
    CHANGE_SETTING: (state, { key, value }) => {
        // eslint-disable-next-line no-prototype-builtins
        if (state.hasOwnProperty(key)) {
            state[key] = value
        }
    },
    setDefaultUavIndex: (state, value) => {
        state.defaultUavIndex = value
    },
    setDefaultHiveIndex: (state, value) => {
        state.defaultHiveIndex = value
    }
}

// Action 类似于 mutation，不同在于：
// Action 提交的是 mutation，而不是直接变更状态。
// Action 可以包含任意异步操作。

const actions = {
    changeSetting({ commit }, data) {
        commit('CHANGE_SETTING', data)
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