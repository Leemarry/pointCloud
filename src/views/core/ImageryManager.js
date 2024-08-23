
export function fromDegrees(longitude, latitude, height = 500) {
    return Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
}
export function flyTo(viewer, options = BaseCesium.defaultPositionOptions) {
    viewer.camera.flyTo(options);
}
export function setView(viewer, options = BaseCesium.defaultPositionOptions) {
    viewer.camera.setView(options);
}
class BaseCesium {
    constructor(viewer, PositionOptions = BaseCesium.defaultPositionOptions) {
        if (viewer instanceof Cesium.Viewer === false) {
            throw new Error('viewer不是一个有效的Cesium Viewer对象.')
        }
        this.viewer = viewer;
        this.targetPosition = undefined;
        this._PositionOptions = PositionOptions;
        this._destination = PositionOptions.destination;
    }
    // flyTo
    static flyTo(viewer, options = BaseCesium.defaultPositionOptions) {
        viewer.camera.flyTo(options);
    }
    //setView
    static setView(viewer, options = BaseCesium.defaultPositionOptions) {
        viewer.camera.setView(options);
    }
    // Getter for PositionOptions
    get PositionOptions() {
        return this._PositionOptions;
    }

    // Setter for PositionOptions
    set PositionOptions(newOptions) {
        this._PositionOptions = newOptions;
        this.flyTo(this.viewer, this._PositionOptions);
    }

    static defaultPositionOptions = {
        destination: Cesium.Cartesian3.fromDegrees(112.27139701848677, 31.026628725595643, 1000),
        // 方向，俯视和仰视的视角
        orientation: {
            heading: Cesium.Math.toRadians(0), // 设置偏航角度（单位：弧度）
            pitch: Cesium.Math.toRadians(-90), // 设置俯仰角度（单位：弧度）
            roll: Cesium.Math.toRadians(0) // 设置横滚角度（单位：弧度）
        }
    }
    static defaultDestination = Cesium.Cartesian3.fromDegrees(112.27139701848677, 31.026628725595643, 1000)
    static defaultOrientation = {
        // 方向，俯视和仰视的视角
        orientation: {
            heading: Cesium.Math.toRadians(0), // 设置偏航角度（单位：弧度）
            pitch: Cesium.Math.toRadians(-90), // 设置俯仰角度（单位：弧度）
            roll: Cesium.Math.toRadians(0) // 设置横滚角度（单位：弧度）
        }
    }
}

class CesiumTileset {
    constructor(viewer, tileseOptions = CesiumTileset.defaultOptions) {
        if (viewer instanceof Cesium.Viewer === false) {
            throw new Error('viewer不是一个有效的Cesium Viewer对象.')
        }
        this.viewer = viewer;
        this.tilesetOptions = tileseOptions;
        // this.tileset = new Cesium.Cesium3DTileset(this.tilesetOptions);
        this.tileset = undefined;
        this.addTileset(tileseOptions);
    }
    addTileset(tileseOptions) {
        if (this.viewer && tileseOptions.url) {
            const tileset = new Cesium.Cesium3DTileset({
                url: tileseOptions.url
            });
            this.viewer.scene.primitives.add(tileset);
            this.tileset = tileset;
            // this.viewer.zoomTo(this.tileset);
            this.focus()
        }
    }
    removeTileset() {
        this.viewer.scene.primitives.remove(this.tileset);
        this.tileset = undefined;
    }
    destroy() {
        this.removeTileset();
        this.viewer = undefined;
        this.tilesetOptions = undefined;
    }
    // 隐藏
    hide() {
        if (this.tileset instanceof Cesium.Cesium3DTileset) {
            this.tileset.show = false;
        }
    }
    show() {
        if (this.tileset instanceof Cesium.Cesium3DTileset) {
            this.tileset.show = true;
        }
    }
    focus() {
        if (this.tileset instanceof Cesium.Cesium3DTileset) {
            this.viewer.zoomTo(this.tileset);
        }
    }

    //默认配置
    static defaultOptions = {
        id: 'kunmingPvout',
        customId: 'kunmingPvout',
        url: null,
        maximumMemoryUsage: 1024 * 1024, // 设置3D Tiles的最大内存使用量--浏览器内层占用,
        maximumScreenSpaceError: 2, // 数值加大，能让最终成像变模糊,加载快;初始化的清晰度
        skipScreenSpaceErrorFactor: 16,
        dynamicScreenSpaceErrorDensity: 0.3, // 数值加大，能让周边加载变快
        dynamicScreenSpaceError: true // 根据测试，有了这个后，会在真正的全屏加载完之后才清晰化房屋
        // 可以在这里配置其他选项，比如
        // maximumScreenSpaceError: 2, // 控制加载的详细程度
        // maximumMemoryUsage: 1024 * 1024 * 128 // 最大内存使用量（以字节为单位）
    }
}

