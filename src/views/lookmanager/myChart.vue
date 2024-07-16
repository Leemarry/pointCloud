<!--
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2024-02-01 10:31:41
 * @LastEditors: Andy
 * @LastEditTime: 2024-02-01 11:23:37
-->
<!--  -->
<template>
    <div id="parentMyCharts" style="width: 1600px; height: 800px;">
        <div id="myChart" style="width: 100%; height: 100%; "></div>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
    name: '',
    //import引入的组件需要注入到对象中才能使用
    components: {},
    data() {
        //这里存放数据
        return {
            myChart:null,

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
        initchart() {
            const myChartElement = document.getElementById('myChart');
            // 基于准备好的dom，初始化echarts实例
            
            this.myChart = this.$echarts.init(myChartElement);
            if (this.myChart) {
                // 指定图表的配置项和数据
                var option = {
                    title: {
                        text: 'ECharts 入门示例'
                    },
                    tooltip: {
                        trigger: 'axis',
                    },
                    legend: {
                        data: ['销量']
                    },
                    xAxis: {
                        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
                    },
                    yAxis: {},
                    series: [
                        {
                            name: '销量',
                            type: 'bar',
                            data: [5, 20, 36, 10, 10, 20]
                        }
                    ]
                };
                // 使用刚指定的配置项和数据显示图表。
                this.myChart.setOption(option);
            }
        },
        // 自适应调整图表大小的函数
        resizeChart() {
            console.log('oooo');
            // // 获取容器尺寸
            // var container = document.getElementById('chart-container');
            // var containerWidth = container.clientWidth;
            // var containerHeight = container.clientHeight;

            // // 设置 echarts 容器大小
            // this.myChart.resize({
            //     width: containerWidth,
            //     height: containerHeight
            // });

            // // 重新渲染图表
            // this.myChart.setOption(this.myChart.getOption());
            this.myChart.resize()
        },


    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.initchart()
        /**节流 */
        function debounce(fu, delay) {
            let timeoutId;
            return (...arg) => {
                clearTimeout(timeoutId);
                setTimeout(() => fu(...arg), delay);
            };
        }
        const resizeObserver = new ResizeObserver(
            debounce((entries,observe)=>{
                // console.log('ppp');
                this.resizeChart()
            },300)
        )
        var parentMyCharts = document.getElementById('parentMyCharts'); // 替换 'yourId' 为您要获取的元素的ID
        // const parentMyCharts = document.querySelector(".parentMyCharts")
        resizeObserver.observe(parentMyCharts)

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
</style>