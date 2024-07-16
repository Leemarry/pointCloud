/**
 * import { getDefaultObj, getDefaultData, switchNode, time ,getTimeRange  ,timeRangeMap} from "@/utils/currency"
// import * as currency from '@/utils/currency';
 */

import { login } from "@/api/user";




//#region -----------------------------------------------------意义不大------------------------------------------------------------------

export const userDB = {
  "user1": {
    name: "Alice",
    age: 30
  },
  "user2": {
    name: "Bob",
    age: 25
  }
};



//#endregion

//#region  -----------------------------------------------------  数组处理  ------------------------------------------------------------------

// 提取 kmzName 的前缀
function extractPrefix(kmzName) {
  return kmzName.split('（')[0]; // 使用括号内的内容作为前缀
}
// 将具有相同前缀的项排在一起
function sortDataByPrefix(data) {
  const groupedData = {};
  data.forEach(item => {
    const prefix = extractPrefix(item.kmzName);
    if (!groupedData[prefix]) {
      groupedData[prefix] = [];
    }
    groupedData[prefix].push(item); // 这一步  
  });

  const sortedData = [];
  Object.values(groupedData).forEach(group => {
    group.sort(customSort)
    sortedData.push(...group);
  });

  return sortedData;
}

/**
 * @name: 
 * @msg: 自定义的排序函数 
 * @param {*} a
 * @param {*} b
 * @return {*}
 */
function customSort(a, b) {
  const prefixA = a.kmzName.split('（')[0];
  const prefixB = b.kmzName.split('（')[0];
  const suffixA = a.kmzName.split('（')[1];
  const suffixB = b.kmzName.split('（')[1];

  if (prefixA !== prefixB) {
    return prefixB.localeCompare(prefixA);
  } else {
    const numA = parseInt(suffixA.split('-')[0]);
    const numB = parseInt(suffixB.split('-')[0]);
    return numA - numB;

  }
}
// const sortedData = sortDataByPrefix(data);
export { extractPrefix, sortDataByPrefix, customSort }





//#endregion


//# 拷贝
//#region 
//#endregion


//#region -----------------------------------------------------  时间  ------------------------------------------------------------------
/**
 * 将时间戳转换为格式化日期字符串
 * @param {number} shijianchuo - 时间戳，单位毫秒
 * @returns {string} 格式化后的日期字符串，例如 "2024年04月10日 12:30:15"
 */
export function time(shijianchuo) {
  //shijianchuo是整数，否则要parseInt转换
  var time = new Date(shijianchuo);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return y + '年' + add0(m) + '月' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}
function add0(m) {
  return m < 10 ? '0' + m : m
}


//#endregion
const timeRangeMap = {
  1: {
    startTime: Date.now() - 6 * 30 * 24 * 60 * 60 * 1000, // 默认有效期，半年
    endTime: Date.now()
  },
  2: {
    startTime: Date.now() - 7 * 24 * 60 * 60 * 1000, // 默认有效期，一周
    endTime: Date.now(),
  },
  3: {
    startTime: Date.now() - 30 * 24 * 60 * 60 * 1000, // 默认有效期，一月
    endTime: Date.now(),
  },
}
export { timeRangeMap };


/**
 * 根据给定的键值获取预定义的时间范围。
 * @param {number} key - 一个数字，表示预定义时间范围的键值。
 * @returns {Array} - 返回一个包含开始时间和结束时间的数组。
 * @throws {Error} - 如果提供的键值对应的时间范围不存在，则抛出错误。
 * @example
 * // 返回一个包含开始时间和结束时间的数组，表示默认有效期为半年的时间范围
 * getTimeRangeByKey(1);
 * 
 * // 返回一个包含开始时间和结束时间的数组，表示默认有效期为一周的时间范围
 * getTimeRangeByKey(2);
 * 
 * // 返回一个包含开始时间和结束时间的数组，表示默认有效期为一个月的时间范围
 * getTimeRangeByKey(3);
 */
export function getTimeRangeByKey(key) {
  const timeRangeMap = {
    1: {
      startTime: Date.now() - 6 * 30 * 24 * 60 * 60 * 1000, // 默认有效期，半年
      endTime: Date.now()
    },
    2: {
      startTime: Date.now() - 7 * 24 * 60 * 60 * 1000, // 默认有效期，一周
      endTime: Date.now(),
    },
    3: {
      startTime: Date.now() - 30 * 24 * 60 * 60 * 1000, // 默认有效期，一月
      endTime: Date.now(),
    },
  }
  const range = timeRangeMap[key];
  if (!range) {
    throw new Error('Invalid key for time range');
  }
  return [range.startTime, range.endTime];
}

