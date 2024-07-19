<!--
 * @Date: 2024-07-18 11:11:11
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\views\mediaManage\orthoImg\index.vue
 * @Description: Do not edit
-->
<template>
  <div>
    <el-table
ref="multipleTable"
:data="newDataList"
tooltip-effect="dark"
class="tableStyle"
empty-text="暂无数据"
@selection-change="handleSelectionChange"
      style="width: 100%"
:header-cell-style="{ background: '#FAFAFA', color: '#333333' }"
v-loading="tbLoading"
:expand-row-keys="expands"
@expand-change="expandChange"
:row-key='getRowKeys'>
      <el-table-column type="expand" label="查看货品" width="80">
        <!--查看货品表格--下面的表格就是封装的表格组件 -->
        <template>
          <table-tem :tblData="tblData" :column="column" :isSelect="false"></table-tem>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" prop="goodsImg" label="图片" min-width="80">
        <template slot-scope="scope">
          <img :src="scope.row.goodsImg" width="50px" height="50px" />
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" prop="stockNum" label="库存" min-width="90"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      expands: [], //展开table相关
      getRowKeys(row, index) { //设置row-key只展示一行
        return row.goodsId
      }
    }
  },
  methods: {
    // 展开触发api
    expandChange(row, expandedRows) {
      this.listQuery.goodsId = row.goodsId
      //加载前先将上次的数据模型清空，
      // 不然会出现点击展开嵌套表格后，先显示上一次的数据，然后渲染这次的数据。
      this.tblData = [];
      //只展开一行
      if (expandedRows.length) {//说明展开了
        this.expands = [];
        if (row) {
          this.expands.push(row.goodsId);//只展开当前行id
        }
        // 获取展开行的表格数据
        this.GetExpendRowData()
      } else {//说明收起了
        this.expands = [];
      }
    },
    // 获取展开行的表格数据
    GetExpendRowData() {
      //掉接口
      getExpendRowList().then(res => {
        //由于上面把this.tblData清空了，所以下面直接进行数组赋值会出现一个问题
        //问题是数据已经打印出来了，但是试图没有更新
        //接口请求后的数据不可直接赋值，例如：this.tblData=res.data,这样是错位的

      })
    }
  }
}
</script>
