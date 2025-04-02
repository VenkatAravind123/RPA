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
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn, logout, userRole } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  useEffect(() => {
    const closeMenu = (e) => {
      if (isMenuOpen && !e.target.closest('.nav-links') && !e.target.closest('.hamburger')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, [isMenuOpen]);


  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const handleLogoClick = (e) => {
    if (window.innerWidth <= 768) {
      
      setIsMenuOpen(!isMenuOpen);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.logo-container') && 
          !e.target.closest('.nav-links') && 
          isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);
  
 

  

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const profile = () =>{

    navigate('/profile',{state:{email: data.email}});
  }
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
        // console.log(response.data)
      } catch (error) {
        setError('Error fetching protected data');
        console.error(error);
      }
    };

    fetchProtectedData();
  }, [navigate]);

  return (
    <div className="page-wrapper">
      <nav className={`navbar ${scrolled ? "scrolled" : ''}`}>
        <div className="nav-container">
          <div className='left-section'>
          {isLoggedIn && (userRole === 'Admin'|| userRole === 'Manager') && (
              <Link to="/admin" className='dashboard-icon'>
                <RiAdminLine size={24} />
              </Link>
            )}
          <div className="logo-container">
          <Link 
                to="/" 
                className="nav-item1"
                onClick={handleLogoClick}
              >
                <img src={rpa} alt="RPA Challenge" className="logo" />
              </Link>
          </div>
          </div>
          

          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          {[
              { to: "/", text: "Home" },
              { to: "/about", text: "About" },
              { to: "/contact", text: "Contact" },
              { to: "/activities", text: "Activities" },
              { to: "/team", text: "Team" }
            ].map(({ to, text }) => (
              <Link 
                key={to}
                to={to} 
                className="nav-item" 
                onClick={closeMenu}
              >
                {text}
              </Link>
            ))}
           
            {isLoggedIn && data ? (
              <div className="nav-item user-profile" onClick={() => {
                profile();
                closeMenu();
              }}>
                <FaRegUser />
                <span>{name}</span>
              </div>
            ) : (
              isLoggedIn && <p>Loading...</p>
            )}
            {isLoggedIn ? (
              <button 
                className="nav-button" 
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
              >
                <HiOutlineLogout className="nav-icon" />
                Logout
              </button>
            ) : (
              <Link to="/login" className="nav-button" onClick={closeMenu}>
                Login
              </Link>
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