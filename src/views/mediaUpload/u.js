/*
 * @Date: 2024-09-03 10:19:40
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\views\mediaUpload\u.js
 * @Description: Do not edit
 */
async handleFolderSelect(event) {  
  const files = event.target.files;  
  if (files.length === 0) {  
      console.log('请获取正确的文件');  
      return;  
  }  

  const batchSize = 3000; // 每批次处理3000个文件  
  const maxFileSize = 120 * 1024 * 1024; // 120MB in bytes  
  const filteredFiles = Array.from(files).filter(file => {  
      const fileNameCheck = !file.name.includes('tif');  
      const fileSizeCheck = file.size <= maxFileSize;  
      return fileNameCheck && fileSizeCheck;  
  });  

  console.log('过滤后的文件数：', filteredFiles.length);  

  // 分批上传文件  
  for (let i = 0; i < filteredFiles.length; i += batchSize) {  
      const batchFiles = filteredFiles.slice(i, i + batchSize);  
      // 处理并上传当前批次文件  
      await this.submitTask(batchFiles);  
  }  
},  

submitTask(files) {  
  this.xhrList = [];  
  this.isCancelUpload = false;  
  return this.concurRequestfiles(files, this.uploadTotalFilesList, this.reqUrl);  
},





const maxFileSize = 120 * 1024 * 1024; // 120MB in bytes  
const batchSize = 5000; // 每批次处理 5000 个文件  

// 过滤并生成 tempFilelist  
const tempFilelist = Array.from(files).reduce((acc, file) => {  
    const iscloud = this.fileType === 'cloud';  
    const isorthoimg = this.fileType === 'orthoimg';  
    const fileNameCheck = !file.name.includes('tif');  
    const fileSizeCheck = file.size <= maxFileSize;  

    // 检查文件是否符合条件  
    if (fileNameCheck || (fileSizeCheck && isorthoimg)) {  
        const webkitRelativePath = file.webkitRelativePath || '';  
        const folder = this.extractString(webkitRelativePath);  
        acc.push({  
            file,  
            folder,  
            name: file.name,  
            progress: 0,  
            status: 'uploading'  
        });  
    }  
    return acc;  
}, []);  

// 将 tempFilelist 按批次处理  
for (let i = 0; i < tempFilelist.length; i += batchSize) {  
    const batchFiles = tempFilelist.slice(i, i + batchSize);  
    this.uploadTotalFilesList = [...this.uploadTotalFilesList, ...batchFiles];  
}  

console.log('拖放文件数一般高于15万个文件', this.uploadTotalFilesList.length);





async getFiles(dataTransferItemList) {
    const fileList = [];
    async function processEntry(entry) {
        if (entry.isFile) {
            const res = await new Promise((resolve) => entry.file(resolve));
            fileList.push(res);
        } else if (entry.isDirectory) {
            const reader = entry.createReader();
            const entries = await new Promise((resolve) => reader.readEntries(resolve));
            for (const subEntry of entries) {
                await processEntry(subEntry);
            }
        }
    }

    for (let i = 0; i < dataTransferItemList.length; i++) {
        const entry = dataTransferItemList[i].webkitGetAsEntry();
        await processEntry(entry);
    }

    return fileList;
},
async getFile(dataTransferItemList) {
    const fileList = [];
    async function processEntry(entry) {
        if (entry.isFile) {
            const res = await new Promise((resolve) => entry.file(resolve));
            fileList.push(res);
        } else if (entry.isDirectory) {
            const reader = entry.createReader();
            const entries = await new Promise((resolve) => reader.readEntries(resolve));
            for (const subEntry of entries) {
                await processEntry(subEntry);
            }
        }
    }

    for (let i = 0; i < dataTransferItemList.length; i++) {
        const entry = dataTransferItemList[i].webkitGetAsEntry();
        await processEntry(entry);
    }

    return fileList;
},