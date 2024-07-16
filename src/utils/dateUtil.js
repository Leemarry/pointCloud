export default {
    utc2beijingTimestamp(utc_datetime) {
        // 转为正常的时间格式 年-月-日 时:分:秒
        var T_pos = utc_datetime.indexOf('T');
        var Z_pos = utc_datetime.indexOf('Z');
        var year_month_day = utc_datetime.substr(0, T_pos);
        var hour_minute_second = utc_datetime.substr(T_pos + 1, Z_pos - T_pos - 1);
        var new_datetime = year_month_day + " " + hour_minute_second; // 2017-03-31 08:02:06
        // 处理成为时间戳
        timestamp = new Date(Date.parse(new_datetime));
        timestamp = timestamp.getTime();
        timestamp = timestamp / 1000;
        // 增加8个小时，北京时间比utc时间多八个时区
        var timestamp = timestamp + 8 * 60 * 60 // 时间戳 秒
        return timestamp * 1000
            // var beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString();
            // 时间戳转为时间
            // var beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
            // return beijing_datetime; // 2017-03-31 16:02:06
    },
    utc2beijing(utc_datetime) {
        // 转为正常的时间格式 年-月-日 时:分:秒
        var T_pos = utc_datetime.indexOf('T');
        var Z_pos = utc_datetime.indexOf('Z');
        var year_month_day = utc_datetime.substr(0, T_pos);
        var hour_minute_second = utc_datetime.substr(T_pos + 1, Z_pos - T_pos - 1);
        var new_datetime = year_month_day + " " + hour_minute_second; // 2017-03-31 08:02:06

        // 处理成为时间戳
        timestamp = new Date(Date.parse(new_datetime));
        timestamp = timestamp.getTime();
        timestamp = timestamp / 1000;

        // 增加8个小时，北京时间比utc时间多八个时区
        var timestamp = timestamp + 8 * 60 * 60 // 时间戳 秒
        return this.convertMillSecToDateStr(timestamp * 1000)
            // var beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString();
            // 时间戳转为时间
            // var beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
            // return beijing_datetime; // 2017-03-31 16:02:06
    },
    /**
     * 将当前时间戳转换为凌晨或昨天24点钟
     * @param {*} milliseconds 时间戳
     * @param {*} lastOrNewst last或newst,last为当前时间戳的0点0分0秒，newst为当前时间戳的23点59分59秒
     * @returns milliseconds
     */
    getDateZeroMilliseconds(milliseconds, lastOrNewst) {
        const date = new Date(milliseconds)
        var year = date.getFullYear() // 四位数年份
        var month = date.getMonth() // 月份(0-11),0为一月份
        var day = date.getDate() // 月的某一天(1-31)
        var hour = 0
        var minute = 0
        var second = 0
        if (lastOrNewst === 'last') {
            hour = 0
            minute = 0
            second = 0
        } else if (lastOrNewst === 'newst') {
            hour = 23
            minute = 59
            second = 59
        }
        const newDate = new Date(year, month, day, hour, minute, second)
        return newDate.getTime()
    },
    /**
     * 将秒数转换为友好的时间
     * @param {*} second 秒数
     * @returns 例：1.1分钟，0.3小时
     */
    convertSecondToFrendly(second) {
        let result = second + '秒'
        if (second >= 60) {
            result = (second / 60).toFixed(2) + '分钟'
        } else if (second >= 3600) {
            result = (second / 3600).toFixed(2) + '小时'
        }
        return result
    },
    // 转换为n天n小时n分n秒
    convertSecondToFrendly2(second_time) {
        var time = parseInt(second_time) + "秒";
        if (parseInt(second_time) > 60) {
            var second = parseInt(second_time) % 60;
            var min = parseInt(second_time / 60);
            time = min + "分" + second + "秒";
            if (min > 60) {
                min = parseInt(second_time / 60) % 60;
                var hour = parseInt(parseInt(second_time / 60) / 60);
                time = hour + "小时" + min + "分" + second + "秒";
                if (hour > 24) {
                    hour = parseInt(parseInt(second_time / 60) / 60) % 24;
                    var day = parseInt(parseInt(parseInt(second_time / 60) / 60) / 24);
                    time = day + "天" + hour + "小时" + min + "分" + second + "秒";
                }
            }
        }
        return time
    },
    // 转换为n天n小时n分
    convertSecondToFrendly3(second_time) {
        var time = parseInt(second_time) + "秒";
        if (parseInt(second_time) > 60) {
            var second = parseInt(second_time) % 60;
            var min = parseInt(second_time / 60);
            time = min + "分"
            if (min > 60) {
                min = parseInt(second_time / 60) % 60;
                var hour = parseInt(parseInt(second_time / 60) / 60);
                time = hour + "小时" + min + "分"
                if (hour > 24) {
                    hour = parseInt(parseInt(second_time / 60) / 60) % 24;
                    var day = parseInt(parseInt(parseInt(second_time / 60) / 60) / 24);
                    time = day + "天" + hour + "小时" + min + "分"
                }
            }
        }
        return time
    },
    /**
     * 将秒数转换为 hh:mm:ss
     * @param {*} second 秒数
     * @returns 例：00:10:30
     */
    convertSecondToTime(time) {
        if (!time) { time = 0 }
        let newTime, hour, minite, seconds
        if (time >= 3600) {
            hour = parseInt(time / 3600) < 10 ? '0' + parseInt(time / 3600) : parseInt(time / 3600)
            minite = parseInt(time % 60 / 60) < 10 ? '0' + parseInt(time % 60 / 60) : parseInt(time % 60 / 60)
            seconds = time % 3600 < 10 ? '0' + time % 3600 : time % 3600
            newTime = hour + ':' + minite + ':' + seconds
        } else if (time >= 60 && time < 3600) {
            minite = parseInt(time / 60) < 10 ? '0' + parseInt(time / 60) : parseInt(time / 60)
            seconds = time % 60 < 10 ? '0' + time % 60 : time % 60
            newTime = '00:' + minite + ':' + seconds
        } else if (time < 60) {
            seconds = time < 10 ? '0' + time : time
            newTime = '00:' + '00:' + seconds
        }
        return newTime
    },
    /**
     * 将毫秒时间戳转换为日期字符串
     * @param {将时间戳转换为} str 
     * @returns yyyy-MM-dd HH:mm:ss
     */
    convertMillSecToDateStr(time, format) {
        if (!time) {
            return '-'
        }
        var n = parseInt(time);
        var D = new Date(n);
        var year = D.getFullYear(); // 四位数年份

        var month = D.getMonth() + 1; // 月份(0-11),0为一月份
        month = month < 10 ? ('0' + month) : month;

        var day = D.getDate(); // 月的某一天(1-31)
        day = day < 10 ? ('0' + day) : day;

        var hours = D.getHours(); // 小时(0-23)
        hours = hours < 10 ? ('0' + hours) : hours;

        var minutes = D.getMinutes(); // 分钟(0-59)
        minutes = minutes < 10 ? ('0' + minutes) : minutes;

        var seconds = D.getSeconds() // 秒(0-59)
        seconds = seconds < 10 ? ('0' + seconds) : seconds

        var milliseconds = D.getMilliseconds(); // 毫秒(0-999)
        if (milliseconds < 10) {
            milliseconds = '00' + milliseconds
        } else if (milliseconds < 100) {
            milliseconds = '0' + milliseconds
        }
        var now_time = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
        if (format !== undefined) {
            if (!format || format.indexOf('sss') >= 0) {
                now_time += '.' + milliseconds
            }
        }
        // var week = D.getDay();//周几(0-6),0为周日
        // var weekArr = ['周日','周一','周二','周三','周四','周五','周六'];
        // var now_time = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
        return now_time
    },
    /**
     * 将秒时间戳转换为日期字符串
     * @param {将时间戳转换为} str 
     * @returns yyyy-MM-dd HH:mm:ss
     */
    convertSecToDateStr(time, format) {
        if (!time) {
            return '-'
        }
        return this.convertMillSecToDateStr(parseInt(time) * 1000, format);
    },
    /**
     * 将毫秒时间戳转换为日期字符串
     * @param {将时间戳转换为} str 
     * @returns 2022年02月02日
     */
    convertMillSecToYYYYMMDD(time) {
        if (!time || time == null || time === 0) return '-';
        var n = parseInt(time);
        var D = new Date(n);
        var year = D.getFullYear(); // 四位数年份

        var month = D.getMonth() + 1; // 月份(0-11),0为一月份
        month = month < 10 ? ('0' + month) : month;

        var day = D.getDate(); // 月的某一天(1-31)
        day = day < 10 ? ('0' + day) : day;

        var now_time = year + '年' + month + '月' + day + '日'
        return now_time
    },
    /**
     * 将毫秒时间戳转换为文件名称
     * @param {将时间戳转换为} str 
     * @returns yyyy-MM-dd HH:mm:ss
     */
    convertMillSecToFileName(time) {
        if (!time || time == null || time === 0) return time;
        var n = parseInt(time);
        var D = new Date(n);
        var year = D.getFullYear(); // 四位数年份

        var month = D.getMonth() + 1; // 月份(0-11),0为一月份
        month = month < 10 ? ('0' + month) : month;

        var day = D.getDate(); // 月的某一天(1-31)
        day = day < 10 ? ('0' + day) : day;

        var hours = D.getHours(); // 小时(0-23)
        hours = hours < 10 ? ('0' + hours) : hours;

        var minutes = D.getMinutes(); // 分钟(0-59)
        minutes = minutes < 10 ? ('0' + minutes) : minutes;

        var seconds = D.getSeconds() // 秒(0-59)
        seconds = seconds < 10 ? ('0' + seconds) : seconds

        var now_time = year + '年' + month + '月' + day + '日' + hours + minutes + seconds
        return now_time
    }
}