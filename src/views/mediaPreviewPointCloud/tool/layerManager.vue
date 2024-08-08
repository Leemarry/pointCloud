<!--  -->
<template>
  <div id="layer-manager-box" class="layer-manager-box">
    <div id="layer-manager-header" class="layer-manager-header">
      <i class="cesiumDrawFont iconclose1" />
      <span>标绘清单</span>
      <span class="closebtn cesiumDrawFont iconclose" @click="closeLayerManaer">x</span>
    </div>
    <div class="layer-manager-tools">
      <span class="el-dropdown-link" @click="importHandler">
        <i class="cesiumDrawFont iconimport action-icon-class">
          <span>导入</span>
        </i>
      </span>
      <el-dropdown trigger="click" @command="exportHandler">
        <span class="el-dropdown-link">
          <i class="cesiumDrawFont iconexport action-icon-class">
            <span>导出</span>
          </i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="MARKER" class="cesiumDrawFont iconmarker">标记</el-dropdown-item>
            <el-dropdown-item command="POLYLINE" class="cesiumDrawFont iconpolyline">线</el-dropdown-item>
            <el-dropdown-item command="POLYGON" class="cesiumDrawFont iconpolygon">多边形</el-dropdown-item>
            <el-dropdown-item command="LABEL" class="cesiumDrawFont iconlabel">书签</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <i class="cesiumDrawFont iconremove action-icon-last-class" @click="removeAll">
        <span>清空</span>
      </i>
    </div>
    <div id="layerTree" class="graphic-draw-layer-manager-class">
      <el-tree ref="tree" :data="json" show-checkbox node-key="id" :default-expanded-keys="['marker', 'polyline', 'polygon']" @check="checkAction">
        <template #default="{ data,node }">
          <div class="custom-tree-node">
            <i v-show="data.icon" :class="data.icon" class="action-item" />
            <!-- <span class="cecece"  @click="cese(data)">o1</span> -->
            <!-- <span class="cecece" @click="cese(node,data)">o1</span> -->
            <el-input v-if="data.edit" v-model="newName" class="inputText" @keyup.enter.native="renameAction(data)" />
            <span class="node-name action-item" :title="data.sliderTitle" @click="clisck(node,data)">{{ data.text ? data.text : `${data.sliderLable}:${data.sliderValue}` }}</span>
            <template v-if="node.level === 2">
              <span class="action-class">
                <i v-show="data.type== 'polygon' && (data.positions != null||'undefind')" class="el-icon-share" title="规划线程" @click="beginCalcroute(data)" />
                <!-- <i v-show="data.type== 'polygon' && (data.positions != null||'undefind')" class="el-icon-s-promotion" title="模拟飞行" @click="beginMoniFly(node,data)"></i> -->
                <!-- <i v-for="tool in tools" :key="tool.id" class="cesiumDrawFont action-item" :class="[tool.icon]" :title="tool.text" @click="tool.action.call(this, data)"></i> -->
                <i v-for="tool in mergedTools" :key="tool.id" class="cesiumDrawFont action-item" :class="[tool.icon]" :title="tool.text" @click="tool.action.call(this, data)" />
              </span>
            </template>
            <template v-if="node.level === 3">
              <!-- 在第三层根据 data.slidershow 的值来决定是否显示滑块 data.sliderValue  node.level === 3 -->
              <div class="slidershow">
                <!-- 通过 @change  没有用 @input-->
                <el-slider v-if="data.slidershow" v-model="data.sliderValue" :min="5" :max="150" @change="sliderValueSave(node,data)" @input="sliderValueInput(node,data)" @mousedown.native="handleMouseDown" />
              </div>
            </template>
          </div>
        </template>
      </el-tree>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
function locate(data) {
    this.$emit('locate', data.id);
}
function rename(data, id, text) {
    // data.edit=true;
    if (data) {
        this.$set(data, 'edit', true);
        this.newName = data.text;
        console.log('rename正确');
    } else {
        console.log('rename错误');
        for (const ls of this.json) {
            for (const l of ls.children) {
                if (l.id === id) {
                    l.text = text;
                }
            }
        }
    }
}
/**
 * @ 编辑
 */
function edit(data) {
    this.$emit('edit', data.id);
}
/**
 * @fun
 */
