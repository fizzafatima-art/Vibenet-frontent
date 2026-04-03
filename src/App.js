import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';
import { io } from "socket.io-client";

// ✅ Ensure clean API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const socket = io(API_URL);

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (storedUser) setUser(storedUser);
  }, []);

  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id);
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.clear(); 
    setUser(null);
  };

  const AppLayout = ({ children }) => (
    <div className="main-layout" style={{ display: 'flex' }}>
      <Sidebar user={user} onLogout={handleLogout} />
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );

  return (
    <Router>
      <Routes>
        {/* Pass setUser to Login to update state immediately */}
        <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

        <Route path="/" element={user ? <AppLayout><Home /></AppLayout> : <Navigate to="/login" />} />
        <Route path="/messages" element={user ? <AppLayout><Messages socket={socket} /></AppLayout> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <AppLayout><Profile user={user} onLogout={handleLogout} /></AppLayout> : <Navigate to="/login" />} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;