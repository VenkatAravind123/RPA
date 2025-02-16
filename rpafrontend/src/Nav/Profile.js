import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import Cookies from 'universal-cookie';
import './profile.css'
export default function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const cookies = new Cookies();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProtectedData = async () => {
      const token = cookies.get('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // First API call to get protected data
        const response = await axios.get(`${config.url}/protected`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Protected data:', response.data);
        setData(response.data);
        
        // Second API call to get user profile
        if (response.data && response.data._id) {
          const userResponse = await axios.get(`${config.url}/user/viewuserbyid/${response.data._id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('User profile:', userResponse.data);
          setUserProfile(userResponse.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchProtectedData();
  }, [navigate]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (loading || !userProfile) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-details">
        <div className="profile-field">
          <label>Name:</label>
          <span>{userProfile.name}</span>
        </div>
        <div className="profile-field">
          <label>Email:</label>
          <span>{userProfile.email}</span>
        </div>
        <div className="profile-field">
          <label>Phone:</label>
          <span>{userProfile.phonenumber}</span>
        </div>
        <div className="profile-field">
          <label>Role:</label>
          <span>{userProfile.role}</span>
        </div>
      </div>
    </div>
  );
}