

/**
 * https://juejin.cn/post/7003587726943453221
 * 1.方法和参数在各组件中不共享
 * 2.值为对象的选项，如methods,components等，选项会被合并，键冲突的组件会覆盖混入对象的
 */
// import store from '@/store';
// import { getDefaultObj } from "@/utils/currency"
export default {
    name: '',
    mixins: [], //
    //import引入的组件需要注入到对象中才能使用
    components: {},
    data() {
        //这里存放数据
        return {
            uavs: [],
            defaultUavSn: '', //默认选中的无人机
            defaultUavInfo: null,

        };
    },
    //让组件接收外部传来的数据
    props: {
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
        /**信息提示 */
        showToast(msg) {
            this.$layer.msg(msg)
        },
        /**信息提示 */
        /**
         * @name: 
         * @msg: 
         * @param {String} msg
         * @param {String} type - "success"
         * @param {Number} duration
         * @return {*}
         */        
        showMessage(msg, type,duration=1200 ) {
            this.$message({
                message: msg,
                type: type,
                duration
            })
        },

        /**查询无人机信息 */
        async queryAllUavsByMix() {
            let uavArray = []; // 在try块之外定义uavArray
            try {
                const response = await this.$store.dispatch("uavs/getUavs")
                const { code, message, data } = response;
                if (code === 1) {
                    uavArray = data
                }
            } catch (erro) {
                this.showMessage(error, "error");
            } finally {
                return uavArray;
            }
        },

        /**
       * 将时间戳转换为格式化日期字符串
       * @param {number} shijianchuo - 时间戳，单位毫秒
       * @returns {string} 格式化后的日期字符串，例如 "2024年04月10日 12:30:15"
       */
        time(shijianchuo) {
            //shijianchuo是整数，否则要parseInt转换
            var time = new Date(shijianchuo);
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            return y + '年' + this.add0(m) + '月' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s);
        },
        add0(m) {
            return m < 10 ? '0' + m : m
        },


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
    activated() { }, //如果页面有keep-alive缓存功能，这个函数会触发
}