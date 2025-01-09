import { BrowserRouter as Router } from 'react-router-dom';
import { useState } from 'react';
import NavBar from './Nav/NavBar';
import './App.css';
import { AuthProvider } from './AuthContext';
import AdminDashboard from './Admin/AdminDashboard';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Routes>
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/*" element={<NavBar />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;