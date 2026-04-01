import React, { useRef, useState } from 'react';
import axios from 'axios';

const Profile = ({ onLogout }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(user?.profilePic || '');
  const [uploading, setUploading] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // Profile Picture Upload Logic
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('profilePic', file);
    formData.append('userId', user._id);

    try {
      setUploading(true);
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/users/upload-profile`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      alert("Profile picture updated! ✨");
    } catch (err) {
      console.error("Upload failed", err);
      alert("Server error: Could not save image.");
    } finally {
      setUploading(false);
    }
  };

  // Account Delete Logic
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure? This will permanently delete your account!");
    
    if (confirmDelete) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/users/${user._id}`);
        alert("Account deleted. Good bye!");
        onLogout(); // Account delete hone ke baad auto-logout
      } catch (err) {
        console.error("Delete failed", err);
        alert("Could not delete account. Try again later.");
      }
    }
  };

  if (!user) return <div style={{ color: 'white', padding: '20px' }}>Loading Profile...</div>;

  return (
    <div style={{ padding: '40px', color: 'white', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px', marginBottom: '40px', flexWrap: 'wrap' }}>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          style={{ display: 'none' }} 
          accept="image/*"
        />

        <div 
          style={{ position: 'relative', cursor: 'pointer', width: '160px', height: '160px' }} 
          onClick={handleImageClick}
        >
          <img 
            src={preview || 'https://via.placeholder.com/150'} 
            alt="Profile" 
            style={{ 
                width: '100%', 
                height: '100%', 
                borderRadius: '50%', 
                border: '4px solid #8a2be2',
                objectFit: 'cover',
                opacity: uploading ? 0.5 : 1,
                transition: '0.3s ease'
            }} 
          />
          <div style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            background: '#8a2be2',
            borderRadius: '50%',
            width: '35px',
            height: '35px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)'
          }}>
            {uploading ? '⏳' : '📷'}
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold' }}>{user.username}</h2>
          <p style={{ color: '#aaa', fontSize: '16px' }}>{user.email}</p>
          <p style={{ color: '#8a2be2', fontSize: '14px', marginTop: '5px' }}>
            Member since: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>

      <hr style={{ borderColor: '#222', marginBottom: '30px' }} />

      <div style={{ display: 'flex', gap: '20px' }}>
        <button 
          onClick={onLogout}
          style={{ 
            background: '#1a1a1a', 
            color: 'white', 
            border: '1px solid #333', 
            padding: '12px 30px', 
            borderRadius: '10px', 
            cursor: 'pointer', 
            fontWeight: 'bold'
          }}
        >
          Logout
        </button>

        <button 
          onClick={handleDelete}
          style={{ 
            background: 'transparent', 
            color: '#ff4d4d', 
            border: '1px solid #ff4d4d', 
            padding: '12px 30px', 
            borderRadius: '10px', 
            cursor: 'pointer', 
            fontWeight: 'bold'
          }}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Profile;