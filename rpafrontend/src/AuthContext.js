import { createContext, useContext, useState, useEffect } from "react";
import Cookies from 'universal-cookie';
import axios from 'axios';
import config from './config';

const cookies = new Cookies();
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!cookies.get('token'));
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const fetchUserRole = async () => {
            const token = cookies.get('token');
            if (token) {
                try {
                    const response = await axios.get(`${config.url}/protected`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setUserRole(response.data.role);
                } catch (error) {
                    console.error('Error fetching user role:', error);
                }
            }
        };

        fetchUserRole();
    }, []);

    const login = (token) => {
        cookies.set('token', token, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            secure: true,
            sameSite: 'strict',
            path: '/'
        });
        setIsLoggedIn(true);
        // Fetch user role after login
        fetchUserRole();
    }

    const logout = () => {
        cookies.remove('token', { path: '/' });
        setUserRole('');
        setIsLoggedIn(false);
      };

      const fetchUserRole = async () => {
        const token = cookies.get('token');
        if (token) {
          try {
            const response = await axios.get(`${config.url}/protected`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            setUserRole(response.data.role);
          } catch (error) {
            console.error('Error fetching user role:', error);
            if (error.response && error.response.status === 404) {
              console.error('User not found');
            }
          }
        }
      };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
}

export default AuthContext;