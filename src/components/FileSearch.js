/*
 * @Author: your name
 * @Date: 2020-01-11 20:38:59
 * @LastEditTime : 2020-01-13 22:51:17
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cloud-doc\src\components\FileSearch.js
 */
import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import './FileSearch.css'
import useKeyPress from '../hooks/useKeyPress'

const FileSearch = ({ title, onFileSearch }) => {
  
  const [ inputActive, setInputActive ] = useState(false)
  const [ inputValue, setInputValue ] = useState('')

  const enterPressed = useKeyPress(13)
  const escPressed = useKeyPress(27)

  let node = useRef(null)

  // 定义关闭方法
  const closeSearch = () => {
    // e.preventDefault()
    setInputActive(false)
    setInputValue('')
    // 关闭搜索后，新增一个空的搜索进行数据还原
    onFileSearch('')
  }

  useEffect(() => {

    if(enterPressed && inputActive) {
      onFileSearch(inputValue)
    }

    if(escPressed && inputActive) {
      closeSearch()
    }

    // const handleInputEvent = (e) => {
      
    //   const { keyCode } = e
    //   // enter被按下，进行搜索
    //   if( keyCode === 13 && inputActive ){
    //     onFileSearch(inputValue)
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
    if(inputActive){
      node.current.focus()
    }    
  }, [inputActive])

  return (
    <>
      <div className="alert alert-primary d-flex justify-content-between align-items-center mb-0">
        { !inputActive && 
          <>
            <span>{ title }</span>
            <button
              type="button"
              className="icon-btn"
              onClick={() => {setInputActive(true)}}
            >
              <FontAwesomeIcon
                title="搜索"
                size="lg" 
                icon={faSearch} 
              />
            </button>
          </>
        }
        { inputActive && 
          <>
            <input 
              className="form-control"
              value={inputValue}
              ref={node}
              onChange={(e) => {setInputValue(e.target.value)}}
            />
            <button
              type="button"
              className="icon-btn"
              onClick={closeSearch}
            >
              <FontAwesomeIcon
                title="关闭"
                size="lg" 
                icon={faTimes} 
              />
            </button>
          </>
        }
      </div>
    </>
  ) 
}

FileSearch.propTypes = {
  title: PropTypes.string,
  onFileSearch: PropTypes.func.isRequired
}

FileSearch.defaultProps = {
  title: '我的云文档'
}

export default FileSearch
