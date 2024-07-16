/*
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2024-03-15 14:59:27
 * @LastEditors: Andy
 * @LastEditTime: 2024-03-19 13:16:16
 */
import Vue from 'vue'
 
// 存储所有的事件
const EventStore = {}
const Index = new Vue()
 
const destoryHandler = function() {
    // this 为调用此方法的vue组件
    const currentEventObj = EventStore[this._uid]
    if (!currentEventObj) {
        return
    }
    for (const type in currentEventObj) {
        const key = Array.isArray(type) ? type.join(',') : type
        // Index 解绑事件
        Index.$off(type, currentEventObj[key])
    }
    // 删除记录的事件集合
    delete EventStore[this._uid]
}
 
const BusFactory = (vm) => {
    console.log('BusFactory',vm);
    // 获取当前组件实例的destroyed生命周期
    const destroyed = vm.$options.destroyed
    // 获取当前组件实例的uid
    const uid = vm._uid
 
    EventStore[uid] = {}
 
    !destroyed.includes(destoryHandler) && destroyed.push(destoryHandler)
 
    return {
        $on: (type, handler) => {
            const key = Array.isArray(type) ? type.join(',') : type
            EventStore[uid][key] = handler
            Index.$on(type, handler)
        },
        $off: (type, handler) => {
            if (!type) {
                delete EventStore[uid]
                Index.$off()
                return
            }
            const key = Array.isArray(type) ? type.join(',') : type
            // 删除对应的事件
            delete EventStore[uid][key]
            Index.$off(type, handler)
        },
        $once: (...params) => Index.$once(...params),
        $emit: (...params) => Index.$emit(...params)
    }
}
 
// 这两行是允许bus不调用依然能够触发emit和once
BusFactory.$emit = (...params) => Index.$emit(...params)
BusFactory.$once = (...params) => Index.$once(...params)
 
export default BusFactory