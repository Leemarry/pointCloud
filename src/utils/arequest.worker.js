/*
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2024-01-10 09:27:59
 * @LastEditors: Andy
 * @LastEditTime: 2024-01-11 09:50:56
 */
// /*
//  * @Descripttion: 
//  * @version: 
//  * @Author: Eugene
//  * @Date: 2024-01-10 09:27:59
//  * @LastEditors: Andy
//  * @LastEditTime: 2024-01-10 21:01:34
//  */


// // const axios = require('axios');
// // // 定义无人机查询函数
// // function getQueryUavs() {
// //   return axios.get('/api/uavs')
// //     .then(response => response.data)
// //     .catch(error => {
// //       throw new Error(error.message || 'Failed to load drones data.');
// //     });
// // }
// function getQuerys(option) {
//   let {
//     url,
//     msg,
//     data,
//     method,
//     timeout
//   } = option;
//   return new Promise((resolve, reject) => {
//     fetch(url, {
//         method: method,
//         body: JSON.stringify(data),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//       .then((response) => response.json())
//       .then((data) => resolve(data))
//       .catch((error) => reject(error));
//   });
// }

// import request from '@/utils/request'  // ????????
// /**
//  * @msg: webworker通用查询信息方法
//  */
// function getQuery(option) {
//   let {
//     url,
//     msg,
//     data,
//     method,
//     timeout
//   } = option;
//   return request({
//     url: url,
//     data,
//     method: method,
//     timeout: timeout,
//   })
// }
// /**
//  * @msg: 使用webworker查询提前数据 
//  */
//  onmessage = function (event) {
//   let option = event.data;
//   // 假设你的查询函数为getQueryUavs()，它返回一个Promise对象
//   getQuery(option)
//   // .then(response => {
//   //   // 处理查询结果
//   //   console.log('queryUavsw处理查询结果', response);  
//   //   // 向主线程发送查询结果
//   //   postMessage(response);
//   // }).catch(error => {
//   //   // 处理错误
//   //   // 向主线程发送错误信息
//   //   postMessage({
//   //     error: error
//   //   });
//   // });
// };
