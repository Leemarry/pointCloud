<!--
 * @Descripttion:
 * @version:
 * @Author: Eugene
 * @Date: 2024-04-18 16:27:18
 * @LastEditors: likai 2806699104@qq.com
 * @LastEditTime: 2024-08-26 17:53:24
-->
<!--  -->
<template>
  <el-image :src="source.path">
    <div slot="placeholder" class="image-slot">
      加载中<span class="dot">...</span>
    </div>
  </el-image>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
    name: '',
    //import引入的组件需要注入到对象中才能使用
    components: {},
    //让组件接收外部传来的数据
    props: {
        // 每一行的索引,基础props，不用传递
        index: {
            type: Number
        },
        source: {
            type: Object,
            default() {
                return {}
            }
        },
        // 每一行的内容,基础props，不用传递
        current: String,
        itemClick: Function
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

    } //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
      <style scoped>
      .item {
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid lightgrey;
        padding: 1em;
      }
      </style>
