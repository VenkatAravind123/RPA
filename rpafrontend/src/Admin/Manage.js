import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cookies = new Cookies();

export default function Manage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [highlightedId, setHighlightedId] = useState(null);

  const containerStyle = {
    padding: "2rem",
    color: "#fff"
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "15px",
    overflow: "hidden"
  };

  const thStyle = {
    padding: "1rem",
    textAlign: "left",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    color: "#e0d074"
  };

  const tdStyle = {
    padding: "1rem",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
  };

  const selectStyle = {
    background: "rgba(255, 255, 255, 0.1)",
    color: "#fff",
    padding: "0.8rem",
    border: "2px solid rgba(224, 208, 116, 0.3)",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: "0.9rem",
    width: "100%",
    appearance: "none",
    backgroundImage: "linear-gradient(45deg, transparent 50%, #e0d074 50%), linear-gradient(135deg, #e0d074 50%, transparent 50%)",
    backgroundPosition: "calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px)",
    backgroundSize: "5px 5px, 5px 5px",
    backgroundRepeat: "no-repeat"
  };

  const highlightStyle = {
    animation: "highlight 1s ease-in-out"
  };

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes highlight {
        0% { background: rgba(224, 208, 116, 0.2); }
        100% { background: transparent; }
      }
    `;
    document.head.appendChild(styleSheet);
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = cookies.get('token');
      const response = await axios.get('http://localhost:2021/user/getallusers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching users');
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    const previousRole = users.find(u => u._id === userId)?.role;
    
    try {
      setUpdatingUserId(userId);
      const token = cookies.get('token');
      const response = await axios.put(`http://localhost:2021/user/updaterole/${userId}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status === 200) {
        setHighlightedId(userId);
        toast.success(`Role updated successfully: ${previousRole} → ${newRole}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
          style: {
            background: 'rgba(26, 26, 26, 0.95)',
            color: '#e0d074',
            border: '1px solid rgba(224, 208, 116, 0.3)',
            borderRadius: '8px',
            fontWeight: 'bold'
          }
        });
        fetchUsers();
      }
    } catch (error) {
      toast.error('Failed to update role', {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
        style: {
          background: 'rgba(26, 26, 26, 0.95)',
          color: '#ff6b6b',
          border: '1px solid rgba(255, 107, 107, 0.3)',
          borderRadius: '8px'
        }
      });
    } finally {
      setUpdatingUserId(null);
      setTimeout(() => setHighlightedId(null), 1000);
    }
  };

  if (loading) return <div style={containerStyle}>Loading...</div>;

  return (
    <div style={containerStyle}>
        
      <h2 style={{ color: "#e0d074", marginBottom: "2rem" }}>Manage User Roles</h2>
      
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Department</th>
            <th style={thStyle}>Current Role</th>
            <th style={thStyle}>Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} style={highlightedId === user._id ? highlightStyle : {}}>
              <td style={tdStyle}>{user.name}</td>
              <td style={tdStyle}>{user.email}</td>
              <td style={tdStyle}>{user.department}</td>
              <td style={tdStyle}>{user.role}</td>
              <td style={tdStyle}>
                <select
                  style={{
                    ...selectStyle,
                    opacity: updatingUserId === user._id ? 0.7 : 1,
                    transform: updatingUserId === user._id ? 'scale(0.98)' : 'scale(1)',
                    boxShadow: updatingUserId === user._id ? '0 0 15px rgba(224, 208, 116, 0.2)' : 'none',
                    border: updatingUserId === user._id ? '2px solid #e0d074' : '2px solid rgba(224, 208, 116, 0.3)'
                  }}
                  value={user.role}
                  onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                  disabled={updatingUserId === user._id}
                >
                  <option value="User">User</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
    </div>
  );
}