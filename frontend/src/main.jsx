import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { ConvexProvider, ConvexReactClient } from 'convex/react';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'loading';
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL || 'https://exuberant-grouse-583.convex.cloud');

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ConvexProvider client={convex}>
            <GoogleOAuthProvider clientId={clientId}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </GoogleOAuthProvider>
        </ConvexProvider>
    </React.StrictMode>,
)
