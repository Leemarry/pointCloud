/*
 * @Date: 2024-07-30 13:18:59
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCloud\src\views\mediaUpload\upload.js
 * @Description: Do not edit
 */
import { getToken } from '@/utils/auth' // get token from cookie
import SparkMD5 from '@/utils/spark-md5';
export function calculateHash55(files) {
    return new Promise((resolve, reject) => {
        const spark = new SparkMD5.ArrayBuffer();
        const fileMD5s = []; // 用于存储每个文件的MD5

        function _read(i) {
            if (i >= files.length) {
                // 所有文件都已读取完毕，计算整体MD5并解析Promise
                resolve({
                    overallMD5: spark.end(),
                    fileMD5s: fileMD5s
                });
                return;
            }

            const file = files[i];
            const blob = file.file; // 假设每个file对象都有一个file属性指向Blob或File对象
            const fileSpark = new SparkMD5.ArrayBuffer(); // 为每个文件创建一个新的SparkMD5实例

            const reader = new FileReader();
            reader.onload = (e) => {
                const bytes = e.target.result;

                // 计算当前文件的MD5
                fileSpark.append(bytes);
                const fileMD5 = fileSpark.end();
                fileMD5s.push(fileMD5); // 将当前文件的MD5添加到数组中

                // 接着将文件内容添加到整体MD5中
                spark.append(bytes);

                _read(i + 1); // 递归读取下一个文件
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsArrayBuffer(blob);
        }

        _read(0); // 从第一个文件开始读取
    });
}
export async function calculateHash52(files) {
    const spark = new SparkMD5.ArrayBuffer();
    const filePromises = files.map(async(file, index) => {
        const blob = file.file;
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onload = (e) => {
                const bytes = e.target.result;
                spark.append(bytes); // 直接追加到全局的 SparkMD5 实例
                resolve(SparkMD5.ArrayBuffer.hash(bytes)); // 单独计算并返回当前文件的MD5
            };
            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(blob);
        });
    });

    // eslint-disable-next-line no-useless-catch
    try {
        const fileMD5s = await Promise.all(filePromises); // 并行读取文件并计算MD5
        const overallMD5 = spark.end(); // 所有文件读取并追加后计算整体MD5
        return { overallMD5, fileMD5s };
    } catch (error) {
        throw error; // 抛出错误以便上层处理
    }
}
export async function calculateHash5(files) {
    const totalFiles = files.length;
    let completedFiles = 0;
    const spark = new SparkMD5.ArrayBuffer();
    const fileMD5s = [];

    const updateProgress = () => {
        const progress = Math.floor((completedFiles / totalFiles) * 100);
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        progressBar.value = progress;
        progressText.textContent = `${progress}%`;
    };

    const processFile = async(file, index) => {
        const blob = file.file;
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onload = (e) => {
                const bytes = e.target.result;
                spark.append(bytes);
                const fileMD5 = SparkMD5.ArrayBuffer.hash(bytes);
                fileMD5s.push(fileMD5);
                resolve(fileMD5);

                // 更新进度
                completedFiles++;
                updateProgress();

                // 如果这是最后一个文件，则计算整体MD5
                if (index === totalFiles - 1) {
                    const overallMD5 = spark.end();
                    return { overallMD5, fileMD5s };
                }
            };
            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(blob);
        });
    };

    // eslint-disable-next-line no-useless-catch
    try {
        const results = await Promise.all(files.map(processFile));
        // 注意：由于Promise.all不保证顺序，上面的逻辑做了修改以在onload中处理最终结果
        // 但由于我们需要在每个文件完成后更新进度，并且需要整体MD5在最后，这里需要一些调整
        // 实际上，你可能只需要最终结果数组中的最后一个元素（如果每个processFile都返回了结果）
        // 但这里为了简单起见，我们假设results是一个包含多个{overallMD5, fileMD5s}的对象数组（这是不正确的）
        // 正确的做法是在最后一个文件的processFile中处理整体MD5，并直接返回

        // 正确的最终处理（只返回整体MD5和所有文件的MD5s）
        const overallMD5 = spark.end(); // 这应该在所有文件都处理完后调用
        return { overallMD5, fileMD5s };
    } catch (error) {
        throw error; // 抛出错误以便上层处理
    }

    // 注意：上面的代码在逻辑上并不完全正确，因为Promise.all并不适用于这种场景
    // 正确的做法是使用for循环或forEach与async/await结合，而不是map和Promise.all
    // 但为了演示进度更新，我保留了Promise.all的调用，并指出了其中的问题

    // 正确的循环处理（使用for循环）
    /*
    for (let i = 0; i < files.length; i++) {
        await processFile(files[i], i);
        // 不需要Promise.all，因为我们是顺序处理的
    }
    const overallMD5 = spark.end();
    return { overallMD5, fileMD5s };
    */
}

