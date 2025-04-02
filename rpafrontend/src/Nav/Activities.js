import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../config'
import './Activities.css'
const cookies = new Cookies();

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeredActivities, setRegisteredActivities] = useState(new Set());
  const [registering, setRegistering] = useState(false);
  const [registeredIds, setRegisteredIds] = useState(new Set());
  const [showRegistered, setShowRegistered] = useState(false);

  

  
  const fetchActivities = async () => {
    try {
      const token = cookies.get('token');
      
      if (token) {
        const [activitiesResponse, userResponse] = await Promise.all([
          axios.get(`${config.url}/user/getactivities`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${config.url}/user/get`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setActivities(activitiesResponse.data.data || []);
        const userRegisteredActivities = userResponse.data.registeredActivities || [];
        const registeredIds = new Set(userRegisteredActivities.map(ra => ra.activity));
        setRegisteredActivities(registeredIds);
        setRegisteredIds(registeredIds);
      } else {
        const response = await axios.get(`${config.url}/user/get`);
        setActivities(response.data.data || []);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error('Error fetching activities');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleRegister = async (activityId) => {
    try {
      const token = cookies.get('token');
      if (!token) {
        toast.error('You need to be logged in to register for activities');
        return;
      }

      setRegistering(true);
      setRegisteredIds(prev => new Set([...prev, activityId]));

      const response = await axios.post(
        `${config.url}/user/registeractivity/${activityId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setRegisteredActivities(prev => new Set([...prev, activityId]));
        toast.success('Successfully registered for activity!');
        fetchActivities();
      }
    } catch (error) {
      setRegisteredIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(activityId);
        return newSet;
      });
      toast.error(error.response?.data?.message || 'Failed to register for activity');
    } finally {
      setRegistering(false);
    }
  };

  
  if (loading) {
    return <div className="loading-text"></div>;
  }

  const displayedActivities = showRegistered 
    ? activities.filter(activity => registeredActivities.has(activity._id))
    : activities;

  return (
    <div className="activities-container">
      {cookies.get('token') && (
        <button 
          className="toggle-button"
          onClick={() => setShowRegistered(!showRegistered)}
        >
          {showRegistered ? 'Show All Activities' : 'Show My Registered Activities'}
        </button>
      )}

      <div className="activities-grid">
        {displayedActivities.length > 0 ? (
          displayedActivities.map((activity) => (
            <div 
              key={activity._id} 
              className="activity-card"
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="image-container">
                <img 
                  src={activity.image} 
                  alt={activity.name} 
                  className="activity-image1"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
              <h3 className="activity-title">{activity.name}</h3>
              {activity.description && (
                <p className="activity-description">{activity.description}</p>
              )}
              {activity.venue && (
                <p className="activity-venue">
                  Venue: {activity.venue}
                </p>
              )}
              {activity.price !== undefined && activity.price !== null && (
                <p className="activity-price">
                  Price: ₹{Number(activity.price).toLocaleString('en-IN') || '0'}
                </p>
              )}
              {activity.date && (
                <p className="activity-date">
                  Date: {new Date(activity.date).toLocaleDateString()}
                </p>
              )}
              {cookies.get('token') && (
                <button
                  className="register-button"
                  onClick={() => handleRegister(activity._id)}
                  disabled={registeredActivities.has(activity._id) || registeredIds.has(activity._id) || registering}
                >
                  {registeredActivities.has(activity._id) || registeredIds.has(activity._id)
                    ? 'Registered'
                    : registering
                      ? 'Registering...'
                      : 'Register Now'}
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="no-activities">
            {showRegistered ? 'No registered activities found' : 'No activities found'}
          </div>
        )}
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
}