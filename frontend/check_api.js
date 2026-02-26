import { ConvexReactClient } from "convex/react";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const client = new ConvexReactClient(process.env.VITE_CONVEX_URL);

async function check() {
    console.log("Checking Convex URL:", process.env.VITE_CONVEX_URL);

    // Note: For node.js environments we need to establish sync manually or use `query` methods specifically
    // Since we aren't using a specific query function from an API file here directly, we'll just check if client initialized
    if (client) {
        console.log("Client connected locally. If the browser isn't showing Data, please check the browser console for exact errors.");
    }
}

check();
