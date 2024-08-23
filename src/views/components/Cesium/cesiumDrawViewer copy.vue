<template>
  <div v-show="visible" id="drawtoolPanel">
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
            <i class="cesiumDrawFont iconlayer icon-class" :class="{ 'selected-graphic': layerManagerVisible }" title="图层管理" @click="toggleLayerManager" />
            <span :class="{ 'selected-graphic': layerManagerVisible }" @click="toggleLayerManager">清单</span>
          </li>
          <!-- 上传航线  -->
          <li>
            <el-badge :hidden="routes.length==0" :value="routes.length" class="routelist">
              <i class="el-icon-s-flag" :class="{ 'selected-graphic': routeManagerVisible }" title="航线列表" @click="toggleRouteManager" />
              <span :class="{ 'selected-graphic': routeManagerVisible }" @click="toggleRouteManager">航表</span>
            </el-badge>
          </li>
          <!-- routeManagerVisible @click="sendupload()" -->
          <!-- <li>
              <i class="cesiumDrawFont iconlayer icon-class"
                :class="{ 'selected-graphic': layerManagerVisible }" title="图层管理"
                @click="doFlyCommands()"></i>
              <span :class="{ 'selected-graphic': layerManagerVisible }"
                @click="doFlyCommands()">执行</span>
            </li> -->

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
    </div>
    <MarkerViewer ref="markerManager" :attachment="attachment" :extend-image="extendMarkerImage" @deleteEvent="deleteMarker" @editEvent="editMarker" @addEvent="addMarker" @updateEvent="updateMarker" />
    <layerManager
      v-show="layerManagerVisible"
      ref="layerManager"
      :tools="tools"
      class="layer-manager-class"
      @changeUnifiedHeight="changeUnifiedHeightEvent"
      :class="{ 'edit-layer-manager-class': editMode }"
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
    <routeManager v-show="routeManagerVisible" ref="routeManager" v-bind="$attrs" class="layer-manager-class" :class="{ 'edit-layer-manager-class': editMode }" :routes="routes" @send:toggleRouteManager="toggleRouteManager" @send:edit="doEdit" v-on="$listeners" />
    <input v-show="false" id="graphicuploadhandler" type="file" accept=".geojson, .shp" @change="importfp">
  </div>
