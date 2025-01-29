const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle signaling messages
    socket.on('signal', (data) => {

        io.to(data.target).emit('signal', {
            sender: socket.id,
            signal: data.signal,
        });
    });

    // Handle room creation/joining
    socket.on('join', (room) => {
        const clients = io.sockets.adapter.rooms.get(room) || new Set();
        const isFirstUser = clients.size === 1;
        socket.join(room);
        socket.to(room).emit('user-joined', { id: socket.id, isFirstUser });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Signaling server running on port 3000');
});