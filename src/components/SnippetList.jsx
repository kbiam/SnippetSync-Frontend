import React, { useContext, useState } from 'react';
import SnippetCard from './SnippetCard';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Sidebar from './Sidebar';
import SearchContext from './context/SearchContext';
import NewSnippet from './NewSnippet';
import Modal from './Modal';
import { useEffect } from 'react';
import ModalContext from './context/ModalContext';
import { helix } from 'ldrs'
import { faL } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'universal-cookie';
import LoadingContext from './context/LoadingContext';
// import { useContext } from 'react';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
helix.register()
function SnippetList({logout}) {

  // const [isLoading, setLoading] = useState(true);
  const {showLoading, hideLoading} = useContext(LoadingContext)
  const cookies = new Cookies()
  const token = cookies.get('token')
  const [snippets, setsnippets] = useState([])
  const [snippetCopy, setSnippetCopy] = useState([])
  const [snippetAdded, setSnippetAdded] = useState(false);
  const {isModalVisible, setModalTrue, setModalFalse} = useContext(ModalContext);
  const {filterText} = useContext(SearchContext)
  const [isLoading, setIsLoading] = useState(true);

  const filteredSnippets = snippets.filter(snippet =>
    snippet.title.toLowerCase().includes(filterText.toLowerCase())
  );
  
  const handleSnippetLanguageFetch = (language)=>{
    setsnippets(snippetCopy.filter(snippet => snippet.language === language));
  }
  const allSnippets = ()=>{
    setsnippets(snippetCopy)
  }

  const handleDeleteSnippet = (id) => {
    setsnippets(snippets.filter(snippet => snippet._id !== id));
    setSnippetCopy(snippetCopy.filter(snippet => snippet._id !== id));

  };


  useEffect(() => {
    // showLoading()
    const fetchSnippets = async()=>{
      const response = await fetch('https://snippetsync-backend.onrender.com/snippets',{
        method:"POST",
        credentials:"include",
        headers:{
          "Content-Type" : "application/json",
          'Authorization': `Bearer ${token}`
        }
      });
      const snippets = await response.json()
      setsnippets(snippets)
      setSnippetCopy(snippets)
      setIsLoading(false)
      // hideLoading()
    }
    if(!isModalVisible){
      fetchSnippets();
      setSnippetAdded(false)
    }
  }, [snippetAdded])

  return (
    <>
          {/* {isLoading ? (
        <div className='flex items-center justify-center min-h-screen'>
          <l-helix size="100" speed="2.5" color="white"></l-helix>
        </div>
      ) : (
        <> */}
      <Header />

<div className="flex">
  <Sidebar logout={logout} handleSnippetLanguageFetch={handleSnippetLanguageFetch} allSnippets={allSnippets} snippetAdded={snippetAdded} snippets={snippets} />

  <div className="flex flex-col min-h-screen ml-72 pt-14">
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-auto-rows gap-5">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-[#152133] rounded-lg p-6 border border-gray-700 min-w-96 h-auto">
              <h2 className="text-base font-semibold mb-2 text-white"><Skeleton /></h2>
              <p className="text-[#A6AFBC] mb-4 text-sm"><Skeleton count={1} /></p>
              <div className="bg-[#282C34] text-white justify-center rounded-lg mb-4 font-thin text-sm overflow-auto max-h-96">
                <Skeleton height={120} />
              </div>
            </div>
          ))
        ) : (
          filteredSnippets.map(snippet =>
            <SnippetCard key={snippet._id} snippet={snippet} onDelete={handleDeleteSnippet} />
          )
        )}
      </div>
    </div>
    {filteredSnippets.length === 0 && !isLoading && (
      <p className="absolute inset-0 flex items-center justify-center text-white/80">
        Hey, It's empty here, Add new Snippets.
      </p>
    )}
  </div>
</div>

<Modal isVisible={isModalVisible} onClose={setModalFalse}>
  <NewSnippet onClose={() => { setModalFalse(); setSnippetAdded(true) }} />
</Modal>
      
    </>
  );
}

export default SnippetList;
