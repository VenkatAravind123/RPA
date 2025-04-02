import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navlogin.css';
import rpa from '../images/rpa3.png';
import axios from 'axios';
import config from '../config'
import { useAuth } from '../AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {login}  = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(`${config.url}/user/login`, {
        email: formData.email,
        password: formData.password
      });
      if(response.data.token)
      {
        login(response.data.token);
        setFormData({
          email: '',
          password: ''
        });
        navigate('/');
      }
    } catch (error) {

      setError(error.response?.data || 'Login failed. Please check your credentials.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-container">
      <div className='logo1-container'>
      <img src={rpa} alt='RPA Logo' className='logo1' />
      <h2>Login to RPA Club</h2>
      </div>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder='Email Address'
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder='Password'
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit">Login</button>
        </div>
        <Link to="/register" className='register'>Don't have an account? <span>Register here</span></Link>
      </form>
    </div>
  );
}