</template>
<script>
import * as turf from '@turf/turf';
import GraphicManager from '../../core/GraphicManager';
import MarkerViewer from './markerViewer.vue';
import { CesiumPolygon } from '../../core/Graphic';
import layerManager from './layerManager';
import GraphicType from '../../core/GraphicType';
import { open } from 'shapefile';
import { moveDiv } from '../../core/utils';
import $ from 'jquery';
import { checkComponent, checkViewer, getPolygonArea } from '../../core/utils';
import { mapGetters } from 'vuex';
/**航线列表管理 */
import routeManager from './cesiumRouteList.vue';
let graphicManager;
const console = window.console;
// var polyArr = []; // 面数据
var jdArrs = []; // 交点集合
export default {
    name: 'CesiumDraw',
    data() {
        return {
            /**航线列表*/
            routes: [],
            visible: true,
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
            imags: [
                './static/images/markers/1.png',
                './static/images/markers/2.png',
                './static/images/markers/3.png',
                './static/images/markers/4.png',
                './static/images/markers/5.png',
                './static/images/markers/6.png',
                './static/images/markers/7.png',
                './static/images/markers/8.png'
            ],
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
            modelColor: '#FFFFFF',
            modelMixed: 0.5,
            modelSelectPanelvisible: false,
            selectedModel: undefined
        };
    },
    computed: {
        defaultImage() {
            return 'this.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB1UlEQVQ4T6XTMWgUQRQG4P/N3gaRSBpBEAMqrldkYyXu5VCMChZBEDxOsDIgKKSyECxTWERIYe2hRdoLeKV2RhCymwhy3E48b087C7EQtRDj7vyyg3dKDGyI087MN/97MyP4zyFF+5vNpnPEP3neZGlNlFwBoU/53rnBvn+AsPP+AFRWgUFNKVwgcVCAp4C0lJu10lTNiTGdYLLcyhF52e3uG8lUDVRnDXhagEP5YkM2pia9la0Jw413nhhzKfC9BxaI4t4aII3A9x6FcXJbBGNFZQ3jG3Yk0snjYMK7EelkHsBGMOEt7xSI4oQSxr3lin+8ngPG4MV2sQdgGPdvCviQkFsV/1jDAmu6f6c0wqWfm5grAiKd1EE0IbiaJ7VApN+egcF+KHWiCNhamgVekW4a9xdE4dsAeK716F7jLkJUNXOzmWq5/GG7vlggn4ji5BkEqzngQDYpXARQtdcErKRje2aq4+PfbaOJKcC5G/hH20NgPU7uU/AjJT47wD0Ao3+fSMgTBXwlOPvnBcoSweu/E/SuUdRFQ7YdwD6QopEnIzBtgfV2t8ySM5sSH3cF2D7oZD4jvpSAy0Wn5/MEPgGoDz/T6us3hx231KVgYSeAbTAx/Qs/Rdq4fXky6QAAAABJRU5ErkJggg=="';
        },
        ...mapGetters([
            'defaultUavHeartbeat'
        ])
    },
    components: {
        MarkerViewer,
        layerManager,
        routeManager
    },

    props: {
        attachment: undefined,
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
                return [];
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
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        // console.log("parent", this.$attrs, this.$listeners);
    },
    mounted() {
        window.jq = $;
        const self = this;
        this.$nextTick(() => {
            moveDiv('drawtoolPanel', 'drawtoolHead');
            $('#drawtoolPanel .el-color-picker__icon').addClass(
                'cesiumDrawFont iconcolor'
            );
        });
        if (this.viewer instanceof Cesium.Viewer) {
            this.init(this.viewer);
        } else if (window.viewer instanceof Cesium.Viewer) {
            this.init(window.viewer);
        }
        this.$nextTick(() => {
            self.syncColor('markerColor', self.markerColor);
            self.syncColor('lineColor', self.lineColor);
            self.syncColor('polygonColor', self.polygonColor);
            self.syncColor('outlineColor', self.outlineColor);
            self.syncColor('modelColor', self.modelColor);
        });
    },
    beforeDestroy() {
        this.destroyEventListener()
    }, //生命周期 - 销毁之前
    methods: {
        /**
           * 初始：
           */
        init(viewer) {
            const pointItems = document.querySelectorAll('.cursor-tip-class');

            checkViewer(viewer);
            if (this._viewer) {
                return;
            }
            const self = this;
            this._depthTestAgainstTerrain =
                  viewer.scene.globe.depthTestAgainstTerrain;
            this.$refs.markerManager.init(viewer); //传递子组件
            graphicManager = new GraphicManager(viewer);
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
        },
        addmarkerEvent(e) {
            const self = this;
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
                this.$refs.routeManager.newName = route.mid
            } else {
                // 执行不带 newName 的逻辑
                this.$set(route, 'edit', true);
                this.$refs.routeManager.newName = route.mid
            }
        },
        addmarker(e) {
            const self = this;
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

            const pointItems = document.querySelectorAll('.cursor-tip-class');
            console.log(pointItems);
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
            this.selectedModel = item.url;
            this.modelSelectPanelvisible = false;
            this.$refs.markerManager.setModel({ uri: item.url });
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

        clickSwitchVisible(visible) {
            //点击切换

            if (visible == '') {
            } else if (visible == '') {
            } else {
                return false;
            }
        },

        toggleLayerManager() {
            this.layerManagerVisible = !this.layerManagerVisible;
            this.routeManagerVisible = false; // 确保航线列表隐藏
        },
        /**航表 */
        toggleRouteManager() {
            this.routeManagerVisible = !this.routeManagerVisible;
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
            this.$emit('sendclearLinesAndstore') // 清除store/航线
            checkComponent(this);
            const graphic = ['MARKER', 'POLYLINE', 'POLYGON', 'LABEL', 'MODEL'];
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
                        var entities = viewer.entities.values;
                        console.log(entities);
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
  </style>
