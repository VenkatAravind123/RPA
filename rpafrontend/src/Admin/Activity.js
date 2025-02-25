import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../config'
import './activity.css'
import { MdDelete } from "react-icons/md";
import { IoDownloadOutline } from 'react-icons/io5';
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
  <div className="activity-container">
    <div className="header-actions">
      <h1 className="activity-header" style={{textAlign:"left"}}>Activities</h1>
      <button className="download-button" onClick={handleDownload}>
        <IoDownloadOutline />
      </button>
      <button className="add-button" onClick={() => setShowModal(true)}>
        Add New Activity
      </button>
    </div>

    <ToastContainer position="top-right" />

    <div className="table-wrapper">
      <table className="activity-table">
        <thead>
          <tr>
            <th className="table-header">Name</th>
            <th className="table-header">Description</th>
            <th className="table-header">Venue</th>
            <th className="table-header">Price</th>
            <th className="table-header">Date</th>
            <th className="table-header">Image</th>
            <th className="table-header">Action</th>
          </tr>
        </thead>
        <tbody>
          {activities && activities.length > 0 ? (
            activities.map((activity) => (
              <tr key={activity._id} className="table-row">
                <td className="table-cell">{activity.name}</td>
                <td className="table-cell">{activity.description}</td>
                <td className="table-cell">{activity.venue}</td>
                <td className="table-cell">{activity.price}</td>
                <td className="table-cell">
                  {activity.date ? new Date(activity.date).toLocaleDateString() : 'N/A'}
                </td>
                <td className="table-cell">
                  <img src={activity.image} alt={activity.name} className="activity-image"/>
                </td>
                <td className="table-cell">
                  <MdDelete className="delete-icon" onClick={() => deleteActivity(activity._id)}/>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="table-cell empty-message">
                No activities found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {showModal && (
      <>
        <div className="modal-overlay" onClick={() => setShowModal(false)} />
        <div className="modal">
          <h2 className="modal-header">Add New Activity</h2>
          <form onSubmit={handleSubmit} className="activity-form">
            <div className="form-group">
              <label className="form-label">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-input form-textarea"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Image URL:</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Venue:</label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Price:</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date:</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button">
                Add Activity
              </button>
            </div>
          </form>
        </div>
      </>
    )}
  </div>
);
}