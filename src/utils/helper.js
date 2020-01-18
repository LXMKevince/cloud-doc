/*
 * @Author: your name
 * @Date: 2020-01-14 23:21:23
 * @LastEditTime : 2020-01-18 22:46:32
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cloud-doc\src\utils\helper.js
 */
export const flattenArr = (arr) => {
  return arr.reduce((map, item) => {
    map[item.id] = item
    return map
  }, {})
}

export const objToArr = (obj) => {
  return Object.keys(obj).map(key => obj[key])
}

export const getParentNode = (node, parentClassName) => {
  let current = node
  while(current !== null) {
    if (current.classList.contains(parentClassName)) {
      return current
    }
    current = current.parentNode
  }
  return false
}