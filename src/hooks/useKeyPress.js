/*
 * @Author: your name
 * @Date: 2020-01-12 16:51:18
 * @LastEditTime : 2020-01-12 18:46:05
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cloud-doc\src\hooks\useKeyPress.js
 */
import { useState, useEffect } from 'react'

const useKeyPress = (targetKeyCode) => {
  const [ keyPressed, setKeyPressed ] = useState(false)

  const keyDownHandler = ({ keyCode }) => {
    if(keyCode === targetKeyCode) {
      setKeyPressed(true)
    }
  }

  const keyUpHandler = ({ keyCode }) => {
    if(keyCode === targetKeyCode) {
      setKeyPressed(false)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', keyDownHandler)
    document.addEventListener('keyup', keyUpHandler)
    return () => {
      document.removeEventListener('keydown', keyDownHandler)
      document.removeEventListener('keyup', keyUpHandler)
    }
  }, [])

  return keyPressed
}

export default useKeyPress
