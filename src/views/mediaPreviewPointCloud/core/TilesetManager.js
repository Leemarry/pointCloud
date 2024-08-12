
class CesiumTileset {
    constructor(viewer, tileseOptions = CesiumTileset.defaultOptions) {
        if (viewer instanceof Cesium.Viewer === false) {
            throw new Error('viewer不是一个有效的Cesium Viewer对象.')
        }
        this.viewer = viewer;
        this.tilesetOptions = tileseOptions;
        // this.tileset = new Cesium.Cesium3DTileset(this.tilesetOptions);
        this.tileset = undefined;
        this.addTileset();
    }
    addTileset() {
        if (this.viewer && this.tilesetOptions.url) {
            this.tileset = new Cesium.Cesium3DTileset(this.tilesetOptions);
            this.viewer.scene.primitives.add(this.tileset);
            this.viewer.zoomTo(this.tileset);
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
    hideTileset() {
        if (this.tileset instanceof Cesium.Cesium3DTileset) {
            this.tileset.show = false;
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



export default class TilesetManager {
    constructor(viewer) {
        if (viewer instanceof Cesium.Viewer) {
            this._viewer = viewer
        }
        if (!Cesium.defined(this._viewer)) {
            return
        }
        this.markerid = undefined;
        this.manager = new Map();
    }

    /**
   * 生产id
   */
    generateId() {
        return (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + (new Date()).getTime() + '-' + Math.random().toString().substr(2, 5);
    }
    addTileset(option) {
        if (option.url) {
            const tileset = new CesiumTileset(this._viewer, option);
            const mid = this.generateId();
            this.manager.set(mid, tileset);
            const evt = new CustomEvent('addTilesetEvent', {
                detail: {
                    name: option.name,
                    url: option.url,
                    id: mid
                }
            });
            document.dispatchEvent(evt);
        }
    }
    // 删除
    removeTileset(url) {
        const manager = this.manager.get(url);
        manager.destroy();
    }
    // 隐藏
    hideTileset(url) {
        const manager = this.manager.get(url);
        manager.hideTileset();
    }
}
