<template>
  <div id="drawtoolPanel">
    <el-container>
      <el-header id="drawtoolHead">
        <span>基础标绘</span>
        <span class="closebtn cesiumDrawFont icondelete" @click="$emit('closeEvent')">1</span>
        <!-- <span class="clostbtn" @click="measurePanelShow=false"></span> -->
      </el-header>
      <el-main class="graphic-draw-main">
        <ul>
          <li>
            <i class="cesiumDrawFont iconmarker icon-class" title="添加标记" :class="{ 'selected-graphic': menuSelected['MARKER'] }" @click="menuAction('MARKER')" />
            <span :class="{ 'selected-graphic': menuSelected['MARKER'] }" @click="menuAction('MARKER')">标记</span>
          </li>
          <li>
            <i class="cesiumDrawFont iconpolyline icon-class" title="添加线段" :class="{ 'selected-graphic': menuSelected['POLYLINE'] }" @click="menuAction('POLYLINE')" />
            <span :class="{ 'selected-graphic': menuSelected['POLYLINE'] }" @click="menuAction('POLYLINE')">折线</span>
          </li>
          <li>
            <i class="cesiumDrawFont iconpolygon icon-class" title="添加多边形" :class="{ 'selected-graphic': menuSelected['POLYGON'] }" @click="menuAction('POLYGON')" />
            <span :class="{ 'selected-graphic': menuSelected['POLYGON'] }" @click="menuAction('POLYGON')">多边形</span>
          </li>
          <li>
            <i class="cesiumDrawFont iconlabel icon-class" title="添加文字" :class="{ 'selected-graphic': menuSelected['LABEL'] }" @click="menuAction('LABEL')" />
            <span :class="{ 'selected-graphic': menuSelected['LABEL'] }" @click="menuAction('LABEL')">文字</span>
          </li>
          <li v-if="extendMarkerModel.length">
            <i class="cesiumDrawFont iconmodel icon-class" title="添加模型" :class="{ 'selected-graphic': menuSelected['MODEL'] }" @click="menuAction('MODEL')" />
            <span :class="{ 'selected-graphic': menuSelected['MODEL'] }" @click="menuAction('MODEL')">模型</span>
          </li>
          <li>
            <i class="cesiumDrawFont iconmodel icon-class" title="添加影像数据" :class="{ 'selected-graphic': menuSelected['TILESET'] }" @click="menuAction('TILESET')" />
            <span :class="{ 'selected-graphic': menuSelected['TILESET'] }" @click="menuAction('TILESET')">影像图层</span>
          </li>
          <li>
            <i class="cesiumDrawFont iconlayer icon-class" :class="{ 'selected-graphic': layerManagerVisible }" title="图层管理" @click="toggleLayerManager" />
            <span :class="{ 'selected-graphic': layerManagerVisible }" @click="toggleLayerManager">清单</span>
          </li>
          <li>
            <el-badge :hidden="routes.length == 0" :value="routes.length" class="routelist">
              <i class="el-icon-s-flag" :class="{ 'selected-graphic': routeManagerVisible }" title="航线列表" @click="toggleRouteManager" />
              <span :class="{ 'selected-graphic': routeManagerVisible }" @click="toggleRouteManager">航表</span>
            </el-badge>
          </li>
        </ul>
      </el-main>
    </el-container>

    <div v-show="editMode" class="graphic-edit">
      <div v-show="menuSelected['MARKER']" class="marker-edit-class edit-class">
        <el-color-picker id="markerColor" v-model="markerColor" show-alpha size="small" title="文字颜色" />
        <el-select v-model="fontSize" size="small" allow-create filterable title="字号" default-first-option placeholder="请选择">
          <el-option v-for="item in fontSizeList" :key="item" :label="item" :value="item" />
        </el-select>
      </div>
      <div v-show="menuSelected['POLYLINE']" class="polyline-edit-class edit-class">
        <el-color-picker id="lineColor" v-model="lineColor" title="颜色" show-alpha size="small" />
        <el-select v-model="lineWidth" size="small" title="线宽" class="width-selector" allow-create filterable default-first-option placeholder="请选择">
          <el-option v-for="item in lineWidthList" :key="item" :label="item" :value="item" />
        </el-select>
        <el-select v-model="lineStyle" size="small" class="style-selector" title="直线样式" default-first-option placeholder="请选择">
          <el-option v-for="item in lineStyleList" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
        <el-select v-model="graphicHeight" size="small" title="直线类型" class="type-selector" default-first-option placeholder="请选择">
          <el-option v-for="item in heightList" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
      </div>
      <div v-show="menuSelected['POLYGON']" class="polygon-edit-class edit-class">
        <el-color-picker id="polygonColor" v-model="polygonColor" title="填充色" show-alpha size="small" />
        <el-select v-model="graphicHeight" size="small" title="多边形类型" class="type-selector" default-first-option placeholder="请选择">
          <el-option v-for="item in heightList" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
        <i class="cesiumDrawFont iconoutline border-btn" :class="{ 'outline-selected': outline }" title="边框" @click="outline = !outline" />
        <div v-show="outline">
          <el-color-picker id="outlineColor" v-model="outlineColor" title="边框充色" show-alpha size="small" />
        </div>

        <el-select v-show="outline" v-model="outlineWidth" size="small" title="边框宽度" class="width-selector" allow-create filterable default-first-option placeholder="请选择">
          <el-option v-for="item in lineWidthList" :key="item" :label="item" :value="item" />
        </el-select>
      </div>
      <div v-show="menuSelected['LABEL']" class="label-edit-class edit-class">
        <el-select v-model="fontFamily" class="font-selector" allow-create filterable size="small" title="字体" default-first-option placeholder="请选择">
          <el-option v-for="item in fontList" :key="item" :label="item" :value="item" />
        </el-select>
        <el-select v-model="fontSize" size="small" class="size-selector" allow-create filterable title="字号" default-first-option placeholder="请选择">
          <el-option v-for="item in fontSizeList" :key="item" :label="item" :value="item" />
        </el-select>
        <el-color-picker id="labelColor" v-model="markerColor" title="颜色" show-alpha size="small" />
      </div>
      <div v-show="menuSelected['MODEL']" class="model-edit-class edit-class">
        <el-popover id="model-select" v-model="modelSelectPanelvisible" placement="bottom" width="160">
          <div class="model-select-panel">
            <img v-for="item in extendMarkerModel" :key="item.id" :title="item.name" :src="modelThumb(item)" :onerror="defaultImage" @click="selectModel(item)">
          </div>
          <template #reference>
            <i class="cesiumDrawFont iconmodel model-selector-trigger" title="选择模型" />
          </template>
        </el-popover>
        <el-select v-model="modelMode" size="small" title="模式" default-first-option placeholder="请选择">
          <el-option v-for="item in modelModeList" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
        <el-color-picker id="modelColor" v-model="modelColor" title="颜色" show-alpha size="small" />
        <el-slider v-show="modelMode === 'Mix'" v-model="modelMixed" title="混合度" :min="0" :max="1" :step="0.1" :show-tooltip="true" />
      </div>
      <div v-show="menuSelected['TILESET']" class="model-edit-class edit-class">
        <el-popover id="model-select" v-model="tilesetSelectPanelvisible" placement="bottom" width="160">
          <div class="model-select-panel">
            <div v-for="item in extendTileseImageryList" :key="item.mid">
              <img class="panel-item" :title="item.name" :src="modelThumb(item)" :onerror="defaultImage">
              <div class="panel-btn">
                <i class="cesiumDrawFont iconfont icon-image" title="选择隐藏" @click="toHide(item)" />
                <i class="cesiumDrawFont iconfont icon-image" title="选择显示" @click="toShow(item)" />
                <i class="cesiumDrawFont iconfont icon-image" title="选择聚焦" @click="toFocus(item)" />
                <i class="cesiumDrawFont iconfont icon-image" title="选择删除" @click="toDelect(item)" />
              </div>
            </div>
          </div>
          <template #reference>
            <i class="cesiumDrawFont iconmodel model-selector-trigger" title="选择模型" />
          </template>
        </el-popover>
        <!-- <i class="cesiumDrawFont iconmodel model-selector-trigger" title="选择模型" /> -->
        <!-- <i class="cesiumDrawFont iconfont icon-image" title="选择模型" /> -->
        <i class="cesiumDrawFont iconfont icon-tianjiayingxiang" title="TWM影像" @click="addTilesetOrImagery" />
        <el-select v-model="modelMode" size="small" title="链接" default-first-option placeholder="请选择">
          <el-option v-for="item in modelModeList" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
        <el-select v-model="modelMode" size="small" title="模式" default-first-option placeholder="请选择">
          <el-option v-for="item in modelModeList" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
      </div>
    </div>
    <MarkerViewer
      ref="markerManager"
      :attachment="attachment"
      :extend-image="extendMarkerImage"
      @deleteEvent="deleteMarker"
      @editEvent="editMarker"
      @addEvent="addMarker"
      @updateEvent="updateMarker"
    />
    <layerManager
      v-show="layerManagerVisible"
      ref="layerManager"
      :tools="tools"
      class="layer-manager-class"
      :class="{ 'edit-layer-manager-class': editMode }"
      @changeUnifiedHeight="changeUnifiedHeightEvent"
      @locate="locateGraphic"
      @edit="editGraphic"
      @delete="deleteGraphic"
      @rename="renameGraphic"
      @select="selectGraphic"
      @clear="clearGraphic"
      @close="closeLayerManager"
      @import="importGraphic"
      @export="exportGraphic"
      @drowroute="drowrouteGraphic"
      @moniFly="moniflyGraphic"
    />
    <input v-show="false" id="graphicuploadhandler" type="file" accept=".geojson, .shp" @change="importfp">
    <el-dialog title="影像点云" :visible.sync="dialogTilesetVisible" width="650px">
      <el-form ref="tilesetForm" :model="tilesetForm" :rules="tilesetRules">
        <el-row :gutter="0">
          <el-col :span="7">
            <el-form-item :label="'影像名称'" :label-width="'80px'" prop="name">
              <el-input v-model="tilesetForm.name" autocomplete="off" />
            </el-form-item></el-col>
          <el-col :span="17">
            <el-form-item :label="'类型'" :label-width="'80px'" prop="defaultImage">
              <img class="image-item" :src="filteredDefaultImages">
              <img v-for="(item,index) in defaultImages" :key="index" class="image-item" :src="item.image" :alt="item.type" @click="selectImage(item.type)">
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="'影像链接'" :label-width="'80px'" prop="url">
          <!-- <el-input v-model="tilesetForm.url" placeholder="请输入内容" class="input-with-select"  list="typelist">
            <el-select slot="prepend" v-model="tilesetForm.mtype" placeholder="请选择" style="width: 100px;">
              <el-option v-for="(value, key) in typeList" :key="key" :label="value" :value="key" />
            </el-select>
          </el-input> -->
          <el-row :gutter="0">
            <el-col :span="6">
              <el-select v-model="tilesetForm.mtype" placeholder="请选择" style="width: 100px;">
                <el-option v-for="(value, key) in typeList" :key="key" :label="value" :value="key" />
              </el-select>
            </el-col>
            <el-col :span="18">
              <el-select
                v-model="tilesetForm.url"
                filterable
                clearable
                allow-create
                default-first-option
                placeholder="请输入内容"
              >
                <el-option
                  v-for="item in urioptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <span style="float: left">{{ `${item.label}:` }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                </el-option>
              </el-select>
            </el-col>
          </el-row>

        </el-form-item>
        <el-row :gutter="2">
          <el-col :span="8">
            <el-form-item label="经度" :label-width="'80px'" prop="longitude">
              <el-input v-model="tilesetForm.longitude" autocomplete="off" />
            </el-form-item></el-col>
          <el-col :span="8">
            <el-form-item label="纬度" :label-width="'80px'" prop="latitude">
              <el-input v-model="tilesetForm.latitude" autocomplete="off" />
            </el-form-item></el-col>
          <el-col :span="8">
            <el-form-item label="高度" :label-width="'80px'" prop="height">
              <el-input v-model="tilesetForm.height" autocomplete="off" />
            </el-form-item></el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTilesetVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd('tilesetForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import GraphicManager from '../core/GraphicManager';
import MarkerViewer from './markerViewer.vue';
import { CesiumPolygon } from '../core/Graphic';
import layerManager from './layerManager';
import GraphicType from '../core/GraphicType';
import ImageryManager, { urlmType } from '../core/ImageryManager'
import { open } from 'shapefile';
import $ from 'jquery';
import { checkComponent, checkViewer, getPolygonArea } from '../core/utils';
import { mapGetters } from 'vuex';
/**航线列表管理 */
let graphicManager;
// eslint-disable-next-line
let imageryManager;
const console = window.console;
export default {
    name: 'CesiumDraw',
    data() {
        const validateLongitude = (rule, value, callback) => {
            //经度,整数部分为0-180小数部分为0到15位
            var longreg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,15})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,15}|180)$/
            if (!longreg.test(value)) {
                callback(new Error('经度整数部分为0-180,小数部分为0到15位!'))
            }
            callback()
        }
        const validateLatitude = (rule, value, callback) => {
            //纬度,整数部分为0-90小数部分为0到15位
            var latreg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,15}|90\.0{0,15}|[0-8]?\d{1}|90)$/
            if (!latreg.test(value)) {
                callback(new Error('纬度整数部分为0-90,小数部分为0到15位!'))
            }
            callback()
        }
        return {
            dialogTilesetVisible: false,
            typeList: urlmType,
            tilesetForm: {
                mtype: 'TMS',
                height: 1200,
                name: '',
                longitude: 112.27139701848677,
                latitude: 31.026628725595643,
                url: '',
                type: 'defaultImage'
            },
            tilesetRules: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
                ],
                mtype: [
                    { required: true, message: '请输入类型', trigger: 'blur' }
                ],
                url: [
                    { required: true, message: '请输入url', trigger: 'blur' }
                ],
                longitude: [
                    { validator: validateLongitude, trigger: 'blur' },
                    { validator: validateLongitude, trigger: 'change' }
                ],
                latitude: [
                    { validator: validateLatitude, trigger: 'blur' },
                    { validator: validateLatitude, trigger: 'change' }
                ],
                height: [
                    { required: true, message: '请输入高度', trigger: 'blur' }
                ]

            },
            /**航线列表*/
            routes: [],
            editMode: false,
            graphicType: undefined,
            menuSelected: {},
            layerManagerVisible: false,
            routeManagerVisible: false,
            markerColor: 'rgba(255, 255,255, 1)',
            fontSize: '28px',
            markerFont: 'sans-serif',
            markerOptionsVisible: false,
            markerOption: '',
            lineColor: 'rgba(247,224,32,1)',
            lineWidth: '3px',
            lineWidthList: [
                '1px',
                '2px',
                '3px',
                '4px',
                '5px',
                '6px',
                '8px',
                '10px',
                '12px'
            ],
            lineStyleList: [
                { value: 'solid', name: '实线' },
                { value: 'dash', name: '虚线' },
                { value: 'glow', name: '发光线' },
                { value: 'arrow', name: '箭头线' }
            ],
            lineStyle: 'solid',
            graphicHeight: 'GROUND_ADN_MODEL',
            //   lineHeight: "GROUND_ADN_MODEL",
            //   polygonHeight: "GROUND_ADN_MODEL",
            heightList: [
                { value: 'GROUND_ADN_MODEL', name: '依附地形和模型' },
                { value: 'GROUND', name: '依附地形' },
                { value: 'MODEL', name: '依附模型' },
                { value: 'NONE', name: '空间线' }
            ],
            outlineWidth: '3px',
            outlineColor: 'rgba(247,224,32,1)',
            polygonColor: 'rgba(247,224,32,0.5)',
            outline: true,
            fontSizeList: [
                '10px',
                '12px',
                '14px',
                '16px',
                '18px',
                '20px',
                '24px',
                '32px',
                '64px'
            ],
            fontList: ['sans-serif', '宋体'],
            fontFamily: 'sans-serif',
            modelMode: 'Highlight',
            modelModeList: [
                { value: 'Highlight', name: '高亮' },
                { value: 'Replace', name: '替换' },
                { value: 'Mix', name: '混合' }
            ],
            tilesetList: [
                { value: 'WtMs', name: '高亮' },
                { value: 'WtM', name: '替换' },
                { value: '3D-TILESET', name: '混合' }
            ],
            modelColor: '#FFFFFF',
            modelMixed: 0.5,
            modelSelectPanelvisible: false,
            selectedModel: undefined,
            tilesetSelectPanelvisible: false,
            extendTileseImageryList: []
        };
    },
    computed: {
        defaultImage() {
            return 'this.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB1UlEQVQ4T6XTMWgUQRQG4P/N3gaRSBpBEAMqrldkYyXu5VCMChZBEDxOsDIgKKSyECxTWERIYe2hRdoLeKV2RhCymwhy3E48b087C7EQtRDj7vyyg3dKDGyI087MN/97MyP4zyFF+5vNpnPEP3neZGlNlFwBoU/53rnBvn+AsPP+AFRWgUFNKVwgcVCAp4C0lJu10lTNiTGdYLLcyhF52e3uG8lUDVRnDXhagEP5YkM2pia9la0Jw413nhhzKfC9BxaI4t4aII3A9x6FcXJbBGNFZQ3jG3Yk0snjYMK7EelkHsBGMOEt7xSI4oQSxr3lin+8ngPG4MV2sQdgGPdvCviQkFsV/1jDAmu6f6c0wqWfm5grAiKd1EE0IbiaJ7VApN+egcF+KHWiCNhamgVekW4a9xdE4dsAeK716F7jLkJUNXOzmWq5/GG7vlggn4ji5BkEqzngQDYpXARQtdcErKRje2aq4+PfbaOJKcC5G/hH20NgPU7uU/AjJT47wD0Ao3+fSMgTBXwlOPvnBcoSweu/E/SuUdRFQ7YdwD6QopEnIzBtgfV2t8ySM5sSH3cF2D7oZD4jvpSAy0Wn5/MEPgGoDz/T6us3hx231KVgYSeAbTAx/Qs/Rdq4fXky6QAAAABJRU5ErkJggg=="';
        },
        defaultImages() {
            return [
                { show: '', type: 'defaultImage', image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB1UlEQVQ4T6XTMWgUQRQG4P/N3gaRSBpBEAMqrldkYyXu5VCMChZBEDxOsDIgKKSyECxTWERIYe2hRdoLeKV2RhCymwhy3E48b087C7EQtRDj7vyyg3dKDGyI087MN/97MyP4zyFF+5vNpnPEP3neZGlNlFwBoU/53rnBvn+AsPP+AFRWgUFNKVwgcVCAp4C0lJu10lTNiTGdYLLcyhF52e3uG8lUDVRnDXhagEP5YkM2pia9la0Jw413nhhzKfC9BxaI4t4aII3A9x6FcXJbBGNFZQ3jG3Yk0snjYMK7EelkHsBGMOEt7xSI4oQSxr3lin+8ngPG4MV2sQdgGPdvCviQkFsV/1jDAmu6f6c0wqWfm5grAiKd1EE0IbiaJ7VApN+egcF+KHWiCNhamgVekW4a9xdE4dsAeK716F7jLkJUNXOzmWq5/GG7vlggn4ji5BkEqzngQDYpXARQtdcErKRje2aq4+PfbaOJKcC5G/hH20NgPU7uU/AjJT47wD0Ao3+fSMgTBXwlOPvnBcoSweu/E/SuUdRFQ7YdwD6QopEnIzBtgfV2t8ySM5sSH3cF2D7oZD4jvpSAy0Wn5/MEPgGoDz/T6us3hx231KVgYSeAbTAx/Qs/Rdq4fXky6QAAAABJRU5ErkJggg==' },
                { show: 'Tileset', type: 'cloudImage', image: 'data:image/png;base64,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' },
                { show: 'TERRAIN', type: 'terrainProvider', image: 'data:image/jpeg;base64,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' },
                { show: 'TMS', type: 'customImageProvider', image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAMFAvYDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAECA//EACgQAQABAgMIAwEBAQAAAAAAAAABEfAhMUECUWFxgZHR4aGxwRLxYv/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABURAQEAAAAAAAAAAAAAAAAAAAAR/9oADAMBAAIRAxEAPwDoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADMzTBmNqTaz+kv5gHSJifCuLUbU1jEHQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGdrTqw1Od3myCFKjezv6A2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlVcQdaq4rWd89wbnapliz/AFLIDcbVcJbcVqCznMsrUkGXTYy6sOsTExh2BQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABidrSF2Zr0BoAGdrJzdnKYoCAAAAAALJCANbGfRkB2GI2t7YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADG1OnVtjajXhSQYWJpKAOwxEzGe+mq/1F8QaZ2suWK1jfBMxTOMpByDt3gvIAN3Facfj2CBv4ALCLCAAARFZo7OUTRuJrzBoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGJinL6Z9/Tq5zFOV4Alfu45nP/AJS9xgBrThS+pHG7kiK14FMK8QNJm8w6V/0v5A3dZX8peRSL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' },
                { show: 'TERRAIN', type: 'imageryProvider', image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDACAWGBwYFCAcGhwkIiAmMFA0MCwsMGJGSjpQdGZ6eHJmcG6AkLicgIiuim5woNqirr7EztDOfJri8uDI8LjKzsb/2wBDASIkJDAqMF40NF7GhHCExsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsb/wAARCABQAFADASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAQIDBAAF/8QALhAAAQMDAgQEBQUAAAAAAAAAAQACEQMhMRJBBBMiUQVxgZEUMkJhoSNSYvDx/8QAFwEBAQEBAAAAAAAAAAAAAAAAAAECA//EABoRAQEBAQEBAQAAAAAAAAAAAAABEQISITH/2gAMAwEAAhEDEQA/APPiyIwmIsLJxTsJWWU0JVhTDhY+6V1OEVM4QTRcIAbWRHSuFyuhMLBUCOy6EZtC642UGrQP2ollphaAwcuzpt83dFzW6bYjByo2yFsYXOHThWMBISHEkYBFkEG0NTpdb0Tu4cNAd2KuwtLSNJKcTGCmmMRp6nT+QlZTLj/FbwxoOMommITTyw1aWhs91OIF1qqAOMbNWeoQXABVmxt4Zw5Q8zKqCDLV02R02Hkpb91vEIcRDmzfZVpBsXseyjWF911KsHtgu6uxRGnUwbBK+w6YKm9wwSoueYMbIq7KocDYghRq1L2KzOqHVYoBxOUxn0ciLypu+XKYO2lc7ErrzNjNbjz2UwajAYOBlSHHU8aXesKnFeIU2McyjLnn69gvKBupzzv61bn49bmtFOQZJ91leWulRpPkQdlR/SJWbzlN02t2k9R/vmouLtZM3xP2Q5iIlzStXiyazrgLGyVU0yySdsKdR4p3iZUk0HALnYSVKwI6f8U+cXm4Ui77LpMiLF2o9kEGN1BpFSkJ7ux5rnGACXUzMYcr6i4pTdAVahLqfksoqFonoP21JX1iDgXGxUthlWCqwn0hY/iL/L+UzeKLcNv5q+oZW3LR29ln4kXCQcaQ4nR6SlqcVzI6B7rPwyvdNDiGOpupBrqbtI0Bo6cXXkeIUW03h7frc63aHQhR8QNNpa9jn9v1XCFLiOKFYMa2mGNYDAknKzqv/9k=' }
            ]
        },
        filteredDefaultImages() {
            return this.defaultImages.filter(item => item.type === this.tilesetForm.type)[0].image;
        },
        ...mapGetters([
            'defaultUavHeartbeat'
        ])
    },
    components: {
        MarkerViewer,
        layerManager
    },
    props: {
        attachment: undefined,
        tilesetsrc: {
            required: true,
            type: String
        },
        urioptions: {
            type: Array,
            default: () => {
                return [];
            }
        },
        extendMarkerImage: {
            type: Array,
            default: function() {
                return [
                    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA6hJREFUWEe1V02M1VQU/k5neosEfxb489rZEMlM+yKY6JhJ2IjB6M4YiCaKMbIAHCMLcFhgNGI0uhDRqBEcTcQQJdEQF65EjbIhJgpjBNsOwQgJvc/BjYrRebeTHtPnDM683t72DXq35zvf+e756y2hh3M9D62wUmsdgI3EcEFodNwZLSZIAO9ndvbFFE3+VJeW6gAbyr/VgrWFwVvq4Ak0niEbb4n4eBW+UkCj7e8ioheqiHR2Zn6y5cQvmnyNAty2vxtEzywm+CUf5melE+8u4ygV4LWb9zHxh5cVfNaZmO5PnPAjHZdWQF5zAn37XwSf42DwsK4ntAI81XzL1HAMnATwOTF/0xkCotsA3EnAqvJU03giwq3d9oIAb9ofZIsmS2/POJL+Rht+uS78Yz7m2gvNZfbVfBiEu0pFZDyULIlPz7frBDzBFu3Rk9AbUoTbTKVxVfN1gB/X1jvjsWRJ/LJRQEMFXxKwVkNwYqmdrjlDZ9omASt5pfNnah8DcEs3joGvWiK6wyjAbQeTIAxqnPe3RDRapzEbKthHwKMFLOO0dKIhswAV/A7gymKz8KZExAfqCPCU/wiD3tVgL0oRXVWVgfMgeEX1/KB04kN1BLht/wEQfVDAEqS0owXcxSZMg8PMWK8pwSstEe2oI6Chgr0EbC8KoE+kHd5jnoJ28BQTntMIODnzK63pHr9uXD6O/dfwMd1OYMbzLSd62lyCmeBeZPhYe1PGEelEdxvHsB18WroLmDdKJ15QmuIm5LX9Xjo1wcBNZbtgqa3Gusfxn/ETe8p2AIBzM3bfyAU6NWXMQG50p5tjsPglw01PMOFHC0hyTAZ4xLhRN/uXOIh2SjssLDjtt8DlweWY6Z8A80CdpquB+V7Yf42cpbPTxfEu8fZUMMrAmzXIKyEEPJyI6KAOaH6QqGAcwObKCAYAAa8mIiqO5KyPUcAAD1zB6bKjjM7ntudDwNFERLrvyr+tUcV6Q+rf3sf0GQN2FbbLfjGDte5n8UPnzVB2Kh+luWNjOthOFvb2IoCAxxIR7avyqSWgI0IF7+XNVEU4a39biqjmE74mIxjkpsF3AFZXuByXIhquS1s7AznhgGqOZOCvDeQZQMNShBP/i4Cc1FX+NoBe0880jSYi3F83eI7rKQNzxJ4KDjLw0MJAdECKcFMvwRctoJOJ+U83plg6YdBr8MsS4KnBmxl9eVPCYl593onzf4Wez6JKMBelofzNAHFLRO/0HHnW4W+ebkAwOMrwKQAAAABJRU5ErkJggg==',
                    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA6dJREFUWEe9V1+IFVUc/n5zd84kVE/1oLszF/uzM4NlUCsLvlQY9RaRFJQh+aC1kQ/W9lAUGkU9ZBYVaVuQERYo0kNPWWG+RFCatNTcuyp2Z9QI3zTROcOdn8zdNXbvnDlz7hqd1/N93+875/dnzhAGWK3mNcsJ3TWcYx1Ay0BY2qMz/gL4DFnYw2h8H3QunTSVJRNg5Nl3WbA2MXiTCZ5AUznyqTDODtfhaw1EnniRgDfqhFT7DLwUxvJNHVdrIPLENgK2Lib4FQ4Dr4ax3FalUWmg5YlHAOy9muDzuI8Gsdyn0lIaKHJOoF/+o+BzdcpjqppQGmh7zkc1BTfNxN81cvq5UO9avIqY7gNwe/VV05Qfp0/175cMRMPOKDW4rTn9ge5FuXbFWfwzH/P7jbi2sUTsB3B/FZe75Ien05n5+2UDrvM8EW9X5ov5Az/JNutS03bt95noWWVXME2GSfq21kDLtQ+C6B6FwJGGkKtvPY5UZ+DYLXC6UvwI4M4SjvmHIMnurTEg2iCMloPQriBOJ0wKs+U5OwF+umwAM0Eifb0BT5wDcF0/mZk3hEm228RA5NpPEtGnCuz5IJbX1xk4BWC4n2wxHh9N5JcmBmZc8VhO+EKBPRPEcoF2qQjbrtjPhIdLN0D8TtjJnjMxEDXtHcS0RYH9Oojlg/obaIqXwXhNQZ7uXpSr+9uvHzfXjkURlmcC4/Ugka9oDbRd8RATvqo46YEglg/obqHliW+qZgET1oUduSA1pRQcBIaWeuJXALdVzQLLySb727Fovzy1t1fNAAAd0bDHbzp54W/tDRSbUdOZJOa3NCc9AuAEwKdnMVQU1s3K3p8TYaIXwk5aGnDqb8Ey3MBDvVsYMSm6WgzhN4fk+PI/cakfW/05du0JEH1YK24AIPB6P84+V6ZUx488Z4rAGw1iaCD8bhBnqpacTZ5OPBnBkguWOARg1aJMEB0KOqnqu/KvXO2b8NjI0N1dy/oWgD2gifPEvMZPst6boWrVGiiIf7jOFot4x0AGmJ8JkmxnHcfIQK81PfEZAevrBGfzSh/7cWr4hDdR7P17gNpNcRSMlToKA4fDWI4ZyuqLsF9kZsQezy36SSOed4nHVnSyYoYYLeMUXFGLPGczgd9TqjNPBEm2yyjyHGhgAwWv5YliqDwxPxABu/1YbhgkeO0c0Im13AVPt1YQy3DQ4FdloD1s38ENOlqIcI6V4Sk5/b8amG1Ne6NFYL+TfbKY4AXnMk2+OjDIBjLDAAAAAElFTkSuQmCC',
                    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA3VJREFUWEe9lk1oXGUUhp930lIj0ZUbWxFEaBG0gqYEu/DOEFHciCgKWom9d0w1aoVqXCiKEUUXapX60zY6N6miQqW4cCFWw3w3iyJofzAbWxARtOLWBlvBzJE7JJrMfPdnUnG25z3vee73nXPmEz38bnzfrqj8xTCwzYz1Epem6Wb8KnEa+LC1hpnZEf1Y1lZlhLVpu77VYodgRxm9wWSlwmRzu44W6QsBgtieErxUZOSLGzydRHo5LzcXoNqwCcRzqyn+T47xvKtrIssjEyCYsrtkHDyv4ovJJu5OQn3i8/ICpHduLb79L4oveajCoK8nvABBbPsLGm5O8FULvkkLVGCLwU3ANVnQaWMmkR7sjHcBDB+wjQsLnMw0Eof1B3e6RzS/XFN92wbsQg7JuDkrt6+PTTP369TyeBdAtWFPIF7NMHnLRdqZdzXV2N4EHvVqjHFX12v5ALE1garnqI5dMM/Wzx/Tn3kAt+6xdecGOGJwnUfnXKRaLkDQsJMSG7uSjX2urrEyjVlt2F7EQ51aM04ldW0qOoHfgYs8AKGra7okwHbElEd7xkW6uAjgZ2BDFz3cm0T6uAxAENs9go8813i6GWmFd1cTBrEdEtzhSX69GenxMgC12HYb7OrSis9cqNuKTuAZ4AVPoTnOsrVz/Dp16TjSz5GMnfCii/RsPsCU3Y7xqe9LTRxOQt2SdwrBlH2RtQtaYttsqBVX070HJmwNl3McuDprF/TPM945jun4nR1o7w//DoCf+hYYmhnVb7knkAarsY0Dr2R9qeCYwQ+IX9oaY4PgyozZX7J50kXqWnDe/4LqfruEte1TuKxM0xVpzPhOFYZcqHOe5vanB7GNCd4pMi8TNzGShPrAp819kNQaNmlitEyRTI3xhqureyQXE3IBbjho/evmSYAtq4RIXKSu/5XCJlwuqMUWGHwJrO0R4oyJ4SRU+82Q09DFtkFsuwS7i5X/KgweTiLtLcopfBUvGQSxHRCMFBmmcYl3m6FKPeFLA2Cm2jQnzNhcAHHURRosA9qGLStMdbXYhgy+zrnP1kKLwdkHlO6QUr+eAFLHoGE7JfZ43cWYC7WvVOUyY5hlVI0tXSr3rYiLaRcq7KV4z1ew3Lzj6fa9i3RVr8XPC6DWsGtNnEhNWmLzbKi5/xVgsR9GJcxFem81xdOcvwFHKCIwOWHgXAAAAABJRU5ErkJggg==',
                    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA7VJREFUWEe9lk1sVFUUx//n0op07kMWnfvwY9Oobd8bxQRKGtmIwejOGI0miiGyAK2RBVoWGgkYjS5ENGoEq4kYoiYa4sKVqFE2hERBQpk7LWrURGvfGxa0b2aKYO4xb2iTYd7nFOPb3v8553fP17uEDr65cwN9Fy+KDYKxkUHXEXBtaM7AXwSeMoSPurvNN8tWTP6a1y3lEdarg2uMEVuJsDWPnhljQpixQnHieJY+E6Dmu88CeDnLUcL5c1LpV9JsUwECz91NhF2LDN40Y8YLlq13J/lIBAh890ECPr2S4Au2DDxkKf1ZnK9YgLDmzOKH/yL4gg8iMxTXE7EAgee+m9Fw42D+GkJ83wxgzFoQ3QXg1iTosDEtWz/efh4BOF8d7P+HxWTy7flwA/SAUrrWqvF9V/aADwF0d5JtF5mBq4sTZ1rPIwA1z30GhD0J9Xq7oPS2tNLUffctBp6K1TBGpa1fSwfwnW8BWh+TqhM9MxfW0c0//50GwD/dtLRxzVVHGVgd1fF3UlXuTAUIfHeSgP52Y2bst2w9kqcxA8/dR4QnIj6AM5bSAxkZcGcBWO3GBti8XOkDeQBmffcxAXwQow2k0suzSvAHQNdHjIkekcXyJ3kAatXSw2D+OFJGwlShqC/zHWnCuu8cYtD9kUDMr0u78nQuAM/ZC6LtMQBfFIr63tQM1H3neQa9GBNovAGsax+/dt2lccTRuJ3AoJcsVd6ZDnDWuY8NfR5/Uz4sVeWetCzUfOfLxF1gaKNcWb6sNJESMK/vqlf9HwHckrQLemYujLaP4/z47UncAYTfYcSwtE97qRkID2ueOwrCq0k3JeAEgF+Y6M9QQ8xhY90YP/vzXhg7pK0jCy72XzA71d8rurrCLNyQp+kyNcynqo254b6+387HLLh48/pZZ4QNvZPpPI9A8CbZWzmYUNJkD4HnjBHRljwxkjX0hlTlyEgu6FNfRMy3L6tXZ44AWLtIiCNS6ch/JbMJWwVz1cE7DMRXzOjuBIKBQAjaUOgtX3ozJHyZj9LmVEyXtkPw3o4AmJ+07Mq+LJtcAE0Iv/QhwJuyHIbnzPyeZVdyPeFzAzCD6lXnJECrMiCOS6WH8oA2d0heYahrTLvDRuBYio0hYKigdLhDcn0dAYQeA9/dRsCbsTNNGCkU9f5ckedFHQM0+8FzD4LwaFugA1LpzZ0E77gErc5bn24MTFhKO50GvyKAmle6DcQnm0GNWSVXToz/rwBhsNnp0pYlSwwXipX3FxM8tPkXxtpGMCqUd78AAAAASUVORK5CYII='
                ];
            }
        },
        extendMarkerModel: {
            type: Array,
            default: function() {
                return [1, 2];
            }
        },
        extendMarkerModel2: {
            type: Array,
            default: function() {
                return [1, 2];
            }
        },
        tools: {
            default: undefined
        },
        viewer: {},
        CursorTipDistance: {
            type: Object,
            default: function() {
                return {
                    distanceX: 0,
                    distanceY: 0
                };
            }
        }
    },
    watch: {
        fontSize(n) {
            n = parseInt(n);
            if (isNaN(n)) {
                n = '18';
            }
            n = n + 'px';
            // console.log(this.$refs.markerManager.getFont())
            const fontFamily = this.menuSelected['MARKER']
                ? this.markerFont
                : this.fontFamily;

            this.$refs.markerManager.setFont(n + ' ' + fontFamily);
        },
        markerColor(n) {
            if (!n) {
                return;
            }
            this.$refs.markerManager.setColor(
                Cesium.Color.fromCssColorString(n)
            );
            this.syncColor('markerColor', n);
        },
        graphicHeight(n) {
            if (n === undefined) {
                return;
            }
            // if (/.*MODEL*/.test(n)) {
            //   //依附模型
            //   cesiumViewer.scene.globe.depthTestAgainstTerrain = true;
            // } else {
            //   cesiumViewer.scene.globe.depthTestAgainstTerrain = this._depthTestAgainstTerrain;
            // }
            graphicManager.heightReference = n;
        },
        lineColor(n) {
            if (!n) {
                return;
            }
            const color = Cesium.Color.fromCssColorString(n);
            const matrial = graphicManager.editManager.material;
            let materialStyle = 'solid';
            if (matrial instanceof Cesium.PolylineDashMaterialProperty) {
                materialStyle = 'dash';
            } else if (matrial instanceof Cesium.PolylineGlowMaterialProperty) {
                materialStyle = 'glow';
            } else if (
                matrial instanceof Cesium.PolylineArrowMaterialProperty
            ) {
                materialStyle = 'arrow';
            }
            //   matrial.color = Cesium.clone(color);
            this.setLineMaterial(materialStyle, color);
            this.syncColor('lineColor', n);
        },
        lineStyle(n) {
            if (!this.lineColor) {
                return;
            }
            const color = Cesium.Color.fromCssColorString(this.lineColor);
            this.setLineMaterial(n, color);
        },
        lineWidth(n) {
            let width = parseInt(n);
            if (isNaN(width)) {
                width = 3;
            }
            graphicManager.style = { width: width };
        },
        outline(n) {
            if (n) {
                graphicManager.editManager.createOutline();
                const color = Cesium.Color.fromCssColorString(
                    this.outlineColor
                );
                const width = parseInt(this.outlineWidth) || 3;
                graphicManager.editManager.outline = n;
                graphicManager.style = {
                    outline: true,
                    outlineWidth: width,
                    outlineColor: color
                };
            } else {
                graphicManager.editManager.removeOutline();
            }
        },
        polygonColor(n) {
            if (!n) {
                return;
            }
            const color = Cesium.Color.fromCssColorString(n);
            graphicManager.material = color;
            this.syncColor('polygonColor', n);
        },
        outlineColor(n) {
            if (!n) {
                return;
            }
            const color = Cesium.Color.fromCssColorString(n);
            graphicManager.style = { outlineColor: color };
            this.syncColor('outlineColor', n);
        },
        outlineWidth(n) {
            const width = parseInt(n) || 3;
            graphicManager.style = { outlineWidth: width };
        },
        fontFamily(n) {
            let size = parseInt(this.fontSize);
            if (isNaN(size)) {
                size = '18';
            }
            size = size + 'px';
            // console.log(this.$refs.markerManager.getFont())

            this.$refs.markerManager.setFont(size + ' ' + n);
        },
        modelColor(n) {
            if (!n) {
                return;
            }
            const color = Cesium.Color.fromCssColorString(n);
            this.$refs.markerManager.setModel({ color: color });
            this.syncColor('modelColor', n);
        },
        modelMode(n) {
            const mode = Cesium.ColorBlendMode[n.toUpperCase()];
            this.$refs.markerManager.setModel({ mode: mode });
        },
        modelMixed(n) {
            this.$refs.markerManager.setModel({ mixed: n });
        },
        CursorTipDistance(n) {
            this.$refs.markerManager.setCursorTipDistance(n);
        },
        tilesetForm: {
            handler(oldValue, newValue) {
                // if()

            },
            deep: true

        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        // console.log("parent", this.$attrs, this.$listeners);
    },
    mounted() {
        window.jq = $;
        // const self = this;
        // this.$nextTick(() => {
        //     moveDiv('drawtoolPanel', 'drawtoolHead');
        //     $('#drawtoolPanel .el-color-picker__icon').addClass(
        //         'cesiumDrawFont iconcolor'
        //     );
        // });
        if (this.viewer instanceof Cesium.Viewer) {
            this.init(this.viewer);
        } else if (window.viewer instanceof Cesium.Viewer) {
            this.init(window.viewer);
        }
        // this.$nextTick(() => {
        //     self.syncColor('markerColor', self.markerColor);
        //     self.syncColor('lineColor', self.lineColor);
        //     self.syncColor('polygonColor', self.polygonColor);
        //     self.syncColor('outlineColor', self.outlineColor);
        //     self.syncColor('modelColor', self.modelColor);
        // });
    },
    beforeDestroy() {
        this.destroyEventListener()
    }, //生命周期 - 销毁之前
    methods: {
        /**
         * 初始：
         */
        init(viewer) {
            checkViewer(viewer);
            if (this._viewer) {
                return;
            }
            this._depthTestAgainstTerrain =
                viewer.scene.globe.depthTestAgainstTerrain;
            this.$refs.markerManager.init(viewer); //传递子组件
            graphicManager = new GraphicManager(viewer);
            imageryManager = new ImageryManager(viewer);
            this.selectedModel = this.extendMarkerModel.length
                ? this.extendMarkerModel[0].url
                : undefined;
            this.cesiumViewer = viewer;
            this._viewer = viewer;
            document.addEventListener('addmarkerEvent', this.addmarkerEvent);
            document.addEventListener('getpositionsEvent', this.getpositionsEvent);
            document.addEventListener('addmarker', this.addmarker);
            document.addEventListener('addEvent', this.addEvent);
            /**
             * 停止编辑
             */
            document.addEventListener('stopEdit', this.stopEdit);
            /**
             * 多边形绘制结束-
             */
            document.addEventListener('positionsMsg', this.positionsMsg);
            /**
             * 开始编辑
             */
            document.addEventListener('startEdit', this.startEdit);
            document.addEventListener('destroyEvent', this.destroyEvent);
            document.addEventListener('deleteEvent', this.deleteEvent);
            // 影像
            document.addEventListener('addImageryEvent', this.imageryEvent);
        },
        imageryEvent(e) {
            if (imageryManager.has(e.detail.mid)) {
                console.log('存在');
                const { mid, type, name } = e.detail;
                this.extendTileseImageryList.push({ mid, type, name })
            }
        },
        addmarkerEvent(e) {
            const self = this;
            console.log('存在addmarkerEvent', e);
            if (
                graphicManager.has(e.detail.mid) ||
                self.$refs.markerManager.has(e.detail.mid)
            ) {
                self.$refs.markerManager.createLabelAndaddMarker(
                    e.detail.positions,
                    e.detail.options,
                    e.detail.markerid
                );
            }
        },
        getpositionsEvent(e) {
            const self = this;
            if (
                graphicManager.has(e.detail.mid) ||
                self.$refs.markerManager.has(e.detail.mid)
            ) {
                var mid = e.detail.mid;
                var positions = e.detail.positions;
                var unifiedHeight = e.detail.unifiedHeight;
                var text = e.detail.text
                var spacing = e.detail.spacing
                // 查找要修改的对象
                const index = this.routes.findIndex((item) => {
                    return item.mid == mid;
                });
                if (index < 0) {
                    // 将 mid 和 positions 添加到 routes 数组的头部
                    this.routes.unshift({ mid, positions, unifiedHeight, text, edit: false, spacing });
                    // 存储 到store 点经纬度数组
                } else {
                    this.routes.splice(index, 1, {
                        mid,
                        positions,
                        unifiedHeight,
                        text,
                        edit: false,
                        spacing
                    });
                }
            }
        },
        /**组件传递信息-- edit:true */
        doEdit(route, newName) {
            if (newName !== undefined) {
                this.$set(route, 'text', newName);
                this.$set(route, 'edit', false);
            } else {
                // 执行不带 newName 的逻辑
                this.$set(route, 'edit', true);
            }
        },
        addmarker(e) {
            const self = this;
            console.log('存在addmarker', e);
            if (
                graphicManager.has(e.detail.mid) ||
                self.$refs.markerManager.has(e.detail.mid)
            ) {
                self.$refs.markerManager.droplikeid(
                    e.detail.positions,
                    e.detail.options,
                    e.detail.markerid
                );
            }
        },
        addEvent(e) {
            const self = this;
            if (
                graphicManager.has(e.detail.mid) ||
                self.$refs.markerManager.has(e.detail.mid)
            ) {
                self.pushLayerManaer(
                    e.detail.mtype,
                    e.detail.mid,
                    e.detail.mname
                ); //push到树节信息
            }
        },
        stopEdit(e) {
            const self = this;
            // 插入数据
            if (
                graphicManager.has(e.detail.mid) ||
                self.$refs.markerManager.has(e.detail.mid)
            ) {
                console.log('结束positions', e.detail.positions);

                self.editpushLayerManaer(
                    e.detail.type,
                    e.detail.mid,
                    e.detail.positions
                ); //修改到树节信息
            }
            // var area=  graphicManager.calculatePolygonArea(e.detail.positions)
            //    console.log("you多边形的面积: m", area);
            self.menuSelected = {};
            self.editMode = false;
            self.cesiumViewer.scene.globe.depthTestAgainstTerrain =
                self._depthTestAgainstTerrain;
        },
        startEdit(e) {
            const self = this;
            self.menuSelected = {};
            self.menuSelected[e.detail.graphicType] = true;
            self.setControlByEvent(e);
            self.editMode = true;

            if (/.*MODEL.*/.test(self.graphicHeight)) {
                self.cesiumViewer.scene.globe.depthTestAgainstTerrain = true;
            }
        },
        destroyEvent(e) {
            const self = this;
            if (
                self.$refs.layerManager &&
                typeof self.$refs.layerManager.drop === 'function'
            ) {
                self.$refs.layerManager.drop({ id: e.detail?.mid });
                self.cesiumViewer.scene.globe.depthTestAgainstTerrain =
                    self._depthTestAgainstTerrain;
            } else {
                console.log('没有加载上');
            }
        },
        deleteEvent(e) {
            const self = this;
            self.menuSelected = {};
            self.editMode = false;
            self.$refs.layerManager.drop({ id: e.detail.mid });
            self.cesiumViewer.scene.globe.depthTestAgainstTerrain =
                self._depthTestAgainstTerrain;
        },
        positionsMsg(e) {
            // var area=  graphicManager.calculatePolygonArea(e.detail.positions)
            //  console.log("多边形的面积: m", area);
        },
        /**结束-- 页面销毁 */
        destroyEventListener() {
            document.removeEventListener('destroyEvent', this.destroyEvent);
            document.removeEventListener('startEdit', this.startEdit)
            document.removeEventListener('stopEdit', this.stopEdit)
            document.removeEventListener('addEvent', this.addEvent)
            document.removeEventListener('addmarker', this.addmarker)
            document.removeEventListener('getpositionsEvent', this.getpositionsEvent)
            document.removeEventListener('addmarkerEvent', this.addmarkerEvent)
            document.removeEventListener('deleteEvent', this.deleteEvent)
            document.removeEventListener('addImageryEvent', this.imageryEvent);
            const pointItems = document.querySelectorAll('.cursor-tip-class');
            pointItems.forEach((item) => {
                item.remove();
            });
        },
        syncColor(parent, color) {
            const parents = [parent];
            //marker和label共用同一种颜色
            if (parent === 'labelColor') {
                parents.push('markerColor');
            } else if (parent === 'markerColor') {
                parents.push('labelColor');
            }
            const eles = $(
                '.el-color-picker__icon,.el-icon-arrow-down,.cesiumDrawFont iconcolor'
            );
            for (const e of eles) {
                const target = $(e).parent().parent().parent().parent();
                if (target.length > 0 && parents.includes(target[0].id)) {
                    $(e).css('color', color);
                }
            }
        },
        /**
         *  @param 触发 this.$refs.layerManager
         * this.$refs.layerManager.insertLayer(type, id, name);
         */
        pushLayerManaer(type, id, name) {
            checkComponent(this);
            this.$refs.layerManager.insertLayer(type, id, name);
        },
        editpushLayerManaer(type, id, positions) {
            checkComponent(this);
            //三维坐标数组
            this.$refs.layerManager.editInsertLayer(type, id, positions);
            // 将面积发给父组件
            const area = getPolygonArea(positions); // 计算面积
            this.$emit('sendAreaText', area);
        },
        modelThumb(item) {
            if (item.thumb) {
                return item.thumb;
            }
            return this.defaultImage;
        },
        getById(id) {
            checkComponent(this);
            if (graphicManager && graphicManager.has(id)) {
                return graphicManager.get(id);
            } else if (this.$refs.markerManager) {
                return this.$refs.markerManager.getById(id);
            }
        },
        selectModel(item) {
            checkComponent(this);
            this.selectedModel = 'http://127.0.0.1:9090/efuav-cloud/pointcloud/2/20240805134813/tileset.json' //item.url;
            this.modelSelectPanelvisible = false;
            this.$refs.markerManager.createModel({ uri: this.selectedModel });
        },
        /**
         * 设置当前要素的样式
         */
        setControlByEvent(e) {
            checkComponent(this);
            const viewer = this._viewer;
            if (e.detail.graphicType === 'POLYGON') {
                const material = e.detail.material;
                const outlineColor = e.detail.outlineColor;
                if (material) {
                    this.polygonColor = `rgba(${material.red * 255},${material.green * 255
                    },${material.blue * 255},${material.alpha})`;
                }
                this.outline = e.detail.outline;
                if (outlineColor) {
                    this.outlineColor = `rgba(${outlineColor.red * 255},${outlineColor.green * 255
                    },${outlineColor.blue * 255},${outlineColor.alpha})`;
                }
                this.outlineWidth = e.detail.outlineWidth;
                this.graphicHeight = e.detail.heightReference;
            } else if (e.detail.graphicType === 'POLYLINE') {
                this.graphicHeight = e.detail.heightReference;
                this.lineWidth = e.detail.width;
                const plmaterial = e.detail.material;
                if (plmaterial instanceof Cesium.PolylineDashMaterialProperty) {
                    this.lineStyle = 'dash';
                } else if (
                    plmaterial instanceof Cesium.PolylineGlowMaterialProperty
                ) {
                    this.lineStyle = 'glow';
                } else if (
                    plmaterial instanceof Cesium.PolylineArrowMaterialProperty
                ) {
                    this.lineStyle = 'arrow';
                } else {
                    this.lineStyle = 'solid';
                }
                this.lineColor = `rgba(${plmaterial.getValue(viewer.clock.currentTime).color.red *
                    255
                },${plmaterial.getValue(viewer.clock.currentTime).color.green *
                    255
                },${plmaterial.getValue(viewer.clock.currentTime).color.blue *
                    255
                },${plmaterial.getValue(viewer.clock.currentTime).color.alpha
                })`;
            }
        },
        stopOthers() {
            checkComponent(this);
            //   this.menuSelected = {};
            //   const manager = graphicManager.editManager;
            //   manager && manager.destroy();
            this.$refs.markerManager.stopPick();
            graphicManager.destroyManager();
            graphicManager.editManager = undefined;
        },
        setLabel() {
            checkComponent(this);
            let option;
            try {
                option = eval('(' + this.markerOption + ')');
                this.$refs.markerManager.setLabel(option);
            } catch (err) {
                console.log(err);
            }
            this.markerOptionsVisible = false;
        },
        updateMarker(mid, mname) {
            checkComponent(this);
            if (mid) {
                mname = mname || '未命名';
                this.$refs.layerManager.rename(null, mid, mname);
            }
            this.editMode = false;
            this.menuSelected = {};
        },
        addMarker(mid, mname, mtype) {
            checkComponent(this);
            this.pushLayerManaer(mtype, mid, mname);
            if (mtype === GraphicType.MODEL) {
                this.editMode = false;
                this.menuSelected = {};
            }
        },
        closeLayerManager() {
            this.layerManagerVisible = false;
        },
        exportGraphic(type) {
            checkComponent(this);
            if (type === 'MARKER' || type === 'LABEL') {
                this.$refs.markerManager.export(type);
            } else {
                graphicManager.export(type);
            }
        },
        importGraphic() {
            checkComponent(this);
            document.getElementById('graphicuploadhandler').click();
        },
        importfp() {
            checkComponent(this);
            const self = this;
            const evt = event || window.event;
            // const cvt = convertTool(_this.viewer)
            const files = evt.target.files;
            const ext = files[0].name.split('.')[1];
            if (files.length == 0) {
                return;
            }
            const reader = new FileReader();
            if (ext.toLowerCase() === 'geojson') {
                reader.readAsText(files[0]);
                reader.onload = function() {
                    // _this[_this.upload2].import(JSON.parse(this.result));
                    if (!this.result) {
                        return;
                    }
                    try {
                        const features = JSON.parse(this.result).features;
                        for (const feat of features) {
                            if (feat.geometry.type.toUpperCase() === 'POINT') {
                                self.$refs.markerManager.import(feat);
                            } else {
                                graphicManager.import(feat);
                            }
                        }
                    } catch (e) {
                        console.log(e);
                    }
                    document.getElementById('graphicuploadhandler').value = '';
                };
            } else if (ext.toLowerCase() === 'shp') {
                reader.readAsArrayBuffer(files[0]);
                reader.onload = function() {
                    open(this.result)
                        .then((source) =>
                            source.read().then(function log(result) {
                                if (result.done) return false;
                                const feat = result.value;
                                if (feat.geometry.type === 'Point') {
                                    self.$refs.markerManager.import(feat);
                                } else {
                                    graphicManager.import(feat);
                                }
                                return source.read().then(log);
                            })
                        )
                        .catch((error) => console.error(error.stack));
                };
                document.getElementById('graphicuploadhandler').value = '';
            }
        },
        editMarker(type) {
            checkComponent(this);
            this.editMode = true;
            // this.stopOthers();
            if (graphicManager.editManager) {
                graphicManager.editManager.stopEdit();
                graphicManager.editManager = undefined;
            }
            this.menuSelected = {};
            this.menuSelected[type] = true;
        },
        clearGraphic() {
            this.$refs.markerManager.removeAll();
            graphicManager.removeAll();
        },
        deleteMarker(id) {
            checkComponent(this);
            this.menuSelected['MARKER'] = false;
            this.editMode = false;
            this.$refs.layerManager.drop(id);
        },
        locateGraphic(id) {
            checkComponent(this);
            if (graphicManager.manager.has(id)) {
                const manager = graphicManager.manager.get(id);
                manager.zoomTo();
            } else {
                this.$refs.markerManager.zoomTo(id);
            }
            this.$emit('locateEvent', id);
        },
        /**
         *  编辑
         * @param {id} id
         * 成功：执行 graphicManager.edit
         */
        editGraphic(id) {
            checkComponent(this);
            /**
             * 删除多边形航线
             */
            graphicManager.removeEntityLikeName(this._viewer, id + 'uav-tmp');
            if (graphicManager.manager.has(id)) {
                const manager = graphicManager.manager.get(id);
                graphicManager.edit(id);
            } else {
                this.$refs.markerManager.edit(id);
            }
            this.$emit('editEvent', id); //子传递父
        },
        selectGraphic(id, state) {
            checkComponent(this);
            if (id === 'marker') {
                this.$refs.markerManager.select(
                    GraphicType.MARKER,
                    undefined,
                    state
                );
            } else if (id === 'label') {
                this.$refs.markerManager.select(
                    GraphicType.LABEL,
                    undefined,
                    state
                );
            } else if (id === 'model') {
                this.$refs.markerManager.select(
                    GraphicType.MODEL,
                    undefined,
                    state
                );
            } else if (id === 'polyline') {
                graphicManager.select(GraphicType.POLYLINE, undefined, state);
            } else if (id === 'polygon') {
                graphicManager.select(GraphicType.POLYGON, undefined, state);
            } else {
                if (graphicManager.manager.has(id)) {
                    graphicManager.select(undefined, id, state);
                } else {
                    this.$refs.markerManager.select(undefined, id, state);
                }
            }
            this.$emit('selectEvent', id, state);
        },
        deleteGraphic(id) {
            checkComponent(this);
            if (graphicManager.manager.has(id)) {
                const manager = graphicManager.manager.get(id);
                manager.destroy();
                graphicManager.manager.delete(id);

                this.deletelineGraphic(id);
            } else {
                this.$refs.markerManager.drop(id);
            }
            this.$emit('deleteEvent', id);
            // this.$refs.layerManager.deleteNode(id)
        },
        /**
         * @name:
         * @msg: 规划线 label
         * @param {*} id
         * @return {*}
         */
        deletelineGraphic(id) {
            // checkComponent(this)
            if (graphicManager.manager.has(id + '-uav-tmp-line')) {
                const linemanager = graphicManager.manager.get(
                    id + '-uav-tmp-line'
                );
                linemanager.destroy();
                graphicManager.manager.delete(id + '-uav-tmp-line');

                this.$refs.markerManager.droplikeid(id);
            }
        },
        /**接收组件滑块修改航线高度 */
        changeUnifiedHeightEvent(id, unifiedHeight) {
            const index = this.routes.findIndex((item) => {
                return id.includes(item.mid);
            });
            if (index >= 0) {
                this.routes[index].unifiedHeight = unifiedHeight;
            }
        },
        /**
         * @name: 父组件重命名
         * @msg: 子组件传递父组件
         * @param {*} id
         * @param {*} name
         * @return {*}
         */
        renameGraphic(id, name) {
            // console.log('组件传递信息mid与newName',id,name);
            const index = this.routes.findIndex((item) => {
                return id.includes(item.mid);
            });
            if (index >= 0) {
                this.routes[index].text = name;
            }

            checkComponent(this);
            const attr = /(.*?)</g.exec(name);
            name = /(.*?)</g.test(name) ? attr[1] : name;
            if (name === '未命名') {
                name = '';
            }
            let oname;
            if (graphicManager.has(id)) {
                oname = graphicManager.get(id).mname;
                graphicManager.rename(id, name);
            } else {
                oname = this.$refs.markerManager.markerManager.get(id).mname;
                this.$refs.markerManager.rename(id, name);
            }
            this.$emit('renameEvent', id, oname);
        },
        /**
         * @name:
         * @msg: 父组件绘制航线
         * @param {*} id  多边形面积
         * @param {*} positions 点数组
         * @param {*} hfDistance   间据（航之间间距）
         * @param {*} headingDistance  航向间距
         * @param {*} unifiedHeight  高度
         * @param {*} text  名称
         * @return {*}
         */
        drowrouteGraphic(id, positions, hfDistance, headingDistance, unifiedHeight, text) {
            checkComponent(this);
            this.deletelineGraphic(id);
            // graphicManager.beginCalc(id, positions, hfDistance, headingDistance, unifiedHeight, text);

            const parameters = { hfDistance, headingDistance, unifiedHeight, text }
            const longitude = this.defaultUavHeartbeat.lng || 113.36693330994926;
            const latitude = this.defaultUavHeartbeat.lat || 23.156426785188327;
            graphicManager.beforeBeginCalc(id, positions, parameters, [longitude, latitude]);

            /**
             *
             * 判断的数量 是否存在
             */
            this.$emit('drowrouteEvent', id, positions);
        },
        // #region -------------------------------------------------------------界面交互 --------------------------

        toggleLayerManager() {
            this.layerManagerVisible = !this.layerManagerVisible;
        },
        /**航表 */
        toggleRouteManager() {
            this.layerManagerVisible = false; // 确保图层管理隐藏
        },
        //#endregion

        // #region -------------------------------------------------------------- 组件 ----------------------------
        doFlyCommands() {
            this.$emit('doFlyCommands');
        },
        moniflyGraphic(id, positions) {
            console.log(positions);
            console.log(id);
            // checkComponent(this)
            // graphicManager.beginMonifly(id,positions)
            // this.$emit("moniflyEvent", id, positions);
        },
        //#endregion
        menuAction(menu) {
            checkComponent(this);
            const graphic = ['MARKER', 'POLYLINE', 'POLYGON', 'LABEL', 'MODEL', 'TILESET'];
            const bool = this.menuSelected[menu];

            this.stopOthers(menu);
            this.menuSelected = {};
            graphicManager && (graphicManager.tip.visible = false);
            if (bool) {
                this.menuSelected[menu] = false;
            } else {
                this.menuSelected[menu] = true;
            }

            if (graphic.includes(menu)) {
                if (this.graphicType === menu) {
                    this.editMode = !this.editMode;
                } else {
                    this.editMode = true;
                }
                this.graphicType = menu;
            } else {
                this.editMode = false;
            }
            if (/.*MODEL*/.test(this.graphicHeight)) {
                if (!['MARKER', 'LABEL', 'MODEL', 'LAYER'].includes(menu))
                //依附模型
                //几何图形要依附于模型必须开启depthTestAgainstTerrain
                { this.cesiumViewer.scene.globe.depthTestAgainstTerrain = true; }
            } else {
                //viewer.scene.globe.depthTestAgainstTerrain = this._depthTestAgainstTerrain;
            }
            switch (menu) {
                case 'MARKER':
                    if (this.editMode) {
                        this.$refs.markerManager.pick('marker');
                    } else {
                        this.$refs.markerManager.cancelMark();
                    }
                    break;
                case 'POLYLINE':
                    this.heightList[3].name = '空间线';
                    if (this.editMode) {
                        graphicManager.heightReference = this.graphicHeight;
                        graphicManager.material =
                            Cesium.Color.fromCssColorString(this.lineColor);
                        graphicManager.createPolyline(this.CursorTipDistance); //this.CursorTipDistance
                    } else {
                        graphicManager.destroyManager();
                    }

                    break;
                case 'POLYGON':
                    this.heightList[3].name = '空间面';
                    if (this.editMode) {
                        //   this.lineHeight=undefined
                        graphicManager.heightReference = this.graphicHeight;
                        const option = CesiumPolygon.defaultStyle;
                        option.outline = this.outline;
                        option.outlineColor = Cesium.Color.fromCssColorString(
                            this.outlineColor
                        );
                        option.outlineWidth = parseInt(this.outlineWidth);
                        // option.color = Cesium.Color.fromCssColorString(this.polygonColor);
                        graphicManager.material =
                            Cesium.Color.fromCssColorString(this.polygonColor);
                        graphicManager.style = option;
                        var entities = viewer.entities.values;
                        graphicManager.createPolygon(this.CursorTipDistance); //this.CursorTipDistance
                    } else {
                        graphicManager.destroyManager();
                    }

                    break;
                case 'LABEL':
                    if (this.editMode) {
                        this.$refs.markerManager.pick('label');
                    } else {
                        this.$refs.markerManager.cancelMark();
                    }
                    break;
                case 'TILESET':
                    // 补的用于 添加 3d tileset 或者 imgag
                    // if (this.editMode) {
                    //     this.$refs.markerManager.pick('label');
                    // } else {
                    //     this.$refs.markerManager.cancelMark();
                    // }
                    break;
                case 'MODEL':
                    if (this.editMode) {
                        if (this.extendMarkerModel.length < 1) {
                            this.editMode = false;
                            throw new Error('没有可用的模型');
                        }
                        this.$refs.markerManager.setModel({
                            uri: this.selectedModel
                        });
                        this.$refs.markerManager.pick('model');
                    } else {
                        this.$refs.markerManager.cancelMark();
                    }
            }
        },
        setLineMaterial(material, color) {
            checkComponent(this);
            switch (material) {
                case 'solid':
                    graphicManager.material = color;
                    break;
                case 'dash':
                    graphicManager.material =
                        new Cesium.PolylineDashMaterialProperty({
                            color: color
                        });
                    break;
                case 'glow':
                    graphicManager.material =
                        new Cesium.PolylineGlowMaterialProperty({
                            color: color
                        });
                    break;
                case 'arrow':
                    graphicManager.material =
                        new Cesium.PolylineArrowMaterialProperty(color);
                    break;
            }
        },
        addTilesetOrImagery() {
            // name 20240809 时间
            this.tilesetForm.name = `${new Date().getTime()}`
            this.dialogTilesetVisible = true
        },
        submitAdd(formName) {
            // this.extendTileseImageryList  如果 name 与 url  在extendTileseImageryList对象数组重复 提示
            // if (this.extendTileseImageryList.find(item => (item.url === this.tilesetForm.url || item.name === this.tilesetForm.name))) {
            //     this.$message.error('该url已存在')
            //     return false;
            // }
            const { url, longitude, latitude, height, name, mtype } = this.tilesetForm
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.dialogTilesetVisible = false
                    // const tileset = new Cesium.Cesium3DTileset({
                    //     url: 'http://127.0.0.1:9090/efuavmodel/pointCloud/kunmingPv/tileset.json'
                    // });
                    // this.cesiumViewer.scene.primitives.add(tileset);
                    // this.cesiumViewer.zoomTo(tileset);
                    console.log('tileset', url, name, mtype);
                    imageryManager.addImagery({ url, name, mtype }, {
                        longitude,
                        latitude,
                        height
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        toHide(item) {
            const { mid } = item
            if (imageryManager.has(mid)) {
                imageryManager.hide(mid)
            }
        },
        toShow(item) {
            const { mid } = item;
            if (imageryManager.has(mid)) {
                imageryManager.show(mid)
            }
        },
        toDelect(item) {
            checkComponent(this);
            const { mid } = item
            if (imageryManager.has(mid)) {
                imageryManager.destroy(mid)
                //  extendTileseImageryList 通过mid 删除
                const index = this.extendTileseImageryList.findIndex(item => {
                    return item.mid === mid
                })
                if (index > -1) {
                    this.extendTileseImageryList.splice(index, 1)
                }
            }
        },
        toFocus(item) {
            checkComponent(this);
            const { mid } = item
            if (imageryManager.has(mid)) {
                imageryManager.focus(mid)
            }
        },
        selectImage(type) {
            this.tilesetForm.type = type
            if (type === 'terrainProvider') {
                this.typeList = { TERRAIN: 'TERRAIN' }
                this.tilesetForm.mtype = 'TERRAIN'
            } else if (type === 'imageryProvider' || type === 'customImageProvider') {
                this.typeList = { TMS: 'TMS', WMS: 'WMS' }
                this.tilesetForm.mtype = 'TMS'
            } else if (type === 'cloudImage') {
                console.log('cloudImagecloudImage');
                this.typeList = { Tileset: 'Tileset' }
                this.tilesetForm.mtype = 'Tileset'
            } else {
                this.typeList = urlmType
            }
            // typeList urlmType
        },
        op(id) {
            if (graphicManager.manager.has(id)) {
                const manager = graphicManager.manager.get(id);
                manager.destroy();
                graphicManager.manager.delete(id);

                this.deletelineGraphic(id);
            } else {
                this.$refs.markerManager.drop(id);
            }
            this.$emit('deleteEvent', id);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/default.scss";

// @import url(.././assets/css/theme/${theme}.scss); 引入公共css类
#drawtoolPanel {
    position: fixed;
    width: 400px;
    top: 10px;
    right: 10px;
    height: 85px;
    right: 7px;
    border-radius: $b-radius;
    /* border: 1px solid #01c5fd;
  box-shadow: 0 0 5px rgba(1, 197, 253, 0.75); */
    z-index: 10;
    border-radius: $b-radius;
    -moz-user-select: none;
    -khtml-user-select: none;
    user-select: none;
    font-size: $font-size;
}

.layer-manager-class {
    width: 400px;
    position: absolute;
    top: 90px;
}

.edit-layer-manager-class {
    top: 140px;
}

.graphic-edit {
    width: 100%;
    height: 52px;
    line-height: 52px;
    position: absolute;
    background: $bg-color;
    color: $color;
}

#clostbtn:after {
    content: "\E6DB";
}

.el-container {
    width: 400px;
    height: 85px;
    color: $color;
    background: $bg-color;
    /* border: 1px solid #01c5fd;
  box-shadow: 0 0 5px rgba(1, 197, 253, 0.75); */
    z-index: 10;
}

.el-header {
    height: $title-height !important;
    line-height: $title-height !important;
    border-bottom: 1px solid $devision-color;
    padding: $padding;
    border-radius: $b-radius;

    span {
        margin: $item-margin;
        color: $color;
    }
}

.icon-class {
    color: $color;
}

.selected-graphic {
    color: $selected-color !important;
}

.graphic-draw-main {
    height: 52px;
    padding: $padding;
    // line-height: 60%;
    vertical-align: top;
    color: $color;
    border-radius: $b-radius;

    ul {
        cursor: default;
        border-radius: $b-radius;
        padding: 0;
        overflow: hidden;
        // border-bottom: 1px solid $devision-color;
        height: 43px;
        margin: 0;

        // margin-top: 0 0 5px 0;
        li {
            cursor: pointer;
            float: left;
            padding: 0 0 0;
            width: 62px;
            height: 100%;
            box-sizing: border-box;
            list-style: none;

            &:hover {
                i {
                    color: $hover-color;
                }

                span {
                    color: $hover-color;
                }
            }

            i {
                display: block;
                height: 16px;
                width: 16px;
                background-size: contain;
                // vertical-align: middle;
                margin: 0 auto;
                margin-top: 8px;
            }

            span {
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                display: block;
                text-align: center;
                color: $color;
                line-height: 22px;
            }
        }
    }
}

.el-main img {
    display: inline-block;
}

:deep(.el-input) {
    height: 28px;
}

.edit-class {
    height: 52px;
    line-height: 52px;
    vertical-align: top;
    padding: 0 5px;
    border-top: 1px solid $devision-color;
    display: flex;
    align-items: center;

    :deep(.el-color-picker--small) {
        height: 28px;
        width: 28px;
    }

    :deep(.el-color-picker__color) {
        border: none;
        border-radius: $b-radius;
        display: inline;
    }

    :deep(.el-color-picker__trigger) {
        height: 28px;
        width: 28px;
        padding: 0px;
        border: 1px solid $color;
        display: block;
    }

    :deep(.el-color-picker__color-inner) {
        background-color: $bg-color !important;
        border-radius: $b-radius;
    }

    :deep(.el-input__wrapper) {
        background-color: $bg-color;
        border: 1px solid $color;
        color: $color;
    }

    :deep(.el-color-picker__icon) {
        line-height: 28px;
    }

    span {
        margin: $item-margin;
    }

    .el-select {
        vertical-align: top;
    }

    .el-color-picker {
        vertical-align: top;
        margin: 12px 5px;
    }
}

.marker-edit-class {
    .el-select {
        width: 80px;
        margin: $item-margin;
    }

    img {
        width: 24px;
        height: 24px;
        // margin-left: 10px;
    }
}

.polyline-edit-class {
    .width-selector {
        width: 70px;
        margin: $item-margin;
    }

    .style-selector {
        width: 80px;
        // left:60px;
        margin: $item-margin;
    }

    .type-selector {
        width: 140px;
        // left:120px;
        margin: $item-margin;
    }
}

.polygon-edit-class {
    .width-selector {
        width: 70px;
        margin: $item-margin;
    }

    .type-selector {
        width: 140px;
        // left:60px;
        margin: $item-margin;
    }

    .outline-selected {
        color: #ffffff;
    }

    .border-btn {
        border: 1px solid $color;
        width: 28px;
        height: 28px;
        display: inline-block;
        vertical-align: top;
        line-height: 28px;
        text-align: center;
        border-radius: $b-radius;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        margin: 12px 5px;
    }
}

.label-edit-class {
    span {
        margin: $item-margin;
    }

    .font-selector {
        width: 120px;
        margin: $item-margin;
    }

    .size-selector {
        width: 80px;
        margin: $item-margin;
    }

    img {
        width: 24px;
        height: 24px;
        margin: $item-margin;
    }
}

.model-edit-class {
    span {
        margin: $item-margin;
    }

    .model-selector-trigger {
        border: 1px solid $color;
        width: 28px;
        height: 28px;
        display: inline-block;
        vertical-align: top;
        line-height: 28px;
        text-align: center;
        border-radius: $b-radius;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        margin: 12px 5px;
    }

    .el-select {
        width: 100px;
        margin: $item-margin;
    }

    .el-button {
        height: 28px;
        line-height: 28px;
    }

    .el-slider {
        display: inline-block;
        margin: 0 15px;
        width: 100px;

        :deep(.el-slider__runway) {
            margin-bottom: 0px;
        }
    }
}

.el-main .el-radio {
    display: inline-block;
    margin: 5px;
}
</style>
<style lang='scss'>
.model-select-panel {
    display: block;
    width: 340px;
    height: 210px;

    img {
        width: 32px;
        height: 32px;
        margin: 5px;
    }
}

.el-popover {
    display: inline-table;
}

//new
::v-deep .routelist {
    width: 100%;

    .el-badge__content.is-fixed {
        top: 10px;
        font-size: 10px;
    }

    .el-badge__content {
        line-height: 13px;
        height: 15px;
        font-size: 10px;
    }
}
.image-item{
    width: 34px;
    height: 34px;
    margin: 2px 5px;
    cursor: pointer;
}

</style>
