import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import Input from './Input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [step, setStep] = useState(1); // To control the steps
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()

  const onSubmit = (data) => {
    if (step === 1) {
      // Handle send OTP logic here
      console.log("Send OTP:", data.email);
      setIsLoading(true);
      const handleStep1 = async()=>{
        const res = await fetch("https://snippetsync-backend.onrender.com/forgotPassword",{
          method:"POST",
          mode:"cors",
          headers: {
            "Content-Type": "application/json"
          },
          body:JSON.stringify({
            email:data.email
          })
        })
        if(res.ok){
          setIsLoading(false)
          setStep(2)
        }
      }
      handleStep1();

    } else {
      setIsLoading(true)
      const handleStep2 = async()=>{
        const res = await fetch("https://snippetsync-backend.onrender.com/resetPassword",{
          method:"POST",
          mode:"cors",
          headers: {
            "Content-Type": "application/json"
          },
          body:JSON.stringify({
            email:data.email,
            otp:data.otp,
            newPassword:data.newPassword
          })
        })
        if(res.ok){
          setIsLoading(false)
          navigate('/login')
        }
      }
      handleStep2();
      // Handle reset password logic here
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-2/6 px-12 py-14 space-y-8 bg-[#162235] rounded-xl shadow-custom-black">
        <div>
          <h1 className="text-lg font-medium text-white/100 flex justify-center">Reset Password</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {step === 1 && (
            <>
              <Input
                className='bg-[#20334B] border-none py-3'
                label="Email"
                placeholder="Your email address"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  validate: {
                    matchPattern: value =>
                      /^\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(value) || "Email is invalid"
                  }
                })}
              />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
              <button type="submit" disabled={isLoading} className={`w-full px-4 py-2 mt-6 font-medium text-white bg-custom-purple rounded-md focus:outline-none focus:shadow-outline ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {isLoading ? "Sending..." : "Verify your email"}
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <div className='flex justify-center mb-12'>
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
                {errors.otp && <p className="text-red-500">{errors.otp.message}</p>}
              </div>
              <Input
                className='bg-[#20334B] border-none py-3'
                label="New Password"
                placeholder="New Password"
                type="password"
                {...register("newPassword", {
                  required: "Password is required"
                })}
              />
              {errors.newPassword && <p className="text-red-500">{errors.newPassword.message}</p>}
              <button type="submit" disabled={isLoading} className={`w-full px-4 py-2 mt-16 font-normal text-white bg-custom-purple rounded-md focus:outline-none focus:shadow-outline ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
