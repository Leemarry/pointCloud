/*
 * @Date: 2024-08-29 16:22:19
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\views\core\provider\AMapImageryProvider.js
 * @Description: Do not edit
 */
/**
 * @Author: Caven Chen
 * @Date: 2020-01-15
 */

// import GCJ02TilingScheme from '../tiling-scheme/GCJ02TilingScheme.js'
// // import { UrlTemplateImageryProvider } from 'cesium'
// // 使用 Cesium 全局变量
// const UrlTemplateImageryProvider = Cesium.UrlTemplateImageryProvider;

// const TILE_URL = {
//     img: '//webst{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
//     elec: '//webrd{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
//     cva: '//webst{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
// }

// class AMapImageryProvider extends UrlTemplateImageryProvider {
//     constructor(options = {}) {
//         options['url'] =
//       options.url ||
//       [
//           options.protocol || '',
//           TILE_URL[options.style] || TILE_URL['elec']
//       ].join('')
//         if (!options.subdomains || !options.subdomains.length) {
//             options['subdomains'] = ['01', '02', '03', '04']
//         }
//         if (options.crs === 'WGS84') {
//             options['tilingScheme'] = new GCJ02TilingScheme()
//         }
//         super(options)
//     }
// }
// export default AMapImageryProvider

/*
 * 高德地图主类
 * @Author: Wang jianLei
 * @Date: 2022-07-04 10:59:54
 * @Last Modified by: Wang JianLei
 * @Last Modified time: 2022-07-05 11:41:48
 */

import AmapMercatorTilingScheme from '../tiling-scheme/AmapMercatorTilingScheme';
const Cesium = window.Cesium;

class AmapImageryLayerProvider extends Cesium.UrlTemplateImageryProvider {
    constructor(options = {}) {
        if (!options.url) throw new Error('Map service url is required!');
        if (!options.subdomains || !options.subdomains.length) {
            options['subdomains'] = ['01', '02', '03', '04'];
        }
        if (options.crs === 'WGS84') {
            options['tilingScheme'] = new AmapMercatorTilingScheme();
        }
        super(options);
    }
}
export default AmapImageryLayerProvider;
