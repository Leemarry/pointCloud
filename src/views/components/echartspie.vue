<template>
    <el-card :body-style=" { padding: '0px',margin: '0px'}" shadow="hover" :class="checked?'cardBgChecked':'cardBg'" @click.native="dblclick">
      <div class="main">
        <div class="mainLeft">
          <svg-icon :icon-class="uavImage" :style="getOnlineStyle()" />
        </div>
        <div class="mainMiddle" :style="online?'color:#3de7c9':'color:white'">{{getSubstring(uavName,12)}}</div>
        
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
   
    
    },
  }
  </script>
  
  <style scoped>
  
  </style>
  