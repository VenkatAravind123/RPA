import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cookies = new Cookies();

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [registeredActivities, setRegisteredActivities] = useState(new Set());


  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const token = cookies.get('token');
      const response = await axios.get('http://localhost:2021/user/get', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.data) {
        setActivities(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error fetching activities');
      setLoading(false);
    }
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
    marginTop: "1rem",
    width: "100%",
    transition: "all 0.3s ease",
    border: "2px solid transparent"
  };

  const handleRegister = async (activityId) => {
    if (registering) return;
    
    setRegistering(true);
    try {
      const token = cookies.get('token');
      if (!token) {
        toast.error('Please login to register');
        setRegistering(false);
        return;
      }
  
      const response = await axios.post(
        `http://localhost:2021/user/registeractivity/${activityId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.data.success) {
        toast.success('Successfully registered for activity!');
        setRegisteredActivities(prev => new Set([...prev, activityId]));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register for activity');
    } finally {
      setRegistering(false);
    }
  };
  
  const containerStyle = {
    padding: "2rem",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
    maxWidth: "1200px",
    margin: "0 auto"
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "15px",
    padding: "1.5rem",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    transition: "transform 30s ease",
    cursor: "pointer"
  };

  const imageStyle = {
    width: "100%",
    height: "300px",
    objectFit: "cover",
    marginBottom: "1rem"
  };

  const titleStyle = {
    color: "#e0d074",
    fontSize: "1.5rem",
    marginBottom: "1rem"
  };

  const detailStyle = {
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: "0.5rem"
  };

  if (loading) {
    return <div style={{color: "#fff", textAlign: "center", padding: "2rem"}}>Loading...</div>;
  }

  return (
    <div style={containerStyle}>
      {activities && activities.length > 0 ? (
        activities.map((activity) => (
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
            <h3 style={titleStyle}>{activity.name}</h3>
            <p style={detailStyle}>{activity.description}</p>
            <p style={detailStyle}>Venue: {activity.venue}</p>
            <p style={detailStyle}>Price: ₹{activity.price}</p>
            <p style={detailStyle}>
              Date: {activity.date ? new Date(activity.date).toLocaleDateString() : 'N/A'}
            </p>
            <button
          style={{
            ...registerButtonStyle,
            background: registeredActivities.has(activity._id) 
              ? 'rgba(224, 208, 116, 0.5)'
              : 'linear-gradient(135deg, #e0d074 0%, #d4b93c 100%)',
            cursor: registeredActivities.has(activity._id) ? 'default' : 'pointer'
          }}
          onClick={() => handleRegister(activity._id)}
          disabled={registeredActivities.has(activity._id)}
        >
          {registeredActivities.has(activity._id) ? 'Registered' : 'Register Now'}
        </button>
          </div>
        ))
      ) : (
        <div style={{color: "#fff", textAlign: "center", gridColumn: "1 / -1"}}>
          No activities found
        </div>
      )}
      <ToastContainer position="top-right" />
    </div>
  );
}