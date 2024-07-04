import React, { useState } from "react";
import ModalContext from "./ModalContext";

const ModalContextProvider = ({children})=>{
    const [isModalVisible, setModalVisible] = useState(false);
    const setModalTrue = ()=>{setModalVisible(true)}
    const setModalFalse = ()=>{setModalVisible(false)}
    return(
        <ModalContext.Provider value={{isModalVisible, setModalTrue, setModalFalse}}>
            {children}
        </ModalContext.Provider>
    )

}

export default ModalContextProvider