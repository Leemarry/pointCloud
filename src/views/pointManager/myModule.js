/*
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2023-11-20 19:36:06
 * @LastEditors: Andy
 * @LastEditTime: 2023-11-21 10:37:44
 */
// myModule.js
class MyModule {
    constructor() {
      this.prop1 = 'value1';
      this.prop2 = 'value2';
      this.prop3 = 'value3';
      this.options = [{
        value: '30',
        label: '飞行高度',
        unit: '米'
      }, {
        value: null,
        label: '飞行速度',
        unit: '米/秒'
      }, {
        value: null,
        label: '海拔高度',
        unit: null
      }, {
        value: null,
        label: '飞行模式',
        unit: null
      }, {
        value: 11,
        label: '飞行时长',
        unit: null
      }, {
        value: null,
        label: '剩余电量'
      }, {
        value: null,
        label: '通讯质量',
        unit: null
      }];
      /** 航点管理 按钮事件*/
      this.defaultClickTools={
        importWaypoints: { text: "导入航点", icon: "el-icon-plus", action: this.importWaypoints },
        addRoutes: {text: "航线规划",icon: "el-icon-plus",action: this.addRoutes},
        multiMachineImport: { text: "多机导入", icon: "el-icon-plus", action: this.multiMachineImport },
        loadingStatus: { text: "载仓状态", icon: "el-icon-plus", action: this.loadingStatus }
      }
    }
  
    method1() {
      console.log('This is method 1');
    }
  
    method2() {
      console.log('This is method 2');
    }
  }
  
  export default MyModule;