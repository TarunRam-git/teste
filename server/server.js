const io = require('socket.io')(3001, {
    cors: {
      origin: '*',
    },
  });
  
  const parties = {};
  
  io.on('connection', (socket) => {
    console.log('A user connected');
  
    // Create a party
    socket.on('create-party', ({ code, videoId }) => {
      parties[code] = {
        videoId,
        members: [socket.id],
        currentTime: 0,  // Initial current time
        playing: false,  // Initial playing state
      };
      socket.join(code);
    });
  
    // Join a party
    socket.on('join-party', ({ code }) => {
      if (parties[code]) {
        parties[code].members.push(socket.id);
        socket.join(code);
        
        // Send the video ID and current playback state to the newly joined user
        const { videoId, currentTime, playing } = parties[code];
        io.to(socket.id).emit('sync-video', { videoId, currentTime, playing });
      } else {
        console.log('Party not found');
        io.to(socket.id).emit('party-not-found'); // Send an error to the client
      }
    });
  
    // Sync video state across all users
    socket.on('sync-video', ({ code, videoId, currentTime, playing }) => {
      if (parties[code]) {
        // Update the party's video state
        parties[code].videoId = videoId;
        parties[code].currentTime = currentTime;
        parties[code].playing = playing;
  
        // Broadcast the updated video state to all other members in the party
        socket.broadcast.to(code).emit('sync-video', { videoId, currentTime, playing });
      }
    });
  
    // Disconnect logic
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
  