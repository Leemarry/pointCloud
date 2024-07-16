<template>
  <div id="echart-line" class="echart" :style="{float:'left',width: '100%', height: '100%'}"></div>
</template>
<script>
export default {
  methods: {
    initCharts(names, xData, yDatas) {
      const getchart = this.$echarts.init(document.getElementById('echart-line'))
      const option = this.getOptions(names, xData, yDatas)
      getchart.setOption(option, true)
      // 随着屏幕大小调节图表
      window.addEventListener('resize', () => {
        getchart.resize()
      })
    },
    initChartNull() {
      const getchart = this.$echarts.init(document.getElementById('echart-line'))
      this.$toolUtil.setNotopt(getchart, '暂无数据!')
    },
    initChart(name, xData, yData) {
      const getchart = this.$echarts.init(document.getElementById('echart-line'))
      var option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: [name],
          bottom: '0%'
        },
        grid: { // 调整图表上下左右位置
          top: '10%',
          left: '3%',
          right: '8%',
          bottom: '11%',
          containLabel: true
        },

        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xData
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: name,
            type: 'line',
            stack: '总量',
            data: yData
          },
        ]
      };
      getchart.setOption(option)
      // 随着屏幕大小调节图表
      window.addEventListener('resize', () => {
        getchart.resize()
      })
    },
    getOptions(names, xData, yDatas) {
      var option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: names,
          bottom: '0%'
        },
        grid: { // 调整图表上下左右位置
          top: '10%',
          left: '3%',
          right: '8%',
          bottom: '11%',
          containLabel: true
        },
        dataZoom: [
          {
            type: 'slider',
            realtime: true,
            start: 0,
            end: 50,
            xAxisIndex: [0],
            bottom: '30px'
          }
        ],
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xData
        },
        yAxis: {
          type: 'value'
        },
        series: []
      };
      for (let index = 0; index < yDatas.length; index++) {
        const yData = yDatas[index]
        option.series.push({
          name: names[index],
          type: 'line',
          data: yData
        })
      }
      return option
    },
  }
}
</script>
