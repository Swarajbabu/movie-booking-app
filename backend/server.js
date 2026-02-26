require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes Placeholder
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API is running' });
});

// Real-time Socket Setup - In-memory seat locks
// Structure: { [showtimeId]: { [seatId]: { userId, timestamp } } }
const lockedSeats = {};

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // When a user selects a showtime, they join its room
    socket.on('join_showtime', (showtimeId) => {
        socket.join(showtimeId);
        // Send currently locked seats to the user
        socket.emit('initial_locked_seats', lockedSeats[showtimeId] || {});
    });

    socket.on('lock_seat', ({ showtimeId, seatId, userId }) => {
        if (!lockedSeats[showtimeId]) lockedSeats[showtimeId] = {};

        // Check if seat is already locked by someone else
        if (lockedSeats[showtimeId][seatId] && lockedSeats[showtimeId][seatId].userId !== userId) {
            socket.emit('seat_lock_failed', { seatId, message: 'Seat already locked' });
            return;
        }

        lockedSeats[showtimeId][seatId] = { userId, timestamp: Date.now() };
        io.to(showtimeId).emit('seat_locked', { showtimeId, seatId, userId });
    });

    socket.on('unlock_seat', ({ showtimeId, seatId, userId }) => {
        if (lockedSeats[showtimeId] && lockedSeats[showtimeId][seatId] && lockedSeats[showtimeId][seatId].userId === userId) {
            delete lockedSeats[showtimeId][seatId];
            io.to(showtimeId).emit('seat_unlocked', { showtimeId, seatId });
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        // Optional: We could find all locks belonging to socket.id or user and clear them here, 
        // but relying on a 5-minute timeout cron/interval is more robust for stateless sockets.
    });
});

// Periodic cleanup of locked seats (older than 5 minutes)
setInterval(() => {
    const now = Date.now();
    for (const showtimeId in lockedSeats) {
        for (const seatId in lockedSeats[showtimeId]) {
            if (now - lockedSeats[showtimeId][seatId].timestamp > 5 * 60 * 1000) {
                delete lockedSeats[showtimeId][seatId];
                io.to(showtimeId).emit('seat_unlocked', { showtimeId, seatId });
            }
        }
    }
}, 60000);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
