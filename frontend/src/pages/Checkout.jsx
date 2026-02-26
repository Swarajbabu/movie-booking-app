import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, CreditCard, ChevronLeft } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [ticketData, setTicketData] = useState(null);
    const createBooking = useMutation(api.bookings.createBooking);

    const seats = state?.seats || [];
    const total = state?.total || 0;
    const showtime = state?.showtime || null;

    if (seats.length === 0 && !success) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">No seats selected</h2>
                <Link to="/" className="text-red-500 hover:text-red-400">Return to Home</Link>
            </div>
        );
    }

    const handlePayment = async () => {
        if (!user) {
            alert("Please login first to book tickets!");
            return;
        }

        setLoading(true);
        try {
            const bookingId = await createBooking({
                userId: user.convexId || user._id,
                showtimeId: showtime?._id,
                movieTitle: showtime?.movie?.title || showtime?.movie?.name,
                theatreName: showtime?.theatre?.name,
                seats: seats.map(s => ({ row: 0, col: 0, seatId: s, price: 15 })),
                totalAmount: total + 3.50 + total * 0.08
            });

            setSuccess(true);
            setTicketData({
                movie: showtime?.movie?.title || showtime?.movie?.name || 'Unknown Movie',
                theatre: showtime?.theatre?.name || 'Unknown Theatre',
                time: new Date(showtime?.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                seats: seats,
                orderId: bookingId.substring(bookingId.length - 6).toUpperCase()
            });
        } catch (error) {
            console.error("Payment API Error", error);
            alert("Payment failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success && ticketData) {
        return (
            <div className="w-full min-h-screen bg-neutral-950 flex items-center justify-center p-4">
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-purple-600"></div>

                    <div className="flex flex-col items-center text-center">
                        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                        <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
                        <p className="text-neutral-400 mb-8">Your digital ticket is ready.</p>

                        <div className="w-full bg-neutral-950 rounded-xl p-6 border border-neutral-800 border-dashed text-left">
                            <div className="text-xs text-neutral-500 mb-1 uppercase tracking-wider">Order ID</div>
                            <div className="font-mono font-bold mb-4">{ticketData.orderId}</div>

                            <div className="text-xs text-neutral-500 mb-1 uppercase tracking-wider">Movie</div>
                            <div className="font-bold text-lg mb-4">{ticketData.movie}</div>

                            <div className="flex justify-between mb-4">
                                <div>
                                    <div className="text-xs text-neutral-500 mb-1 uppercase tracking-wider">Date & Time</div>
                                    <div className="font-bold">Today, {ticketData.time}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-neutral-500 mb-1 uppercase tracking-wider">Theatre</div>
                                    <div className="font-bold">{ticketData.theatre}</div>
                                </div>
                            </div>

                            <div className="text-xs text-neutral-500 mb-1 uppercase tracking-wider">Seats</div>
                            <div className="flex flex-wrap gap-2">
                                {ticketData.seats.map(s => (
                                    <span key={s} className="bg-neutral-800 px-2 py-1 rounded text-sm font-bold">{s}</span>
                                ))}
                            </div>
                        </div>

                        <Link to="/" className="mt-8 bg-neutral-800 hover:bg-neutral-700 w-full py-4 rounded-xl font-bold transition-colors">
                            Return Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors">
                <ChevronLeft className="w-5 h-5" /> Back to Seat Selection
            </button>

            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-2 w-full md:w-2/3">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 mb-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><CreditCard className="w-5 h-5 text-red-500" /> Payment Details</h2>

                        {/* Mock Credit Card Form */}
                        <form id="payment-form" className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
                            <div>
                                <label className="block text-sm text-neutral-400 mb-2">Card Number</label>
                                <input type="text" placeholder="1234 5678 9101 1121" required pattern="\d{4}\s?\d{4}\s?\d{4}\s?\d{4}" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors" />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm text-neutral-400 mb-2">Expiry Date</label>
                                    <input type="text" placeholder="MM/YY" required pattern="(0[1-9]|1[0-2])\/\d{2}" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm text-neutral-400 mb-2">CVC</label>
                                    <input type="text" placeholder="123" required pattern="\d{3,4}" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-400 mb-2">Cardholder Name</label>
                                <input type="text" placeholder="John Doe" required minLength="3" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors" />
                            </div>
                        </form>
                    </div>
                </div>

                <div className="flex-1 w-full md:w-1/3">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl sticky top-24">
                        <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6 border-b border-neutral-800 pb-6">
                            <div className="flex justify-between text-neutral-400">
                                <span>Tickets ({seats.length} x $15)</span>
                                <span className="text-white">${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-neutral-400">
                                <span>Convenience Fee</span>
                                <span className="text-white">$3.50</span>
                            </div>
                            <div className="flex justify-between text-neutral-400">
                                <span>Taxes</span>
                                <span className="text-white">${(total * 0.08).toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-8">
                            <span className="text-lg font-bold">Total Pay</span>
                            <span className="text-3xl font-bold text-red-500">${(total + 3.50 + total * 0.08).toFixed(2)}</span>
                        </div>

                        <button
                            type="submit"
                            form="payment-form"
                            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${loading ? 'bg-red-600/50 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/30'
                                }`}
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                `Pay $${(total + 3.50 + total * 0.08).toFixed(2)}`
                            )}
                        </button>
                        <p className="text-center text-xs text-neutral-500 mt-4 flex items-center justify-center gap-1">
                            Payments are secure and encrypted.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
