// RegisterForm.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './navRegister.css';
import config from '../config';
import { toast } from 'react-toastify';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phonenumber: '',
    password: '',
    department: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Validation function
  const validateForm = () => {
    // Name validation
    if (formData.name.trim().length < 3) {
      setError("Name must be at least 3 characters");
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    
    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phonenumber)) {
      setError("Phone number must be 10 digits");
      return false;
    }
    
    // Password validation
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    
    // Department validation
    if (!formData.department) {
      setError("Please select a department");
      return false;
    }
    
    return true;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const response = await axios.post(`${config.url}/user/register`, formData);
      console.log("Registration successful:", response);
      toast.success("Registration successful! Please login.");
      navigate('/login');
    } catch (error) {
      console.error('Registration error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Better error message extraction
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (typeof error.response?.data === 'string') {
        setError(error.response.data);
      } else if (error.response?.status === 500) {
        setError('Server error. This email might already be registered.');
      } else {
        setError('Registration failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // CSS for loading spinner
  const spinnerStyle = {
    display: 'inline-block',
    width: '20px',
    height: '20px',
    marginLeft: '8px',
    borderRadius: '50%',
    borderTop: '2px solid transparent',
    borderRight: '2px solid transparent',
    borderBottom: '2px solid #1a1a1a',
    borderLeft: '2px solid #1a1a1a',
    animation: 'spin 1s linear infinite'
  };

  // Add keyframe animation for spinner
  if (typeof document !== 'undefined' && !document.getElementById('register-spinner-style')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'register-spinner-style';
    styleSheet.innerHTML = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styleSheet);
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">RPA Club Registration</h2>
        
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder='Enter your name'
            className="form-input"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder='Enter your email'
            className="form-input"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            name="phonenumber"
            value={formData.phonenumber}
            onChange={handleChange}
            placeholder='Enter your phone number'
            className="form-input"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder='Enter your password'
            className="form-input"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label>Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="form-input"
            disabled={loading}
            required
          >
            <option value="">Select Department</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="AI&DS">AI&DS</option>
            <option value="ME">ME</option>
            <option value="CE">CE</option>
            <option value="CS/IT">CS/IT</option>
            <option value="EE">EE</option>
          </select>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button 
          type="submit" 
          className="register-button"
          disabled={loading}
        >
          {loading ? (
            <>
              Registering
              <span style={spinnerStyle}></span>
            </>
          ) : 'Register'}
        </button>

        <div className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;