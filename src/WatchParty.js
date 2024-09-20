// src/WatchParty.js

import React, { useState } from 'react';
import './WatchParty.css'; // Import your CSS for styling

const WatchParty = ({ partyVideoId, setVideoId }) => {
  const [partyCode, setPartyCode] = useState('');
  const [isHost, setIsHost] = useState(false);

  const createParty = () => {
    const code = Math.random().toString(36).substring(2, 8); // Generate a random party code
    setPartyCode(code);
    setIsHost(true);
    alert(`Party created! Your party code is: ${code}`);
    // Normally, you would save the party details in a database or state management
  };

  const joinParty = () => {
    alert(`Joined party with code: ${partyCode}`);
    // Set the video ID to the party video ID (which comes from props)
    if (partyVideoId) {
      setVideoId(partyVideoId);
    } else {
      alert("No video available to play.");
    }
  };

  return (
    <div className="watch-party">
      <h2>Watch Party</h2>
      {isHost ? (
        <div>
          <h3>Your Party Code: {partyCode}</h3>
          <p>Share this code with friends!</p>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Enter party code"
            value={partyCode}
            onChange={(e) => setPartyCode(e.target.value)}
          />
          <button onClick={joinParty}>Join Party</button>
        </div>
      )}
      <button onClick={createParty}>Create Party</button>

      {/* Video Player to Play the Video in Sync */}
      {partyVideoId && (
        <div className="video-player">
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${partyVideoId}?autoplay=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default WatchParty;
