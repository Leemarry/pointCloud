<template>
    <el-card :body-style=" { padding: '0px',margin: '0px'}" shadow="hover" :class="checked?'cardBgChecked':'cardBg'" @click.native="dblclick">
      <div class="main">
        <div class="mainLeft">
          <svg-icon :icon-class="uavImage" :style="getOnlineStyle()" />
        </div>
        <div class="mainMiddle" :style="online?'color:#3de7c9':'color:white'">{{getSubsstring(uavName,12)}}</div>
        <div class="mainRight">{{getSubstring(uavSn,16)}}</div>
      </div>
    </el-card>
  </template>
  
  <script>
  export default {
    props: {
      // checked: { type: Boolean, default: false },
      online: { type: Boolean, default: false },
      uavImage: {
        type: String,
        default: 'uav_black'
      },
      uavName: {
        type: String,
        default: '-'
      },
      parmValue: {
        type: String,
        default: '-'
      },
      uavSn: {
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
        checked: false,
      };
    },
    methods: {
      showToast(msg) {
        this.$layer.msg(msg)
      },
      showMessage(msg, type) {
        this.$message({ message: msg, type: type })
      },
      getSubstring(temp, len) {
        if (temp.length > len) {
          return temp.substring(0, len - 1) + "...";
        } else {
          return temp;
        }
      },
      showUavName() {
        // alert("X:" + this.uavName)
      },
      swtichChecked() {
        this.setChecked(!this.checked);
      },
      setChecked(checked) {
        this.checked = checked;
      },
      getOnlineStyle() {
        if (!this.online) return 'fill:gray';
        else return 'fill:#65fde1';
      },
      dblclick() {
        // this.showToast(this.uavName + "  " + this.uavSn)
      }
    },
  }
  </script>
  
  <style scoped>
  .main {
    background-color: #151515;
    height: auto;
    /* border: 2px solid rgb(0, 0, 0); */
    color: white;
    padding: 10px;
    /* text-align: center; */
    display: flex;
    display: -webkit-flex;
    /* Safari */
    flex-direction: row;
  }
  .mainLeft {
    width: 50px;
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
    /* align-items: center;*/
    /* 垂直居中 */
    justify-content: center;
    /* color: #3de7c9; */
  }
  .uavName {
    font-size: 10px;
  }
  .mainRight {
    flex: 1;
    display: flex;
    display: -webkit-flex;
    /* Safari */
    flex-direction: column;
    color: rgb(187, 187, 187);
  }
  .cardBg {
    position: relative;
    height: auto;
    padding: 1px;
    opacity: 0.95;
    border: 2px solid rgb(0, 0, 0);
    border-radius: 5px;
    cursor: pointer;
    outline-offset: -1px;
    transition: all 0.3s linear;
    font-size: 12px;
    background: #151515;
    color: white;
  }
  .cardBg:hover {
    background: #3de7c9;
    /* background: #65fde1; */
  }
  .cardBgChecked {
    position: relative;
    height: auto;
    padding: 1px;
    opacity: 0.95;
    border: 2px solid #008a70;
    border-radius: 5px;
    cursor: pointer;
    outline-offset: -1px;
    transition: all 0.3s linear;
    font-size: 12px;
    background: #3de7c9;
    color: white;
  }
  </style>
  