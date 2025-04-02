import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import SideBar from './SideBar';
import Activity from './Activity';
import Engagement from './Engagement';
import Users from './Users';
import NotFound from '../Nav/NotFound';
import Home from '../Nav/Home';
import UserInfo from './UserInfo';
import config from '../config'
import { FaUsers, FaCalendarAlt, FaChartLine } from 'react-icons/fa';
import Manage from './Manage';
import { useAuth } from '../AuthContext';
import Cookies from 'universal-cookie';
import axios from 'axios';
import './AdminDashboard.css';

const cookies = new Cookies();

export default function AdminDashboard() {
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
        const response = await axios.get(`${config.url}/protected`, {
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

  return (
    <div>
      <SideBar>
        <Routes>
          <Route path="/" element={
            <div className="admin-dashboard">
              <div className="admin-hero">
                <h1>Welcome to {userRole} Dashboard</h1>
                <p>Manage your activities, users, and engagement all in one place</p>
              </div>

              <div className="admin-cards-container">
                <div className="admin-card">
                  <FaUsers className="admin-card-icon" />
                  <div>
                    <h3>Users</h3>
                    <p>Manage user accounts and permissions</p>
                  </div>
                </div>

                <div className="admin-card">
                  <FaCalendarAlt className="admin-card-icon" />
                  <div>
                    <h3>Activities</h3>
                    <p>Create and manage club activities</p>
                  </div>
                </div>

                <div className="admin-card">
                  <FaChartLine className="admin-card-icon" />
                  <div>
                    <h3>Engagement</h3>
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