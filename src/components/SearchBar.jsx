import React from 'react';
import SearchContext from './context/SearchContext';
import { useContext } from 'react';
import { Input } from './ui/input';


function SearchBar({className}) {

  const {filterText, setfilterText} = useContext(SearchContext)

  return (
    <>
    <Input
      type="text"
      className={className+" text-gray-200 rounded-md p-2 pl-3 mx-4 outline-none shadow-sm border-[#233A53] w-96 text-sm bg-[#233A53]"}
      placeholder="Search code snippets..."
      value={filterText}
      onChange={(e)=>setfilterText(e.target.value)}
    />
    </>
  );
}

export default SearchBar;
