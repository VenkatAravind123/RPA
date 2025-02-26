import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../config'

const cookies = new Cookies();

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeredActivities, setRegisteredActivities] = useState(new Set());
  const [registering, setRegistering] = useState(false);
  const [registeredIds, setRegisteredIds] = useState(new Set());
  const [showRegistered, setShowRegistered] = useState(false);

  const containerStyle = {
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    gap: "2rem"
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem"
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "15px",
    padding: "1.5rem",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    transition: "transform 0.3s ease",
    color: "#fff"
  };

  const imageStyle = {
    width: "100%",
    height: "200px", // Reduced from 300px
    objectFit: "contain", // Changed from 'cover' to 'contain'
    marginBottom: "1rem",
    background: "rgba(0, 0, 0, 0.2)", // Optional: adds a subtle background
    borderRadius: "8px", // Optional: adds rounded corners
    padding: "10px"
  };

  const registerButtonStyle = {
    background: "linear-gradient(135deg, #e0d074 0%, #d4b93c 100%)",
    color: "#1a1a1a",
    padding: "0.8rem 1.5rem",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "bold",
    width: "100%",
    marginTop: "1rem",
    transition: "all 0.3s ease"
  };

  const toggleButtonStyle = {
    ...registerButtonStyle,
    width: "auto",
    alignSelf: "center",
    marginBottom: "1rem"
  };

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
    return <div style={{color: "#fff", textAlign: "center", padding: "2rem"}}>Loading...</div>;
  }

  const displayedActivities = showRegistered 
    ? activities.filter(activity => registeredActivities.has(activity._id))
    : activities;

  return (
    <div style={containerStyle}>
      {cookies.get('token') && (
        <button 
          style={toggleButtonStyle}
          onClick={() => setShowRegistered(!showRegistered)}
        >
          {showRegistered ? 'Show All Activities' : 'Show My Registered Activities'}
        </button>
      )}

      <div style={gridStyle}>
        {displayedActivities.length > 0 ? (
          displayedActivities.map((activity) => (
            <div 
              key={activity._id} 
              style={cardStyle}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <img 
                src={activity.image} 
                alt={activity.name} 
                style={imageStyle}
              />
              <h3 style={{ color: "#e0d074", marginBottom: "1rem" }}>{activity.name}</h3>
              <p style={{ marginBottom: "0.5rem" }}>{activity.description}</p>
              <p style={{ color: "#e0d074", marginBottom: "0.5rem" }}>
                Venue: {activity.venue}
              </p>
              <p style={{ marginBottom: "0.5rem" }}>Price: ₹{activity.price}</p>
              <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
              {cookies.get('token') && (
                <button
                  style={{
                    ...registerButtonStyle,
                    background: registeredActivities.has(activity._id) || registeredIds.has(activity._id)
                      ? 'rgba(224, 208, 116, 0.5)'
                      : 'linear-gradient(135deg, #e0d074 0%, #d4b93c 100%)',
                    cursor: registeredActivities.has(activity._id) || registeredIds.has(activity._id) || registering
                      ? 'default'
                      : 'pointer',
                    opacity: registering ? 0.7 : 1
                  }}
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
          <div style={{color: "#fff", textAlign: "center", gridColumn: "1 / -1"}}>
            {showRegistered ? 'No registered activities found' : 'No activities found'}
          </div>
        )}
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
}