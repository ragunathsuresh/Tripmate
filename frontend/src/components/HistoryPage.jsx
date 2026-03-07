import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
    Home,
    MapIcon,
    Compass,
    Bookmark,
    Settings,
    MapPin,
    ChevronDown,
    Loader2,
    Eye,
    History,
    Navigation
} from 'lucide-react';
import './HistoryPage.css';

const HistoryPage = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('recentlyViewed');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userInfo'));
        if (!userData) {
            navigate('/login');
            return;
        }
        setUser(userData);
        fetchHistory(userData._id, 'recentlyViewed', 1);
    }, []);

    const fetchHistory = async (userId, status, pageNum, isLoadMore = false) => {
        if (!isLoadMore) setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`/api/history/user/${userId}?status=${status}&page=${pageNum}&limit=5`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (isLoadMore) {
                setHistory(prev => [...prev, ...res.data.history]);
            } else {
                setHistory(res.data.history);
            }

            setTotalPages(res.data.totalPages);
            setPage(pageNum);
        } catch (err) {
            console.error('Error fetching travel history:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (user) {
            fetchHistory(user._id, tab, 1);
        }
    };

    const handleLoadMore = () => {
        if (page < totalPages && user) {
            fetchHistory(user._id, activeTab, page + 1, true);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className="history-page">
            <aside className="history-sidebar">
                <div className="sidebar-logo">
                    <Navigation size={24} color="#00d2ff" fill="#00d2ff" />
                    <span>VoyaPlan</span>
                </div>

                <div className="user-profile-card">
                    <img src={`https://i.pravatar.cc/150?u=${user?._id || 'user'}`} alt="User" />
                    <div className="user-info">
                        <h4>{user?.name || 'Traveler'}</h4>
                        <p>Traveler Level 5</p>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/" className="nav-item">
                        <Home size={20} /> Home
                    </Link>
                    <Link to="/my-trips" className="nav-item">
                        <MapIcon size={20} /> My Trips
                    </Link>
                    <Link to="/explore" className="nav-item">
                        <Compass size={20} /> Explore
                    </Link>
                    <Link to="/saved" className="nav-item">
                        <Bookmark size={20} /> Saved
                    </Link>
                    <Link to="/history" className="nav-item active">
                        <History size={20} /> History
                    </Link>
                    <Link to="/settings" className="nav-item">
                        <Settings size={20} /> Settings
                    </Link>
                </nav>
            </aside>

            <main className="history-main">
                <header className="history-header">
                    <h1>Travel History</h1>
                    <p>Destinations you've explored or planned for your next adventure.</p>
                </header>

                <div className="filter-tabs">
                    <div
                        className={`filter-tab ${activeTab === 'recentlyViewed' ? 'active' : ''}`}
                        onClick={() => handleTabChange('recentlyViewed')}
                    >
                        Recently Viewed
                    </div>
                    <div
                        className={`filter-tab ${activeTab === 'planned' ? 'active' : ''}`}
                        onClick={() => handleTabChange('planned')}
                    >
                        Planned
                    </div>
                    <div
                        className={`filter-tab ${activeTab === 'completed' ? 'active' : ''}`}
                        onClick={() => handleTabChange('completed')}
                    >
                        Completed
                    </div>
                </div>

                {loading && page === 1 ? (
                    <div className="history-loading">
                        <Loader2 className="animate-spin" size={40} color="#00d2ff" />
                        <span>Recalling your journeys...</span>
                    </div>
                ) : (
                    <div className="history-container">
                        {history.length > 0 ? (
                            <>
                                <div className="history-list">
                                    {history.map((item, idx) => (
                                        <div key={item._id || idx} className="history-card">
                                            <div className="history-card-img">
                                                <img src={item.destinationImage} alt={item.destinationName} />
                                            </div>
                                            <div className="history-card-info">
                                                <h3>{item.destinationName}</h3>
                                                <div className="history-card-loc">
                                                    <MapPin size={14} />
                                                    <span>{item.location}</span>
                                                </div>
                                                <div className="history-card-date">
                                                    Viewed on {formatDate(item.viewedDate)}
                                                </div>
                                            </div>
                                            <button
                                                className="btn-view-again"
                                                onClick={() => navigate(`/destination/${item.destination}`)}
                                            >
                                                View Again
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {page < totalPages && (
                                    <div className="load-more-container">
                                        <button className="btn-load-more" onClick={handleLoadMore}>
                                            <ChevronDown size={20} />
                                            Load more destinations
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="empty-history">
                                <Compass size={60} color="#e2e8f0" />
                                <h2>No history found</h2>
                                <p>You haven't explored any destinations in this category yet.</p>
                                <button className="btn-explore" onClick={() => navigate('/explore')}>
                                    Start Exploring
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default HistoryPage;

