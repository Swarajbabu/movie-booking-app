import React from 'react';
import { LayoutDashboard, Film, Armchair, Users, Activity } from 'lucide-react';

const AdminDashboard = () => {
    return (
        <div className="w-full min-h-screen bg-neutral-950 flex flex-col md:flex-row">

            {/* Sidebar Admin Nav */}
            <div className="w-full md:w-64 bg-neutral-900 border-r border-neutral-800 p-6 flex flex-col gap-2">
                <h2 className="text-xl font-bold mb-8 text-red-500 uppercase tracking-widest text-sm">Admin Panel</h2>

                <button className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 bg-red-500/10 text-red-500 font-bold transition-colors">
                    <LayoutDashboard className="w-5 h-5" /> Overview
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 hover:bg-neutral-800 text-neutral-400 transition-colors">
                    <Film className="w-5 h-5" /> Movies
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 hover:bg-neutral-800 text-neutral-400 transition-colors">
                    <Armchair className="w-5 h-5" /> Theatres & Showtimes
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 hover:bg-neutral-800 text-neutral-400 transition-colors">
                    <Users className="w-5 h-5" /> User Management
                </button>
            </div>

            {/* Main Content Dashboard */}
            <div className="flex-1 p-8">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <Activity className="w-8 h-8 text-red-500" /> Platform Overview
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700/50 rounded-2xl p-6 shadow-lg relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-10"><Film className="w-32 h-32" /></div>
                        <div className="text-neutral-400 font-bold mb-2 uppercase text-sm tracking-wider">Total Movies</div>
                        <div className="text-5xl font-bold text-white">42</div>
                    </div>

                    <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700/50 rounded-2xl p-6 shadow-lg relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-10"><Armchair className="w-32 h-32" /></div>
                        <div className="text-neutral-400 font-bold mb-2 uppercase text-sm tracking-wider">Active Showtimes</div>
                        <div className="text-5xl font-bold text-white">128</div>
                    </div>

                    <div className="bg-gradient-to-br from-red-900/40 to-neutral-900 border border-red-500/30 rounded-2xl p-6 shadow-lg relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-10 text-red-500"><Users className="w-32 h-32" /></div>
                        <div className="text-red-400 font-bold mb-2 uppercase text-sm tracking-wider">Total Revenue Today</div>
                        <div className="text-5xl font-bold text-white">$4,250</div>
                    </div>
                </div>

                <h2 className="text-xl font-bold mb-6">Recent Bookings</h2>
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-neutral-950 text-neutral-400 uppercase text-xs tracking-wider">
                                <th className="p-4 border-b border-neutral-800 font-medium">Order ID</th>
                                <th className="p-4 border-b border-neutral-800 font-medium">User</th>
                                <th className="p-4 border-b border-neutral-800 font-medium">Item</th>
                                <th className="p-4 border-b border-neutral-800 font-medium">Amount</th>
                                <th className="p-4 border-b border-neutral-800 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="hover:bg-neutral-800/50 transition-colors">
                                    <td className="p-4 border-b border-neutral-800 text-sm font-mono text-neutral-300">TKT-8Y{i}L9A</td>
                                    <td className="p-4 border-b border-neutral-800 font-medium">User {i}</td>
                                    <td className="p-4 border-b border-neutral-800 text-neutral-400">Dune: Part Two (2 Seats)</td>
                                    <td className="p-4 border-b border-neutral-800 font-bold text-red-400">${(i * 15 + 3.5).toFixed(2)}</td>
                                    <td className="p-4 border-b border-neutral-800">
                                        <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs font-bold border border-green-500/20">CONFIRMED</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
