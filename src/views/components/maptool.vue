<template>
    <el-container>
        <div class="map-tool">
            <div>
                <el-tooltip class="item" effect="light" content="航线编辑" placement="left">
                    <el-button type="info" size="mini" icon="el-icon-edit" @click="select('line')" circle></el-button>
                </el-tooltip>
            </div>
            <div>
                <el-tooltip class="item" effect="light" content="清空航线" placement="left">
                    <el-button type="info" size="mini" icon="el-icon-delete" @click="select('clear')" circle>
                    </el-button>
                </el-tooltip>
            </div>
            <div>
                <el-tooltip class="item" effect="light" content="区域选择" placement="left">
                    <el-button type="info" size="mini" icon="el-icon-news" @click="select('area')" circle></el-button>
                </el-tooltip>

            </div>
            <div>
                <el-tooltip class="item" effect="light" content="生成航线" placement="left">
                    <el-button type="info" size="mini" icon="el-icon-upload2" @click="select('produce')" circle>
                    </el-button>
                </el-tooltip>
            </div>
            <div>
                <el-tooltip class="item" effect="light" content="重新选择" placement="left">
                    <el-button type="info" size="mini" icon="el-icon-document-add" @click="select('choseAgain')" circle>
                    </el-button>
                </el-tooltip>
            </div>
        </div>
        <!-- 自动生成航线 参数面板 -->
        <div v-show="true" class="sideLeftGridParm">
            <el-row type="flex" align="middle">
                <el-col :span="10" class="value" align="left">
                    起飞点位置
                </el-col>
                <el-col :span="14" class="value" align="right">
                    <el-link type="success" @click="isEditGridChoiceStartPoint = !isEditGridChoiceStartPoint">
                        {{ isEditGridChoiceStartPoint ? '选取中...' : '选择起始点' }}</el-link>
                </el-col>
            </el-row>
            <el-row type="flex" align="middle" style="margin-top:10px">
                <el-col :span="10" class="value" align="left">
                    飞行高度
                </el-col>
                <el-col :span="12" class="value" align="right">
                    <el-input-number style="width:100%" size="mini" v-model="gridAutoParms.alt" :min="5" :max="1000"
                        label="请输入"></el-input-number>
                </el-col>
                <el-col :span="2" class="value" align="left">
                    米
                </el-col>
            </el-row>
            <el-row type="flex" align="middle">
                <el-col :span="10" class="value" align="left">
                    航线间距
                </el-col>
                <el-col :span="12" class="value" align="right">
                    <el-input-number style="width:100%" size="mini" v-model="gridAutoParms.spacing" :min="5" :max="1000"
                        label="间距"></el-input-number>
                </el-col>
                <el-col :span="2" class="value" align="left">
                    米
                </el-col>
            </el-row>
            <el-row type="flex" align="middle">
                <el-col :span="10" class="value" align="left">
                    朝向
                </el-col>
                <el-col :span="12" class="value" align="right">
                    <el-input-number style="width:100%" size="mini" v-model="gridAutoParms.yaw" :min="0" :max="180"
                        label="朝向">
                    </el-input-number>
                </el-col>
                <el-col :span="2" class="value" align="left">
                    度
                </el-col>
            </el-row>
            <el-row type="flex" align="middle">
                <el-col :span="10" class="value" align="left">
                    外扩距离
                </el-col>
                <el-col :span="12" class="value" align="right">
                    <el-input-number style="width:100%" size="mini" v-model="gridAutoParms.outlineDistance" :min="-200"
                        :max="1000" label="外扩距离"></el-input-number>
                </el-col>
                <el-col :span="2" class="value" align="left">
                    米
                </el-col>
            </el-row>
        </div>
    </el-container>

</template>
<script>
import 'ol/ol.css'
import { Feature, Collection } from 'ol'
import Translate from 'ol/interaction/Translate'
import { Point, LineString } from 'ol/geom'
import { Style, Icon, Fill, Stroke, Text } from 'ol/style'
import { Vector as VectorLayer } from 'ol/layer'
import VectorSource from 'ol/source/Vector'

