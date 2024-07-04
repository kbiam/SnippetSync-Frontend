import React from 'react'
import { useId } from 'react'


const Input = React.forwardRef(function Input({
    label,
    type = 'text',
    className = '',
    ...props
    },ref){
    const id = useId()
    return(
        <div className='mt-12 '>
            {label && 
            <label htmlFor={id} className='absolute -translate-y-6 text-sm text-white/70 '>{label}</label>
            }
        <input type={type} className={`mt-1 px-3 py-2.5 rounded-lg text-sm font-normal text-white/80 outline-none border border-gray-200 focus:border-gray-400 duration-200 2-full w-full
         ${className}`} ref={ref} {...props} id={id} />
        </div>
        
    )
})

export default Input