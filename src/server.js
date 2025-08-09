const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = require('./app');

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

// Socket.IO basic
io.on('connection', (socket) => {
    console.log('⚡ New client connected:', socket.id);

    socket.on('create-room', (roomId) => {
        socket.join(roomId);
        console.log(`Room ${roomId} created by ${socket.id}`);
        socket.emit('room-created', roomId);
    });

    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-joined', socket.id);
    });

    socket.on('signal', (data) => {
        io.to(data.to).emit('signal', { from: socket.id, signal: data.signal });
    });

    socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
});
