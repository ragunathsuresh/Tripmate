import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
    Heart,
    MapPin,
    Star,
    Compass,
    Grid,
    Navigation,
    History,
    Settings,
    Map as MapIcon,
    Loader2,
    Search,
    Bookmark,
    Trophy,
    User
} from 'lucide-react';
import './SavedDestinations.css';

const SavedDestinations = () => {
    const navigate = useNavigate();
    const [saved, setSaved] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userInfo'));
        if (!userData) {
            navigate('/login');
            return;
        }
        setUser(userData);
        // Simulate fetching saved destinations (using history 'planned' as a proxy if no specific saved model yet)
        fetchSaved(userData._id);
    }, []);

    const fetchSaved = async (userId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Assuming history with status 'planned' or 'viewed' for now, 
            // but in a real app we'd have a Saved model.
            const res = await axios.get(`/api/history/user/${userId}?status=recentlyViewed&limit=10`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSaved(res.data.history || []);
        } catch (err) {
            console.error('Error fetching saved destinations:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="saved-page">
            <aside className="saved-sidebar">
                <div className="sidebar-logo">
                    <img src="/tripmate-logo.png" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
                    <span>Tripmate</span>
                </div>

                <div className="user-profile-card">
                    {user?.profilePicture ? (
                        <img src={user.profilePicture} alt="User" />
                    ) : (
                        <div className="user-avatar-placeholder" style={{ width: '40px', height: '40px', background: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={20} color="#64748b" />
                        </div>
                    )}
                    <div className="user-info">
                        <h4>{user?.name || 'Traveler'}</h4>
                        <p>Gold Explorer</p>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/dashboard" className="nav-item">
                        <Grid size={20} /> Dashboard
                    </Link>
                    <Link to="/my-trips" className="nav-item">
                        <MapIcon size={20} /> My Trips
                    </Link>
                    <Link to="/explore" className="nav-item">
                        <Compass size={20} /> Explore
                    </Link>
                    <Link to="/saved" className="nav-item active">
                        <Bookmark size={20} /> Saved
                    </Link>
                    <Link to="/history" className="nav-item">
                        <History size={20} /> History
                    </Link>
                    <Link to="/bookings" className="nav-item">
                        <Trophy size={20} /> Bookings
                    </Link>
                    <Link to="/settings" className="nav-item">
                        <Settings size={20} /> Settings
                    </Link>
                </nav>
            </aside>

            <main className="saved-main">
                <header className="saved-header">
                    <div>
                        <h1>Wishlist</h1>
                        <p>Your curated collection of dream destinations</p>
                    </div>
                </header>

                {loading ? (
                    <div className="saved-loading">
                        <Loader2 className="animate-spin" size={40} color="#00d2ff" />
                        <span>Finding your dream spots...</span>
                    </div>
                ) : (
                    <div className="saved-grid">
                        {saved.length > 0 ? (
                            saved.map((item, idx) => (
                                <div key={item._id || idx} className="saved-card">
                                    <div className="saved-card-img">
                                        <img src={item.destinationImage} alt={item.destinationName} />
                                        <button className="heart-btn active">
                                            <Heart size={18} fill="#ef4444" color="#ef4444" />
                                        </button>
                                    </div>
                                    <div className="saved-card-content">
                                        <div className="loc-row">
                                            <MapPin size={14} />
                                            <span>{item.location}</span>
                                        </div>
                                        <h3>{item.destinationName}</h3>
                                        <div className="card-footer">
                                            <div className="rating">
                                                <Star size={14} fill="#fbbf24" color="#fbbf24" />
                                                <span>4.9</span>
                                            </div>
                                            <button
                                                className="btn-plan-now"
                                                onClick={() => navigate(`/destination/${item.destination}`)}
                                            >
                                                Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-saved">
                                <Heart size={60} color="#e2e8f0" />
                                <h2>Your wishlist is empty</h2>
                                <p>Start exploring and save your favorite destinations for later.</p>
                                <button className="btn-go-explore" onClick={() => navigate('/explore')}>
                                    Explore Now
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default SavedDestinations;
