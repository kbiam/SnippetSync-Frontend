import React from 'react'

function Modal({isVisible, children, onClose}) {
    if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 transition-all ease-in-out 300ms">
      <div className="bg-[#141E30] p-10 border border-gray-600 rounded-lg shadow-lg">
      <button onClick={onClose} className=" absolute translate-x-96 -translate-y-7 bg-[#243B55] hover:bg-[#2a4564] flex justify-center items-center rounded-xl w-8 h-8 pt-2 "><span className='text-2xl '><ion-icon name="close-outline" size=''></ion-icon></span></button>
{children}
</div>
    </div>
  )
}

export default Modal