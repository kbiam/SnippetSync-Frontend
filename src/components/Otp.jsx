import React, { useState } from 'react';
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

function Otp() {
  const cookies = new Cookies(null, { path: '/' });
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setloading] = useState(true)

  const handleOtp = async (data) => {
    const response = await fetch('http://localhost:3000/verifyOtp', {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": 'application/json'
      },
      credentials: "include",
      body: JSON.stringify({ otp: data.otp })
    });
    
    if (response.ok) {
      const verifiedToken = await response.json();
      console.log('Verified token:', verifiedToken);
      if (verifiedToken) {
        cookies.remove('token');
        cookies.set('token', verifiedToken.token, { path: '/' });
        navigate('/snippets');
      }
    } else {
      setError("Invalid OTP");
    }
  };

  const handleStartAgain = async () => {
    const response = await fetch("http://localhost:3000/startAgain", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    });
    
    if (response.ok) {
      cookies.remove("token");
      console.log("Cookie removed, navigating to /signup");
      navigate('/signup');
    } else {
      console.error('Failed to start again:', response);
    }
  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-transparent ">
      <div>
        <p className='-translate-y-20 text-xl absolute font-medium text-white/90'>One Time Password</p>
      </div>
      <form onSubmit={handleSubmit(handleOtp)}>
        <InputOTP maxLength={6} {...register("otp", { required: "Please enter 6-digit otp" })}>
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
        <div>
          {/* {error && <p className='text-red-600 absolute text-xs -translate-y-20 translate-x-32'>{error}</p>} */}
        </div>
        <div className='absolute translate-y-4 font-medium text-white/70'>
          <p>Please enter the one-time password sent to your email address</p>
        </div>
        <div className='absolute translate-y-16 flex w-96 justify-between align-middle'>
          <Button className="bg-[#152032] hover:bg-[#182438]">Submit</Button>
          <button type="button" onClick={handleStartAgain}>
            <p className='underline text-xs text-white/80'>Start Again?</p>
          </button>
        </div>
      </form>
    </div>
  );
}

export default Otp;
