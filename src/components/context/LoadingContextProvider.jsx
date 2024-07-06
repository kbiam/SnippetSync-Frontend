import LoadingContext from "./LoadingContext";
import React from "react";
import { useState } from "react";
import GlobalLoader from "../GlobalLoader";

export const LoadingContextProvider = ({children})=>{
    const [isLoading, setIsLoading] = useState(false)

    const showLoading = ()=>{
        setIsLoading(true)
    }
    const hideLoading = () => setIsLoading(false);

    return (
        <LoadingContext.Provider value={{isLoading, showLoading, hideLoading}}>
            {children}
            <GlobalLoader/>
        </LoadingContext.Provider>
    )
}