export default {
    props: ['map'], // 地图组件传值
    data() {
        return {
            isEditWps: false,//编辑航线
            isInsert: false,//插入
            isEditGrid: false,//编辑区域
            isEditGridChoiceStartPoint: false,//编辑起始位置

            layer_Wp: null, //  图层 - 航点
            layer_Grid: null, // 图层 - 区域
            layer_WpLine: null, // 图层 - 航线
            layer_WpGridLine: null, // 图层 - 线条

            vectorSource_WpLine: null, // 航线集合
            vectorSource_FlyingPath: null, // 飞行路径集合
            vectorSource_GridLine: null, // 区域航线
            vectorSourceGridHome: null, // 区域 Home点

            vectorSourceWp: null, // marker 集合
            vectorSourceGridWp: null, // 区域 marker 集合
            vectorSourceUavs: null, // 无人机集合
            vectorSourceHives: null, // 停机坪集合
            feature_flypath: null, // 飞行路径对象

            translate: null, // 图标拖动层
            translateFeatures: null, // 拖动图标集合

            //图标
            wpico: require('@/assets/images/wpx64.png'),// 航点图标
            gridico: require('@/assets/images/gridx64.png'),// 区域图标
            starthomeico: require('@/assets/images/starthome.png'),//起始位置图标

            //航线区域data
            defaultWpParm: { // 默认航线值
                type: 'ef', // ef,dji
                command: 16,
                action: 0,
                alt: 30
            },
            efCommands: [], // 翼飞命令
            djiActions: [], // 大疆动作
            editWpDialogModel: {}, // 当前编辑的航点对象
            editWpDjiActionDialogModel: {
                action: 0,
                parm: 0
            }, // 编辑大疆指令

            //  修改全部航点
            editWpsDialogModel: {
                type: 0, // 0:高度，1：命令
                wpAlt: 30,
                wpAction: 16,
                wpDjiActions: ''
            },

            grids: [],//区域
            gridsWps: [],//区域航点
            wpsPath: [],//航点路径

            //区域自动生成参数
            gridAutoParms: {
                alt: 50,
                homePos: { lat: 0, lng: 0 },
                spacing: 50,
                headSpacing: 30,
                yaw: 90,
                outlineDistance: 0
            },
            // 航点数组
            wps: [{
                wpIndex: 0,
                wpLat: 0,
                wpLng: 0,
                wpAlt: 0,
                wpAltAbs: 0,
                wpAction: 0,
                wpDjiActions: '',
                wpParm1: 0,
                wpParm2: 0,
                wpParm3: 0,
                wpParm4: 0
            }],

        }
    },
    mounted() {
        this.init()
    },
    methods: {
        select(type) {
            if (type === 'line') {
                this.isEditWps = true
                this.clearWps()
            } else if (type === 'insert') {
                debugger
                this.isEditWps = false
                this.isInsert = true
            } else if (type === 'clear') {
                this.clearWps()
                this.isEditWps = false
            } else if (type === 'area') {
                this.isEditGrid = true
            } else if (type === 'produce') {
                this.autoWps()
            } else if (type === 'choseAgain') {
                this.resetGrid()
                this.isEditGrid = false
            }
        },
        async init() {
            this.vectorSource_FlyingPath = new VectorSource({ wrapX: false })
            this.vectorSource_WpLine = new VectorSource({ wrapX: false })
            this.vectorSource_GridLine = new VectorSource({ wrapX: false })
            this.vectorSourceWp = new VectorSource()
            this.vectorSourceGridWp = new VectorSource()
            this.vectorSourceGridHome = new VectorSource()

            this.layer_Wp = new VectorLayer({ source: this.vectorSourceWp })//航点图层
            this.layer_WpLine = new VectorLayer({ source: this.vectorSource_WpLine })//航线图层
            this.layer_WpGridLine = new VectorLayer({ source: this.vectorSource_GridLine })//区域航线图层 
            this.layer_Grid = new VectorLayer({ source: this.vectorSourceGridWp })//区域图层
            const layer_FlyingPath = new VectorLayer({ source: this.vectorSource_FlyingPath })
            const layerGridHome = new VectorLayer({ source: this.vectorSourceGridHome })

            this.map.addLayer(this.layer_Wp)
            this.map.addLayer(this.layer_WpLine)
            this.map.addLayer(this.layer_WpGridLine)
            this.map.addLayer(this.layer_Grid)
            this.map.addLayer(layer_FlyingPath)
            this.map.addLayer(layerGridHome)

            //加载地图点击事件
            this.map.on('singleclick', this.mapClick)
            this.map.on('dblclick', this.mapDbClick)
        },
        //地图事件*********************************

        //地图点击事件
        mapClick(mapsEvent) {
            debugger
            var position = mapsEvent.coordinate // 点击的坐标 [ 114.44734811439332, 30.451819224204485 ]
            const positionGps = { lat: position[1], lng: position[0] }
            if (this.isEditWps) {
                this.addWp(positionGps)
            } else if (this.isEditGrid) {
                this.addGridItem(positionGps)
            } else if (this.isEditGridChoiceStartPoint) {
                this.addGridStartMarker(positionGps)
                this.isEditGridChoiceStartPoint = false
            } else if (this.isInsert) {
                const wp = {
                    wpIndex: index,
                    wpLat: 0,
                    wpLng: 0,
                    wpAlt: this.defaultWpParm.alt,
                    wpAltAbs: 0,
                    wpAction: this.defaultWpParm.command,
                    wpDjiActions: '',
                    wpParm1: 0,
                    wpParm2: 0,
                    wpParm3: 0,
                    wpParm4: 0
                }
                this.insertWpDetail(wp)
            }
        },
        //正在拖拽
        draging(evt) {
            debugger
            const marker = evt.features.item(0);
            if (marker) {
                const markerId = marker.getId()
                if (markerId.indexOf('wp_') >= 0) {
                    const datas = marker.getProperties();
                    this.updateWpPostion(datas.data, evt.coordinate)
                } else if (markerId.indexOf('grid_') >= 0) {
                    const datas = marker.getProperties();
                    this.updateGridWpPostion(datas.data, evt.coordinate)
                } else if (markerId.indexOf('start_gridhome' >= 0)) {
                    // this.addGridStartMarker(positionGps)
                }
            }
        },
        //拖拽完成
        dragEnd(evt) {
            const marker = evt.features.item(0);
            if (marker) {
                const markerId = marker.getId()
                if (markerId.indexOf('wp_') >= 0) {
                    const datas = marker.getProperties();
                    this.updateWpPostion(datas.data, evt.coordinate)
                } else if (markerId.indexOf('grid_') >= 0) {
                    const datas = marker.getProperties();
                    this.updateGridWpPostion(datas.data, evt.coordinate)
                } else if (markerId.indexOf('start_gridhome' >= 0)) {
                    // this.addGridStartMarker(positionGps)
                }
            }
        },
        //区域事件*************************************

        //区域编辑
        enableGrid() {
            this.isEditGrid = !this.isEditGrid
            if (!this.isEditGrid) {
                this.resetGrid()
            }
        },
        //重置区域
        resetGrid() {
            this.grids = []
            this.gridsWps = []
            this.vectorSource_GridLine.clear()
            this.vectorSourceGridWp.clear()
            this.vectorSourceGridHome.clear()
        },
        // 自动生成航线
        autoWps() {
            if (this.gridsWps == null || this.gridsWps.length < 3) {
                this.showToast('请选择飞行区域！', 'warning')
                return
            }
            const pointsGps = []
            this.gridsWps.forEach(item => {
                const latlng = this.$gisUtil.ConvertAmapToGps(item.lat, item.lng)
                pointsGps.push({ lat: latlng.lat, lng: latlng.lng })
            })
            const alt = this.gridAutoParms.alt
            const homePos = this.gridAutoParms.homePos
            const spacing = this.gridAutoParms.spacing
            const headSpacing = this.gridAutoParms.headSpacing // TODO 航向间距
            const yaw = this.gridAutoParms.yaw
            const outlineDistance = this.gridAutoParms.outlineDistance // 外扩距离
            const listAutoWps = this.$gisUtil.GenerationWaypointsByGrid(pointsGps, homePos, spacing, headSpacing, yaw, outlineDistance)
            if (listAutoWps && listAutoWps.length > 500) {
                this.showToast('航点数量超过500个，无法渲染', 'warning')
            } else {
                this.clearWps()
                this.defaultWpParm.alt = alt
                listAutoWps.forEach(item => {
                    const lnglat = this.$gisUtil.ConvertGpsToAmap(item.lat, item.lng)
                    this.addWp(lnglat, false)
                })
                this.refreshLine()
            }
        },
        //添加起始位置的marker
        addGridStartMarker(lnglatGps) {
            debugger
            this.gridAutoParms.homePos = { lat: lnglatGps.lat, lng: lnglatGps.lng }
            //添加marker
            let marker = this.vectorSourceGridHome.getFeatureById('start_gridhome')
            if (marker != null) {
                marker.setProperties({ data: lnglatGps, lnglat: [lnglatGps.lng, lnglatGps.lat], geometry: new Point([lnglatGps.lng, lnglatGps.lat]) })
            } else {
                marker = new Feature({ data: lnglatGps, lnglat: [lnglatGps.lng, lnglatGps.lat], geometry: new Point([lnglatGps.lng, lnglatGps.lat]) })
            }
            marker.setStyle([
                new Style({
                    text: new Text({
                        textAlign: 'center',
                        textBaseline: 'middle',
                        font: '12px serif',
                        // text: index+ '',
                        fill: new Fill({ color: 'white' }), // 字体颜色
                        // stroke: new Stroke({ color: 'red' }),
                        offsetX: 0,
                        offsetY: 0, // 调整相对位置
                        rotation: 0
                    })
                }), new Style({
                    image: new Icon({
                        src: this.starthomeico,
                        opacity: 0.5,
                        scale: 0.5
                    })
                })
            ])
            marker.setId('start_gridhome')
            this.vectorSourceGridHome.addFeature(marker)
            try {
                this.translate = new Translate({ //拖拽移动interaction
                    features: new Collection([marker]) //拖拽的为选择的要素
                });
                this.map.addInteraction(this.translate);
                this.translate.on('translatestart', this.dragStart);
                this.translate.on('translating', this.draging);
                this.translate.on('translateend', this.dragEnd);
            } catch (e) { }
        },
        //添加区域要素
        addGridItem(lnglatGps) {
            this.grids.push([lnglatGps.lng, lnglatGps.lat])
            const gridItem = {
                index: 0,
                lat: lnglatGps.lat,
                lng: lnglatGps.lng,
                alt: this.defaultWpParm.alt,
                altAbs: 0,
                action: this.defaultWpParm.command,
                djiActions: '',
                parm1: 0,
                parm2: 0,
                parm3: 0,
                parm4: 0
            }
            gridItem.index = this.gridsWps.length
            this.gridsWps.push(gridItem)

            //添加标记
            const index = gridItem.index
            const marker = new Feature({ data: gridItem, lnglat: [gridItem.lng, gridItem.lat], geometry: new Point([gridItem.lng, gridItem.lat]) })
            marker.setStyle([
                new Style({
                    text: new Text({
                        textAlign: 'center',
                        textBaseline: 'middle',
                        font: '12px serif',
                        text: index + 1 + '',
                        fill: new Fill({ color: 'white' }), // 字体颜色
                        // stroke: new Stroke({ color: 'red' }),
                        offsetX: 0,
                        offsetY: 0, // 调整相对位置
                        rotation: 0
                    })
                }), new Style({
                    image: new Icon({
                        src: this.gridico,
                        // anchor: [0.5, 0.5],
                        opacity: 0.5,
                        scale: 0.5
                    })
                })
            ])
            marker.setId('grid_' + index)
            this.vectorSourceGridWp.addFeature(marker)
            try {
                this.translate = new Translate({ //拖拽移动interaction
                    features: new Collection([marker]) //拖拽的为选择的要素
                });
                this.map.addInteraction(this.translate);
                this.translate.on('translatestart', this.dragStart);
                this.translate.on('translating', this.draging);
                this.translate.on('translateend', this.dragEnd);
            } catch (e) { }
            this.refreshGridLine()
        },
        //更新区域坐标位置
        updateGridWpPostion(wp, positionGps) {
            wp.lat = positionGps[1]
            wp.lng = positionGps[0]
            this.gridsWps.splice(wp.index, 1, wp)
            this.grids.splice(wp.index, 1, positionGps)
            const index = wp.index
            //修改航点
            let marker = this.vectorSourceGridWp.getFeatureById('grid_' + index)
            if (marker != null) {
                marker.setProperties({ data: wp, lnglat: [wp.lng, wp.lat], geometry: new Point([wp.lng, wp.lat]) })
                marker.setId('grid_' + index)
                marker.setStyle([
                    new Style({
                        text: new Text({
                            textAlign: 'center',
                            textBaseline: 'middle',
                            font: '12px serif',
                            text: index + 1 + '',
                            fill: new Fill({ color: 'white' }), // 字体颜色
                            offsetX: 0,
                            offsetY: 0, // 调整相对位置
                            rotation: 0
                        })
                    }), new Style({
                        image: new Icon({
                            src: this.gridico,
                            opacity: 0.5,
                            scale: 0.5
                        })
                    })
                ])
            }
            this.refreshGridLine()
        },
        //刷新区域
        refreshGrid() {
            this.gridsWps.forEach((wp, index) => {
                wp.index = index
            })
            this.refreshGridLine()
        },
        //刷新区域航线
        refreshGridLine() {
            const wpsPathTemp = []
            this.gridsWps.forEach((wp, index) => {
                if (wp.lat !== 0 && wp.lng !== 0) {
                    wpsPathTemp.push([wp.lng, wp.lat])
                }
            })
            if (wpsPathTemp.length > 1) {
                wpsPathTemp.push(wpsPathTemp[0])
            }
            // 下边来添加一线feature
            var feature = new Feature({ type: 'lineStyle', geometry: new LineString(wpsPathTemp) })
            const lineStyle = new Style({ stroke: new Stroke({ color: '#1AFA29', width: 2, opacity: 0.5 }) })
            // 添加线的样式
            feature.setStyle(lineStyle)
            this.vectorSource_GridLine.clear()
            // 添加线的fature
            this.vectorSource_GridLine.addFeature(feature)
        },

        //航点事件*******************************

        //航点插入细节
        insertWpDetail(wp) {

            if (wp.wpIndex >= this.wps.length) {
                this.addWpDetail(wp, true)
            } else {
                this.wps.splice(wp.wpIndex, 0, wp)
                this.refreshWps()
            }
        },
        //添加航点
        addWp(lnglat, refreshLine) {
            const wp = {
                wpIndex: this.wps.length,
                wpLat: lnglat.lat,
                wpLng: lnglat.lng,
                wpAlt: this.defaultWpParm.alt,
                wpAltAbs: 0,
                wpAction: this.defaultWpParm.command,
                wpDjiActions: '',
                wpParm1: 0,
                wpParm2: 0,
                wpParm3: 0,
                wpParm4: 0,
                wpDjiActionRepeatTimes: 1
            }
            if (refreshLine) {
                this.addWpDetail(wp, refreshLine)
            } else {
                this.addWpDetail(wp, true)
            }
        },
        //添加航点细节
        addWpDetail(wp, refreshLine) {
            wp.wpIndex = this.wps.length
            this.wps.push(wp)
            this.addMarkerWp(wp)
            if (refreshLine && refreshLine === true) {
                this.refreshLine()
            }
        },
        //添加航点标记
        addMarkerWp(wp) {
            const index = wp.wpIndex
            const marker = new Feature({ data: wp, lnglat: [wp.wpLng, wp.wpLat], geometry: new Point([wp.wpLng, wp.wpLat]) })
            marker.setStyle([
                new Style({
                    text: new Text({
                        textAlign: 'center',
                        textBaseline: 'middle',
                        font: '12px serif',
                        text: index + 1 + '',
                        fill: new Fill({ color: 'white' }), // 字体颜色
                        // stroke: new Stroke({ color: 'red' }),
                        offsetX: 0,
                        offsetY: 0, // 调整相对位置
                        rotation: 0
                    })
                }), new Style({
                    image: new Icon({
                        src: this.wpico,
                        // anchor: [0.5, 0.5],
                        opacity: 0.6,
                        scale: 0.6
                    })
                })
            ])
            marker.setId('wp_' + index)
            this.vectorSourceWp.addFeature(marker)
            // this.translateFeatures.push(marker)
            try {
                // if (this.translate !== null) {
                //     this.map.removeInteraction(this.translate)
                // }
                this.translate = new Translate({ //拖拽移动interaction
                    features: new Collection([marker]) //拖拽的为选择的要素
                });
                this.map.addInteraction(this.translate);
                this.translate.on('translatestart', this.dragStart);
                this.translate.on('translating', this.draging);
                this.translate.on('translateend', this.dragEnd);
            } catch (e) { }
        },
        //更新航点位置
        updateWpPostion(wp, position) {
            wp.wpLat = position[1]
            wp.wpLng = position[0]
            this.updateWpDetail(wp)
        },
        //更新航点细节
        updateWpDetail(wp) {
            const index = wp.wpIndex
            this.wps.splice(index, 1, wp);
            //修改航点
            let marker = this.vectorSourceWp.getFeatureById('wp_' + index)
            if (marker != null) {
                marker.setProperties({ data: wp, lnglat: [wp.wpLng, wp.wpLat], geometry: new Point([wp.wpLng, wp.wpLat]) })
                marker.setId('wp_' + index)
                marker.setStyle([
                    new Style({
                        text: new Text({
                            textAlign: 'center',
                            textBaseline: 'middle',
                            font: '12px serif',
                            text: index + 1 + '',
                            fill: new Fill({ color: 'white' }), // 字体颜色
                            offsetX: 0,
                            offsetY: 0, // 调整相对位置
                            rotation: 0
                        })
                    }), new Style({
                        image: new Icon({
                            src: this.wpico,
                            // anchor: [0.5, 0.5],
                            opacity: 0.6,
                            scale: 0.6
                        })
                    })
                ])
            }
            this.refreshLine()
        },
        // 刷新全部航点
        refreshWps() {
            let wpIndexTemp = 0
            this.wps.forEach((wp, index) => {
                wp.wpIndex = wpIndexTemp
                wpIndexTemp++
            })
            this.refreshLine()
        },
        //刷新航线
        refreshLine() {
            debugger
            const wpsPathTemp = []
            let wpsAlt = 0
            let wpsDistance = 0
            let wpsLat = 0
            let wpsLng = 0
            const lastLatLng = { lat: 0, lng: 0 }
            this.wps.forEach((wp, index) => {
                if (wp.wpLat !== 0 && wp.wpLng !== 0) {
                    if (wpsAlt === 0) wpsAlt = wp.wpAlt
                    if (wpsLat === 0) wpsLat = wp.wpLat
                    if (wpsLng === 0) wpsLng = wp.wpLng
                    wpsPathTemp.push([wp.wpLng, wp.wpLat])
                    if (lastLatLng.lat !== 0 && lastLatLng.lng !== 0) {
                        wpsDistance += this.$gisUtil.getDistance(lastLatLng.lat, lastLatLng.lng, 0, wp.wpLat, wp.wpLng, 0)
                    }
                    lastLatLng.lat = wp.wpLat
                    lastLatLng.lng = wp.wpLng
                }
            })
            this.wpsPath = wpsPathTemp

            //此处预留******************

            // this.wpsInfo.wpsType = this.selectedUavType === 1 ? 1 : 0
            // this.wpsInfo.wpsLat = wpsLat
            // this.wpsInfo.wpsLng = wpsLng
            // this.wpsInfo.wpsAlt = wpsAlt
            // this.wpsInfo.wpsDistance = wpsDistance
            // this.wpsInfo.wpsUserTime = wpsDistance / 5 // 预计飞行耗时
            // this.wpsInfo.wpsWpCount = this.wps.length
            // this.wpsInfo.wpsLocation = ''
            // this.wpsInfo.wpsAltAbs = 30

            // 下边来添加一线feature
            var feature = new Feature({
                type: 'lineStyle',
                geometry: new LineString(
                    wpsPathTemp // 线的坐标
                )
            })
            const lineStyle = new Style({
                stroke: new Stroke({
                    color: '#0590DF',
                    width: 2,
                    opacity: 0.5
                })
            })
            // 添加线的样式
            feature.setStyle(lineStyle)
            this.vectorSource_WpLine.clear()
            // 添加线的fature
            this.vectorSource_WpLine.addFeature(feature)
        },
        //清除航点
        clearWps() {
            this.wpsPath = []
            this.wps = []
            this.vectorSource_WpLine.clear()
            this.vectorSourceWp.clear()
        },
        showToast(msg) {
            this.$layer.msg(msg)
        },
    }
}
</script>
<style scoped lang="scss">
.map-tool {
    z-index: 2;
    position: absolute;
    right: 0px;
    bottom: 12em;
    width: 40px;
    height: 40px;
}

.sideLeftGridParm {
    overflow-y: auto;
    position: absolute;
    overflow-x: hidden;
    z-index: 1000;
    padding: 5px;
    bottom: 50px;
    left: 5px;
    width: 200px;
    height: auto;
    border-radius: 10px;
    background: rgb(250, 250, 250);
    border: 2px solid rgb(235, 232, 232);

    .value {
        font-size: 13px;
        color: rgb(0, 0, 0);
    }
}

.map-tool div:nth-child(2) {
    margin-top: 1em;
}

.map-tool div:nth-child(3) {
    margin-top: 1em;
}

.map-tool div:nth-child(4) {
    margin-top: 1em;
}

.map-tool div:nth-child(5) {
    margin-top: 1em;
}
</style>