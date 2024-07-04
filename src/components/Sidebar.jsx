import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

function Sidebar({ logout, handleSnippetLanguageFetch, allSnippets, snippetAdded, snippets }) {
  const [languages, setLanguages] = useState([]);
  const [activeLanguage, setActiveLanguage] = useState('all');

  useEffect(() => {
    const fetchLanguages = async () => {
      const response = await fetch('https://snippetsync-backend.onrender.com/userLanguages', {
        method: "GET",
        credentials: "include"
      });
      const languages = await response.json();
      console.log(languages);
      setLanguages(languages);
    };
    fetchLanguages();
  }, [snippetAdded, snippets]);

  const handleAllSnippetsClick = () => {
    allSnippets();
    setActiveLanguage('all');
  };

  const handleLanguageClick = (language) => {
    handleSnippetLanguageFetch(language);
    setActiveLanguage(language);
  };

  return (
    <div className="w-60 h-screen text-white/80 fixed pt-14 flex flex-col justify-between z-20 bg-transparent">
      <div>
        <nav className="mt-10 font-normal text-base ml-1">
          <button
            onClick={handleAllSnippetsClick}
            className={`w-3/4 text-start block py-2.5 px-4 rounded-md transition-all duration-200 mb-1 hover:text-white hover:bg-[#1a2a3c] ${activeLanguage === 'all' ? 'bg-[#1a2a3c]' : ''}`}
          >
            All Snippets
          </button>
          {languages.map(language => {
            return (
              <button
                key={language}
                className={`w-3/4 text-start block py-2.5 px-4 rounded-md transition-all duration-200 mb-1 hover:text-white hover:bg-[#1a2a3c] ${activeLanguage === language ? 'bg-[#1a2a3c]' : ''}`}
                onClick={() => handleLanguageClick(language)}
              >
                {language}
              </button>
            );
          })}
        </nav>
      </div>
      <div className='px-3 flex mb-4'>
        <button onClick={logout} className='w-full bg-transparent text-start text-2xl'>
          <ion-icon name="log-out-outline"></ion-icon>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
