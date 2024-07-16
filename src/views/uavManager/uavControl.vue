<!--
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2023-11-21 11:42:00
 * @LastEditors: likai 2806699104@qq.com
 * @LastEditTime: 2024-07-05 16:37:45
-->
<!-- 控制台 -->
<template>
    <div class="uavControl">
        <div class="container">
            <div class="item1-0">
                <div class="item-Bot">
                    <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle :`逆旋转:${slidervalue}°`" class="blackCircleButton" icon="el-icon-refresh-left" @click="moveUav(1121,1)"></el-button>
                </div>                
            </div>
            <div class="itrm 前">
                <div class="item-Bot">
                    <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle : '前'" class="blackCircleButton" icon="el-icon-top" @click="moveUav(1115)"></el-button>
                </div>
            </div>
            <div class="a-nR60q-0">
                <div class="item-Bot">
                    <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle :`顺旋转:${slidervalue}°`" class="blackCircleButton" icon="el-icon-refresh-right" @click="moveUav(1121,0)"></el-button>
                </div>   
            </div>
            <div class="a-r2Vrx-1">
                <div class="slider">
                    <!-- calcdistance(slidervalue) -->
                    <el-slider v-model="slidervalue" vertical height="200px" :max="500"> </el-slider> <span v-if="ischangeSlidervalue" @click="changeSlidervalue">{{slidervalue}}</span>
                    <div v-else id="slidervalue">
                        <!-- @keyup.enter.native="summitSlidervalue(data)" -->
                        <input type="number" name="slidervalue" min="0" v-model="slidernum"  max="500"   @keyup.enter="summitSlidervalue(slidernum)" />
                    </div>
                </div>
            </div>
            <div class="a-gpMOj-0">
                <div class="item-Bot">
                    <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle : '起飞'" class="blackCircleButton" icon="el-icon-position" @click="executeTakeoff()"></el-button>
                </div>
            </div>
            <div class="a-K89Nj-0">
                <div class="item-Bot">
                    <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle : '点击开始缩放 -'" class="blackCircleButton" icon="el-icon-minus" @click="doCommand(1171, 0, 3, 0, 0)"></el-button>

                </div>
            </div>
            <div class="a-vQLyB-0">
                <div class="item-Bot">
                    <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle : '停止缩放'" class="blackCircleButton" icon="el-icon-thumb" @click="doCommand(1172, 0, 0, 0, 0)"></el-button>
                </div>
            </div>
            <div class="a-A6KzG-0">
                <div class="item-Bot">
                    <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle : '点击开始缩放 +'" class="blackCircleButton" icon="el-icon-plus" @click="doCommand(1171, 1, 3, 0, 0)"></el-button>
                </div>
            </div>
            <div class="a-NOWgm-1">
                <div style="width:10px"></div>
            </div>
            <div class="a-GRWJO-0">
                <div class="item-Bot">
                    <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle : '指点到下一点'" class="blackCircleButton" @click="nextWork()">下一作业点</el-button>

                </div>
            </div>
            <div class="item1-left">
                <div class="item-Bot">
                    <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle : '左'" class="blackCircleButton" icon="el-icon-back" @click="moveUav(1117)"></el-button>
                </div>
            </div>
            <div class="a-Rljmq-1">
                <div class="item-Bot">
                    <!-- sendCommandToWebsocketThread(1153, 0, 0, 0, 5)  -->
                    <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle : (roateType ? '已设置自旋' : '已设置正北角度')" class="blackCircleButton" icon="el-icon-refresh" circle @click="settingRoate()"></el-button>

                </div>
            </div>
            <div class="a-nR60q-1">
                <div class="item-Bot">
                    <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle : '右'" class="blackCircleButton" icon="el-icon-right" @click="moveUav(1118)"></el-button>

                </div>
            </div>
            <div class="a-gpMOj-1">
                <div class="item-Bot">
                    <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle : '上升'" class="blackCircleButton" icon="el-icon-upload2" @click="moveUav(1119)"></el-button>

                </div>
            </div>
            <div class="a-K89Nj-1"></div>
            <div class="a-vQLyB-1">
                <div class="item-Bot">
                    <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle : '相机设置'" class="blackCircleButton" icon="el-icon-s-tools" @click="clickCameraSetting"></el-button>

                </div>
            </div>
            <div class="a-A6KzG-1"></div>
            <div class="a-GRWJO-1">
                <div class="item-Bot">
                    <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle : '执行返航'" class="blackCircleButton" @click="finishWrok()">作业完毕</el-button>

                </div>
            </div>
            <div class="item-0"></div>
            <div class="a-Rljmq-2">
                <div class="item-Bot">
                    <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle : '后'" class="blackCircleButton" icon="el-icon-bottom" @click="moveUav(1116)"></el-button>
                </div>
            </div>
            <div class="a-nR60q-2"></div>
            <div class="a-gpMOj-2">
                <div class="item-Bot">
                    <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle : '下降'" class="blackCircleButton" icon="el-icon-download" @click="moveUav(1120)"></el-button>

                </div>
            </div>
            <div class="a-K89Nj-2">
                <div class="item-Bot">
                    <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle !=null  ? uavControlBtn.disabledtitle : '拍照'" class="blackCircleButton" icon="el-icon-camera-solid" @click="doCommand(1162, 0, 0, 0, 0)"></el-button>

                </div>

            </div>
            <div class="a-vQLyB-2">
                <div class="item-Bot">
                    <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle !=null  ? uavControlBtn.disabledtitle : '开始录像'" class="blackCircleButton" icon="el-icon-video-camera-solid" @click="doCommand(1163, 0, 0, 0, 0)"></el-button>

                </div>

            </div>
            <div class="a-A6KzG-2">
                <div class="item-Bot">
                    <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle !=null ? uavControlBtn.disabledtitle : '停止录像'" class="blackCircleButton" icon="el-icon-video-camera-solid" @click="doCommand(1164, 0, 0, 0, 0)"></el-button>

                </div>

            </div>
            <div class="a-GRWJO-2">
                <div class="item-Bot">
                    <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle !=null ? uavControlBtn.disabledtitle : '播种'" class="blackCircleButton" @click="startWork()">F5：投种</el-button>

                </div>

            </div>
            <div class="a-Br9AJ-0">
                <div style="height:10px; display: flex; "   >
                   经度：<input type="number" v-model="lng" style="width: 18%;height: 20px;">
                   纬度：<input type="number" v-model="lat" style="width: 18%;height: 20px;">
                   高度：<input type="number" v-model="alt" style="width: 18%;height: 20px;">
                   <el-button type='samll' @click='flyToHere'>指点</el-button>
                   <el-button type='samll' @click='clearInfo'>清空</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { debounce } from 'lodash';
