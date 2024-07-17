<!--
 * @Date: 2024-07-17 15:56:34
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\views\AlImagePreview\index.vue
 * @Description: Do not edit
-->
<!--  -->
<template>
<div class='al-mask al-image-preview' :style='{display: visible ? "block" : "none"}'>
    <!-- 图片处理动作 -->
    
    <!-- <div class='al-mask-btn al-image-preview-close'>
        <span>X</span>
    </div>
    <div class='al-mask-btn al-image-preview-left'>
        <span>{{ `<` }}</span>
    </div>
    <div class='al-mask-btn al-image-preview-right'>
        <span>{{ `>` }}</span>
    </div>
    <div class='al-mask-btn al-image-preview-action'>

    </div> -->
    <div class='al-image-preview-content' >
        

    </div>
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

};
},
//让组件接收外部传来的数据
 props: {
    visible:{
        type:Boolean,
        required:true
    }
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
.al-mask{
    display: none;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.3);
    z-index: 2000;
}
.al-image-preview{
    .al-image-preview-close{
        position: absolute;
        top: 5%;
        right: 5%;
        width: 3rem;
    height: 3rem;
        padding: 1rem;
        font-size: 1.2rem;
        border-radius: 50%;
        background-color: #606266ba;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

</style>