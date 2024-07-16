/*
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2024-03-21 13:24:16
 * @LastEditors: Andy
 * @LastEditTime: 2024-04-02 15:43:11
 */
// export function 

function show({messageId,data,deviceID}){
    if (deviceID == state.defaultUavSn) {
        isNowUav = true;
      }
    switch (messageId) {
        case 2200: // 大疆无人机心跳包
        if(isonline){
            state.defaultUavHeartbeat =data
        }else{
            state.defaultUavHeartbeat= null
        }
        break;
        case 2000: // 大疆无人机心跳包
        if(isonline){
            state.defaultUavHeartbeat =data
        }else{
            state.defaultUavHeartbeat= null
        }
        break;
        
        
    }
}