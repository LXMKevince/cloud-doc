/*
 * @Author: your name
 * @Date: 2020-01-11 16:56:32
 * @LastEditTime : 2020-01-11 22:20:30
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cloud-doc\src\App.js
 */
import React from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import FileSearch from './components/FileSearch'

function App() {
  return (
    <div className="App container-fluid">
      <div className="row">
        <div className="col-3 bg-light left-panel">
          <FileSearch 
            title="My Document"
            onFileSearch={(inputValue) => {console.log(inputValue)}}
          />
        </div>
        <div className="col-9 bg-primary right-panel">
          <h1>this is right</h1>
        </div>  
      </div> 
    </div>
  )
}

export default App
