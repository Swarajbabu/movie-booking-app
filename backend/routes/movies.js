const express = require('express');
const axios = require('axios');
const Movie = require('../models/Movie');
const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

// Mock movies fallback
const MOCK_MOVIES = [
    { tmdbId: 101, title: 'Dune: Part Two', runtime: 166, rating: 8.8, posterPath: '/1pdfLvkbY9ohJlCjQH2JGjjc95G.jpg', overview: 'Paul Atreides unites with Chani and the Fremen...' },
    { tmdbId: 102, title: 'Deadpool & Wolverine', runtime: 127, rating: 8.5, posterPath: '/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg', overview: 'Deadpool\'s peaceful existence comes crashing down...' }
];

// Fetch Now Playing Movies
router.get('/now-playing', async (req, res) => {
    const key = process.env.TMDB_API_KEY;
    try {
        if (key && key !== 'your_tmdb_key_here') {
            const response = await axios.get(`${TMDB_BASE_URL}/movie/now_playing`, {
                params: { api_key: key.trim() },
                timeout: 5000
            });
            res.json(response.data.results);
        } else {
            // Fallback
            res.json(MOCK_MOVIES);
        }
    } catch (err) {
        console.error("TMDB Fetch Now Playing Error:", err.response?.data || err.message);
        console.log("Falling back to MOCK_MOVIES due to error...");
        res.json(MOCK_MOVIES);
    }
});

// Fetch Movie DB standard details
router.get('/:id', async (req, res) => {
    const key = process.env.TMDB_API_KEY;
    try {
        const { id } = req.params;
        if (key && key !== 'your_tmdb_key_here') {
            const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
                params: { api_key: key.trim() },
                timeout: 5000
            });
            res.json(response.data);
        } else {
            res.json(MOCK_MOVIES.find(m => m.tmdbId == id) || { title: 'Unknown Movie' });
        }
    } catch (err) {
        console.error(`TMDB Fetch Details Error for ID ${req.params.id}:`, err.response?.data || err.message);
        console.log(`Falling back to MOCK_MOVIES for ID ${req.params.id}...`);
        res.json(MOCK_MOVIES.find(m => m.tmdbId == req.params.id) || { title: 'Unknown Movie' });
    }
});

module.exports = router;
