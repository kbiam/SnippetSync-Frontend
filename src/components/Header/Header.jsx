import React from 'react';
import SearchBar from '../SearchBar';
import NewSnippetButton from './NewSnippetButton';
import { Button } from '../ui/button';
import ModalContext from '../context/ModalContext';
import { useContext } from 'react';

function Header() {
  const {isModalVisible, setModalTrue} = useContext(ModalContext);

  return (
    <header  className=" text-white/90 flex justify-between bg-transparent p-4 w-screen  fixed  z-50 max-w-full">
      <h1 className="text-2xl font-bold inline-flex items-center gap-1 "><span className='text-xl mt-2'></span>Snippet Sync</h1>
      <SearchBar className="ml-16"/>
      <Button onClick = {setModalTrue}className='inline-flex items-center gap-1 justify-center px-5 bg-[#152134]  hover:bg-[#1c2a42]   '><span className=''>New Snippet</span></Button>

      {/* <Button className="right-0 bg-transparent text-black">Logout</Button> */}
    </header>
  );
}

export default Header;
