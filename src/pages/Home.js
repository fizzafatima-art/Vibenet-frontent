import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Suggestions from '../components/Suggestions';
import PostVibe from '../components/PostVibe';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const API = "https://vibe-net-backend-fizzafatima-arts-projects.vercel.app";

    const fetchPosts = useCallback(async () => {
        try {
            const res = await axios.get(`${API}/posts`);
            // Backend data debug karne ke liye: console.log(res.data)
            setPosts(res.data || []);
        } catch (err) {
            console.error("Fetch Error:", err.message);
        }
    }, [API]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const addNewPost = (newPost) => {
        // Nayi post ke liye foran fetchPosts call karein taake populated data aaye
        fetchPosts();
    };

    const handleDelete = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this vibe?")) return;
        
        try {
            await axios.delete(`${API}/posts/${postId}`, {
                data: { userId: user?._id } 
            });
            setPosts(prev => prev.filter(p => p._id !== postId));
        } catch (err) {
            console.error("Delete fail:", err);
            alert("Could not delete post. Check if you are the owner.");
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', minHeight: '100vh', background: '#000', color: '#fff' }}>
            <main style={{ padding: '20px', borderRight: '1px solid #222' }}>
                <PostVibe onPostCreated={addNewPost} />

                <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {posts.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#444' }}>No vibes yet 😔</p>
                    ) : (
                        posts.map((post) => (
                            <div key={post._id} style={{ background: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #222' }}>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        {/* Avatar with dynamic Initial */}
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#8a2be2', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px', fontWeight: 'bold' }}>
                                            {/* Agar userId object hai toh uska username, warna fallback 'V' */}
                                            {typeof post.userId === 'object' ? post.userId?.username?.charAt(0).toUpperCase() : 'V'}
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 'bold', color: '#8a2be2', margin: 0 }}>
                                                @{typeof post.userId === 'object' ? post.userId?.username : "loading..."}
                                            </p>
                                            <small style={{ color: '#555', fontSize: '10px' }}>{new Date(post.createdAt).toLocaleString()}</small>
                                        </div>
                                    </div>

                                    {/* Delete Button logic */}
                                    {user?._id === (post.userId?._id || post.userId) && (
                                        <button 
                                            onClick={() => handleDelete(post._id)}
                                            style={{ background: 'rgba(255, 77, 77, 0.1)', border: 'none', color: '#ff4d4d', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}
                                            title="Delete Vibe"
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </div>

                                <p style={{ fontSize: '16px', color: '#eee', marginBottom: '10px', marginLeft: '52px' }}>
                                    {post.caption}
                                </p>

                                {post.img && (
    <img 
        src={`https://vibe-net-backend-fizzafatima-arts-projects.vercel.app/images/${post.img}`} 
        alt="vibe" 
        style={{ width: '100%', borderRadius: '12px', marginTop: '10px' }} 
        // Debugging ke liye alert
        onError={() => console.log("Image not found at path: ", post.img)}
    />
)}
                            </div>
                        ))
                    )}
                </div>
            </main>
            <aside style={{ padding: '20px' }}>
                <Suggestions currentUserId={user?._id} />
            </aside>
        </div>
    );
};

export default Home;