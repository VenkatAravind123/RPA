import React from 'react'
import './Contact.css'  
export default function Contact() {
  return (
    <div className='contact' style={{display:"flex", justifyContent:"center", alignItems:"center",flexDirection:"column",padding:"40px",borderRadius:"10px"}}>
      <h1>Contact Us</h1>
      <div className='contact-container' style={{display:"flex", justifyContent:"space-between", alignItems:"center",flexDirection:"column",gap:"10px"}}>
      <form className='contact-form' style={{display:"flex", justifyContent:"center", alignItems:"center",flexDirection:"column"}}>
        <input type="text" placeholder="Name" />
        <input type="email" placeholder="Email" />
        <textarea placeholder="Message"></textarea>
      </form>
      <button className='contact-button'>Contact US</button>
      </div>
    </div>
  )
}
