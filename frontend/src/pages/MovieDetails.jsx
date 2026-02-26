import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Calendar, Star, Armchair } from 'lucide-react';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useEffect, useState } from 'react';

const MovieDetails = () => {
    const { id } = useParams();
    const getById = useAction(api.movies.getById);
    const [movie, setMovie] = useState(undefined);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const data = await getById({ movieId: id });
                setMovie(data);
            } catch (err) {
                console.error("Failed to load movie", err);
                setMovie(null);
            }
        };
        fetchMovie();
    }, [id, getById]);

    if (movie === undefined) return <div className="text-center py-20 text-neutral-400">Loading movie details...</div>;
    if (movie === null) return <div className="text-center py-20 text-neutral-400">Movie not found</div>;

    return (
        <div className="w-full min-h-screen">
            <div className="w-full h-[60vh] relative">
                <div className="absolute inset-0 bg-neutral-950/80 z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent z-10" />
                {(movie.backdrop_path || movie.backdropPath) && (
                    <img
                        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.backdropPath}`}
                        alt="backdrop"
                        className="w-full h-full object-cover opacity-50 absolute inset-0 mix-blend-overlay"
                    />
                )}

                <div className="relative z-20 max-w-7xl mx-auto px-4 h-full flex flex-col justify-end pb-16">
                    <div className="flex flex-col md:flex-row gap-8 items-end">
                        {(movie.poster_path || movie.posterPath) ? (
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path || movie.posterPath}`}
                                alt={movie.title}
                                className="w-48 md:w-64 rounded-xl shadow-2xl border-2 border-neutral-800 hidden md:block"
                            />
                        ) : (
                            <div className="w-48 md:w-64 aspect-[2/3] bg-neutral-800 rounded-xl hidden md:flex items-center justify-center text-neutral-500 border-2 border-neutral-700">No Image</div>
                        )}
                        <div className="flex flex-col gap-4 max-w-3xl">
                            <h1 className="text-4xl md:text-6xl font-bold">{movie.title}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-neutral-300 font-medium">
                                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500 fill-current" /> {movie.vote_average?.toFixed(1) || movie.rating} Rating</span>
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {movie.runtime} Minutes</span>
                                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {movie.releaseDate ? movie.releaseDate.substring(0, 4) : 2024}</span>
                                <div className="flex gap-2">
                                    {movie.genres?.map(g => (
                                        <span key={g.id || g} className="px-3 py-1 bg-neutral-800 rounded-full text-xs border border-neutral-700">{g.name || g}</span>
                                    ))}
                                </div>
                            </div>
                            <p className="text-lg text-neutral-400 mt-2 line-clamp-4">{movie.overview}</p>
                            <div className="mt-6">
                                <Link to={`/movie/${id}/showtimes`} className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-red-600/30">
                                    <Armchair className="w-5 h-5" /> Book Tickets Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
