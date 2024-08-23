/* eslint-disable no-const-assign */
/* eslint-disable no-unsafe-finally */

/**
 * https://juejin.cn/post/7003587726943453221
 * 1.方法和参数在各组件中不共享
 * 2.值为对象的选项，如methods,components等，选项会被合并，键冲突的组件会覆盖混入对象的
 */
import { getDefaultObj, getDefaultData, switchNode, getTimeRangeByKey } from '@/utils/currency'
import { parseTime, filtersType } from '@/utils/index';
import VirtualList from 'vue-virtual-scroll-list'
import EImage from '@/views/components/Other/image.vue'
export default {
    name: '',
    mixins: [], //
    //import引入的组件需要注入到对象中才能使用
    components: { VirtualList },
    data() {
        //这里存放数据
        const tableData = [];
        return {
            current: '',
            EImage,
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
            defaultTowerMark: '', //默认选中的无人机
            defaultTowerInfo: {},
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
            value1: [new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date(Date.now())],
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
    watch: {
        tableData: {
            handler(newVal, oldVal) {
                this.$bus.$emit('send:removeAll');
                console.log('监听到tableData变化了', newVal);
                if (!newVal || !newVal.length === 0) {
                    return
                }
                for (let index = 0; index < newVal.length; index++) {
                    const tower = newVal[index]; // orthoImg
                    let latitude = tower.lat
                    let longitude = tower.lon
                    if (tower.orthoImg) {
                        latitude = tower.orthoImg.lat
                        longitude = tower.orthoImg.lon
                        if (tower.orthoImg.mapPath) {
                            const url = tower.orthoImg.mapPath
                            const name = tower.id; // `${new Date().getTime()}`
                            const mtype = 'TMS'
                            this.$bus.$emit('send:addImagery', { url, longitude, latitude, height: 1000, name, mtype });
                        } else {
                            break;
                        }
                    } else {
                        break;
                    }
                }
            },
            deep: true
        },
        tableDatas: {
            handler(newVal, oldVal) {
                // 发送事件通知移除所有
                this.$bus.$emit('send:removeAll');
                // 检查newVal是否存在且非空
                if (!newVal || newVal.length === 0) {
                    return;
                }
                newVal.forEach(tower => {
                    let latitude, longitude;
                    // 优先从orthoImg中获取经纬度
                    if (tower.orthoImg) {
                        latitude = tower.orthoImg.lat;
                        longitude = tower.orthoImg.lon;
                        // 如果存在mapPath，则发送添加图片事件
                        if (tower.orthoImg.mapPath) {
                            const url = tower.orthoImg.mapPath;
                            const name = tower.id;
                            console.log('tileset', name);
                            const mtype = 'TMS';
                            this.$bus.$emit('send:addImage', { url, longitude, latitude, height: 800, name, mtype });
                        }
                    }
                });
            },
            deep: true
        }
    },
    //方法集合
    methods: {
        // #region ---------------------------------------------------   提示   --------------------------------------------------
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
        itemClick(index) {
            console.log('sssopp', index);
        },
        getObjData(photos) {
            const data = []
            const count = photos.length || 0;
            let idCounter = 0
            for (let index = 0; index < count; index++) {
                const photo = photos[index]
                data.push({
                    id: String(idCounter++),
                    ...photo
                })
            }
            console.log('data', data);
            return data
        },

        previewWebCloud(row) {
            this.beforeView(row.id, row.webUrl, 'web', row.mark)
        },
        OpenWeb(id) {
            const row = this.tableData.find(item => item.id === id);
            console.log('点击打开', row.pointCloud);
            if (!row || !row.pointCloud || !row.pointCloud.webUrl) {
                this.showToast('没有webUrl')
                return
            }
            this.previewWebCloud(row.pointCloud)
        },
        toFocus(id) {
            const tower = this.tableData.find(item => item.id === id);
            if (tower.orthoImg && tower.orthoImg.mapPath) {
                this.$bus.$emit('send:toFocus', id);
            }
        },
        handleChange() {
            this.formInline.startTime = this.value1[0]
            this.formInline.endTime = this.value1[1]
            this.queryTowerAlllist()
        },
        clickTowerItem(item) {
            if (item.mark === this.defaultTowerMark) {
                return;
            }
            console.log('dji ');
            const key = 'defaultUav-' + this.userId;
            localStorage.setItem(key, item.mark);
            this.defaultTowerMark = item.mark;
            this.defaultTowerInfo = getDefaultObj(this.tableData, 'mark', this.defaultTowerMark)
        },
        // 查询
        // #region ----------------------------------------------------------   查询信息   --------------------------------------------------- ----
        async queryTowerAlllist() {
            try {
                this.mixinsLoading = true;
                this.beforeFormMixin()
                const formData = new FormData();
                formData.append('startTime', this.formInline.startTime.getTime());
                formData.append('endTime', this.formInline.endTime.getTime()); //
                formData.append('mark', this.formInline.mark)
                const res = await this.$store.dispatch('business/getTowerAllList', formData)
                const { code, message, data } = res;
                if (code > 0) {
                    this.numberAllUavCount = {
                        number: [code],
                        content: '{nt} 架'
                    }
                    // 在data 添加 checked
                    data.forEach(item => {
                        item.checked = false;
                    })
                    this.tableData = data
                } else {
                    this.$message.error(message);
                }
            } catch (err) {
                this.showToast(err, 'error');
            } finally {
                this.mixinsLoading = false;
            }
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
        console.log('mounted生命周期 - 挂载完成（可以访问DOM元素）');
        this.queryTowerAlllist()
    },
    beforeCreate() { }, //生命周期 - 创建之前
    beforeMount() { }, //生命周期 - 挂载之前
    beforeUpdate() { }, //生命周期 - 更新之前
    updated() { }, //生命周期 - 更新之后
    beforeDestroy() {
    }, //生命周期 - 销毁之前
    destroyed() { }, //生命周期 - 销毁完成
    activated() { } //如果页面有keep-alive缓存功能，这个函数会触发
}
