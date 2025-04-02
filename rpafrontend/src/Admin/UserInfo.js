import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { toast, ToastContainer } from 'react-toastify';
import config from '../config'
import 'react-toastify/dist/ReactToastify.css';

const cookies = new Cookies();

export default function UserInfo() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const containerStyle = {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    padding: "2rem",
    borderRadius: "15px",
    color: "#fff",
    width: "100%",
    minHeight: "calc(100vh - 2rem)",
    margin: "1rem"
  };

  const headerStyle = {
    color: "#e0d074",
    marginBottom: "2rem",
    fontSize: "2rem"
  };

  const detailStyle = {
    marginBottom: "1rem",
    padding: "1rem",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "8px"
  };
  
  // Add loading spinner style
  const loadingSpinnerStyle = {
    width: "50px",
    aspectRatio: "1",
    borderRadius: "50%",
    background: "radial-gradient(farthest-side,#ffa516 94%,transparent) top/8px 8px no-repeat, conic-gradient(transparent 30%,#ffa516)",
    WebkitMask: "radial-gradient(farthest-side,transparent calc(100% - 8px),#000 0)",
    animation: "l13 1s infinite linear",
    margin: "100px auto"
  };
  
  // Add keyframes animation
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes l13 { 
        100% { transform: rotate(1turn); }
      }
    `;
    document.head.appendChild(styleSheet);
    
    // Clean up function to remove styles when component unmounts
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = cookies.get('token');
        if (!token) {
          setError('Authorization required');
          return;
        }

        const response = await axios.get(`${config.url}/user/viewuserbyid/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data) {
          setUserData(response.data);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setError(error.response?.data?.message || 'Error fetching user details');
        toast.error('Error fetching user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  // Updated loading state with spinner
  if (loading) {
    return (
      <div style={{...containerStyle, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <div style={loadingSpinnerStyle}></div>
        <p style={{color: "#e0d074", marginTop: "20px", fontSize: "16px"}}>Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return <div style={containerStyle}>Error: {error}</div>;
  }

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>User Details</h2>
      {userData && (
        <div>
          <div style={detailStyle}>
            <strong>Name:</strong> {userData.name}
          </div>
          <div style={detailStyle}>
            <strong>Email:</strong> {userData.email}
          </div>
          <div style={detailStyle}>
            <strong>Role:</strong> {userData.role}
          </div>
          <div style={detailStyle}>
            <strong>Status:</strong> {userData.status}
          </div>
          <div style={detailStyle}>
            <strong>Created At:</strong> {new Date(userData.createdAt).toLocaleString()}
          </div>
        </div>
      )}
      <ToastContainer position="top-right" />
    </div>
  );
}