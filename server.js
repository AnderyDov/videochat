const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const ACTIONS = {
    JOIN: 'join',
    LEAVE: 'leave',
    SHARE_ROOMS: 'share-rooms',
    ADD_PEER: 'add-peer',
    REMOVE_PEER: 'remove-peer',
    RELAY_SDP: 'relay-sdp',
    RELAY_ICE: 'relay-ice',
    ICE_CANDIDATE: 'ice-candidate',
    SESSION_DESCRIPTION: 'session-description',
};
const PORT = process.env.PORT || 3001;

function getClientRooms() {
    const { rooms } = io.sockets.adapter;
    // console.log(rooms);

    return Array.from(rooms.keys());
}

function shareRoomsInfo() {
    console.log(getClientRooms());
    io.emit(ACTIONS.SHARE_ROOMS, () => {
        rooms: getClientRooms();
    });
}

io.on('connection', (socket) => {
    // console.log(socket);
    shareRoomsInfo();

    io.on(ACTIONS.JOIN, (config) => {
        // console.log(config, '!!!!!!!!!');
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

            socket.join(roomID);
            shareRoomsInfo();
        });
    });

    function leavRoom() {
        const { rooms } = socket;

        Array.from(rooms).forEach((roomID) => {
            const clients = Array.from(io.sockets.adapter.rooms.roomID || []);

            clients.forEach((clientID) => {
                io.to(clientID).emit(ACTIONS.ADD_PEER, {
                    peerID: socket.id,
                });

                socket.emit(ACTIONS.ADD_PEER, {
                    perrId: clientID,
                });
            });

            socket.leave(roomID);
        });

        shareRoomsInfo();
    }

    socket.on(ACTIONS.LEAVE, leavRoom);
    socket.on('disconecting', leavRoom);
});

server.listen(PORT, () => {
    console.log('http://localhost:3001');
});
