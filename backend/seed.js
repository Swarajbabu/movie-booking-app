require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Theatre = require('./models/Theatre');
const Movie = require('./models/Movie');
const Showtime = require('./models/Showtime');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/movie-booking';

async function seedDatabase() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB. Clearing collections...');

        await User.deleteMany({});
        await Theatre.deleteMany({});
        await Movie.deleteMany({});
        await Showtime.deleteMany({});

        // 1. Create Admin User
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@booking.com',
            password: hashedPassword,
            role: 'admin'
        });

        // 2. Create Theatres
        const t1 = await Theatre.create({ name: 'AMC Empire 25', location: 'Times Square', city: 'New York', totalScreens: 12 });
        const t2 = await Theatre.create({ name: 'Regal LA Live', location: 'Downtown', city: 'Los Angeles', totalScreens: 8 });

        // 3. Create initial Movies (Mock if TMDB not directly synced right now)
        const m1 = await Movie.create({
            title: 'Dune: Part Two',
            tmdbId: 693134,
            overview: 'Paul Atreides unites with Chani and the Fremen...',
            posterPath: '/1pdfLvkbY9ohJlCjQH2JGjjc95G.jpg',
            releaseDate: new Date('2024-03-01'),
            runtime: 166,
            rating: 8.8,
            status: 'Now Playing'
        });

        const m2 = await Movie.create({
            title: 'Deadpool & Wolverine',
            tmdbId: 533535,
            overview: 'A listless Wade Wilson toils away in civilian life...',
            posterPath: '/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
            releaseDate: new Date('2024-07-26'),
            runtime: 127,
            rating: 8.5,
            status: 'Now Playing'
        });

        // 4. Create Showtimes
        const today = new Date();
        today.setHours(19, 0, 0, 0); // 7 PM tonight

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); // 7 PM tomorrow

        await Showtime.create({
            movie: m1._id,
            theatre: t1._id,
            screen: 'Screen 1 IMAX',
            startTime: today,
            basePrice: 20.00
        });

        await Showtime.create({
            movie: m1._id,
            theatre: t2._id,
            screen: 'Screen 4 standard',
            startTime: tomorrow,
            basePrice: 15.00
        });

        await Showtime.create({
            movie: m2._id,
            theatre: t1._id,
            screen: 'Screen 2 3D',
            startTime: today,
            basePrice: 18.00
        });

        console.log('Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Seed Error:', error);
        process.exit(1);
    }
}

seedDatabase();
