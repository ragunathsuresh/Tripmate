import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Compass,
    MapPin,
    History,
    Settings,
    LogOut,
    Search,
    Bell,
    Calendar,
    Heart,
    ChevronRight,
    Star,
    Plus,
    Plane,
    Map,
    Utensils,
    Mountain,
    Activity,
    Navigation,
    Loader2
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [user, setUser] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = localStorage.getItem('token');

        if (!userInfo || !token) {
            navigate('/login');
            return;
        }

        setUser(userInfo);
        fetchDashboardData(token);
    }, []);

    const fetchDashboardData = async (token) => {
        try {
            const res = await axios.get('/api/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
            setErrorMsg(null);
        } catch (err) {
            console.error('Error fetching dashboard:', err);
            const msg = err.response?.data?.message || err.message || 'Unknown network error';
            setErrorMsg(msg);
            if (err.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const formatDateRange = (start, end) => {
        const s = new Date(start);
        const e = new Date(end);
        const options = { month: 'short', day: 'numeric' };
        return `${s.toLocaleDateString('en-US', options)} – ${e.toLocaleDateString('en-US', { ...options, year: 'numeric' })}`;
    };

    const getTimeAgo = (dateString) => {
        const diff = Date.now() - new Date(dateString).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `Searched ${days}d ago`;
        if (hours > 0) return `Searched ${hours}h ago`;
        return `Searched ${minutes}m ago`;
    };

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8fafc' }}>
            <Loader2 className="animate-spin" size={48} color="#00d2ff" />
        </div>
    );

    if (errorMsg) return (
        <div style={{ textAlign: 'center', padding: '5rem', background: '#f8fafc', height: '100vh' }}>
            <h2 style={{ color: '#ef4444' }}>Dashboard Error</h2>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>{errorMsg}</p>
            <button className="btn-view-details" onClick={() => window.location.reload()}>Try Again</button>
        </div>
    );

    if (!data) return (
        <div style={{ textAlign: 'center', padding: '5rem', background: '#f8fafc', height: '100vh' }}>
            <h2>No data received from server.</h2>
            <button className="btn-view-details" style={{ marginTop: '1rem' }} onClick={() => window.location.reload()}>Try Again</button>
        </div>
    );

    const { upcomingTrip, recentSearches, recommendedDestinations, savedTrips, user: dashboardStats } = data;

    return (
        <div className="dashboard-container">
            <aside className="dashboard-sidebar">
                <div className="dashboard-logo">
                    <div className="logo-box"><Plane size={20} fill="white" /></div>
                    <span>AI Travel</span>
                </div>

                <nav className="dashboard-nav">
                    <Link to="/dashboard" className="dashboard-nav-item active">
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link to="/planner" className="dashboard-nav-item">
                        <Navigation size={20} /> AI Trip Planner
                    </Link>
                    <Link to="/explore" className="dashboard-nav-item">
                        <Compass size={20} /> Destinations
                    </Link>
                    <Link to="/my-trips" className="dashboard-nav-item">
                        <Calendar size={20} /> My Trips
                    </Link>
                    <Link to="/history" className="dashboard-nav-item">
                        <History size={20} /> Travel History
                    </Link>

                    <div style={{ marginTop: '2rem' }}></div>

                    <Link to="/settings" className="dashboard-nav-item">
                        <Settings size={20} /> Profile Settings
                    </Link>
                </nav>

                <button className="btn-logout" onClick={handleLogout}>
                    <LogOut size={20} /> Logout
                </button>
            </aside>

            <main className="dashboard-main">
                <header className="dashboard-top">
                    <div className="search-bar">
                        <Search size={18} color="#94a3b8" />
                        <input type="text" placeholder="Search destinations, activities or hotels..." />
                    </div>

                    <div className="dashboard-profile-header">
                        <Bell size={20} style={{ color: '#64748b', cursor: 'pointer' }} />
                        <div style={{ textAlign: 'right' }}>
                            <h4 style={{ margin: 0, fontWeight: 800 }}>{user?.name}</h4>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Gold Explorer</p>
                        </div>
                        <img src={`https://i.pravatar.cc/150?u=${user?._id}`} className="profile-img-small" alt="Profile" />
                    </div>
                </header>

                <div className="welcome-section">
                    <h1>Welcome back, {user?.name?.split(' ')[0] || 'Traveler'}!</h1>
                    <p>You have {dashboardStats?.upcomingTripsCount || 0} upcoming trips and {dashboardStats?.savedDestinationsCount || 0} saved destinations to explore.</p>
                </div>

                <div className="dashboard-top-row">
                    {upcomingTrip ? (
                        <div className="upcoming-trip-card">
                            <div className="trip-img-box">
                                <img src={upcomingTrip.destination?.images?.[0] || upcomingTrip.destinationImage || 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1972&auto=format&fit=crop'} alt="Trip" />
                                <div className="status-badge">Confirmed</div>
                            </div>
                            <div className="trip-info-box">
                                <span className="trip-date-pill">
                                    <Calendar size={18} /> {formatDateRange(upcomingTrip.startDate, upcomingTrip.endDate)}
                                </span>
                                <h2>Summer in {upcomingTrip.destination?.name || upcomingTrip.destinationName}</h2>
                                <p>Experience the magic of {upcomingTrip.destination?.name || upcomingTrip.destinationName} with a curated luxury stay including activities and scenic tours.</p>
                                <div className="trip-actions">
                                    <button className="btn-view-details" onClick={() => navigate(`/itinerary/${upcomingTrip._id}`)}>View Details</button>
                                    <button className="btn-manage" onClick={() => navigate('/my-trips')}>
                                        <Activity size={18} /> Manage
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="upcoming-trip-card" style={{ alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderStyle: 'dashed' }}>
                            <div style={{ textAlign: 'center' }}>
                                <Navigation size={48} color="#94a3b8" />
                                <h3 style={{ marginTop: '1rem', color: '#64748b' }}>No upcoming trips planned.</h3>
                                <button className="btn-view-details" style={{ marginTop: '1rem' }} onClick={() => navigate('/planner')}>Plan a New Adventure</button>
                            </div>
                        </div>
                    )}

                    <div className="recent-searches-widget">
                        <div className="widget-header">
                            <h3>Recent Searches</h3>
                            <Link to="/history" className="view-all-link">View All</Link>
                        </div>
                        {recentSearches?.length > 0 ? recentSearches.map(search => (
                            <div key={search._id} className="search-item">
                                <img src={search.destinationImage || search.destination?.images?.[0] || 'https://via.placeholder.com/44'} className="search-thumb" alt="Dest" />
                                <div className="search-info">
                                    <h4>{search.destinationName || search.destination?.name}</h4>
                                    <p>{getTimeAgo(search.viewedDate)}</p>
                                </div>
                                <ChevronRight size={18} className="chevron-right" />
                            </div>
                        )) : (
                            <div style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', marginTop: '3rem' }}>No recent history.</div>
                        )}
                    </div>
                </div>

                <div className="recommended-section">
                    <div className="section-header">
                        <h2>Recommended for You</h2>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <div className="reco-fav"><ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} /></div>
                            <div className="reco-fav"><ChevronRight size={20} /></div>
                        </div>
                    </div>
                    <div className="reco-grid">
                        {recommendedDestinations?.map(dest => (
                            <div key={dest._id} className="reco-card">
                                <img src={dest.images?.[0]} className="reco-img" alt={dest.name} />
                                <div className="reco-fav"><Heart size={16} /></div>
                                <div className="reco-content">
                                    <span className="reco-cat">{dest.category}</span>
                                    <h4>{dest.name}, {dest.country}</h4>
                                    <div className="reco-meta">
                                        <div className="reco-rating">
                                            <Star size={14} fill="#f59e0b" color="#f59e0b" />
                                            <span>{dest.rating || 0} (2.4k)</span>
                                        </div>
                                        <span className="reco-price">${dest.estimatedCostPerDay?.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="dashboard-bottom-row">
                    <div>
                        <div className="section-header">
                            <h2>Saved Trips</h2>
                            <Link to="/my-trips" className="view-all-link">Manage All</Link>
                        </div>
                        <div className="saved-trips-grid">
                            {savedTrips?.length > 0 ? savedTrips.map(trip => (
                                <div key={trip._id} className="saved-trip-item">
                                    <div className={trip.status === 'planning' ? 'icon-box-green' : 'icon-box-blue'}>
                                        {trip.status === 'planning' ? <Utensils size={20} /> : <Mountain size={20} />}
                                    </div>
                                    <div className="saved-trip-info">
                                        <h4>{trip.destination?.name || trip.destinationName} Trip</h4>
                                        <p>{trip.status?.toUpperCase()}</p>
                                        <span>PLANNED FOR {trip.startDate ? new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase() : 'TBD'}</span>
                                    </div>
                                </div>
                            )) : (
                                <p style={{ color: '#94a3b8' }}>No saved trips yet.</p>
                            )}
                            <button className="btn-plan-new" onClick={() => navigate('/planner')}>
                                <Plus size={24} /> Plan New Trip
                            </button>
                        </div>
                    </div>

                    <div className="world-view-widget">
                        <div className="section-header">
                            <h2>World View</h2>
                        </div>
                        <div className="map-widget">
                            <div className="map-overlay">
                                <div className="ping-marker" style={{ marginBottom: '1rem' }}></div>
                                <h3>Explore Destinations</h3>
                                <p>View your pins and global recommendations on a map.</p>
                                <button className="btn-open-map">Open Interactive Map</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
