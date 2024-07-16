<!--
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2024-04-11 10:12:45
 * @LastEditors: Andy
 * @LastEditTime: 2024-04-11 11:53:56
-->
<!--  -->
<template>
    <div class=''>
        <ul class="pagination">
            <li><a href="#" @click="switchPageSize('reduce')">«</a></li>
            <li><a :class="{'active':true}" href="#">{{ showCurrentPageSync }}</a></li>
            <li><a href="#">{{ showNextpagesync}}</a></li>
            <li><a href="#" style="cursor: not-allowed;">...</a></li>
            <li><a href="#">{{showTotal}}</a></li>
            <li><a href="#" @click="switchPageSize('plus')">»</a></li>
        </ul>
    </div>
</template>

<script>
import { get } from 'js-cookie';
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
    name: '',
    //import引入的组件需要注入到对象中才能使用
    components: {},
    data() {
        //这里存放数据
        return {
            showNextpagesync:0,
        };
    },
    //让组件接收外部传来的数据
    props: {
        total: {
            type: Number,
            default: 0,
        },
        pagesize: {
            type: Number,
            default: 0,
        },
        currentpagesync: {
            type: Number,
            default: 0,
        },
    },
    //监听属性 类似于data概念
    computed: {
        showTotal: {
            get() {
                const c = Math.ceil(this.total / this.pagesize); // c=2
                return c;
            },
            set(v) {

            }
        },
        showCurrentPageSync: {
            get() {
                this.showNextpagesync = this.currentpagesync+1
                return this.currentpagesync
            },
            set(v) {
                this.$emit('send:currentpagesync', v)
            }
        }
    },
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
        /**编辑当前页数 */
        deitCurrentpagesync() {

        },
        /**切换当前页数 */
        switchPageSize(type, index) {

        }

    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
    beforeCreate() { }, //生命周期 - 创建之前
    beforeMount() { }, //生命周期 - 挂载之前
    beforeUpdate() { }, //生命周期 - 更新之前
    updated() { }, //生命周期 - 更新之后
    beforeDestroy() { }, //生命周期 - 销毁之前
    destroyed() { }, //生命周期 - 销毁完成
    activated() { }, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
ul.pagination {
    display: inline-block;
    padding: 0;
    margin: 0;
}

ul.pagination li {
    display: inline;
}

ul.pagination li a {
    color: black;
    float: left;
    padding: 8px 16px;
    text-decoration: none;
    transition: background-color 0.3s;
}

ul.pagination li a.active {
    background-color: #4caf50;
    color: white;
}

ul.pagination li a:hover:not(.active) {
    background-color: #ddd;
}

.not-allowed{
    cursor: not-allowed;  
}
</style>