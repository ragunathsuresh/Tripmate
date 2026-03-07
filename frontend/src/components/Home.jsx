import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
    PlaneTakeoff,
    MapPin,
    Search,
    Star,
    ArrowRight,
    Settings,
    Trophy,
    Map as MapIcon,
    Phone,
    Mail,
    Facebook,
    Twitter,
    Instagram,
    Linkedin
} from 'lucide-react';
import './Home.css';

const Home = () => {
    const [featured, setFeatured] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/destinations/featured');
                setFeatured(res.data);
            } catch (err) {
                console.error('Error fetching featured destinations:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatured();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="home-container">
            {/* Navbar */}
            <nav className="navbar">
                <Link to="/" className="nav-logo">
                    <PlaneTakeoff color="#00d2ff" />
                    <span>AI Travel</span>
                </Link>
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/explore">Destinations</Link>
                    <Link to="/planner">AI Planner</Link>
                    <Link to="/my-trips">My Trips</Link>
                    <Link to="/history">History</Link>
                    <Link to="/about">About</Link>
                </div>
                <div className="nav-auth">
                    <Link to="/login" className="btn-login-nav">Login</Link>
                    <Link to="/register" className="btn-register-nav">Register</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Plan Your Perfect Trip with <span>AI Intelligence</span></h1>
                    <p>Stop spending hours browsing tabs. Get personalized, day-by-day itineraries tailored to your unique travel style in seconds.</p>

                    <form onSubmit={handleSearch} className="search-container">
                        <div className="search-input-wrapper">
                            <MapPin className="search-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Where are you going?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn-search">
                            <span>Explore Destinations</span>
                            <Search size={18} />
                        </button>
                    </form>
                </div>
            </section>

            {/* Featured Destinations */}
            <section className="featured">
                <div className="section-header">
                    <div>
                        <h2>Featured Destinations</h2>
                        <p>Hand-picked locations loved by our global community.</p>
                    </div>
                    <Link to="/explore" className="view-all">
                        View all destinations <ArrowRight size={18} />
                    </Link>
                </div>

                <div className="destinations-grid">
                    {loading ? (
                        <div className="loading-placeholder">Loading magic destinations...</div>
                    ) : (
                        featured.map((dest) => (
                            <div key={dest._id} className="destination-card">
                                <div className="card-image">
                                    <img src={dest.images[0]} alt={dest.name} />
                                    <div className="card-rating">
                                        <Star className="star-icon" size={14} fill="#fbbf24" />
                                        <span>{dest.rating}</span>
                                    </div>
                                </div>
                                <div className="card-content">
                                    <h3>{dest.name}</h3>
                                    <p>{dest.description}</p>
                                    <Link to={`/destination/${dest._id}`} className="view-details">
                                        Explore Now
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works">
                <h2>How AI Works</h2>
                <p className="subtitle">Our engine processes millions of travel data points to curate your dream journey.</p>

                <div className="steps-container">
                    <div className="step-card">
                        <div className="step-icon-wrapper">
                            <Settings color="white" />
                        </div>
                        <h3>1. Enter Preferences</h3>
                        <p>Tell us your interests, budget, and dates. Whether you're a foodie or a hiker, we listen.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-icon-wrapper">
                            <Trophy color="white" />
                        </div>
                        <h3>2. Get AI Insights</h3>
                        <p>Our AI analyzes thousands of flights, hotels, and attractions to find your perfect matches.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-icon-wrapper">
                            <MapIcon color="white" />
                        </div>
                        <h3>3. Generate Itinerary</h3>
                        <p>Receive a complete, day-by-day interactive schedule ready for your next big adventure.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-grid">
                    <div className="footer-info">
                        <div className="footer-logo">
                            <PlaneTakeoff color="#00d2ff" />
                            <span>AI Travel</span>
                        </div>
                        <p className="footer-desc">
                            Redefining travel planning through the power of artificial intelligence. Discover, plan, and go.
                        </p>
                        <div className="social-links" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <Twitter size={20} className="social-icon" />
                            <Facebook size={20} className="social-icon" />
                            <Instagram size={20} className="social-icon" />
                            <Linkedin size={20} className="social-icon" />
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>Explore</h4>
                        <ul>
                            <li><Link to="/explore">Popular Destinations</Link></li>
                            <li><Link to="/explore">All Itineraries</Link></li>
                            <li><Link to="/guides">Travel Guides</Link></li>
                            <li><Link to="/community">Our Community</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Company</h4>
                        <ul>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/careers">Careers</Link></li>
                            <li><Link to="/blog">Blog</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Contact Us</h4>
                        <ul>
                            <li><a href="mailto:support@aitravel.com" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} /> support@aitravel.com</a></li>
                            <li><a href="tel:+15551234567" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={16} /> +1 (555) 123-4567</a></li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}><MapPin size={16} /> 123 AI Plaza, San Francisco, CA</li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2026 AI Travel Planner. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                        <Link to="/cookies">Cookie Settings</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
