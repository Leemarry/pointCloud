import store from '../store'
import {
  Message
} from 'element-ui'
// http://127.0.0.1:8080/efapi/uavsystem
var url = 'ws://127.0.0.1:8080/efapi/uavsystem/net/websocket/'
var socket;
var timer_reconnect;
var lockReconnect = false; // 避免重复连接
var clientId = ""; // 缓存中取出客户端id
var clientUserName = ""; // 用户名称

var websocket = {
  Init: function () {
    clientId = store.getters.loginId
    clientUserName = store.getters.name
    if ("WebSocket" in window) {
      socket = new WebSocket(url + clientId + "/" + clientUserName);
    } else if ("MozWebSocket" in window) {
      socket = new MozWebSocket(url + clientId + "/" + clientUserName);
    } else {
      console.log("您的浏览器不支持 WebSocket!");
      return;
    }
    socket.onmessage = function (e) {
      console.log("接收消息:" + e.data)
      heartCheck.start()
      if (e.data === 'ok') { // 心跳消息不做处理
        return
      }
      // messageHandle(e.data)
    }

    socket.onclose = function () {
      console.log("连接已关闭")
      Message({
        message: '与服务器连接断开！',
        type: 'error',
      });
      reconnect(clientId);
    }

    socket.onopen = function () {
      console.log("连接Websocket成功")
      Message({
        message: '连接服务器成功',
        type: 'success',
      });
      heartCheck.start();
    }

    socket.onerror = function (e) {
      console.log("数据传输发生错误");
      Message({
        message: '数据传输发生错误',
        type: 'error',
      });
      reconnect(clientId)
    }
  },
  Send: function (sender, reception, body, flag) {
    let data = {
      sender: sender,
      reception: reception,
      body: body,
      flag: flag
    }
    let msg = JSON.stringify(data)
    console.log("发送消息：" + msg)
    socket.send(msg)
  },
  getWebSocket() {
    return socket;
  },
  getStatus() {
    if (socket.readyState == 0) {
      return "未连接";
    } else if (socket.readyState == 1) {
      return "已连接";
    } else if (socket.readyState == 2) {
      return "连接正在关闭";
    } else if (socket.readyState == 3) {
      return "连接已关闭";
    }
  },
  close() {
    timer_reconnect && clearTimeout(timer_reconnect);
    if (socket !== null) {
      socket.close();
    }
  }
}

export default websocket;

// 根据消息标识做不同的处理
function messageHandle(message) {
  let msg = JSON.parse(message)
  switch (msg.flag) {
    case 'command':
      console.log("指令消息类型")
      break;
    case 'inform':
      console.log("通知")
      break;
    default:
      console.log("未知消息类型")
  }
}

function reconnect(sname) {
  if (lockReconnect) {
    return;
  };
  lockReconnect = true;
  // 没连接上会一直重连，设置延迟避免请求过多
  timer_reconnect && clearTimeout(timer_reconnect);
  timer_reconnect = setTimeout(function () {
    console.log("执行断线重连...")
    websocket.Init(sname);
    lockReconnect = false;
  }, 8000);
}

// 心跳检测
var heartCheck = {
  timeout: 1000 * 60 * 3,
  timeoutObj: null,
  serverTimeoutObj: null,
  start: function () {
    console.log('开始心跳检测');
    var self = this;
    this.timeoutObj && clearTimeout(this.timeoutObj);
    this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
    this.timeoutObj = setTimeout(function () {
      // 这里发送一个心跳，后端收到后，返回一个心跳消息，
      //o nmessage拿到返回的心跳就说明连接正常
      console.log('心跳检测...');
      socket.send("心跳包:" + clientId);
      self.serverTimeoutObj = setTimeout(function () {
        if (socket.readyState != 1) {
          socket.close();
        }
        // createWebSocket();
      }, self.timeout);

    }, this.timeout)
  }
}
