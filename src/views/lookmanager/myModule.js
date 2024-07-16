/*
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2023-12-07 11:37:30
 * @LastEditors: Andy
 * @LastEditTime: 2023-12-07 11:48:24
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
    this.webSocketData = {
      "code": 1,
      "data": {
        "alt": 0,
        "altabs": 100,
        "areMotorsOn": 0,
        "aremd": 0,
        "batteryPert": 93,
        "batteryTemp": 0,
        "batteryValue": 0,
        "cameraLens": 0,
        "dataDate": 1701755690941,
        "distToHome": 0.11,
        "distToTarget": 0,
        "electricCurrent": -1.56,
        "flightMode": "GPS_ATTI",
        "flightModeText": "GPS姿态模式",
        "flightTimeInSeconds": 369,
        "fpvSign": 100,
        "gimbalMode": 2,
        "gimbalPitch": 0,
        "gimbalRelToUavHeading": 0,
        "gimbalRoll": 0,
        "gimbalYaw": 87,
        "gpsStatus": 5,
        "gpsStatusText": "高质量",
        "id": 0,
        "lat": 30.9555684,
        "linkAirDownload": 100,
        "linkAirUpload": 100,
        "lng": 114.1055579,
        "mountDevice": 1,
        "pdop": 0,
        "pitch": -1.1,
        "remoteSign": 100,
        "roll": 0.5,
        "satecount": 15,
        "systemStatus": 0,
        "uavAbnormal": 0,
        "uavCurentHive": "",
        "uavId": "1ZNBJ5F00C008L",
        "uavStatus": 0,
        "uavType": 8,
        "voltage": 16.81,
        "wpCount": 4,
        "wpFirstWpTime": 1701755537,
        "wpFlyedTime": 49,
        "wpMayFinlishTime": 1701755586,
        "wpNo": 0,
        "wpProgress": 0,
        "wpStartTime": 1701755497,
        "xySpeed": 0,
        "yaw": 5.7,
        "zSpeed": 0
      },
      "message": ""
    };
    /** 航点管理 按钮事件*/
    this.defaultClickTools = {
      importWaypoints: {
        text: "导入航点",
        icon: "el-icon-plus",
        action: this.importWaypoints
      },
      addRoutes: {
        text: "航线规划",
        icon: "el-icon-plus",
        action: this.addRoutes
      },
      multiMachineImport: {
        text: "多机导入",
        icon: "el-icon-plus",
        action: this.multiMachineImport
      },
      loadingStatus: {
        text: "载仓状态",
        icon: "el-icon-plus",
        action: this.loadingStatus
      }
    };

    this.flylist = [{
        id: '1',
        time: '2023-11-09',
        uavId: 'ceshi123'
      },
      {
        id: '2',
        time: '2023-11-10',
        uavId: 'ceshi124'
      },
      {
        id: '3',
        time: '2023-11-11',
        uavId: 'ceshi125'
      },
      {
        id: '4',
        time: '2023-11-12',
        uavId: 'ceshi126'
      },
      {
        id: '5',
        time: '2023-11-13',
        uavId: 'ceshi127'
      },
      {
        id: '6',
        time: '2023-11-14',
        uavId: 'ceshi128'
      },
      {
        id: '7',
        time: '2023-11-15',
        uavId: 'ceshi129'
      },
      {
        id: '8',
        time: '2023-11-16',
        uavId: 'ceshi130'
      },
      {
        id: '9',
        time: '2023-11-17',
        uavId: 'ceshi131'
      },
      {
        id: '10',
        time: '2023-11-18',
        uavId: 'ceshi132'
      },
      {
        id: '11',
        time: '2023-11-19',
        uavId: 'ceshi133'
      },
      {
        id: '12',
        time: '2023-11-20',
        uavId: 'ceshi134'
      },
      {
        id: '13',
        time: '2023-11-21',
        uavId: 'ceshi135'
      },
      {
        id: '14',
        time: '2023-11-22',
        uavId: 'ceshi136'
      },
      {
        id: '15',
        time: '2023-11-23',
        uavId: 'ceshi137'
      },
      {
        id: '16',
        time: '2023-11-24',
        uavId: 'ceshi138'
      },
      {
        id: '17',
        time: '2023-11-25',
        uavId: 'ceshi139'
      },
      {
        id: '18',
        time: '2023-11-26',
        uavId: 'ceshi140'
      },
      {
        id: '19',
        time: '2023-11-27',
        uavId: 'ceshi141'
      },
      {
        id: '20',
        time: '2023-11-28',
        uavId: 'ceshi142'
      },
      {
        id: '21',
        time: '2023-11-29',
        uavId: 'ceshi143'
      },
      {
        id: '22',
        time: '2023-11-30',
        uavId: 'ceshi144'
      },
      {
        id: '23',
        time: '2023-12-01',
        uavId: 'ceshi145'
      },
      {
        id: '24',
        time: '2023-12-02',
        uavId: 'ceshi146'
      },
      {
        id: '25',
        time: '2023-12-03',
        uavId: 'ceshi147'
      },
      {
        id: '26',
        time: '2023-12-04',
        uavId: 'ceshi148'
      },
      {
        id: '27',
        time: '2023-12-05',
        uavId: 'ceshi149'
      },
      {
        id: '28',
        time: '2023-12-06',
        uavId: 'ceshi150'
      },
      {
        id: '29',
        time: '2023-12-07',
        uavId: 'ceshi151'
      },
      {
        id: '30',
        time: '2023-12-08',
        uavId: 'ceshi152'
      },
      {
        id: '31',
        time: '2023-12-09',
        uavId: 'ceshi153'
      },
      {
        id: '32',
        time: '2023-12-10',
        uavId: 'ceshi154'
      },
      {
        id: '33',
        time: '2023-12-11',
        uavId: 'ceshi155'
      },
      {
        id: '34',
        time: '2023-12-12',
        uavId: 'ceshi156'
      },
      {
        id: '35',
        time: '2023-12-13',
        uavId: 'ceshi157'
      },
    ];

    this.photolist = [{
        id: 'photo-1',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg'
      },
      {
        id: 'photo-2',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg'
      },
      {
        id: 'photo-3',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg'
      },
      {
        id: 'photo-4',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg'
      },
      {
        id: 'photo-5',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg'
      },
      {
        id: 'photo-6',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg'
      },
      {
        id: 'photo-7',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg'
      },
      {
        id: 'photo-8',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg'
      },
      {
        id: 'photo-9',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg'
      },
      {
        id: 'photo-10',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg'
      },
      {
        id: 'photo-11',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg'
      },
      {
        id: 'photo-12',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg'
      },
      {
        id: 'photo-13',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg'
      },
      {
        id: 'photo-14',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg'
      },
      {
        id: 'photo-15',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg'
      },
      {
        id: 'photo-16',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg'
      },
      {
        id: 'photo-17',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
      },
      {
        id: 'photo-18',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg'
      },
      {
        id: 'photo-19',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/b/49/7f1d27247c5d3b58e1d4175e5c928jpeg.jpeg'
      },
      {
        id: 'photo-20',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/b/49/7f1d27247c5d3b58e1d4175e5c928jpeg.jpeg'
      },
      {
        id: 'photo-21',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/b/49/7f1d27247c5d3b58e1d4175e5c928jpeg.jpeg'
      },
      {
        id: 'photo-22',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/b/49/7f1d27247c5d3b58e1d4175e5c928jpeg.jpeg'
      },
      {
        id: 'photo-23',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/b/49/7f1d27247c5d3b58e1d4175e5c928jpeg.jpeg'
      },
      {
        id: 'photo-24',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/b/49/7f1d27247c5d3b58e1d4175e5c928jpeg.jpeg'
      },
      {
        id: 'photo-25',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/e/37/7aba632d3ce4e416aa5e3455ebcb3jpeg.jpeg'
      },
      {
        id: 'photo-26',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/e/37/7aba632d3ce4e416aa5e3455ebcb3jpeg.jpeg'
      },
      {
        id: 'photo-27',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/e/37/7aba632d3ce4e416aa5e3455ebcb3jpeg.jpeg'
      },
      {
        id: 'photo-28',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/e/37/7aba632d3ce4e416aa5e3455ebcb3jpeg.jpeg'
      },
      {
        id: 'photo-29',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/e/37/7aba632d3ce4e416aa5e3455ebcb3jpeg.jpeg'
      },
      {
        id: 'photo-30',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/e/37/7aba632d3ce4e416aa5e3455ebcb3jpeg.jpeg'
      },
      {
        id: 'photo-31',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/e/37/7aba632d3ce4e416aa5e3455ebcb3jpeg.jpeg'
      },
      {
        id: 'photo-32',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/1/f2/2611d4470f30cf67396b1a0e4f886jpeg.jpeg'
      },
      {
        id: 'photo-33',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/1/f2/2611d4470f30cf67396b1a0e4f886jpeg.jpeg'
      },
      {
        id: 'photo-34',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/1/f2/2611d4470f30cf67396b1a0e4f886jpeg.jpeg'
      },
      {
        id: 'photo-35',
        flyid: '1',
        url: 'https://fuss10.elemecdn.com/1/f2/2611d4470f30cf67396b1a0e4f886jpeg.jpeg'
      }
    ];
    this.pointlist = [{
        id: '1',
        photoid: 'photo-1',
        flyid: '1'
      },
      {
        id: '2',
        photoid: 'photo-1',
        flyid: '1'
      },
      {
        id: '3',
        photoid: 'photo-1',
        flyid: '1'
      },
      {
        id: '4',
        photoid: 'photo-2',
        flyid: '1'
      },
      {
        id: '5',
        photoid: 'photo-2',
        flyid: '1'
      },
      {
        id: '6',
        photoid: 'photo-2',
        flyid: '1'
      },
      {
        id: '7',
        photoid: 'photo-3',
        flyid: '1'
      },
      {
        id: '8',
        photoid: 'photo-3',
        flyid: '1'
      },
      {
        id: '9',
        photoid: 'photo-3',
        flyid: '1'
      },
      {
        id: '10',
        photoid: 'photo-4',
        flyid: '1'
      },
      {
        id: '11',
        photoid: 'photo-4',
        flyid: '1'
      },
      {
        id: '12',
        photoid: 'photo-4',
        flyid: '1'
      },
      {
        id: '13',
        photoid: 'photo-5',
        flyid: '1'
      },
      {
        id: '14',
        photoid: 'photo-5',
        flyid: '1'
      },
      {
        id: '15',
        photoid: 'photo-5',
        flyid: '1'
      },
      {
        id: '16',
        photoid: 'photo-6',
        flyid: '1'
      },
      {
        id: '17',
        photoid: 'photo-6',
        flyid: '1'
      },
      {
        id: '18',
        photoid: 'photo-6',
        flyid: '1'
      },
      {
        id: '19',
        photoid: 'photo-7',
        flyid: '1'
      },
      {
        id: '20',
        photoid: 'photo-7',
        flyid: '1'
      },
      {
        id: '21',
        photoid: 'photo-7',
        flyid: '1'
      },
      {
        id: '22',
        photoid: 'photo-8',
        flyid: '1'
      },
      {
        id: '23',
        photoid: 'photo-8',
        flyid: '1'
      },
      {
        id: '24',
        photoid: 'photo-8',
        flyid: '1'
      },
      {
        id: '25',
        photoid: 'photo-9',
        flyid: '1'
      },
      {
        id: '26',
        photoid: 'photo-9',
        flyid: '1'
      },
      {
        id: '27',
        photoid: 'photo-9',
        flyid: '1'
      },
      {
        id: '28',
        photoid: 'photo-10',
        flyid: '1'
      },
      {
        id: '29',
        photoid: 'photo-10',
        flyid: '1'
      },
      {
        id: '30',
        photoid: 'photo-10',
        flyid: '1'
      }
    ]
    // this.pointlist= [{
    //   id:'1',
    //   photoid: 'photo-1',
    //   flyid: '1',
    // }] 需要30条 id加1 photoid 是id加三后才加一 比如   id:'2',   photoid: 'photo-1', 直到      id:'4',才加一
  }

  method1() {
    console.log('This is method 1');
  }

  method2() {
    console.log('This is method 2');
  }
}

export default MyModule;
