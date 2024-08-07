/*
 * @Date: 2024-07-30 13:18:59
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\views\mediaUpload\upload.js
 * @Description: Do not edit
 */
import { getToken } from '@/utils/auth' // get token from cookie
export function uploadFile(file, type = '', createTime = new Date()) {
    var formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('createTime', createTime);
    // 创建 XMLHttpRequest 对象
    var xhr = new XMLHttpRequest();

    // 监听上传进度事件
    xhr.upload.addEventListener('progress', function(event) {
        if (event.lengthComputable) {
            var percentComplete = (event.loaded / event.total) * 100;
            console.log('上传进度：' + percentComplete + '%');
        }
    });
    // 发送请求
    xhr.open('POST', '/media/minio/upload');
    xhr.setRequestHeader('token', getToken());
    xhr.send(formData);
}

export function uploadFiles(file, uploadFilesList, url) {
    return new Promise((resolve, reject) => {
        var formData = new FormData();
        formData.append('file', file.raw);
        formData.append('type', 'image');
        formData.append('createTime', new Date());
        var xhr = new XMLHttpRequest();
        var index = uploadFilesList.findIndex(item => item === file);
        xhr.upload.addEventListener('progress', function(event) {
            if (event.lengthComputable) {
                var percentComplete = (event.loaded / event.total) * 100;
                console.log('上传进度：', index, uploadFilesList, xhr, percentComplete + '%');
                uploadFilesList[index].progress = percentComplete;
                // 将xhr状态给对应文件ploadFilesList[index].status = xhr.readyState;
                uploadFilesList[index].status = xhr.readyState;
            }
        });
        // 绑定状态改变的监听
        xhr.onreadystatechange = function() {
            // 如果请求没有完成, 直接结束
            if (xhr.readyState !== 4) {
                return
            }
            // 如果响应状态码在[200, 300)之间代表成功, 否则失败
            const { status, statusText } = xhr
            // 2.1. 如果请求成功了, 调用resolve()
            if (status >= 200 && status <= 299) {
                // 准备结果数据对象response
                const response = {
                    data: JSON.parse(xhr.response),
                    status,
                    statusText
                }
                resolve(response)
            } else { // 2.2. 如果请求失败了, 调用reject()
                reject(new Error('request error status is ' + status))
            }
        }
        // 发送请求
        xhr.open('POST', url);
        xhr.setRequestHeader('token', getToken());
        xhr.send(formData);
    });
}
export function uploadFile1(file, type = '', createTime = new Date()) {
    return new Promise((resolve, reject) => {
        var formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        formData.append('createTime', createTime);

        // 创建 XMLHttpRequest 对象
        var xhr = new XMLHttpRequest();

        // 监听上传进度事件
        xhr.upload.addEventListener('progress', function(event) {
            if (event.lengthComputable) {
                var percentComplete = (event.loaded / event.total) * 100;
                console.log('上传进度：' + percentComplete + '%');
            }
        });

        // 监听上传完成事件
        xhr.addEventListener('load', function() {
            if (xhr.status === 200) {
                resolve(xhr.responseText);
            } else {
                reject({ status: xhr.status, response: xhr.responseText });
            }
        });

        // 发送请求
        xhr.open('POST', '/media/minio/upload');
        xhr.setRequestHeader('token', getToken());
        xhr.send(formData);
    });
}
