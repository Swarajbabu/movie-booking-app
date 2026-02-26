import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Showtimes from './pages/Showtimes';
import SeatSelection from './pages/SeatSelection';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/movie/:id" element={<MovieDetails />} />
                        <Route path="/movie/:id/showtimes" element={<Showtimes />} />
                        <Route path="/showtime/:id/seats" element={<SeatSelection />} />

                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/admin" element={<AdminDashboard />} />

                    </Routes>
                </main>
            </div>
        </Router>
    );
} 

export default App;
