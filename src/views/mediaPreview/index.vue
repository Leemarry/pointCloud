<!--
 * @Date: 2024-07-16 16:49:09
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\views\mediaPreview\index.vue
 * @Description: Do not edit
-->
<!--  -->
<template>
<div style='height: 100vh; width: 100wh;'>
          <iframe
  className="pdf-iframe"
  title="预览文档"
  src="http://127.0.0.1:9090/ceshi/11.pdf"
  
  width="100%"
  height="100%"
></iframe>
<!-- http://127.0.0.1:9090/ceshi1/video/layout-header.mp4 -->
<!-- http://127.0.0.1:9090/ceshi/11.pdf -->
<!-- https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg -->
</div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等!）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  name: '',
//import引入的组件需要注入到对象中才能使用
components: {},
data() {
//这里存放数据
return {
    src:''
};
},
//让组件接收外部传来的数据
 props: {
   
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
// 获取当前页面的 URL
const url = new URL(window.location.href);
console.log('Current URL:', url);
const urlParams = new URLSearchParams(window.location.search);
console.log('Parameter Value:', urlParams);
// 获取指定参数的值
const parameterValue = url.searchParams.get('id');
// 现在 parameterValue 就包含了传递的参数值
console.log('parameterValue',parameterValue);

// const sn = this.$route.query.ip
// document.title = "临时上传-"+ sn;  // 设置页面标题
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