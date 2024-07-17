<!--
 * @Date: 2024-07-16 14:50:40
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\views\mediaUpload\index.vue
 * @Description: Do not edit
-->
<!--  -->
<template>
  <div class=''>
    <!-- <div class="top">
          <p>
            <span class="tips"> 该页面仅为临时上传页面! 模型上传请使用文件夹上传，并保证模型格式[D3BM]正确！解析过程：由于模型过大，可能出现解析延迟，请您耐心等待！ 上传途中！ 请勿关闭页面 ~ </span>
            <span>该页面仅为临时上传页面! 模型上传请使用文件夹上传，并保证模型格式[D3BM]正确！解析过程：由于模型过大，可能出现解析延迟，请您耐心等待！ 上传途中！ 请勿关闭页面 ~ </span>
          </p>
        </div> -->
    <!-- 文件上传Ui -->
    <div class="al-input">
      <div id="drop_zone">拖放文件到这里</div>
      <input type="file" multiple>

      <!-- <el-upload class="upload-demo" drag action="/" multiple :auto-upload="false" :show-file-list="false"  :file-list="uploadFilesList" :on-preview="handlePreview" :on-change="changeFile">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload> -->
      <!-- 第二种进度条 -->
      <!-- <el-upload
  class="upload-demo"
  action="https://jsonplaceholder.typicode.com/posts/"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :before-remove="beforeRemove"
  multiple
  :limit="3"
  :on-exceed="handleExceed"
  :file-list="uploadFilesList">
  <el-button size="small" type="primary">点击上传</el-button>
  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
</el-upload> -->
      <!-- <el-upload class="upload-demo" ref="upload" action="/" :on-preview="handlePreview" size="mini"  :file-list="fileList"
                        :auto-upload="false" :on-change="changeFile">
                        <el-button slot="trigger" size="mini" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传zip文件，且不超过50M</div>
                    </el-upload> -->
      <!-- <div class="oneFile">
          <div class="flietext">上传文件夹</div>
          <input type="file" directory webkitdirectory >
      </div>
      <div class="someFile">
          <div class="flietext">上传文件</div>
          <input type="file" multiple >
      </div> -->
    </div>
    <div class="message">

    </div>

    <div>
      <el-table :data="uploadFilesList" style="width: 100%">
        <!-- 文件名  -->
        <el-table-column prop="name" :show-overflow-tooltip="true" label="名称" width="300">
          <template slot-scope="scope">
            <i style="color:#409EFF" class=" el-icon-s-order" />{{ scope.row.name }}
          </template>
        </el-table-column>
        <!-- 文件级联 -->
        <el-table-column prop="name" :show-overflow-tooltip="true" label="文件层级">
          <template slot-scope="scope">
            <i style="color:#409EFF" class=" el-icon-s-order" />{{ scope.row.webkitRelativePath == "" ? "单文件" : scope.row.webkitRelativePath }}
          </template>
        </el-table-column>
        <!-- 进度 -->
        <el-table-column prop="name" label="是否成功" width="380">
          <template slot-scope="scope">
            <template v-if="scope.row.status === 'success' || scope.row.progress == 100">上传成功！</template>
            <template v-else-if="scope.row.status === 'error'">上传失败!</template>
            <template v-else-if="scope.row.status === 'warning'">解析中!</template>
            <el-progress v-else :text-inside="true" :stroke-width="24" :percentage="scope.row.progress" />
          </template>
        </el-table-column>
        <el-table-column width="200" prop="size" label="大小" />
        <el-table-column prop="name" width="280" label="功能">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="fileUrl(scope.row, scope.$index)">查看路径</el-button>
            <el-button v-if="scope.row.progress !== 100" type="primary" size="mini" @click="awaitUpload(scope.row, scope.$index)">等待</el-button>
            <el-popconfirm v-else confirm-button-text='好的' cancel-button-text='不用了' @onConfirm="saveUpload(scope.row, scope.$index)" icon="el-icon-info" icon-color="red"
              :title="getConfirmationTitle()" style="margin-left: 5px;">
              <el-button slot="reference" type="primary" size="mini" :loading="loading">{{ loading
                ? '提交中 ...' : '使用当前模型' }}</el-button>
            </el-popconfirm>

          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等!）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  name: '',
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      uploadFilesList: [],
      fileList: []

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
    handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    console.log('生命周期 - 创建完成（可以访问当前this实例）');
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    console.log('this.windows生命周期', window);
    console.log('生命周期 - 挂载完成（可以访问DOM元素）');
    var self = this;

    document.getElementById('drop_zone').addEventListener('dragover', function (e) {
      e.preventDefault(); // 阻止默认处理（默认不允许放置）  
      e.dataTransfer.dropEffect = 'copy'; // 明确放置效果  
      this.classList.add('over'); // 可选：添加一些视觉效果  
    });

    document.getElementById('drop_zone').addEventListener('dragleave', function (e) {
      this.classList.remove('over'); // 移除视觉效果  
    });

    document.getElementById('drop_zone').addEventListener('drop', function(e) {
      e.preventDefault(); // 阻止默认处理（默认处理是打开文件）  
      this.classList.remove('over'); // 移除视觉效果  

      var files = e.dataTransfer.files; // 获取文件列表  
      console.log('e', e.dataTransfer, files);

      for (var i = 0; i < files.length; i++) {  
          var file = files[i];  

          // 这里可以添加代码来预览文件或显示文件信息  
          self.uploadFilesList.push(file)

          // 调用上传函数  
          // uploadFile(file);  
      }  
    });

    function uploadFile(file) {
      var formData = new FormData();
      formData.append('file', file);

      // 使用fetch API发送文件到服务器  
      fetch('/upload', {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }

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
#drop_zone {
  width: 300px;
  height: 200px;
  border: 2px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px;
  border-radius: 5px;
}

#drop_zone.over {
  border-color: #0087F7;
}
</style>