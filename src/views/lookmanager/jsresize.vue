
<!--
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2023-12-05 14:13:39
 * @LastEditors: Andy
 * @LastEditTime: 2023-12-28 09:00:55
-->
<!-- 识别 tester   10010 -->
<template>
    
    <div class="box">
      <div class="left" >
          <div>
              
          </div>
      </div>
      <div class="y-resize" > </div>
      <div class="right">
        <div class="top" > </div>
        <div class="x-resize" > </div>
        <div class="bottom" > </div>
      </div>
    </div>
  
  

  </template>
  
  <script>
  //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
  //例如：import 《组件名称》 from '《组件路径》';
  export default {
      name: "",
      //import引入的组件需要注入到对象中才能使用

      data() {
          //这里存放数据
          return {
          };
      },
      //让组件接收外部传来的数据
      props: {},
      //监听属性 类似于data概念


      //方法集合
      methods: {
  
      handleYResize () {
          console.log('Y');
        const box = document.getElementsByClassName('box')
        const left = document.getElementsByClassName('left')
        const resize = document.getElementsByClassName('y-resize')
        const right = document.getElementsByClassName('right')
        for (let i = 0; i < resize.length; i++) {
          // 鼠标按下事件
          resize[i].onmousedown = function (e) {
            // 颜色改变提醒
            resize[i].style.background = '#818181'
            const startX = e.clientX
            resize[i].left = resize[i].offsetLeft
            // 鼠标拖动事件
            document.onmousemove = function (e) {
              const endX = e.clientX
              let moveLen = resize[i].left + (endX - startX) // （endX-startX）=移动的距离。resize[i].left+移动的距离=左侧最终的高度
              const maxT = box[i].clientWidth - resize[i].offsetWidth // 容器宽度 - 左边区域的宽度 = 右边区域的宽度
              if (moveLen < 30) moveLen = 30 // left最小宽度度为30px
              if (moveLen > maxT - 30) moveLen = maxT - 30 // right最小宽度度为30px
   
              resize[i].style.left = moveLen // 设置left区域的宽度
              for (let j = 0; j < left.length; j++) {
                left[j].style.width = moveLen + 'px'
                right[j].style.width = (box[i].clientWidth - moveLen - 10) + 'px'
              }
            }
            // 鼠标松开事件
            document.onmouseup = function (evt) {
              // 颜色恢复
              resize[i].style.background = '#C0C4CC'
              document.onmousemove = null
              document.onmouseup = null
              // resize[i].releaseCapture && resize[i].releaseCapture() // 当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
            }
            // resize[i].setCapture && resize[i].setCapture() // 该函数在属于当前线程的指定窗口里设置鼠标捕获
            return false
          }
        }
      },
      handleXResize () {
      console.log('X');
        const box = document.getElementsByClassName('box')
        const top = document.getElementsByClassName('top')
        const resize = document.getElementsByClassName('x-resize')
        const bottom = document.getElementsByClassName('bottom')
        for (let i = 0; i < resize.length; i++) {
          // 鼠标按下事件
          resize[i].onmousedown = function (e) {
            console.log('倍点击');
            // 颜色改变提醒
            resize[i].style.background = '#818181'
            const startY = e.clientY
            resize[i].top = top[i].offsetHeight
            // 鼠标拖动事件
            document.onmousemove = function (e) {
              console.log('鼠标拖动事件');
              const endY = e.clientY
              let moveLen = resize[i].top + (endY - startY) // （endY-startY）=移动的距离。resize[i].top+移动的距离=上部最终的高度
              const maxT = box[i].clientHeight - resize[i].offsetHeight // 容器宽度 - 左边区域的宽度 = 右边区域的宽度
              if (moveLen < 30) moveLen = 30 // top最小高度度为30px
              if (moveLen > maxT - 30) moveLen = maxT - 30 // bottom最小高度度为30px
   
              resize[i].style.height = moveLen // 设置top区域的高度
              for (let j = 0; j < top.length; j++) {
                top[j].style.height = moveLen + 'px'
                bottom[j].style.height = (box[i].clientHeight - moveLen - 10) + 'px'
              }
            }
            // 鼠标松开事件
            document.onmouseup = function (evt) {
              // 颜色恢复
              resize[i].style.background = '#C0C4CC'
              document.onmousemove = null
              document.onmouseup = null
              // resize[i].releaseCapture && resize[i].releaseCapture() // 当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
            }
            // resize[i].setCapture && resize[i].setCapture() // 该函数在属于当前线程的指定窗口里设置鼠标捕获
            return false
          }
        }
      },
    
          
      
        },
      //生命周期 - 创建完成（可以访问当前this实例）
      created() {
      },
      //生命周期 - 挂载完成（可以访问DOM元素）
      mounted() {
          this.handleYResize()
          this.handleXResize()
      },
      beforeCreate() { }, //生命周期 - 创建之前
      beforeMount() { }, //生命周期 - 挂载之前
      beforeUpdate() { }, //生命周期 - 更新之前
      updated() { }, //生命周期 - 更新之后
      beforeDestroy() { }, //生命周期 - 销毁之前
      destroyed() { }, //生命周期 - 销毁完成
      activated() { }, //如果页面有keep-alive缓存功能，这个函数会触发
  };
  </script>
  <style lang="scss" scoped>
  .box{
    width: 100%;
    height: 100%;
    border: 1px #056768 solid;
    border-radius: 10px;
    .left,.y-resize,.right{
      float: left;
      overflow: hidden;
    }
    .left{
      width: calc(20% - 10px);
      height: 100%;
      background: #A0CFFF;
      border-radius: 10px 0 0 10px;
    }
    .y-resize{
      width: 10px;
      height: 100%;
      background: #C0C4CC;
      cursor: w-resize;
    }
    .right{
      width: 80%;
      height: 100%;
      .top,.bottom{
        overflow: hidden;
      }
      .top{
        height: calc(20% - 0.6vh);
        background:  #C6E2FF;
        border-radius: 0 10px 0 0;
      }
      .x-resize{
        height: 0.6vh;
        background: #C0C4CC;
        cursor: s-resize;
        position: relative;
      }
      .bottom{
        height: 80%;
        background: #ECF5FF;
        border-radius: 0 0 10px 0;
      }
    }
  }
  </style>
  