import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        name: v.string(),
        email: v.string(),
        password: v.optional(v.string()),
        googleId: v.optional(v.string()),
        role: v.union(v.literal("user"), v.literal("admin")),
        avatar: v.optional(v.string()),
    }).index("by_email", ["email"]).index("by_googleId", ["googleId"]),

    movies: defineTable({
        title: v.string(),
        tmdbId: v.optional(v.number()),
        overview: v.optional(v.string()),
        posterPath: v.optional(v.string()),
        backdropPath: v.optional(v.string()),
        releaseDate: v.optional(v.string()),
        rating: v.optional(v.number()),
        genres: v.optional(v.array(v.string())),
        runtime: v.optional(v.number()),
        status: v.union(v.literal("Now Playing"), v.literal("Upcoming")),
    }),

    theatres: defineTable({
        name: v.string(),
        location: v.string(),
        city: v.optional(v.string()),
        totalScreens: v.optional(v.number()),
    }),

    showtimes: defineTable({
        movieId: v.id("movies"),
        theatreId: v.id("theatres"),
        screen: v.string(),
        startTime: v.string(), // ISO String
        basePrice: v.number(),
        layout: v.object({
            rows: v.number(),
            cols: v.number(),
        }),
    }).index("by_movie", ["movieId"]).index("by_theatre", ["theatreId"]),

    bookings: defineTable({
        userId: v.string(),
        showtimeId: v.string(),
        movieTitle: v.optional(v.string()),
        theatreName: v.optional(v.string()),
        seats: v.array(v.object({
            row: v.number(),
            col: v.number(),
            seatId: v.string(),
            price: v.number(),
        })),
        totalAmount: v.number(),
        status: v.union(v.literal("Pending"), v.literal("Confirmed"), v.literal("Cancelled")),
        paymentId: v.optional(v.string()),
    }).index("by_user", ["userId"]).index("by_showtime", ["showtimeId"]),
});
