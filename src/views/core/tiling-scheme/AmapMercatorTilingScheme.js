/*
 * @Date: 2024-08-29 17:26:12
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\views\core\tiling-scheme\AmapMercatorTilingScheme.js
 * @Description: Do not edit
 */
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
// const WebMercatorTilingScheme = Cesium.WebMercatorTilingScheme;
// const WebMercatorProjection = Cesium.WebMercatorProjection;
// const Math = Cesium.Math;
// const Cartographic = Cesium.Cartographic;
// const Cartesian2 = Cesium.Cartesian2;
import CoordTransform from '../transform/CoordTransform.js'

class AmapMercatorTilingScheme extends Cesium.WebMercatorTilingScheme {
    constructor(options) {
        super(options);
        const projection = new Cesium.WebMercatorProjection();
        this._projection.project = function(cartographic, result) {
            result = CoordTransform.WGS84ToGCJ02(
                Cesium.Math.toDegrees(cartographic.longitude),
                Cesium.Math.toDegrees(cartographic.latitude)
            );
            result = projection.project(
                new Cesium.Cartographic(
                    Cesium.Math.toRadians(result[0]),
                    Cesium.Math.toRadians(result[1])
                )
            );
            return new Cesium.Cartesian2(result.x, result.y);
        };
        this._projection.unproject = function(cartesian, result) {
            const cartographic = projection.unproject(cartesian);
            result = CoordTransform.GCJ02ToWGS84(
                Cesium.Math.toDegrees(cartographic.longitude),
                Cesium.Math.toDegrees(cartographic.latitude)
            );
            return new Cesium.Cartographic(
                Cesium.Math.toRadians(result[0]),
                Cesium.Math.toRadians(result[1])
            );
        };
    }
}

export default AmapMercatorTilingScheme