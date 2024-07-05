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

helix.register()

function Otp() {
  const cookies = new Cookies();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state
  const token = cookies.get('token')

  const handleOtp = async (data) => {
    try {
      setLoading(true); // Set loading state on form submission
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
          await cookies.set('token', verifiedToken.token, { path: '/'});
          if(cookies.get('token')){
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
      setLoading(false); // Reset loading state after request completes
    }
  };

  const handleStartAgain = async () => {
    try {
      setLoading(true); // Set loading state on button click
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
      setLoading(false); // Reset loading state after request completes
    }
  };

  
  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent ">
      <div>
        <p className='-translate-y-20 text-xl absolute font-medium text-white/90'>One Time Password</p>
      </div>
      <form onSubmit={handleSubmit(handleOtp)}>
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
        {errors.otp && <p className='text-red-600 absolute text-xs -translate-y-20 translate-x-32'>{errors.otp.message}</p>}
        <div className='absolute translate-y-4 font-medium text-white/70'>
          <p>Please enter the one-time password sent to your email address</p>
        </div>
        <div className='absolute translate-y-16 flex w-96 justify-between align-middle'>
          <Button className={`bg-[#152032] hover:bg-[#182438] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
          <button type="button" onClick={handleStartAgain}>
            <p className='underline text-xs text-white/80'>Start Again?</p>
          </button>
        </div>
      </form>
    </div>
  );
}

export default Otp;
