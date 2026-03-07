import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
    Search,
    Plus,
    Trash2,
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
    Eye,
    CheckCircle,
    XCircle,
    Loader2,
    Shield,
    Smartphone,
    Mail,
    Hash
} from 'lucide-react';
import './AdminUsers.css';

const AdminUsers = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, adminCount: 0 });
    const [filters, setFilters] = useState({ search: '', travelStyle: 'All', role: 'All' });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [admin, setAdmin] = useState(null);

    const [form, setForm] = useState({
        name: '', email: '', password: '', travelStyle: 'Luxury', role: 'user'
    });

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = localStorage.getItem('token');
        if (!userInfo || !token || userInfo.role !== 'admin') {
            navigate('/admin/login');
            return;
        }
        setAdmin(userInfo);
        fetchUsers();
    }, [page, filters.travelStyle, filters.role]);

    const fetchUsers = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(`http://localhost:5000/api/admin/users?page=${page}&search=${filters.search}&travelStyle=${filters.travelStyle}&role=${filters.role}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data.users);
            setStats(res.data.stats);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchUsers();
    };

    const handleToggleStatus = async (user) => {
        const newStatus = user.status === 'active' ? 'deactivated' : 'active';
        const token = localStorage.getItem('token');
        try {
            await axios.patch(`http://localhost:5000/api/admin/users/${user._id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUsers(users.map(u => u._id === user._id ? { ...u, status: newStatus } : u));
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user? This action is irreversible.')) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (err) {
            alert('Delete failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/admin/users', form, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowModal(false);
            setForm({ name: '', email: '', password: '', travelStyle: 'Luxury', role: 'user' });
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create user');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const renderUserDetail = () => {
        if (!selectedUser) return null;
        return (
            <div className="modal-overlay">
                <div className="modal-content" style={{ width: '600px' }}>
                    <div className="modal-header">
                        <h2>User Profile Detail</h2>
                        <X size={24} className="action-btn" onClick={() => setShowDetail(false)} />
                    </div>
                    <div className="user-detail-header">
                        <img src={`https://i.pravatar.cc/150?u=${selectedUser._id}`} alt="User" className="large-avatar" />
                        <div className="user-header-info">
                            <h2>{selectedUser.name}</h2>
                            <p>{selectedUser.email}</p>
                            <span className={`style-badge style-${selectedUser.travelStyle}`}>{selectedUser.travelStyle}</span>
                        </div>
                    </div>

                    <div className="user-stats-bar">
                        <div className="user-stat-item">
                            <span>Status</span>
                            <h3 style={{ color: selectedUser.status === 'active' ? '#22c55e' : '#94a3b8' }}>
                                {selectedUser.status === 'active' ? <CheckCircle size={16} style={{ marginRight: '4px' }} /> : <XCircle size={16} style={{ marginRight: '4px' }} />}
                                {selectedUser.status.toUpperCase()}
                            </h3>
                        </div>
                        <div className="user-stat-item">
                            <span>Role</span>
                            <h3>{selectedUser.role === 'admin' ? <Shield size={16} color="#00d2ff" style={{ marginRight: '4px' }} /> : <Users size={16} style={{ marginRight: '4px' }} />} {selectedUser.role.toUpperCase()}</h3>
                        </div>
                        <div className="user-stat-item">
                            <span>Monthly Budget</span>
                            <h3>${selectedUser.monthlyBudget?.toLocaleString() || '0'}</h3>
                        </div>
                    </div>

                    <div className="user-info-section">
                        <h4>Platform Information</h4>
                        <div className="info-grid">
                            <div className="info-item">
                                <div className="info-label">Member Since</div>
                                <div className="info-value">{formatDate(selectedUser.createdAt)}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Current Role</div>
                                <div className="info-value">{selectedUser.role}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Personal Bio</div>
                                <div className="user-bio-text" style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                                    {selectedUser.profileBio || 'No biography provided yet by this user.'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="user-info-section">
                        <h4>Security & Account</h4>
                        <div className="info-grid">
                            <div className="info-item">
                                <div className="info-label">Two Factor Auth</div>
                                <div className="info-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {selectedUser.twoFactorEnabled ? <CheckCircle size={14} color="#22c55e" /> : <XCircle size={14} color="#f43f5e" />}
                                    {selectedUser.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Database ID</div>
                                <div className="user-id-badge">{selectedUser._id}</div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button className="btn-cancel" onClick={() => setShowDetail(false)}>Close Overview</button>
                    </div>
                </div>
            </div>
        );
    };

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
                    <Link to="/admin/users" className="admin-nav-item active">
                        <Users size={20} /> Manage Users
                    </Link>
                    <Link to="/admin/destinations" className="admin-nav-item">
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
                <div className="admin-users-page">
                    <header className="admin-users-header">
                        <div>
                            <h1>User Management</h1>
                            <p>Control platform access, manage permissions, and analyze traveler profiles.</p>
                        </div>
                        <button className="btn-add-user" onClick={() => setShowModal(true)}>
                            <Plus size={20} /> Create New Account
                        </button>
                    </header>

                    <div className="admin-users-filters">
                        <form onSubmit={handleSearch} className="search-wrapper">
                            <Search size={18} color="#94a3b8" />
                            <input
                                type="text"
                                placeholder="Search by name or email address..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            />
                        </form>

                        <div className="filter-group">
                            <span className="filter-label">Travel Style</span>
                            <select
                                className="select-filter"
                                value={filters.travelStyle}
                                onChange={(e) => setFilters({ ...filters, travelStyle: e.target.value })}
                            >
                                <option value="All">All Styles</option>
                                <option value="Luxury">Luxury</option>
                                <option value="Budget">Budget</option>
                                <option value="Adventure">Adventure</option>
                                <option value="Family">Family</option>
                                <option value="Solo">Solo</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <span className="filter-label">Access Level</span>
                            <select
                                className="select-filter"
                                value={filters.role}
                                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                            >
                                <option value="All">All Roles</option>
                                <option value="user">Traveler</option>
                                <option value="admin">Administrator</option>
                            </select>
                        </div>
                    </div>

                    <div className="admin-users-table-card">
                        <table className="admin-users-table">
                            <thead>
                                <tr>
                                    <th>User Information</th>
                                    <th>Status Control</th>
                                    <th>Travel Style</th>
                                    <th>Role</th>
                                    <th>Joined Date</th>
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
                                ) : users.length > 0 ? (
                                    users.map(user => (
                                        <tr key={user._id}>
                                            <td>
                                                <div className="user-main-cell">
                                                    <img src={`https://i.pravatar.cc/150?u=${user._id}`} className="user-avatar-small" alt={user.name} />
                                                    <div className="dest-info-text">
                                                        <h4>{user.name}</h4>
                                                        <span>{user.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="status-toggle-wrapper">
                                                    <div
                                                        className={`btn-toggle-status ${user.status === 'active' ? 'active' : ''}`}
                                                        onClick={() => handleToggleStatus(user)}
                                                    >
                                                        <div className="toggle-knob"></div>
                                                    </div>
                                                    <span className={`status-text status-${user.status}-text`}>{user.status}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`style-badge style-${user.travelStyle}`}>{user.travelStyle}</span>
                                            </td>
                                            <td>
                                                {user.role === 'admin' ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00d2ff', fontWeight: 800 }}>
                                                        <Shield size={16} /> ADMIN
                                                    </div>
                                                ) : (
                                                    <span style={{ color: '#64748b', fontWeight: 600 }}>Traveler</span>
                                                )}
                                            </td>
                                            <td>{formatDate(user.createdAt)}</td>
                                            <td>
                                                <div className="user-action-btns">
                                                    <Eye size={18} className="user-action-btn" onClick={() => { setSelectedUser(user); setShowDetail(true); }} />
                                                    <Trash2 size={18} className="user-action-btn btn-del-user" onClick={() => handleDeleteUser(user._id)} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No users matching your criteria were found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <footer className="users-table-footer">
                            <span>Showing {users.length} registered accounts</span>
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
                            <div className="stat-tile-icon bg-light-blue"><Users size={24} /></div>
                            <div className="stat-tile-text">
                                <span>Total Platform Users</span>
                                <h2>{stats.totalUsers}</h2>
                            </div>
                        </div>
                        <div className="dest-stat-tile">
                            <div className="stat-tile-icon bg-light-green"><CheckCircle size={24} /></div>
                            <div className="stat-tile-text">
                                <span>Active Accounts</span>
                                <h2>{stats.activeUsers}</h2>
                            </div>
                        </div>
                        <div className="dest-stat-tile">
                            <div className="stat-tile-icon bg-light-orange"><Shield size={24} /></div>
                            <div className="stat-tile-text">
                                <span>System Admins</span>
                                <h2>{stats.adminCount}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Create User Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: '500px' }}>
                        <div className="modal-header">
                            <h2>Register Platform User</h2>
                            <X size={24} className="action-btn" onClick={() => setShowModal(false)} />
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                <label>Full Legal Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                <label>Official Email Address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                <label>Secure Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div className="form-grid" style={{ marginBottom: '1.25rem' }}>
                                <div className="form-group">
                                    <label>Travel Style</label>
                                    <select className="form-control" value={form.travelStyle} onChange={e => setForm({ ...form, travelStyle: e.target.value })}>
                                        <option value="Luxury">Luxury</option>
                                        <option value="Budget">Budget</option>
                                        <option value="Adventure">Adventure</option>
                                        <option value="Family">Family</option>
                                        <option value="Solo">Solo</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Account Role</label>
                                    <select className="form-control" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                                        <option value="user">Traveler</option>
                                        <option value="admin">Administrator</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-submit">Initialize Account</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* User Detail Modal */}
            {showDetail && renderUserDetail()}
        </div>
    );
};

export default AdminUsers;
