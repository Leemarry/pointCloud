<template>
  <div class="timeBox padding-xl">
    <p class="text-24 text-white" v-html="formateTimeStamp(date)"></p>
  </div>
</template>

<script>
export default {
  // props: ['parmValue'],
  // props: ['parmImage','parmName','parmValue','parmUnit','parmColor'],
  props: {
    parmValue: {
      default: '-'
    }
  },
  data() {
    return {
      date: new Date().getTime()
    };
  },
  created: function () {
    this.loadTime()
  },
  methods: {
    loadTime() {
      var _this = this;
      setInterval(() => {
        _this.date += 1000;
      }, 1000);
    },
    // 转换时间戳
    formateTimeStamp(time) {
      var date = new Date(time);
      var year = date.getFullYear();
      var month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var minute =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var second =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      var week = ["日", "一", "二", "三", "四", "五", "六"][date.getDay()];
      // return year + "年" + month + "月" + day + "日" + hour + ":" + minute + ":" + second;
      return (
        '<span style="font-size: 18px; text-shadow: 0px 2px 7px rgba(51, 51, 51, 0.6);">' +
        hour +
        ":" +
        minute + ":" + second +
        "</span><br/>" +
        year +
        "年" +
        month +
        "月" +
        day +
        "日" +
        "&nbsp;&nbsp;&nbsp;星期" +
        week
      );
    },
  },
}
</script>

<style scoped>
.main {
  background-color: #151515;
  height: auto;
  border: 1px solid rgb(0, 0, 0);
  color: white;
  padding: 1px;
  /* text-align: center; */
  display: flex;
  display: -webkit-flex;
  /* Safari */
  flex-direction: row;
}
.mainLeft {
  width: 35px;
  display: flex;
  display: -webkit-flex;
  /* Safari */
  align-items: center;
  justify-content: center;
}

.mainMiddle {
  flex: 1;
  display: flex;
  display: -webkit-flex;
  /* Safari */
  flex-direction: column;
  /* 水平居中 */
  /* align-items: center; */
  /* 垂直居中 */
  justify-content: center;
}
.parmName {
  color: rgb(187, 187, 187);
  font-size: 10px;
}
.mainRight {
  width: 30px;
  display: flex;
  display: -webkit-flex;
  /* Safari */
  flex-direction: column;
}
.valueText {
  color: #3de7c9;
  font-size: 12px;
}
.valueTextWarn {
  color: yellow;
  font-size: 12px;
  font-weight: bold;
}
</style>
