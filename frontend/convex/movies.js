import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("movies").collect();
    },
});

export const getById = action({
    args: { movieId: v.string() }, // Allow string so it accepts Convex IDs or raw TMDB string IDs
    handler: async (ctx, args) => {
        // Check if it's a valid Convex ID length (usually 32 chars)
        if (args.movieId.length > 20) {
            return await ctx.runQuery(api.movies.internalGetById, { movieId: args.movieId });
        }

        // Otherwise treat as TMDB ID
        const TMDB_API_KEY = process.env.TMDB_API_KEY;
        if (!TMDB_API_KEY) {
            console.error("Missing TMDB_API_KEY in Convex Env variables");
            return null;
        }

        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${args.movieId}?api_key=${TMDB_API_KEY}`);
            if (!response.ok) return null;
            const data = await response.json();
            return {
                ...data,
                _id: data.id,
                rating: data.vote_average
            };
        } catch (error) {
            console.error("Failed to fetch movie details from TMDB", error);
            return null;
        }
    },
});

// Internal query for the action to use
export const internalGetById = query({
    args: { movieId: v.id("movies") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.movieId);
    },
});

export const add = mutation({
    args: {
        title: v.string(),
        tmdbId: v.optional(v.number()),
        overview: v.optional(v.string()),
        posterPath: v.optional(v.string()),
        backdropPath: v.optional(v.string()),
        releaseDate: v.optional(v.string()),
        rating: v.optional(v.number()),
        genres: v.optional(v.array(v.string())),
        runtime: v.optional(v.number()),
        status: v.union(v.literal("Now Playing"), v.literal("Upcoming"), v.optional(v.string())), // Allow string to match dummy data
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("movies", args);
    }
});

// Sync movies from TMDB (can be triggered manually or via cron)
export const fetchNowPlaying = action({
    args: {},
    handler: async (ctx) => {
        const TMDB_API_KEY = process.env.TMDB_API_KEY;
        if (!TMDB_API_KEY) {
            console.error("Missing TMDB_API_KEY in Convex Env variables");
            return { error: "Missing TMDB_API_KEY" };
        }

        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}`);
            if (!response.ok) {
                throw new Error(`TMDB responded with status ${response.status}`);
            }

            const data = await response.json();

            // Optionally: call a mutation here to insert them into `ctx.db` if you want them permanently stored.
            // For now we will return them to the client to render alongside local DB movies.
            return data.results;
        } catch (error) {
            console.error("Failed to fetch from TMDB", error);
            return { error: error.message };
        }
    }
});
