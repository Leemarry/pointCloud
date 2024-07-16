

class cameraSeeting {
    /**
     * @name: 
     * @msg: 初构造 
     * @param {*} option 实例对象参数
     * @return {*}
     */
    constructor(option) {
      this._rad2deg = (180 / Math.PI);
      this._deg2rad = (1.0 / this._rad2deg);
  
      /** 相机安装倾角，0-180度*/
      this._campitch = option.campitch || 0;
      /**相机焦距 */
      this._focallen = option.focallen || 0;
      /** 传感器宽度，mm*/
      this._sensorwidth = option.sensorwidth || 0;
      /**传感器高度，mm */
      this._sensorheight = option.sensorheight || 0;
      /** 图片宽度，像素*/
      this._imagewidth = option.imagewidth || 0;
      /**图片高度，像素 */
      this._imageheight = option.imageheight || 0;
      //
      /**比例尺，根据分辨率计算得出。一般根据比例尺去计算分辨率 */
      this._blc = option.blc || 0;
      /** 分辨率，根据比例尺计算得出。*/
      this._fbl = option.fbl || 0;
      /**航向重叠率 ， 1-99 */
      this._overlap = option.overlap || 0;
      /** 旁向重叠率 ， 1-99 */
      this._sidelap = option.sidelap || 0;
      /**摄像头是否朝前，默认true */
      this._camTowardFront = option.camTowardFront !== undefined ? option.camTowardFront : true;

    }
  
    calculate() {
          // 分辨率 ,
          this._fbl = this._blc / 10000;
      // 1、计算飞行高度
      let blcnew = this._fbl / (this._sensorwidth / this._imagewidth) * 1000; // 比例尺 = 分辨率m / 相元大小 * 1000 1000d
      let flyalt = (this._focallen * blcnew / 1000 * Math.cos(this._campitch * Math.PI / 180)); //180d
      // 2、计算航线间距与旁向间距
      let fovhv = this.getFOV();
      let viewwidth = fovhv[0];
      let viewheight = fovhv[1];
  
  
      //    mm  / pixels * 100
      let cmpixel = ((viewheight / this._imageheight) * 100); //厘米/像素
      let spacing ; //航线间距
      let headingSpacing ; //航向间距
      // 摄像头超前时
      if (this._camTowardFront) {
        spacing = ((1 - (this._sidelap / 100.0)) * viewwidth); //航线间距 100.0f
        headingSpacing = ((1 - (this._overlap / 100.0)) * viewheight); //航向间距
      } else {
        // 摄像头不超前
        spacing = ((1 - (this._sidelap / 100.0)) * viewheight); //航线间距
        headingSpacing = ((1 - (this._overlap / 100.0)) * viewwidth); //航向间距
      }
      
  
      //calculate
      var values = new Array(5);
      values[0] = spacing; // 航线间距 m
      values[1] = headingSpacing; // 航向间距
      values[2] = flyalt; // 飞行高度
      values[3] = this._fbl; // 分辨率 m
      values[4] = cmpixel; // 1像素等于多少厘米，厘米/像素 个
      return values;
    }   
  
    getFOV() {
      let xiangyuan = this._sensorwidth / this._imagewidth;
  
      let bilichi = this._fbl / xiangyuan * 1000; //=分辨率(米)/相元大小*1000;
      let flscale = bilichi;  
  
      let viewwidth = (this._sensorwidth * flscale / 1000);
      let viewheight =  (this._sensorheight * flscale / 1000);
      return [viewwidth, viewheight];
    }
  
    /**
     * @name: 
     * @msg: 已知高度值，计算航线间距与旁向间距
     * @param {*} alt 高度值
     * @return {*}
     */
    calculateByAlt(alt) {
      const blcnew = alt / Math.cos(this._campitch * Math.PI / 180) * 1000 / this._focallen;
      this._fbl = blcnew / 1000 * (this._sensorwidth / this._imagewidth);
      this._blc = this._fbl * 10000;
  
      // 2、计算航线间距与旁向间距
      let fovhv = this.getFOV();
      let viewwidth = fovhv[0];
      let viewheight = fovhv[1];
  
      //    mm  / pixels * 100
      const cmpixel = ((this._viewheight / imageheight) * 100); //厘米/像素
  
      const spacing = 0; //航线间距
      const headSpacing = 0; //航向间距
      // 摄像头超前时
      if (this._camTowardFront) {
        spacing = ((1 - (this._sidelap / 100.0)) * viewwidth); //航线间距
        headSpacing = ((1 - (this._overlap / 100.0)) * viewheight); //航向间距
      } else {
        // 摄像头不超前
        spacing = ((1 - (this._sidelap / 100.0)) * viewheight); //航线间距
        headSpacing = ((1 - (this._overlap / 100.0)) * viewwidth); //航向间距
      }
      //calculateByAlt
      let values = new Array(5);
      values[0] = spacing; // 航线间距
      values[1] = headSpacing; // 航向间距
      values[2] = alt; // 飞行高度
      values[3] = fbl; // 分辨率
      values[4] = cmpixel; // 1像素等于多少厘米，厘米/像素
      return values;
    }
  
  }
export default cameraSeeting;



// importScripts('./cameraSeeting.js');
  onmessage = function(event) {
    let option = event.data;
    console.log('向主线程发送计算结果option',option);
    // 创建 cameraSeeting 实例并调用 calculate 方法
    const cameraSettings = new cameraSeeting(option);
    const values = cameraSettings.calculate();
    // console.log(values);
    // 向主线程发送计算结果
    postMessage(values);
  };