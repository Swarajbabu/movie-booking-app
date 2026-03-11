import React, { useState, useEffect } from 'react';
import { LogOut, Ticket, Settings, Heart } from 'lucide-react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const Profile = () => {
    const { user, login, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('tickets');
    const [selectedTicket, setSelectedTicket] = useState(null);

    const rawBookings = useQuery(api.bookings.getByUser, user && (user.convexId || user._id) ? { userId: user.convexId || user._id } : "skip");

    let bookings = [];
    if (rawBookings) {
        bookings = rawBookings.filter(tkt => {
            if (!tkt.showtime?.startTime) return true;
            const endTime = new Date(tkt.showtime.startTime).getTime() + (3 * 60 * 60 * 1000);
            return endTime > Date.now();
        });
    }
    const loading = user ? rawBookings === undefined : false;

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row gap-8">

                {/* Sidebar */}
                <div className="w-full md:w-64 flex flex-col gap-2">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 text-center mb-4">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="Avatar" className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-neutral-700 object-cover" />
                        ) : (
                            <div className="w-24 h-24 bg-gradient-to-tr from-red-500 to-purple-600 rounded-full mx-auto mb-4 p-1">
                                <div className="w-full h-full bg-neutral-900 rounded-full flex items-center justify-center text-2xl font-bold">
                                    {user?.name ? user.name.substring(0, 2).toUpperCase() : '👤'}
                                </div>
                            </div>
                        )}
                        <h2 className="text-xl font-bold">{user?.name || 'Guest'}</h2>
                        <p className="text-neutral-500 text-sm">{user?.email}</p>
                    </div>

                    <button
                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${activeTab === 'tickets' ? 'bg-red-500/10 text-red-500 font-bold' : 'hover:bg-neutral-900 text-neutral-400'}`}
                        onClick={() => setActiveTab('tickets')}
                    >
                        <Ticket className="w-5 h-5" /> My Tickets
                    </button>

                    <button
                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${activeTab === 'favorites' ? 'bg-red-500/10 text-red-500 font-bold' : 'hover:bg-neutral-900 text-neutral-400'}`}
                        onClick={() => setActiveTab('favorites')}
                    >
                        <Heart className="w-5 h-5" /> Favorites
                    </button>

                    <button
                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${activeTab === 'settings' ? 'bg-red-500/10 text-red-500 font-bold' : 'hover:bg-neutral-900 text-neutral-400'}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <Settings className="w-5 h-5" /> Account Settings
                    </button>

                    <button onClick={logout} className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 hover:bg-neutral-900 text-red-500 mt-auto opacity-80 hover:opacity-100 transition-opacity">
                        <LogOut className="w-5 h-5" /> Sign Out
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    {activeTab === 'tickets' && (
                        <div>
                            <h1 className="text-3xl font-bold mb-8">My Tickets</h1>
                            <div className="flex flex-col gap-6">
                                {!user ? (
                                    <div className="text-center text-neutral-500 py-10 border border-neutral-800 border-dashed rounded-xl">Please sign in to view your tickets.</div>
                                ) : loading ? (
                                    <div className="text-center text-neutral-500 py-10 border border-neutral-800 border-dashed rounded-xl">Loading your tickets...</div>
                                ) : bookings.length === 0 ? (
                                    <div className="text-center text-neutral-500 py-10 border border-neutral-800 border-dashed rounded-xl">You have no booking history yet. Time to catch a movie!</div>
                                ) : (
                                    bookings.map((tkt, idx) => {
                                        const date = new Date(tkt._creationTime);
                                        const isUpcoming = tkt.status === 'Confirmed';

                                        return (
                                            <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden group hover:border-neutral-700 transition-colors">
                                                {isUpcoming && (
                                                    <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                                        UPCOMING
                                                    </div>
                                                )}

                                                <div className="flex-1 flex flex-col justify-center border-r border-neutral-800 border-dashed pr-6 cursor-pointer" onClick={() => setSelectedTicket(tkt)}>
                                                    <h3 className="text-xl font-bold mb-2">{tkt.showtime?.movie?.title || tkt.movieTitle || 'Unknown Movie'}</h3>
                                                    <div className="text-neutral-400 flex flex-col gap-1 text-sm mb-4">
                                                        <span>{date.toLocaleDateString()} • {tkt.showtime?.startTime ? new Date(tkt.showtime.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Unknown Time'}</span>
                                                        <span>{tkt.showtime?.theatre?.name || tkt.theatreName || 'Unknown Theatre'}</span>
                                                        <span>Seats: {tkt.seats.map(s => s.seatId ? s.seatId : s).join(', ')}</span>
                                                        <span>Amount: ${tkt.totalAmount.toFixed(2)}</span>
                                                    </div>
                                                    <div className="text-xs text-neutral-500 uppercase tracking-wider">Order ID: {tkt._id.slice(-6).toUpperCase()}</div>
                                                </div>

                                                <div className="w-full md:w-32 flex flex-col items-center justify-center gap-2">
                                                    <div className="w-16 h-16 bg-white rounded-lg p-1 cursor-pointer hover:scale-105 transition-transform" onClick={() => setSelectedTicket(tkt)}>
                                                        <QRCodeCanvas
                                                            value={tkt._id}
                                                            size={56}
                                                            level="H"
                                                            includeMargin={false}
                                                        />
                                                    </div>
                                                    <button onClick={() => setSelectedTicket(tkt)} className="text-sm font-bold text-red-500 hover:text-red-400 transition-colors">Digital Pass</button>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'favorites' && (
                        <div>
                            <h1 className="text-3xl font-bold mb-8">Favorites</h1>
                            <p className="text-neutral-400 border border-neutral-800 bg-neutral-900/50 rounded-xl p-8 text-center border-dashed">No favorited movies yet.</p>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div>
                            <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
                            <form className="flex flex-col gap-6 max-w-lg" onSubmit={async (e) => {
                                e.preventDefault();
                                try {
                                    const res = await axios.put(`${import.meta.env.VITE_API_URL}/auth/update`, {
                                        name: e.target.name.value,
                                        email: e.target.email.value,
                                        password: e.target.password.value || undefined
                                    }, {
                                        headers: { Authorization: `Bearer ${user.token}` }
                                    });
                                    login(res.data);
                                    alert('Profile updated successfully!');
                                } catch (err) {
                                    alert('Failed to update profile');
                                    console.error(err);
                                }
                            }}>
                                <div className="flex flex-col gap-2">
                                    <label className="text-neutral-400 font-bold text-sm">Full Name</label>
                                    <input name="name" type="text" defaultValue={user?.name} className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors" required />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-neutral-400 font-bold text-sm">Email Address</label>
                                    <input name="email" type="email" defaultValue={user?.email} className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors" required />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-neutral-400 font-bold text-sm">New Password (Optional)</label>
                                    <input name="password" type="password" placeholder="Leave blank to keep same" className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors" />
                                </div>
                                <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors mt-2">Save Changes</button>
                            </form>
                        </div>
                    )}

                </div>
            </div>

            {/* Digital Pass Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedTicket(null)}>
                    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-purple-600"></div>
                        <button onClick={() => setSelectedTicket(null)} className="absolute top-4 right-4 text-neutral-500 hover:text-white">✕</button>

                        <div className="flex flex-col items-center text-center mt-4">
                            <h2 className="text-2xl font-bold mb-6">Digital Pass</h2>

                            <div className="w-48 h-48 bg-white rounded-2xl p-4 mb-8 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                <QRCodeCanvas
                                    value={JSON.stringify({
                                        orderId: selectedTicket._id.slice(-6).toUpperCase(),
                                        movie: selectedTicket.showtime?.movie?.title || selectedTicket.movieTitle || 'Unknown Movie',
                                        seats: selectedTicket.seats.map(s => s.seatId ? s.seatId : s).join(', '),
                                        date: selectedTicket._creationTime
                                    })}
                                    size={160}
                                    level="H"
                                    fgColor="#000000"
                                    bgColor="#ffffff"
                                />
                            </div>

                            <div className="w-full bg-neutral-950 rounded-xl p-6 border border-neutral-800 border-dashed text-left">
                                <div className="text-xs text-neutral-500 mb-1 uppercase tracking-wider">Movie</div>
                                <div className="font-bold text-lg mb-4">{selectedTicket.showtime?.movie?.title || selectedTicket.movieTitle || 'Unknown Movie'}</div>

                                <div className="flex justify-between mb-4">
                                    <div>
                                        <div className="text-xs text-neutral-500 mb-1 uppercase tracking-wider">Date & Time</div>
                                        <div className="font-bold">{new Date(selectedTicket._creationTime).toLocaleDateString()} • {selectedTicket.showtime?.startTime ? new Date(selectedTicket.showtime.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Unknown Time'}</div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="text-xs text-neutral-500 mb-1 uppercase tracking-wider">Location</div>
                                    <div className="font-bold">{selectedTicket.showtime?.theatre?.name || selectedTicket.theatreName || 'Unknown Theatre'}</div>
                                </div>

                                <div className="flex justify-between mb-4">
                                    <div>
                                        <div className="text-xs text-neutral-500 mb-1 uppercase tracking-wider">Seats</div>
                                        <div className="font-bold text-red-500">{selectedTicket.seats.map(s => s.seatId ? s.seatId : s).join(', ')}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-neutral-500 mb-1 uppercase tracking-wider">Order ID</div>
                                        <div className="font-mono font-bold">{selectedTicket._id.slice(-6).toUpperCase()}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;