/**
 * 根据给定的时间选择和选项生成时间范围。
 * ["2024-04-02 00:00:00","2024-04-13 23:59:59"]
 * @param {Array} choiseTime - 一个包含开始和结束时间的数组，可选。如果提供，则使用该时间范围。数组的第一个元素是开始时间，第二个元素是结束时间。
 * @param {boolean} choiseTimeRange - 一个布尔值，指示是否应生成一个月前的时间范围。如果为 true，则生成一个月前的时间范围；如果为 false，则生成一周前的时间范围。
 * @returns {Array} - 返回一个包含开始时间和结束时间的数组。
 * @throws {Error} - 如果提供的键值对应的时间范围不存在，则抛出错误。
 * @example
 * // 返回一个包含开始时间和结束时间的数组，表示一周前的时间范围
 * getTimeRange([], false);
 *
 * // 返回一个包含开始时间和结束时间的数组，表示一个月前的时间范围
 * getTimeRange([], true);
 */
export function getTimeRange(choiseTime, choiseTimeRange) {
  const now = Date.now();
  let startTime, endTime;

  // choiseTimeRange  isOneMonthAgo 
  if (choiseTimeRange) {
    startTime = choiseTime && choiseTime[0] ? new Date(choiseTime[0]).getTime() : (now - 30 * 24 * 60 * 60 * 1000);
    endTime = choiseTime && choiseTime[1] ? new Date(choiseTime[1]).getTime() : now;
  } else {
    startTime = choiseTime && choiseTime[0] ? new Date(choiseTime[0]).getTime() : (now - 7 * 24 * 60 * 60 * 1000);
    endTime = choiseTime && choiseTime[1] ? new Date(choiseTime[1]).getTime() : now;
  }

  return [startTime, endTime];
}


/**
 * 在给定的对象数组中根据指定的键值对查找并返回对应的对象，如果未提供键值对，则返回第一个对象。
 * @param {Array<Object>} objArray - 对象数组
 * @param {string} key - 要查找的键
 * @param {*} defaultKey - 要查找的键对应的默认值
 * @returns {Object|undefined} 如果找到匹配的对象，则返回该对象；否则返回 undefined。
 * @example
 * // 在对象数组中根据 'id' 键值对查找并返回对应的对象 或者  索引
 * const objArray = [{ id: 1, name: 'Object 1' }, { id: 2, name: 'Object 2' }];
 * const result = setDefaultObj(objArray, 'id', 2);
 * console.log(result); // 输出: { id: 2, name: 'Object 2' }
 */
export function getDefaultObj(objArray, key, defaultKey, fuType = 'find') {
  return objArray[fuType](obj => {
    return obj[key] === defaultKey;
  });
}



/**
 * @name: 通过key获取localStorage的值(let key = "defaultUav-" + this.userId;)
 * @msg: 在调用 setDefaultData 方法时，你需要传递这些参数，然后它将根据 localStorage 中的数据状态来设置或获取默认值，并确保默认值在 objArray 中存在
 * @param {String} key - 用于存储在 localStorage 中的键名，以唯一标识数据。
 * @param {Array} objArray - 包含对象的数组，用于检查默认数据是否存在于其中。
 * @param {String} objKey - 指定要检查的对象属性，用于对比和存储。
 * @return {String}
 */
export function getDefaultData(key, objArray, objKey) {
  var isExist = localStorage.getItem(key);
  if (!isExist) {
    localStorage.setItem(key, objArray[0][objKey]);
  } else {
    let localStorageData = localStorage.getItem(key);
    if (!objArray.some(obj => obj[objKey] === localStorageData)) {
      localStorage.setItem(key, objArray[0][objKey]);
    }
  }
  return localStorage.getItem(key);
}


/**
* @name: 
* @msg: 校验是否存储 返回
* @param {*} data 对象数组 
* @param {*} key  localStorge的key
* @param {*} compareField 对比属性
* @param {*} defaultValueField 存储的默认属性
* @param {*} returnType  判断返回类型
* @return {*}
*/
export function updateDefaultValueField(data, key, compareField, defaultValueField, returnType) {
  if (!data || data.length <= 0) {
    return false;
  }
  var isExist = localStorage.getItem(key)
  if (!isExist) {
    localStorage.setItem(key, data[0][defaultValueField])
  } else {
    let localStorageValue = localStorage.getItem(key)
    const flog = data.some(item => {
      return item[compareField] === localStorageValue;
    });
    if (!flog) {
      localStorage.setItem(key, data[0][defaultValueField])
    }
  }
  if (returnType === Object) {
    // 返回对应的对象
    const localStorageItem = localStorage.getItem(key);
    const result = data.find(item => {
      return item[compareField] === localStorageItem;
    });
    return result;
  } else {
    // 返回属性的值
    return localStorage.getItem(key);
  }
}


/**
 * @name: 
 * @msg: 
 * @param {*} first
 * @param {*} second
 * @return {*}
 */
export function isEqual(first, second) {
  if (first === undefined && second === undefined) {
    return true;
  } else if (first === null && second === null) {
    return true;
  }

  if (typeof first !== 'object' || typeof second !== 'object') { return first === second; }

  const arr1 = Object.keys(first);
  const arr2 = Object.keys(second);

  if (arr1.length !== arr2.length) return false;

  for (const key in first) {
    if (!second.hasOwnProperty(key)) return false;

    if (!isEqual(first[key], second[key])) return false;
  }

  return true;
}

