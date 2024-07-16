/*
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2023-12-14 16:31:09
 * @LastEditors: Andy
 * @LastEditTime: 2023-12-15 09:40:05
 */
class MappingUtil {
    constructor(campitch, focallen, sensorwidth, sensorheight, imagewidth, imageheight, blc, overlap, sidelap, camTowardFront) {
      this.campitch = campitch ;
      this.focallen = focallen;
      this.sensorwidth = sensorwidth;
      this.sensorheight = sensorheight;
      this.imagewidth = imagewidth;
      this.imageheight = imageheight;
      this.blc = blc;
      this.overlap = overlap;
      this.sidelap = sidelap;
      this.camTowardFront = camTowardFront;
      this.rad2deg = 180 / Math.PI;
      this.deg2rad = 1.0 / this.rad2deg;
    }
  
    calculate() {
      this.fbl = this.blc / 10000;
  
      let blcnew = this.fbl / (this.sensorwidth / this.imagewidth) * 1000;  
      let flyalt = (this.focallen * blcnew / 1000 * Math.cos(this.campitch * Math.PI / 180));
  
      let fovhv = this.getFOV();
      let viewwidth = fovhv[0];
      let viewheight = fovhv[1];
      
      let cmpixel = ((viewheight / this.imageheight) * 100);  
  
      let spacing, headingSpacing;
      if (this.camTowardFront) {
        spacing = ((1 - (this.sidelap / 100.0)) * viewwidth); 
        headingSpacing = ((1 - (this.overlap / 100.0)) * viewheight);  
      } else {
        spacing = ((1 - (this.sidelap / 100.0)) * viewheight);
        headingSpacing = ((1 - (this.overlap / 100.0)) * viewwidth);
      }
  
      return [spacing, headingSpacing, flyalt, this.fbl, cmpixel];
    }    
  
    getFOV() {
      let xiangyuan = this.sensorwidth / this.imagewidth;
      let bilichi = this.fbl / xiangyuan * 1000;
      let flscale = bilichi;  
  
      let viewwidth = (this.sensorwidth * flscale / 1000);
      let viewheight = (this.sensorheight * flscale / 1000);
  
      // let fovh1 = Math.atan(this.sensorwidth / (2 * this.focallen)) * this.rad2deg * 2;
      // let fovv1 = Math.atan(this.sensorheight / (2 * this.focallen)) * this.rad2deg * 2;
      console.log(this.sensorheight);
      return [viewwidth, viewheight];
    }

  }
  export default MappingUtil;
  
//   const mappingUtil = new MappingUtil(/* pass in your constructor arguments */);
//   const results = mappingUtil.calculate();

            // // 创建 MappingUtil 实例并调用 calculate 方法
            // const mappingUtil = new MappingUtil('15', "55", '55', '8', 4096, 2160, 1, 50, 50, true);
            // const results = mappingUtil.calculate();
            // console.log(results); // 在控制台输出结果

          //   // 创建 MappingUtil 实例并调用 calculate 方法
          //   const mappingUtil = new MappingUtil(
          //     "15",
          //     "55",
          //     "55",
          //     "8",
          //     4096,
          //     2160,
          //     1,
          //     50,
          //     50,
          //     true
          // );
          // const results = mappingUtil.calculate();
          // console.log(results); // 在控制台输出结果
          // [0.2048, 0.02978909090909091, 0.3956432184480024, 0.0001, 0.0027582491582491585]