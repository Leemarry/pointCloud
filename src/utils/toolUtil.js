export default {
    getEmptyImage() {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCA2NCA0MSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxKSIgZmlsbD0ibm9uZSIgZmlsbFJ1bGU9ImV2ZW5vZGQiPg0KICAgIDxlbGxpcHNlIGZpbGw9IiNkZGQiIGN4PSIzMiIgY3k9IjMzIiByeD0iMzIiIHJ5PSI3IiAvPg0KICAgIDxnIGZpbGxSdWxlPSJub256ZXJvIiBzdHJva2U9IiM5OTkiPg0KICAgICAgPHBhdGgNCiAgICAgICAgZD0iTTU1IDEyLjc2TDQ0Ljg1NCAxLjI1OEM0NC4zNjcuNDc0IDQzLjY1NiAwIDQyLjkwNyAwSDIxLjA5M2MtLjc0OSAwLTEuNDYuNDc0LTEuOTQ3IDEuMjU3TDkgMTIuNzYxVjIyaDQ2di05LjI0eiIgLz4NCiAgICAgIDxwYXRoDQogICAgICAgIGQ9Ik00MS42MTMgMTUuOTMxYzAtMS42MDUuOTk0LTIuOTMgMi4yMjctMi45MzFINTV2MTguMTM3QzU1IDMzLjI2IDUzLjY4IDM1IDUyLjA1IDM1aC00MC4xQzEwLjMyIDM1IDkgMzMuMjU5IDkgMzEuMTM3VjEzaDExLjE2YzEuMjMzIDAgMi4yMjcgMS4zMjMgMi4yMjcgMi45Mjh2LjAyMmMwIDEuNjA1IDEuMDA1IDIuOTAxIDIuMjM3IDIuOTAxaDE0Ljc1MmMxLjIzMiAwIDIuMjM3LTEuMzA4IDIuMjM3LTIuOTEzdi0uMDA3eiINCiAgICAgICAgZmlsbD0iI2UxZTFlMSIgLz4NCiAgICA8L2c+DQogIDwvZz4NCjwvc3ZnPg=='
    },
    setNotopt(chart, subtext = '暂无数据') {
        var option = {
            title: {
                text: ' {a|}',
                x: 'center',
                y: 'center',
                subtext,
                itemGap: -20,
                textStyle: {
                    rich: {
                        a: {
                            color: '#000',
                            fontSize: '16',
                            height: 80,
                            width: 160,
                            backgroundColor: {
                                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCA2NCA0MSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxKSIgZmlsbD0ibm9uZSIgZmlsbFJ1bGU9ImV2ZW5vZGQiPg0KICAgIDxlbGxpcHNlIGZpbGw9IiNkZGQiIGN4PSIzMiIgY3k9IjMzIiByeD0iMzIiIHJ5PSI3IiAvPg0KICAgIDxnIGZpbGxSdWxlPSJub256ZXJvIiBzdHJva2U9IiM5OTkiPg0KICAgICAgPHBhdGgNCiAgICAgICAgZD0iTTU1IDEyLjc2TDQ0Ljg1NCAxLjI1OEM0NC4zNjcuNDc0IDQzLjY1NiAwIDQyLjkwNyAwSDIxLjA5M2MtLjc0OSAwLTEuNDYuNDc0LTEuOTQ3IDEuMjU3TDkgMTIuNzYxVjIyaDQ2di05LjI0eiIgLz4NCiAgICAgIDxwYXRoDQogICAgICAgIGQ9Ik00MS42MTMgMTUuOTMxYzAtMS42MDUuOTk0LTIuOTMgMi4yMjctMi45MzFINTV2MTguMTM3QzU1IDMzLjI2IDUzLjY4IDM1IDUyLjA1IDM1aC00MC4xQzEwLjMyIDM1IDkgMzMuMjU5IDkgMzEuMTM3VjEzaDExLjE2YzEuMjMzIDAgMi4yMjcgMS4zMjMgMi4yMjcgMi45Mjh2LjAyMmMwIDEuNjA1IDEuMDA1IDIuOTAxIDIuMjM3IDIuOTAxaDE0Ljc1MmMxLjIzMiAwIDIuMjM3LTEuMzA4IDIuMjM3LTIuOTEzdi0uMDA3eiINCiAgICAgICAgZmlsbD0iI2UxZTFlMSIgLz4NCiAgICA8L2c+DQogIDwvZz4NCjwvc3ZnPg=='
                            }
                        },
                    }
                },
                subtextStyle: {
                    fontSize: 16
                }
            }
        }
        chart.setOption(option, true)
    },
    /**
     * 将米转换
     * @param {*} meter 距离米
     * @returns 例：50米，0.5千米
     */
    convertMeterToFrendly(meter) {
        let result = meter + '米'
        if (meter >= 500) {
            result = (meter / 1000).toFixed(2) + '千米'
        }
        return result
    },
    convertBytesToFrendly(length, needUnit) {
        let addUnit = false
        if (needUnit) {
            addUnit = needUnit
        }
        let result = 0;
        if (length >= 1073741824) { result = (length / 1073741824).toFixed(2) + addUnit ? " GB" : ""; } else if (length >= 1048576) { result = (length / 1048576).toFixed(2) + addUnit ? " MB" : ""; } else if (length >= 1024) { result = (length / 1024).toFixed(2) + addUnit ? " KB" : ""; } else if (length > 1) { result = length + addUnit ? " bytes" : ""; } else if (length == 1) { result = length + addUnit ? " byte" : ""; } else { result = "0" + addUnit ? " bytes" : ""; }
        return result;
    },
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },
    // 对象深度拷贝
    copyDeep(obj) {
        let newObj = null
        if (typeof obj === 'object' && obj !== null) {
            newObj = obj instanceof Array ? [] : {}
            for (const i in obj) {
                newObj[i] = typeof obj[i] === 'object' ? this.copyDeep(obj[i]) : obj[i]
            }
        } else {
            newObj = obj
        }
        return newObj
    },
    // 图片对象转换为base64
    async convertImageToBase64(file) {
        return new Promise(function(resolve, reject) {
            const reader = new FileReader()
            let imgResult = ''
            reader.readAsDataURL(file)
            reader.onload = function() {
                imgResult = reader.result
            }
            reader.onerror = function(error) {
                reject(error)
            }
            reader.onloadend = function() {
                resolve(imgResult)
            }
        });
    }
}