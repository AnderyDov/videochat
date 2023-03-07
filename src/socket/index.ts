import { io } from 'socket.io-client';

const options = {
    'forse new connection': true,
    reconnectionAttempts: Infinity,
    timeout: 10000,
    transports: ['websocket'],
};

const socket = io('http://localhost:3001', options);

export default socket;
