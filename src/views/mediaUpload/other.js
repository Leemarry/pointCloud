/*
 * @Date: 2024-08-19 16:00:49
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\views\mediaUpload\other.js
 * @Description: Do not edit
 */
const maxFileSize = 120 * 1024 * 1024; // 120MB in bytes
const filteredFiles = Array.from(files).filter(file => {
    const iscloud = this.fileType === 'cloud';
    const isorthoimg = this.fileType === 'orthoimg';
    const fileNameCheck = !file.name.includes('tif');
    const fileSizeCheck = file.size <= maxFileSize;
    return fileNameCheck || (fileSizeCheck && isorthoimg);
});

const batchSize = 5000; // 每批次处理 5000 个文件
for (let i = 0; i < filteredFiles.length; i += batchSize) {
    const batchFiles = filteredFiles.slice(i, i + batchSize);
    const tempFilelist = batchFiles.map(file => {
        const webkitRelativePath = file.webkitRelativePath || '';
        const folder = this.extractString(webkitRelativePath);
        return {
            file,
            folder,
            name: file.name,
            progress: 0,
            status: 'uploading'
        };
    });
    this.uploadTotalFilesList = [...this.uploadTotalFilesList, ...tempFilelist];
}