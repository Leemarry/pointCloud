<!--
 * @Date: 2024-07-19 10:06:25
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\views\businessMange\towerLineManage\TowerdDetails\index.vue
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
        <el-form-item label="塔线编号" prop="mark">
          <el-input v-model="ruleForm.mark" style="width: 200px;" :disabled="tower.mark!=''" />
        </el-form-item>
        <el-form-item label="起始杆塔编号" prop="startTowerMark">
          <el-input v-model="ruleForm.startTowerMark" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="末杆塔编号" prop="endTowerMark">
          <el-input v-model="ruleForm.endTowerMark" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="杆线长度" prop="lineLength">
          <el-input v-model="ruleForm.lineLength" style="width: 200px;" />
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
    name: 'TowerLineDetails',
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
                mark: '',
                startTowerMark: '',
                endTowerMark: '',
                lineLength: '',
                des: ''
            },
            rules: {
                mark: [
                    { required: true, message: '请输入标识', trigger: 'blur' },
                    { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
                ],
                startTowerMark: [
                    { required: true, message: '起始杆塔编号', trigger: 'blur' }
                ],
                endTowerMark: [
                    { required: true, message: '末杆塔编号', trigger: 'blur' }
                ],
                lineLength: [
                    { required: true, message: '杆线长度', trigger: 'blur' }
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
