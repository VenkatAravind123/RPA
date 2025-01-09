import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { IoEye } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IoDownloadOutline } from "react-icons/io5";
const cookies = new Cookies();

export default function Engagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activityNames, setActivityNames] = useState({});


  const navigate = useNavigate();
  const buttonStyle = {
    background: "linear-gradient(135deg, #e0d074 0%, #d4b93c 100%)",
    color: "#1a1a1a",
    padding: "0.8rem 1.5rem",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "bold"
  };
  const tableHeaderContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem"
  };
  
  const tableHeaderStyle = {
    color: "#e0d074",
    margin: 0
  };
  const downloadButtonStyle = {
    background: "linear-gradient(135deg, #4ecdc4 0%, #2ab1a3 100%)",
    color: "#1a1a1a",
    width: "45px",
    height: "45px",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    border: "2px solid transparent",
    marginBottom: "1rem"
  };

  const iconStyle = {
    fontSize: "1.5rem"

  };
  const handledownloadUsers = () => {
    try {
      const headers = ['Name', 'Email', 'Phone', 'Department', 'Role', 'Registered Activities', 'Registration Date', 'Status'];
      
      const csvData = users.map(user => {
        const activities = user.registeredActivities.map(activity => {
          return `${activityNames[activity.activity] || 'Unknown Activity'} (${new Date(activity.registeredAt).toLocaleDateString()} - ${activity.status})`;
        }).join('; ');
  
        return [
          user.name,
          user.email,
          user.phonenumber,
          user.department,
          user.role,
          activities || 'No activities registered',
          user.registeredActivities.length > 0 ? user.registeredActivities.map(a => new Date(a.registeredAt).toLocaleDateString()).join('; ') : 'N/A',
          user.registeredActivities.length > 0 ? user.registeredActivities.map(a => a.status).join('; ') : 'N/A'
        ];
      });
  
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');
  
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'users_with_activities.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
  
      toast.success('Users and activities downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download data');
    }
  };

  const activityCardStyle = {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    borderRadius: "8px",
    padding: "1rem",
    marginBottom: "0.8rem",
    border: "1px solid rgba(224, 208, 116, 0.2)",
    transition: "transform 0.3s ease",
    cursor: "default"
  };
  
  const statusBadgeStyle = {
    display: "inline-block",
    padding: "0.3rem 0.8rem",
    borderRadius: "15px",
    fontSize: "0.8rem",
    fontWeight: "bold",
    background: "rgba(78, 205, 196, 0.2)",
    color: "#4ecdc4",
    marginTop: "0.5rem"
  };
  
  const dateStyle = {
    color: "#e0d074",
    fontSize: "0.85rem",
    marginTop: "0.5rem"
  };
  
  const containerStyle = {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    padding: "2rem",
    borderRadius: "15px",
    width: "130%",
    color: "#fff",
    flex: 1,
    margin: "1rem",
    minHeight: "calc(100vh - 2rem)",
    overflow: "auto",
    position: "relative"
  };
  
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem"
  };
  
  // ...existing code...

  const thStyle = {
    padding: "1rem",
    textAlign: "left",
    borderBottom: "2px solid rgba(224, 208, 116, 0.3)",
    color: "#e0d074",
    fontWeight: "600"
  };

  const tdStyle = {
    padding: "1rem",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
  };

  const headerStyle = {
    color: "#e0d074",
    marginBottom: "2rem",
    fontSize: "2rem",
    textAlign: "center"
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = cookies.get('token');
        const response = await axios.get('http://localhost:2021/user/getallusers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(()=>{
    const fetchActivityNames = async () => {
      try {
        const token = cookies.get('token');
        const uniqueActivityIds = [...new Set(
          users.flatMap(user => 
            user.registeredActivities.map(activity => activity.activity)
          )
        )];
  
        const activityData = {};
        for (const activityId of uniqueActivityIds) {
          const response = await axios.get(
            `http://localhost:2021/user/getallactivities`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const activities = response.data.data;
          const activity = activities.find(a => a._id === activityId);
          if (activity) {
            activityData[activityId] = activity.name;
          }
        }
        setActivityNames(activityData);
      } catch (error) {
        console.error('Error fetching activity names:', error);
      }
    };
  
    if (users.length > 0) {
      fetchActivityNames();
    }
  },[users])



  if (loading) return <div style={{...containerStyle, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Loading...</div>;
  if (error) return <div style={{...containerStyle, color: '#ff6b6b'}}>Error: {error}</div>;

  

  return (
    <div style={containerStyle}>
      
      <div style={tableHeaderContainerStyle}>
      <h2 style={tableHeaderStyle}>Users Engagement in Activities</h2>
      <button 
        style={downloadButtonStyle}
        onClick={handledownloadUsers}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderColor = '#4ecdc4';
          e.currentTarget.style.color = '#4ecdc4';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, #4ecdc4 0%, #2ab1a3 100%)';
          e.currentTarget.style.borderColor = 'transparent';
          e.currentTarget.style.color = '#1a1a1a';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <IoDownloadOutline style={iconStyle} />
      </button>
    </div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Department</th>
            <th style={thStyle}>Registered Activities</th>
          </tr>
        </thead>
        <tbody>
      {users.map((user) => (
        <tr key={user._id}>
          <td style={tdStyle}>{user.name}</td>
          <td style={tdStyle}>{user.department}</td>
          <td style={{...tdStyle, padding: "1rem"}}>
            {user.registeredActivities.map((activity, index) => (
              <div 
                key={index} 
                style={activityCardStyle}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{fontSize: "1.1rem", color: "#fff"}}>
                  {activityNames[activity.activity] || 'Loading...'}
                </div>
                <div style={dateStyle}>
                  <i className="far fa-calendar-alt" style={{marginRight: "0.5rem"}}></i>
                  {new Date(activity.registeredAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                <div style={statusBadgeStyle}>
                  {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                </div>
              </div>
            ))}
            {user.registeredActivities.length === 0 && (
              <div style={{color: "rgba(255, 255, 255, 0.5)", fontStyle: "italic"}}>
                No activities registered
              </div>
            )}
          </td>
        </tr>
      ))}
    </tbody>
      </table>
    </div>
  );
}