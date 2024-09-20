const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle party creation
  socket.on('createParty', ({ partyCode }) => {
    socket.join(partyCode);
    console.log(`Party created with code: ${partyCode}`);
  });

  // Handle joining a party
  socket.on('joinParty', ({ partyCode }) => {
    socket.join(partyCode);
    console.log(`User joined party: ${partyCode}`);
  });

  // Sync video updates
  socket.on('videoUpdate', (data) => {
    io.to(data.partyCode).emit('videoUpdate', data); // Send updates to everyone in the party
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(4000, () => {
  console.log('Server listening on port 4000');
});
