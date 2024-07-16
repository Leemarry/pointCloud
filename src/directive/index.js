/*
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2024-05-09 13:11:38
 * @LastEditors: Andy
 * @LastEditTime: 2024-05-09 14:55:44
 */
import Focus from './Focus'
import copy from './copy';
import op from './ceshi';

const directives = {  //汇总自定义指令
  Focus,//聚焦指令
  copy,
  op
}

export default {  //导出自定义指令
  install(app) {// 以安装的方式插到app中
    Object.keys(directives).forEach((key) => {    // 遍历directives对象的key
      app.directive(key, directives[key])  // 将每个directive注册到app中
    }),
      //单个直接
      app.directive("hello", function (el, binding, vnode) {
        el.style["color"] = binding.value;
      })

  }
}