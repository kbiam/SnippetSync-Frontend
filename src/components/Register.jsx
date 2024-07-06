import React, { useEffect } from 'react'
import { useState } from 'react'
import { set, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Input from './Input'
import { dotStream } from 'ldrs'
import { helix } from 'ldrs'
import Cookies from 'universal-cookie';
import { useContext } from 'react'
import LoadingContext from './context/LoadingContext'


dotStream.register()
helix.register()




function Register({authStateSignUp}) {
  const cookies = new Cookies();
  const {isLoading, showLoading, hideLoading} = useContext(LoadingContext)
    const navigate = useNavigate()
    const {register, handleSubmit, formState:{errors}} = useForm()
    const [error, setError] = useState(null)
    // const [isLoading, setLoading] = useState(false)
    const token = cookies.get('token')
    const handleRegistration =async (data)=>{
            
        console.log(data)
        showLoading()
        const response = await fetch("https://snippetsync-backend.onrender.com/register",{
          method:'POST',
          mode:'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`

        },
          body:JSON.stringify({
            username: data.username,
            email: data.email,
            password: data.password
          })
        })
        if(response.ok){
          const user = await response.json()
          console.log("topken recieived",user.data.token)
          await cookies.set('token',user.data.token,{path:'/'});
          if(cookies.get("token")){
            console.log("cookie set")
            console.log(cookies.get('token'))
            authStateSignUp();
            hideLoading()
            console.log("naviagting to otp")
            navigate('/verify-otp')
          }

        }
        else{
          console.log("Registration failed")
        }


    }
    useEffect(() => {
        errors?.username?setError(errors.username.message):(null)
        errors?.password?setError(errors.password.message):(null)
        errors?.email?setError(errors.email.message):(null)



    }, [handleRegistration])
    

 

    

    return (
       <div className="flex items-center justify-center min-h-screen  ">
        {/* {isLoading?<div><l-helix
  size="100"
  speed="2.5" 
  color="white" 
></l-helix></div>:<> */}
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
          <p className=' text-sm text-white/60 mt-1'>Please sign-up your account and start the adventure</p>
        </div>
        

        {error && <p className="text-red-500 text-center text-xs ">{error}</p>}

        <form onSubmit={handleSubmit(handleRegistration)} className="space-y-5">
          <div>
            <Input
            className='bg-[#20334B] border-none py-3'

            label="Username"
            placeholder="Username"
            type="text"
            {
              ...register("username",{
                required:"Username is required"
              })
            }
            />
            </div>
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
            {/* <a href="" className='text-xs absolute translate-x-64 -translate-y-5 text-custom-purple'>Forgot Password?</a> */}
            <Input
            className='bg-[#20334B] border-none py-3'
              label="Password"
              placeholder="********"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 4,
                  message: "Password must be at least 4 characters long"
                },
                maxLength: {
                  value: 26,
                  message: "Password cannot exceed 26 characters"
                },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,26}$/,
                  message: "Password must contain at least one uppercase letter, one number, and one special character"
                }
              })}
            />
          </div>

          <div>
            <button type="submit" className="w-full px-4 py-2 font-medium text-white bg-custom-purple rounded-md focus:outline-none focus:shadow-outline">
              Sign Up
            </button>
            <p className='text-sm text-white/60 text-center mt-3'>Already on our platform? <a href="/login" className='text-custom-purple'>Login</a></p>
            
          </div>
        </form>
      </div>


    </div>
    
      )
}

export default Register