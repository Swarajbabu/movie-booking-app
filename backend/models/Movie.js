const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    tmdbId: { type: Number, unique: true, sparse: true },
    overview: { type: String },
    posterPath: { type: String },
    backdropPath: { type: String },
    releaseDate: { type: Date },
    rating: { type: Number, default: 0 },
    genres: [{ type: String }],
    runtime: { type: Number }, // in minutes
    status: { type: String, enum: ['Now Playing', 'Upcoming'], default: 'Now Playing' }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
