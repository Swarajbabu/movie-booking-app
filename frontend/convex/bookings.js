import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const bookings = await ctx.db
            .query("bookings")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();

        return Promise.all(
            bookings.map(async (b) => {
                let showtime = null;
                if (b.showtimeId) {
                    showtime = await ctx.db.get(b.showtimeId);
                    if (showtime) {
                        const movie = await ctx.db.get(showtime.movieId);
                        const theatre = await ctx.db.get(showtime.theatreId);
                        showtime = { ...showtime, movie, theatre };
                    }
                }
                return { ...b, showtime };
            })
        );
    },
});

export const createBooking = mutation({
    args: {
        userId: v.id("users"),
        showtimeId: v.string(), // Allowing string to support mock showtimes from TMDB APIs
        movieTitle: v.optional(v.string()),
        theatreName: v.optional(v.string()),
        seats: v.array(v.object({
            row: v.number(),
            col: v.number(),
            seatId: v.string(),
            price: v.number(),
        })),
        totalAmount: v.number(),
        paymentId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // A quick check to ensure seats aren't already booked could go here
        const bookingId = await ctx.db.insert("bookings", {
            ...args,
            status: "Confirmed",
        });
        return bookingId;
    }
});
