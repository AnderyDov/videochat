const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 3001;

io.on('connection', (socket) => {
    console.log('SOCKET CONNECTION');
});

server.listen(PORT, () => {
    console.log('http://localhost:3001');
});
