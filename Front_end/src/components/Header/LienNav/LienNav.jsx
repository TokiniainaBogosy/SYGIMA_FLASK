import React, { useState } from 'react'

const LienNav = ({text}) => {
    const [select,setSelect] = useState(false)
    const bg_color = {
        selected : 'bg-white',
        notSelected : ''
    } 
  return (
    <li onClick={()=>{setSelect(true)}} className={`p-2 ml-0.5 mr-0.5 mb-0.5 mt-0.5 rounded-md ${select ? bg_color.selected : bg_color.notSelected}`}>
        {text}
    </li>
  )
}

export default LienNav