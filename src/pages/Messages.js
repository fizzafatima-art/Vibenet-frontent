import React, { useState } from 'react';
import Suggestions from '../components/Suggestions';
import ChatBox from '../components/ChatBox';

const Messages = ({ socket }) => {
    // selectedChat state hi sara kam karti hai
    const [selectedChat, setSelectedChat] = useState(null);

    return (
        <div style={{ display: 'flex', height: '90vh', background: '#000', margin: '10px', borderRadius: '15px', border: '1px solid #333' }}>
            {/* Left Column */}
            <div style={{ width: '35%', borderRight: '1px solid #333', overflowY: 'auto' }}>
                <Suggestions setSelectedChat={setSelectedChat} />
            </div>

            {/* Right Column */}
            <div style={{ width: '65%' }}>
                {selectedChat ? (
                    // Prop ka naam 'receiver' hai jo aapke ChatBox mein use ho raha hai
                    <ChatBox receiver={selectedChat} socket={socket} />
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#444' }}>
                        <h2 style={{ color: '#8a2be2' }}>VibeNet Inbox 💬</h2>
                        <p>Pick a friend from the list to start a vibe.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;