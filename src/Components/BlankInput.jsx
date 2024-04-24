import React from 'react'
import '../App.css'

function BlankInput(index,newtext) {
  return (
    <body >
      <div className='pop-up-container'>
        <div className='pop-up'>
            <h4>Enter value to update your To-Do</h4>
            <input type="text" placeholder='Enter text' />
            <button>Update</button>
        </div>
      </div>
    </body>
  )
}

export default BlankInput
