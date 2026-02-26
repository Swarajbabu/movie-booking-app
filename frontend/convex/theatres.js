import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("theatres").collect();
    },
});

export const getById = query({
    args: { theatreId: v.id("theatres") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.theatreId);
    },
});

export const add = mutation({
    args: {
        name: v.string(),
        location: v.string(),
        city: v.optional(v.string()),
        totalScreens: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("theatres", args);
    }
});
