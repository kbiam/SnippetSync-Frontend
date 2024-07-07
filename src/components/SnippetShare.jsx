import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'; //Example style, you can use another

function SnippetShare() {
    const {snippetId} = useParams();
    const [code, setCode] = useState("")
    const [language, setLanguage] = useState("")
    useEffect(() => {
        const snippetDets = async ()=>{
            const res = await fetch(`https://snippetsync-backend.onrender.com/snippetDets`,{
                method:"POST",
                mode:"cors",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    snippetId:snippetId
                })
            })
            const dets = await res.json()
            setCode(dets.code)
            setLanguage(dets.language)
        } 
    }, [third])
    
  return (
    <div className='flex justify-center items-center h-screen'>
        <div className='w-9/12'>

    <Editor
    readOnly
    id='code-editor'
    className='rounded-lg border border-gray-200 '
      value={code}
      highlight={code => highlight(code, languages.plaintext(language))}
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
            {/* <SyntaxHighlighter style={atomOneDark} className="whitespace-pre-wrap" wrapLongLines={true} customStyle={{padding:25}} >
          {snippet.snippet}
        </SyntaxHighlighter> */}
                </div>

    </div>
  )
}

export default SnippetShare