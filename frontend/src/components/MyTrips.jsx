import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
    LayoutGrid,
    List,
    Calendar,
    MapPin,
    MoreHorizontal,
    Edit2,
    Trash2,
    Eye,
    Plus,
    ExternalLink,
    Map as MapIcon,
    Compass,
    Trophy,
    Settings,
    Grid,
    Search,
    CheckCircle2,
    Clock,
    Navigation,
    History
} from 'lucide-react';
import './MyTrips.css';

const MyTrips = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userInfo'));
        if (userData) {
            setUser(userData);
            fetchTrips(userData._id, 'all');
        } else {
            navigate('/login');
        }
    }, []);

    const fetchTrips = async (userId, status) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            let url = `http://localhost:5000/api/trips/user/${userId}`;
            if (status !== 'all') {
                url += `?status=${status}`;
            }
            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTrips(res.data);
        } catch (err) {
            console.error('Error fetching trips:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (user) {
            fetchTrips(user._id, tab);
        }
    };

    const handleDeleteTrip = async (tripId) => {
        if (window.confirm('Are you sure you want to delete this trip?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/trips/${tripId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTrips(trips.filter(t => t._id !== tripId));
            } catch (err) {
                console.error('Error deleting trip:', err);
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'TBD';
        const options = { month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const getDuration = (start, end) => {
        if (!start || !end) return 'Flexible';
        const s = new Date(start);
        const e = new Date(end);
        const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
        return `${diff} Days`;
    };

    const getTripImage = (trip) =>
        trip?.destination?.images?.[0] ||
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1200';

    return (
        <div className="my-trips-page">
            {/* Sidebar */}
            <aside className="trips-sidebar">
                <div className="sidebar-logo">
                    <Navigation size={24} color="#00d2ff" fill="#00d2ff" />
                    <span>VoyaPlan</span>
                </div>

                <div className="user-profile-card">
                    <img src={`https://i.pravatar.cc/150?u=${user?._id || 'user'}`} alt="User" />
                    <div className="user-info">
                        <h4>{user?.name || 'Traveler'}</h4>
                        <p>Premium Member</p>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/dashboard" className="nav-item">
                        <Grid size={20} /> Dashboard
                    </Link>
                    <Link to="/my-trips" className="nav-item active">
                        <MapIcon size={20} /> My Trips
                    </Link>
                    <Link to="/explore" className="nav-item">
                        <Compass size={20} /> Explore
                    </Link>
                    <Link to="/bookings" className="nav-item">
                        <Trophy size={20} /> Bookings
                    </Link>
                    <Link to="/history" className="nav-item">
                        <History size={20} /> History
                    </Link>
                    <Link to="/settings" className="nav-item">
                        <Settings size={20} /> Settings
                    </Link>
                </nav>

                <button className="btn-plan-new" onClick={() => navigate('/planner')}>
                    <Plus size={20} /> Plan New Trip
                </button>
            </aside>

            {/* Main Content */}
            <main className="trips-main">
                <header className="trips-header">
                    <div>
                        <h1>My Trips</h1>
                        <p>Manage your upcoming and past adventures</p>
                    </div>
                    <div className="view-controls">
                        <button className="icon-btn active"><Grid size={18} /></button>
                        <button className="icon-btn"><List size={18} /></button>
                    </div>
                </header>

                <div className="filter-tabs">
                    <div
                        className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => handleTabChange('all')}
                    >
                        All Trips <span className="tab-count">{trips.length}</span>
                    </div>
                    <div
                        className={`filter-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
                        onClick={() => handleTabChange('upcoming')}
                    >
                        Upcoming
                    </div>
                    <div
                        className={`filter-tab ${activeTab === 'past' ? 'active' : ''}`}
                        onClick={() => handleTabChange('past')}
                    >
                        Past
                    </div>
                </div>

                {loading ? (
                    <div className="trips-loading">Loading your adventures...</div>
                ) : (
                    <div className="trips-grid">
                        {trips.length > 0 ? (
                            trips.map(trip => (
                                <div key={trip._id} className="trip-card">
                                    <div className="trip-card-img">
                                        <img src={getTripImage(trip)} alt={trip?.title || trip?.destination?.name || 'Trip'} />
                                        <div className={`status-badge ${trip.status === 'completed' ? 'completed' : 'upcoming'}`}>
                                            {trip.status === 'completed' ? 'Past Trip' : 'Upcoming'}
                                        </div>
                                    </div>
                                    <div className="trip-card-content">
                                        <h3>{trip?.title || `${trip?.destination?.name || 'Untitled'} Getaway`}</h3>
                                        <div className="trip-date-info">
                                            <Calendar size={16} />
                                            <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)} - {getDuration(trip.startDate, trip.endDate)}</span>
                                        </div>

                                        <div className="trip-status-row">
                                            <div className="status-indicator">
                                                <div className={`dot ${trip?.status || 'planning'}`}></div>
                                                <span>Status: {(trip?.status || 'planning').charAt(0).toUpperCase() + (trip?.status || 'planning').slice(1)}</span>
                                            </div>
                                            <span className="ref-id">Ref: #{trip?.referenceId || 'N/A'}</span>
                                        </div>

                                        <div className="trip-card-actions">
                                            <button
                                                className="btn-view-trip"
                                                onClick={() => navigate(`/itinerary/${trip._id}`)}
                                            >
                                                {trip.status === 'completed' ? 'Rebook' : 'View'}
                                            </button>
                                            <button className="btn-icon-action"><Edit2 size={16} /></button>
                                            <button
                                                className="btn-icon-action delete"
                                                onClick={() => handleDeleteTrip(trip._id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-trip-card">
                                <div className="plus-circle">
                                    <Plus size={24} />
                                </div>
                                <h4>Plan your next adventure</h4>
                                <p>Discover new destinations and create memories that last forever.</p>
                                <button className="btn-start-planning" onClick={() => navigate('/planner')}>
                                    Start Planning
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Map Preview Section */}
                <section className="trip-map-section">
                    <div className="map-header">
                        <h2>Trip Map</h2>
                        <span className="btn-fullscreen">View fullscreen <ExternalLink size={16} /></span>
                    </div>
                    <div className="map-placeholder">
                        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200" alt="World Map" />
                        <div className="map-pin-point pin1"></div>
                        <div className="map-pin-point pin2"></div>
                        <div className="map-pin-point pin3"></div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default MyTrips;



