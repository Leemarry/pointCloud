
<!-- 相机设置弹窗 -->
<template>
    <div class='cameraSettingsPop-up-in'>
        <!-- 航线配置《=》相机参数 -->
        <div class="route-camera">
            <el-tabs type="border-card">
                <el-tab-pane>
                    <span slot="label"><i class="el-icon-date" style="margin-right:3px"></i>
                        <label>航线配置</label></span>
                    <div>
                        <div class="configure-route-top">

                            <fieldset class="camera-choice">
                                <legend>
                                    <label>选型</label>
                                </legend>
                                <el-row :gutter="15" style="padding:15px">
                                    <el-col :span="14">
                                        <div>
                                            <label>相机型号</label><span class="prompt-red-Text" v-show="prompt.isVisableText">&nbsp;:&nbsp;{{prompt.text}}</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="10">
                                        <div>
                                            <!-- cameraParams -->
                                            <select v-model="selected" @change="handleChange">
                                                <option value="" disabled selected>请选择</option>
                                                <option v-for="option in cameraParams" :key="option.id" v-bind:value="option.type">
                                                    {{ option.type }}
                                                </option>
                                            </select>
                                            <!-- <select v-model="selected" @change="handleChange">
                                                <option value="" disabled selected>请选择</option>
                                                <option v-for="option in uavs" :key="option.uavId" v-bind:value="option.uavModel">
                                                    {{ option.uavName }}
                                                </option>
                                            </select> -->
                                        </div>
                                    </el-col>
                                    <el-col :span="14">
                                        <div>
                                            <label>飞行高度[米]</label>
                                        </div>

                                    </el-col>
                                    <el-col :span="10">
                                        <div>
                                            <input type="number" id="flyalt" disabled :value="flyalt" />
                                        </div>
                                    </el-col>
                                    <el-col :span="14">
                                        <div>
                                            <label>航向重叠率[%]</label>
                                        </div>
                                    </el-col>
                                    <el-col :span="10">
                                        <div>
                                            <input type="number" id="overlap" @input="updateTentacles('overlap',$event)" v-model="camerachoice.overlap" min="0" max="100" />
                                        </div>
                                    </el-col>
                                    <el-col :span="14">
                                        <div>
                                            <label>旁向重叠率[%]</label>
                                        </div>

                                    </el-col>
                                    <el-col :span="10">
                                        <div>
                                            <input type="number" id="sidelap" v-model="camerachoice.sidelap" min="0" max="100" />
                                        </div>
                                    </el-col>
                                    <el-col :span="14">
                                        <div>
                                            <label>相机安装倾角</label>
                                        </div>

                                    </el-col>
                                    <el-col :span="10">
                                        <div>
                                            <input type="number" id="campitch" v-model="camerachoice.campitch" min="10" max="180" />
                                        </div>
                                    </el-col>
                                    <el-col :span="14">
                                        <div>
                                            <label>航线外扩[米]</label>
                                        </div>

                                    </el-col>
                                    <el-col :span="10">
                                        <div>
                                            <input type="number" id="tentacles" v-model="camerachoice.tentacles" min="10" max="100" />
                                        </div>
                                    </el-col>
                                    <el-col :span="14">
                                        <div>
                                            <label>比例尺</label>
                                        </div>

                                    </el-col>
                                    <el-col :span="10">
                                        <div>
                                            <input type="number" id="blc" v-model="camerachoice.blc" />
                                        </div>
                                    </el-col>
                                    <el-col :span="14">
                                        <div>
                                            <label>基准面分辨率[米]</label>
                                        </div>

                                    </el-col>
                                    <el-col :span="10">
                                        <div>
                                            <input type="number" disabled id="fbl" v-model="camerachoice.fbl" />
                                        </div>
                                    </el-col>
                                    <el-col :span="14">
                                        <div>
                                            <label>航线间距[米]</label>
                                        </div>

                                    </el-col>
                                    <el-col :span="10">
                                        <div>
                                            <input type="number" disabled id="spacing" v-model="spacing" min="10" max="100" />
                                        </div>
                                    </el-col>
                                    <el-col :span="14">
                                        <div>
                                            <label>航向间距[米]</label>
                                        </div>
                                    </el-col>
                                    <el-col :span="10">
                                        <div>
                                            <input type="number" id="headingSpacing" disabled v-model="headingSpacing" min="10" max="100" />

                                        </div>
                                    </el-col>
                                </el-row>

                            </fieldset>

                            <!-- <fieldset class="route-Param">
                                <legend>
                                    <label>航测参数</label>
                                </legend>
                                <el-row :gutter="20" style="padding:15px">
                                    <el-col :span="16">
                                        <div>
                                            <label>航线角度[0-180]</label>
                                        </div>

                                    </el-col>
                                    <el-col :span="8">
                                        <div>
                                            <input type="number" id="tentacles" :value="tentacles" min="10" max="100" />
                                        </div>
                                    </el-col>
                                    <el-col :span="16">
                                        <div>
                                            <label>到达航点悬停时[秒]</label>
                                        </div>

                                    </el-col>
                                    <el-col :span="8">
                                        <div>
                                            <input type="number" id="tentacles" :value="tentacles" min="10" max="100" />
                                        </div>
                                    </el-col>
                                    <el-col :span="16">
                                        <div>
                                            <input type="checkbox" id="speed" name="speed" checked />
                                            <label for="speed">使用设置速度</label>
                                        </div>

                                    </el-col>
                                    <el-col :span="8">
                                        <div>
                                            <input type="number" id="tentacles" :value="tentacles" min="10" max="100" />
                                        </div>
                                    </el-col>
                                    <el-col :span="16">
                                        <div>
                                            <input type="checkbox" id="chaox" name="chaox" checked />
                                            <label for="chaox">固定机头朝向</label>
                                        </div>

                                    </el-col>
                                    <el-col :span="8">
                                        <div>
                                            <input type="number" id="tentacles" :value="tentacles" min="10" max="100" />
                                        </div>
                                    </el-col>
                                    <el-col :span="16">
                                        <div>
                                            <input type="checkbox" id="qif" name="qif" checked />
                                            <label for="qif">起飞指令</label>
                                        </div>

                                    </el-col>
                                    <el-col :span="8">
                                        <div>
                                            <input type="number" id="tentacles" :value="tentacles" min="10" max="100" />
                                        </div>
                                    </el-col>
                                    <el-col :span="16">
                                        <div>
                                            <input type="checkbox" id="fanh" name="fanh" checked />
                                            <label for="fanh">返航指令</label>
                                        </div>

                                    </el-col>
                                    <el-col :span="8">
                                        <div>
                                            <input type="number" id="tentacles" :value="tentacles" min="10" max="100" />
                                        </div>
                                    </el-col>
                                    <el-col :span="16">
                                        <div>
                                            <input type="checkbox" id="caoqian" name="caoqian" checked />
                                            <label for="caoqian">摄像头朝前</label>
                                        </div>

                                    </el-col>
                                    <el-col :span="8">
                                        <div>
                                            <input type="number" id="tentacles" :value="tentacles" min="10" max="100" />
                                        </div>
                                    </el-col>
                                    <el-col :span="16">
                                        <div>
                                            <input type="checkbox" id="pais" name="pais" checked />
                                            <label for="pais">拍摄影像</label>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div>
                                            <input type="number" id="tentacles" :value="tentacles" min="10" max="100" />
                                        </div>
                                    </el-col>
                                    <el-col :span="16">
                                        <div>
                                            <input type="radio" id="huey" name="drone" value="huey" checked />
                                            <label for="huey">定距拍照[米]</label>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div>
                                            <input type="number" id="tentacles" :value="tentacles" min="10" max="100" />
                                        </div>
                                    </el-col>
                                    <el-col :span="16">
                                        <div>
                                            <input type="radio" id="dewey" name="drone" value="dewey" />
                                            <label for="dewey">到点拍照</label>
                                        </div>

                                    </el-col>
                                    <el-col :span="8">
                                    </el-col>
                                </el-row>
                            </fieldset> -->
                        </div>
                        <div class="configure-route-bottom">

                        </div>
                    </div>
                </el-tab-pane>
                <!-- <el-tab-pane label="相机参数">相机参数</el-tab-pane> -->
            </el-tabs>
        </div>
        <!-- 任务信息 -->
        <!-- <fieldset class="taskInfo">
            <legend>任务信息</legend>
            <div style="padding:10px;font-size:12px">
                <div class="taskInfo-item">
                    <div class="task-item-text">区域面积</div>
                    <div class="task-item-num">0.11</div>
                </div>
                <div class="taskInfo-item">
                    <div class="task-item-text">总航程</div>
                    <div class="task-item-num">0.11</div>
                </div>
                <div class="taskInfo-item">
                    <div class="task-item-text">地面分辨率</div>
                    <div class="task-item-num">0.11</div>
                </div>
                <div class="taskInfo-item">
                    <div class="task-item-text">最小快门速度</div>
                    <div class="task-item-num">0.11</div>
                </div>
                <div class="taskInfo-item">
                    <div class="task-item-text">拍照间隔</div>
                    <div class="task-item-num">0.11</div>
                </div>
                <div class="taskInfo-item">
                    <div class="task-item-text">航线间距</div>
                    <div class="task-item-num">0.11</div>
                </div>
                <div class="taskInfo-item">
                    <div class="task-item-text">预计飞行时长</div>
                    <div class="task-item-num">0.11</div>
                </div>
                <div class="taskInfo-item">
                    <div class="task-item-text">拍照间隔时长</div>
                    <div class="task-item-num">0.11</div>
                </div>
                <div class="taskInfo-item">
                    <div class="task-item-text">转弯直径</div>
                    <div class="task-item-num">0.11</div>
                </div>
                <div class="taskInfo-item">
                    <div class="task-item-text">影像视角</div>
                    <div class="task-item-num">0.11</div>
                </div>
                <div class="taskInfo-item">
                    <div class="task-item-text">地面海拔高</div>
                    <div class="task-item-num">0.11</div>
                </div>
            </div>

        </fieldset> -->

    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { mapGetters } from 'vuex'
