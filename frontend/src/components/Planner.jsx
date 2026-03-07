import React, { useState } from 'react';
import axios from 'axios';
import {
    Compass,
    Calendar,
    Zap,
    Users,
    MapPin,
    Star,
    ChevronDown,
    LayoutGrid,
    Map as MapIcon,
    Loader2,
    CheckCircle2,
    Plane,
    Clock,
    Briefcase
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import './Planner.css';

const Planner = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const [prefs, setPrefs] = useState({
        destinationType: 'Beach',
        durationDays: 7,
        budgetLevel: 'Comfort',
        interests: ['Nature', 'Culture'],
        travelStyle: 'Solo',
        climatePreference: 'Tropical'
    });

    const categories = ['Beach', 'Mountain', 'City', 'Historical', 'Adventure', 'Hill'];
    const budgetLevels = ['Economy', 'Comfort', 'Luxury'];
    const allInterests = ['Nature', 'Adventure', 'Culture', 'Relaxation', 'Food', 'Nightlife'];
    const styles = ['Solo', 'Couple', 'Family', 'Group'];
    const climates = ['Tropical', 'Moderate', 'Cold'];

    const handleInterestToggle = (interest) => {
        setPrefs(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    const handleGenerate = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please login to use the AI Planner.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await axios.post(
                '/api/trips/generate',
                prefs,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setResult(res.data);
        } catch (err) {
            const msg = err.response?.data?.error ? `${err.response.data.message}: ${err.response.data.error}` : (err.response?.data?.message || 'Failed to generate itinerary. Try adjusting your filters.');
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="planner-page">
            <header className="planner-header">
                <div className="planner-logo">
                    <div className="logo-icon-box">
                        <Compass size={24} color="white" />
                    </div>
                    <span>TripAI</span>
                </div>
                <nav className="planner-nav">
                    <Link to="/explore">Explore</Link>
                    <Link to="/my-trips">My Trips</Link>
                    <div className="user-avatar-mini">
                        <Users size={18} />
                    </div>
                </nav>
            </header>

            <main className="planner-main">
                <div className="planner-intro">
                    <h1>Plan Your Dream Escape</h1>
                    <p>Our AI understands your soul's desire for travel. Define your vibe, and let us handle the itinerary.</p>
                </div>

                <div className="planner-layout">
                    {/* Left: Preferences Sidebar */}
                    <aside className="prefs-sidebar">
                        <div className="prefs-card">
                            <div className="prefs-section-title">
                                <Zap size={18} color="#00d2ff" />
                                <h3>Travel Preferences</h3>
                            </div>

                            <div className="pref-group">
                                <label>DESTINATION TYPE</label>
                                <div className="custom-select-wrapper">
                                    <select
                                        value={prefs.destinationType}
                                        onChange={(e) => setPrefs({ ...prefs, destinationType: e.target.value })}
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <ChevronDown size={16} className="sel-arrow" />
                                </div>
                            </div>

                            <div className="pref-group">
                                <div className="label-row">
                                    <label>DURATION (DAYS)</label>
                                    <span className="duration-val">{prefs.durationDays} Days</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="30"
                                    value={prefs.durationDays}
                                    onChange={(e) => setPrefs({ ...prefs, durationDays: e.target.value })}
                                    className="duration-slider"
                                />
                            </div>

                            <div className="pref-group">
                                <label>BUDGET RANGE</label>
                                <div className="budget-segments">
                                    {budgetLevels.map(b => (
                                        <button
                                            key={b}
                                            className={`segment-btn ${prefs.budgetLevel === b ? 'active' : ''}`}
                                            onClick={() => setPrefs({ ...prefs, budgetLevel: b })}
                                        >
                                            {b}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pref-group">
                                <label>INTERESTS</label>
                                <div className="interests-cloud">
                                    {allInterests.map(i => (
                                        <button
                                            key={i}
                                            className={`interest-chip ${prefs.interests.includes(i) ? 'active' : ''}`}
                                            onClick={() => handleInterestToggle(i)}
                                        >
                                            {i}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pref-row">
                                <div className="pref-group half">
                                    <label>STYLE</label>
                                    <div className="custom-select-wrapper">
                                        <select
                                            value={prefs.travelStyle}
                                            onChange={(e) => setPrefs({ ...prefs, travelStyle: e.target.value })}
                                        >
                                            {styles.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <ChevronDown size={14} className="sel-arrow" />
                                    </div>
                                </div>
                                <div className="pref-group half">
                                    <label>CLIMATE</label>
                                    <div className="custom-select-wrapper">
                                        <select
                                            value={prefs.climatePreference}
                                            onChange={(e) => setPrefs({ ...prefs, climatePreference: e.target.value })}
                                        >
                                            {climates.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                        <ChevronDown size={14} className="sel-arrow" />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleGenerate}
                                className="btn-generate-plan"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <Zap size={18} fill="white" />
                                        <span>Generate AI Trip Plan</span>
                                    </>
                                )}
                            </button>
                            {error && <p className="planner-error">{error}</p>}
                        </div>
                    </aside>

                    {/* Right: Results Content */}
                    <section className="planner-results">
                        <div className="results-toolbar">
                            <h3>Recommended for You</h3>
                            <div className="view-toggle">
                                <button className="active"><LayoutGrid size={18} /></button>
                                <button><MapIcon size={18} /></button>
                            </div>
                        </div>

                        {!result && !loading && (
                            <div className="empty-results-grid">
                                <div className="add-dream-card">
                                    <div className="plus-icon-circ">
                                        <CheckCircle2 size={24} color="#00d2ff" />
                                    </div>
                                    <h4>Not seeing your dream?</h4>
                                    <p>Refine your preferences or search for a specific region.</p>
                                </div>
                            </div>
                        )}

                        {loading && (
                            <div className="planner-loading-state">
                                <Loader2 className="animate-spin" size={40} color="#00d2ff" />
                                <h3>Curating Your Perfect Itinerary...</h3>
                                <p>Our AI is analyzing thousands of activities for the best match.</p>
                            </div>
                        )}

                        {result && (
                            <div className="itinerary-result-card">
                                <div className="result-header-media">
                                    <img src={result.destination.images[0]} alt={result.destination.name} />
                                    <div className="match-score">98% Match</div>
                                </div>
                                <div className="result-details">
                                    <div className="result-title-row">
                                        <div>
                                            <h2>{result.destination.name}</h2>
                                            <span className="res-loc"><MapPin size={14} /> {result.destination.city}, {result.destination.country}</span>
                                        </div>
                                        <div className="res-cost">
                                            <span className="cost-val">${result.destination.estimatedBudget.toLocaleString()}</span>
                                            <span className="cost-lbl">EST. COST</span>
                                        </div>
                                    </div>

                                    <div className="res-tags">
                                        <span className="res-tag">{prefs.travelStyle.toUpperCase()}</span>
                                        <span className="res-tag">{prefs.climatePreference.toUpperCase()}</span>
                                    </div>

                                    <div className="itinerary-preview">
                                        <h3>Day-by-Day Journey</h3>
                                        <div className="itinerary-list">
                                            {result.itinerary.days.map(day => (
                                                <div key={day.dayNumber} className="itinerary-day-row">
                                                    <div className="day-num-box">Day {day.dayNumber}</div>
                                                    <div className="day-activities-mini">
                                                        {day.activities.map((act, i) => (
                                                            <div key={i} className="mini-act">
                                                                <span className="act-time">{act.time}</span>
                                                                <span className="act-name">{act.activity}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/itinerary/${result.trip._id}`)}
                                        className="btn-view-full-itinerary"
                                    >
                                        View Full Itinerary
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <footer className="planner-footer-bottom">
                <div className="f-left">
                    <Compass size={18} color="#00d2ff" />
                    <span>TripAI © 2026 AI Travel Planner Inc.</span>
                </div>
                <div className="f-center">
                    <span>Privacy</span>
                    <span>Terms</span>
                    <span>Support</span>
                </div>
                <div className="f-right">
                    <LayoutGrid size={18} />
                    <Calendar size={18} />
                </div>
            </footer>
        </div>
    );
};

export default Planner;

