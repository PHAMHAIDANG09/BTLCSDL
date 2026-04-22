import React, { useState, useEffect } from 'react';
import './index.css';
import AuthPage from './components/AuthPage';
import MainLayout from './components/MainLayout';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      {isLoggedIn ? <MainLayout onLogout={handleLogout} /> : <AuthPage onLogin={handleLogin} />}
    </div>
  );
}

export default App;