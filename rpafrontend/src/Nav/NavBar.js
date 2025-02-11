import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './Home';
import About from './About';
import Contact from './Contact';
import Activities from './Activities';
import Login from './Login';
import './nav.css'
import { useAuth } from '../AuthContext';
import Register from './Register';
import rpa from '../images/rpanew.png';
import AdminDashboard from '../Admin/AdminDashboard';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { FaRegUser } from "react-icons/fa";
import NotFound from './NotFound';
import { HiOutlineLogout } from "react-icons/hi";
import { RxDashboard } from "react-icons/rx";
import { RiAdminLine } from "react-icons/ri";
import Team from './Team';
import config from '../config'
import Profile from './Profile';
const cookies = new Cookies();

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, logout, userRole } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
    <div className="page-wrapper">
      <nav className="navbar">
        <div className="nav-container">
          <div className='left-section'>
          {isLoggedIn && (userRole === 'Admin'|| userRole === 'Manager') && (
              <Link to="/admin" className='dashboard-icon'>
                <RiAdminLine size={24} />
              </Link>
            )}
          <div className="logo-container">
            <Link to="/" className="nav-item1">
              <img src={rpa} alt="RPA Challenge" className="logo" />
            </Link>
          </div>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-item">Home</Link>
            <Link to="/about" className="nav-item">About</Link>
            <Link to="/contact" className="nav-item">Contact</Link>
            <Link to="/activities" className="nav-item">Activities</Link>
            <Link to="/team" className="nav-item">Team</Link>
           
            {isLoggedIn && data ? (
              <p style={{color:"white",padding:"10px"}}><FaRegUser />{name}</p>
            ) : (
              isLoggedIn && <p>Loading...</p>
            )}
            {isLoggedIn ? (
              <button className="nav-button"  onClick={handleLogout}><HiOutlineLogout style={{width: "18px",
                height: "18px",
                marginRight: "4px",
                verticalAlign: "middle"}}/>Logout</button>
            ) : (
              <Link to="/login" className="nav-button">Login</Link>
            )}
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="route-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/team" element={<Team/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}