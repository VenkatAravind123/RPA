import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaHome, FaLock, FaMoneyBill, FaUser } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { BiAnalyse, BiSearch } from "react-icons/bi";
import { BiCog } from "react-icons/bi";
import { AiFillHeart, AiFillHome, AiOutlineUser, AiTwotoneFileExclamation } from "react-icons/ai";
import { BsCartCheck } from "react-icons/bs";
import { AnimatePresence, motion } from "framer-motion";
import { LuActivity } from "react-icons/lu";
import { AiFillProduct } from "react-icons/ai";
import { MdManageAccounts } from "react-icons/md";
import SidebarMenu from "./SideBarMenu";
import './SideBar.css'
import { useAuth } from '../AuthContext';
import Cookies from 'universal-cookie';
import axios from 'axios';
import config from '../config';
const cookies = new Cookies();
const routes = [
  {
    path: "/admin/activity",
    name: "Activity",
    icon:<LuActivity />
  },
  {
    path:"/admin/engagement",
    name:"Engagement",
    icon:<AiFillProduct />
  },
  {
    path:"/admin/users",
    name:"Users",
    icon:<AiOutlineUser /> 
  },
  {
    path:"/admin/manage",
    name:"Manage",
    icon:<MdManageAccounts />
  },
  {
    path:"/",
    name:"Home",
    icon:<AiFillHome />
  }
]
const SideBar = ({ children }) => {
const { isLoggedIn, logout, userRole } = useAuth();
   const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
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
  const inputAnimation = {
    hidden: {
      width: 0,
      padding: 0,
      transition: {
        duration: 0.2,
      },
    },
    show: {
      width: "140px",
      padding: "5px 15px",
      transition: {
        duration: 0.2,
      },
    },
  };

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    show: {
      opacity: 1,
      width: "auto",
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <>
      <div className="main-container">
        <motion.div animate={{width: isOpen ? "300px" : "60px",transition: {duration: 0.5,type: "spring",damping: 10,},}}
        className={`sidebar`}>
          <div className="top_section">
            <AnimatePresence>
              {isOpen && (
                <motion.h1
                  variants={showAnimation}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="logo"
                >
                  Admin Panel
                </motion.h1>
              )}
            </AnimatePresence>
          

            <div className="bars">
              <FaBars onClick={toggle} />
            </div>
          </div>
          
          <section className="routes">
            {routes.map((route, index) => {
              if (route.subRoutes) {
                return (
                  <SidebarMenu setIsOpen={setIsOpen} route={route} showAnimation={showAnimation} isOpen={isOpen}/>
                );
              }

              return (
                <NavLink
                  to={route.path}
                  key={index}
                  className="link"
                  activeclassname="active"
                >
                  <div className="icon">{route.icon}</div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        variants={showAnimation}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="link_text"
                      >
                        {route.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </NavLink>
              );
            })}
          </section>
        </motion.div>

        <main>{children}</main>
      </div>
    </>
  )
}

export default SideBar;
