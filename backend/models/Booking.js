const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
    movieTitle: { type: String },
    theatreName: { type: String },
    seats: [{
        row: { type: Number, required: true },
        col: { type: Number, required: true },
        seatId: { type: String, required: true }, // e.g., 'A1', 'B5'
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
    paymentId: { type: String }, // Mock payment ID
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