class ImageryProvider {
    constructor(viewer, ImageryOptions = ImageryProvider.defaultImageryOptions, provideType = 'TMS') {
        this.viewer = viewer;
        this.imageryLayer = undefined;
        this._targetPosition = Cesium.Cartesian3.fromDegrees(112.27139701848677, 31.026628725595643, 1000);
        this.provideType = provideType
        this.addImageryProvider(ImageryOptions);
    }
    set targetPosition(position) {
        this._targetPosition = position
        // this.flyTo()
    }
    get targetPosition() {
        return this._targetPosition
    }
    addImageryProvider(ImageryOptions) {
        const imageryProvider = new Cesium.UrlTemplateImageryProvider(ImageryOptions);
        const imageryLayer = this.viewer.imageryLayers.addImageryProvider(imageryProvider);
        this.imageryLayer = imageryLayer;
    }
    // 隐藏
    hide() {
        if (this.imageryLayer) {
            this.imageryLayer.show = false;
        }
    }
    show() {
        console.log('xs显示');
        if (this.imageryLayer) {
            this.imageryLayer.show = true;
        }
    }
    flyTo() {
        console.log('this.targetPosition',this.targetPosition);
        this.viewer.camera.flyTo({
            destination: this.targetPosition
        });
    }
    focus() {
        if (this.imageryLayer) {
            this.flyTo()
        }
    }
    // 删除影像
    destroy() {
        if (this.imageryLayer) {
            this.viewer.imageryLayers.remove(this.imageryLayer);
            this.viewer.scene.requestRender();
        }
        this.imageryLayer = undefined
    }

    static defaultImageryOptions = {
        url: '',
        minimumLevel: 3,
        maximumLevel: 18,
        mid: '55555',
        name: 'name',
        mtype: ''
        // maximumLevel: 20,
        // minimumLevel: 0,
        // credit: '谷歌影像'
        // position: Cesium.Cartesian3.fromDegrees(116.3975, 39.909, 0)
    }
}

// class TerrainProvider {
//     constructor(options) {
//         this.options = options;
//         this.terrainProvider = new Cesium.CesiumTerrainProvider(options);
//     }
// }

export default class ImageryManager {
    constructor(viewer) {
        this.viewer = viewer;
        this.manager = new Map()
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
    // 隐藏
    hide(id) {
        const manager = this.manager.get(id)
        if (manager) {
            manager.hide()
        }
    }
    show(id) {
        const manager = this.manager.get(id)
        if (manager) {
            manager.show()
        }
    }
    focus(id) {
        const manager = this.manager.get(id)
        if (manager) {
            manager.focus()
        }
    }
    destroy(id) {
        const manager = this.manager.get(id)
        if (manager) {
            manager.destroy()
            this.manager.delete(id)
        }
    }

    removeAll() {
        const values = this.manager.values();
        for (const v of values) {
            // v.remove();
            v.destroy();
        }
        this.manager.clear();
    }
    /**
   * 生产id
   */
    generateId() {
        return (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + (new Date()).getTime() + '-' + Math.random().toString().substr(2, 5);
    }

    addImagery(options, destination) {
        const { mtype } = options;
        let manager = null
        if (mtype === 'TMS' || mtype === 'WMS') {
            console.log('TMS');
            manager = new ImageryProvider(this.viewer, options)
            manager.targetPosition = fromDegrees(destination.longitude, destination.latitude, destination.height)
        } else if (mtype === 'Tileset') {
            manager = new CesiumTileset(this.viewer, { url: options.url });
            // manager.addTileset('http://127.0.0.1:9090/efuavmodel/pointCloud/kunmingPv/tileset.json')
        }

        const mid = this.generateId()
        this.manager.set(options.name, manager)
        const evt = new CustomEvent('addImageryEvent', {
            detail: {
                name: options.name,
                url: options.url,
                mid: options.name
            }
        })
        document.dispatchEvent(evt)
    }
}

// "Tileset"  "TMS" "WMS"
export const urlmType = {
    Tileset: 'Tileset',
    TMS: 'TMS',
    WMS: 'WMS',
    TERRAIN: 'TERRAIN'
}

