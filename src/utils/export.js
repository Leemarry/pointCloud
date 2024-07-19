/*
 * @Date: 2024-07-18 18:51:10
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\utils\export.js
 * @Description: Do not edit
 */
/*
 * @Date: 2024-07-18 18:51:10
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\utils\export.js
 * @Description: Do not edit
 */

export const pickerOptions= {
    shortcuts: [{
      text: '今天',
      onClick(picker) {
        picker.$emit('pick', new Date());
      }
    }, {
      text: '昨天',
      onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24);
        picker.$emit('pick', date);
      }
    }, {
      text: '一周前',
      onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', date);
      }
    }]
  }
export const  reportOptions= [{
    value: 0,
    label: '全部'
  },{
    value: 1,
    label: '危险点分析'
  }, {
    value: 2,
    label: '交跨报告'
  }, {
    value: 3,
    label: '输电线路杆塔缺陷分析报告'
  }]