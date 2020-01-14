/*
 * @Author: your name
 * @Date: 2020-01-11 16:56:32
 * @LastEditTime : 2020-01-14 23:54:27
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

function App() {
  const [ files, setFiles ] = useState(flattenArr(defaultFiles))
  const filesArr = objToArr(files)
  const [ activeFileID, setActiveFileID ] = useState('')
  const [ openedFileIDs, setOpenedFileIDs ] = useState([])
  const [ unsavedFileIDs, setUnsavedFileIDs ] = useState([])
  const [ searchedFiles, setSearchedFiles ] = useState([])

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
    // 从对象中删除
    delete files[id]
    setFiles(files)
    // 关闭对应 tab
    tabClose(id)
  }

  const updateFileName = (id, title) => {
    // 循环
    // const newFiles = files.map( file => {
    //   if(file.id === id) {
    //     file.title = title
    //     file.isNew = false
    //   }
    //   return file
    // })
    // setFiles(newFiles)
    const modifiedFile = { ...files[id], title, isNew: false }
    setFiles({ ...files, [id]: modifiedFile })
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
            </>
          }
        </div>  
      </div> 
    </div>
  )
}

export default App
