import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { IoEye } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import config from '../config'
import { IoDownloadOutline } from "react-icons/io5";
const cookies = new Cookies();

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Add loading spinner style
  const loadingSpinnerStyle = {
    width: "50px",
    aspectRatio: "1",
    borderRadius: "50%",
    background: "radial-gradient(farthest-side,#ffa516 94%,transparent) top/8px 8px no-repeat, conic-gradient(transparent 30%,#ffa516)",
    WebkitMask: "radial-gradient(farthest-side,transparent calc(100% - 8px),#000 0)",
    animation: "l13 1s infinite linear",
    margin: "20px auto"
  };

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
  
  // Other style objects...
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

  // Add keyframe animation
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
    const fetchUsers = async () => {
      try {
        const token = cookies.get('token');
        const response = await axios.get(`${config.url}/user/getallusers`, {
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

  // Updated loading state with spinner
  if (loading) {
    return (
      <div style={{
        ...containerStyle, 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center'
      }}>
        <div style={loadingSpinnerStyle}></div>
        <p style={{color: "#e0d074", marginTop: "20px", fontSize: "16px"}}>Loading users data...</p>
      </div>
    );
  }
  
  if (error) return <div style={{...containerStyle, color: '#ff6b6b'}}>Error: {error}</div>;

  // Rest of your component code...
  const handledownloadUsers =  ()=>{
    try{
      const headers = ['Name', 'Email', 'Phonenumber', 'Department', 'Role'];
      const csvData = users.map(user =>[
        user.name,
        user.email,
        user.phonenumber,
        user.department,
        user.role
      ])

      const csvContent = [
        headers.join(','), ...csvData.map(r => r.join(','))
      ].join('\n');

      const blob = new Blob([csvContent],{type: 'text/csv'});
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'users.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Users downloaded successfully');
    }
    catch(error){
      console.error(error.message);
      toast.error('Error downloading users');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={tableHeaderContainerStyle}>
        <h2 style={tableHeaderStyle}>Users Management</h2>
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
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Phonenumber</th>
            <th style={thStyle}>Department</th>
            <th style={thStyle}>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td style={tdStyle}>{user.name}</td>
              <td style={tdStyle}>{user.email}</td>
              <td style={tdStyle}>{user.phonenumber}</td>
              <td style={tdStyle}>{user.department}</td>
              <td style={tdStyle}>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}