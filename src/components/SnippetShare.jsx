import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-funky.min.css'; // Example style, you can use another
import html2canvas from 'html2canvas';
import { useContext } from 'react';
import LoadingContext from './context/LoadingContext';

function SnippetShare() {
  const { snippetId } = useParams();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');
  const {showLoading, hideLoading} = useContext(LoadingContext)

  useEffect(() => {
    const snippetDets = async () => {
      showLoading()
      console.log('sending req');
      const res = await fetch('https://snippetsync-backend.onrender.com/snippetDets', {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          snippetId: snippetId,
        }),
      });
      const dets = await res.json();
      console.log(dets);
      setCode(dets.snippet);
      setLanguage(dets.language);
      hideLoading()
    };
    snippetDets();
  }, [snippetId]);



  return (
    <div className='flex flex-col justify-center items-center h-screen bg-[#004BDA]'>
      <div  className='bg-[#273238] rounded-md p-1 '>
        <div className='inline-flex px-5 pt-1 items-center bg-[#273238] w-full'>
          <span className='text-lg text-[#E94A41]'>
            <ion-icon name='ellipse'></ion-icon>{' '}
          </span>
          <span className='text-lg text-[#FEBC33]'>
            <ion-icon name='ellipse'></ion-icon>{' '}
          </span>
          <span className='text-lg text-[#28CC3E]'>
            <ion-icon name='ellipse'></ion-icon>{' '}
          </span>
        </div>
        <Editor
          textareaClassName='border-none outline-none'
          readOnly
          className='rounded-lg no-outline'
          value={code}
          highlight={(code) => highlight(code, languages[language] || languages.js)}
          padding={20}
          style={{
            borderRadius: '0px',
            border: 'none',
            outline: 'none',
            maxHeight: '650px',
            maxWidth: '1280px',
            overflow: 'auto',
            backgroundColor: '#273238',
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 16,
            color: 'white',
          }}
        />
      </div>

    </div>
  );
}

export default SnippetShare;
