<!--
 * @Date: 2024-09-04 18:56:12
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\views\mediaUpload\List.vue
 * @Description: Do not edit
-->
<!--  -->
<template>
  <div ref="container" class="container" :style="{height:conHeight}" @scroll="handleScroll">
    <div class="list" :style="{top:listTop}">
      <div v-for="(item) in showData" :key="item.id" :style="{height:size+'px',display:'flex'}" class="items">

        <el-col :span="6">
          <div style="display: flex;align-items: center;"> <i style="color:#409EFF" class=" el-icon-s-order" />{{ item.file.name }}</div>
        </el-col>
        <el-col :span="12">
          <div style="display: flex;align-items: center;"> <i style="color:#409EFF" class=" el-icon-s-order" />{{ item.file.webkitRelativePath == "" ? item.folder : item.file.webkitRelativePath }}</div>
        </el-col>
        <el-col :span="6">
          <template v-if="item.status === 4 || item.progress == 100">发送成功！</template>
          <template v-else-if="item.status === 'error'">上传失败!</template>
          <el-progress v-else :text-inside="true" :stroke-width="24" :percentage="item.progress" />
        </el-col>
      </div>
      <div class="bar" :style="{height:barHeight}" />
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
    // 让组件接收外部传来的数据
    props: {
        shownumber: {
            type: Number,
            default: 100
        },
        size: {
            type: Number,
            default: 60
        },
        items: {
            type: Array,
            default: () => { [] }
        },
        total: {
            default: 0,
            type: Number
        },
        start: {
            default: 0,
            type: Number
        },
        end: {
            default: 0,
            type: Number
        }
    },
    data() {
        //这里存放数据
        return {
            // start: 0,
            // end: this.shownumber

        };
    },
    //监听属性 类似于data概念
    computed: {
        showData() {
            // return this.items.slice(this.start, this.end)
            return this.items
        },
        conHeight() {
            return this.size * this.shownumber + 'px'
        },
        barHeight() {
            // return this.size * this.items.length - this.start * this.size + 'px'
            return this.size * this.total - this.start * this.size + 'px'
        },
        listTop() {
            return this.start * this.size + 'px'
        }
    },
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
        handleScroll() {
            // return Math.floor(this.$refs.container.scrollTop / this.itemHeight);
            const scrollTop = this.$refs.container.scrollTop
            this.$emit('send:handleScroll', scrollTop)
            // console.log('container', scrollTop)
            // this.start = Math.floor(scrollTop / this.size)
            // this.end = this.start + this.shownumber
        }

    } //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.container{
  overflow-y: scroll;
  //background-color: rgba(150,150,150,0.5);
  background-color: rgba(255,255,255,1);
  font-size: 14px;
  // font-weight: bold;
  line-height: 60px;
  margin: 0 auto;
  position: relative;
  text-align: center;
}
.list{
  position: absolute;
  top: 0;
  width: 100%;
}
.items{
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 2px 20px;
}

</style>
