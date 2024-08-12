<!--
 * @Date: 2024-07-19 10:06:25
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\views\businessMange\towerManage\TowerdDetails\index.vue
 * @Description: Do not edit
-->
<!--  -->
<template>
  <div class="sss">
    <el-drawer
      :title="ruleForm.mark"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
      size="20%"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="130px" class="demo-ruleForm">
        <el-form-item label="竣工杆号" prop="name">
          <el-input v-model="ruleForm.name" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="杆塔标注号" prop="mark">
          <el-input v-model="ruleForm.mark" style="width: 200px;" :disabled="tower.mark!=''" />
        </el-form-item>
        <el-form-item label="杆塔经度" prop="mark">
          <el-input v-model="ruleForm.lon" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="杆塔纬度" prop="mark">
          <el-input v-model="ruleForm.lat" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="杆塔高度" prop="mark">
          <el-input v-model="ruleForm.alt" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="杆塔海拔" prop="mark">
          <el-input v-model="ruleForm.absalt" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="导地线弧垂" prop="verticalLineArc">
          <el-input v-model="ruleForm.verticalLineArc" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="导地线间距" prop="lineLineDis">
          <el-input v-model="ruleForm.lineLineDis" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="引流线到塔距离" prop="lineTowerDis">
          <el-input v-model="ruleForm.lineTowerDis" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="耐张塔转角度数" prop="towerRotationAngle">
          <el-input v-model="ruleForm.towerRotationAngle" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="备注" prop="des">
          <el-input v-model="ruleForm.des" type="textarea" style="width: 200px;" />
        </el-form-item>
        <div style="margin-left: 5px;">
          <el-button type="primary" @click="submitForm('ruleForm')">确认修改</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </div>
      </el-form>
    </el-drawer>
  </div>
</template>
<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等!）
//例如：import 《组件名称》 from '《组件路径》';

export default {
    name: '',
    //import引入的组件需要注入到对象中才能使用
    components: {},
    //让组件接收外部传来的数据
    props: {
        drawer: { type: Boolean, default: false },
        direction: { type: String, default: 'rtl' },
        tower: { type: Object, default: () => ({}), require: true }
    },
    data() {
        //这里存放数据
        return {
            ruleForm: {
                name: '',
                mark: '',
                verticalLineArc: '',
                lineLineDis: '',
                lineTowerDis: '',
                towerRotationAngle: '',
                des: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入竣工杆号名称', trigger: 'blur' },
                    { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                ],
                mark: [
                    { required: true, message: '请输入标识', trigger: 'blur' },
                    { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
                ],
                verticalLineArc: [
                    { required: true, message: '请输入导地线弧垂', trigger: 'blur' }
                ],
                lineLineDis: [
                    { required: true, message: '请输入导地线间距', trigger: 'blur' }
                ],
                lineTowerDis: [
                    { required: true, message: '请输入引流线到塔距离', trigger: 'blur' }
                ],
                towerRotationAngle: [
                    { required: true, message: '请输入耐张塔转角度数', trigger: 'blur' }
                ],
                des: [
                    { required: false, message: '请填写', trigger: 'blur' }
                ]
            }
        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {
        // 监听 tower将值 深拷贝 赋值给 ruleForm
        tower: {
            handler(val) {
                this.ruleForm = { ...val };
            },
            deep: true
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
    },
    beforeCreate() { }, //生命周期 - 创建之前
    beforeMount() { }, //生命周期 - 挂载之前
    beforeUpdate() { }, //生命周期 - 更新之前
    updated() { }, //生命周期 - 更新之后
    beforeDestroy() { }, //生命周期 - 销毁之前
    destroyed() { }, //生命周期 - 销毁完成
    activated() { },
    //方法集合
    methods: {
        handleClose(done) {
            this.$emit('update:visible', done);
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$emit('hand:tower', this.ruleForm);
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            // console.log('resetForm',this.$refs[formName]);
            this.$nextTick(() => {
                this[formName] = { ...this.tower };
                // this.$refs[formName].resetFields()
            });
        }

    } //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类</style>
