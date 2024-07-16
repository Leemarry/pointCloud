<!--
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2023-11-23 09:10:28
 * @LastEditors: Andy
 * @LastEditTime: 2024-02-18 17:03:09
-->
<!-- 水位图 -->
<template>
    <div class='chart waterLevelEChars'  id="liquidfill-chart"></div>
</template>

<script>
import settings from '@/settings.js';
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import liquidfill from "./echarts-liquidfill.js"; //echarts-liquidfill.js
export default {
    name: "",
    //import引入的组件需要注入到对象中才能使用
    components: {},
    data() {
        //这里存放数据
        return {
            timerl:null,
        };
    },
    //让组件接收外部传来的数据
    props: {
      loadingInfo:{
        type:Object,
        default:function(){
          return {
            num:250,
            taotal:330
          }
        }
      }
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
        initECharts(num = 150,total=330) {
           // 计算百分比
           var percent = num / total;
           var chartdocument = document.getElementById("liquidfill-chart");

            // 基于准备好的dom，初始化echarts实例
            let waterLevelEChars = this.$echarts.init(chartdocument);
            // 配置参数
            var option;
            var bgColor = "#E3F7FF";
            option = {
                series: [
                    {
                        type: "liquidFill",
                        data: [1.15*percent, 1.05*percent, 0.85*percent, 0.65*percent],
                        radius: "68%",
                        outline: {
                            show: false,
                        },
                        backgroundStyle: {
                            borderColor: "#156ACF",
                            borderWidth: 1,
                            color: bgColor,
                            shadowColor: "rgba(0, 0, 0, 0.4)",
                            shadowBlur: 20,
                        },
                        shape: "path://M816.46 64H207.54c-10.97 0-17.83 11.88-12.34 21.38l231.29 400.6v459.74c0 12.08 14.09 18.68 23.38 10.95L592.39 837.9c3.25-2.71 5.13-6.72 5.13-10.95V485.98L828.8 85.38c5.49-9.5-1.37-21.38-12.34-21.38z",
                        label: {
                            position: ["50%", "115%"],
                            formatter: function () {
                                return [
                                    "{a|挂载数量}",
                                    "\n",
                                    `{b|${num}/ ${total}}`,
                                ].join("");
                            },
                            rich: {
                                a: {
                                    color: "black",
                                    fontSize: 17,
                                },
                                b: {
                                  color: "#D94854",
                                    fontSize: 20,
                                    fontFamily: "Lobster Two",
                                },
                            },
                            fontSize: 20,
                            fontFamily: "Lobster Two",
                            color: "#D94854",
                            insideColor: bgColor,
                        },
                    },
                ],
            },
            waterLevelEChars.setOption(option);
        },
        handleResize(){
            if(this.timerl){
                clearTimeout(this.timerl);
            }
            this.timerl = setTimeout(() => {
                this.initECharts(this.loadingInfo.num,this.loadingInfo.total);
            }, 2002);
           
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {},
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        window.addEventListener('resize',this.handleResize );
        // window.addEventListener('resize',this.handleResize );
        this.initECharts(this.loadingInfo.num,this.loadingInfo.total);
    },
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {
        // window.removeEventListener('resize',(event)=> this.handleResize(event));
        window.removeEventListener('resize', this.handleResize);
    }, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.chart{
  height: 100%;
  width: 100%;
}
</style>