<template>
  <div class="main">
    <div class="mainLeft">
      <svg-icon :icon-class="parmImage" :style="'fill:'+parmColor" />
    </div>
    <div class="mainMiddle">
      <div>
        <span :class="isWarn?'valueTextWarn':'valueText'">{{tempParmValue}} </span>
        <span style="color:rgb(187, 187, 187);font-size: 10px"> {{parmUnit}}</span>
      </div>
      <div class="parmName">{{parmName}}</div>
    </div>
    <!-- <div class="mainRight">{{parmUnit}}</div> -->
  </div>
</template>

<script>
export default {
  // props: ['parmValue'],
  // props: ['parmImage','parmName','parmValue','parmUnit','parmColor'],
  props: {
    parmValue: {
      default: '-'
    },
    warnMinValue: {
      default: -500000000
    },
    warnMaxValue: {
      default: 0
    },
    parmImage: {
      type: String,
      default: 'uav_black'
    },
    parmName: {
      type: String,
      default: '-'
    },
    parmUnit: {
      type: String,
      default: ''
    },
    parmColor: {
      type: String,
      default: 'white'
    },
  },
  data() {
    return {
      isWarn: false,
      tempParmValue: this.parmValue,
    };
  },
  watch: {
    parmValue(newVal) {
      // console.log("值变成了：" + newVal);
      if (newVal == null) { newVal = "-"; }
      this.tempParmValue = newVal;
      this.isWarn = (newVal < this.warnMinValue);
    }
  }
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
