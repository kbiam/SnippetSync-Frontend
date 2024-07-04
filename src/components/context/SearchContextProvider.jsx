import React, { useState } from "react";
import SearchContext from "./SearchContext";

const SearchContextProvider = ({children})=>{
    const [filterText, setfilterText] = useState("")

    return(
        <SearchContext.Provider value={{filterText, setfilterText}}>
            {children}
        </SearchContext.Provider>
    )

}

export default SearchContextProvider