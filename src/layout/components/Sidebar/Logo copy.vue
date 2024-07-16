<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/index">
        <!-- <img v-if="logo" :src="logo" class="sidebar-logo" fit="none"> -->
        <el-image v-if="logo" :src="logo" class="sidebar-logo" fit="scale-down">
          <div slot="placeholder" class="image-slot">
            加载中<span class="dot">...</span>
          </div>
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
        <h1 v-else class="sidebar-title">{{ title }}</h1>
        <!-- <h1 v-else class="sidebar-title">{{ (companyInfo==null) ? title : companyInfo.cnameZh}} </h1> -->
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/index">
        <!-- <img v-if="logo" :src="logo" class="sidebar-logo" fit="none"> -->
        <el-image v-if="logo" :src="logo" class="sidebar-logo" fit="scale-down">
          <div slot="placeholder" class="image-slot">
            加载中<span class="dot">...</span>
          </div>
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
        <h1 class="sidebar-title">{{ title }} </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      logo: require('@/assets/images/uavOnline.png'),
      title: '无人机'
    }
  },
  computed: {
    ...mapGetters([
      'systemInfo',
      'companyInfo'
    ])
  },
  mounted() {
    // console.log('Logo 加载中 ... ...')
    if (this.companyInfo && this.companyInfo != null) {
      if (this.companyInfo.clogoIco) {
        this.logo = this.companyInfo.clogoIco + '?' + Date.now()
      }
    }
    if (this.systemInfo && this.systemInfo != null) {
      if (this.systemInfo.sysNameZh) {
        this.title = this.systemInfo.sysNameZh
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      border-radius: 60%;
      vertical-align: middle;
      margin-right: 5px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
