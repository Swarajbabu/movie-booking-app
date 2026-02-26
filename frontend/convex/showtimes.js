import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

export const getByMovieId = action({
    args: { movieId: v.string() }, // Allow string so TMDB IDs don't crash it
    handler: async (ctx, args) => {
        if (args.movieId.length > 20) {
            return await ctx.runQuery(api.showtimes.internalGetByMovieId, { movieId: args.movieId });
        }

        // If it's a TMDB movie not yet in our DB, return dynamic mock showtimes 
        // to allow the UI to demonstrate the ticket purchase flow.

        // Let's create a predictable theater experience
        const mockTheatre = {
            _id: "mock_theatre_1",
            name: "Cinema Galaxy IMAX",
            location: "Downtown Plaza",
            city: "Metropolis"
        };

        const now = new Date();
        const baseDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // Generate a few random times for the mock movie
        const mockShowtimes = [
            {
                _id: `mock_st_${args.movieId}_1`,
                movieId: args.movieId, // keep original TMDB ID for tracking in frontend
                theatreId: mockTheatre._id,
                screen: "Screen 1 - IMAX",
                startTime: new Date(baseDate.getTime() + 14 * 60 * 60 * 1000).toISOString(), // 2:00 PM
                basePrice: 18,
                layout: { rows: 8, cols: 12 },
                theatre: mockTheatre
            },
            {
                _id: `mock_st_${args.movieId}_2`,
                movieId: args.movieId,
                theatreId: mockTheatre._id,
                screen: "Screen 3 - Premium",
                startTime: new Date(baseDate.getTime() + 19 * 60 * 60 * 1000).toISOString(), // 7:00 PM
                basePrice: 22,
                layout: { rows: 8, cols: 12 },
                theatre: mockTheatre
            }
        ];

        return mockShowtimes;
    },
});

export const internalGetByMovieId = query({
    args: { movieId: v.id("movies") },
    handler: async (ctx, args) => {
        const showtimes = await ctx.db
            .query("showtimes")
            .withIndex("by_movie", (q) => q.eq("movieId", args.movieId))
            .collect();

        return Promise.all(
            showtimes.map(async (st) => {
                const theatre = await ctx.db.get(st.theatreId);
                return { ...st, theatre };
            })
        );
    },
});

export const getById = action({
    args: { showtimeId: v.string() }, // Accept string to support mock_st_ prefixes
    handler: async (ctx, args) => {
        // Handle mock showtimes generated for TMDB movies
        if (args.showtimeId.startsWith('mock_st_')) {
            const parts = args.showtimeId.split('_');
            const tmdbMovieId = parts[2];

            const mockTheatre = {
                _id: "mock_theatre_1",
                name: "Cinema Galaxy IMAX",
                location: "Downtown Plaza",
                city: "Metropolis"
            };

            const now = new Date();
            const baseDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            // This needs to match the getByMovieId logic loosely
            const isSecondShowtime = args.showtimeId.endsWith('_2');
            const startTime = new Date(baseDate.getTime() + (isSecondShowtime ? 19 : 14) * 60 * 60 * 1000).toISOString();

            // Try to fetch the bare minimum movie details dynamically using tmdbMovieId if needed,
            // or just rely on the frontend state. Normally, we'd fetch TMDB here but we can pass a mock movie.
            const movie = { _id: tmdbMovieId, title: "TMDB API Movie", /* other fields could be fetched if strictly necessary */ };

            return {
                _id: args.showtimeId,
                movieId: tmdbMovieId,
                theatreId: mockTheatre._id,
                screen: isSecondShowtime ? "Screen 3 - Premium" : "Screen 1 - IMAX",
                startTime,
                basePrice: isSecondShowtime ? 22 : 18,
                layout: { rows: 8, cols: 12 },
                theatre: mockTheatre,
                movie: movie
            };
        }

        // Handle regular Convex native showtimes
        return await ctx.runQuery(api.showtimes.internalGetById, { showtimeId: args.showtimeId });
    }
});

// Internal query to fetch native DB showtimes
export const internalGetById = query({
    args: { showtimeId: v.id("showtimes") },
    handler: async (ctx, args) => {
        const showtime = await ctx.db.get(args.showtimeId);
        if (!showtime) return null;
        const movie = await ctx.db.get(showtime.movieId);
        const theatre = await ctx.db.get(showtime.theatreId);
        return { ...showtime, movie, theatre };
    }
});

export const add = mutation({
    args: {
        movieId: v.id("movies"),
        theatreId: v.id("theatres"),
        screen: v.string(),
        startTime: v.string(),
        basePrice: v.number(),
        layout: v.object({
            rows: v.number(),
            cols: v.number(),
        }),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("showtimes", args);
    }
});