import cameraSeeting from "../cameraSetting/cameraSeeting";
// import cameraWebWorker from "../cameraSetting/camera.worker"
import cameraParams from "../cameraSetting/cameraParam";

import MappingUtil from "../cameraSetting/MappingUtil"; // 引入 MappingUtil 类
let cameraSettings = undefined;
export default {
    name: "",
    //import引入的组件需要注入到对象中才能使用
    components: {},
    data() {
        //这里存放数据
        return {
            /**发送 */
            timeFun: null,
            webworker: null,
            prompt: { text: "", isVisableText: false },
            cameraParams: [],
            options: {},
            camTowardFront: true, // 摄像头是否朝前，默认true
            flyalt: 0, //飞行高度
            headingSpacing: 0, // 航向间距
            spacing: 0, // 航线间距
            camerachoice: {
                focallen: 0, // 相机焦距
                sensorwidth: 0, // 传感器宽度，mm
                sensorheight: 0, // 传感器高度，mm
                imagewidth: 0, // 图片宽度，像素
                imageheight: 0, // 图片高度，像素
                campitch: 0, // 相机安装倾角，0-180度
                overlap: 30, //航向重叠率 ， 1-99
                sidelap: 30, // 旁向重叠率 ， 1-99
                fbl: 0, //  分辨率，根据比例尺计算得出。 dis
                blc: 1, // 比例尺，根据分辨率计算得出。一般根据比例尺去计算分辨率
            },
            selected: "A",
            tentacles: 5,
            value: "",
        };
    },
    //让组件接收外部传来的数据
    props: {
        uavs: {
            type: Array,
            default: function () {
                return {};
            },
        },
        defaultUavSn: String,
    },
    //监听属性 类似于data概念
    computed: {
        ...mapGetters([
            'userId',
            'name',
            'userInfo',
            'currentMid',
            'currentMidUnifiedHeight',
            'webSocketMsg',
            'webSocketData',
            'messageId',
        ])
    },
    //监控data中的数据变化
    watch: {
        camerachoice: {
            handler(newVal, oldVal) {
                this.calculate()
            },
            deep: true,
        },
    },
    //方法集合
    methods: {
        updateTentacles(param, event) {
            this.camerachoice[param] = Number(event.target.value);
        },
        /** 切换 相机参数 */
        handleChange(event) {
            this.calculate()
        },
        /**计算消息 */
        calculate() {
            const selectedModel = this.selected;
            // 在 cameraParams 数组中查找相应的相机
            const selectedCamera = cameraParams.find(
                (camera) => camera.type === selectedModel
            );
            // 如果找到相机，则输出它的参数，否则输出错误信息
            if (selectedCamera) {
                //整合 camerachoice 和 selectedCamera.params 放到 options
                this.options = Object.assign(
                    {},
                    this.camerachoice,
                    selectedCamera.params,
                    { camTowardFront: this.camTowardFront }
                );
                // campitch, focallen, sensorwidth, sensorheight, imagewidth, imageheight, blc, overlap, sidelap, camTowardFront
                // this.options={
                //     campitch:'15', focallen:'4.5', sensorwidth:'4.036', sensorheight:'5.37', imagewidth:4096, imageheight:2160,
                //     blc:1, overlap:50, sidelap:50, camTowardFront:true
                // }
                // [0.2048, 0.2724915758176413, 0.44112846457284705, 0.0001, 0.025230701464596415] new

                cameraSettings = new cameraSeeting(this.options);
                // // 调用 calculate 方法计算航线间距与旁向间距等数值
                const values = cameraSettings.calculate();
                this.spacing = (values[0] * 100).toFixed(2);
                this.headingSpacing = (values[1] * 100).toFixed(2);
                this.flyalt = (values[2] * 100).toFixed(2)

                // this.createWebWorker(this.options)
                this.prompt = { text: "", isVisableText: false };

                /**节流器 */
                this.sendSliderValue(this.spacing, this.headingSpacing, this.flyalt)
            } else {
                (this.prompt = { text: "型号查询失败", isVisableText: true }),
                    console.log(`找不到相机型号 '${selectedModel}'`);
                this.selected = "选择无人机";
            }


        },

        /**发送航线间距，航向间距与高度 */
        sendSliderValue(spacing = this.spacing, headingSpacing = this.headingSpacing, flyalt = this.flyalt) {
            if (this.timeFun) {
                clearTimeout(this.timeFun)
                this.timeFun = null;
            }
            this.timeFun = setTimeout(() => {
                this.$store.dispatch('publicData/setSliderValueObj', { spacing, headingSpacing, flyalt })  // 航线间距  航向间距 飞行高度
            }, 1000);

        },

        // createWebWorker(options) {
        //     this.webworker = new cameraWebWorker()
        //     this.webworker.onmessage = (event) => {
        //         let values = event.data;
        //         this.spacing = (values[0] * 100).toFixed(2);
        //         this.headingSpacing = (values[1] * 100).toFixed(2);
        //         this.flyalt = (values[2] * 100).toFixed(2)
        //         /**节流器 */
        //         this.sendSliderValue(this.spacing, this.headingSpacing, this.flyalt)
        //         // 关闭 Web Worker 线程
        //         this.webworker.terminate();
        //         this.webworker = null;
        //     }
        //     // 
        //     this.webworker.postMessage(options)

        // },
        /**input间距信息查询 */
        async MappingUtil() {
            try {
                //campitch, focallen, sensorwidth, sensorheight, imagewidth, imageheight, blc, overlap, sidelap, camTowardFront
                let formdata = new FormData();
                formdata.append("campitch", 15);
                formdata.append("focallen", 55);
                formdata.append("sensorwidth", 55);
                formdata.append("sensorheight", 8);
                formdata.append("imagewidth", 4096);
                formdata.append("imageheight", 2160);
                formdata.append("blc", 1);
                formdata.append("overlap", 50);
                formdata.append("sidelap", 50);
                formdata.append("camTowardFront", true);
                await this.$store
                    .dispatch("uavs/MappingUtil", formdata)
                    .then((response) => {
                        const { code, message, data } = response;
                        if (code === 1) {
                            console.log("data");
                            console.log(data);
                        }
                    })
                    .catch((error) => {
                        this.showMessage(error, "error");
                    });
            } catch (error) {
            }
        },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() { },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.cameraParams = cameraParams
        this.selected = cameraParams[0].type
        // let key = "defaultUav-" + this.userId;
        // this.selected = localStorage.getItem(key);

    },
    beforeCreate() { }, //生命周期 - 创建之前
    beforeMount() { }, //生命周期 - 挂载之前
    beforeUpdate() { }, //生命周期 - 更新之前
    updated() { }, //生命周期 - 更新之后
    beforeDestroy() {
        if (this.webworker) {
            this.webworker.terminate()
            this.webworker = null
        }

    }, //生命周期 - 销毁之前
    destroyed() { }, //生命周期 - 销毁完成
    activated() { }, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang='scss' scoped>
//@import url();
// #region 网格布局

.cameraSettingsPop-up-in {
    .route-camera {
        span {
            .el-icon-date {
            }
            label {
            }
        }
        div {
            .configure-route-top {
                .camera-choice {
                    legend {
                        label {
                        }
                    }
                    div {
                        label {
                        }
                        .prompt-red-Text {
                        }
                    }
                    div {
                        select {
                            option {
                            }
                        }
                    }
                    div {
                        label {
                        }
                    }
                    div {
                        #flyalt {
                        }
                    }
                    div {
                        label {
                        }
                    }
                    div {
                        #overlap {
                        }
                    }
                    div {
                        label {
                        }
                    }
                    div {
                        #sidelap {
                        }
                    }
                    div {
                        label {
                        }
                    }
                    div {
                        #campitch {
                        }
                    }
                    div {
                        label {
                        }
                    }
                    div {
                        #tentacles {
                        }
                    }
                    div {
                        label {
                        }
                    }
                    div {
                        #blc {
                        }
                    }
                    div {
                        label {
                        }
                    }
                    div {
                        input {
                        }
                    }
                    div {
                        label {
                        }
                    }
                    div {
                        input {
                        }
                    }
                    div {
                        label {
                        }
                    }
                    div {
                        #headingSpacing {
                        }
                    }
                }
                .route-Param {
                    legend {
                        label {
                        }
                    }
                    div {
                        label {
                        }
                    }
                    div {
                        #tentacles {
                        }
                    }
                    div {
                        label {
                        }
                    }
                    div {
                        #tentacles {
                        }
                    }
                    div {
                        #speed {
                        }
                        label {
                        }
                    }
                    div {
                        #tentacles {
                        }
                    }
                    div {
                        #chaox {
                        }
                        label {
                        }
                    }
                    div {
                        #tentacles {
                        }
                    }
                    div {
                        #qif {
                        }
                        label {
                        }
                    }
                    div {
                        #tentacles {
                        }
                    }
                    div {
                        #fanh {
                        }
                        label {
                        }
                    }
                    div {
                        #tentacles {
                        }
                    }
                    div {
                        #caoqian {
                        }
                        label {
                        }
                    }
                    div {
                        #tentacles {
                        }
                    }
                    div {
                        #pais {
                        }
                        label {
                        }
                    }
                    div {
                        #tentacles {
                        }
                    }
                    div {
                        #huey {
                        }
                        label {
                        }
                    }
                    div {
                        #tentacles {
                        }
                    }
                    div {
                        #dewey {
                        }
                        label {
                        }
                    }
                }
            }
            .configure-route-bottom {
            }
        }
    }
    .taskInfo {
        legend {
        }
        div {
            .taskInfo-item {
                .task-item-text {
                }
                .task-item-num {
                }
            }
            .taskInfo-item {
                .task-item-text {
                }
                .task-item-num {
                }
            }
            .taskInfo-item {
                .task-item-text {
                }
                .task-item-num {
                }
            }
            .taskInfo-item {
                .task-item-text {
                }
                .task-item-num {
                }
            }
            .taskInfo-item {
                .task-item-text {
                }
                .task-item-num {
                }
            }
            .taskInfo-item {
                .task-item-text {
                }
                .task-item-num {
                }
            }
            .taskInfo-item {
                .task-item-text {
                }
                .task-item-num {
                }
            }
            .taskInfo-item {
                .task-item-text {
                }
                .task-item-num {
                }
            }
            .taskInfo-item {
                .task-item-text {
                }
                .task-item-num {
                }
            }
            .taskInfo-item {
                .task-item-text {
                }
                .task-item-num {
                }
            }
            .taskInfo-item {
                .task-item-text {
                }
                .task-item-num {
                }
            }
        }
    }
}
// #endregion
.cameraSettingsPop-up-in {
    display: flex;

    .route-camera {
        flex: 3;
    }
    .taskInfo {
        flex: 1;
    }
}

