/*
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2023-12-14 09:46:13
 * @LastEditors: Andy
 * @LastEditTime: 2024-04-18 18:52:59
 */

/*定义相机参数对象数组*/
const cameraParams = [
    // {
    //   name: '1001',
    //   type:'',
    //   params: {
    //     focallen: 4.5, // 相机焦距
    //     imageheight: 2160, // 图片高度
    //     imagewidth: 4096, // 图片宽度
    //     sensorheight: 5.37, // 传感器高度，mm
    //     sensorwidth: 4.036, // 传感器宽度，mm
    //     exposureMode: 'manual'
    //   }
    // },
    // {
    //   name: '1ZNBJ5F00C008L',
    //   type:'',
    //   params: {
    //     focallen: 4.5, // 相机焦距
    //     imageheight: 2160, // 图片高度
    //     imagewidth: 4096, // 图片宽度
    //     sensorheight: 5.37, // 传感器高度，mm
    //     sensorwidth: 4.036, // 传感器宽度，mm
    //     exposureMode: 'manual'
    //   }
    // },
    {
      id:'1581F5FKD238B00D0V24',
      name: '1581F5FKD238B00D0V24',
      type:'M3M',
      params: {
        focallen: 4.0, // 相机焦距
        imageheight: 1944, // 图片高度
        imagewidth: 2592, // 图片宽度
        sensorheight: 5.37, // 传感器高度，mm
        sensorwidth: 4.036, // 传感器宽度，mm
        exposureMode: 'manual'
      }
    },
    {
      id:'1581F5FKD238B00D0V2',
      name: '1581F5FKD238B00D0V2',
      type:'其他',
      params: {
        focallen: 4.5, // 相机焦距
        imageheight: 2160, // 图片高度
        imagewidth: 4096, // 图片宽度
        sensorheight: 5.37, // 传感器高度，mm
        sensorwidth: 4.036, // 传感器宽度，mm
        exposureMode: 'manual'
      }
    },
    // ...
  ];
  
  // 导出相机参数数组
  export default cameraParams;

