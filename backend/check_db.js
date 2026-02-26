require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const fs = require('fs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/movie-booking';

async function check() {
    await mongoose.connect(MONGO_URI);
    const movies = await mongoose.connection.db.collection('movies').find({}).toArray();
    const showtimes = await mongoose.connection.db.collection('showtimes').find({}).toArray();
    const bookings = await mongoose.connection.db.collection('bookings').find({}).toArray();

    const result = {
        movies: movies.map(m => ({ id: m._id, title: m.title })),
        showtimes: showtimes.map(s => ({ id: s._id, movieId: s.movie, theatreId: s.theatre })),
        bookings: bookings.map(b => ({
            id: b._id,
            showtime: b.showtime,
            title: b.movieTitle,
            theatre: b.theatreName
        }))
    };
    fs.writeFileSync('db_dump.json', JSON.stringify(result, null, 2));
    process.exit(0);
}
check();
