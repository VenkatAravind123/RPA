import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import SideBar from './SideBar';
import Activity from './Activity';
import Engagement from './Engagement';
import Users from './Users';
import NotFound from '../Nav/NotFound';
import Home from '../Nav/Home';
import UserInfo from './UserInfo';

import { FaUsers, FaCalendarAlt, FaChartLine } from 'react-icons/fa';
import Manage from './Manage';
import { useAuth } from '../AuthContext';
import Cookies from 'universal-cookie';
import axios from 'axios';
const cookies = new Cookies();
export default function AdminDashboard() 
{
   const { isLoggedIn, logout, userRole } = useAuth();
   const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');

  const navigate = useNavigate();
   useEffect(() => {
    const fetchProtectedData = async () => {
      const token = cookies.get('token');
      if (!token) {
        return;
      }

      try {
        const response = await axios.get('http://localhost:2021/protected', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setData(response.data);
        setName(response.data.name);
      } catch (error) {
        setError('Error fetching protected data');
        console.error(error);
      }
    };

    fetchProtectedData();
  }, [navigate]);

  const dashboardStyle = {
    padding: "2rem",
    color: "#fff",
    width:"210%"
  };

  const heroStyle = {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "15px",
    padding: "2rem",
    marginBottom: "2rem",
    textAlign: "center",
    border: "1px solid rgba(255, 255, 255, 0.2)"
  };

  const cardsContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
    marginTop: "2rem"
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "10px",
    padding: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    transition: "transform 0.3s ease",
    cursor: "pointer",
    border: "1px solid rgba(255, 255, 255, 0.1)"
  };

  const iconStyle = {
    fontSize: "2.5rem",
    color: "#e0d074"
  };

  return (
    <div>
      <SideBar>
        <Routes>
          <Route path="/" element={
            <div style={dashboardStyle}>
              <div style={heroStyle}>
                <h1 style={{ color: "#e0d074", marginBottom: "1rem" }}>
                  Welcome to {userRole} Dashboard
                </h1>
                <p style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                  Manage your activities, users, and engagement all in one place
                </p>
              </div>

              <div style={cardsContainerStyle}>
                <div 
                  style={cardStyle}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <FaUsers style={iconStyle} />
                  <div>
                    <h3 style={{ color: "#e0d074" }}>Users</h3>
                    <p>Manage user accounts and permissions</p>
                  </div>
                </div>

                <div 
                  style={cardStyle}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <FaCalendarAlt style={iconStyle} />
                  <div>
                    <h3 style={{ color: "#e0d074" }}>Activities</h3>
                    <p>Create and manage club activities</p>
                  </div>
                </div>

                <div 
                  style={cardStyle}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <FaChartLine style={iconStyle} />
                  <div>
                    <h3 style={{ color: "#e0d074" }}>Engagement</h3>
                    <p>Track member participation and growth</p>
                  </div>
                </div>
              </div>
            </div>
          } />
          <Route path="activity" element={<Activity/>} />
          <Route path="engagement" element={<Engagement/>} />
          <Route path="users" element={<Users/>}/>
          <Route path="/" element={<Home/>}/>
          <Route path="users/:id" element={<UserInfo/>} />
          <Route path="manage" element={<Manage/>}/>
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </SideBar>
    </div>
  );
}