//# dom 处理操作
//#region  ------------------------------------------------------------ dom 处理操作-------------------------------------------------------------------

/**两个dom交互位置 */
export function switchNode(div2, div5) {
  // 保存 div2 的兄弟节点和父节点
  var div2NextSibling = div2.nextSibling;
  var div2Parent = div2.parentNode;

  // 保存 div5 的兄弟节点和父节点
  var div5NextSibling = div5.nextSibling;
  var div5Parent = div5.parentNode;

  // 将 div5 移动到 div2 的位置
  div2Parent.insertBefore(div5, div2NextSibling);

  // // 将 div2 移动到 div5 的位置
  div5Parent.insertBefore(div2, div5NextSibling);
}
/**
 * 创建并触发下载多个文件的元素。
 * 
 * 该函数为每个 Blob 对象创建一个不可见的 <a> 元素，并设置其 `href` 属性为 Blob 对象的 URL，以及设置 `download` 属性为提供的文件名。
 * 然后，模拟点击每个 <a> 元素以触发文件下载。下载完成后，清理创建的 URL 和临时 DOM 元素。
 * 
 * @param {Blob[]} blobArray - 包含要下载的文件内容的 Blob 对象数组。
 * @param {string[]} [filenames=[]] - 与 blobArray 中的 Blob 对象相对应的文件名数组。如果未提供，则文件名将为空。
 */
export function createElementTodownload2(blobArray, filenames = []) {
  var fragment = document.createDocumentFragment();
  var container = document.createElement('div'); // 创建一个临时容器
  const blobUrlList = []
  blobArray.forEach((blob, index) => {
    var element = document.createElement('a');
    const blobUrl = URL.createObjectURL(blob);
    element.setAttribute('href', blobUrl);
    element.setAttribute('download', filenames[index] || ''); // 设置文件名，如果未提供则为空
    element.style.display = 'none';
    container.appendChild(element);
    blobUrlList.push(blobUrl)
  });

  document.body.appendChild(container);

  // 触发所有下载链接的点击操作
  container.querySelectorAll('a').forEach(element => {
    element.click();
  });

  // 一次性将容器从 DOM 中移除
  document.body.removeChild(container);

  // 释放 URL 对象
  blobUrlList.forEach(blobUrl => {
    URL.revokeObjectURL(blobUrl);
  });
}

/**
 * 创建并触发下载单个文件的元素。
 * 
 * 该函数为给定的 Blob 对象创建一个不可见的 <a> 元素，并设置其 `href` 属性为该 Blob 对象的 URL，以及设置 `download` 属性为提供的文件名。
 * 然后，模拟点击该 <a> 元素以触发文件下载。下载完成后，清理创建的 URL 和临时 DOM 元素。
 * 
 * @param {Blob} blob - 包含要下载文件内容的 Blob 对象。
 * @param {string} [filename=''] - Blob 对象对应的文件名。如果未提供，则文件名将为空。
 */
export function createElementTodownload(blob, filename = '') {
  // var fragment = document.createDocumentFragment();
  var element = document.createElement('a');
  const blobUrl = URL.createObjectURL(blob);
  element.setAttribute('href', blobUrl);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  URL.revokeObjectURL(blobUrl)
}


//#endregion dom 处理操作


//# 
//#region ------------------------------------------------------------- htttp request -------------------------------------------------------------------
export function handleXHR(timeout = 8000,) {

}
//#endregion

//# 心知天气api
//#region  ------------------------------------------------------------ 天气api ------------------------------------------------------------------------
//天气 https://api.seniverse.com/v3/weather/now.json?key=STZM3wOV_mjH8QsjJ&location=上海&language=zh-Hans&unit=c
// const data = await queryWeather(); // 等待queryWeather()函数的执行结果
export function queryWeather() {
  var data = {
    postData: 'your_data_here',
    anotherData: 'more_data'
  };

  var key = 'STZM3wOV_mjH8QsjJ';
  var location = '上海';
  var language = 'zh-Hans';
  var unit = 'c';
  var params = {
    key,
    location,
    language,
    unit
  };
  var apiUrl = new URL("https://api.seniverse.com/v3/weather/now.json");
  var urlParams = new URLSearchParams(params)

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", 'application/json');
  var options = {
    method: 'POST',
    // headers: myHeaders,
    body: JSON.stringify(data)
  };
  // 将查询参数附加到 API URL
  apiUrl = apiUrl + '?' + urlParams.toString();
  // apiUrl.search = urlParams.toString();

  return fetch(apiUrl, options) // 返回fetch()方法的Promise
    .then(response => {
      if (response.status == 200) {
        return response.json()
      }
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      return error;
    });
}



//#endregion



// SelectTime  disconnectWebSocket onopenWebSocket  