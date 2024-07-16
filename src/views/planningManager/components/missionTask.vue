<!--
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2024-03-18 15:05:38
 * @LastEditors: Andy
 * @LastEditTime: 2024-03-19 16:29:48
-->
<template>
    <div>
      <!--  @close="onClose" -->
        <el-dialog v-bind="$attrs" v-on="$listeners" :visible.sync="outerVisible" @open="onOpen"  @close="onClose">
            <template slot="title">
                上传航点任务给补种无人机参数设置
                <!-- <el-tooltip class="item" effect="dark" content="Right Top 提示文字" placement="right-start">
                    <i class="el-icon-warning" style="color:#e6a23c"></i>
                </el-tooltip> -->
                <i class="el-icon-warning" style="color:#e6a23c" :title="dynamicTitle"></i>
            </template>
            <el-row :gutter="15">
                <el-form ref="missionTask" :model="missionTask" :rules="rules" size="mini" label-width="100px">
                    <el-col :span="24">
                        <el-form-item label="任务类型" prop="missionType">
                            <el-radio-group v-model="missionTask.missionType" size="medium">
                                <el-radio v-for="(item, index) in missionTypeOptions" :key="index" :label="item.value" :disabled="item.disabled">{{item.label}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <el-form-item label="飞行速度" prop="speed">
                            <el-input-number v-model="missionTask.speed" placeholder="请输入飞行速度" :step='1'></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="开启设置" prop="isOpen" required>
                            <el-switch v-model="missionTask.isOpen"></el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="速度" prop="maxSpeed">
                            <el-input-number v-model="missionTask.maxSpeed" placeholder="最大速度" :step='1'></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-row type="flex" justify="start" align="top">
                        </el-row>
                    </el-col>
                    <el-col :span="24">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="丢失状态" prop="missionOnRCSignalLostEnabled">
                                    <el-radio-group v-model="missionTask.missionOnRCSignalLostEnabled" size="medium">
                                        <el-radio v-for="(item, index) in missionOnRCSignalLostEnabledOptions" :key="index" :label="item.value" :disabled="item.disabled">{{item.label}}</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="采取行动" prop="missionFinishedAction">
                                    <el-input v-model="missionTask.missionFinishedAction" placeholder="请输入采取行动" clearable :style="{width: '100%'}"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="路径选取" prop="missionFlightPathMode">
                            <el-select v-model="missionTask.missionFlightPathMode" placeholder="请选择路径选取" clearable :style="{width: '100%'}">
                                <el-option v-for="(item, index) in missionFlightPathModeOptions" :key="index" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="一个航点" prop="missionGotoWaypointMode">
                            <el-input v-model="missionTask.missionGotoWaypointMode" placeholder="请输入一个航点" clearable :style="{width: '100%'}"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="移动航向" prop="missionHeadingMode">
                            <el-input v-model="missionTask.missionHeadingMode" placeholder="请输入移动航向" clearable :style="{width: '100%'}"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="执行次数" prop="missionRepeatTimes">
                            <el-input v-model="missionTask.missionRepeatTimes" placeholder="请输入执行次数" clearable :style="{width: '100%'}"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <div slot="footer">
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="handelConfirm">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    inheritAttrs: false,
    components: {},
    props: {
        // outerVisible:{
        //   default:true,
        //   type:Boolean,
        // }
    },
    data() {
        return {
            dynamicTitle: "任务类型：0表示翼飞任务，1表示大疆任务\n飞行速度：执行任务的飞行速度，0表示原始值。\n最大速度：允许的最大飞行速度，0表示原始值。\n丢失状态：确定当飞机与遥控器之间的连接丢失时，任务是否应该停止，0表示继续任务，1表示终止。\n采取行动：描述任务丢失连接时采取的行动。\n路径选取：飞机在航点之间遵循的路径。飞机可以直接在航路点之间沿直线飞行，也可以在弯道中的航路点附近转弯，航路点位置定义了弯路的一部分。\n一个航点： 定义飞机如何从当前位置前往第一个航点。默认值为SAFELY。\n移动航向： 机在航点之间移动时的航向。默认值为AUTO。\n任务执行次数：任务执行可以重复多次。值范围是[1，255]。如果选择255，则任务将继续执行直到stopMission被调用或发生任何错误。其他值表示任务的确切执行时间。\n",

            outerVisible: false,
            missionTask: {
                missionType: 0,
                speed: 0,
                isOpen: false,
                maxSpeed: 0,
                missionOnRCSignalLostEnabled: 0,
                missionFinishedAction: "",
                missionFlightPathMode: undefined,
                missionGotoWaypointMode: "",
                missionHeadingMode: undefined,
                missionRepeatTimes: undefined,
            },
            rules: {
                missionType: [{
                    required: true,
                    message: '任务类型不能为空',
                    trigger: 'change'
                }],
                speed: [{
                    required: true,
                    message: '请输入飞行速度',
                    trigger: 'blur'
                }],
                maxSpeed: [{
                    required: true,
                    message: '最大速度',
                    trigger: 'blur'
                }],
                missionOnRCSignalLostEnabled: [{
                    required: true,
                    message: '丢失状态不能为空',
                    trigger: 'change'
                }],
                missionFinishedAction: [{
                    required: true,
                    message: '请输入采取行动',
                    trigger: 'blur'
                }],
                missionFlightPathMode: [{
                    required: true,
                    message: '请选择路径选取',
                    trigger: 'change'
                }],
                missionGotoWaypointMode: [{
                    required: true,
                    message: '请输入一个航点',
                    trigger: 'blur'
                }],
                missionHeadingMode: [{
                    required: true,
                    message: '请输入移动航向',
                    trigger: 'blur'
                }],
                missionRepeatTimes: [{
                    required: true,
                    message: '请输入执行次数',
                    trigger: 'blur'
                }],
            },
            missionTypeOptions: [{
                "label": "翼飞",
                "value": 0
            }, {
                "label": "大疆",
                "value": 1,
                "disabled":true,
            }],
            missionOnRCSignalLostEnabledOptions: [{
                "label": "继续任务",
                "value": 0
            }, {
                "label": "终止",
                "value": 1
            }],
            missionFlightPathModeOptions: [{
                "label": "选项一",
                "value": 1
            }, {
                "label": "选项二",
                "value": 2
            }],
        }
    },
    computed: {},
    watch: {},
    created() { },
    mounted() { },
    methods: {
        onOpen() { 
          // this.$refs['missionTask'].resetFields()
        },
        onClose() {
            console.log('组件信息onClose');
            this.$refs['missionTask'].resetFields()
        },
        close() {
          console.log('组件信息close');
            this.$emit('update:visible', false)
            this.outerVisible = false;
        },
        handelConfirm() {
            this.$refs['missionTask'].validate(valid => {
                if (valid) {
                // 表单验证通过，提交数据 : 保存当前表单数据到副本
                 const originalMissionTask = Object.assign({}, this.missionTask);
                 const m = {...this.missionTask};
                    console.log('组件信息handelConfirm',originalMissionTask,m);
                    this.$emit('submit:missionTask', this.missionTask);
                    // 确保在表单验证通过后再关闭对话框
                    this.close();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
    }
}

</script>
<style>
</style>
