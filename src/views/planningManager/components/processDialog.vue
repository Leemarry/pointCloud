<!--
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2024-03-21 17:06:32
 * @LastEditors: Andy
 * @LastEditTime: 2024-04-15 09:59:10
-->
<!--  -->
<template>
    <el-dialog :visible.sync="dialogTableVisible" width="40%">
        <template slot="title">
            <span title="提示：临时展示处理信息">处理信息</span>
        </template>
        <el-table class="refTable" @row-click="clickTable" ref="refTable" :data="processBlockAllList" :row-class-name="setClassName" max-height="250" style="width: 100%">
            <el-table-column width="0" type="index">
                <template slot-scope="scope">
                    <i class="el-icon-arrow-right" v-if="scope.row.expand != undefined  "></i>
                </template>
            </el-table-column>
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="总空斑面积">
                            <span>{{ props.row.gapSquare }}</span>
                        </el-form-item>
                        <el-form-item label="补播区域数量">
                            <span>{{ props.row.reseedAreaNum }}</span>
                        </el-form-item>
                        <el-form-item label="补播区域面积">
                            <span>{{ props.row.reseedSquare }}</span>
                        </el-form-item>
                        <el-form-item label="补播草种数量">
                            <span>{{ props.row.seedNum }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column label="处理 ID" prop="handleUuid">
                <template slot-scope="scope">
                    <!-- overhide -->
                    <div class="">{{ scope.row.handleUuid}}</div>
                </template>
            </el-table-column>
            <el-table-column label="处理时间" prop="date">
            </el-table-column>
            <el-table-column label="描述" prop="expand">
                <template slot-scope="scope">
                    <!-- // 待确认 已处理 处理中 -->
                    <!-- <el-tag :class="{'pointerStyle' : scope.row.expand }" :type="scope.row.expand ?'primary' : (scope.row.expand==undefined ?'warning':'success')" disable-transitions disabled @click.stop="submit(scope.row)">
                        {{scope.row.expand ?'待确认' : (scope.row.expand==undefined ?'处理中':'已处理') }}
                    </el-tag> -->
                    <el-button :class="{'pointerStyle' : scope.row.expand }" size="mini" :loading="scope.row.expand==undefined" :type="scope.row.expand ?'primary' : (scope.row.expand==undefined ?'warning':'success')" plain @click.stop="scope.row.expand ? submito(scope.row) :''">
                        {{scope.row.expand ?'待确认' : (scope.row.expand==undefined ?'处理中':'已确认') }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { mapGetters } from 'vuex'
export default {
    name: '',
    //import引入的组件需要注入到对象中才能使用
    components: {},
    data() {
        //这里存放数据
        return {
            dialogTableVisible: false,
        };
    },
    //让组件接收外部传来的数据
    props: {
        defaultUavSn: {
            type: String,
        },
    },
    //监听属性 类似于data概念
    computed: {
        ...mapGetters([
            'ProcessWsMessage',
            'processBlockAllList',
        ]),
        tagType() {
            return (row) => {
                if (row.expand) {
                    return 'primary';
                } else if (row.expand == undefined) {
                    return 'warning';
                } else {
                    return 'info'
                }

            };
        },

    },
    //监控data中的数据变化
    watch: {
        // processBlockAllList
    },
    //方法集合
    methods: {
        clickTable(row, index, e) {
            // this.$refs.refTable.toggleRowExpansion(row)
            if (row.expand) {
                this.$refs.refTable.toggleRowExpansion(row)
            } else {
                if (row.expand === false) {
                    this.$refs.refTable.toggleRowExpansion(row)
                } else {
                    this.$refs.refTable.toggleRowExpansion(row, false)
                }

            }

        },
        chooseOtherHandle() {
            console.log('ddooo');
        },
        setClassName({ row, index }) {
            // 通过自己的逻辑返回一个class或者空
            return row.expand ? 'expand' : 'expand';
        },
        /**确认无误 finalHandle*/
        async submit(row) {
            let url = 'uavs/finalHandle';
            try {
                if (!row.expand) { return false; }
                const handleUuid = row.handleUuid
                // let formdata = new FormData();
                // formdata.append("handleUuid", handleUuid);
                // formdata.append("uavId", this.defaultUavSn);
                const params = { uavId: this.defaultUavSn, handleUuid }
                const payload = { that: this, url, params, data: row }
                const response = await this.$store.dispatch('uavs/finalHandle', payload);
                const { code, data, message } = response;
                if (code == 1) {
                    row.expand = false ;// 已确认
                } else {
                    this.showMessage("error", 'warning')
                }
            } catch (error) {
                this.showMessage(error, 'error')
            }

        },
        /**待确认信息 */
        submito(row) {
            console.log("dddd");
            row.expand = true
            this.submit(row)
        },

        showToast(msg) {
            this.$layer.msg(msg);
        },
        showMessage(msg, type) {
            this.$message({
                message: msg,
                type: type,
            });
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
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
::v-deep .expand .el-table__expand-column .cell {
    display: none;
}

.pointerStyle {
    cursor: pointer;
}
.overhide {
    max-width: 150px;
    overflow: hidden;
    white-space: nowrap;
    direction: ltr;
}
</style>