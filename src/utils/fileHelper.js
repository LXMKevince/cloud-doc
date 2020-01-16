/*
 * @Author: your name
 * @Date: 2020-01-16 21:48:16
 * @LastEditTime : 2020-01-16 22:25:44
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cloud-doc\src\utils\fileHelper.js
 */
// const fs = window.require('fs')

// 回调函数的形式
// const fileHelper = () => {
//   readFile: (path, cb) => {
//     fs.readFile(path, { encoding: 'utf-8' }, (err, data) => {
//       if(!err) {
//         cb(data)
//       }
//     })
//   },
//   writeFile: (path, content, cb) => {
//     fs.writeFile(path, content, { encoding: 'utf-8' }, (err) => {
//       if(!err) {
//         cb()
//       }
//     })
//   }
// }

// promise 的形式
const fs = window.require('fs').promises

const fileHelper = {
  readFile: (path) => {
    return fs.readFile(path, { encoding: 'utf-8' })
  },
  writeFile: (path, content) => {
    return fs.writeFile(path, content, { encoding: 'utf-8' })
  },
  renameFile: (path, newPath) => {
    return fs.rename(path, newPath)
  },
  deleteFile: (path) => {
    return fs.unlink(path)
  }
}

export default fileHelper
