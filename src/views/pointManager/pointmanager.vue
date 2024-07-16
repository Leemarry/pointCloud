<!--
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2023-11-20 18:36:21
 * @LastEditors: Andy
 * @LastEditTime: 2023-11-23 16:08:52
 border: 1px solid #eee;
-->
<!--  -->
<template>
    <el-container style="width: 100%;height: 100%;">
        <el-aside class="uavManagerAside-components" style="background-color: rgb(238, 241, 246);height: 100%;width: 300px; margin-left: -1px ">
            <PointManagerleftAside></PointManagerleftAside>
        </el-aside>
        <el-main class="cesium-components" style="height:100%;">
            <CesiumMap></CesiumMap>
        </el-main>
        <el-aside class="PointManagerAside-components " style="background-color: rgb(238, 241, 246);height: 100% ;width: 300px;;margin-right: -1px ">
            <div class="right-aside">
                <div class="but-list">
                    <el-button round v-for="(item, index) in mergedTools" :key="index" :icon="item.icon" @click="item.action">{{item.text}}</el-button>
                </div>
                <div class="coordinateinfo">
                    <div class="msg">
                        坐标信息
                    </div>
                    <div class="coordinate">
                        <el-row>
                            <el-col :span="12">
                                <div class="coordinateMsg">坐标编号</div>
                                <div class="coordinateValue">P1</div>
                            </el-col>
                            <el-col :span="12">
                                <div class="coordinateMsg">坐标编号</div>
                                <div class="coordinateValue">P1</div>
                            </el-col>
                            <el-col :span="12">
                                <div class="coordinateMsg">坐标编号</div>
                                <div class="coordinateValue">P1</div>
                            </el-col>
                            <el-col :span="12">
                                <div class="coordinateMsg">坐标编号</div>
                                <div class="coordinateValue">P1</div>
                            </el-col>
                        </el-row>
                    </div>
                </div>

            </div>
        </el-aside>
    </el-container>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import CesiumMap from "../components/Cesium/CesiumMap.vue";
// flymanager PointManagerAsinde
import PointManagerleftAside from "../components/flymanager/flymanager.vue";
import MyModule from "./myModule.js";
var myModuleInstance;
export default {
    name: "",
    //import引入的组件需要注入到对象中才能使用
    components: {
        CesiumMap,
        PointManagerleftAside,
    },
    data() {
        //这里存放数据
        return {
            uavControlBtn: {},
            defaultTools: {
                importWaypoints: {
                    text: "导入航点",
                    icon: "el-icon-plus",
                    action: this.importWaypoints,
                },
                addRoutes: {
                    text: "航线规划",
                    icon: "el-icon-plus",
                    action: this.addRoutes,
                },
                multiMachineImport: {
                    text: "多机导入",
                    icon: "el-icon-plus",
                    action: this.multiMachineImport,
                },
                loadingStatus: {
                    text: "载仓状态",
                    icon: "el-icon-plus",
                    action: this.loadingStatus,
                },
            },
        };
    },
    //让组件接收外部传来的数据
    props: {
        ClickTools: {
            default: null,
        },
    },
    //监听属性 类似于data概念
    computed: {
        mergedTools() {
            // return Object.assign({}, this.defaultClickTools, this.ClickTools);
            return Object.assign({}, this.defaultTools, this.ClickTools);
        },
    },
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
        async importWaypoints() {
            // 实现导入航点的逻辑
            this.changeuavControlBtn(true);
            try {
                await this.$store
                    .dispatch("uav/importWaypoints")
                    .then((response) => {
                        this.changeuavControlBtn(false);
                        const { code, message, data } = response;
                        if (code === 1) {
                        } else {
                            this.showMessage(message, "warning");
                        }
                    })
                    .catch((error) => {
                        this.changeuavControlBtn(false);
                        this.showMessage(error, "error");
                    });
            } catch (error) {
                setTimeout(() => {
                    this.changeuavControlBtn(false);
                }, 3000);
            }
        },
        async addRoutes() {
            // 实现航线规划的逻辑
            this.changeuavControlBtn(true);
            try {
                await this.$store
                    .dispatch("uav/importWaypoints")
                    .then((response) => {
                        this.changeuavControlBtn(false);
                        const { code, message, data } = response;
                        if (code === 1) {
                        } else {
                            this.showMessage(message, "warning");
                        }
                    })
                    .catch((error) => {
                        this.changeuavControlBtn(false);
                        this.showMessage(error, "error");
                    });
            } catch (error) {
                setTimeout(() => {
                    this.changeuavControlBtn(false);
                }, 3000);
            }
        },
        async multiMachineImport() {
            // 实现多机导入的逻辑
            this.changeuavControlBtn(true);
            try {
                await this.$store
                    .dispatch("uav/importWaypoints")
                    .then((response) => {
                        this.changeuavControlBtn(false);
                        const { code, message, data } = response;
                        if (code === 1) {
                        } else {
                            this.showMessage(message, "warning");
                        }
                    })
                    .catch((error) => {
                        this.changeuavControlBtn(false);
                        this.showMessage(error, "error");
                    });
            } catch (error) {
                setTimeout(() => {
                    this.changeuavControlBtn(false);
                }, 3000);
            }
        },
        async loadingStatus() {
            // 实现载仓状态的逻辑
            this.changeuavControlBtn(true);
            try {
                await this.$store
                    .dispatch("uav/importWaypoints")
                    .then((response) => {
                        this.changeuavControlBtn(false);
                        const { code, message, data } = response;
                        if (code === 1) {
                        } else {
                            this.showMessage(message, "warning");
                        }
                    })
                    .catch((error) => {
                        this.changeuavControlBtn(false);
                        this.showMessage(error, "error");
                    });
            } catch (error) {
                setTimeout(() => {
                    this.changeuavControlBtn(false);
                }, 3000);
            }
        },
        /**按钮 */
        changeuavControlBtn(isdisabled) {
            if (isdisabled) {
                this.uavControlBtn = {
                    disabled: isdisabled,
                    disabledtitle: "执行中",
                };
            } else {
                this.uavControlBtn = {
                    disabled: isdisabled,
                    disabledtitle: "",
                };
            }
        },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        myModuleInstance = new MyModule();
        this.defaultClickTools = myModuleInstance.defaultClickTools;
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {},
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
::v-deep .el-container {
    width: 100%;
    height: 100%;
}
::v-deep .el-main {
    padding: 0px;
}
// ::v-deep el-
.but-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    .el-button {
        margin: 10px;
        width: 50%;
    }
}
.PointManagerAside-components{
  display: flex;
  align-items: center;
  .right-aside {
    .coordinateinfo {
        margin-top: 30px;
        padding: 10px;
        text-align: center;
        .msg {
            padding: 10px;
        }
        .coordinate {
            padding: 10px;
            .coordinateMsg {
                padding: 10px;
            }
        }
    }
}
}

</style>