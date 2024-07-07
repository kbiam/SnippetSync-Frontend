import React from 'react'

function Notification({message}) {
  return (
    <div className="notification">
    <div className="notification__body">
        <img
            src="images/check-circle.svg"
            alt="Success"
            className="notification__icon"
        />
        <p id="notiP">{message}</p> 
    </div>
    <div className="notification__progress"></div>
</div>
  )
}

export default Notification