::v-deep .configure-route-top {
    font-size: 13px;
    display: flex;
    // margin: 5px;
    .camera-choice {
        flex: 1;
        border: 1px solid #c4c7ce;
        margin: 5px;
        padding: 5px;
        background: #e7e8e6;
        select,
        input:not([type="checkbox"]):not([type="radio"]) {
            width: 70px;
            font-size: 10px;
            line-height: 13px;
            height: 20px;
        }
    }
    .route-Param {
        flex: 1;
        border: 1px solid #c4c7ce;
        margin: 5px;
        padding: 5px;
        background: #e7e8e6;

        input:not([type="checkbox"]):not([type="radio"]),
        select {
            width: 60px;
            font-size: 10px;
            line-height: 13px;
            height: 20px;
        }
    }
    input {
        border: 1px solid #c4c7ce;
    }

    /**ele */
    .el-col {
        margin: 3px 0px;
    }
}

::v-deep .taskInfo {
    border: #c4c7ce 1px solid;
    margin-left: 15px;
    color: #e7e8e6;
    .taskInfo-item {
        display: flex;
        justify-content: space-around;
        margin: 5px 0px 0px 5px;
        .task-item-text {
            flex: 1;
            margin-bottom: 5px;
        }
    }

    .taskInfo-item:first-of-type {
        margin-top: 20px;
    }
}

/**提示：请选择 */
.prompt-red-Text {
    color: red;
    font-size: 10px;
    line-height: 13px;
}
// ::v-deep .configure-route-top .el-input__inner {
//     background-color: transparent !important;
//     border-color: #555555;
//     -webkit-box-shadow: 1px 1px 5px 1px RGB(128, 255, 255, 0.1) inset;
//     box-shadow: 1px 1px 5px 1px RGB(128, 255, 255, 0.1) inset;
//     height: 30px;
//     width: 95px;
// }
</style>