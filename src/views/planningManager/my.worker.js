/*
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2023-12-22 16:38:24
 * @LastEditors: Andy
 * @LastEditTime: 2023-12-22 18:12:59
 */

// my-worker.worker.js
onmessage = (event) => {
    console.log('Recain thread: ', event.data)
  
    // 向主线程发送消息
    postMessage('Hellthread!')
  }


//   // 监听主线程发送的消息
// onmessage = function(event) {
//     // 获取主线程发送的数据
//     console.log(event);
//     const data = event.data;
    
//     // 在 Web Worker 中执行耗时计算操作
//     const result = doSomeHeavyWork(data);
    
//     // 将计算结果发送回主线程
//     postMessage(result);
//   }
  
//   // 执行一些计算密集型操作，以模拟耗时计算
//   function doSomeHeavyWork(data) {
//     for (let i = 0; i < 1000000000; i++) {
//       Math.sqrt(i * data);
//     }
//     return 'Done!';
//   }