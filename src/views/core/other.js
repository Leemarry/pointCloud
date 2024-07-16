/*
 * @Date: 2024-07-15 11:06:42
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \UavReseedingPages\src\views\core\other.js
 * @Description: Do not edit
 */
// if(flog){
//     // 坐标点数组  
// var points =tmpLonLat 

// // 绘制线段  
// var linePositions = [];  
// points.forEach(function(point, index) {  
// linePositions.push(Cesium.Cartesian3.fromDegrees(point[0], point[1]));  
// if (index < points.length - 1) {  
// linePositions.push(Cesium.Cartesian3.fromDegrees(points[index + 1][0], points[index + 1][1]));  
// }  
// // 如果需要闭合矩形，可以在最后添加起点到终点的线段  
// // 但由于我们要单独绘制点，所以这里不闭合  
// });  

// // 创建一个线实体  
// viewer.entities.add({  
// polyline: {  
// positions: linePositions,  
// width: 2,  
// material: Cesium.Color.BLUE  
// }  
// });  

// // 绘制点和标注  
// points.forEach(function(point, index) {  
// var labelText = '点' + (index);  
// var position = Cesium.Cartesian3.fromDegrees(point[0], point[1]);  

// // 创建一个点实体  
// viewer.entities.add({  
// position: position,  
// point: {  
// pixelSize: 10,  
// color: Cesium.Color.RED  
// },  
// label: {  
// text: labelText,  
// font: '14px monospace',  
// style: Cesium.LabelStyle.FILL_AND_OUTLINE,  
// outlineWidth: 2,  
// verticalOrigin: Cesium.VerticalOrigin.BOTTOM,  
// pixelOffset: new Cesium.Cartesian2(0, -9) // 调整标签位置以避免与点重叠  
// }  
// });  
// });
// flog = false
// }

  /**
   * @name: 
   * @msg: 点数组（三维坐标）绘制航线
   * @param {*} id 需要绘制航线的多边形id
   * @param {*} polyArr 三维坐标数组
   * @param {*} hfDistance  间据（航之间间距）
   * @param {*} headingDistance  航向间距
   * @param {*} unifiedHeight  统一高度
   * @return {*}  id, positions, hfDistance, unifiedHeight，text
   */
  beginCalcOld(id, polyArr, hfDistance = this.hfDistance, headingDistance, unifiedHeight, text, options = CesiumPolyline.defaultStyle) {
    if (polyArr.length <= 0) {
      return;
    }
    const self = this;
    // 清除之前计算结果entity
    // this.removeEntityLikeName(viewer, id+"uav-tmp"); //修改
    var geodesic = Cesium.BoundingRectangle.fromPoints(polyArr); // 外接矩形获取
    var rectangle = Cesium.Rectangle.fromCartesianArray(polyArr); // 外接矩形获取
    // 把面拆分成线并转换为经纬度格式存储
    var polyLines = [];
    // polyLines polyArr 将面的三维坐标 数组 转换成 相邻两点的经纬度坐标为一组的
    polyArr.map((res, index) => {
      var tmp = [];
      var ellipsoid = viewer.scene.globe.ellipsoid;
      var cartesian3 = new Cesium.Cartesian3(res.x, res.y, res.z);
      var cartographic = ellipsoid.cartesianToCartographic(cartesian3);
      var cartesian31 = null;
      var cartographic1 = null;
      if (index === polyArr.length - 1) {
        // 最后一个点连接顶点
        cartesian31 = new Cesium.Cartesian3(
          polyArr[0].x,
          polyArr[0].y,
          polyArr[0].z
        );
        cartographic1 = ellipsoid.cartesianToCartographic(cartesian31);
        tmp.push([
          [
            Cesium.Math.toDegrees(cartographic.longitude),
            Cesium.Math.toDegrees(cartographic.latitude),
          ],
          [
            Cesium.Math.toDegrees(cartographic1.longitude),
            Cesium.Math.toDegrees(cartographic1.latitude),
          ],
        ]);
      } else {
        cartesian31 = new Cesium.Cartesian3(
          polyArr[index + 1].x,
          polyArr[index + 1].y,
          polyArr[index + 1].z
        );
        cartographic1 = ellipsoid.cartesianToCartographic(cartesian31);
        tmp.push([
          [
            Cesium.Math.toDegrees(cartographic.longitude),
            Cesium.Math.toDegrees(cartographic.latitude),
          ],
          [
            Cesium.Math.toDegrees(cartographic1.longitude),
            Cesium.Math.toDegrees(cartographic1.latitude),
          ],
        ]);
      }
      polyLines.push(tmp);
    });
    // 等高分割矩形
    var bool = geodesic.width < geodesic.height;
    var len = Math.floor(geodesic.height / (hfDistance / 2)); // 高度分割数量
    var step = rectangle.height / len; // 步长
    if (bool) {
      len = Math.floor(geodesic.width / (hfDistance / 2)); // 宽度分割数量
      step = rectangle.width / len; // 步长
    }

    var jdArrs = []; // 交点集合
    //   console.log(rectangle, len, step)
    for (var i = 0; i < len; i++) {
      var tmp = null;
      if (bool) {
        tmp = new Cesium.Rectangle(
          rectangle.east - step * (i + 1),
          rectangle.south,
          rectangle.east - step * i,
          rectangle.north
        );
      } else {
        tmp = new Cesium.Rectangle(
          rectangle.west,
          rectangle.north - step * (i + 1),
          rectangle.east,
          rectangle.north - step * i
        );
      }
      // 弧度转换为经纬度
      var tmpLonLat = this.rectangle2LonLat(tmp);
      // 计算交点
      var tmpJdarr = [];
      polyLines.map((res) => {
        var mb = null;
        if (bool) {
          mb = turf.lineString([
            [tmpLonLat[1][0], tmpLonLat[1][1]],
            [tmpLonLat[3][0], tmpLonLat[3][1]],
          ]);
        } else {
          mb = turf.lineString([
            [tmpLonLat[1][0], tmpLonLat[1][1]],
            [tmpLonLat[0][0], tmpLonLat[0][1]],
          ]);
        }

        var intersects = turf.lineIntersect(turf.lineString(res[0]), mb);
        if (intersects.features.length > 0) {
          var tmplatlon = intersects.features[0].geometry.coordinates;
          tmpJdarr.push(tmplatlon);
        }
      });
      // 就近往返
      if (i > 0) {
        var distance1 = turf.distance(
          turf.point(tmpJdarr[0]),
          turf.point(jdArrs[jdArrs.length - 1]), {
          units: "kilometers"
        }
        );
        var distance2 = turf.distance(
          turf.point(tmpJdarr[1]),
          turf.point(jdArrs[jdArrs.length - 1]), {
          units: "kilometers"
        }
        );
        //   console.log(i, distance1, distance2)
        if (distance1 > distance2) {
          tmpJdarr = tmpJdarr.reverse();
        }
      }
      // 存储交点
      tmpJdarr.map((res) => {
        jdArrs.push(res);
      });
    }

    if (jdArrs.length < 2) {
      console.log('间距过大，规划航线有误！(多边形面积过小)');
      return;
    }
    if (jdArrs[0][0] === jdArrs[1][0] && jdArrs[0][1] === jdArrs[1][1]) {
      jdArrs.shift();
    } else {
      console.log('间距过大2，规划航线有误');
      return;
    }
    // 线数据
    var linesArrs = [];
    self.jdArrsMap.set(id, jdArrs)
    // 标字
    jdArrs.map((res, index, arr) => {
      let options = {
        ...CesiumLabel.defaultStyle,
        name: id + "uav-tmp-point",
        font: self.font,
        showBackground: false,
        mid: id + "uav-tmp-point",
        text: index + "",
      };
      const cartesian = Cesium.Cartesian3.fromDegrees(res[0], res[1])
      // console.log(cartesian);
      /** 点创建*/
      const evt = new CustomEvent('addmarkerEvent', {
        detail: {
          mid: id,
          index: index,
          markerid: id + "-uav-tmp-point" + index,
          options: options,
          positions: cartesian
        }
      })

      document.dispatchEvent(evt)
      // 存储线数据
      linesArrs.push(res[0]);
      linesArrs.push(res[1]);
    });


    // console.log('多边形根据间距计算经纬度的点数组');
    // console.log(jdArrs);

    var calculateList = []; //间距 计算结果的所有经纬度数组
    for (let i = 0; i < jdArrs.length; i++) {
      for (let j = i + 1; j < jdArrs.length; j++) {
        const a = jdArrs[i];
        const b = jdArrs[j];
        const result = this.calculateIntermediaryPoints(a, b, headingDistance);
        calculateList.push(...result);
        break;
      }
    }
    var uniqueArray = [...new Set(calculateList.map(JSON.stringify))].map(JSON.parse);
    // 会输出一个新的经度纬度数组，不包含重复项
    // console.log('定义发送信息',headingDistance, uniqueArray); 
    //定义发送信息 
    const evts = new CustomEvent('getpositionsEvent', {
      detail: {
        mid: id,
        positions: uniqueArray, //jdArrs
        unifiedHeight: unifiedHeight,
        text,
      }
    })
    document.dispatchEvent(evts)

    // 画方向线
    // viewer.entities.add({
    //   name: id+"uav-tmp-line",
    //   // corridor polyline
    //   polyline: {
    //     positions: Cesium.Cartesian3.fromDegreesArray(linesArrs),
    //     material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED),
    //     followSurface: true,
    //     width: 10,
    //   },
    // });
    let material = Cesium.Color.fromCssColorString('rgba(0,255,0,0.8)');
    this.graphicType = GraphicType.POLYLINE;
    options.positions = Cesium.Cartesian3.fromDegreesArray(linesArrs);
    if (/.*GROUND.*/.test(this._heightReference)) {
      options.clampToGround = true
    } else {
      options.clampToGround = false
    }
    options.material = material || options.material
    options.width = this.style.width || options.width
    const manager = new CesiumPolyline(this.viewer, options);
    manager.mid = id + "-uav-tmp-line" //赋值
    // manager.mname = '未命名';
    manager.heightReference = this.heightReference
    this.manager.set(id + "-uav-tmp-line", manager);

  }



    /**
   * @name: 
   * @msg: 点数组（三维坐标）绘制航线
   * @param {*} id 需要绘制航线的多边形id
   * @param {*} polyArr 三维坐标数组
   * @param {*} hfDistance  间据（航之间间距）
   * @param {*} headingDistance  航向间距
   * @param {*} unifiedHeight  统一高度
   * @return {*}  id, positions, hfDistance, unifiedHeight，text
   */
    beginCalc(id, polyArr, hfDistance = this.hfDistance, headingDistance, unifiedHeight, text, options = CesiumPolyline.defaultStyle) {
        if (polyArr.length <= 0) {
          return;
        }
        const self = this;
        // 清除之前计算结果entity
        // this.removeEntityLikeName(viewer, id+"uav-tmp"); //修改
        var geodesic = Cesium.BoundingRectangle.fromPoints(polyArr); // 外接矩形获取
        var rectangle = Cesium.Rectangle.fromCartesianArray(polyArr); // 外接矩形获取
    
        const tmps = new Cesium.Rectangle(
          rectangle.west,
          rectangle.south,
          rectangle.east,
          rectangle.north
        ); //west , south , east , north
        var tmpLonLats = this.rectangle2LonLat(tmps);
        // 给定的经纬度点  
        const point = [
          113.36693330994926,
          23.156426785188327
        ];
        const place = this.findQuadrant(tmpLonLats, point)
        console.log('positions',polyArr, place, tmpLonLats);
        this.drawPoints2(tmpLonLats)
    
        var rectangleSize = this.calculateRectangleSize(tmpLonLats);
        console.log("positionsWidth (in degrees):", rectangleSize.width);
        console.log("positionsHeight (in degrees):", rectangleSize.height);
        console.log("positionsdiagonal (in meters):", rectangleSize.diagonal)
        // 把面拆分成线并转换为经纬度格式存储
        var polyLines = [];
        // polyLines polyArr 将面的三维坐标 数组 转换成 相邻两点的经纬度坐标为一组的
        polyArr.map((res, index) => {
          var tmp = [];
          var ellipsoid = viewer.scene.globe.ellipsoid;
          var cartesian3 = new Cesium.Cartesian3(res.x, res.y, res.z);
          var cartographic = ellipsoid.cartesianToCartographic(cartesian3);
          var cartesian31 = null;
          var cartographic1 = null;
          if (index === polyArr.length - 1) {
            // 最后一个点连接顶点
            cartesian31 = new Cesium.Cartesian3(
              polyArr[0].x,
              polyArr[0].y,
              polyArr[0].z
            );
            cartographic1 = ellipsoid.cartesianToCartographic(cartesian31);
            tmp.push([
              [
                Cesium.Math.toDegrees(cartographic.longitude),
                Cesium.Math.toDegrees(cartographic.latitude),
              ],
              [
                Cesium.Math.toDegrees(cartographic1.longitude),
                Cesium.Math.toDegrees(cartographic1.latitude),
              ],
            ]);
          } else {
            cartesian31 = new Cesium.Cartesian3(
              polyArr[index + 1].x,
              polyArr[index + 1].y,
              polyArr[index + 1].z
            );
            cartographic1 = ellipsoid.cartesianToCartographic(cartesian31);
            tmp.push([
              [
                Cesium.Math.toDegrees(cartographic.longitude),
                Cesium.Math.toDegrees(cartographic.latitude),
              ],
              [
                Cesium.Math.toDegrees(cartographic1.longitude),
                Cesium.Math.toDegrees(cartographic1.latitude),
              ],
            ]);
          }
          polyLines.push(tmp); // 前后两点的线段
        });
        // 等高分割矩形 
        /**bool：一个布尔值，根据外接矩形的宽度是否小于高度来确定矩形是竖直方向还是水平方向。 */
        var bool = geodesic.width < geodesic.height; // 使用边距较长的边作为分割方向
        /**len：根据外接矩形的宽度或高度以及给定的航行间距 hfDistance 计算得到的需要分割的数量。假设：使用高度 */
        var len = Math.floor(geodesic.height / (hfDistance / 2)); // 高度分割数量  hfDistance:间据（航之间间距）
        /**step：根据分割数量计算得到的每个矩形分割的步长。 */
        var step = rectangle.height / len; // 步长
        if (bool) {
          len = Math.floor(geodesic.width / (hfDistance / 2)); // 宽度分割数量
          step = rectangle.width / len; // 步长
        }
        const flog = true;
        var jdArrs = []; // 交点集合
        console.log('positions', geodesic, len, place, bool)
        for (var i = 0; i < len; i++) {
          var tmp = null;
          if (bool) {
            // tmp = new Cesium.Rectangle(
            //   rectangle.east - step * (i + 1),
            //   rectangle.south,
            //   rectangle.east - step * i,
            //   rectangle.north
            // );
    
            tmp = new Cesium.Rectangle(
              rectangle.west + step * (i + 1),
              rectangle.south,
              rectangle.west + step * i,
              rectangle.north
            );
          } else {
            tmp = new Cesium.Rectangle(
              rectangle.west,
              rectangle.north - step * (i + 1),
              rectangle.east,
              rectangle.north - step * i
            );
            // 西南
            if (place.includes('south')) {
              tmp = new Cesium.Rectangle(
                rectangle.west,
                rectangle.south + step * (i + 1),
                rectangle.east,
                rectangle.south + step * i
              );
            }
            // tmp = new Cesium.Rectangle(
            //   rectangle.west,
            //   rectangle.south + step * (i + 1),
            //   rectangle.east,
            //   rectangle.south + step * i
            // );
            //south
          }
          // 弧度转换为经纬度
          var tmpLonLat = this.rectangle2LonLat(tmp);
          // 计算交点
          var tmpJdarr = [];
          polyLines.map((res) => {
            var mb = null;
            if (bool) {
              mb = turf.lineString([
                [tmpLonLat[1][0], tmpLonLat[1][1]],
                [tmpLonLat[3][0], tmpLonLat[3][1]],
              ]);
            } else {
              mb = turf.lineString([
                [tmpLonLat[1][0], tmpLonLat[1][1]],
                [tmpLonLat[0][0], tmpLonLat[0][1]],
              ]);
            }
    
            var intersects = turf.lineIntersect(turf.lineString(res[0]), mb); // 交点
            if (intersects.features.length > 0) {
              var tmplatlon = intersects.features[0].geometry.coordinates;
              tmpJdarr.push(tmplatlon);
            }
          });
          // 就近往返
          if (i > 0) {
            var distance1 = turf.distance(
              turf.point(tmpJdarr[0]),
              turf.point(jdArrs[jdArrs.length - 1]), {
              units: "kilometers"
            }
            );
            var distance2 = turf.distance(
              turf.point(tmpJdarr[1]),
              turf.point(jdArrs[jdArrs.length - 1]), {
              units: "kilometers"
            }
            );
            //   console.log(i, distance1, distance2)
            if (distance1 > distance2) {
              tmpJdarr = tmpJdarr.reverse();
            }
          }
          // 存储交点
          tmpJdarr.map((res) => {
            jdArrs.push(res);
          });
        }
        //
    
        if (jdArrs.length < 2) {
          console.log('间距过大，规划航线有误！(多边形面积过小)');
          return;
        }
        if (jdArrs[0][0] === jdArrs[1][0] && jdArrs[0][1] === jdArrs[1][1]) {
          jdArrs.shift();
        } else {
          console.log('间距过大2，规划航线有误');
          return;
        }
        // 线数据
        var linesArrs = [];
        self.jdArrsMap.set(id, jdArrs)
        // 标字
        jdArrs.map((res, index, arr) => {
          let options = {
            ...CesiumLabel.defaultStyle,
            name: id + "uav-tmp-point",
            font: self.font,
            showBackground: false,
            mid: id + "uav-tmp-point",
            text: index + "",
          };
          const cartesian = Cesium.Cartesian3.fromDegrees(res[0], res[1])
          // console.log(cartesian);
          /** 点创建*/
          const evt = new CustomEvent('addmarkerEvent', {
            detail: {
              mid: id,
              index: index,
              markerid: id + "-uav-tmp-point" + index,
              options: options,
              positions: cartesian
            }
          })
    
          document.dispatchEvent(evt)
          // 存储线数据
          linesArrs.push(res[0]);
          linesArrs.push(res[1]);
        });
    
    
        // console.log('多边形根据间距计算经纬度的点数组');
        console.log('jdArrs', jdArrs);
    
        var calculateList = []; //间距 计算结果的所有经纬度数组
        for (let i = 0; i < jdArrs.length; i++) {
          for (let j = i + 1; j < jdArrs.length; j++) {
            const a = jdArrs[i];
            const b = jdArrs[j];
            const result = this.calculateIntermediaryPoints(a, b, headingDistance);
            calculateList.push(...result);
            break;
          }
        }
        var uniqueArray = [...new Set(calculateList.map(JSON.stringify))].map(JSON.parse);
        // 会输出一个新的经度纬度数组，不包含重复项
        // console.log('定义发送信息',headingDistance, uniqueArray); 
        //定义发送信息 
        const evts = new CustomEvent('getpositionsEvent', {
          detail: {
            mid: id,
            positions: jdArrs, //jdArrs
            unifiedHeight: unifiedHeight,
            text,
            spacing: hfDistance
          }
        })
        document.dispatchEvent(evts)
    
        // 画方向线
        // viewer.entities.add({
        //   name: id+"uav-tmp-line",
        //   // corridor polyline
        //   polyline: {
        //     positions: Cesium.Cartesian3.fromDegreesArray(linesArrs),
        //     material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED),
        //     followSurface: true,
        //     width: 10,
        //   },
        // });
        let material = Cesium.Color.fromCssColorString('rgba(0,255,0,0.8)');
        this.graphicType = GraphicType.POLYLINE;
        options.positions = Cesium.Cartesian3.fromDegreesArray(linesArrs);
        if (/.*GROUND.*/.test(this._heightReference)) {
          options.clampToGround = true
        } else {
          options.clampToGround = false
        }
        options.material = material || options.material
        options.width = this.style.width || options.width
        const manager = new CesiumPolyline(this.viewer, options);
        manager.mid = id + "-uav-tmp-line" //赋值
        // manager.mname = '未命名';
        manager.heightReference = this.heightReference
        this.manager.set(id + "-uav-tmp-line", manager);
    
      }

      

      beforeBeginCalc(id, polyArr, parameters, centerPoint=[113.36693330994926, 23.156426785188327] , options = CesiumPolyline.defaultStyle) {
        if (polyArr.length <= 0) {
          return;
        }
        // 解构 hfDistance 设置默认值 
        const { hfDistance = this.hfDistance, headingDistance, unifiedHeight, text } = parameters;
        const self = this;
        var geodesic = Cesium.BoundingRectangle.fromPoints(polyArr); // 外接矩形获取
        var rectangle = Cesium.Rectangle.fromCartesianArray(polyArr); // 外接矩形获取
        const tmps = new Cesium.Rectangle(
          rectangle.west,
          rectangle.south,
          rectangle.east,
          rectangle.north
        ); //west , south , east , north
        var tmpLonLats = this.rectangle2LonLat(tmps);
        // 给定的经纬度点  
        const point =centerPoint;
        const place = this.findQuadrant(tmpLonLats, point)
        var rectangleSize = this.calculateRectangleSize(tmpLonLats);
        console.log("positionsWidth (in degrees):", rectangleSize.width);
        console.log("positionsHeight (in degrees):", rectangleSize.height);
        console.log("positionsdiagonal (in meters):", rectangleSize.diagonal)
         // 把面拆分成线并转换为经纬度格式存储
         var polyLines = [];
         // polyLines polyArr 将面的三维坐标 数组 转换成 相邻两点的经纬度坐标为一组的
         polyArr.map((res, index) => {
           var tmp = [];
           var ellipsoid = viewer.scene.globe.ellipsoid;
           var cartesian3 = new Cesium.Cartesian3(res.x, res.y, res.z);
           var cartographic = ellipsoid.cartesianToCartographic(cartesian3);
           var cartesian31 = null;
           var cartographic1 = null;
           if (index === polyArr.length - 1) {
             // 最后一个点连接顶点
             cartesian31 = new Cesium.Cartesian3(
               polyArr[0].x,
               polyArr[0].y,
               polyArr[0].z
             );
             cartographic1 = ellipsoid.cartesianToCartographic(cartesian31);
             tmp.push([
               [
                 Cesium.Math.toDegrees(cartographic.longitude),
                 Cesium.Math.toDegrees(cartographic.latitude),
               ],
               [
                 Cesium.Math.toDegrees(cartographic1.longitude),
                 Cesium.Math.toDegrees(cartographic1.latitude),
               ],
             ]);
           } else {
             cartesian31 = new Cesium.Cartesian3(
               polyArr[index + 1].x,
               polyArr[index + 1].y,
               polyArr[index + 1].z
             );
             cartographic1 = ellipsoid.cartesianToCartographic(cartesian31);
             tmp.push([
               [
                 Cesium.Math.toDegrees(cartographic.longitude),
                 Cesium.Math.toDegrees(cartographic.latitude),
               ],
               [
                 Cesium.Math.toDegrees(cartographic1.longitude),
                 Cesium.Math.toDegrees(cartographic1.latitude),
               ],
             ]);
           }
           polyLines.push(tmp); // 前后两点的线段
         });
         // 等高分割矩形 
         /**bool：一个布尔值，根据外接矩形的宽度是否小于高度来确定矩形是竖直方向还是水平方向。 */
         var bool = rectangleSize.width < rectangleSize.height; // 使用边距较长的边作为分割方向
         /**len：根据外接矩形的宽度或高度以及给定的航行间距 hfDistance 计算得到的需要分割的数量。假设：使用高度 */
         var len = Math.floor(rectangleSize.height / (hfDistance / 2)); // 高度分割数量  hfDistance:间据（航之间间距）
         /**step：根据分割数量计算得到的每个矩形分割的步长。 */
         var step = rectangleSize.height / len; // 步长
         if (bool) {
           len = Math.floor(rectangleSize.width / (hfDistance / 2)); // 宽度分割数量
           step = rectangleSize.width / len; // 步长
         }
         var jdArrs = []; // 交点集合
         for (var i = 0; i < len; i++) {
           var tmp = null;
           if (bool) {
             // tmp = new Cesium.Rectangle(
             //   rectangle.east - step * (i + 1),
             //   rectangle.south,
             //   rectangle.east - step * i,
             //   rectangle.north
             // );
             tmp = new Cesium.Rectangle(
               rectangle.west + step * (i + 1),
               rectangle.south,
               rectangle.west + step * i,
               rectangle.north
             );
           } else {
             tmp = new Cesium.Rectangle(
               rectangle.west,
               rectangle.north - step * (i + 1),
               rectangle.east,
               rectangle.north - step * i
             );
             // 西南
             if (place.includes('south')) {
               tmp = new Cesium.Rectangle(
                 rectangle.west,
                 rectangle.south + step * (i + 1),
                 rectangle.east,
                 rectangle.south + step * i
               );
             }
             // tmp = new Cesium.Rectangle(
             //   rectangle.west,
             //   rectangle.south + step * (i + 1),
             //   rectangle.east,
             //   rectangle.south + step * i
             // );
             //south
           }
           // 弧度转换为经纬度
           var tmpLonLat = this.rectangle2LonLat(tmp);
           // 计算交点
           var tmpJdarr = [];
           polyLines.map((res) => {
             var mb = null;
             if (bool) {
               mb = turf.lineString([
                 [tmpLonLat[1][0], tmpLonLat[1][1]],
                 [tmpLonLat[3][0], tmpLonLat[3][1]],
               ]);
             } else {
               mb = turf.lineString([
                 [tmpLonLat[1][0], tmpLonLat[1][1]],
                 [tmpLonLat[0][0], tmpLonLat[0][1]],
               ]);
             }
             var intersects = turf.lineIntersect(turf.lineString(res[0]), mb); // 交点
             if (intersects.features.length > 0) {
               var tmplatlon = intersects.features[0].geometry.coordinates;
               tmpJdarr.push(tmplatlon);
             }
           });
           // 就近往返
           if (i > 0) {
             var distance1 = turf.distance(
               turf.point(tmpJdarr[0]),
               turf.point(jdArrs[jdArrs.length - 1]), {
               units: "kilometers"
             }
             );
             var distance2 = turf.distance(
               turf.point(tmpJdarr[1]),
               turf.point(jdArrs[jdArrs.length - 1]), {
               units: "kilometers"
             }
             );
             //   console.log(i, distance1, distance2)
             if (distance1 > distance2) {
               tmpJdarr = tmpJdarr.reverse();
             }
           }
           // 存储交点
           tmpJdarr.map((res) => {
             jdArrs.push(res);
           });
         }
        // const jdArrs =  self.beginCalculate(polyArr,rectangle, rectangleSize, hfDistance,place)
        // #region 
        if (jdArrs.length < 2) {
          console.log('间距过大，规划航线有误！(多边形面积过小)');
          return;
        }
        if (jdArrs[0][0] === jdArrs[1][0] && jdArrs[0][1] === jdArrs[1][1]) {
          jdArrs.shift();
        } else {
          console.log('间距过大2，规划航线有误');
          return;
        }
        //#endregion
    
        // 线数据
        var linesArrs = [];
        self.jdArrsMap.set(id, jdArrs)
        // 标字
        jdArrs.map((res, index, arr) => {
          let options = {
            ...CesiumLabel.defaultStyle,
            name: id + "uav-tmp-point",
            font: self.font,
            showBackground: false,
            mid: id + "uav-tmp-point",
            text: index + "",
          };
          const cartesian = Cesium.Cartesian3.fromDegrees(res[0], res[1])
          // console.log(cartesian);
          /** 点创建*/
          const evt = new CustomEvent('addmarkerEvent', {
            detail: {
              mid: id,
              index: index,
              markerid: id + "-uav-tmp-point" + index,
              options: options,
              positions: cartesian
            }
          })
    
          document.dispatchEvent(evt)
          // 存储线数据
          linesArrs.push(res[0]);
          linesArrs.push(res[1]);
        });
    
    
        // console.log('多边形根据间距计算经纬度的点数组');
        console.log('jdArrs', jdArrs);
    
        var calculateList = []; //间距 计算结果的所有经纬度数组
        for (let i = 0; i < jdArrs.length; i++) {
          for (let j = i + 1; j < jdArrs.length; j++) {
            const a = jdArrs[i];
            const b = jdArrs[j];
            const result = this.calculateIntermediaryPoints(a, b, headingDistance);
            calculateList.push(...result);
            break;
          }
        }
        var uniqueArray = [...new Set(calculateList.map(JSON.stringify))].map(JSON.parse);
        // 会输出一个新的经度纬度数组，不包含重复项
        // console.log('定义发送信息',headingDistance, uniqueArray); 
        //定义发送信息 
        const evts = new CustomEvent('getpositionsEvent', {
          detail: {
            mid: id,
            positions: jdArrs, //jdArrs
            unifiedHeight: unifiedHeight,
            text,
            spacing: hfDistance
          }
        })
        document.dispatchEvent(evts)
    
        // 画方向线
        // viewer.entities.add({
        //   name: id+"uav-tmp-line",
        //   // corridor polyline
        //   polyline: {
        //     positions: Cesium.Cartesian3.fromDegreesArray(linesArrs),
        //     material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED),
        //     followSurface: true,
        //     width: 10,
        //   },
        // });
        let material = Cesium.Color.fromCssColorString('rgba(0,255,0,0.8)');
        this.graphicType = GraphicType.POLYLINE;
        options.positions = Cesium.Cartesian3.fromDegreesArray(linesArrs);
        if (/.*GROUND.*/.test(this._heightReference)) {
          options.clampToGround = true
        } else {
          options.clampToGround = false
        }
        options.material = material || options.material
        options.width = this.style.width || options.width
        const manager = new CesiumPolyline(this.viewer, options);
        manager.mid = id + "-uav-tmp-line" //赋值
        // manager.mname = '未命名';
        manager.heightReference = this.heightReference
        this.manager.set(id + "-uav-tmp-line", manager);
      }