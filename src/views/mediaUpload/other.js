/*
 * @Date: 2024-08-19 16:00:49
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\views\mediaUpload\other.js
 * @Description: Do not edit
 */

export function fileRule(file, type) {
    let fileName = file.name;
    fileName = fileName.substring(fileName.lastIndexOf('.'))
    let flag = true;
    
    if (type === 'image') {
        const suffix = (fileName.toLowerCase() === '.jpg' || fileName.toLowerCase() === '.png');
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isGIF = file.type === 'image/gif';
        const isLt15M = file.size / 1024 / 1024 < 15;
        if (!isJPG && !isPNG && !isGIF && !suffix) {
            flag = false;
            // this.$message.error('上传图片只能是 JPG、PNG')
            return flag;
        }
        if (!isLt15M) {
            flag = false;
            this.$message.error('上传文件大小不能超过 15MB!');
            return flag;
        }
    } else if (type === 'video') {
        const isMP4 = file.type === 'video/mp4';
        const suffix = (fileName.toLowerCase() === '.mp4' || fileName.toLowerCase() === '.mp3');
        if (!isMP4 && !suffix) {
            flag = false;
            this.$message.error('上传视频只能是 音频 格式!');
            return flag;
        }
    } else if (type === 'report') {
        const suffix = (fileName.toLowerCase() === '.doc' || fileName.toLowerCase() === '.docx' || fileName.toLowerCase() === '.pdf' || fileName.toLowerCase() === '.xls' || fileName.toLowerCase() === '.xlsx');
        if (!suffix) {
            flag = false;
            this.$message.error('上传报告只能是 文档doc, docx, pdf, xls, xlsx格式!');
            return flag;
        }
    } else if (type === 'orthoimg') {
        const suffix = (fileName.toLowerCase() === '.tif' || fileName.toLowerCase() === '.tiff');
        if (!suffix) {
            flag = false;
            this.$message.error('上传图像只能是 tif, tiff格式!');
            return flag;
        }
    } else if (type === 'cloud') {
        // 只能是压缩包类
        const suffix = (fileName.toLowerCase() === '.zip' || fileName.toLowerCase() === '.rar' || fileName.toLowerCase() === '.7z');
        if (!suffix) {
            flag = false;
            this.$message.error('上传点云请先压缩 zip, rar, 7z格式!');
            return flag;
        }
    }
    // else if (type === 'cloud') {
    //     const suffix = (fileName.toLowerCase() === '.pnts' || fileName.toLowerCase() === '.pnts');
    //     if (!suffix) {
    //         flag = false;
    //         this.$message.error('上传点云只能是 pnts 格式!');
    //         return flag;
    //     }
    // }
    return flag;
}
