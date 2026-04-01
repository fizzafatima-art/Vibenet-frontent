import React, { useState } from 'react';
import axios from 'axios';
import '../styles/PostVibe.css';

const PostVibe = ({ onPostCreated }) => {
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'));
    const API_URL = "https://vibe-net-backend-fizzafatima-arts-projects.vercel.app";

    const handleUpload = async () => {
        if (!text.trim() && !image) return alert("Please add some text or an image!");
        if (!user) return alert("Please login first!");

        setLoading(true);
        const formData = new FormData();
        formData.append('userId', user._id);
        formData.append('caption', text);
        if (image) formData.append('image', image);

        try {
            const res = await axios.post(`${API_URL}/posts`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Vibe Posted! ✨");
            setText('');
            setImage(null);
            if (onPostCreated) onPostCreated(res.data); // Refresh without reload
        } catch (err) {
            console.error(err);
            alert("Post failed. Check backend.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="share-vibe-container" style={{ background: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #222' }}>
            <h3 style={{ color: '#fff' }}>Share Your Vibe</h3>
            <textarea 
                style={{ width: '100%', background: '#000', color: '#fff', padding: '10px', borderRadius: '10px' }}
                placeholder="What's the vibe?"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <label style={{ cursor: 'pointer', color: '#8a2be2' }}>
                    <input type="file" hidden onChange={(e) => setImage(e.target.files[0])} />
                    🖼️ {image ? "Image Selected" : "Add Image"}
                </label>
                <button 
                    onClick={handleUpload} 
                    disabled={loading}
                    style={{ background: '#8a2be2', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '20px' }}
                >
                    {loading ? "Posting..." : "Post Vibe"}
                </button>
            </div>
        </div>
    );
};

export default PostVibe;