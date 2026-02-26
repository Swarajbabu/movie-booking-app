require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Booking = require('./models/Booking');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/movie-booking';

async function backfillBookings() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const bookings = await Booking.find({});
        console.log(`Found ${bookings.length} total bookings.`);

        let updatedCount = 0;

        for (const booking of bookings) {
            if (!booking.movieTitle || booking.movieTitle === 'Unknown Movie' || booking.movieTitle === 'Mock Movie / Selected Title') {
                const showtimeStr = booking.showtime?.toString();

                // Common mock showtimes
                if (showtimeStr === '60d5ecb54d6e9b1f2c7a5001' || showtimeStr === '60d5ecb54d6e9b1f2c7a5002') {
                    booking.movieTitle = "Dune: Part Two";
                    booking.theatreName = "Cineplex VR Theatre";
                    await booking.save();
                    updatedCount++;
                } else if (!booking.movieTitle) {
                    // Since we don't have the original runtime TMDB data, let's at least mark it clearly 
                    // instead of leaving it null so the frontend fallback logic works seamlessly.
                    booking.movieTitle = "Past TMDB Movie";
                    booking.theatreName = "Cineplex";
                    await booking.save();
                    updatedCount++;
                }
            }
        }

        console.log(`Successfully backfilled ${updatedCount} bookings!`);
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

backfillBookings();
