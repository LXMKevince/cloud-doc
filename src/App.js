/*
 * @Author: your name
 * @Date: 2020-01-11 16:56:32
 * @LastEditTime : 2020-01-18 21:43:08
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cloud-doc\src\App.js
 */
import React, { useState } from 'react'
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons'
import SimpleMDE from 'react-simplemde-editor'
import uuidv4 from 'uuid/v4'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'easymde/dist/easymde.min.css'
import './App.css'

import FileSearch from './components/FileSearch'
import FileList from './components/FileList'
import BottomBtn from './components/BottomBtn'
import TabList from './components/TabList'

import defaultFiles from './utils/defaultFiles'
import { flattenArr, objToArr } from './utils/helper'
import fileHelper from './utils/fileHelper'

// 引用 node.js 模块
const { join, basename, extname, dirname } = window.require('path')
const { remote } = window.require('electron')
const Store = window.require('electron-store')
const fileStore = new Store({'name': 'files Data'})

const saveFilesToStore = (files) => {
  // 我不需要对所有数据做持久化处理
  const filesStoreObj = objToArr(files).reduce((result, file) => {
    const { id, path, title, createdAt } = file
    result[id] = {
      id,
      path,
      title,
      createdAt
    }
    return result
  }, {})
  fileStore.set('files', filesStoreObj)
}

