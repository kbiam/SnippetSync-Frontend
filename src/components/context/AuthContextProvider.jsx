import AuthContext from "./AuthContext";
import React from "react";
import { useState } from "react";


export const AuthContextProvider = ({children})=>{
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        isVerified: false,
      });

      const authStateSignUp = () => {
        setAuthState({
          isAuthenticated: true,
          isVerified: false
        });
      };

      const logoutAuthState = () => {
        setAuthState({
            isAuthenticated: false,
            isVerified: false
        })
      }
      const verifyAuthState = (isVerify)=>{
        setAuthState({
            isAuthenticated: true,
            isVerified: isVerify
        })
      }
      const loginAuthState = ()=>{
        setAuthState({
            isAuthenticated: true,
            isVerified: true
        })
      }
      return(
        <AuthContext.Provider value={{authState, authStateSignUp, logoutAuthState, verifyAuthState, loginAuthState}}>
        {children}
        </AuthContext.Provider>
      )
}