import { mapGetters } from 'vuex'
export default {
    name: "",
    //import引入的组件需要注入到对象中才能使用
    components: {},
    data() {
        //这里存放数据
        return {
            lng:'114.4703352', // (114.46872,30.46021) 114.4703352
            lat:'30.4607416',
            alt:'20',
            roateType:false,
            slidernum:'',
            ischangeSlidervalue: true,
            slidervalue: 5,
            // disabled:false,
            isDialogCameraSetting: false,
        };
    },
    //让组件接收外部传来的数据
    props: {
        uavControlBtn: {
            type: Object,
            default: function () {
                return {
                    disabled: false,
                    disabledtitle: null,
                };
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
            'defaultUavHeartbeat',
        ])
    },
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
        showToast(msg) {
            this.$layer.msg(msg);
        },
        showMessage(msg, type) {
            this.$message({
                message: msg,
                type: type,
            });
        },
        // nextWork() {
        //     this.$emit("sendnextwork");
        // },
        flyToHere(){
            this.$emit("sendflyToHere",{lng:this.lng,lat:this.lat,alt:this.alt});
        },
        clearInfo(){

        },
        //#region
        /**无人机控制 1121自旋 角度，00.1度 1-逆时针 0顺时针 ，角度0相对角度 1以正北wei0的角度  参数角度 */
        async moveUav(type,rotation=null) {
            this.$emit("sendmoveUav", { type, slidervalue: this.slidervalue ,rotation:rotation,roateType:this.roateType ? 0 : 1 }); // rotation旋转方向
        },
        settingRoate(){
            this.roateType = !this.roateType
            this.showMessage('旋转方向：'+(this.roateType ? '已设置自旋' : '已设置正北角度'),'success')
        },
        /**执行起飞 */
        executeTakeoff() {
            this.$emit("sendexecuteTakeoff")
        },

        sendCommandToWebsocketThread(command, parm1, parm2, parm3, parm4) {
            this.$emit(
                "sendcontrolTosendCommand",
                command,
                parm1,
                parm2,
                parm3,
                parm4
            );
        },
        /**相机云台 */
        doCommand(command, p1, p2, p3, p4, timeout) {
            this.$emit("senddocommand", command, p1, p2, p3, p4, timeout);
        },
        /**下一次投放 */
        nextWork() {
            this.$emit("sendnextwork");
        },
        /**作业完毕 */
        finishWrok() {
            this.$emit("sendfinishwork");
        },
        /**投放按键*/
        startWork() {
            // this.$emit("sendstartwork");
            this.sendthrowObject()
        },
        /**f5投放 sendthrowObject */
        sendthrowObject() {
            this.$emit("sendthrowObject")
        },
        //#endregion
        // #region --------------------------------------------------------- 组件传递 ---------------------------------------------------------
        clickCameraSetting() {
            this.$emit("sengcamerasetting", true);
        },

        calcdistance(distance) {
            if (distance === 0) return '0 m';
            if (distance >= 10) {
                return (distance / 100).toFixed(1) + '' + 'm'
            } else {
                return distance + 'cm'
            }
        },
        //#endregion

        changeSlidervalue() {
            this.ischangeSlidervalue = !this.ischangeSlidervalue
        },
        summitSlidervalue(data){
            this.slidervalue= parseInt(data) 
            this.ischangeSlidervalue = !this.ischangeSlidervalue
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() { },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() { },
    beforeCreate() { }, //生命周期 - 创建之前
    beforeMount() { }, //生命周期 - 挂载之前
    beforeUpdate() { }, //生命周期 - 更新之前
    updated() { }, //生命周期 - 更新之后
    beforeDestroy() { }, //生命周期 - 销毁之前
    destroyed() { }, //生命周期 - 销毁完成
    activated() { }, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.uavControl {
    .container {
        display: grid;
        width: 100%;
        height: 100%;
        grid-template-areas:
            "item1-0 itrm a-nR60q-0 a-r2Vrx-1 a-gpMOj-0  a-K89Nj-0 a-vQLyB-0 a-A6KzG-0 a-NOWgm-1 a-GRWJO-0"
            "item1-left a-Rljmq-1 a-nR60q-1 a-r2Vrx-1 a-gpMOj-1  a-K89Nj-1 a-vQLyB-1 a-A6KzG-1 a-NOWgm-1 a-GRWJO-1"
            "item-0 a-Rljmq-2 a-nR60q-2 a-r2Vrx-1 a-gpMOj-2  a-K89Nj-2 a-vQLyB-2 a-A6KzG-2 a-NOWgm-1 a-GRWJO-2"
            "a-Br9AJ-0 a-Br9AJ-0 a-Br9AJ-0 a-Br9AJ-0 a-Br9AJ-0 a-Br9AJ-0 a-Br9AJ-0 a-Br9AJ-0 a-Br9AJ-0 a-Br9AJ-0";
        grid-template-columns: 1fr 1fr 1fr 0.5fr 1fr 0.8fr 0.8fr 0.8fr 0.4fr 1.2fr;
        grid-template-rows: 1fr 01fr 1fr 0.4fr;
    }
    .container > div {
        border: 1px dashed #888;
    }

    .item1-0 {
        grid-area: item1-0;
    }
    .itrm {
        grid-area: itrm;
    }
    .a-nR60q-0 {
        grid-area: a-nR60q-0;
    }
    .a-r2Vrx-1 {
        grid-area: a-r2Vrx-1;
    }
    .a-gpMOj-0 {
        grid-area: a-gpMOj-0;
    }
    .a-K89Nj-0 {
        grid-area: a-K89Nj-0;
    }
    .a-vQLyB-0 {
        grid-area: a-vQLyB-0;
    }
    .a-A6KzG-0 {
        grid-area: a-A6KzG-0;
    }
    .a-NOWgm-1 {
        grid-area: a-NOWgm-1;
    }
    .a-GRWJO-0 {
        grid-area: a-GRWJO-0;
    }
    .item1-left {
        grid-area: item1-left;
    }
    .a-Rljmq-1 {
        grid-area: a-Rljmq-1;
    }
    .a-nR60q-1 {
        grid-area: a-nR60q-1;
    }
    .a-gpMOj-1 {
        grid-area: a-gpMOj-1;
    }
    .a-K89Nj-1 {
        grid-area: a-K89Nj-1;
    }
    .a-vQLyB-1 {
        grid-area: a-vQLyB-1;
    }
    .a-A6KzG-1 {
        grid-area: a-A6KzG-1;
    }
    .a-GRWJO-1 {
        grid-area: a-GRWJO-1;
    }
    .item-0 {
        grid-area: item-0;
    }
    .a-Rljmq-2 {
        grid-area: a-Rljmq-2;
    }
    .a-nR60q-2 {
        grid-area: a-nR60q-2;
    }
    .a-gpMOj-2 {
        grid-area: a-gpMOj-2;
    }
    .a-K89Nj-2 {
        grid-area: a-K89Nj-2;
    }
    .a-vQLyB-2 {
        grid-area: a-vQLyB-2;
    }
    .a-A6KzG-2 {
        grid-area: a-A6KzG-2;
    }
    .a-GRWJO-2 {
        grid-area: a-GRWJO-2;
    }
    .a-Br9AJ-0 {
        grid-area: a-Br9AJ-0;
    }
}

.slider {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: space-around;
    align-items: center;
}
::v-deep .item-Bot {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .el-button {
        margin: 5px;
    }
}
.item1-2-bon {
    display: flex;
    flex-direction: column;
}

#slidervalue {
    input {
        width: 35px;
    }
    input[type="number"] {
        -moz-appearance: textfield;
    }
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
}
</style>