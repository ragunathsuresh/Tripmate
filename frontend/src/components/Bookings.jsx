import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
    Ticket,
    Hotel,
    Car,
    Plane,
    Calendar,
    MapPin,
    CreditCard,
    CheckCircle2,
    Clock,
    ChevronRight,
    Search,
    Filter,
    ArrowLeft,
    Compass,
    Navigation,
    Grid,
    Trophy,
    History,
    Settings,
    MoreVertical,
    Download,
    User
} from 'lucide-react';
import './Bookings.css';

const Bookings = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userInfo'));
        if (userData) {
            setUser(userData);
            fetchBookings();
        } else {
            navigate('/login');
        }
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            // For now, we fetch confirmed trips as "bookings"
            const res = await axios.get('/api/trips?status=upcoming', {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Transform trips into "Booking" objects or just use them
            // We'll add some mock booking details to each trip to make it look rich
            const enrichedBookings = res.data.map(trip => ({
                ...trip,
                bookingId: `BK-${trip.referenceId || trip._id.slice(-6).toUpperCase()}`,
                type: trip.status === 'confirmed' ? 'confirmed' : 'pending',
                flight: {
                    airline: 'Global Wings',
                    flightNo: 'GW-102',
                    class: 'Economy',
                    seat: '12B'
                },
                accommodation: {
                    name: `${trip.destination.name} Luxury Resort`,
                    room: 'Deluxe Sea View',
                    checkIn: trip.startDate
                }
            }));

            setBookings(enrichedBookings);
        } catch (err) {
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'confirmed': return 'status-confirmed';
            case 'pending': return 'status-pending';
            case 'cancelled': return 'status-cancelled';
            default: return 'status-default';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'TBD';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="bookings-page">
            {/* Sidebar (Consistent with MyTrips) */}
            <aside className="trips-sidebar">
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
                        <p>Premium Member</p>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/dashboard" className="nav-item">
                        <Grid size={20} /> Dashboard
                    </Link>
                    <Link to="/my-trips" className="nav-item">
                        <MapPin size={20} /> My Trips
                    </Link>
                    <Link to="/explore" className="nav-item">
                        <Compass size={20} /> Explore
                    </Link>
                    <Link to="/bookings" className="nav-item active">
                        <Trophy size={20} /> Bookings
                    </Link>
                    <Link to="/history" className="nav-item">
                        <History size={20} /> History
                    </Link>
                    <Link to="/settings" className="nav-item">
                        <Settings size={20} /> Settings
                    </Link>
                </nav>
            </aside>

            <main className="bookings-main">
                <header className="bookings-header">
                    <div>
                        <h1>My Bookings</h1>
                        <p>Manage your flight, hotel, and activity reservations</p>
                    </div>
                    <div className="search-box">
                        <Search size={18} />
                        <input type="text" placeholder="Search by destination or ID..." />
                    </div>
                </header>

                <div className="bookings-tabs">
                    <button
                        className={`bk-tab ${activeFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('all')}
                    >All Bookings</button>
                    <button
                        className={`bk-tab ${activeFilter === 'flight' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('flight')}
                    >Flights</button>
                    <button
                        className={`bk-tab ${activeFilter === 'hotel' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('hotel')}
                    >Accommodations</button>
                    <button
                        className={`bk-tab ${activeFilter === 'confirmed' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('confirmed')}
                    >Confirmed</button>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Retrieving your travel reservations...</p>
                    </div>
                ) : (
                    <div className="bookings-list">
                        {bookings.length > 0 ? (
                            bookings.map(booking => (
                                <div key={booking._id} className="booking-card">
                                    <div className="bk-card-main">
                                        <div className="bk-info-section">
                                            <div className="bk-id-row">
                                                <span className={`bk-status ${getStatusStyle(booking.type)}`}>
                                                    {booking.type === 'confirmed' ? (
                                                        <><CheckCircle2 size={14} /> Confirmed</>
                                                    ) : (
                                                        <><Clock size={14} /> Pending Payment</>
                                                    )}
                                                </span>
                                                <span className="bk-id">#{booking.bookingId}</span>
                                            </div>
                                            <h3>{booking.destination.name}, {booking.destination.country}</h3>
                                            <div className="bk-meta-row">
                                                <div className="meta-item">
                                                    <Calendar size={16} />
                                                    <span>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
                                                </div>
                                                <div className="meta-item">
                                                    <MapPin size={16} />
                                                    <span>{booking.destination.city}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bk-details-section">
                                            <div className="detail-item">
                                                <div className="item-head">
                                                    <Plane size={18} />
                                                    <span>FLIGHT</span>
                                                </div>
                                                <div className="item-body">
                                                    <h4>{booking.flight.airline}</h4>
                                                    <p>{booking.flight.flightNo} • {booking.flight.class} • Seat {booking.flight.seat}</p>
                                                </div>
                                            </div>
                                            <div className="vertical-divider"></div>
                                            <div className="detail-item">
                                                <div className="item-head">
                                                    <Hotel size={18} />
                                                    <span>STAY</span>
                                                </div>
                                                <div className="item-body">
                                                    <h4>{booking.accommodation.name}</h4>
                                                    <p>{booking.accommodation.room}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bk-action-section">
                                            <div className="price-tag">
                                                <span>Total Cost</span>
                                                <h4>${booking.destination.estimatedBudget?.toLocaleString()}</h4>
                                            </div>
                                            <button className="btn-view-receipt" onClick={() => navigate(`/itinerary/${booking._id}`)}>
                                                View Itinerary
                                            </button>
                                            <button className="btn-manage-bk">
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bk-card-footer">
                                        <div className="notice">
                                            <Clock size={14} />
                                            <span>Free cancellation until {formatDate(new Date(new Date(booking.startDate).getTime() - 48 * 60 * 60 * 1000))}</span>
                                        </div>
                                        <div className="footer-links">
                                            <button className="f-link"><Download size={14} /> Ticket</button>
                                            <button className="f-link"><Download size={14} /> Invoice</button>
                                            <button className="f-link primary">Modify Trip</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-bookings">
                                <Trophy size={60} color="#e2e8f0" />
                                <h3>No active bookings found</h3>
                                <p>Plan a trip and confirm your itinerary to see your reservations here.</p>
                                <button className="btn-browse" onClick={() => navigate('/explore')}>Browse Destinations</button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Bookings;