function drop(data) {
    if (!data) {
        return;
    }
    this.$emit('delete', data.id);
    const index = this.checked.indexOf(data.id);
    if (index > -1) {
        this.checked.splice(index, 1);
        dropRoute(data.id)
    }
    this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.checked);
    });

    for (const ls of this.json) {
        let i = 0;
        for (const l of ls.children) {
            if (l.id === data.id) {
                ls.children.splice(i, 1);
                break;
            }
            i++;
        }
    }
}
/*移除航线列表生成的航线 */
function dropRoute(id) {

}
export default {
    props: {
        tools: {
            default: null
            // default: function () {
            //   return {
            //     locate: { text: "定位", icon: "iconlocate", action: locate },
            //     rename: {text: "重命名", icon: "iconrename",  action: rename},
            //     edit: { text: "编辑", icon: "iconedit", action: edit },
            //     drop: { text: "删除", icon: "iconremove", action: drop }
            //   }
            // }
        }
    },
    data() {
        return {
            mouseDown: false,
            markerTree: new Map(),
            polylineTree: new Map(),
            polygonTree: new Map(),
            labelTree: new Map(),
            modelTree: new Map(),
            renameNodeStatus: false,
            checked: [],
            newName: '',
            json: [
                {
                    id: 'marker',
                    text: '标记',
                    type: 'marker',
                    icon: 'cesiumDrawFont icon-lujing',
                    children: [
                    ]
                },
                {
                    id: 'polyline',
                    text: '线',
                    type: 'polyline',
                    icon: 'cesiumDrawFont iconpolyline',
                    children: []
                },
                {
                    id: 'polygon',
                    text: '多边形',
                    type: 'polygon',
                    icon: 'cesiumDrawFont iconpolygon',
                    children: [
                    ]
                },
                {
                    id: 'label',
                    text: '文字',
                    type: 'label',
                    icon: 'cesiumDrawFont iconlabel',
                    children: []
                },
                {
                    id: 'model',
                    icon: 'cesiumDrawFont iconmodel',
                    text: '模型',
                    type: 'model',
                    children: []
                }
            ],
            defaultTools: {
                locate: {
                    text: '定位',
                    icon: 'iconlocate',
                    action: this.locate
                },
                rename: {
                    text: '重命名',
                    icon: 'iconrename',
                    action: this.rename
                },
                edit: { text: '编辑', icon: 'iconedit', action: this.edit },
                drop: { text: '删除', icon: 'iconremove', action: this.drop }
            }
        };
    },
    watch: {
        'sliderValueObj': {
            deep: true,
            immediate: true, //立即执行
            handler(newVal, oldVal) {
                console.log('sliderValueOj立即执行', newVal);
            }
        }

    },
    mounted() {

    },
    computed: {
        ...mapGetters([
            'sliderValueObj'
        ]),
        mergedTools() {
            return Object.assign({}, this.defaultTools, this.tools);
        }
    },
    methods: {
        //鼠标点击事件
        handleMouseDown() {
            //  console.log("鼠标点击滑块事件");
            this.mouseDown = true;
            window.onmouseup = () => {
                //  console.log("鼠标抬起滑块事件");
                this.mouseDown = false;
                window.onmouseup = null;
            };
        },
        // 在滑块拖动之后 不必要
        sliderValueInput(paren, data) {
            if (this.mouseDown) {
                const selectedNode = this.findNodeById(data.id, this.json);
                if (selectedNode != null) {
                    // console.log(selectedNode); // 输出选中节点的 JSON 数据 --position
                }
            }
        },
        findNodeById(id, nodes) {
            for (const node of nodes) {
                // node.id.includes(id)
                if (node.id == id || id.includes(node.id)) {
                    return node; // 找到对应的节点
                } else if (node.children && node.children.length > 0) {
                    const result = this.findNodeById(id, node.children);
                    if (result) {
                        return result; // 找到对应的节点
                    }
                }
            }
            return null; // 未找到对应的节点
        },
        clisck(parent, data) {
            var parentIds = this.$refs.tree.getHalfCheckedKeys();
            var childsIds = this.$refs.tree.getCheckedKeys();
        },
        /* 滑块移动 */
        sliderValueSave(node, data) {
            console.log('移动滑块');
            const id = data.id
            if (id.includes('height')) {
                // 滑动的高度滑块
                const unifiedHeight = data.sliderValue
                this.$emit('changeUnifiedHeight', id, unifiedHeight);
                return false;
            }
            const selectedNode = this.findNodeById(data.id, this.json);
            if (selectedNode != null) {
                // console.log('只在松开鼠标后触发', selectedNode); // 输出选中节点的 JSON 数据 父节点数据  -- position  id
                this.beginCalcroute(selectedNode); //  绘制间距 使用多边形角点 绘制航线
            }
        },
        /**回车确认（编辑完成） */
        renameAction(data) {
            data.edit = false;
            this.$emit('rename', data.id, this.newName); // 父：cesiumDrawViewer改  我还有改一下routes的text
            data.text = this.newName;
        },
        /**计算绘制间距航线 */
        beginCalcroute(data) {
            // beginCalcroute.call(this,data)
            this.$emit(
                'drowroute',
                data.id,
                data.positions,
                data.children[0].sliderValue, // 间据（航之间间距）
                data.children[1].sliderValue, // 航向间距
                data.children[2].sliderValue, // 高度
                data.text // 名称
            );
        },
        cese(data) {
            console.log(data);
            console.log(this.json);
        },
        checkAction(data, node) {
            if (node.checkedKeys.includes(data.id)) {
                this.$emit('select', data.id, true);
            } else {
                this.$emit('select', data.id, false);
            }
        },
        locate(data) {
            locate.call(this, data);
        },
        rename(data, id, text) {
            rename.call(this, data, id, text);
        },
        edit(data) {
            edit.call(this, data);
        },
        /**
         * @methods
         */
        drop(data) {
            console.log('删除删除');
            drop.call(this, data);
        },
        beginMoniFly(node, data) {
            console.log(node);
            console.log(data);
            // this.$emit("moniFly", data.id, data.positions);
        },
        /**清空 */
        removeAll() {
            this.$emit('clear'); // 清空  航线管理信息清空
            for (const ls of this.json) {
                ls.children.splice(0);
            }
            this.checked = [];
            this.$nextTick(() => {
                this.$refs.tree.setCheckedKeys([]);
            });
        },
        /**
         * @name:
         * @msg:
         * @param {*} type 如：线、多边形
         * @param {*} id
         * @param {*} name
         * @return {*}
         */
        insertLayer(type, id, name) {
            name = name || '未命名';
            this.json[type].children.push({
                id: id,
                text: name,
                icon: 'el-icon-document',
                type: this.json[type].type
                // edit:true, //是否可以编辑
            });
            this.checked.push(id);
            this.$nextTick(() => {
                this.$refs.tree.setCheckedKeys(this.checked);
            });
        },
        /**
         * @name:
         * @msg: 绘制完成获取到positions复制进去
         * @param {*} type
         * @param {*} id
         * @param {*} positions
         * @return {*}
         */
        editInsertLayer(type, id, positions) {
            if (this.json[type].type != 'polygon') {
                return;
            }
            // const index = this.checked.findIndex(item=>{return item==id})
            const index = this.json[type].children.findIndex((item) => {
                return item.id == id;
            });
            if (index >= 0) {
                this.json[type].children[index].positions = positions; // 添加 positions 属性
                this.json[type].children[index].children =
                    this.json[type].children[index].children || [];
                /**航线之间间距 */
                const treeDistanceSlider = {
                    id: id + '-slider', //+ "-slider"
                    slidershow: true,
                    sliderValue: parseFloat(this.sliderValueObj.spacing) || 20, // 设置 计算后的间距  headingSpacing spacing flyalt

                    sliderLable: '间距',
                    sliderTitle: '滑块:设置航线统一标距'
                };
                /**高度统一高度 */
                const treeHeightSlider = {
                    id: id + '-height', //+ "-height"
                    slidershow: true,
                    sliderValue: parseFloat(this.sliderValueObj.flyalt) || 40, // 设置计算后的 高度
                    sliderLable: '高度',
                    sliderTitle: ''
                };
                /**航向之间距 */
                const treeHeadingSpacingSlider = {
                    id: id + '-headingslider', //+ "-headingslider"
                    slidershow: true,
                    sliderValue: parseFloat(this.sliderValueObj.headingSpacing) || 20, // 设置 计算后的间距  headingSpacing spacing flyalt
                    sliderLable: '航向',
                    sliderTitle: '滑块:设置航向统一标距'
                }
                this.json[type].children[index].children[0] = treeDistanceSlider; // 滑块 设置航线之间间距
                this.json[type].children[index].children[1] = treeHeadingSpacingSlider; // 滑块 设置航线之间间距
                this.json[type].children[index].children[2] = treeHeightSlider; //滑块 设置高度

                this.checked.push(id);
                this.$nextTick(() => {
                    //   this.$refs.tree.append( treeDataForPreview,id) //追加
                    const childrenlist = this.json[type].children[index].children
                    console.log(childrenlist);
                    this.$refs.tree.updateKeyChildren(id, childrenlist);
                });
            }
        },
        exportHandler(cmd) {
            this.$emit('export', cmd);
        },
        importHandler(cmd) {
            this.$emit('import', cmd);
        },
        closeLayerManaer() {
            this.$emit('close');
        }
    }
};
</script>
<style lang='scss' scoped>
@import "../../../styles/default.scss";
.layer-manager-box {
    width: $draw-panel-width;
    background-color: $bg-color;
    color: $color;
    height: 400px;

    ::v-deep span {
        font-size: $font-size;
        display: inline-block;
        vertical-align: top;
    }
}

