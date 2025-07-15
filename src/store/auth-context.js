import React, { useState, useEffect, createContext, useCallback } from 'react';

const AuthContext = createContext({
  token: '',
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState(null);

  const isLoggedIn = !!token;

  const loginHandler = (token) => {
    setToken(token);
    localStorage.setItem('token', token);

    const expiryTime = new Date().getTime() + 5 * 60 * 1000; // 5 minutes from now
    localStorage.setItem('expiryTime', expiryTime);
  };

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('expiryTime');
  }, []);

  const isTokenValid = useCallback(() => {
    const storedToken = localStorage.getItem('token');
    const storedExpiry = localStorage.getItem('expiryTime');
    if (!storedToken || !storedExpiry) return false;
    return new Date().getTime() < +storedExpiry;
  }, []);

  useEffect(() => {
    if (isTokenValid()) {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
    } else {
      logoutHandler();
    }
  }, [isTokenValid, logoutHandler]);

  // Auto logout timer
  useEffect(() => {
    if (token) {
      const remainingTime = +localStorage.getItem('expiryTime') - new Date().getTime();

      const timer = setTimeout(() => {
        logoutHandler();
      }, remainingTime);

      return () => clearTimeout(timer);
    }
  }, [token, logoutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: isLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
