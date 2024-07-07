import React, { useState } from 'react';
import { Button } from './ui/button'; // Assuming you have a Button component
import flourite from 'flourite';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark, atomOneDarkReasonable, docco, github, irBlack, nightOwl, shadesOfPurple, solarizedDark, stackoverflowDark, tomorrow, tomorrowNight, tomorrowNightBlue, vs, vs2015, xcode } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.min.css';
import { faL } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import LoadingContext from './context/LoadingContext';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


function SnippetCard({ snippet, onDelete }) {
  const [copy, setcopy] = useState(false)
  const [code,setCode] = useState(snippet.snippet)
  const [isEditable, setIsEditable] = useState(false)
  const [initialCode, setInitialCode] = useState(snippet.snippet);
  const {showLoading} = useContext(LoadingContext)
  const cookies = new Cookies()
  const navigate = useNavigate()
  const token = cookies.get('token')
  
  const deleteSnippet = async ()=>{
    const response = await fetch("https://snippetsync-backend.onrender.com/deleteSnippet",{
      method:"POST",
      mode:"cors",
      headers: {
        "Content-Type":"application/json",
        'Authorization': `Bearer ${token}`

      },
      credentials:"include",
      body:JSON.stringify({
        id:snippet._id
      })
    })
    if(response.ok){
      onDelete(snippet._id)
    }
  }

  const handleEditbutton = ()=>{
    setIsEditable(true)
  }

  const shareSnippet = ()=>{
    showLoading()
    navigate(`/snippet/${snippet._id}`)
    
  }
  const handleSavebutton = async ()=>{
    if(code !== initialCode){
    const response = await fetch("https://snippetsync-backend.onrender.com/updateSnippet",{
      method:"POST",
      mode:"cors",
      headers:{
        "Content-Type":"application/json",
        'Authorization': `Bearer ${token}`

      },
      credentials:"include",
      body:JSON.stringify({
        id:snippet._id,
        newSnippet:code
      })
    })
    if(response.ok){
      setIsEditable(false)
    }
  }
  else{
    setIsEditable(false)
  }
  }

  return (
    <div className="bg-[#152133]  rounded-lg p-6 border border-gray-700 min-w-96  h-auto">
      <div className='flex w-full justify-between items-center'><h2 className="text-base font-semibold mb-2 text-white">{snippet.title || <Skeleton/>}</h2>
      <button onClick= {deleteSnippet}className='text-lg text-red-800' ><ion-icon name="trash-outline"></ion-icon></button>
      </div>
      <p className="text-[#A6AFBC] mb-4 text-sm">{snippet.description || <Skeleton/>}</p>
      <div className="bg-[#282C34] text-white   justify-center rounded-lg mb-4 font-thin text-sm overflow-auto max-h-96" >
        <div className='flex px-3 text-white text-xs justify-between items-center w-full bg-gray-800 h-7'>
        <span className="text-xs font-medium text-white-400 shadow-sm h-4.5 px-2 inline-flex items-center  rounded-md">{flourite(snippet.snippet).language || <Skeleton/>}</span> 
        <div className='flex gap-2'>
          <button onClick={shareSnippet}><span className='text-base'><ion-icon name="share-social-outline"></ion-icon></span></button>
        {isEditable?(<button onClick={handleSavebutton}><span className='text-base'><ion-icon name="save-outline"></ion-icon></span></button>):(<button onClick={handleEditbutton}><span className='text-base'><ion-icon name="create-outline"></ion-icon></span></button>)}
          {
          !copy?
          (<button onClick={()=>{navigator.clipboard.writeText(snippet.snippet); setcopy(true);setTimeout(()=>{setcopy(false)},3000) }} className='py-0.5 inline-flex items-center gap-1 transition-all 200ms ease-out'><span className='text-sm'><ion-icon name="clipboard-outline" ></ion-icon></span></button>
          ):
          (<button className='py-0.5 inline-flex items-center font-medium text-gray-300  '><span className='text-base'></span>Copied!</button>
          )}
        </div>
        </div>
        <Editor
        readOnly = {!isEditable}
    id='code-editor'
    className='rounded-lg border border-gray-200 '
      value={code || <Skeleton/>}
      onValueChange={newcode => setCode(newcode)}
      highlight={code => highlight(code, languages.js)}
      padding={12}
      style={{
        border:"none",
        outline:"none",
        maxHeight:"200px",
        overflow:"auto",
        backgroundColor:"#282C34",
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 12,
        color:"white"
      }}
    />

      </div>
      <div className="flex justify-between items-center">

      </div>
    </div>
  );
}

export default SnippetCard;
