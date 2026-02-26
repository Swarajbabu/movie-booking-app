import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Armchair, Info } from 'lucide-react';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';

// Connect to backend (adjust URL in production)
const socket = io('http://localhost:5000');

const mockRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const colsPerRow = 12;

const SeatSelection = () => {
    const { id } = useParams(); // showtime id
    const navigate = useNavigate();

    const getById = useAction(api.showtimes.getById);
    const [showtime, setShowtime] = useState(null);

    useEffect(() => {
        const loadST = async () => {
            try {
                const res = await getById({ showtimeId: id });
                setShowtime(res);
            } catch (err) {
                console.error("Failed loading showtime", err);
            }
        };
        loadST();
    }, [id, getById]);

    const [lockedSeats, setLockedSeats] = useState({});
    const [selectedSeats, setSelectedSeats] = useState([]);

    // Generating mock user id for current session
    const [userId] = useState(() => 'user_' + Math.random().toString(36).substr(2, 9));

    useEffect(() => {
        socket.emit('join_showtime', id);

        socket.on('initial_locked_seats', (locks) => {
            setLockedSeats(locks);
        });

        socket.on('seat_locked', ({ seatId, userId: lockUserId }) => {
            setLockedSeats(prev => ({ ...prev, [seatId]: { userId: lockUserId } }));
        });

        socket.on('seat_unlocked', ({ seatId }) => {
            setLockedSeats(prev => {
                const next = { ...prev };
                delete next[seatId];
                return next;
            });
            // If we had it selected but it unlocked, we can leave it or remove it.
            // Usually, if we had it selected, it was OUR lock and it unlocked due to timeout
            setSelectedSeats(prev => prev.filter(s => s !== seatId));
        });

        socket.on('seat_lock_failed', ({ seatId, message }) => {
            alert(message);
            setSelectedSeats(prev => prev.filter(s => s !== seatId));
        });

        return () => {
            socket.off('initial_locked_seats');
            socket.off('seat_locked');
            socket.off('seat_unlocked');
            socket.off('seat_lock_failed');
        };
    }, [id]);

    const toggleSeat = (seatId) => {
        const isLocked = lockedSeats[seatId];
        const isSelected = selectedSeats.includes(seatId);

        // If locked by someone else, return
        if (isLocked && isLocked.userId !== userId) return;

        if (isSelected) {
            // Deselect and unlock
            setSelectedSeats(prev => prev.filter(s => s !== seatId));
            socket.emit('unlock_seat', { showtimeId: id, seatId, userId });
        } else {
            if (selectedSeats.length >= 8) {
                alert("You can only select up to 8 seats");
                return;
            }
            // Select and lock
            setSelectedSeats(prev => [...prev, seatId]);
            socket.emit('lock_seat', { showtimeId: id, seatId, userId });
        }
    };

    const calculateTotal = () => selectedSeats.length * 15; // mock $15 per seat

    return (
        <div className="w-full min-h-screen bg-neutral-950 flex flex-col items-center py-8">
            <div className="w-full max-w-5xl px-4 flex flex-col md:flex-row gap-8">

                {/* Seat Layout Area */}
                <div className="flex-1 bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl overflow-x-auto">
                    {/* Screen Curve */}
                    <div className="w-full flex flex-col items-center mb-12">
                        <div className="w-[80%] h-12 bg-gradient-to-t from-red-500/20 to-transparent rounded-t-[50%] border-t-2 border-red-500 shadow-[0_-10px_30px_rgba(239,68,68,0.2)]"></div>
                        <span className="text-neutral-500 text-sm mt-4 font-bold tracking-[0.3em] uppercase">All eyes this way</span>
                    </div>

                    <div className="flex flex-col gap-3 items-center min-w-max">
                        {mockRows.map(row => (
                            <div key={row} className="flex gap-2 items-center">
                                <div className="w-6 font-bold text-neutral-500 text-right mr-4">{row}</div>
                                {Array.from({ length: colsPerRow }).map((_, i) => {
                                    const seatId = `${row}${i + 1}`;
                                    const isLocked = lockedSeats[seatId];
                                    const isLockedByOther = isLocked && isLocked.userId !== userId;
                                    const isSelected = selectedSeats.includes(seatId);

                                    // Colors: 
                                    // Selected: bg-red-500 text-white
                                    // LockedByOther: bg-neutral-800 text-neutral-600
                                    // Available: bg-neutral-800 hover:bg-red-500/50 text-neutral-300 pointer/hover

                                    let seatClasses = "w-8 h-8 rounded-t-lg rounded-b-sm border-b-4 flex items-center justify-center text-[10px] font-bold transition-all ";

                                    if (isSelected) {
                                        seatClasses += "bg-red-500 border-red-700 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] scale-110";
                                    } else if (isLockedByOther) {
                                        seatClasses += "bg-neutral-800 border-neutral-900 text-neutral-700 cursor-not-allowed opacity-50";
                                    } else {
                                        seatClasses += "bg-neutral-700 border-neutral-800 text-neutral-300 hover:bg-neutral-600 hover:border-neutral-700 cursor-pointer";
                                    }

                                    return (
                                        <button
                                            key={seatId}
                                            className={seatClasses}
                                            onClick={() => toggleSeat(seatId)}
                                            disabled={isLockedByOther}
                                            title={isLockedByOther ? "Seat is taken" : `Seat ${seatId}`}
                                        >
                                            {i + 1}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center gap-8 mt-12 bg-neutral-950 p-4 rounded-xl">
                        <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-neutral-700 border-b-4 border-neutral-800" /> <span className="text-sm">Available</span></div>
                        <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-red-500 border-b-4 border-red-700 shadow-[0_0_10px_rgba(239,68,68,0.5)]" /> <span className="text-sm">Selected</span></div>
                        <div className="flex items-center gap-2 opacity-50"><div className="w-6 h-6 rounded bg-neutral-800 border-b-4 border-neutral-900" /> <span className="text-sm">Occupied</span></div>
                    </div>
                </div>

                {/* Sidebar Summary Area */}
                <div className="w-full md:w-80 flex flex-col gap-6">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl sticky top-24">
                        <h2 className="text-xl font-bold mb-4">Booking Summary</h2>

                        <div className="flex justify-between items-center mb-4 border-b border-neutral-800 pb-4">
                            <span className="text-neutral-400">Tickets</span>
                            <span className="font-bold text-xl">{selectedSeats.length}</span>
                        </div>

                        {selectedSeats.length > 0 ? (
                            <div className="mb-6 flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                                {selectedSeats.map(s => (
                                    <span key={s} className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-sm font-bold border border-red-500/30">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <div className="text-neutral-500 text-sm mb-6 flex items-start gap-2 bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                                <Info className="w-5 h-5 flex-shrink-0" />
                                Select seats on the interactive layout to proceed with your booking.
                            </div>
                        )}

                        <div className="flex justify-between items-end mb-6">
                            <span className="text-neutral-400">Total Price</span>
                            <span className="text-3xl font-bold text-red-500">${calculateTotal().toFixed(2)}</span>
                        </div>

                        <button
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${selectedSeats.length > 0
                                ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 hover:scale-[1.02]'
                                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                                }`}
                            disabled={selectedSeats.length === 0}
                            onClick={() => navigate('/checkout', { state: { seats: selectedSeats, total: calculateTotal(), showtime } })}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SeatSelection;
