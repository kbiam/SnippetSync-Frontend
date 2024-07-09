import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from './ui/button';
import { helix } from 'ldrs';
import { useContext } from 'react';
import LoadingContext from './context/LoadingContext';
import AuthContext from './context/AuthContext';

helix.register()

function Otp() {
  const {isLoading, showLoading, hideLoading} = useContext(LoadingContext)
  const cookies = new Cookies();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(false); // Added loading state
  const token = cookies.get('token')
  const {authState, authStateSignUp, logoutAuthState, verifyAuthState, loginAuthState} = useContext(AuthContext)

  const handleOtp = async (data) => {
    try {
      showLoading(); // Set loading state on form submission
      const response = await fetch('https://snippetsync-backend.onrender.com/verifyOtp', {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": 'application/json',
          'Authorization': `Bearer ${token}`

        },
        credentials: "include",
        body: JSON.stringify({ otp: data.otp })
      });

      if (response.ok) {
        const verifiedToken = await response.json();
        console.log('Verified token:', verifiedToken);
        if (verifiedToken && verifiedToken.token) {
          cookies.remove('token');
          const currentDate = new Date();
          const expiryDate = new Date(currentDate.getTime() + 10 * 24 * 60 * 60 * 1000); // 5 days in milliseconds

          await cookies.set('token', verifiedToken.token, { path: '/',expires:expiryDate});
          if(cookies.get('token')){
            loginAuthState()
            navigate('/snippets');
          }
          else{
            console.log("no token avail")
          }
        } else {
          setError("Invalid response from server");
        }
      } else {
        setError("Invalid OTP");
      }
    } catch (error) {
      console.error('Error occurred during OTP verification:', error);
      setError("Failed to verify OTP. Please try again.");
    } finally {
      hideLoading(); // Reset loading state after request completes
    }
  };

  const handleStartAgain = async () => {
    try {
      showLoading(); // Set loading state on button click
      const response = await fetch("https://snippetsync-backend.onrender.com/startAgain", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        credentials: "include"
      });

      if (response.ok) {
        cookies.remove("token");
        logoutAuthState();
        console.log("Cookie removed, navigating to /signup");
        navigate('/signup');
      } else {
        console.error('Failed to start again:', response);
        setError("Failed to start again. Please try again.");
      }
    } catch (error) {
      console.error('Error occurred during start again:', error);
      setError("Failed to start again. Please try again.");
    } finally {
      hideLoading(); // Reset loading state after request completes
    }
  };

  
  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent ">
      <div className="max-w-min px-14 py-14 space-y-8 bg-[#162235] rounded-xl shadow-custom-black flex-col items-center justify-center ">

      <div className=''>
        <p className=' text-xl mb-10 font-medium text-white/90'>One Time Password</p>
      </div>
      <form onSubmit={handleSubmit(handleOtp)} className=''>
        <div className=''>
        <InputOTP maxLength={6} {...register("otp", { required: "Please enter 6-digit OTP" })}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        </div>
        {errors.otp && <p className='text-red-600 absolute text-xs -translate-y-20 translate-x-32'>{errors.otp.message}</p>}
        <div className=' mt-6 font-normal text-white/70 text-sm  '>
          <p>Please enter the one-time password sent to your email address</p>
        </div>
        <div className=' mt-10 flex w-96 justify-between align-middle'>
          <Button className={`bg-[#1c2f43] hover:bg-[#1d2b43] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit'}
          </Button>
          <button type="button" onClick={handleStartAgain}>
            <p className='underline text-xs text-white/80'>Start Again?</p>
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}

export default Otp;
