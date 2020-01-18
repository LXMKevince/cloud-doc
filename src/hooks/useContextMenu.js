/*
 * @Author: your name
 * @Date: 2020-01-18 22:11:56
 * @LastEditTime : 2020-01-18 23:09:10
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cloud-doc\src\hooks\useContextMenu.js
 */
import { useEffect, useRef } from 'react'

// 加载 nodejs 模块
const { remote } = window.require('electron')
const { Menu, MenuItem } = remote

const useContextMenu = (itemArr, targetSelector, deps) => {
  let clickedElement = useRef(null)
  useEffect(() => {
    const menu = new Menu()
    itemArr.forEach(item => {
      menu.append(new MenuItem(item))
    })
    const handleContextMenu = (e) => {
      // 只有 e.target 被包含在目标dom元素中时才有效
      if(document.querySelector(targetSelector).contains(e.target)) {
        clickedElement.current = e.target
        menu.popup({ window: remote.getCurrentWindow() })
      }
    }
    window.addEventListener('contextmenu', handleContextMenu)
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu)
    }
  }, deps)
  return clickedElement
}

export default useContextMenu
