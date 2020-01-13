/*
 * @Author: your name
 * @Date: 2020-01-12 15:48:04
 * @LastEditTime : 2020-01-13 23:43:38
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cloud-doc\src\components\FileList.js
 */
import React, { useState, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons'
import { faMarkdown } from '@fortawesome/free-brands-svg-icons'
import PropTypes from 'prop-types'
import useKeyPress from '../hooks/useKeyPress'

const FileList = ({ files, onFileClick, onSaveEdit, onFileDelete }) => {

  const [ editStatus, setEditStatus ] = useState(false)
  const [ editValue, setEditValue ] = useState('')

  const enterPressed = useKeyPress(13)
  const escPressed = useKeyPress(27)

  // 定义关闭方法
  const closeSearch = () => {
    //e.preventDefault()
    setEditStatus(false)
    setEditValue('')
  }

  useEffect(() => {
    if( enterPressed && editStatus ) {
      const editItem = files.find( file => file.id === editStatus )
      onSaveEdit(editItem.id, editValue)
      setEditStatus(false)
      setEditValue('')
    }
    if(escPressed && editStatus) {
      closeSearch()
    }

    // const handleInputEvent = (e) => {
      
    //   const { keyCode } = e
    //   // enter被按下，进行搜索
    //   if( keyCode === 13 && editStatus ){
    //     const editItem = files.find( file => file.id === editStatus )
    //     onSaveEdit(editItem.id, editValue)
    //     setEditStatus(false)
    //     setEditValue('')
    //   // ESC 被按下，关闭搜索框
    //   }else if( keyCode === 27 ) {
    //     closeSearch(e)
    //   }
    // }

    // document.addEventListener('keyup', handleInputEvent)

    // return () => {
    //   document.removeEventListener('keyup', handleInputEvent)
    // }
  })

  useEffect(() => {
    const newFile = files.find( file => file.isNew )
    if(newFile) {
      setEditStatus(newFile.id)
      setEditValue(newFile.title)
    }
  }, [files])


  return (
    <ul className="list-group list-group-flush file-list">
      {
        files.map( file => (
          <li
            className="list-group-item bg-light d-flex align-items-center row file-item mx-0"
            key={file.id}
          >
            { (file.id !== editStatus && !file.isNew) &&
              <>
                <span className="col-2">
                  <FontAwesomeIcon
                      icon={faMarkdown} 
                    />
                </span>
                <span 
                  className="col-6 c-link"
                  onClick={() => {onFileClick(file.id)}}
                > 
                  {file.title} 
                </span>
                <button
                  type="button"
                  className="icon-btn col-2"
                  onClick={() => { setEditStatus(file.id); setEditValue(file.title); }}
                >
                  <FontAwesomeIcon
                    title="编辑"
                    icon={faEdit} 
                  />
                </button>
                <button
                  type="button"
                  className="icon-btn col-2"
                  onClick={() => {onFileDelete(file.id)}}
                >
                  <FontAwesomeIcon
                    title="删除"
                    icon={faTrash} 
                  />
                </button>
              </>
            }
            { ((file.id === editStatus) || file.isNew) && 
              <>
               <input 
                 className="form-control col-10"
                 placeholder="请输入文件名称"
                 value={editValue}
                 onChange={(e) => {setEditValue(e.target.value)}}
               />
               <button
                 type="button"
                 className="icon-btn col-2"
                 onClick={closeSearch}
               >
                 <FontAwesomeIcon
                   title="关闭"
                   icon={faTimes} 
                 />
               </button>
             </>
            }
          </li>
        ))
      }
    </ul>
  )
}

FileList.propTypes = {
  files: PropTypes.array,
  onFileClick: PropTypes.func,
  onFileDelete: PropTypes.func,
  onSaveEdit: PropTypes.func
}

export default FileList
