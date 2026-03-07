import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    MoreVertical,
    MapPin,
    Star,
    ChevronLeft,
    ChevronRight,
    Filter,
    X,
    LayoutDashboard,
    Compass,
    Calendar,
    Users,
    PieChart,
    Settings,
    HelpCircle,
    Plane,
    Image as ImageIcon,
    Target,
    Activity,
    Eye,
    EyeOff,
    Loader2
} from 'lucide-react';
import './AdminDestinations.css';

const AdminDestinations = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [destinations, setDestinations] = useState([]);
    const [stats, setStats] = useState({ totalDestinations: 0, avgRating: 0, missingMedia: 0 });
    const [filters, setFilters] = useState({ search: '', category: 'All', status: 'All' });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [editingDest, setEditingDest] = useState(null);
    const [admin, setAdmin] = useState(null);

    const [form, setForm] = useState({
        name: '', country: '', city: '', category: 'City', description: '',
        rating: 4.5, estimatedBudget: 2500, estimatedCostPerDay: 250,
        bestTimeToVisit: '', images: [''], climate: 'Moderate',
        coordinates: { lat: 0, lng: 0 },
        activities: [{ title: '', description: '', type: 'sightseeing' }]
    });

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = localStorage.getItem('token');
        if (!userInfo || !token || userInfo.role !== 'admin') {
            navigate('/admin/login');
            return;
        }
        setAdmin(userInfo);
        fetchDestinations();
    }, [page, filters.category, filters.status]);

    const fetchDestinations = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/admin/destinations?page=${page}&search=${filters.search}&category=${filters.category}&status=${filters.status}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDestinations(res.data.destinations);
            setStats(res.data.stats);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error('Error fetching destinations:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchDestinations();
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'hidden' : 'active';
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/admin/destinations/${id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setDestinations(destinations.map(d => d._id === id ? { ...d, status: newStatus } : d));
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this destination?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/admin/destinations/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchDestinations();
        } catch (err) {
            alert('Delete failed');
        }
    };

    const handleEdit = (dest) => {
        setEditingDest(dest);
        setForm(dest);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            if (editingDest) {
                await axios.put(`http://localhost:5000/api/admin/destinations/${editingDest._id}`, form, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('http://localhost:5000/api/admin/destinations', form, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setShowModal(false);
            setEditingDest(null);
            fetchDestinations();
        } catch (err) {
            alert('Operation failed');
        }
    };

    const handleFormChange = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const categories = ['All', 'Beach', 'Mountain', 'City', 'Adventure', 'Historical'];

    return (
        <div className="admin-dashboard">
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <div className="logo-box"><Plane size={20} fill="white" /></div>
                    <span>Admin Panel</span>
                </div>
                <nav className="admin-nav">
                    <Link to="/admin/dashboard" className="admin-nav-item">
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link to="/admin/users" className="admin-nav-item">
                        <Users size={20} /> Manage Users
                    </Link>
                    <Link to="/admin/destinations" className="admin-nav-item active">
                        <Compass size={20} /> Destinations
                    </Link>
                    <Link to="/admin/bookings" className="admin-nav-item">
                        <Calendar size={20} /> Bookings
                    </Link>
                    <Link to="/admin/revenue" className="admin-nav-item">
                        <PieChart size={20} /> Revenue
                    </Link>
                    <span className="nav-label">Support</span>
                    <Link to="/admin/settings" className="admin-nav-item">
                        <Settings size={20} /> Settings
                    </Link>
                    <Link to="/admin/help" className="admin-nav-item">
                        <HelpCircle size={20} /> Help Center
                    </Link>
                </nav>
            </aside>

            <main className="admin-main" style={{ padding: 0 }}>
                <div className="admin-dest-page">
                    <header className="admin-dest-header">
                        <div>
                            <h1>Manage Destinations</h1>
                            <p>Configure and monitor global travel spots and tourism packages.</p>
                        </div>
                        <button className="btn-add-dest" onClick={() => { setEditingDest(null); setShowModal(true); }}>
                            <Plus size={20} /> Add New Destination
                        </button>
                    </header>

                    <div className="admin-dest-filters">
                        <form onSubmit={handleSearch} className="search-wrapper">
                            <Search size={18} color="#94a3b8" />
                            <input
                                type="text"
                                placeholder="Search destinations by name or category..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            />
                        </form>

                        <div className="filter-chips">
                            {categories.map(cat => (
                                <div
                                    key={cat}
                                    className={`filter-chip ${filters.category === cat ? 'active' : ''}`}
                                    onClick={() => setFilters({ ...filters, category: cat })}
                                >
                                    {cat}
                                </div>
                            ))}
                        </div>

                        <div className="filter-chips">
                            <div
                                className={`filter-chip ${filters.status === 'All' ? 'active' : ''}`}
                                onClick={() => setFilters({ ...filters, status: 'All' })}
                            >All Status</div>
                            <div
                                className={`filter-chip ${filters.status === 'active' ? 'active' : ''}`}
                                onClick={() => setFilters({ ...filters, status: 'active' })}
                            >Active</div>
                            <div
                                className={`filter-chip ${filters.status === 'hidden' ? 'active' : ''}`}
                                onClick={() => setFilters({ ...filters, status: 'hidden' })}
                            >Hidden</div>
                        </div>

                        <button className="btn-more-filters"><Filter size={16} /> More Filters</button>
                    </div>

                    <div className="admin-dest-table-card">
                        <table className="admin-dest-table">
                            <thead>
                                <tr>
                                    <th>Destination</th>
                                    <th>Category</th>
                                    <th>Rating</th>
                                    <th>Visitors</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                                            <Loader2 className="animate-spin" size={32} color="#00d2ff" style={{ margin: '0 auto' }} />
                                        </td>
                                    </tr>
                                ) : destinations.length > 0 ? (
                                    destinations.map(dest => (
                                        <tr key={dest._id}>
                                            <td className="dest-name-cell">
                                                <img src={dest.images && dest.images[0]} className="dest-table-img" alt={dest.name} />
                                                <div className="dest-info-text">
                                                    <h4>{dest.name}, {dest.country}</h4>
                                                    <span>{dest.city} • {dest.climate}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`cat-badge cat-${dest.category}`}>{dest.category}</span>
                                            </td>
                                            <td>
                                                <div className="rating-cell">
                                                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                                                    <span className="rating-text">{dest.rating}</span>
                                                    <span className="rating-votes">(2.4k)</span>
                                                </div>
                                            </td>
                                            <td>{dest.visitorsPerMonth ? dest.visitorsPerMonth.toLocaleString() : '0'}/mo</td>
                                            <td>
                                                <div className={`status-pill status-${dest.status}`}>
                                                    <div className="dot"></div>
                                                    {dest.status}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="action-btns">
                                                    <Pencil size={18} className="action-btn" onClick={() => handleEdit(dest)} />
                                                    <Trash2 size={18} className="action-btn btn-delete" onClick={() => handleDelete(dest._id)} />
                                                    {dest.status === 'active' ? (
                                                        <EyeOff size={18} className="action-btn" onClick={() => handleToggleStatus(dest._id, dest.status)} title="Hide" />
                                                    ) : (
                                                        <Eye size={18} className="action-btn" onClick={() => handleToggleStatus(dest._id, dest.status)} title="Show" />
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No destinations found matching your filters.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <footer className="dest-table-footer">
                            <span>Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, stats.totalDestinations)} of {stats.totalDestinations} destinations</span>
                            <div className="pagination-controls">
                                <button className="page-nav-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                                    <ChevronLeft size={18} />
                                </button>
                                <div className="pagination-numbers">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <div
                                            key={i + 1}
                                            className={`page-num ${page === i + 1 ? 'active' : ''}`}
                                            onClick={() => setPage(i + 1)}
                                        >{i + 1}</div>
                                    ))}
                                </div>
                                <button className="page-nav-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </footer>
                    </div>

                    <div className="admin-dest-stats">
                        <div className="dest-stat-tile">
                            <div className="stat-tile-icon bg-light-blue"><MapPin size={24} /></div>
                            <div className="stat-tile-text">
                                <span>Total Destinations</span>
                                <h2>{stats.totalDestinations}</h2>
                            </div>
                        </div>
                        <div className="dest-stat-tile">
                            <div className="stat-tile-icon bg-light-green"><Star size={24} /></div>
                            <div className="stat-tile-text">
                                <span>Top Rated Avg</span>
                                <h2>{stats.avgRating}</h2>
                            </div>
                        </div>
                        <div className="dest-stat-tile">
                            <div className="stat-tile-icon bg-light-orange"><ImageIcon size={24} /></div>
                            <div className="stat-tile-text">
                                <span>Missing Media</span>
                                <h2>{stats.missingMedia}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Add / Edit Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{editingDest ? 'Edit Destination' : 'Add New Destination'}</h2>
                            <X size={24} className="action-btn" onClick={() => setShowModal(false)} />
                        </div>
                        <form onSubmit={handleSubmit} className="form-grid">
                            <div className="form-group">
                                <label>Destination Name</label>
                                <input type="text" className="form-control" value={form.name} onChange={e => handleFormChange('name', e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Country</label>
                                <input type="text" className="form-control" value={form.country} onChange={e => handleFormChange('country', e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>City</label>
                                <input type="text" className="form-control" value={form.city} onChange={e => handleFormChange('city', e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select className="form-control" value={form.category} onChange={e => handleFormChange('category', e.target.value)}>
                                    <option value="City">City</option>
                                    <option value="Beach">Beach</option>
                                    <option value="Mountain">Mountain</option>
                                    <option value="Historical">Historical</option>
                                    <option value="Adventure">Adventure</option>
                                </select>
                            </div>
                            <div className="form-group full">
                                <label>Description</label>
                                <textarea className="form-control" style={{ height: '100px' }} value={form.description} onChange={e => handleFormChange('description', e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Estimated Budget</label>
                                <input type="number" className="form-control" value={form.estimatedBudget} onChange={e => handleFormChange('estimatedBudget', parseInt(e.target.value))} />
                            </div>
                            <div className="form-group">
                                <label>Cost Per Day</label>
                                <input type="number" className="form-control" value={form.estimatedCostPerDay} onChange={e => handleFormChange('estimatedCostPerDay', parseInt(e.target.value))} />
                            </div>
                            <div className="form-group">
                                <label>Main Image URL</label>
                                <input type="text" className="form-control" value={form.images[0]} onChange={e => handleFormChange('images', [e.target.value])} required />
                            </div>
                            <div className="form-group">
                                <label>Climate Preference</label>
                                <select className="form-control" value={form.climate} onChange={e => handleFormChange('climate', e.target.value)}>
                                    <option value="Moderate">Moderate</option>
                                    <option value="Tropical">Tropical</option>
                                    <option value="Cold">Cold</option>
                                </select>
                            </div>

                            <div className="modal-actions full" style={{ gridColumn: 'span 2' }}>
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-submit">{editingDest ? 'Update' : 'Create'} Destination</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDestinations;
