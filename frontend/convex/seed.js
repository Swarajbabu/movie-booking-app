import { mutation } from "./_generated/server";

export const populate = mutation(async (ctx) => {
    // Clear existing if any (optional, skipping to keep it simple and safe)

    // Insert Theatres
    const theatre1 = await ctx.db.insert("theatres", {
        name: "AMC IMAX",
        location: "Downtown",
        city: "New York",
        totalScreens: 12
    });

    const theatre2 = await ctx.db.insert("theatres", {
        name: "Regal Cinemas",
        location: "Uptown Plaza",
        city: "New York",
        totalScreens: 8
    });

    // Insert Movies
    const movie1 = await ctx.db.insert("movies", {
        title: "Dune: Part Two",
        overview: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
        posterPath: "/1pdfLvkbY9ohJlCjQH2JGjjcNsV.jpg",
        backdropPath: "/8rpDcsfLJypbO6vtecsmREWeEX8.jpg",
        releaseDate: "2024-02-27",
        rating: 8.3,
        genres: ["Science Fiction", "Adventure"],
        runtime: 166,
        status: "Now Playing"
    });

    const movie2 = await ctx.db.insert("movies", {
        title: "Oppenheimer",
        overview: "The story of American scientist, J. Robert Oppenheimer, and his role in the development of the atomic bomb.",
        posterPath: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
        backdropPath: "/fm6KqXn30O7IG311wK31Tteg500.jpg",
        releaseDate: "2023-07-19",
        rating: 8.1,
        genres: ["Drama", "History"],
        runtime: 181,
        status: "Now Playing"
    });

    const movie3 = await ctx.db.insert("movies", {
        title: "Deadpool & Wolverine",
        overview: "A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine.",
        posterPath: "/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
        backdropPath: "/yDHYTfA3R0jFYba16ZBRWUP1lNl.jpg",
        releaseDate: "2024-07-24",
        rating: 7.6,
        genres: ["Action", "Comedy", "Science Fiction"],
        runtime: 128,
        status: "Now Playing"
    });

    const movie4 = await ctx.db.insert("movies", {
        title: "Kung Fu Panda 4",
        overview: "Po is gearing up to become the spiritual leader of his Valley of Peace, but also needs someone to take his place as Dragon Warrior. As such, he will train a new kung fu practitioner for the spot.",
        posterPath: "/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
        backdropPath: "/1XDDXPXGiI8id7MrUxK36ke7gkX.jpg",
        releaseDate: "2024-03-02",
        rating: 7.1,
        genres: ["Animation", "Family", "Comedy"],
        runtime: 94,
        status: "Now Playing"
    });

    const movie5 = await ctx.db.insert("movies", {
        title: "Godzilla x Kong: The New Empire",
        overview: "Following their explosive showdown, Godzilla and Kong must reunite against a colossal undiscovered threat hidden within our world.",
        posterPath: "/tMefBSflR6PGQLvLuPE31vrnfe2.jpg",
        backdropPath: "/qrGtVFwmhBOMsHkG1e4xV7G4jEu.jpg",
        releaseDate: "2024-03-27",
        rating: 7.2,
        genres: ["Science Fiction", "Action", "Adventure"],
        runtime: 115,
        status: "Now Playing"
    });

    const movie6 = await ctx.db.insert("movies", {
        title: "Inside Out 2",
        overview: "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions! Joy, Sadness, Anger, Fear and Disgust.",
        posterPath: "/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
        backdropPath: "/stKGOm8UyhuLPR9sZLjs5Ak4RCs.jpg",
        releaseDate: "2024-06-11",
        rating: 7.6,
        genres: ["Animation", "Family", "Comedy"],
        runtime: 96,
        status: "Now Playing"
    });

    // Insert Showtimes
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await ctx.db.insert("showtimes", {
        movieId: movie1,
        theatreId: theatre1,
        screen: "IMAX 1",
        startTime: new Date(tomorrow.setHours(19, 30, 0, 0)).toISOString(),
        basePrice: 18.00,
        layout: { rows: 7, cols: 12 }
    });

    await ctx.db.insert("showtimes", {
        movieId: movie1,
        theatreId: theatre2,
        screen: "Screen 4",
        startTime: new Date(tomorrow.setHours(20, 0, 0, 0)).toISOString(),
        basePrice: 15.00,
        layout: { rows: 7, cols: 12 }
    });

    await ctx.db.insert("showtimes", {
        movieId: movie2,
        theatreId: theatre1,
        screen: "Screen 2",
        startTime: new Date(tomorrow.setHours(15, 0, 0, 0)).toISOString(),
        basePrice: 14.00,
        layout: { rows: 7, cols: 12 }
    });

    return "Database seeded successfully!";
});
