<!-- <!==
 * @Date: 2024-08-08 08:54:36
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\views\mediaPreview\full.vue
 * @Description: Do not edit
==>
<template>
  <div class="container">
    <div class="left-sidebar" :style="{ width: '300px' }" />
    <div class="right-content">
      <div class="top-section" :style="{ height: '200px' }" />
      <div class="bottom-section">
        <button @click="toggleFullScreen">全屏</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    methods: {
        toggleFullScreen() {
            if (document.fullscreenEnabled) {
                const bottomSection = document.querySelector('.bottom-section');
                if (document.fullscreenElement === null) {
                    bottomSection.requestFullscreen();
                } else {
                    document.exitFullscreen();
                }
            } else {
                alert('您的浏览器不支持全屏功能');
            }
        }
    }
}
</script>

  <style scoped>
  .container {
    display: flex;
  }

  .right-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  </style> -->
<template>
  <div>
    <table>
      <tr v-for="(item, index) in tableData" :key="index">
        <td @click="download(item)">{{ item.name }}</td>
        <td>{{ `图片大小${item.size}` }}</td>
        <td v-if="item.isdownloading">{{ `下载进度${item.downLoadProgress}` }}</td>
      </tr>
    </table>
  </div>
</template>
