import React, { useEffect } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Input from './Input'
import Cookies from 'universal-cookie'
import { helix } from 'ldrs'
import { useContext } from 'react'
import LoadingContext from './context/LoadingContext'
import AuthContext from './context/AuthContext'


helix.register()

function Login() {
    const cookies = new Cookies(null, { path: '/' });
    const navigate = useNavigate()
    const {register, handleSubmit, formState:{errors}} = useForm()
    const [error, setError] = useState(null)
    // const [isLoading, setLoading] = useState(false)
    const token = cookies.get('token')
    const  {isLoading, showLoading, hideLoading} = useContext(LoadingContext)
    const {authState, authStateSignUp, logoutAuthState, verifyAuthState, loginAuthState} = useContext(AuthContext)
    const currentDate = new Date();

    const handlelogin =async (data)=>{
      console.log("clicked")
      showLoading()
        const response = await fetch('https://snippetsync-backend.onrender.com/login',{
          method:'POST',
          mode:'cors',
          headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`

          },
          body:JSON.stringify({
            email: data.email,
            password: data.password
          })
        })
        if(response.ok){
        const result = await response.json()
        if(result.message){
          showLoading()
           if(result.message === "Email sent"){
            const expiryDate = new Date(currentDate.getTime()+1*60*60*1000);
          cookies.set('unverifiedToken', result.token, { path: '/',expires:expiryDate });
          authStateSignUp()
          hideLoading()
          navigate('/verify-otp')
        }
        }
        const expiryDate = new Date(currentDate.getTime() + 10 * 24 * 60 * 60 * 1000); // 5 days in milliseconds
        result.error?(hideLoading(),setError(result.error)):(cookies.set('token', result.token,{expires:expiryDate}),loginAuthState(),hideLoading(), navigate('/snippets'))

      }
        else{
          console.log("Login failed")
        }
         
        

    }

    useEffect(() => {
      console.log(errors)
      errors?.email?(setError(errors.email.message)):(null)
      errors?.password?(setError(errors.password.message)):(null)
    }, [handlelogin])
    

 

    

    return (
       <div className="flex items-center justify-center min-h-screen   ">

        {/* {isLoading?<div>
          <l-helix
  size="100"
  speed="2.5" 
  color="white" 
></l-helix>
        </div> : <> */}

        <div className='max-w-screen-sm text-lg'>
            <h1 className='font-bold text-6xl text-white/90 mb-6'>Organize and Manage Your Code Snippets</h1>
            <h3 className='text-white/60'>Keep your code organized and accessible with our powerful code snippet manager. Easily search, share, and collaborate on your code snippets.</h3>
        </div>
      <div className="w-full max-w-md px-10 py-14 space-y-8 bg-[#162235] rounded-xl shadow-custom-black translate-x-36">
        <div className="">
          <h1 className="text-2xl font-medium text-white/100">SnippetSync</h1>
          <p className="mt-6 text-xl font-medium text-white/80">
            Welcome to SnippetSync!👋
            {/* <Link to='/signup' className="font-medium text-primary transition-all duration-100 hover:underline ml-1">SignUp</Link> */}
          </p>
          <p className=' text-sm text-white/60 mt-1'>Please sign-in to your account and start the adventure</p>
        </div>
        

        {error && <p className= " absolute text-red-500 text-center text-xs translate-x-28 -translate-y-6 ">{error}</p>}

        <form onSubmit={handleSubmit(handlelogin)} className="space-y-5">
          <div>
            <Input
                        className='bg-[#20334B] border-none py-3'

              label="Email"
              placeholder="abc@xyz.com"
              type="email"
              {...register("email", {
                required: "Email is required",
                validate: {
                  matchPattern: value =>
                    /^\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(value) || "Email is invalid"
                }
              })}
            />
          </div>
          
          <div>
            <a href="/forgotPassword" className='text-xs absolute translate-x-custom -translate-y-5 text-custom-purple'>Forgot Password?</a>
            <Input
            className='bg-[#20334B] border-none py-3'
              label="Password"
              placeholder="********"
              type="password"
              {...register("password", {
                required: "Password is required"
              })}
            />
          </div>

          <div>
            <button type="submit" disabled={isLoading} className={`w-full px-4 py-2 font-medium text-white bg-custom-purple rounded-md focus:outline-none focus:shadow-outline ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {isLoading?"Signing...":"Sign In"}

            </button>
            <p className='text-sm text-white/60 text-center mt-3'>New on our platform? <a href="/signup" className='text-custom-purple'>Create an account</a></p>
            
          </div>
        </form>
      </div>
      {/* </> */}
        
    </div>
    
      )
}

export default Login