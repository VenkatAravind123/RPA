import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../config'
import { MdDelete } from "react-icons/md";
const cookies = new Cookies();


export default function Activity() {
  const [activities, setActivities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', 
    description: '',
    image: '',
    venue: '',
    price: '',
    date: ''
  });
  const downloadButtonStyle = {
    background: "linear-gradient(135deg, #4ecdc4 0%, #2ab1a3 100%)",
    color: "#1a1a1a",
    padding: "0.8rem 1.5rem",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    transition: "all 0.3s ease",
    border: "2px solid transparent"
  };
  const handleDownload = () => {
    try {
      // Convert activities to CSV
      const headers = ['Name', 'Description', 'Venue', 'Price', 'Date'];
      const csvData = activities.map(activity => [
        activity.name,
        activity.description,
        activity.venue,
        activity.price,
        new Date(activity.date).toLocaleDateString()
      ]);
      
      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');
      
      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'activities.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download data');
    }
  };

  const containerStyle = {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    padding: "2rem",
    width: "145%",
    borderRadius: "15px",
    color: "#fff",
    
    margin: "0 auto",
  };

  const headerStyle = {
    color: "#e0d074",
    marginBottom: "2rem",
    fontSize: "2rem",
    textAlign: "center"
  };

  const formGroupStyle = {
    marginBottom: "1.5rem"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "0.5rem",
    color: "#e0d074",
    fontSize: "1rem"
  };

  const inputStyle = {
    width: "100%",
    padding: "0.8rem",
    background: "rgba(255, 255, 255, 0.05)",
    border: "2px solid rgba(224, 208, 116, 0.3)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "1rem"
  };

  const buttonStyle = {
    background: "linear-gradient(135deg, #e0d074 0%, #d4b93c 100%)",
    color: "#1a1a1a",
    padding: "0.8rem 1.5rem",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold"
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
    color: "#e0d074"
  };

  const tdStyle = {
    padding: "1rem",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
  };

  const modalStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "rgba(26, 26, 26, 0.95)",
    padding: "2rem",
    borderRadius: "15px",
    width: "90%",
    maxWidth: "600px",
    maxHeight: "90vh",
    overflowY: "auto",
    zIndex: 1000
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.7)",
    zIndex: 999
  };

  

  const fetchActivities = async () => {
    try {
      const token = cookies.get('token');
      const response = await axios.get(`${config.url}/user/getallactivities`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.data) {
        setActivities(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Error fetching activities');
      setActivities([]);
    }
  };

useEffect(() => {
  fetchActivities();
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = cookies.get('token');
      await axios.post(`${config.url}/user/addactivity`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Activity added successfully!');
      setShowModal(false);
      fetchActivities();
      setFormData({
        name: '',
        description: '',
        image: '',
        venue: '',
        price: '',
        date: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding activity');
    }
  };

  

  const deleteActivity = async (_id) => {
  if(window.confirm("Are you sure you want to delete the activity?")) {
    try {
      const token = cookies.get('token');
      if (!token) {
        toast.error('Authorization required');
        return;
      }

      // Updated API endpoint path
      const response = await axios.delete(`${config.url}/user/deleteactivity/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        toast.success('Activity deleted successfully');
        // Update local state to remove deleted activity
        setActivities(prevActivities => 
          prevActivities.filter(activity => activity._id !== _id)
        );
      } else {
        throw new Error('Failed to delete activity');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Error deleting activity');
    }
  }
};
  
  return (
    
    <div style={containerStyle}>
      <button 
      style={downloadButtonStyle}
      onClick={handleDownload}
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
      Download Activities
    </button>
      <ToastContainer position="top-right" />
      <button style={buttonStyle} onClick={() => setShowModal(true)}>
        Add New Activity
      </button>
  
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Venue</th>
            <th style={thStyle}>Price</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Image</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {activities && activities.length > 0 ? (
            activities.map((activity) => (
              <tr key={activity._id}>
                <td style={tdStyle}>{activity.name}</td>
                <td style={tdStyle}>{activity.description}</td>
                <td style={tdStyle}>{activity.venue}</td>
                <td style={tdStyle}>{activity.price}</td>
                <td style={tdStyle}>{activity.date ? new Date(activity.date).toLocaleDateString() : 'N/A'}</td>
                <td style={tdStyle}>
                  <img src={activity.image} alt={activity.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }}/>
                </td>
                <td style={tdStyle}><MdDelete style={{width:"50px",height:"20px",cursor:"pointer"}} onClick={()=>deleteActivity(activity._id)}/></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{...tdStyle, textAlign: 'center'}}>
                No activities found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <>
          <div style={overlayStyle} onClick={() => setShowModal(false)} />
          <div style={modalStyle}>
            <h2 style={headerStyle}>Add New Activity</h2>
            <form onSubmit={handleSubmit}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  style={{...inputStyle, minHeight: "100px", resize: "vertical"}}
                  required
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Image URL:</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Venue:</label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Price:</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Date:</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={{ textAlign: "center" }}>
                <button type="submit" style={buttonStyle}>
                  Add Activity
                </button>
              </div>
            </form>
          </div>
        </>
      )}
      <ToastContainer position="top-right" />
    </div>
  );
}