function App() {
  // const [ files, setFiles ] = useState(flattenArr(defaultFiles))
  const [ files, setFiles ] = useState(fileStore.get('files') || {})
  const filesArr = objToArr(files)
  const [ activeFileID, setActiveFileID ] = useState('')
  const [ openedFileIDs, setOpenedFileIDs ] = useState([])
  const [ unsavedFileIDs, setUnsavedFileIDs ] = useState([])
  const [ searchedFiles, setSearchedFiles ] = useState([])

  // 在渲染进程中使用主进程中的getPath方法
  const savedLocation = remote.app.getPath('documents')

  // 根据 ID 找到打开的文件集
  // const openedFiles = openedFileIDs.map( openID => {
  //   return files.find( file => file.id === openID)
  // } )
  const openedFiles = openedFileIDs.map( openID => {
    return files[openID]
  })

  // 根虎 ID 找到激活状态的文件
  // const activeFile = files.find( file => file.id === activeFileID)
  const activeFile = files[activeFileID]

  // const fileListArr = (searchedFiles.length > 0) ? searchedFiles : files
  const fileListArr = (searchedFiles.length > 0) ? searchedFiles : filesArr

  const fileClick = (fileID) => {
    // 设置当前激活状态的文件
    setActiveFileID(fileID)
    const  currentFile = files[fileID]
    if (!currentFile.isLoaded) {
      fileHelper.readFile(currentFile.path).then(value => {
        const newFile = { ...files[fileID], body: value, isLoaded: true }
        setFiles({ ...files, [fileID]: newFile })
      })
    }
    // 当前 openedFileIDs不包含 fileID 则添加新的 flieID 到 openedFileIDs 中
    if(!openedFileIDs.includes(fileID)) {
      setOpenedFileIDs([ ...openedFileIDs, fileID ])
    } 
  }

  const tabClick = (fileID) => {
    // 设置当前激活状态的文件
    setActiveFileID(fileID)
  }

  const tabClose = (id) => {
    // 在 openedFileIDs 中过滤掉当前要关闭的 ID ，删除指定 ID 的文件
    const tabsWithout = openedFileIDs.filter(fileID => fileID !== id)
    setOpenedFileIDs(tabsWithout)
    // 判断 openedFileIDs 中是否有数据，有就默认激活文件为第一个
    if(tabsWithout.length > 0){
      setActiveFileID(tabsWithout[0])
    }else {
      setActiveFileID('')
    }
  }

  // const deleteFile = (id) => {
  //   // 从数组中过滤掉此 ID
  //   const newFiles = files.filter( file => file.id !== id)
  //   setFiles(newFiles)
  //   // 关闭对应 tab
  //   tabClose(id)
  // }
  const deleteFile = (id) => {
    if(files[id].isNew) {
      // delete files[id]
      const { [id]: value, ...afterDelete } = files
      setFiles(afterDelete)
    } else{
      fileHelper.deleteFile(files[id].path).then(() => {
        // delete files[id]
        const { [id]: value, ...afterDelete } = files
        setFiles(afterDelete)
        saveFilesToStore(afterDelete)
        tabClose(id)
      })
    }
  }

  const updateFileName = (id, title, isNew) => {
    // 循环
    // const newFiles = files.map( file => {
    //   if(file.id === id) {
    //     file.title = title
    //     file.isNew = false
    //   }
    //   return file
    // })
    // setFiles(newFiles)
    // newPath 的路径不一样，分成新文件与不是新文件
    const newPath = isNew ? join(savedLocation, `${title}.md`) 
                          : join(dirname(files[id].path), `${title}.md`)
    const modifiedFile = { ...files[id], title, isNew: false, path: newPath }
    const newFiles = { ...files, [id]: modifiedFile }
    // console.log(newFiles)
    if(isNew) {
      // fileHelper.writeFile(join(savedLocation, `${title}.md`), files[id].body).then(() => {
      fileHelper.writeFile(newPath, files[id].body).then(() => {
        // setFiles({ ...files, [id]: modifiedFile })
        setFiles(newFiles)
        // 做数据持久化
        saveFilesToStore(newFiles)
      })
    } else {
      // const oldPath = join(savedLocation, `${files[id].title}.md`)
      const oldPath = files[id].path
      // fileHelper.renameFile(join(savedLocation, `${files[id].title}.md`), 
      // join(savedLocation, `${title}.md`)).then(() => {
        // setFiles({ ...files, [id]: modifiedFile })
      //})
      fileHelper.renameFile(oldPath, newPath).then(() => {
        setFiles(newFiles)
        // 做数据持久化
        saveFilesToStore(newFiles)
      }).catch(err => {
        console.log(err)
      })
    }
  }

  // const fileChange = (id, value) => {
  //   // 循环数组，更新数据
  //   const newFiles = files.map( file => {
  //     if(file.id === id) {
  //       file.body = value
  //     }
  //     return file
  //   })
  //   setFiles(newFiles)
  //   // 更新 unsavedFileIDs 
  //   if(!unsavedFileIDs.includes(id)) {
  //     setUnsavedFileIDs([ ...unsavedFileIDs, id ])
  //   }
  // }
  const fileChange = (id, value) => {
    const newFile = { ...files[id], body: value }
    setFiles({ ...files, [id]: newFile })
    // 更新 unsavedFileIDs 
    if(!unsavedFileIDs.includes(id)) {
      setUnsavedFileIDs([ ...unsavedFileIDs, id ])
    }
  }

  const fileSearch = (keyword) => {
    // 根据关键字过滤
    // const newFiles = files.filter( file => file.title.includes(keyword))
    const newFiles = filesArr.filter( file => file.title.includes(keyword))
    setSearchedFiles(newFiles)
  }

  const createNewFile = () => {
    const newID = uuidv4()
    // const newFiles = [
    //   ...files,
    //   {
    //     id: newID,
    //     title: '',
    //     body: '## 请输入MarkDown',
    //     createdAt: new Date().getTime(),
    //     isNew: true
    //   }
    // ]
    // setFiles(newFiles)
    const newFile = {
        id: newID,
        title: '',
        body: '## 请输入MarkDown',
        createdAt: new Date().getTime(),
        isNew: true
    }
    setFiles({ ...files, [newID]: newFile })
  }  

  const saveCurrentFile = () => {
    fileHelper.writeFile(activeFile.path, activeFile.body).then(() => {
      setUnsavedFileIDs(unsavedFileIDs.filter(id => id !== activeFile.id))
    })
  }

  const importFiles = () => {
    remote.dialog.showOpenDialog({
      title: '选择导入 MarkDown 文档',
      properties: ['openFile', 'multiSelections'],
      filters: [
        {name: 'Markdown files', extensions: ['md']}
      ]
    }).then( (paths) => {
      // console.log(paths.filePaths)
      const filePaths = paths.filePaths
      if(Array.isArray(filePaths)) {
        const filteredPaths = filePaths.filter(path => {
          const alreadyAdded = Object.values(files).find(file => {
            return file.path === path
          })
          return !alreadyAdded
        })
        // 拿到 path 的数组，扩展数组 [{id: '1', path: '', title: ''}, {xxxx}]
        const importFilesArr = filteredPaths.map(path => {
          return {
            id: uuidv4(),
            title: basename(path, extname(path)),
            path,
          }
        })
        //console.log(importFilesArr)
        // 在 flattenArr 中获取新的 files 对象
        const newFiles = { ...files, ...flattenArr(importFilesArr) }
        // console.log(newFiles)
        // 设置导入成功状态，保密柜更新 electron store
        setFiles(newFiles)
        saveFilesToStore(newFiles)
        if(importFilesArr.length>0) {
          remote.dialog.showMessageBox({
            type: 'info',
            title: `成功导入${importFilesArr.length}个文件`,
            message: `成功导入${importFilesArr.length}个文件`
          })
        }
      }
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <div className="App container-fluid px-0">
      <div className="row no-gutters">
        <div className="col-3 bg-light left-panel">
          <FileSearch 
            title="My Document"
            onFileSearch={fileSearch}
          />
          <FileList 
            files={fileListArr}
            onFileClick={fileClick}
            onFileDelete={deleteFile}
            onSaveEdit={updateFileName}
          />
          <div className="row no-gutters button-group">
            <div className="col">
              <BottomBtn 
                text="新建"
                colorClass="btn-primary"
                icon={faPlus}
                onBtnClick={createNewFile}
              />
            </div>
            <div className="col">
              <BottomBtn 
                text="导入"
                colorClass="btn-success"
                icon={faFileImport}
                onBtnClick={importFiles}
              />
            </div>
          </div>
        </div>
        <div className="col-9 right-panel">
          { !activeFile &&
            <div className="start-page">
              选择或者创建新的 MarkDown 文档
            </div>
          }
          { activeFile && 
            <>
              <TabList 
                files={openedFiles}
                activeId={activeFileID}
                unsaveIds={unsavedFileIDs}
                onTabClick={tabClick}
                onTabClose={tabClose}
              />
              <SimpleMDE
                key={activeFile && activeFile.id} 
                value={activeFile && activeFile.body}
                onChange={(value) => {fileChange(activeFile.id, value)}}
                options={{
                  minHeight: '515px',
                }}
              />
              <BottomBtn 
                text="保存"
                colorClass="btn-success"
                icon={faFileImport}
                onBtnClick={saveCurrentFile}
              />
            </>
          }
        </div>  
      </div> 
    </div>
  )
}

export default App
