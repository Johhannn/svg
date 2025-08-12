import { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, logout as apiLogout, refreshToken } from '../api/auth';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // Check if access token is expired
          const decoded = jwt_decode(parsedUser.access);
          if (decoded.exp * 1000 < Date.now()) {
            // Token expired, try to refresh
            try {
              const newTokens = await refreshToken(parsedUser.refresh);
              const newUser = {
                ...parsedUser,
                access: newTokens.access,
              };
              localStorage.setItem('user', JSON.stringify(newUser));
              setUser(newUser);
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              localStorage.removeItem('user');
            }
          } else {
            setUser(parsedUser);
          }
        } catch (error) {
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    const response = await apiLogin(username, password);
    setUser(response);
    return response;
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};