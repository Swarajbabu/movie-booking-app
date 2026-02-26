import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';

const Showtimes = () => {
    const { id } = useParams(); // Movie ID
    const [selectedDate, setSelectedDate] = useState(0);

    const getByMovieId = useAction(api.showtimes.getByMovieId);
    const [rawShowtimes, setRawShowtimes] = useState(undefined);

    useEffect(() => {
        const fetchShowtimes = async () => {
            try {
                const results = await getByMovieId({ movieId: id });
                setRawShowtimes(results);
            } catch (err) {
                console.error("Failed to load showtimes", err);
                setRawShowtimes([]);
            }
        }
        fetchShowtimes();
    }, [id, getByMovieId]);

    const loading = rawShowtimes === undefined;
    let theatres = [];

    if (rawShowtimes) {
        const grouped = rawShowtimes.reduce((acc, curr) => {
            if (!curr.theatre) return acc;
            const tId = curr.theatre._id;
            if (!acc[tId]) {
                acc[tId] = {
                    _id: tId,
                    name: curr.theatre.name,
                    location: curr.theatre.location,
                    showtimes: []
                };
            }

            const st = new Date(curr.startTime);
            acc[tId].showtimes.push({
                _id: curr._id,
                time: st.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                screen: curr.screen,
                price: curr.basePrice
            });
            return acc;
        }, {});
        theatres = Object.values(grouped);
    }


    // Generate mock dates
    const dates = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
            day: d.toLocaleDateString('en-US', { weekday: 'short' }),
            date: d.getDate(),
            month: d.toLocaleDateString('en-US', { month: 'short' })
        };
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Select Theatre & Showtime</h1>

            {/* Date Selector */}
            <div className="flex gap-4 overflow-x-auto pb-4 mb-8 snap-x">
                {dates.map((d, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedDate(idx)}
                        className={`flex-shrink-0 snap-start flex flex-col items-center justify-center p-4 rounded-xl min-w-[80px] transition-all
              ${selectedDate === idx
                                ? 'bg-red-600 shadow-lg shadow-red-500/40 text-white scale-105'
                                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}
                    >
                        <span className="text-xs font-medium uppercase">{d.month}</span>
                        <span className="text-2xl font-bold my-1">{d.date}</span>
                        <span className="text-xs uppercase">{d.day}</span>
                    </button>
                ))}
            </div>

            <div className="w-full flex justify-end mb-6">
                {theatres.length > 0 && theatres[0].showtimes.length > 0 && (
                    <Link
                        to={`/showtime/${theatres[0].showtimes[0]._id}/seats`}
                        className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full font-bold shadow-lg shadow-red-500/30 flex items-center gap-2 transition-transform hover:scale-105"
                    >
                        <Clock className="w-5 h-5" /> Auto-Select a Showtime & Proceed
                    </Link>
                )}
            </div>

            {/* Theatres List */}
            <div className="flex flex-col gap-6">
                {loading ? (
                    <div className="text-center text-neutral-500 py-10">Loading schedules...</div>
                ) : theatres.length === 0 ? (
                    <div className="text-center text-neutral-500 py-10 border border-neutral-800 border-dashed rounded-xl">No showtimes found for this movie today.</div>
                ) : (
                    theatres.map(theatre => (
                        <div key={theatre._id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                                        {theatre.name}
                                    </h2>
                                    <p className="text-neutral-400 flex items-center gap-2 text-sm">
                                        <MapPin className="w-4 h-4 text-red-500" /> {theatre.location}
                                    </p>
                                </div>

                                <div className="flex-1 w-full">
                                    <div className="flex flex-wrap gap-3">
                                        {theatre.showtimes.map(st => (
                                            <Link
                                                key={st._id}
                                                to={`/showtime/${st._id}/seats`}
                                                className="border border-neutral-700 hover:border-red-500 rounded-lg p-3 text-center flex flex-col hover:bg-red-500/10 transition-colors group/time relative"
                                            >
                                                <span className="text-lg font-bold flex items-center justify-center gap-1">
                                                    <Clock className="w-4 h-4 text-neutral-500 group-hover/time:text-red-400 transition-colors" />
                                                    {st.time}
                                                </span>
                                                <span className="text-xs text-neutral-400 mt-1">{st.screen}</span>

                                                {/* Price Tooltip */}
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-neutral-800 text-xs px-2 py-1 rounded opacity-0 group-hover/time:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-neutral-700">
                                                    ${st.price}.00
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Showtimes;