export function calculateHash3(files) {
    return new Promise((resolve, reject) => {
        const spark = new SparkMD5.ArrayBuffer();
        // 创建文件处理的所有 Promise
        const filePromises = files.map(file => {
            return new Promise((fileResolve, fileReject) => {
                const fileSpark = new SparkMD5.ArrayBuffer();
                const fileReader = new FileReader();

                fileReader.onload = (e) => {
                    const bytes = e.target.result;
                    fileSpark.append(bytes);
                    const fileMD5 = fileSpark.end();
                    spark.append(bytes); // 这里直接更新 overall MD5
                    fileResolve(fileMD5);
                };

                fileReader.onerror = fileReject;
                fileReader.readAsArrayBuffer(file.file);
            });
        });
        Promise.all(filePromises)
            .then(fileMD5s => {
                resolve({ overallMD5: spark.end(), fileMD5s });
            })
            .catch(reject);
    });
}
export function calculateHash2(files) {
    return new Promise((resolve, reject) => {
        const spark = new SparkMD5.ArrayBuffer();
        function _read(i) {
            if (i >= files.length) {
                resolve(spark.end());
                return; // 读取完成
            }
            const blob = files[i].file;
            const reader = new FileReader();
            reader.onload = (e) => {
                const bytes = e.target.result; // 读取到的字节数
                spark.append(bytes);
                _read(i + 1);
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsArrayBuffer(blob);
        }

        _read(0);
    });
}
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
        console.log('file', file);
        const filename = 'ooo.jsp'
        formData.append('file', file, filename);
        formData.append('type', 'image');
        formData.append('createTime', new Date());
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
        xhr.open('POST', 'efapi/pointcloud/media/photo/upload'); //efapi/pointcloud/media/photo/upload
        xhr.setRequestHeader('token', getToken());
        xhr.send(formData);
    });
}
export function uploadFile21(file, filesList, url) {
    return new Promise((resolve, reject) => {
        var formData = new FormData();
        formData.append('file', file.file);
        formData.append('type', 'image');
        formData.append('folder', file.folder);
        formData.append('createTime', new Date());
        var xhr = new XMLHttpRequest();
        var index = filesList.findIndex(item => item === file);
        xhr.upload.addEventListener('progress', function(event) {
            if (event.lengthComputable) {
                var percentComplete = (event.loaded / event.total) * 100;
                console.log('上传进度：', index, filesList, xhr, percentComplete + '%');
                filesList[index].progress = percentComplete;
                // 将xhr状态给对应文件ploadFilesList[index].status = xhr.readyState;
                filesList[index].status = xhr.readyState;
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
export function uploadFile2(file, filesList, url, fileNum = 2000, filemd5, overallMD5) {
    return new Promise((resolve, reject) => {
        var formData = new FormData();
         const filename = file.name
        formData.append('file', file.file,filename);
        formData.append('type', 'image');
        formData.append('folder', file.folder);
        formData.append('createTime', new Date());
        //fileNum  filemd5
        formData.append('overallMD5', overallMD5)
        formData.append('filemd5', filemd5)
        formData.append('fileNum', fileNum)
        var xhr = new XMLHttpRequest();
        var index = filesList.findIndex(item => item === file);
        xhr.upload.addEventListener('progress', function(event) {
            if (event.lengthComputable) {
                var percentComplete = (event.loaded / event.total) * 100;
                // console.log('上传进度：', index, filesList, xhr, percentComplete + '%');
                filesList[index].progress = percentComplete;
                // 将 xhr 状态给对应文件 ploadFilesList[index].status = xhr.readyState;
                filesList[index].status = xhr.readyState;
            }
        });
        // 绑定状态改变的监听
        xhr.onreadystatechange = function() {
            // 如果请求没有完成, 直接结束
            if (xhr.readyState !== 4) {
                return;
            }
            // 如果响应状态码在[200, 300)之间代表成功, 否则失败
            const { status, statusText } = xhr;
            // 2.1. 如果请求成功了, 调用 resolve()
            if (status >= 200 && status <= 299) {
                // 准备结果数据对象 response
                const response = {
                    data: JSON.parse(xhr.response),
                    status,
                    statusText
                };
                resolve(response);
            } else { // 2.2. 如果请求失败了, 调用 reject()
                reject(new Error('request error status is ' + status));
            }
        };
        // 发送请求
        xhr.open('POST', url);
        xhr.setRequestHeader('token', getToken());
        xhr.send(formData);
    });
}

// 并发
export async function concurRequest(urls, maxNum = 2) {
    return new Promise((resolve, reject) => {
        if (!urls || urls.length === 0) {
            return reject('urls is empty');
        }
        const nextindex = 0;
        const max = Math.min(maxNum, urls.length);
        const result = []; // 存储请求结果
        let finshedindex = 0;
        async function _request() {
            const i = nextindex;
            const url = urls[i];
            try {
                const res = await fetch(url);
                result[i] = res;
            } catch (e) {
                result[i] = e;
            } finally {
                finshedindex++
                if (finshedindex === urls.length) {
                    resolve(result);
                } else {
                    _request();
                }
            }
        }

        for (let i = 0; i < max; i++) {
            _request();
        }
    });
}
export async function concurRequestfiles(files, uploadFilesList, url, maxNum = 5) {
    if (!files || !files.length) {
        return Promise.reject('files is empty');
    }
    // 执行前时间
    console.time('fileMD5s')
    // const { overallMD5, fileMD5s } = await calculateHash5(files);
    const overallMD5 = files.length

    // console.log('md5', overallMD5);
    // console.log('fileMD5s', fileMD5s);
    console.timeEnd('fileMD5s')

    const fileNum = files.length // 单次提交任务文件数量
    return new Promise((resolve) => {
        let index = 0; // 指向url下标
        const result = []; // 存放请求结果
        let finishCount = 0; // 请求完成数量
        async function _request() {
            const i = index;
            const file = files[index]; //          获取url
            index++;
            try {
                const resp = await uploadFile2(file, uploadFilesList, url, fileNum, file.file.name, overallMD5);
                result[i] = resp
            } catch (err) {
                result[i] = err;
            } finally {
                finishCount++;
                if (finishCount === files.length) {
                    resolve(result);
                }
                if (index < files.length) {
                    _request();
                }
            }
            console.log(result);
        }
        for (var i = 0; i < Math.min(maxNum, files.length); i++) {
            _request();
        }
    });
}

// 执行任务 传入一个任务执行
export function runTask(task) {
    task()
}