.graphic-draw-layer-manager-class {
    height: 328px;
    z-index: 99;
    // position: absolute;
    padding: $padding;
    border-radius: $b-radius;
    overflow: auto;
    background-color: $bg-color;

    ::v-deep .el-checkbox__inner {
        border: 1px solid $border-color;
    }

    ::v-deep .action-item {
        margin: $item-margin;

        &:hover {
            color: $hover-color !important;
        }
    }

    ::v-deep .action-class {
        right: 20px;
        position: absolute;
    }

    ::v-deep * {
        color: $color !important;
        background-color: $bg-color !important;
        font-size: $font-size !important;
    }
}

.layer-manager-tools {
    // width: $g-width;
    height: $item-height;
    line-height: $item-height;
    padding: $padding;

    .action-icon-class {
        margin: $item-margin;
        cursor: pointer;
        color: $color;

        &:hover {
            color: $hover-color;
        }

        span {
            color: $color;

            &:hover {
                color: $hover-color;
            }
        }
    }

    .el-dropdown {
        color: $color;
    }

    .action-icon-last-class {
        float: right;
        cursor: pointer;
        vertical-align: middle;
        display: inline-block;
        margin-right: 5px;
        color: $color;

        &:hover {
            color: $hover-color;
        }

        span {
            color: $color;

            &:hover {
                color: $hover-color;
            }
        }
    }
}

