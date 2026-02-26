import { ConvexHttpClient } from "convex/browser";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.VITE_CONVEX_URL);

async function check() {
    console.log("Checking Convex URL:", process.env.VITE_CONVEX_URL);
    try {
        // Trying to fetch movies using the generated API (simulating what the frontend does)
        const { api } = await import("./convex/_generated/api.js");
        const movies = await client.query(api.movies.get);
        console.log("Fetched Movies Successfully! Count:", movies.length);
        console.log("Sample Movie:", movies[0]?.title);
    } catch (err) {
        console.error("Failed to query Convex API:", err);
    }
}

check();
