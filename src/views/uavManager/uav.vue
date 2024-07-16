<!--
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2023-11-21 11:42:00
 * @LastEditors: Andy
 * @LastEditTime: 2023-12-14 15:01:08
-->
<!-- 控制台 -->
<template>
    <div class="uavControl">
        <div class="gird-container">
            <div class="item1-0"></div>
            <div class="item1-1 item1-top">
                <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle : '前'" class="blackCircleButton" icon="el-icon-top" @click="moveUav(1115)"></el-button>
                <!--  @mousedown.native="sendCommandToWebsocketThread(1153, 0, 2, 0, 0)" @mouseup.native="sendCommandToWebsocketThread(1153, 0, 0, 0, 0)" -->
            </div>
            <div class="item1-2"></div>
            <div class="a-A6KOj">
                <div class="item1-2-bon">
                    <div>
                        <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle : '起飞'" class="blackCircleButton" icon="el-icon-top" @click="guidToHere()"></el-button>
                    </div>
                    <div>
                        <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle : '上升'" class="blackCircleButton" icon="el-icon-upload2" @click="moveUav()"></el-button>
                    </div>
                    <div>
                        <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle : '下降'" class="blackCircleButton" icon="el-icon-download" @click="moveUav()"></el-button>
                    </div>
                    <div>
                        <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle : '调节'" class="blackCircleButton" icon="el-icon-s-promotion" @click="moveUav()"></el-button>
                    </div>
                </div>

            </div>
            <div class="item2-0 item2-top-left">
                <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle : '点击开始缩放 -'" class="blackCircleButton" icon="el-icon-minus" @click="doCommand(1171, 0, 3, 0, 0)"></el-button>
            </div>
            <div class="item2-1 item2-top-center">
                <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle : '停止缩放'" class="blackCircleButton" icon="el-icon-thumb" @click="doCommand(1172, 0, 0, 0, 0)"></el-button>
            </div>
            <div class="item2-2 item2-+">
                <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle : '点击开始缩放 +'" class="blackCircleButton" icon="el-icon-plus" @click="doCommand(1171, 1, 3, 0, 0)"></el-button>
            </div>
            <div class="a-oZXJp"></div>
            <div class="item3-0">
                <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle : ''" class="blackCircleButton" @click="nextWork()">下一作业点</el-button>
            </div>
            <div class="item1-3 item1-left">
                <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle : ''" class="blackCircleButton" icon="el-icon-back" @click="moveUav(1117)"></el-button>
            </div>
            <div class="item1-4 item1-center">
                <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle : ''" class="blackCircleButton" icon="el-icon-rank" circle @click="sendCommandToWebsocketThread(1153, 0, 0, 0, 5)"></el-button>
            </div>
            <div class="item1-5 item1-right">
                <!-- <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle : ''" class="blackCircleButton" icon="el-icon-right" @mousedown.native="sendCommandToWebsocketThread(1153, 0, 0, 2, 0)" @mouseup.native="sendCommandToWebsocketThread(1153, 0, 0, 0, 0)"></el-button> -->
                <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle : '右'" class="blackCircleButton" icon="el-icon-right" @click="moveUav(1118)"></el-button>
            </div>
            <div class="item2-3"></div>
            <div class="item2-4 item2-center-center">
                <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle : '相机设置'" class="blackCircleButton" icon="el-icon-s-tools" @click="clickCameraSetting"></el-button>
            </div>
            <div class="item2-5"></div>
            <div class="item3-1">
                <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle : ''" class="blackCircleButton" @click="finishWrok()">作业完毕</el-button>
            </div>
            <div class="item1-6"></div>
            <div class="item1-7 item1-bottom">
                <!-- <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle !=null  ? uavControlBtn.disabledtitle : ''" class="blackCircleButton" icon="el-icon-bottom" @mousedown.native="sendCommandToWebsocketThread(1153, 0, -2, 0, 0)" @mouseup.native="sendCommandToWebsocketThread(1153, 0, 0, 0, 0)"></el-button> -->

                <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle ? uavControlBtn.disabledtitle : '后'" class="blackCircleButton" icon="el-icon-bottom" @click="moveUav(1116)"></el-button>
            </div>
            <div class="item1-8"></div>
            <div class="item2-6 item2-bottom-left">
                <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle !=null  ? uavControlBtn.disabledtitle : '拍照'" class="blackCircleButton" icon="el-icon-camera-solid" @click="doCommand(1162, 0, 0, 0, 0)"></el-button>
            </div>
            <div class="item2-7 item2-bottom-center">
                <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle !=null  ? uavControlBtn.disabledtitle : '开始录像'" class="blackCircleButton" icon="el-icon-video-camera-solid" @click="doCommand(1163, 0, 0, 0, 0)"></el-button>
            </div>
            <div class="item2-8 item2-bottom-rirht">
                <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle !=null ? uavControlBtn.disabledtitle : '停止录像'" class="blackCircleButton" icon="el-icon-video-camera-solid" @click="doCommand(1164, 0, 0, 0, 0)"></el-button>
            </div>
            <div class="item3-2">
                <el-button :disabled='uavControlBtn.disabled' :title="uavControlBtn.disabledtitle !=null ? uavControlBtn.disabledtitle : ''" class="blackCircleButton" @click="startWork()">F5：投种</el-button>
            </div>
            <div class="footer-0"></div>
            <div class="a-RljB2-3"></div>
            <div class="a-Og69V-3"></div>
            <div class="footer-1"></div>
            <div class="a-DqWEp-3"></div>
            <div class="a-lRE6j-3"></div>
            <div class="a-J8WXG-5"></div>
        </div>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
    name: "",
    //import引入的组件需要注入到对象中才能使用
    components: {},
    data() {
        //这里存放数据
        return {
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
    computed: {},
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
        //#region 

        /**无人机控制 */
        async moveUav(type) {
            console.log(type);
            // this.changeuavControlBtn(true);
            try {
                let formdata = new FormData();
                formdata.append("uavId", this.defaultUavSn);
                formdata.append("type", type);
                formdata.append("distance", 0.01);
                await this.$store
                    .dispatch("uavs/moveUav",formdata)
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
        /**飞往某个航点 */
        async guidToHere(){
            // this.changeuavControlBtn(true);
            try {
                let formdata = new FormData();
                formdata.append("uavId", this.defaultUavSn);
                formdata.append("lat", '30.4501257');
                formdata.append("lng", '114.4693146');
                formdata.append("alt",10)
                await this.$store
                    .dispatch("uavs/guidToHere",formdata)
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
            this.$emit("sendstartwork");
        },
                //#endregion
        // #region --------------------------------------------------------- 组件传递 ---------------------------------------------------------
        clickCameraSetting() {
            this.$emit("sengcamerasetting", true);
        },
        //  isDialogCameraSetting

        //#endregion
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {},
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
.uavControl {
    .gird-container {
        display: grid;
        width: 100%;
        height: 100%;
        grid-template-areas:
            "item1-0 item1-1 item1-2 a-A6KOj item2-0 item2-1 item2-2 a-oZXJp item3-0"
            "item1-3 item1-4 item1-5 a-A6KOj item2-3 item2-4 item2-5 a-oZXJp item3-1"
            "item1-6 item1-7 item1-8 a-A6KOj item2-6 item2-7 item2-8 a-oZXJp item3-2"
            "footer-0 a-RljB2-3 a-Og69V-3 a-A6KOj footer-1 a-DqWEp-3 a-lRE6j-3 a-oZXJp a-J8WXG-5";
        grid-template-columns: 1fr 1fr 1fr 1fr 0.8fr 0.8fr 0.8fr 0.2fr 1.2fr;
        grid-template-rows: 1fr 1fr 1fr 5px;

        div {
            border: 1px dashed #888;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .blackCircleButton {
            width: 85%;
            height: 60%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        [class^="item1-"] .blackCircleButton {
            font-size: 25px;
        }
        [class^="item2-"] .blackCircleButton {
            font-size: 18px;
        }
        .item1-0 {
            grid-area: item1-0;
        }
        .item1-1 {
            grid-area: item1-1;
        }
        .item1-2 {
            grid-area: item1-2;
        }
        .a-A6KOj {
            grid-area: a-A6KOj;
        }
        .item2-0 {
            grid-area: item2-0;
        }
        .item2-1 {
            grid-area: item2-1;
        }
        .item2-2 {
            grid-area: item2-2;
        }
        .a-oZXJp {
            grid-area: a-oZXJp;
        }
        .item3-0 {
            grid-area: item3-0;
        }
        .item1-3 {
            grid-area: item1-3;
        }
        .item1-4 {
            grid-area: item1-4;
        }
        .item1-5 {
            grid-area: item1-5;
        }
        .item2-3 {
            grid-area: item2-3;
        }
        .item2-4 {
            grid-area: item2-4;
        }
        .item2-5 {
            grid-area: item2-5;
        }
        .item3-1 {
            grid-area: item3-1;
        }
        .item1-6 {
            grid-area: item1-6;
        }
        .item1-7 {
            grid-area: item1-7;
        }
        .item1-8 {
            grid-area: item1-8;
        }
        .item2-6 {
            grid-area: item2-6;
        }
        .item2-7 {
            grid-area: item2-7;
        }
        .item2-8 {
            grid-area: item2-8;
        }
        .item3-2 {
            grid-area: item3-2;
        }
        .footer-0 {
            grid-area: footer-0;
        }
        .a-RljB2-3 {
            grid-area: a-RljB2-3;
        }
        .a-Og69V-3 {
            grid-area: a-Og69V-3;
        }
        .footer-1 {
            grid-area: footer-1;
        }
        .a-DqWEp-3 {
            grid-area: a-DqWEp-3;
        }
        .a-lRE6j-3 {
            grid-area: a-lRE6j-3;
        }
        .a-J8WXG-5 {
            grid-area: a-J8WXG-5;
        }
    }
}
.item1-2-bon {
    display: flex;
    flex-direction: column;
}
</style>