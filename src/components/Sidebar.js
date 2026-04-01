// src/components/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ user, onLogout }) => {
  const location = useLocation();

  return (
    <div style={{ 
      padding: '30px 20px', 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', // Puri screen cover karega
      background: '#000'
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'white', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>VibeNet</h1>
      </Link>

      <div style={{ background: '#111', padding: '15px', borderRadius: '15px', marginBottom: '30px' }}>
        <img 
          src={user?.profilePic || 'https://via.placeholder.com/50'} 
          alt="me" 
          style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid purple' }} 
        />
        <h4 style={{ color: 'white', marginTop: '10px' }}>{user?.username}</h4>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Link to="/" style={linkStyle(location.pathname === '/')}>🏠 Home</Link>
        <Link to="/messages" style={linkStyle(location.pathname === '/messages')}>💬 Messages</Link>
        <Link to="/profile" style={linkStyle(location.pathname === '/profile')}>👤 Profile</Link>
      </nav>

      {/* Logout button - margin bottom de kar thoda uper rakha hai */}
      <button 
        onClick={onLogout}
        style={{
          background: '#ff4d4d',
          color: 'white',
          border: 'none',
          padding: '12px',
          borderRadius: '10px',
          cursor: 'pointer',
          fontWeight: 'bold',
          marginBottom: '40px' // Screenshot ke mutabiq bottom se gap diya
        }}
      >
        Logout
      </button>
    </div>
  );
};

const linkStyle = (active) => ({
  textDecoration: 'none',
  color: active ? 'white' : '#888',
  padding: '10px',
  borderRadius: '8px',
  background: active ? '#8a2be2' : 'transparent',
  display: 'block'
});

export default Sidebar;