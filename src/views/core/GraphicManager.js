import * as turf from '@turf/turf';
import markerManager from './MarkerManager'
import {
  CesiumPoint,
  CesiumPolyline,
  CesiumPolygon,
  CesiumLabel,
} from './Graphic'
import utils from './utils'
import {
  CVT, getPolygonArea
} from './utils'
import GraphicType from './GraphicType'
import {
  saveAs
} from 'file-saver'
import {
  map
} from 'jquery';
const console = window.console;
const LEFT_CLICK = Cesium.ScreenSpaceEventType.LEFT_CLICK;
const RIGHT_CLICK = Cesium.ScreenSpaceEventType.RIGHT_CLICK;
const MOUSE_MOVE = Cesium.ScreenSpaceEventType.MOUSE_MOVE;
const MOUSE_DOWN = Cesium.ScreenSpaceEventType.LEFT_DOWN;
const MOUSE_UP = Cesium.ScreenSpaceEventType.LEFT_UP;
class GraphicManager {
  /**
   * 鼠标交互绘制线和多边形
   * @param {Viewer}} viewer Cesium Viewer
   * @param {*} options 预留参数，目前不需要关注 
   */
  constructor(viewer, options = {}) {
    if (viewer instanceof Cesium.Viewer === false) {
      throw new Error('viewer不是一个有效的Cesium Viewer')
    }
    this.markermanager = new markerManager(viewer)
    /**
     * 定义颜色
     */
    this.fillColor = Cesium.Color.fromCssColorString('rgba(0,255,0,0.8)')
    /**
     * 定义字体
     */
    this.font = "14pt SongTi"
    /** 航线*/
    this.jdArrsMap = new Map()
    this.hfDistance = 100
    this.flog = true;
    this.viewer = viewer
    this.options = options
    /*heightReference 定义几何图形的高程基准
     *CLAMP_TO_GROUND:依附地形
     *CLAMP_TO_MODEL:依附模型
     *NONE:空间线
     */
    this._heightReference = 'CLAMP_TO_GROUND'
    this._material = undefined
    this._style = {}

    this.graphicId = undefined
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas)
    this.graphicType = undefined
    this.positions = []
    /**鼠标文字位置 */
    this.tip = new utils.CursorTip('') // 
    this.tip.visible = false
    this.mode = 'ready'
    /**
     * 鼠标拖动的状态被设定为结束或者未激活状态
     */
    this.dragging = false;
    /**
     * 交点集合
     */
    this.jdArrs = [];
    // this.init()
    // this.addEventListener()
    //当前正在编辑的graphic
    this.editManager = undefined
    /**
     * 选中点索引
     */
    this.selectedNodeIndex = -1
    //Graphic集合
    this.manager = new Map()
    const self = this
    document.onkeydown = function (event) {

      if (self.mode !== 'edit') return;

      const e = event || window.event || arguments.callee.caller.arguments[0];

      if (e && e.keyCode == 46) {
        // 按 delete
        if (self.selectedNodeIndex > -1 && self.editManager) {
          self.editManager.dropNode(self.selectedNodeIndex)
          self.highlightedNode(undefined, self.editManager.nodeGraphic)
          self.selectedNodeIndex = -1
        } else if (self.editManager) {
          self.editManager.destroy()
          self.manager.delete(self.editManager.id)
          self.mode = 'end'

          self.tip.visible = false
          const evt = new CustomEvent('deleteEvent', {
            detail: {
              mid: self.editManager ? self.editManager.mid : undefined
            }
          })
          document.dispatchEvent(evt)
          self.editManager = undefined
          // self.removeEventListener();
        }


      }

    };
    // this.tip.style.display='none'

  }
  get heightReference() {
    return this._heightReference;
  }
  set heightReference(h) {
    this._heightReference = h
    if (this.editManager) {
      this.editManager.heightReference = h
      if (this.editManager.type === 'POLYLINE') {
        this.editManager.graphic.polyline.clampToGround = /.*GROUND.*/.test(h);
        this.editManager.options.polyline.clampToGround = /.*GROUND.*/.test(h);

      } else if (this.editManager.type === 'POLYGON') {
        const graphic = this.editManager.graphic;
        const options = this.editManager.options;
        if (/.*GROUND.*/.test(h)) {
          graphic.polygon.perPositionHeight = false;
          if (this.editManager.outline) {
            this.editManager.outlineGraphic.graphic.polyline.clampToGround = true
          } // polygon.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND
          // options.polygon.heightReference= Cesium.HeightReference.CLAMP_TO_GROUND
          options.polygon.perPositionHeight = false;
        } else {
          graphic.polygon.perPositionHeight = true;
          if (this.editManager.outline) {
            this.editManager.outlineGraphic.graphic.polyline.clampToGround = false
          }
          // polygon.heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND
          // options.polygon.heightReference= Cesium.HeightReference.RELATIVE_TO_GROUND
          options.polygon.perPositionHeight = true

        }
      }
    }
  }
  get material() {
    return this._material;
  }
  set material(v) {
    this._material = v;
    if (this.editManager) {
      if (this.editManager.type === 'POLYLINE') {
        this.editManager.graphic.polyline.material = this._material;
        this.editManager.options.polyline.material = this._material;

      } else if (this.editManager.type === 'POLYGON') {
        this.editManager.graphic.polygon.material = this._material;
        this.editManager.options.polygon.material = this._material;
      }
    }
  }
  get style() {
    return this._style;
  }
  set style(option) {
    this._style = option;
    if (!this.editManager) {
      return
    }
    const keys = Object.keys(option);
    for (let key of keys) {
      if (this.editManager.type === 'POLYLINE') {
        this.editManager.graphic.polyline[key] = option[key];
        this.editManager.options.polyline[key] = option[key];
      } else if (this.editManager.type === 'POLYGON') {
        if (key !== 'outline') {
          this.editManager.graphic.polygon[key] = option[key];
        }

        this.editManager.options.polygon[key] = option[key];
      }
    }
    if (this.editManager.type === 'POLYGON') {
      this.editManager.outlineStyle = option
    }
  }

  /**
   *管理层处理 定义线实例
   * @param {Object} options 定义一个CesiumPolyline
   */
  createPolyline(CursorTipDistance, options = CesiumPolyline.defaultStyle) {
    this.graphicType = GraphicType.POLYLINE;
    const id = this.generateId();
    console.log(this.positions);
    options.positions = this.positions;
    if (/.*GROUND.*/.test(this._heightReference)) {
      options.clampToGround = true
    } else {
      options.clampToGround = false
    }
    options.material = this.material || options.material
    options.width = this.style.width || options.width
    const manager = new CesiumPolyline(this.viewer, options);
    this.tip.updateText('左键标绘，右键结束.');
    this.tip.distanceX = CursorTipDistance.distanceX;
    this.tip.distanceY = CursorTipDistance.distanceY;
    this.tip.visible = true;
    manager.mid = id
    // manager.mname = '未命名';
    manager.heightReference = this.heightReference
    this.manager.set(id, manager);
    this.graphicId = id
    this.editManager = manager
    const evt = new CustomEvent('addEvent', {
      detail: {
        mid: manager.mid,
        mtype: manager.mtype,
        mname: manager.mname,
      }
    })
    document.dispatchEvent(evt);
    const self = this;
    this.handler.setInputAction(e => {
      self.tip && self.tip.updatePosition(e.endPosition);
    }, MOUSE_MOVE)
    this.addEventListener()
    return manager

  }
  /** 
   *管理层处理 定义面实例
   * @param {Object} options 定义一个CesiumPolygon
   */
  createPolygon(CursorTipDistance, options = CesiumPolygon.defaultStyle) {
    console.log(CursorTipDistance);
    this.graphicType = GraphicType.POLYGON;
    const id = this.generateId(); //生产id
    console.log('删除生产', id);
    this.graphicId = id;
    options.positions = this.positions;

    if (/.*GROUND.*/.test(this._heightReference)) {
      options.perPositionHeight = false
      // options.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
    } else {
      options.perPositionHeight = true;
      // options.heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;
      // options.height = 0
    }

    options.material = this.material || options.material;
    options.outlineWidth = this.style.outlineWidth || options.outlineWidth;
    options.outlineColor = this.style.outlineColor || options.outlineColor;
    const manager = new CesiumPolygon(this.viewer, options);
    manager.mid = id;
    // manager.id = id;
    // manager.mname = '未命名';
    manager.heightReference = this.heightReference;
    this.tip.distanceX = CursorTipDistance.distanceX;
    this.tip.distanceY = CursorTipDistance.distanceY;
    this.tip.visible = true;
    this.tip.updateText('左键标绘，右键结束.');
    this.manager.set(id, manager);
    this.editManager = manager;
    /**DrawViewer 添加 */
    const evt = new CustomEvent('addEvent', {
      detail: {
        mid: manager.mid,
        mtype: manager.mtype, //类型
        mname: manager.mname, // 
      }
    })
    document.dispatchEvent(evt)
    const self = this;
    this.handler.setInputAction(e => {
      self.tip && self.tip.updatePosition(e.endPosition);
    }, MOUSE_MOVE)
    this.addEventListener() // 事件--点击事件

    return manager;
  }
  /**
   *管理层处理 定义点实例
   * @param {Object} options 定义一个CesiumPoint
   */
  createPoint(positions = this.positions, options = CesiumPoint.defaultStyle) {
    this.graphicType = GraphicType.POINT; // 当前点-5
    const id = this.generateId(); //生产 id
    this.graphicId = id;
    options.positions = positions;
    if (/.*GROUND.*/.test(this._heightReference)) {
      options.perPositionHeight = false
      // options.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
    } else {
      options.perPositionHeight = true;
      // options.heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;
      // options.height = 0
    }
    options.material = this.material || options.material;


  }
  /**
   * 生产id
   */
  generateId() {
    return (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + (new Date()).getTime() + '-' + Math.random().toString().substr(2, 5);
  }
  isKnownGraphic(pickedObj) {
    if (Cesium.defined(pickedObj) &&
      pickedObj.id instanceof Cesium.Entity &&
      (pickedObj.id.mtype === GraphicType.POLYLINE ||
        pickedObj.id.mtype === GraphicType.POLYGON ||
        pickedObj.id.mtype === GraphicType.POINT)) {
      return true
    }
    return false
  }
  /**
   * 将当前选中的点设为高亮 例如多边形绿色
   * @param {Cartesian3} node
   * @param {CesiumPoint} cp
   */
  highlightedNode(node, cp) {
    const soption = CesiumPoint.selectedStyle
    const doption = CesiumPoint.defaultStyle
    for (let n of cp.graphic) {
      if (n === node) {
        CesiumPoint.setStyle(n, soption)
      } else {
        CesiumPoint.setStyle(n, doption)
      }
    }

  }
  /**
   * @name: 
   * @msg: 重新名字相似进行删除
   * @param {*} viewer
   * @param {*} name 相似名字
   * @return {*}
   */
  getEntityLikeName(viewer, name) {
    if (name) {
      var entities = viewer.entities.values;
      var findEntities = [];
      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        if (entity.name && entity.name.indexOf(name) !== -1) {
          findEntities.push(entity);
        }
      }
      return findEntities;
    } else {
      return [];
    }
  }
  removeEntityLikeName(viewer = this.viewer, name) {
    if (name) {
      var cleanEntities = this.getEntityLikeName(viewer, name);
      // 清除
      cleanEntities.map((res) => {
        viewer.entities.removeById(res.id);
      });
    } else {
      viewer.entities.removeAll();
    }
  }

  // function name(点的数组， 航便间距， 转向) {

  // }


  async drawPoints(lineSegments) {
    // 绘制每条线段，并为起点和终点添加标记  
    lineSegments.forEach(function (segment, index) {
      // 提取起点和终点的坐标  
      var start = segment[0][0];
      var end = segment[0][1];

      // 创建一个Entity来表示线段  
      var polyline = viewer.entities.add({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([
            start[0], start[1],
            end[0], end[1]
          ]),
          width: 3, // 线宽  
          material: Cesium.Color.BLUE.withAlpha(0.8) // 假设主线段颜色为蓝色  
        }
      });

      // 为起点添加红色标记  
      var startPoint = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(start[0], start[1]),
        point: {
          pixelSize: 10, // 点的大小  
          color: Cesium.Color.RED, // 红色  
          outlineColor: Cesium.Color.BLACK, // 可选：外框颜色  
          outlineWidth: 2 // 可选：外框宽度  
        }
      });

      // 为终点添加绿色标记  
      var endPoint = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(end[0], end[1]),
        point: {
          pixelSize: 10,
          color: Cesium.Color.GREEN,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2
        }
      });
    });
    viewer.scene.requestRender();
  }
  drawPoints2(points) {
    // 绘制线段  
    var linePositions = [];
    points.forEach(function (point, index) {
      linePositions.push(Cesium.Cartesian3.fromDegrees(point[0], point[1]));
      if (index < points.length - 1) {
        linePositions.push(Cesium.Cartesian3.fromDegrees(points[index + 1][0], points[index + 1][1]));
      }
      // 如果需要闭合矩形，可以在最后添加起点到终点的线段  
      // 但由于我们要单独绘制点，所以这里不闭合  
    });

    // 创建一个线实体  
    viewer.entities.add({
      polyline: {
        positions: linePositions,
        width: 2,
        material: Cesium.Color.BLUE
      }
    });

    // 绘制点和标注  
    points.forEach(function (point, index) {
      var labelText = '点' + (index + 1);
      var position = Cesium.Cartesian3.fromDegrees(point[0], point[1]);

      // 创建一个点实体  
      viewer.entities.add({
        position: position,
        point: {
          pixelSize: 10,
          color: Cesium.Color.RED
        },
        label: {
          text: labelText,
          font: '14px monospace',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -9) // 调整标签位置以避免与点重叠  
        }
      });
    });


  }

  beforeBeginCalc(id, polyArr, parameters, centerPoint = [113.36693330994926, 23.156426785188327], options = CesiumPolyline.defaultStyle) {
    if (polyArr.length <= 0) {
      return;
    }
    // 解构 hfDistance 设置默认值 
    const { hfDistance = this.hfDistance, headingDistance, unifiedHeight, text } = parameters;
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
    const point = centerPoint
    const place = this.findQuadrant(tmpLonLats, point)
    // this.drawPoints2(tmpLonLats)

    var rectangleSize = this.calculateRectangleSize(tmpLonLats);
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
    var len = Math.floor(rectangleSize.width / (hfDistance / 2)); // 高度分割数量  hfDistance:间据（航之间间距）
    /**step：根据分割数量计算得到的每个矩形分割的步长。 */
    var step = rectangle.width / len; // 步长
    if (bool) {
      len = Math.floor(rectangleSize.height / (hfDistance / 2)); // 宽度分割数量
      step = rectangle.height / len; // 步长
    }

    console.log('positions', bool ? 'height' : 'width', place, tmpLonLats);
    // #region 矩形分割
    var jdArrs = []; // 交点集合
    for (var i = 0; i < len; i++) {
      var tmp = null;
      if (!bool) {
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
        //south
      }
   
      // 弧度转换为经纬度
      var tmpLonLat = this.rectangle2LonLat(tmp);
      // 计算交点
      var tmpJdarr = [];
      polyLines.map((res) => {
        var mb = null;
        if (!bool) {
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
    // #endregion
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

  calculateRectangleSize(points) {
    // 验证输入点数组是否有效  
    if (!Array.isArray(points) || points.length !== 4) {
      throw new Error('Invalid input: points array must contain exactly 4 points.');
    }
    var metersPerDegree = 111000; // 大约值，实际会随纬度变化  
    // 假设输入的点数组已经按顺时针顺序排列  
    // 计算宽度（顶部或底部边缘的经度差）  
    var width = Math.abs(points[1][0] - points[0][0]) * metersPerDegree; // 右上角 - 左上角  
    // 计算高度（左侧或右侧边缘的纬度差）  
    var height = Math.abs(points[0][1] - points[2][1]) * metersPerDegree; // 左上角 - 左下角 
    let diagonal = Math.sqrt(width * width + height * height);
    // 返回宽度和高度  
    return {
      width: width,
      height: height,
      diagonal: diagonal
    };
  }
  /**
   * 计算给定点与中心点之间的相对位置
   * @param {*} rectCorners  矩形四个顶点
   * @param {*} point  点
   * @returns 
   */
  findQuadrant(rectCorners, point) {
    // 计算中心点  
    let centerX = (rectCorners[0][0] + rectCorners[1][0] + rectCorners[2][0] + rectCorners[3][0]) / 4;
    let centerY = (rectCorners[0][1] + rectCorners[1][1] + rectCorners[2][1] + rectCorners[3][1]) / 4;

    // 比较经纬度 使用英文
    if (point[0] > centerX && point[1] > centerY) {
      return 'northeast'; // 东北
    } else if (point[0] < centerX && point[1] > centerY) {
      return 'northwest'; // 西北
    } else if (point[0] < centerX && point[1] < centerY) {
      return 'southwest'; // 南西
    } else {
      return 'southeast'; // 东南
    }
  }
  /**
   * @name: 
   * @msg:  补点计算
   * @param {*} a
   * @param {*} b
   * @param {*} spacing
   * @return {*}
   */
  calculateIntermediaryPoints(a, b, spacing) {
    var from = turf.point([a[0], a[1]]);
    var to = turf.point([b[0], b[1]]);
    var options = {
      units: 'kilometers'
    };

    var distance = turf.distance(from, to, options) * 1000;
    // console.log(`两点距离 ${distance},间距 ${spacing}`);

    const segmentCount = distance / spacing;
    // console.log(segmentCount);
    if (segmentCount < 1) {
      return [a, b];
    }
    const lat1 = a[0];
    const lon1 = a[1];
    const lat2 = b[0];
    const lon2 = b[1];
    const plat = (lat2 - lat1) / segmentCount;
    const plon = (lon2 - lon1) / segmentCount;
    const points = [a];
    for (let i = 1; i < segmentCount; i++) {
      const lat = a[0] + (plat * i);
      const lon = a[1] + (plon * i);
      points.push([lat, lon]);
    }
    points.push(b);
    // console.log(points);
    return points;
  }
  //  const distance = this.calculateDistances(a, b);
  // 弧度转换为经纬度
  rectangle2LonLat(coor) {
    const northwest = Cesium.Rectangle.northwest(coor);
    const southwest = Cesium.Rectangle.southwest(coor);
    const northeast = Cesium.Rectangle.northeast(coor);
    const southeast = Cesium.Rectangle.southeast(coor);

    const leftTop = [
      Cesium.Math.toDegrees(northwest.longitude),
      Cesium.Math.toDegrees(northwest.latitude),
    ];
    const leftBottom = [
      Cesium.Math.toDegrees(southwest.longitude),
      Cesium.Math.toDegrees(southwest.latitude),
    ];

    const rightTop = [
      Cesium.Math.toDegrees(northeast.longitude),
      Cesium.Math.toDegrees(northeast.latitude),
    ];

    const rightBottom = [
      Cesium.Math.toDegrees(southeast.longitude),
      Cesium.Math.toDegrees(southeast.latitude),
    ];

    return [leftTop, rightTop, leftBottom, rightBottom];
  }
  /**模拟飞行 */
  beginMonifly(id, polyArr) {
    const self = this;
    self.isFly = true;
    viewer.clockViewModel.shouldAnimate = true;
    if (polyArr.length <= 0) {
      return;
    }
    viewer.trackedEntity = undefined;
    // 加载新动画
    const czml = [{
      id: "document",
      name: "uva",
      version: "1.0",
      clock: {
        interval: "2022-08-04T10:00:00Z/2022-08-04T15:00:00Z",
        currentTime: "2022-08-04T10:00:00Z",
        range: "LOOP_STOP",
        multiplier: 10,
      },
    },
    {
      id: "path",
      name: "uva-tmp-fly",
      description: "<p> 飞行器</p>",
      availability: "2022-08-04T10:00:00Z/2022-08-04T15:00:00Z",
      path: {
        material: {
          polylineOutline: {
            color: {
              rgba: [255, 215, 0, 255],
            },
            outlineColor: {
              rgba: [192, 192, 192, 255],
            },
            outlineWidth: 5,
          },
        },
        width: 8,
        leadTime: 10,
        // trailTime: 1000,
        resolution: 5,
      },
      billboard: {
        image: "data:image/png;base64,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",
        scale: 1.5,
        eyeOffset: {
          cartesian: [0.0, 0.0, -10.0],
        },
      },
      position: {
        epoch: "2022-08-04T10:00:00Z",
        cartographicDegrees: [],
      },
    },
    ];

    var jdArrs = self.jdArrsMap.get(id)
    console.log(jdArrs);

    var tmp = [];
    var timesArr = []; // 存储了每个点的飞行时间
    var timeTmp = 0; // 该点飞行时间
    var height = 500; // 飞行高度
    var v = 20; // 飞行速度
    var yc = 5; // 重复飞行延迟时间 秒
    // 手动插值
    timesArr.push(0);
    tmp.push(0);
    tmp.push(jdArrs[0][0]);
    tmp.push(jdArrs[0][1]);
    tmp.push(height + Math.random() * 5 + 5);
    for (var i = 0; i < jdArrs.length; i++) {
      var times = 0;
      if (i < jdArrs.length - 1) {
        var from = turf.point(jdArrs[i]);
        var to = turf.point(jdArrs[i + 1]);
        var options = {
          units: "kilometers"
        };
        var distance = turf.distance(from, to, options);
        times = Math.round((distance * 1000) / v);
        timeTmp += times;
        timesArr.push(timeTmp);
        tmp.push(timeTmp);
        tmp.push(jdArrs[i + 1][0]);
        tmp.push(jdArrs[i + 1][1]);
        tmp.push(height + Math.random() * 5 + 5);
      }
    }
    console.log(tmp);
    console.log(timeTmp);
    // 动态配置CZML
    // 动画结束时间
    var tmpsss = new Date(
      new Date(czml[0].clock.currentTime).getTime() +
      (timesArr[timesArr.length - 1] + yc) * 1000
    ).toISOString();

    var str = czml[0].clock.currentTime + "/" + tmpsss;
    czml[0].clock.interval = str;
    czml[1].availability = str;
    czml[1].path.trailTime = timesArr[2];
    czml[1].position.cartographicDegrees = tmp;
    console.log();
    // 加载CZML
    var dataSource = viewer.dataSources.add(Cesium.CzmlDataSource.load(czml));
    // 加载同步扫描椎体
    dataSource
      .then(function (dataSource) {
        var entity = dataSource.entities.getById("path");
        entity.viewFrom = new Cesium.Cartesian3(0.0, -1000.0, 1500.0);
        viewer.trackedEntity = entity;
        var cylinderEntitys = self.addFrustum({
          length: 510.0,
          topRadius: 0.0,
          bottomRadius: self.hfDistance / 2,
          color: Cesium.Color.GREEN.withAlpha(0.5),
        });
        var property = new Cesium.SampledPositionProperty();
        for (var ind = 0; ind < timesArr.length; ind++) {
          var time = Cesium.JulianDate.addSeconds(
            viewer.clock.currentTime,
            timesArr[ind],
            new Cesium.JulianDate()
          );
          var position = entity.position.getValue(time);
          if (position) {
            var cartographic =
              Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
            var lat = Cesium.Math.toDegrees(cartographic.latitude);
            var lng = Cesium.Math.toDegrees(cartographic.longitude);
            var hei = cartographic.height / 1.9;
            property.addSample(
              time,
              Cesium.Cartesian3.fromDegrees(lng, lat, hei)
            );
          }
        }
        cylinderEntitys.position = property;
      })
      .catch(function (error) {
        window.alert(error);
      });

  }
  // 创建视锥体
  addFrustum(option) {
    var viewer = window.viewer;
    return viewer.entities.add({
      name: "uav-tmp-fly-wxsimple",
      position: Cesium.Cartesian3.fromDegrees(114.0, 36.0, 200000.0),
      cylinder: {
        slices: option.slices,
        length: option.length,
        topRadius: option.topRadius,
        bottomRadius: option.bottomRadius,
        material: option.color,
      },
    });
  }

  /**
   * 多边形面积
   *  @param {Array} points  一个点的数组：每个对象都具有 x、y、z 三个属性，表示三维空间中的坐标点。
   * x: -2103268.0884063425
   * y: 4803667.378025406
   * z: 3618484.699604547
   * 
   */
  calculatePolygonArea(points) {
    var totalArea = 0;
    var length = points.length;
    for (var i = 0; i < length; i++) {
      var currentPoint = points[i];
      var nextPoint = points[(i + 1) % length]; // 获取下一个点（如果当前点是最后一个点，则下一个点为第一个点）

      // 依次计算相邻点构成的平行四边形的面积，并累加到总面积中
      totalArea += (
        (nextPoint.x + currentPoint.x) *
        (nextPoint.y - currentPoint.y)
      );
    }
    // 最终得到的面积需要取绝对值并除以2
    return Math.abs(totalArea) / 2.0;
  }

  /**
   * @name:点击事件
   * @msg: 鼠标交互
   * @return {*}
   */
  addEventListener() {
    const self = this
    const viewer = this.viewer


    /**
     * @name: 鼠标交互
     * @msg: 当鼠标按下左键时将会触发 clickHandler 函数
     * @param {*} e
     * @return {*}
     */
    const clickHandler = function (e) {
      console.log('addEventListener', self.mode);
      //编辑要素
      if (self.mode === 'edit') {
        if (!self.editManager) {
          self.removeEventListener();
          return
        }

        const nodeGraphic = self.editManager.nodeGraphic ||
          self.editManager.outlineGraphic.nodeGraphic
        const pickedObjs = viewer.scene.drillPick(e.position)
        let known = false,
          pickedObj = undefined
        for (let obj of pickedObjs) {
          known = self.isKnownGraphic(obj)
          if (known && obj.id.mtype === GraphicType.POINT) {
            pickedObj = obj
            //再事件监听之前移除上次的监听
            self.handler.removeInputAction(MOUSE_DOWN);
            self.handler.removeInputAction(MOUSE_MOVE);
            self.handler.setInputAction(mouseDownHandler, MOUSE_DOWN);
            self.handler.setInputAction(moseMoveHandler, MOUSE_MOVE); // 编辑移动高亮点
            break
          }
        }
        // const pickedPosition=CVT.pixel2Cartesian(e.position,viewer)
        if (pickedObj && known) {
          if (pickedObj.id.mtype === GraphicType.POINT) {
            self.selectedNodeIndex = nodeGraphic.contain(pickedObj.id)
            if (self.selectedNodeIndex !== -1) {
              self.highlightedNode(pickedObj.id, nodeGraphic)
            }
          } else {
            self.highlightedNode(pickedObj.id, self.editManager.nodeGraphic)
            self.selectedNodeIndex = -1
          }

        } else {
          const graphicId = self.graphicId;

          let positions = self.editManager.type === 'POLYGON' ? self.editManager.gobackpositions() : null
          let type = self.editManager.mtype
          self.editManager && self.editManager.stopEdit()
          // self.handler.removeInputAction(MOUSE_MOVE);
          self.removeEventListener()
          self.mode = 'end'
          self.selectedNodeIndex = -1
          self.editManager = undefined
          self.tip.visible = false;
          const evt = new CustomEvent('stopEdit', {
            detail: {
              mid: graphicId,
              positions: positions,
              type: type
            }
          })
          document.dispatchEvent(evt)
        }
        return
      }
      //非法的要素类型
      if (self.graphicType != GraphicType.POLYLINE &&
        self.graphicType != GraphicType.POLYGON) {
        return;
      }
      let cartesian = CVT.pixel2Cartesian(e.position, self.viewer); // 
      if (/.*MODEL.*/.test(self._heightReference)) {
        if (!viewer.scene.pickPositionSupported) {
          console.log('This browser does not support pickPosition.')
          return
        }
        // 获取屏幕坐标的三维坐标
        cartesian = viewer.scene.pickPosition(e.position)
      }
      //添加第一个点后再监听鼠标移动事件，绘绘完成后移除监听，以免不必要的事件监听
      const target = self.manager.get(self.graphicId);

      if (target && target.positions.length === 0) {
        self.handler.removeInputAction(MOUSE_MOVE);
        self.handler.setInputAction(moseMoveHandler, MOUSE_MOVE);
      }
      if (Cesium.defined(cartesian) && self.manager.has(self.graphicId) && target) {
        target.addNode(cartesian);
      }
      self.mode = 'create'
    }
    /**
     * 右击
     */
    const rightHandler = function () {
      const manager = self.manager.get(self.graphicId);
      const graphicId = self.graphicId;
      // console.log(self.graphicType);  // 修改为undefind
      let type = self.editManager.mtype
      let positions = self.editManager.type === 'POLYGON' ? self.editManager.gobackpositions() : null
      // let position =positions[0]
      // let cartesians = CVT.cartesian2Degrees(position, self.viewer);
      // console.log(cartesians);
      // var cartographic = Cesium.Cartographic.fromCartesian(position);
      // var longitude = Cesium.Math.toDegrees(cartographic.longitude); //经度
      // var latitude = Cesium.Math.toDegrees(cartographic.latitude); //纬度
      // var height = cartographic.height; //高度
      // console.log("经纬度：" + longitude, latitude, height);
      // console.log('xxx');
      // console.log(self.editManager.gobackpositions());

      if ((self.mode === 'create') && manager) {
        // const positionsMsgEvt = new CustomEvent('positionsMsg', {
        //   detail: {
        //     mid: manager.mid,
        //     positions: positions
        //   }
        // })
        // document.dispatchEvent(positionsMsgEvt)
        manager.stopEdit();
        self.graphicType = undefined;
        self.graphicId = undefined;
        self.positions = [];
        self.mode = 'end'
        self.tip.visible = false
        self.editManager = undefined
        // const evt = new CustomEvent('stopEdit',{
        //   detail:{
        //     mid: manager.mid,
        //     positions: positions
        //   }
        // })
        // document.dispatchEvent(evt)
      } else if (self.mode === 'ready') {
        self.cancel()
      } else if (self.mode === 'edit') {
        self.editManager && self.editManager.stopEdit()
        // self.handler.removeInputAction(MOUSE_MOVE);
        self.removeEventListener()
        self.mode = 'end'
        self.selectedNodeIndex = -1
        self.editManager = undefined
        self.tip.visible = false;
      }
      // self.handler.removeInputAction(MOUSE_MOVE);
      const evt = new CustomEvent('stopEdit', {
        detail: {
          mid: manager.mid,
          positions: positions,
          type: type
        }
      })
      document.dispatchEvent(evt)
      self.removeEventListener()
    }
    /**
     * @name: 鼠标交互
     * @msg: 当鼠标移动时将会触发 moseMoveHandler 函数
     * @param {*} e
     * @return {*}
     */
    const moseMoveHandler = function (e) {
      let cartesian = CVT.pixel2Cartesian(e.endPosition, self.viewer);
      if (/.*MODEL.*/.test(self._heightReference)) {
        if (!viewer.scene.pickPositionSupported) {
          console.log('This browser does not support pickPosition.')
          return
        }
        cartesian = viewer.scene.pickPosition(e.endPosition)
      }
      if (!Cesium.defined(cartesian)) {
        return
      }
      self.tip.updatePosition(e.endPosition);
      if (self.mode === 'create') {
        //如果当前是create模式，创建辅助线
        if (self.positions.length > 1) {
          self.manager.get(self.graphicId).popNode(); //移除最后一个元素
          console.log('移除最后一个元素');

          // const manager = self.manager.get(self.graphicId);
        }
        //添加临时节点
        //再添加第一个节点前，不拾取鼠标移动的坐标
        if (self.positions.length > 0) {
          // self.positions.push(cartesian);
          self.manager.get(self.graphicId).addNode(cartesian); //添加
          console.log('添加最后一个元素');
          const area = getPolygonArea(self.positions);
          self.tip.updateText('右键结束标绘,面积：' + Number(area).toFixed(2) + " 平方米")
        }
      } else if (self.mode == 'edit' && self.dragging) {
        if (self.selectedNodeIndex !== -1) {
          self.editManager.updateNode(self.selectedNodeIndex, cartesian)
          // const positions =  self.editManager.updateNode(self.selectedNodeIndex, cartesian)

        }
      }
    }
    /**
     * @name: 鼠标交互
     * @msg: 当鼠标按下时将会触发 mouseDownHandler 函数
     * @param {*} e
     * @return {*}
     */
    const mouseDownHandler = function (e) {
      self.handler.setInputAction(mouseUpHandler, MOUSE_UP)
      const objs = viewer.scene.drillPick(e.position);
      let isCesiumPoint = false;
      console.log(objs);
      for (let obj of objs) {
        if (CesiumPoint.isCesiumPoint(obj)) {
          console.log(obj);
          isCesiumPoint = true;
        }
      }

      if (isCesiumPoint == false) {
        return;
      }

      if (self.mode === 'edit' && self.selectedNodeIndex != -1) {
        self.dragging = true
        /**
         * 设置为 true，表示启用相机的旋转功能。是为了在松开鼠标按钮后恢复相机旋转功能
         */
        viewer.scene.screenSpaceCameraController.enableRotate = false
      }

    }
    /**
     * @name: 鼠标交互
     * @msg: 当鼠标按键释放时将会触发 mouseUpHandler 函数
     * @return {*}
     */
    const mouseUpHandler = function () {
      self.dragging = false;
      viewer.scene.screenSpaceCameraController.enableRotate = true;
      self.handler.removeInputAction(MOUSE_UP);
      // self.handler.removeInputAction(MOUSE_DOWN);
    }
    this.handler.setInputAction(clickHandler, LEFT_CLICK); 
    this.handler.setInputAction(rightHandler, RIGHT_CLICK);
  }
  /**
   * @name: 
   * @msg: 
   * @param {*} id
   * @param {*} name
   * @return {*}
   */
  rename(id, name) {
    const graphic = this.manager.get(id);
    if (Cesium.defined(graphic)) {
      graphic.mname = name
    }
  }
  has(id) {
    if (this.manager) {
      return this.manager.has(id)
    }
    return false
  }
  get(id) {
    if (this.has(id)) {
      return this.manager.get(id)
    }
  }
  /**
   * 当图形处于ready状态时，不想画了
   */
  cancel() {
    const manager = this.manager.get(this.graphicId);
    manager && manager.stopEdit();
    manager && manager.destroy()
    this.graphicType = undefined;
    this.graphicId = undefined;
    this.positions = [];
    this.mode = 'end'
    this.tip.visible = false
    this.editManager = undefined
  }
  select(type, id, status) {
    if (Cesium.defined(id)) {
      const manager = this.manager.get(id)
      if (manager) {
        manager.show = status
      }
    }
    if (Cesium.defined(type)) {
      const values = this.manager.values()
      for (let v of values) {
        if (v.mtype === type) {
          v.show = status
        }
      }
    }
  }
  /**
   * 按钮修改  
   * @name: 
   * @msg:  self.mode = 'edit'  //状态为修改
   * @param {*} id self.manager.get(id);
   * @return {*}
   */
  edit(id) {
    const self = this
    console.log(self.manager);
    const manager = self.manager.get(id);
    this.handler.setInputAction(e => {
      self.tip.updatePosition(e.endPosition);
    }, MOUSE_MOVE);
    self.graphicId = id;
    if (Cesium.defined(manager)) {
      // manager.zoomTo()
      self.mode = 'edit' //状态为修改
      manager.startEdit();
      self.tip.visible = true;
      self.tip.updateText('拖动节点编辑，按del删除.')
      self.editManager = manager; //编辑
      const evt = new CustomEvent('startEdit', {
        detail: {
          graphicType: self.editManager.type,
          material: self.editManager.material,
          width: self.editManager.width,
          outline: self.editManager.outline,
          outlineColor: self.editManager.outlineColor,
          outlineWidth: self.editManager.outlineWidth,
          heightReference: self.editManager.heightReference
        }
      })
      document.dispatchEvent(evt)
      self.addEventListener()
    }
  }
  export(type) {
    const json = {
      type: "FeatureCollection",
      name: "graphic",
      crs: {
        type: "name",
        properties: {
          name: "urn:ogc:def:crs:OGC:1.3:CRS84"
        }
      },
      features: []
    };
    const managers = this.manager.values()
    for (let m of managers) {
      if (m.type === type) {
        json.features.push(m.toGeoJson())
      }
    }
    const blob = new Blob([JSON.stringify(json)], {
      type: ""
    });
    saveAs(blob, type + parseInt(Cesium.getTimestamp()) + '.geojson');
  }
  import(feat) {
    const id = this.generateId();
    let graphic, coordinates, positions = [];
    if (feat.geometry.type.toUpperCase() === 'LineString'.toUpperCase()) {
      coordinates = feat.geometry.coordinates
      for (let c of coordinates) {
        positions.push({
          lon: c[0],
          lat: c[1],
          height: c[2]
        })
      }
      try {
        graphic = CesiumPolyline.fromDegrees(this.viewer, positions, feat.properties);
      } catch (e) {
        console.log(e)
      }

    } else if (feat.geometry.type.toUpperCase() === "POLYGON") {
      coordinates = feat.geometry.coordinates[0]
      for (let c of coordinates) {
        positions.push({
          lon: c[0],
          lat: c[1],
          height: c[2]
        })
      }
      graphic = CesiumPolygon.fromDegrees(this.viewer, positions, feat.properties);
    } else {
      throw new Error('不能识别的数据源.')
    }
    if (graphic) {
      graphic.mid = id;
      graphic.mname = feat.properties.name
      this.manager.set(id, graphic)
      const evt = new CustomEvent('addEvent', {
        detail: {
          mid: graphic.mid,
          mtype: graphic.mtype,
          mname: graphic.mname || '未命名',
        }
      })
      document.dispatchEvent(evt)
    }
    return graphic

  }

  removeEventListener() {
    this.handler.removeInputAction(LEFT_CLICK);
    this.handler.removeInputAction(MOUSE_MOVE);
    this.handler.removeInputAction(RIGHT_CLICK);
    this.handler.removeInputAction(MOUSE_DOWN)
    this.handler.removeInputAction(MOUSE_UP)
  }
  removeAll() {
    const values = this.manager.values();
    for (let v of values) {
      v.remove();
      v.destroy();
    }
    this.manager.clear();
    this.tip.visible = false;
  }

  destroy() {
    console.log('destroy');
    this.activeManager = undefined
    this.manager = undefined // map 实体key value
    this.editManager = undefined
    this.removeEventListener()
    if (!this.handler.isDestroyed) {
      this.handler.destroy()
      this.handler = undefined
    }
  }
  destroyManager() {
    const manager = this.editManager;
    const evt = new CustomEvent('destroyEvent', {
      detail: {
        mid: manager ? manager.mid : undefined
      }
    })
    if (manager) {
      if (this.mode === 'edit') {
        manager && manager.stopEdit();
      } else {
        manager && manager.destroy();
        this.manager.delete(this.graphicId)
      }
      this.editManager = undefined;
    }

    this.graphicId = undefined;
    this.handler.removeInputAction(MOUSE_MOVE);
    this.positions = [];

    document.dispatchEvent(evt);
  }
}
export default GraphicManager
