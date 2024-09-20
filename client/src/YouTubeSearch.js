// src/YouTubeSearch.js

import React, { useState } from 'react';
import axios from 'axios';

const YouTubeSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState([]);

  const API_KEY = 'AIzaSyCZ4j9k13vXMwPbdmCLOvgqTAeJBhEeUHs'; // Replace with your actual API key

  const handleSearch = async (e) => {
    e.preventDefault();

    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        maxResults: 5,
        q: searchQuery,
        key: API_KEY,
      },
    });

    setVideos(response.data.items);
  };

  return (
    <div>
      <h2>Search YouTube Videos</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for videos"
        />
        <button type="submit">Search</button>
      </form>

      <div>
        {videos.map((video) => (
          <div key={video.id.videoId}>
            <h3>{video.snippet.title}</h3>
            <img src={video.snippet.thumbnails.default.url} alt={video.snippet.title} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default YouTubeSearch;
