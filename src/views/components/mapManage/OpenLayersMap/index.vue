<template>
  <div id="Mapss" ref="map" class="map-home" />
</template>
<script>
import * as turf from '@turf/turf';
import 'ol/ol.css';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import { Map, View, Feature, ol } from 'ol';
import { Style, Icon } from 'ol/style';
// 点要引入
import { Point } from 'ol/geom';
// 线要引入
import LineString from 'ol/geom/LineString';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import Circle from 'ol/style/Circle';
import Text from 'ol/style/Text'
import { defaults as defaultControls } from 'ol/control';
import { fromLonLat } from 'ol/proj'; //    projection: 'EPSG:4326'
import { number } from 'echarts';
import BingMaps from 'ol/source/BingMaps'
//根据项目需要去定义图层类型
let tianditu_img_w = null;//天地图卫星影像
let tianditu_cia_w = null;//卫星影像注记图层
let tianditu_vec_w = null;//矢量图层
let tianditu_cva_w = null;//矢量注记图层
let ob_layer_Map = null; // 项目地图源
const bingStyles = [
    'RoadOnDemand', // 地图
    'Aerial', // 卫星图
    'AerialWithLabelsOnDemand', // 卫星混合地图
    'CanvasDark', // 夜晚图
    'OrdnanceSurvey' // 显示很多禁止拍照图片
]
// 边界json数据
export default {
    name: 'OlMaps',
    props: {
        centerPosition: {
            default: function() {
                return [114.27932686576446, 37.540419484036846];
            },
            type: null
            // required: true,
        },
        readerKmzList: Array,
        points: Array
    },
    data() {
        return {
            zoom: 15,
            pointlinecoordinates: '',
            pointlineList: [],
            map: null,
            pointLayer: null,
            tileCache: {} // 瓦片缓存对象
        };
    },
    computed: {
    },
    watch: {
        points(newValue, oldValue) {
            console.log('边界数据变化');
            this.drowRoute(newValue)
        }
    },
    created() {
    },
    mounted() {
        this.initMap();//初始化地图方法
        // let coordinates = [
        //     { x: "106.918082", y: "31.441314", type: "lv" },
        //     { x: "86.36158200334317", y: "41.42448570787448", type: "bule" },
        //     { x: "89.71757707811526", y: "31.02619817424643", type: "lv" },
        //     { x: "116.31694544853109", y: "39.868508850821115", type: "bule" },
        //     { x: "103.07940932026341", y: "30.438580338450862", type: "lv" }
        // ];

        // 监听地图滚动和缩放事件
        // this.$refs.map.$map.on('moveend', this.handleMoveEnd);
    },
    methods: {
        // 传递数据
        // this.map.getView().setZoom(this.zoom);
        kmzmap(pointList) {
            this.map.removeLayer(this.pointLayer);//删除图层
        },
        /**
         * 初始化地图
         */
        initMap() {
            console.log('加载地图');
            tianditu_img_w = new TileLayer({
                title: '天地图卫星影像',
                source: new XYZ({
                    visible: false,
                    wrapX: false,
                    url: 'http://t4.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=9bd7a023aac6866eb11ddbff04f9d5da'
                })
            })

            tianditu_cia_w = new TileLayer({
                title: '天地图影像注记图层',
                source: new XYZ({
                    visible: false,
                    wrapX: false,
                    url: 'http://t4.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=9bd7a023aac6866eb11ddbff04f9d5da'
                })
            })
            tianditu_vec_w = new TileLayer({
                title: '天地图矢量图层',
                source: new XYZ({
                    visible: true,
                    wrapX: false,
                    url: 'http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=9bd7a023aac6866eb11ddbff04f9d5da'
                })
            })

            tianditu_cva_w = new TileLayer({
                title: '天地图矢量注记图层',
                source: new XYZ({
                    visible: true,
                    wrapX: false,
                    url: 'http://t{0-7}.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=9bd7a023aac6866eb11ddbff04f9d5da'
                })
            })
            // ob_layer_Map = new TileLayer({
            //     title: '项目推荐地图源BingMaps图层',
            //     // source: new OSM()
            //     source: new BingMaps({
            //         key: 'Av6Re9f7niM0uJOAjG7m5O9dS4N4IcN-9yZc0r7RHqE-qGsKDv2s1YN1M5XJzK10',
            //         imagerySet: bingStyles[2]
            //     })
            //     // opacity: 0.5,//透明度，作为图层属性进行设置
            // })
            // 项目地图源
            ob_layer_Map = new TileLayer({
                title: '项目推荐地图源BingMaps图层',
                source: new XYZ({
                    visible: true,
                    wrapX: false,
                    url: 'http://127.0.0.1:9090/efuav-image/hubeijux/Satellite/{z}/{x}/{y}.png'
                })
            })

            this.map = new Map({
                target: 'Mapss',
                controls: defaultControls({
                    zoom: true
                }).extend([]),
                // layers: [tianditu_img_w,tianditu_cia_w,tianditu_vec_w,tianditu_cva_w],
                layers: [ob_layer_Map],
                view: new View({
                    center: fromLonLat(this.centerPosition || [114.27932686576446, 37.540419484036846]),
                    zoom: this.zoom
                    // maxZoom: 19,
                    // minZoom: 2
                })
            });
        },
        /**
         * 批量根据经纬度坐标打点
         */
        drowRoute(points) {
            // 中心点featureCollection
            const featureCollection = [];
            points.forEach(point => {
                featureCollection.push(turf.point([point.longitude, point.latitude]));
            });

            var features = turf.featureCollection(featureCollection);
            var center = turf.center(features);
            // 设置图层
            this.pointLayer = new VectorLayer({
                source: new VectorSource()
            });
            // 添加图层
            this.map.addLayer(this.pointLayer);
            // 循环添加feature
            const featuresArr = [];
            for (let i = 0; i < points.length; i++) {
                const pointfeature = new Feature({
                    geometry: new Point(
                        fromLonLat([points[i].longitude, points[i].latitude])
                    )
                });
                // 图片
                // pointfeature.setStyle(this.getIcon(coordinates[i].type));
                // 样式
                pointfeature.setStyle(
                    new Style({
                        text: new Text({
                            textAlign: 'center',
                            textBaseline: 'middle',
                            font: '12px serif',
                            text: i + 1 + '',
                            fill: new Fill({ color: 'blue' }), // 字体颜色
                            // stroke: new Stroke({ color: 'red' }),
                            offsetX: 0,
                            offsetY: 0, // 调整相对位置
                            rotation: 0
                        }),
                        image: new Circle({
                            radius: 10,
                            fill: new Fill({
                                color: '#ffff00'
                            }),
                            stroke: new Stroke({
                                color: '#fff',
                                width: 1
                            })
                        })
                    })
                );
                featuresArr.push(pointfeature);
            } // for 结束

            // 开始线
            const lineList = [];
            for (let i = 0; i < points.length; i++) {
                lineList.push(fromLonLat([points[i].longitude, points[i].latitude]))
            }

            // 创建linefeature，一个feature就是一个线坐标信息
            const linefeature = new Feature({
                geometry: new LineString(lineList)
            });
            // 线样式
            linefeature.setStyle(
                new Style({
                    fill: new Fill({
                        color: 'rgba(0,0,255, 1)' //填充颜色
                    }),
                    stroke: new Stroke({
                        width: 2, //边界宽度
                        color: [255, 0, 0, 1] //边界颜色
                    })
                })
            );

            featuresArr.push(linefeature);
            this.setMapCenter(center.geometry.coordinates[0], center.geometry.coordinates[1], 15)
            // console.log('设置地图中心点：' + lat + ',' + lng + ',' + zoom)
            // this.centerPosition = [coordinates[0].x, coordinates[0].y]
            // this.map.getView().setCenter(fromLonLat([center.geometry.coordinates[0], center.geometry.coordinates[1]]));
            // this.zoom = 15
            // this.map.getView().setZoom(this.zoom);

            // this.animateZoom(16,19,1000)

            // 批量添加feature
            this.pointLayer.getSource().addFeatures(featuresArr);
        },
        // 丝滑放大
        animateZoom(startZoom, endZoom, duration) {
            var zoomIncrement = (endZoom - startZoom) / (duration / 16);

            var zoom = startZoom;
            var mapView = this.map.getView();

            function animate() {
                zoom += zoomIncrement;
                mapView.setZoom(zoom);

                if (zoom < endZoom) {
                    requestAnimationFrame(animate);
                }
            }
            animate();
        },
        setMapCenter(lat, lng, zoom) {
            if (lng !== 0 && lat !== 0) {
                // console.log('设置地图中心点：' + lat + ',' + lng + ',' + zoom)
                this.map.getView().setCenter(fromLonLat([lat, lng]));
            }
            if (zoom) {
                this.zoom = zoom
                this.map.getView().setZoom(this.zoom);
            }
        },
        //组件间
        updateCenterPosition(centerPosition) {
            // this.setMapCenter(centerPosition[1],centerPosition[0],15)
        },
        updateCoordinatesList(coordinatesList) {
            console.log('移除以前的图层', coordinatesList);
            // this.coordinatesList = coordinatesList
            // 移除以前的图层
            // this.map.removeLayer(this.pointLayer);//删除图层
            // this.pointLayer = null;
        },
        handleMoveEnd() {
            console.log('11');
        }
    }
};
</script>

<style lang="scss" scoped>
.map-home {
    width: 100%;
    height: 100%;

}
</style>
