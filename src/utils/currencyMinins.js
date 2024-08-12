/* eslint-disable no-const-assign */
/* eslint-disable no-unsafe-finally */

/**
 * https://juejin.cn/post/7003587726943453221
 * 1.方法和参数在各组件中不共享
 * 2.值为对象的选项，如methods,components等，选项会被合并，键冲突的组件会覆盖混入对象的
 */
// import store from '@/store';
// import { getDefaultObj } from "@/utils/currency"
import { parseTime, filtersType } from '@/utils/index';
export default {
    name: '',
    mixins: [], //
    //import引入的组件需要注入到对象中才能使用
    components: {},
    data() {
        //这里存放数据
        const tableData = [];
        const fileMap = {
            photo1: '平台上传',
            photo2: '无人机上传',
            video1: '平台上传',
            video2: '无人机上传'
        };
        return {
            tableData,
            pickerOptions: {
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                        picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24);
                        picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', date);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', start);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', start);
                    }
                }]
            },
            uavs: [],
            defaultUavSn: '', //默认选中的无人机
            defaultUavInfo: null,
            formInline: {
                total: 500,
                mark: null,
                startTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                endTime: new Date(Date.now()),
                type: 0
            },
            rules: {
                mark: [
                    { required: false, message: '请输入杆塔标注信息', trigger: 'blur' }
                ],
                startTime: [{
                    trigger: 'change',
                    validator: this.validateTime
                }],
                endTime: [{
                    trigger: 'blur',
                    validator: this.validateTime
                }]

            },
            fileMap,
            /**浏览器窗口对象 */
            windows: {},
            //分页
            currentPage: 1,
            pageSize: 10,
            mixinsLoading: false
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
        // #region ---------------------------------------------------   提示   ---------------------------------------------------
        showToast(msg) {
            this.$layer.msg(msg)
        },
        showMessage(msg, type, duration = 1200) {
            this.$message({
                message: msg,
                type: type,
                duration
            })
        },
        // #endregion
        // 查询
        // #region ---------------------------------------------------   查询信息   ---------------------------------------------------
        /**查询无人机信息 */
        async queryAllUavsByMix() {
            let uavArray = []; // 在try块之外定义uavArray
            try {
                const response = await this.$store.dispatch('uavs/getUavs')
                // eslint-disable-next-line no-unused-vars
                const { code, message, data } = response;
                if (code === 1) {
                    uavArray = data
                }
            } catch (error) {
                this.showMessage(error, 'error');
            } finally {
                return uavArray;
            }
        },
        async queryList1(url = this.reqUrl, format) {
            try {
                this.mixinsLoading = true;
                // endTime 是否大于 startTime
                this.beforeFormMixin()
                const formdata = new FormData();
                formdata.append('startTime', this.formInline.startTime);
                formdata.append('endTime', this.formInline.endTime);
                formdata.append('mark', this.formInline.mark)
                formdata.append('type', this.formInline.type)
                const reqData = { url, formdata }
                const res = await this.$store.dispatch('media/queryList1', reqData)
                const { code, message, data } = res;
                if (code === 1) {
                    this.tableData = data.map(item => {
                        return { ...item, downLoadProgress: 0, copy: false }
                    })
                } else {
                    this.$message.error(message);
                }
            } catch (err) {
                this.showToast(err, 'error');
            } finally {
                this.mixinsLoading = false;
            }
        },
        /** 参数归一化 */
        async queryList2(url = this.reqUrl, formatReq, formatRes) {
            // 将 formatReq 转成函数
            try {
                this.mixinsLoading = true;
                // endTime 是否大于 startTime
                this.beforeFormMixin()
                const formdata = new FormData();
                formdata.append('startTime', this.formInline.startTime);
                formdata.append('endTime', this.formInline.endTime);
                formdata.append('mark', this.formInline.mark)
                formdata.append('type', this.formInline.type)
                const reqData = { url, formdata }
                const res = await this.$store.dispatch('media/queryList1', reqData)
                const { code, message, data } = res;
                if (code === 1) {
                    this.tableData = data;
                } else {
                    this.$message.error(message);
                }
            } catch (err) {
                this.showToast(err, 'error');
            } finally {
                this.mixinsLoading = false;
            }
        },
        reqParamsFormat(formatter) {
            // 判断是不是函数
            if (typeof formatter === 'function') {
                return formatter;
            }
            // 是不是字符串 不是字符串就返回错误
        },
        // #endregion
        // #region 私有方法
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
        shuntime(time) {
            return this.$dateUtil.convertSecondToTime(time);
        },
        filtersType(val) {
            return filtersType(val);
        },
        parseTime(date) {
            return parseTime(date);
        },
        getFileType(type, num) {
            return this.fileMap[(type + num)];
        },
        // #endregion 私有方法

        // 原文链接：https://blog.csdn.net/ka_xingl/article/details/114392019
        // #region ---------------------------------------------------------------- form_rules -----------------------------------------------------
        validateTime(rule, value, callback) {
            if (value === '') {
                callback(new Error('请输入开始时间'))
            } else {
                if (new Date(this.formInline.startTime).getTime() <= new Date().getTime() && new Date(this.formInline.startTime).getTime() <= new Date(this.formInline.endTime).getTime()) {
                    callback()
                } else {
                    callback(new Error('开始时间必须大于当前时间！'))
                }
            }
        },
        validateStartTime(rule, value, callback) {
            console.log('value', value);
            if (value === '') {
                callback(new Error('请输入开始时间'))
            } else {
                console.log('开始时间必须大于当前时间', new Date(this.formInline.startTime).getTime(), new Date().getTime());
                if (new Date(this.formInline.startTime).getTime() <= new Date().getTime()) {
                    callback(new Error('开始时间必须大于当前时间！'))
                } else {
                    callback()
                }
            }
        },
        validateEndTime(rule, value, callback) {
            if (value === '') {
                callback(new Error('请输入结束时间'))
            } else {
                if (
                    new Date(this.formInline.startTime).getTime() >=
                new Date(this.formInline.endTime).getTime()
                ) {
                    callback(new Error('结束时间必须大于开始时间！'))
                } else {
                    callback()
                }
            }
        },
        beforeFormMixin() {
            // endTime 是否大于 startTime
            if (this.formInline.startTime > this.formInline.endTime) {
                return this.showToast('开始时间不能大于结束时间', 'error');
            }
            this.formInline.endTime = this.formInline.endTime ? this.formInline.endTime : new Date();
            if (!this.formInline.startTime || !this.formInline.endTime) {
                return this.showToast('请选择时间范围', 'error');
            }
        },
        // #endregion

        // #region ---------------------------------------------------  分页 ---------------------------------------------------
        //每页条数改变时触发 选择一页显示多少行
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.currentPage = 1;
            this.pageSize = val;
        },
        //当前页改变时触发 跳转其他页
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val;
        },

        // #endregion
        // 标签页
        // #region ---------------------------------------------------- 标签页 -----------------------------------------------------------
        //vue打开新窗口并且实现传参--目的
        uploadFiles(item, index) {
            const windowName = 'uploadWindow-' + item.fileType; // 设定窗口名称
            if (!this.windows[windowName] || this.windows[windowName].closed) {
                // 如果窗口存在并且关闭了就在this.windows中删除
                if (this.windows[windowName]) {
                    delete this.windows[windowName];
                }
                const existingWindow = window.open('', windowName);
                const queryString = `?id=${item.id}&src=${encodeURIComponent(item.reqUrl)}&type=${encodeURIComponent(item.fileType)}`; //data=${encodeURIComponent(JSON.stringify(item))}
                const url = '/uploadpage' + queryString;
                existingWindow.location.href = url; //'/uploadpage' + '?id=' + item.id + '&fileType=' + item.fileType;
                this.windows[windowName] = existingWindow;
            } else {
                this.windows[windowName].focus();
            }
        },
        /**查看 */
        beforeView(id, path, formats, mark) {
            const windowName = 'windowName-' + formats + mark;
            if (!this.windows[windowName] || this.windows[windowName].closed) {
                if (this.windows[windowName]) {
                    delete this.windows[windowName];
                }
                // 创建新窗口
                const existingWindow = window.open('', windowName);
                const queryString = `?id=${id}&src=${encodeURIComponent(path)}&formats=${encodeURIComponent(formats)}`;
                existingWindow.location.href = '/preview' + queryString;
                this.windows[windowName] = existingWindow;
                // // 为新窗口添加 message 事件监听器
                // existingWindow.addEventListener('message', handleMessage);
            } else {
                this.windows[windowName].focus();
            }
        }
        // #endregion

    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        if (this.reqUrl) {
            this.queryList1(this.reqUrl)
        }
    },
    beforeCreate() { }, //生命周期 - 创建之前
    beforeMount() { }, //生命周期 - 挂载之前
    beforeUpdate() { }, //生命周期 - 更新之前
    updated() { }, //生命周期 - 更新之后
    beforeDestroy() { }, //生命周期 - 销毁之前
    destroyed() { }, //生命周期 - 销毁完成
    activated() { } //如果页面有keep-alive缓存功能，这个函数会触发
}
