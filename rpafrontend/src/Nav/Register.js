// RegisterForm.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './navRegister.css';

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

    try {
      await axios.post('http://localhost:2021/user/register', formData);
      navigate('/login');
    } catch (error) {
      setError(error.response?.data || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

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
  {loading ? 'Registering...' : 'Register'}
</button>
      </form>
    </div>
  );
};

export default RegisterForm;