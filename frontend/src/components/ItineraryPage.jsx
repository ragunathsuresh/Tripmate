import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
    Calendar,
    Users,
    Map as MapIcon,
    Clock,
    MapPin,
    Star,
    Plus,
    RefreshCw,
    Trash2,
    Edit3,
    Utensils,
    Camera,
    Compass,
    Loader2,
    CheckCircle2,
    ArrowLeft,
    Share2,
    Heart,
    Download
} from 'lucide-react';
import './ItineraryPage.css';

const ItineraryPage = () => {
    const { tripId } = useParams();
    const [itinerary, setItinerary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeDay, setActiveDay] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [regenerating, setRegenerating] = useState(false);
    const [newActivity, setNewActivity] = useState({
        activityTitle: '',
        location: '',
        time: '',
        duration: '',
        notes: '',
        type: 'custom'
    });

    useEffect(() => {
        fetchItinerary();
    }, [tripId]);

    const fetchItinerary = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`/api/itinerary/${tripId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setItinerary(res.data);
            if (res.data.days.length > 0) {
                setActiveDay(res.data.days[0].dayNumber);
            }
        } catch (err) {
            console.error('Error fetching itinerary:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerateDay = async () => {
        setRegenerating(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`/api/itinerary/regenerate-day`,
                { tripId, dayNumber: activeDay },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setItinerary(res.data);
        } catch (err) {
            console.error('Error regenerating day:', err);
        } finally {
            setRegenerating(false);
        }
    };

    const handleAddActivity = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`/api/itinerary/add-activity`,
                { ...newActivity, tripId, dayNumber: activeDay },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setItinerary(res.data);
            setShowModal(false);
            setNewActivity({
                activityTitle: '',
                location: '',
                time: '',
                duration: '',
                notes: '',
                type: 'custom'
            });
        } catch (err) {
            console.error('Error adding activity:', err);
        }
    };

    const handleDeleteActivity = async (activityId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.delete(`/api/itinerary/delete-activity`, {
                headers: { Authorization: `Bearer ${token}` },
                data: { tripId, dayNumber: activeDay, activityId }
            });
            setItinerary(res.data);
        } catch (err) {
            console.error('Error deleting activity:', err);
        }
    };

    if (loading) return (
        <div className="planner-loading-state">
            <Loader2 className="animate-spin" size={48} color="#00d2ff" />
            <p>Gathering your travel details...</p>
        </div>
    );

    if (!itinerary) return <div className="details-error">Itinerary not found.</div>;

    const currentDayData = itinerary.days.find(d => d.dayNumber === activeDay);

    return (
        <div className="itinerary-page">
            <header className="itinerary-header">
                <div className="itin-logo">
                    <Compass size={24} color="#00d2ff" />
                    <span>AI Travel Planner</span>
                </div>
                <div className="itin-actions">
                    <button className="btn-header-action outline"><Edit3 size={16} /> Edit</button>
                    <button className="btn-header-action outline"><Heart size={16} /> Save</button>
                    <button className="btn-header-action primary"><Download size={16} /> Export</button>
                    <div className="user-profile-mini">
                        <img src="https://i.pravatar.cc/150?u=traveler" alt="User" />
                    </div>
                </div>
            </header>

            <main className="itin-main">
                <div className="trip-summary-header">
                    <div className="breadcrumb">My Trips • {itinerary.destination.country}</div>
                    <div className="trip-title-row">
                        <h1>{itinerary.destination.name} Explorer</h1>
                        <button className="btn-map-toggle"><MapIcon size={18} /> Interactive Map</button>
                    </div>
                    <div className="trip-meta-info">
                        <div className="meta-item"><Calendar size={18} /> {itinerary.days.length} Days</div>
                        <div className="meta-item"><Users size={18} /> Group Trip</div>
                        <div className="meta-item"><Compass size={18} /> {itinerary.destination.category}</div>
                    </div>
                </div>

                <div className="day-tabs-container">
                    {itinerary.days.map(day => (
                        <div
                            key={day.dayNumber}
                            className={`day-tab ${activeDay === day.dayNumber ? 'active' : ''}`}
                            onClick={() => setActiveDay(day.dayNumber)}
                        >
                            <span className="label">DAY</span>
                            <span className="number">{day.dayNumber < 10 ? `0${day.dayNumber}` : day.dayNumber}</span>
                        </div>
                    ))}
                </div>

                {currentDayData && (
                    <div className="daily-content">
                        {/* Morning Section */}
                        <div className="itinerary-section">
                            <div className="section-head">
                                <div className="time-circle">1</div>
                                <h2>Morning: Cultural Start</h2>
                                <p>Start your journey with local traditions and sights.</p>
                            </div>
                            <div className="activities-grid">
                                {currentDayData.activities.filter(a => a.time.includes('AM') || a.time.includes('Morning')).map((act, i) => (
                                    <div key={i} className="itin-activity-card">
                                        <div className="itin-card-img">
                                            <img src={`https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=400`} alt={act.activity} />
                                            <div className="card-time-badge">{act.time}</div>
                                        </div>
                                        <div className="itin-card-content">
                                            <span className="card-type-tag">{act.type}</span>
                                            <h3>{act.activity}</h3>
                                            <p>{act.description || 'Experience the essence of this location.'}</p>
                                            <div className="card-footer-meta">
                                                <span><Clock size={14} /> {act.duration || '2 Hours'}</span>
                                                <span><MapPin size={14} /> {act.location || itinerary.destination.city}</span>
                                                <button onClick={() => handleDeleteActivity(act._id)} className="btn-delete-act"><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Afternoon Section - Specialized Card */}
                        <div className="itinerary-section">
                            <div className="section-head">
                                <div className="time-circle">2</div>
                                <h2>Afternoon: Exploration</h2>
                            </div>
                            {currentDayData.activities.filter(a => a.time.includes('PM') && !a.time.includes('07') && !a.time.includes('08') && !a.time.includes('09')).map((act, i) => (
                                <div key={i} className="food-suggestion-card">
                                    <div className="food-img">
                                        <img src={`https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=600`} alt="Food" />
                                    </div>
                                    <div className="food-info">
                                        <div className="label-row">
                                            <span className="food-tag"><Utensils size={14} /> SUGGESTION</span>
                                            <span className="star-rating"><Star size={14} fill="#fbbf24" color="#fbbf24" /> 4.8</span>
                                        </div>
                                        <h3>{act.activity}</h3>
                                        <p>{act.description || 'Savor the local flavors at one of the best spots in town.'}</p>
                                        <div className="food-stats">
                                            <div className="stat-box">
                                                <h4>PRICE RANGE</h4>
                                                <p>$$ - Moderate</p>
                                            </div>
                                            <div className="stat-box">
                                                <h4>SPECIALTY</h4>
                                                <p>Local Delicacy</p>
                                            </div>
                                        </div>
                                        <button className="btn-reserve">View Options</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Evening Section */}
                        <div className="itinerary-section">
                            <div className="section-head">
                                <div className="time-circle">3</div>
                                <h2>Evening: Nightlife</h2>
                            </div>
                            <div className="nightlife-banner">
                                <img src="https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=1200" alt="Nightlife" />
                                <div className="banner-content">
                                    <h3>City Lights & Experiences</h3>
                                    <div className="banner-activities">
                                        {currentDayData.activities.filter(a => a.time.includes('07') || a.time.includes('08') || a.time.includes('09') || a.time.includes('Evening')).map((act, i) => (
                                            <div key={i} className="sub-act">
                                                <div className="act-details">
                                                    <h4>{act.activity}</h4>
                                                    <p>{act.time} • {act.location}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="itin-bottom-cta">
                            <div className="cta-icon-box">
                                <RefreshCw size={32} color="#00d2ff" />
                            </div>
                            <h2>Want to change something?</h2>
                            <p>Our AI can instantly recalculate your day based on your mood or weather changes.</p>
                            <div className="cta-btns">
                                <button onClick={handleRegenerateDay} className="btn-regen" disabled={regenerating}>
                                    {regenerating ? <Loader2 className="animate-spin" size={20} /> : `Regenerate Day ${activeDay}`}
                                </button>
                                <button onClick={() => setShowModal(true)} className="btn-custom">Add Custom Activity</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Add New Activity</h2>
                        <form onSubmit={handleAddActivity}>
                            <div className="form-group">
                                <label>ACTIVITY TITLE</label>
                                <input
                                    type="text"
                                    required
                                    value={newActivity.activityTitle}
                                    onChange={e => setNewActivity({ ...newActivity, activityTitle: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>LOCATION</label>
                                <input
                                    type="text"
                                    value={newActivity.location}
                                    onChange={e => setNewActivity({ ...newActivity, location: e.target.value })}
                                />
                            </div>
                            <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>TIME</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 10:00 AM"
                                        value={newActivity.time}
                                        onChange={e => setNewActivity({ ...newActivity, time: e.target.value })}
                                    />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>DURATION</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 1.5 Hours"
                                        value={newActivity.duration}
                                        onChange={e => setNewActivity({ ...newActivity, duration: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>NOTES</label>
                                <textarea
                                    value={newActivity.notes}
                                    onChange={e => setNewActivity({ ...newActivity, notes: e.target.value })}
                                />
                            </div>
                            <div className="modal-btns">
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-submit">Add to Itinerary</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItineraryPage;

