import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, User, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

const Navbar = () => {
    const { user, login, logout } = useAuth();
    const syncUser = useMutation(api.users.syncUser);

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);

            const convexUserId = await syncUser({
                name: decoded.name,
                email: decoded.email,
                avatar: decoded.picture,
                googleId: decoded.sub,
            });

            login({
                name: decoded.name,
                email: decoded.email,
                avatar: decoded.picture,
                convexId: convexUserId,
                token: credentialResponse.credential, // Keeping token for legacy checks if any
                _id: convexUserId // Keep Mongoose _id fallback as convexId mapping
            });
        } catch (err) {
            console.error("Google login failed", err);
        }
    };

    return (
        <nav className="bg-neutral-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-neutral-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2 group">
                        <Ticket className="w-8 h-8 text-red-500 group-hover:rotate-12 transition-transform" />
                        <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
                            CineStream
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to="/profile" className="flex items-center gap-2 hover:text-red-400 transition-colors">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full border border-neutral-700 object-cover" />
                                    ) : (
                                        <User className="w-5 h-5" />
                                    )}
                                    <span className="font-bold hidden sm:block">{user.name?.split(' ')[0]}</span>
                                </Link>
                                <button onClick={logout} className="text-neutral-500 hover:text-red-500 transition-colors" title="Logout">
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => console.log('Login Failed')}
                                type="standard"
                                theme="filled_black"
                                shape="pill"
                            />
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
