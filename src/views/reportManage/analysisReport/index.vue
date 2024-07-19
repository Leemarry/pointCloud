<!--  -->
<template>
    <div class='media'>
        <div class='media-top'>
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="文件类型">
                    <el-select v-model="formInline.type" placeholder="请选择">
                        <el-option v-for="item in reportOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间范围">
          <el-col :span="12">
            <!-- <el-date-picker type="date" placeholder="选择日期" v-model="formInline.date1" style="width: 100%;"></el-date-picker> -->
            <el-date-picker v-model="formInline.startTime" type="datetime" placeholder="选择起始时间" align="right" :picker-options="pickerOptions">
            </el-date-picker>
          </el-col>
          <el-col class="line" :span="2">至</el-col>
          <el-col :span="10">
            <el-date-picker v-model="formInline.endTime" type="datetime" placeholder="选择日期时间" default-time="12:00:00">
            </el-date-picker>
          </el-col>
        </el-form-item>
            </el-form>
            <div>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button type="primary" @click="">上传</el-button>
            </div>
        </div>
        <div class='media-container'>
            <el-table :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)" stripe style="width: 100%">
                <el-table-column prop="date" label="日期" width="180">
                </el-table-column>
                <el-table-column prop="fileName" label="文件名" width="180">
                </el-table-column>
                <el-table-column prop="fileType" label="类型">
                </el-table-column>
                <el-table-column prop="fileSize" label="大小">
                </el-table-column>
                <el-table-column prop="fileUrl" label="地址">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                        <el-button type="text" size="small" @click='downloadFile(scope.row, scope.$index)'>下载</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class='media-footer'>
            <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[1, 5, 10, 20]" :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
            </el-pagination>
        </div>
    </div>
</template>
<script src="./index.js"></script>
<!-- <style lang="scss" src="./index.scss" scoped></style> -->
<style lang='scss' scoped>
//@import url(); 引入公共css类
.media {
    background-color: #F3F6F8;
    height: 100%;
    width: 100%;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1;
}

.media-top {
    display: flex;
    justify-content: space-between;
}

.media-container {
    flex: 1;
    background-color: #FAFAFA;
    overflow: auto;
}
</style>