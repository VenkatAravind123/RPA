import React, { useState } from 'react'
import axios from 'axios'
import './Contact.css'
import config from '../config'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.url}/user/send-email`, formData);
      setStatus('Email sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending email:', error);
      setStatus('Failed to send email. Please try again.');
    }
  };

  return (
    <div className='contact' style={{display:"flex", justifyContent:"center", alignItems:"center",flexDirection:"column",padding:"40px",borderRadius:"10px"}}>
      <h1>Contact Us</h1>
      <div className='contact-container' style={{display:"flex", justifyContent:"space-between", alignItems:"center",flexDirection:"column",gap:"10px"}}>
        <form className='contact-form' onSubmit={handleSubmit} style={{display:"flex", justifyContent:"center", alignItems:"center",flexDirection:"column"}}>
          <input 
            type="text" 
            name="name"
            placeholder="Name" 
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input 
            type="email" 
            name="email"
            placeholder="Email" 
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea 
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit" className='contact-button'>Send Message</button>
        </form>
        {status && <div className={`status-message ${status.includes('Failed') ? 'error' : 'success'}`}>
          {status}
        </div>}
      </div>
    </div>
  )
}