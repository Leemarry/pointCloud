/*
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2024-04-18 16:18:45
 * @LastEditors: Andy
 * @LastEditTime: 2024-04-18 16:18:46
 */
let idCounter = 0

export function getData(count) {
  const data = []
  for (let index = 0; index < count; index++) {
    data.push({
      id: String(idCounter++),
      text: Math.random()
        .toString(16)
        .substr(10)
    })
  }
  return data
}