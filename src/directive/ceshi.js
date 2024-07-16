/*
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2024-05-09 13:52:42
 * @LastEditors: Andy
 * @LastEditTime: 2024-05-09 15:36:30
 */
export default {

 // 当绑定元素和指令之间的绑定关系建立时立即调用
 bind:  (el,binding,vNode) =>{
    // 更新元素的背景颜色为红色
    console.log('binding',binding);
    el.style.background =  binding.value ||'yellow';
    
    // 添加鼠标指针样式
    el.style.cursor = 'pointer';

    // 添加鼠标进入事件监听器
    el.addEventListener('mouseenter', function () {
      el.style.color = 'aquamarine';
    });

    // 添加鼠标离开事件监听器
    el.addEventListener('mouseleave', function () {
      el.style.color = ''; // 恢复默认颜色
    });
  },
  unbind:function(el){
    // app.$destroy()
    el.style.background = 'red';
    // el.removeAttribute('v-op');
}
  }