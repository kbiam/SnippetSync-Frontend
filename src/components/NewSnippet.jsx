import React, { useEffect } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import Input from './Input'
import flourite from 'flourite';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark, docco, github, irBlack, nightOwl, shadesOfPurple, solarizedDark, stackoverflowDark, tomorrow, tomorrowNight, tomorrowNightBlue, vs, vs2015, xcode } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.min.css'; //Example style, you can use another
import Cookies from 'universal-cookie'


function NewSnippet({onClose}) {
  const [code, setCode] = React.useState(
    `function paste() {\n  console.log("Right click to paste your code here") ;\n}`
  );
    const [error, setError] = useState("")
    // const [code, setcode] = useState("")
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm()
    const navigate = useNavigate()
    const cookies = new Cookies()
    const token = cookies.get('token')
    const onSubmit = async (data) => {
      setLoading(true)
      console.log(data, code);
      const response = await fetch("https://snippetsync-backend.onrender.com/addSnippet", {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          'Authorization': `Bearer ${token}`

        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          language: flourite(code).language,
          snippet: code
        })
      });
  
      if (response.ok) {
        console.log("Snippet added successfully");
        setLoading(false)
        onClose(); // Call onClose after successful submission
        // Optionally, you can also reset the form or navigate to another page here
      } else {
        console.error("Failed to add snippet");
        const responseData = await response.json();
        setError(responseData.error || "Failed to add snippet");
      }
    };

    const handleContextMenu = async (e) => {
      e.preventDefault();
      console.log("Context menu triggered");
      
      if (!navigator.clipboard) {
        setError("Clipboard API not supported in this browser");
        return;
      }
      
      try {
        let text = await navigator.clipboard.readText();
        text = text.trim();
    
        if (text === '') {
          setError("No code found");
        } else {
          setCode(text);
          setError(""); // Clear any previous error
        }
      } catch (err) {
        setError("Failed to read clipboard. Make sure you've granted permission.");
        console.error("Clipboard error:", err);
      }
    };

    useEffect(() => {
      errors?.description?setError(errors.description.message):(null)
      errors?.title?setError(errors.title.message):(null)
    }, [onSubmit])
    

    useEffect(() => {

  
      const editorElement = document.getElementById('code-editor');
      if (editorElement) {
        console.log("hehe")
        editorElement.addEventListener('contextmenu', handleContextMenu);
      }
  

    }, []);
  
    
  return (
    <div className="w-96 max-w-md">
    <h2 className="text-xl mb-4 font-medium text-white/90">Add New Snippet</h2>
    <div className=' w-96 -mt-2 -mb-5 text-center absolute '>
    {error? <p className="text-red-500 text-xs  ">{error}</p>:(null)}
    </div>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
    <div>
    <Input
    className = 'bg-[#243B55] border-none'
    label = 'Title'
    placeholder = "Enter title"
    type = 'text'
    {...register("title",{
      required:"Title is required"
    })}
    />
    </div>
    <div>
    <Input
    className = 'bg-[#243B55] border-none'
    label = 'Description'
    placeholder = 'Description'
    type = 'text'
    {
      ...register("description",{
        required:"Description is required",
        maxLength:200
      })
    }
    />
    </div>
    <div>
      <label className='text-sm text-white/70 '>Code</label>
    <Editor
    id='code-editor'
    className='rounded-lg  mt-1.5 '
      value={code}
      onValueChange={code => setCode(code)}
      highlight={code => highlight(code, languages.js)}
      onContextMenu={handleContextMenu}
      padding={12}
      style={{
        maxHeight:"200px",
        overflow:"auto",
        backgroundColor:"#282C34",
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 12,
        color:"white"
      }}
    />

    </div>
    <div>
    <button type="submit" disabled={loading} className={`w-full px-4 py-2 font-medium text-white/80  bg-[#243B55] hover:bg-[#1f344b] rounded-md focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {loading ? 'Adding...' : 'Add'}
            </button>
    </div>
    </form>

    </div>

        
    // </div>
  )
}

export default NewSnippet