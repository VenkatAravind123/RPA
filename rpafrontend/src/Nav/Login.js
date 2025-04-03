import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navlogin.css';
import rpa from '../images/rpa3.png';
import axios from 'axios';
import config from '../config';
import { useAuth } from '../AuthContext';
import { toast } from 'react-toastify';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

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
      // Add debugging logs
      console.log("Attempting login with:", {
        email: formData.email,
        passwordLength: formData.password.length,
        apiUrl: `${config.url}/user/login`
      });

      const response = await axios.post(`${config.url}/user/login`, {
        email: formData.email,
        password: formData.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Login response:", {
        status: response.status,
        hasToken: response.data?.token ? true : false,
        role: response.data?.role
      });

      if (response.data.token) {
        // Store token and update auth state
        login(response.data.token);
        
        // Clear form
        setFormData({
          email: '',
          password: ''
        });
        
        // Show success message
        toast.success("Login successful!");
        
        // Redirect to home page
        navigate('/');
      } else {
        console.warn("Login response missing token:", response.data);
        setError('Authentication failed. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      // Detailed error logging
      console.error('Login error details:', {
        message: error.message,
        status: error.response?.status,
        data: JSON.stringify(error.response?.data),
        url: `${config.url}/user/login`
      });
      
      // User-friendly error messages
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (typeof error.response?.data === 'string') {
        setError(error.response.data);
      } else if (error.response?.status === 401) {
        setError('Invalid email or password. Please check your credentials.');
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else if (error.message === 'Network Error') {
        setError('Network error. Please check your connection or try again later.');
      } else {
        setError(`Login failed: ${error.message}`);
      }
      
      setLoading(false);
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
            disabled={loading}
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
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
        <Link to="/register" className='register'>Don't have an account? <span>Register here</span></Link>
      </form>
    </div>
  );
}