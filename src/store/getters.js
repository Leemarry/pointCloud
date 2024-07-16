/*
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2023-11-13 10:49:39
 * @LastEditors: likai 2806699104@qq.com
 * @LastEditTime: 2024-07-12 19:18:54
 */
const getters = {
    sidebar: state => state.app.sidebar,
    // sidebar(state){
    //     state.app.sidebar
    // }, 
    device: state => state.app.device,
    token: state => state.user.token,
    clientId: state => state.user.clientId,
    companyInfo: state => state.user.companyInfo,
    roleInfo: state => state.user.roleInfo,
    systemInfo: state => state.user.systemInfo,
    userInfo: state => state.user.userInfo,
    minke:state=>state.user.minke,
    avatar: state => state.user.avatar,
    loginId: state => state.user.loginId,
    userId: state => state.user.userId,
    name: state => state.user.name,
    trtcModel: state => state.user.trtcModel,
    defaultUavIndex: state => state.settings.defaultUavIndex,
    defaultHiveIndex: state => state.settings.defaultHiveIndex,
    permission_routes: state => state.user.routes,
    refreshPage: state => state.user.refreshPage,
    sm2privateKey: state => state.user.SM2PrivateKey,
    sm2publicKey: state => state.user.SM2PublicKey,
    //心跳包信息
    webSocketData:state => state.publicData.webSocketData,
    messageId: state => state.publicData.messageId,
    deviceID: state => state.publicData.deviceID,
    socket:state => state.ws.socket,
    // 心跳包信息
    webSocketMsg: state => state.publicData.webSocketMsg,
    dailyData: state => state.publicData.dailyData,
    /**图片心跳11010 */
    imageHeartbeatList:state=>state.ws.imageHeartbeatList, // 所有图片
    defaultUavImageList:state=> state.ws.defaultUavImageList, //当前默认无人机图片列表
    defaultUavImageData:state=> state.ws.defaultUavImageData, //当前默认无人机刚拍图片回传
    defaultUavResultImageData:state=>state.ws.defaultUavResultImageData, //分析结果图片信息
    resultimageHeartbeatList:state =>state.ws.resultimageHeartbeatList, // 所有无人机分析结果图片list
    /**默认无人机实时参数显示 */
    defaultUavHeartbeat: state => state.ws.defaultUavHeartbeat,
    //当前航线信息
    currentUavId:state => state.routeData.uavId,
    currentMid:state => state.routeData.mid,
    currentMidUnifiedHeight: state => state.routeData.unifiedHeight,
    positions: state => state.routeData.positions,
    geoCoordinates: state => state.routeData.geoCoordinates,
    
    /**当前作业点 */
    currentWorkPoint:state=>state.routeData.currentWorkPoint,
    sliderValueObj:state=>state.publicData.sliderValueObj,
    /**用于处理信息提示 */
    ProcessWsMessage:state=>state.ws.ProcessWsMessage, //连接受否有处理信息
    processBlockAllList :state=>state.ws.processBlockAllList, //点击处理返回的blockAll列表信息

    
}
export default getters