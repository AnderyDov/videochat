const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const ACTIONS = require('./src/socket/actions.ts');
const PORT = process.env.PORT || 3001;

function getClientRooms() {
    const { rooms } = io.sockets.adapter;

    return Array.from(rooms.keys());
}

function shareRoomsInfo() {
    io.emit(ACTIONS.SHARED_ROOMS, () => {
        rooms: getClientRooms();
    });
}

io.on('connection', (socket) => {
    shareRoomsInfo();

    io.on(ACTIONS.JOIN, (config) => {
        const { room: roomID } = config;
        const { rooms: joinedRooms } = socket;

        if (Array.from(joinedRooms).includes(roomID)) {
            return console.warn(`Already joined to ${roomID}`);
        }

        const clients = Array.from(io.sockets.adapter.rooms.roomID || []);

        clients.forEach((clientID) => {
            io.to(clientID).emit(ACTIONS.ADD_PEER, {
                peerID: socket.id,
                createOffer: false,
            });

            socket.emit(ACTIONS.ADD_PEER, {
                perrId: clientID,
                createOffer: true,
            });
        });
    });
});

server.listen(PORT, () => {
    console.log('http://localhost:3001');
});
