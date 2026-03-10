import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Search,
    MapPin,
    Star,
    Filter,
    ChevronDown,
    Loader2,
    Wind,
    Sun,
    Snowflake,
    Umbrella,
    Mountain,
    History,
    Compass,
    Building2,
    Bell,
    User as UserIcon,
    Heart,
    Gem,
    Trees,
    Car,
    Music,
    Thermometer,
    CloudRain,
    Anchor,
    Palmtree,
    Zap,
    Users,
    User,
    Briefcase,
    Ship,
    Camera
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Explore.css';

const Explore = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalResults, setTotalResults] = useState(0);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) setUser(userInfo);
    }, []);

    // Filters State
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        climate: '',
        rating: 0,
        budgetMax: 5000,
        sort: 'popularity',
        travelStyle: ''
    });

    const categories = [
        { id: 'Beach', icon: <Umbrella size={18} />, label: 'Beach' },
        { id: 'Hill', icon: <Mountain size={18} />, label: 'Hill' },
        { id: 'Historical', icon: <History size={18} />, label: 'Historical' },
        { id: 'Adventure', icon: <Compass size={18} />, label: 'Adventure' },
        { id: 'City', icon: <Building2 size={18} />, label: 'City' },
        { id: 'Wildlife', icon: <Trees size={18} />, label: 'Wildlife' },
        { id: 'Wellness', icon: <Heart size={18} />, label: 'Wellness' },
        { id: 'Luxury', icon: <Gem size={18} />, label: 'Luxury' },
        { id: 'Cultural', icon: <Music size={18} />, label: 'Cultural' },
        { id: 'RoadTrip', icon: <Car size={18} />, label: 'Road Trip' }
    ];

    const climates = [
        { id: 'Tropical', icon: <Sun size={16} />, label: 'Tropical & Warm' },
        { id: 'Moderate', icon: <Wind size={16} />, label: 'Moderate' },
        { id: 'Cold', icon: <Snowflake size={16} />, label: 'Cold & Snowy' },
        { id: 'Arid', icon: <Sun size={16} />, label: 'Arid (Desert)' },
        { id: 'Rainy', icon: <CloudRain size={16} />, label: 'Rainy' },
        { id: 'Coastal', icon: <Anchor size={16} />, label: 'Coastal' },
        { id: 'Arctic', icon: <Zap size={16} />, label: 'Arctic' },
        { id: 'Alpine', icon: <Mountain size={16} />, label: 'Alpine' },
        { id: 'Humid', icon: <Thermometer size={16} />, label: 'Humid' }
    ];

    const travelStyles = [
        { id: 'Solo', icon: <User size={16} />, label: 'Solo Traveler' },
        { id: 'Couple', icon: <Heart size={16} />, label: 'Couple' },
        { id: 'Family', icon: <Users size={16} />, label: 'Family' },
        { id: 'Business', icon: <Briefcase size={16} />, label: 'Business' },
        { id: 'Cruise', icon: <Ship size={16} />, label: 'Cruise' }
    ];

    const fetchDestinations = useCallback(async (isLoadMore = false) => {
        setLoading(true);
        try {
            const { search, category, climate, rating, budgetMax, sort, travelStyle } = filters;
            const currentPage = isLoadMore ? page + 1 : 1;

            const params = new URLSearchParams({
                page: currentPage,
                limit: 6,
                sort
            });

            if (search) params.append('search', search);
            if (category) params.append('category', category);
            if (climate) params.append('climate', climate);
            if (rating > 0) params.append('rating', rating);
            if (budgetMax < 5000) params.append('budgetMax', budgetMax);
            if (travelStyle) params.append('travelStyle', travelStyle);

            const res = await axios.get(`/api/destinations/explore?${params.toString()}`);

            if (isLoadMore) {
                setDestinations(prev => [...prev, ...res.data.destinations]);
            } else {
                setDestinations(res.data.destinations);
            }

            setTotalResults(res.data.totalResults);
            setHasMore(currentPage < res.data.totalPages);
            if (isLoadMore) setPage(currentPage);
            else setPage(1);

        } catch (err) {
            console.error('Error fetching destinations:', err);
        } finally {
            setLoading(false);
        }
    }, [filters, page]);

    useEffect(() => {
        fetchDestinations();
    }, [filters.category, filters.climate, filters.rating, filters.budgetMax, filters.sort, filters.travelStyle]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchDestinations();
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: prev[key] === value ? '' : value }));
    };

    return (
        <div className="explore-page">
            {/* Top Navbar */}
            <header className="explore-header">
                <div className="header-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <img src="/tripmate-logo.png" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
                    <span>Tripmate</span>
                </div>

                <form onSubmit={handleSearchSubmit} className="header-search">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Where do you want to go next?"
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    />
                </form>

                <div className="header-actions">
                    <button className="icon-btn"><Bell size={20} /></button>
                    <button className="profile-btn" onClick={() => navigate('/settings')}>
                        {user?.profilePicture ? (
                            <img src={user.profilePicture} alt="User" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                            <UserIcon size={20} />
                        )}
                    </button>
                </div>
            </header>

            <div className="explore-content">
                {/* Sidebar Filters */}
                <aside className="explore-sidebar">
                    <section className="filter-section">
                        <h4>DESTINATION TYPE</h4>
                        <div className="category-list">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    className={`category-item ${filters.category === cat.id ? 'active' : ''}`}
                                    onClick={() => handleFilterChange('category', cat.id)}
                                >
                                    {cat.icon}
                                    <span>{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="filter-section">
                        <h4>BUDGET RANGE</h4>
                        <div className="range-container">
                            <input
                                type="range"
                                min="500"
                                max="5000"
                                step="100"
                                value={filters.budgetMax}
                                onChange={(e) => setFilters(prev => ({ ...prev, budgetMax: e.target.value }))}
                                className="budget-range"
                            />
                            <div className="range-labels">
                                <span>$500</span>
                                <span>${filters.budgetMax}+</span>
                            </div>
                            <div className="budget-chips">
                                {[1000, 2000, 3000, 4000, 5000].map(val => (
                                    <button
                                        key={val}
                                        className={`budget-chip ${filters.budgetMax === val ? 'active' : ''}`}
                                        onClick={() => setFilters(prev => ({ ...prev, budgetMax: val }))}
                                    >
                                        <Gem size={12} />
                                        ${val}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="filter-section">
                        <h4>CLIMATE</h4>
                        <div className="climate-list">
                            {climates.map(cli => (
                                <label key={cli.id} className="climate-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={filters.climate === cli.id}
                                        onChange={() => handleFilterChange('climate', cli.id)}
                                    />
                                    <div className="custom-check"></div>
                                    {cli.icon}
                                    <span>{cli.label}</span>
                                </label>
                            ))}
                        </div>
                    </section>

                    <section className="filter-section">
                        <h4>RATING</h4>
                        <div className="rating-filter">
                            {[4.8, 4.5, 4.0, 3.5, 3.0, 2.0, 1.0].map(star => (
                                <button
                                    key={star}
                                    className={`rating-btn ${filters.rating === star ? 'active' : ''}`}
                                    onClick={() => handleFilterChange('rating', star)}
                                >
                                    <div className="stars">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={14}
                                                fill={i < Math.floor(star) ? "#00d2ff" : (i < star ? "url(#grad1)" : "none")}
                                                color={i < star ? "#00d2ff" : "#475569"}
                                            />
                                        ))}
                                    </div>
                                    <span>{star}+ stars</span>
                                </button>
                            ))}
                        </div>
                    </section>
                    <section className="filter-section">
                        <h4>TRAVEL STYLE</h4>
                        <div className="style-list">
                            {travelStyles.map(style => (
                                <button
                                    key={style.id}
                                    className={`style-item ${filters.travelStyle === style.id ? 'active' : ''}`}
                                    onClick={() => handleFilterChange('travelStyle', style.id)}
                                >
                                    {style.icon}
                                    <span>{style.label}</span>
                                </button>
                            ))}
                        </div>
                    </section>
                </aside>

                {/* Main Grid Section */}
                <main className="explore-main">
                    <div className="results-header">
                        <div className="header-text">
                            <h2>Recommended for You</h2>
                            <p>Based on your preferences and AI analysis</p>
                        </div>
                        <div className="sort-dropdown">
                            <span>Sort by AI Relevance</span>
                            <ChevronDown size={16} />
                            <select
                                value={filters.sort}
                                onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                            >
                                <option value="popularity">AI Relevance</option>
                                <option value="rating">Top Rated</option>
                                <option value="budget-low">Budget: Low to High</option>
                                <option value="budget-high">Budget: High to Low</option>
                            </select>
                        </div>
                    </div>

                    <div className="destinations-grid">
                        {destinations.map((dest) => (
                            <div key={dest._id} className="dest-card">
                                <div className="card-media" onClick={() => navigate(`/destination/${dest._id}`)} style={{ cursor: 'pointer' }}>
                                    <img
                                        src={dest.images?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000&auto=format&fit=crop'}
                                        alt={dest.name}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000&auto=format&fit=crop';
                                        }}
                                    />
                                    <div className="rating-badge">
                                        <Star size={12} fill="#fbbf24" color="#fbbf24" />
                                        <span>{dest.rating}</span>
                                    </div>
                                    {dest.rating >= 4.8 && <div className="trending-tag">TRENDING</div>}
                                </div>
                                <div className="card-info">
                                    <span className="dest-location">
                                        <MapPin size={14} /> {dest.city}, {dest.country}
                                    </span>
                                    <h3 onClick={() => navigate(`/destination/${dest._id}`)} style={{ cursor: 'pointer' }}>{dest.name}</h3>
                                    <p>{dest.description}</p>

                                    <div className="card-footer">
                                        <div className="price-info">
                                            <span className="price-label">EST. BUDGET</span>
                                            <span className="price-value">${dest.estimatedBudget.toLocaleString()}</span>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/destination/${dest._id}`)}
                                            className="view-btn"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {loading && (
                        <div className="loading-state">
                            <Loader2 className="animate-spin" size={32} color="#00d2ff" />
                            <span>Finding great destinations...</span>
                        </div>
                    )}

                    {!loading && hasMore && (
                        <div className="load-more-container">
                            <button onClick={() => fetchDestinations(true)} className="load-more-btn">
                                Load More AI Suggestions
                            </button>
                        </div>
                    )}

                    {!loading && destinations.length === 0 && (
                        <div className="empty-state">
                            <Compass size={48} color="#475569" />
                            <h3>No match found</h3>
                            <p>Try adjusting your filters to find your next adventure.</p>
                        </div>
                    )}
                </main>
            </div>

            <footer className="compact-footer">
                <div className="footer-left">
                    <div className="logo-circ small">
                        <Compass size={16} color="white" />
                    </div>
                    <span>AI Travel</span>
                </div>
                <p>© 2026 AI Travel. Your journey, perfectly predicted.</p>
                <div className="footer-right">
                    <Compass size={18} />
                    <Compass size={18} />
                    <Compass size={18} />
                </div>
            </footer>

            <svg width="0" height="0" className="hidden">
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="50%" style={{ stopColor: '#00d2ff', stopOpacity: 1 }} />
                        <stop offset="50%" style={{ stopColor: 'transparent', stopOpacity: 0 }} />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};

export default Explore;

