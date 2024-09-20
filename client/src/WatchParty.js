import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import './WatchParty.css';

const socket = io('http://localhost:3001'); // Adjust if your server URL is different

const WatchParty = ({ partyVideoId, setVideoId }) => {
  const [partyCode, setPartyCode] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [videoId, setLocalVideoId] = useState(partyVideoId || null);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef(null);

  // Sync video state with the socket server
  const syncVideoState = () => {
    if (playerRef.current) {
      const time = playerRef.current.getCurrentTime();
      const isPlaying = playerRef.current.getPlayerState() === 1; // 1 is playing state
      socket.emit('sync-video', { code: partyCode, videoId, currentTime: time, playing: isPlaying });
    }
  };

  // Create a watch party
  const createParty = () => {
    const code = Math.random().toString(36).substring(2, 8); // Generate a party code
    socket.emit('create-party', { code, videoId });
    setPartyCode(code);
    setIsHost(true);
    alert(`Party created! Your party code is: ${code}`);
  };

  // Join a watch party
  const joinParty = () => {
    socket.emit('join-party', { code: partyCode });
  };

  // Handle incoming sync-video messages
  useEffect(() => {
    socket.on('sync-video', (data) => {
      setLocalVideoId(data.videoId);
      setCurrentTime(data.currentTime);
      setPlaying(data.playing);
    });

    return () => {
      socket.off('sync-video'); // Clean up the event listener
    };
  }, []);

  // Initialize YouTube Player with sync logic
  useEffect(() => {
    if (videoId) {
      playerRef.current = new window.YT.Player('videoPlayer', {
        videoId,
        events: {
          onReady: (event) => {
            event.target.seekTo(currentTime);
            if (playing) {
              event.target.playVideo();
            }

            // Listen for player state changes
            event.target.addEventListener('onStateChange', (event) => {
              if (event.data === 1 || event.data === 2 || event.data === 3) { // Play, Pause, Seek
                syncVideoState(); // Sync state when playing, paused, or seeking
              }
            });
          },
        },
      });
    }
  }, [videoId, currentTime, playing]);

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

      {/* Video Player */}
      {videoId && (
        <div className="video-player">
          <iframe
            id="videoPlayer"
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
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
