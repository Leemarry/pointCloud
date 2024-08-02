<!--
 * @Date: 2024-07-17 13:37:38
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\views\AlDialog\index.vue
 * @Description: Do not edit
-->
<!-- :style='{display: visible ? "block" : "none"}'  -->
<template>
  <div v-if="visible" id="al-dialog" class="al-dialog">
    <div class="al-dialog-content" :style="{ width: width, height: height }">
      <div v-if="title" class="al-dialog-header">
        <span>{{ title }}</span>
        <span @click="close">X</span>
      </div>
      <div class="al-dialog-body">
        <slot />
      </div>
      <div class="al-dialog-footer" />
    </div>
  </div>
</template>

<script>

//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等!）
//例如：import 《组件名称》 from '《组件路径》';

export default {
    name: 'AlDialog',
    //import引入的组件需要注入到对象中才能使用
    components: {},
    //让组件接收外部传来的数据
    props: {
        visible: {
            type: Boolean,
            require: true
        },
        title: {
            type: String,
            require: false
        },
        width: {
            type: String,
            require: false
        },
        height: {
            type: String,
            require: false
        }
    },
    data() {
        //这里存放数据
        return {

        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
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
    activated() {},
    //方法集合
    methods: {

        close() {
            this.$emit('close', false);
        }
    } //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类

.al-dialog {
	display: none;
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0,0,0,0.5);
    z-index: 2000;
}
// 视口居中
.al-dialog-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 35%;
    height: 35%;
    background-color: aliceblue;
    border-radius: 5px;
    box-shadow: 0 0 10px 2px rgba(0,0,0,0.3);
}
.al-dialog-header{
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    & > :last-child{
        cursor: pointer;
    }
    border-bottom: 1px  solid rgba(0,0,0,0.3);
}
.al-dialog-body{
    padding: 1rem;
}

</style>
