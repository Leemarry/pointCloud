/**
 * @Author: Caven Chen
 * @Date: 2020-01-15
 */

// import {
//     WebMercatorTilingScheme,
//     WebMercatorProjection,
//     Math as CesiumMath,
//     Cartographic,
//     Cartesian2
// } from 'cesium'
// 使用 Cesium 全局变量
const WebMercatorTilingScheme = Cesium.WebMercatorTilingScheme;
const WebMercatorProjection = Cesium.WebMercatorProjection;
const Math = Cesium.Math;
const Cartographic = Cesium.Cartographic;
const Cartesian2 = Cesium.Cartesian2;
import CoordTransform from '../transform/CoordTransform.js'

class GCJ02TilingScheme extends WebMercatorTilingScheme {
    constructor(options) {
        super(options)
        const projection = new WebMercatorProjection()
        this._projection.project = function(cartographic, result) {
            result = CoordTransform.WGS84ToGCJ02(
                Math.toDegrees(cartographic.longitude),
                Math.toDegrees(cartographic.latitude)
            )
            result = projection.project(
                new Cartographic(
                    Math.toRadians(result[0]),
                    Math.toRadians(result[1])
                )
            )
            return new Cartesian2(result.x, result.y)
        }
        this._projection.unproject = function(cartesian, result) {
            const cartographic = projection.unproject(cartesian)
            result = CoordTransform.GCJ02ToWGS84(
                Math.toDegrees(cartographic.longitude),
                Math.toDegrees(cartographic.latitude)
            )
            return new Cartographic(
                Math.toRadians(result[0]),
                Math.toRadians(result[1])
            )
        }
    }
}

export default GCJ02TilingScheme