.layer-manager-header {
    height: $title-height;
    line-height: $title-height;
    border-bottom: 1px solid $devision-color;
    background-color: $bg-color;
    padding: $padding;
    color: $color;

    i {
        margin: $item-margin;
        color: $color;
    }

    span {
        color: $color;
    }
}

.el-input {
    width: 120px;
    display: inline-block;
    vertical-align: middle;
}

.custom-tree-node {
    display: flex;
    justify-content: center;
    align-items: center;
}
.slidershow {
    position: absolute;
    right: 20px;
    width: 180px;
}

::v-deep .slidershow .el-slider {
    .el-slider__runway {
        height: 3px;
        background-color: #e4e7ed !important;
        .el-slider__bar {
            height: 3px;
            background-color: #409eff !important;
        }
    }
}
::v-deep .el-slider__button-wrapper {
    height: 35px;
    width: 13px;
    .el-slider__button {
        width: 13px;
        height: 13px;
    }
}
</style>
<style lang='scss'>
@import "../../../styles/default.scss";
.layer-manager-handler-class {
    height: $item-height;
    line-height: $item-height;
    margin: 0 8px;
    float: right;
    color: $color;

    &:hover {
        color: $hover-color;
    }
}

.layer-manager-last-item {
    margin-right: 10px;
    color: $color;

    &:hover {
        color: $hover-color;
    }
}
.inputText {
    z-index: 8;
}
</style>
