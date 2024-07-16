<!--
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2024-01-25 13:55:47
 * @LastEditors: Andy
 * @LastEditTime: 2024-04-10 16:00:13
-->
<!--  -->
<template>
<pvVideoPlayer v-bind="$attrs" v-on="$listeners"  ></pvVideoPlayer>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import pvVideoPlayer from '@/views/components/VideoModule/pvVideoPlayer'
export default {
  name: '',
//import引入的组件需要注入到对象中才能使用
components: {
    pvVideoPlayer,
},
data() {
//这里存放数据
return {

};
},
//让组件接收外部传来的数据
 props: {
//   defaultSnInfo:{
//             type:Object,
//             default:function(){
//                 return {}
//             }

//         },
},
//监听属性 类似于data概念
computed: {},
//监控data中的数据变化
watch: {},
//方法集合
methods: {

 

},
//生命周期 - 创建完成（可以访问当前this实例）
created() {
},
//生命周期 - 挂载完成（可以访问DOM元素）
mounted() {

},
beforeCreate() {}, //生命周期 - 创建之前
beforeMount() {}, //生命周期 - 挂载之前
beforeUpdate() {}, //生命周期 - 更新之前
updated() {}, //生命周期 - 更新之后
beforeDestroy() {}, //生命周期 - 销毁之前
destroyed() {}, //生命周期 - 销毁完成
activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类

</style>