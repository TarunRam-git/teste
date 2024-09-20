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

      <main>
        {showWatchParty ? (
          <WatchParty partyVideoId={selectedVideo} setVideoId={setSelectedVideo} /> // Pass selected video to WatchParty
        ) : (
          <div className="content">
            <h2>Search Videos</h2>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search YouTube"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>

            <div className="video-grid">
              {videos.map((video) => (
                <div key={video.id.videoId} className="video-item" onClick={() => handleVideoClick(video.id.videoId)}>
                  <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} />
                  <h3>{video.snippet.title}</h3>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
