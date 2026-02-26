const express = require('express');
const Showtime = require('../models/Showtime');
const Theatre = require('../models/Theatre');
const router = express.Router();

const FAKE_THEATRE = {
    _id: "60d5ecb54d6e9b1f2c7a5abc",
    name: "Cineplex Mock Cinema",
    location: "Downtown Reality",
    facilities: ["IMAX", "Dolby Atmos"]
};

// Get showtimes for a specific movie
router.get('/movie/:movieId', async (req, res) => {
    try {
        const mongoose = require('mongoose');
        let showtimes = [];

        // Only query DB if the ID is a valid MongoDB ObjectId
        if (mongoose.Types.ObjectId.isValid(req.params.movieId)) {
            showtimes = await Showtime.find({ movie: req.params.movieId })
                .populate('theatre')
                .sort({ startTime: 1 });
        }

        // INJECT MOCK DATA
        if (showtimes.length === 0) {
            const now = new Date();
            showtimes = [
                {
                    _id: "60d5ecb54d6e9b1f2c7a5001",
                    movie: req.params.movieId,
                    theatre: FAKE_THEATRE,
                    startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
                    screen: "Screen 1 - IMAX",
                    price: 18
                },
                {
                    _id: "60d5ecb54d6e9b1f2c7a5002",
                    movie: req.params.movieId,
                    theatre: FAKE_THEATRE,
                    startTime: new Date(now.getTime() + 5 * 60 * 60 * 1000), // 5 hours from now
                    screen: "Screen 2 - Standard",
                    price: 12
                }
            ];
        }

        res.json(showtimes);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get a specific showtime detail (for booking layout)
router.get('/:id', async (req, res) => {
    try {
        // INJECT MOCK DATA (for fake showtimes)
        if (req.params.id === '60d5ecb54d6e9b1f2c7a5001' || req.params.id === '60d5ecb54d6e9b1f2c7a5002') {
            const isImax = req.params.id === '60d5ecb54d6e9b1f2c7a5001';
            return res.json({
                _id: req.params.id,
                movie: { title: "Mock Movie / Selected Title" },
                theatre: FAKE_THEATRE,
                startTime: new Date(new Date().getTime() + (isImax ? 2 : 5) * 60 * 60 * 1000),
                screen: isImax ? "Screen 1 - IMAX" : "Screen 2 - Standard",
                price: isImax ? 18 : 12
            });
        }

        const showtime = await Showtime.findById(req.params.id)
            .populate('movie')
            .populate('theatre');

        if (!showtime) return res.status(404).json({ message: 'Showtime not found' });
        res.json(showtime);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
