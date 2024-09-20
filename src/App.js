import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import WatchParty from './WatchParty'; // Import WatchParty component

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showWatchParty, setShowWatchParty] = useState(false);

  const API_KEY = 'AIzaSyCZ4j9k13vXMwPbdmCLOvgqTAeJBhEeUHs'; // Replace with your YouTube API key

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          maxResults: 6,
          q: searchQuery,
          key: API_KEY,
        },
      });
      setVideos(response.data.items);
      setSelectedVideo(null); // Reset selected video when a new search is done
    } catch (error) {
      console.error('Error fetching YouTube data:', error);
    }
  };

  const handleVideoClick = (videoId) => {
    setSelectedVideo(videoId); // Store the selected video ID
  };

  return (
    <div className="App">
      <header>
        <nav>
          <h1>Streaming Sync</h1>
          <ul>
            <li onClick={() => setShowWatchParty(false)}>Home</li> 
            <li onClick={() => setShowWatchParty(true)}>Watch Together</li>
          </ul>
        </nav>
      </header>

      {showWatchParty ? (
        <WatchParty partyVideoId={selectedVideo} setVideoId={setSelectedVideo} />
      ) : (
        <main>
          <h2>Welcome to Streaming Sync</h2>
          <p>Connect all your streaming services in one place and sync movie playback with friends.</p>
          <h3>Search for YouTube Videos</h3>

          <form onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search YouTube" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
            <button type="submit">Search</button>
          </form>

          {selectedVideo && (
            <div className="video-player">
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${selectedVideo}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}

          <div className="video-list">
            {videos.map((video, index) => (
              <div 
                className="video-item" 
                key={index}
                onClick={() => handleVideoClick(video.id.videoId)}
                style={{ cursor: 'pointer' }}
              >
                <img 
                  src={video.snippet.thumbnails.medium.url} 
                  alt={video.snippet.title} 
                />
                <h3>{video.snippet.title}</h3>
              </div>
            ))}
          </div>
        </main>
      )}

      <footer>
        <p>© 2024 Streaming Sync. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
