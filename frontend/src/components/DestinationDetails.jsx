import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    MapPin,
    Star,
    Calendar,
    DollarSign,
    Utensils,
    Trees,
    Compass,
    Camera,
    Share2,
    Heart,
    ArrowLeft,
    Info,
    Map as MapIcon,
    PlusCircle,
    CheckCircle2,
    Loader2,
    Zap,
    User
} from 'lucide-react';
import './DestinationDetails.css';

const DestinationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [destination, setDestination] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDestination = async () => {
            try {
                const res = await axios.get(`/api/destinations/${id}`);
                setDestination(res.data);

                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (userInfo) {
                    const userRes = await axios.get('/api/users/profile', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    setUser(userRes.data);
                }

                // Record history if user is logged in
                const token = localStorage.getItem('token');
                if (token) {
                    await axios.post('/api/history/view',
                        { destinationId: id },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                }
            } catch (err) {
                console.error('Error fetching destination details:', err);
                setError('Failed to load destination details.');
            } finally {
                setLoading(false);
            }
        };

        fetchDestination();
    }, [id]);

    const addToTrip = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        setAdding(true);
        try {
            const res = await axios.post(
                '/api/trips/add-destination',
                { destinationId: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setSuccess('Successfully added to your Trip Planner!');
                setTimeout(() => {
                    navigate('/dashboard'); // Taking user to dashboard/planner as requested
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add to trip planner.');
        } finally {
            setAdding(false);
        }
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'food': return <Utensils size={20} />;
            case 'nature': return <Trees size={20} />;
            case 'adventure': return <Compass size={20} />;
            case 'sightseeing': return <Camera size={20} />;
            default: return <Info size={20} />;
        }
    };

    if (loading) return (
        <div className="details-loader">
            <div className="loader-content">
                <Loader2 className="animate-spin" size={48} color="#00d2ff" />
                <p>Gathering travel insights...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="details-error-page">
            <div className="error-content">
                <Compass size={60} color="#ef4444" />
                <h2>Oops! Adventure not found</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/explore')} className="btn-back-explore">
                    Back to Destinations
                </button>
            </div>
        </div>
    );

    if (!destination) return (
        <div className="details-error-page">
            <div className="error-content">
                <Compass size={60} color="#94a3b8" />
                <h2>Destination not found</h2>
                <p>We couldn't find the travel details you're looking for.</p>
                <button onClick={() => navigate('/explore')} className="btn-back-explore">
                    Back to Destinations
                </button>
            </div>
        </div>
    );

    return (
        <div className="details-page">
            <header className="details-header">
                <div className="header-left">
                    <button onClick={() => navigate(-1)} className="back-btn">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="mini-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        <img src="/tripmate-logo.png" alt="Logo" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
                        <span>Tripmate</span>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="action-circle"><Share2 size={18} /></button>
                    <button className="action-circle"><Heart size={18} /></button>
                    <div className="user-profile-mini">
                        {user?.profilePicture ? (
                            <img src={user.profilePicture} alt="User" />
                        ) : (
                            <div className="user-avatar-placeholder" style={{ width: '32px', height: '32px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={16} color="#64748b" />
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="details-container">
                {/* Hero Section */}
                <section className="details-hero">
                    <img
                        src={destination.images?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop'}
                        alt={destination.name}
                        className="hero-img"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop';
                        }}
                    />
                    <div className="hero-overlay">
                        <div className="tag-row">
                            <span className="hero-tag coastal">{destination.category?.toUpperCase() || 'COASTAL'}</span>
                            <span className="hero-tag luxury">{destination.travelStyle?.toUpperCase() || 'LUXURY'}</span>
                        </div>
                        <h1>{destination?.name}</h1>
                        <div className="hero-location">
                            <MapPin size={18} />
                            <span>{destination?.city}, {destination?.country}</span>
                        </div>
                    </div>
                    <div className="hero-stats">
                        <div className="stat-main">
                            <span className="stat-val">{destination.rating}</span>
                            <span className="stat-label">RATING</span>
                        </div>
                        <div className="stat-avatars">
                            <img src="https://i.pravatar.cc/150?u=1" alt="u1" />
                            <img src="https://i.pravatar.cc/150?u=2" alt="u2" />
                            <div className="avatar-more">+2k</div>
                        </div>
                    </div>
                </section>

                <div className="details-grid">
                    <div className="details-left">
                        <section className="about-section">
                            <h2><Info size={22} color="#00d2ff" /> About this destination</h2>
                            <p>{destination.description}</p>
                        </section>

                        <div className="quick-info-grid">
                            <div className="info-card">
                                <div className="info-icon green">
                                    <Calendar size={22} />
                                </div>
                                <div className="info-text">
                                    <h4>Best Time to Visit</h4>
                                    <p className="highlight">{destination.bestTimeToVisit}</p>
                                    <p className="subtext">Perfect weather and fewer crowds than peak season.</p>
                                </div>
                            </div>
                            <div className="info-card">
                                <div className="info-icon blue">
                                    <DollarSign size={22} />
                                </div>
                                <div className="info-text">
                                    <h4>Estimated Cost</h4>
                                    <p className="highlight">
                                        ${(destination?.estimatedCostPerDay || 200) - 100} - ${(destination?.estimatedCostPerDay || 200) + 150} / day
                                    </p>
                                    <p className="subtext">Premium destination with luxury dining and stays.</p>
                                </div>
                            </div>
                        </div>

                        <section className="activities-section">
                            <h2>Recommended Activities</h2>
                            <div className="activities-grid">
                                {destination.activities && destination.activities.map((act, idx) => (
                                    <div key={idx} className="activity-card">
                                        <div className={`activity-icon-box ${act.type}`}>
                                            {getActivityIcon(act.type)}
                                        </div>
                                        <div className="activity-info">
                                            <h4>{act.title}</h4>
                                            <p>{act.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="package-preview-section">
                            <div className="section-title-row">
                                <h2><Zap size={22} color="#00d2ff" /> AI Sample Package</h2>
                                <span className="package-badge">3 Days / 2 Nights</span>
                            </div>
                            <div className="package-itinerary">
                                <div className="itinerary-day">
                                    <div className="day-header">Day 1: Arrival & Exploration</div>
                                    <ul className="day-stops">
                                        <li><span>09:00 AM</span> Check-in to your {destination?.travelStyle || 'Suite'}</li>
                                        <li><span>01:00 PM</span> Local lunch at {destination?.city || 'the'} harbor</li>
                                        <li><span>03:00 PM</span> {destination?.activities?.[0]?.title || 'Sightseeing Tour'}</li>
                                    </ul>
                                </div>
                                <div className="itinerary-day">
                                    <div className="day-header">Day 2: Deep Dive Adventure</div>
                                    <ul className="day-stops">
                                        <li><span>10:00 AM</span> {destination?.activities?.[1]?.title || 'Main Attraction'}</li>
                                        <li><span>02:00 PM</span> Cultural workshop and local craft</li>
                                        <li><span>07:00 PM</span> Traditional dinner and live music</li>
                                    </ul>
                                </div>
                                <div className="itinerary-day">
                                    <div className="day-header">Day 3: Relaxation & Departure</div>
                                    <ul className="day-stops">
                                        <li><span>08:00 AM</span> Morning yoga or coastal walk</li>
                                        <li><span>11:00 AM</span> Souvenir shopping in central {destination?.city || 'market'}</li>
                                        <li><span>04:00 PM</span> Transfer to airport</li>
                                    </ul>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="details-right">
                        <div className="planner-sticky-card">
                            <h3>Ready to explore?</h3>
                            <p>Let our AI build the perfect itinerary for your trip to {destination.name}.</p>

                            {success && (
                                <div className="alert-success-mini">
                                    <CheckCircle2 size={16} />
                                    <span>{success}</span>
                                </div>
                            )}

                            {error && (
                                <div className="alert-error-mini">
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                onClick={addToTrip}
                                className="btn-add-planner"
                                disabled={adding}
                            >
                                {adding ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <PlusCircle size={20} />
                                        <span>Add to Trip Planner</span>
                                    </>
                                )}
                            </button>
                            <p className="planner-footer">Join 12,000+ travelers planning here</p>
                        </div>

                        {destination?.coordinates?.lat && destination?.coordinates?.lng && (
                            <div className="map-preview">
                                <div className="map-placeholder">
                                    <img src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+ff0000(${destination.coordinates.lng},${destination.coordinates.lat})/${destination.coordinates.lng},${destination.coordinates.lat},12,0/600x400?access_token=pk.eyJ1Ijoiam9obmRvZSIsImEiOiJjbDFhMmIzYjRjMGNkejFvMTFvMTFvMTFvMTF0In0=`} alt="Map" />
                                    <div className="map-overlay">
                                        <MapIcon size={20} />
                                        <span>Interactive Map</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="tags-cloud">
                            <span className="tag">#{destination.country}</span>
                            <span className="tag">#Summer2026</span>
                            <span className="tag">#Honeymoon</span>
                            <span className="tag">#Mediterranean</span>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="details-footer">
                <div className="footer-mini-logo">
                    <Compass size={20} color="#00d2ff" />
                    <span>AI Travel © 2026</span>
                </div>
                <div className="footer-nav">
                    <span>Destinations</span>
                    <span>Planner</span>
                    <span>Hotels</span>
                    <span>Pricing</span>
                </div>
            </footer>
        </div>
    );
};

export default DestinationDetails;

