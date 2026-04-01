import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Standard JSON request to avoid Multer/Cloudinary errors for now
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            alert("Registration Successful! Please Login.");
            navigate('/login');
        } catch (err) {
            console.error("Signup Error:", err.response?.data);
            // Agat email already exist karti hai toh ye message dikhayega
            alert(err.response?.data?.message || "Registration Failed! Use a new email.");
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleRegister}>
                <h2>VibeNet</h2>
                <input type="text" placeholder="Username" onChange={(e) => setFormData({...formData, username: e.target.value})} required />
                <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                <button type="submit">Sign Up</button>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </form>
        </div>
    );
};

export default Register;