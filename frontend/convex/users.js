import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUser = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();
    },
});

export const syncUser = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        role: v.optional(v.union(v.literal("user"), v.literal("admin"))),
        avatar: v.optional(v.string()),
        googleId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        if (existingUser) {
            await ctx.db.patch(existingUser._id, {
                name: args.name,
                avatar: args.avatar,
                googleId: args.googleId,
            });
            return existingUser._id;
        } else {
            return await ctx.db.insert("users", {
                name: args.name,
                email: args.email,
                role: args.role || "user",
                avatar: args.avatar,
                googleId: args.googleId,
            });
        }
    }
});
