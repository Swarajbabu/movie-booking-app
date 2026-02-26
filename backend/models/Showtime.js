const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    theatre: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true },
    screen: { type: String, default: 'Screen 1' },
    startTime: { type: Date, required: true },
    basePrice: { type: Number, required: true, default: 15.00 },
    // defining seat layout rules, e.g. rows A-J, 1-20
    layout: {
        rows: { type: Number, default: 10 },
        cols: { type: Number, default: 15 }
    }
}, { timestamps: true });

module.exports = mongoose.model('Showtime', showtimeSchema);
