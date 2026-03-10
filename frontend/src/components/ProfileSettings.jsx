import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    User,
    Mail,
    Shield,
    MapPin,
    Compass,
    CreditCard,
    Bell,
    LogOut,
    Settings,
    Plus,
    X,
    Lock,
    Loader2,
    Home,
    Map,
    Trophy
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import './ProfileSettings.css';

const ProfileSettings = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);

    const [profile, setProfile] = useState({
        name: '',
        email: '',
        profileBio: '',
        travelStyle: 'Adventure & Outdoors',
        monthlyBudget: 0,
        topDestinations: [],
        profilePicture: '',
        twoFactorEnabled: false
    });

    const [newInterest, setNewInterest] = useState('');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
            navigate('/login');
            return;
        }
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/users/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile({
                ...res.data,
                topDestinations: res.data.topDestinations || []
            });
            setLoading(false);
        } catch (err) {
            showNotification('Failed to load profile settings', 'error');
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put('/api/users/profile', profile, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showNotification('Profile updated successfully!', 'success');
            // Update local storage name if it changed
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            userInfo.name = profile.name;
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
        } catch (err) {
            showNotification(err.response?.data?.message || 'Update failed', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }

        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put('/api/users/change-password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showNotification('Password updated successfully!', 'success');
            setShowPasswordModal(false);
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            showNotification(err.response?.data?.message || 'Password change failed', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleTwoFactorToggle = async () => {
        const newValue = !profile.twoFactorEnabled;
        try {
            const token = localStorage.getItem('token');
            await axios.put('/api/users/two-factor', {
                twoFactorEnabled: newValue
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile({ ...profile, twoFactorEnabled: newValue });
            showNotification(`2FA ${newValue ? 'enabled' : 'disabled'} successfully`, 'success');
        } catch (err) {
            showNotification('Failed to update 2FA status', 'error');
        }
    };

    const addDestinationInterest = () => {
        if (newInterest.trim() && !profile.topDestinations.includes(newInterest.trim())) {
            setProfile({
                ...profile,
                topDestinations: [...profile.topDestinations, newInterest.trim()]
            });
            setNewInterest('');
        }
    };

    const removeInterest = (tag) => {
        setProfile({
            ...profile,
            topDestinations: profile.topDestinations.filter(t => t !== tag)
        });
    };

    const showNotification = (msg, type) => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    };

    if (loading) return (
        <div className="profile-settings-page">
            <div className="loading-overlay">
                <Loader2 className="animate-spin" size={48} color="#00d2ff" />
                <p>Loading your settings...</p>
            </div>
        </div>
    );

    return (
        <div className="profile-settings-page">
            {notification && (
                <div className={`notification ${notification.type}`}>
                    {notification.msg}
                </div>
            )}

            <aside className="profile-sidebar">
                <div className="sidebar-logo">
                    <img src="/tripmate-logo.png" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
                    <span>Tripmate</span>
                </div>

                <div className="user-summary">
                    {profile.profilePicture ? (
                        <img src={profile.profilePicture} alt="User" className="user-avatar" />
                    ) : (
                        <div className="user-avatar-placeholder">
                            <User size={24} color="#64748b" />
                        </div>
                    )}
                    <div className="user-name-tag">
                        <h4>{profile.name}</h4>
                        <p>Premium Member</p>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/settings" className="nav-link active">
                        <User size={18} /> Profile Settings
                    </Link>
                    <Link to="/my-trips" className="nav-link">
                        <Map size={18} /> My Trips
                    </Link>
                    <Link to="/bookings" className="nav-link">
                        <Trophy size={18} /> Bookings
                    </Link>
                    <Link to="/billing" className="nav-link">
                        <CreditCard size={18} /> Billing
                    </Link>

                    <div style={{ margin: '1.5rem 0', borderTop: '1px solid #f1f5f9' }}></div>

                    <Link to="/help" className="nav-link">
                        <Settings size={18} /> Help Center
                    </Link>
                    <button onClick={logout} className="nav-link logout" style={{ border: 'none', background: 'none', width: '100%', cursor: 'pointer' }}>
                        <LogOut size={18} /> Logout
                    </button>
                    <Link to="/" className="nav-link" style={{ marginTop: 'auto' }}>
                        <Home size={18} /> Home
                    </Link>
                </nav>
            </aside>

            <main className="profile-main">
                <header className="profile-header">
                    <h1>Profile Settings</h1>
                    <p>Manage your personal details, travel preferences, and security.</p>
                </header>

                <form onSubmit={handleUpdateProfile}>
                    <section className="settings-card">
                        <div className="card-title">
                            <div className="icon-box-blue"><User size={20} /></div>
                            <h2>Personal Information</h2>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={profile.email}
                                    disabled
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div className="form-group full-width">
                                <label>Profile Picture URL</label>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <input
                                        type="text"
                                        className="form-input"
                                        style={{ flex: 1 }}
                                        value={profile.profilePicture || ''}
                                        onChange={(e) => setProfile({ ...profile, profilePicture: e.target.value })}
                                        placeholder="Paste image URL here"
                                    />
                                    {profile.profilePicture && (
                                        <button
                                            type="button"
                                            className="btn-discard"
                                            onClick={() => setProfile({ ...profile, profilePicture: '' })}
                                            style={{ color: '#ef4444' }}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <p className="subtext" style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                                    External image link (Unsplash, Imgur, etc.)
                                </p>
                            </div>
                            <div className="form-group full-width">
                                <label>Profile Bio</label>
                                <textarea
                                    className="form-input textarea"
                                    value={profile.profileBio || ''}
                                    onChange={(e) => setProfile({ ...profile, profileBio: e.target.value })}
                                    placeholder="Adventure seeker and coffee lover. Exploring the world one city at a time."
                                />
                            </div>
                        </div>
                    </section>

                    <section className="settings-card">
                        <div className="card-title">
                            <div className="icon-box-purple"><Compass size={20} /></div>
                            <h2>Travel Preferences</h2>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Preferred Travel Style</label>
                                <select
                                    className="form-input"
                                    value={profile.travelStyle}
                                    onChange={(e) => setProfile({ ...profile, travelStyle: e.target.value })}
                                >
                                    <option value="Adventure & Outdoors">Adventure & Outdoors</option>
                                    <option value="Luxury">Luxury</option>
                                    <option value="Budget">Budget</option>
                                    <option value="Family">Family</option>
                                    <option value="Solo">Solo</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Monthly Budget (USD)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={profile.monthlyBudget}
                                    onChange={(e) => setProfile({ ...profile, monthlyBudget: parseInt(e.target.value) || 0 })}
                                    placeholder="$ 2500"
                                />
                            </div>
                            <div className="form-group full-width">
                                <label>Top Destinations Interest</label>
                                <div className="destinations-interests">
                                    {(profile.topDestinations || []).map((tag, idx) => (
                                        <span key={tag || idx} className="interest-tag">
                                            {tag}
                                            <span onClick={() => removeInterest(tag)} className="remove-tag"><X size={12} /></span>
                                        </span>
                                    ))}
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input
                                            type="text"
                                            className="form-input"
                                            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                                            value={newInterest}
                                            onChange={(e) => setNewInterest(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDestinationInterest())}
                                            placeholder="Add city/country"
                                        />
                                        <button
                                            type="button"
                                            onClick={addDestinationInterest}
                                            className="btn-add-tag"
                                        >
                                            <Plus size={14} /> Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="settings-card">
                        <div className="card-title">
                            <div className="icon-box-green"><Shield size={20} /></div>
                            <h2>Password & Security</h2>
                        </div>

                        <div className="security-row">
                            <div className="security-info">
                                <h4>Password</h4>
                                <p>Last changed 3 months ago</p>
                            </div>
                            <button type="button" onClick={() => setShowPasswordModal(true)} className="btn-change-password">Change Password</button>
                        </div>

                        <div className="security-row">
                            <div className="security-info">
                                <h4>Two-Factor Authentication</h4>
                                <p>Add an extra layer of security</p>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={profile.twoFactorEnabled}
                                    onChange={handleTwoFactorToggle}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </section>

                    <div className="settings-actions">
                        <button type="button" onClick={fetchProfile} className="btn-discard">Discard Changes</button>
                        <button type="submit" disabled={saving} className="btn-save">
                            {saving ? <Loader2 className="animate-spin" size={20} /> : 'Save Changes'}
                        </button>
                    </div>
                </form>

                {/* Password Change Modal / Overlay */}
                {showPasswordModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(15, 23, 42, 0.7)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', zIndex: 1100
                    }}>
                        <div className="settings-card" style={{ width: '400px', marginBottom: 0 }}>
                            <div className="card-title">
                                <Lock size={20} />
                                <h2>Change Password</h2>
                                <button onClick={() => setShowPasswordModal(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                            </div>
                            <form onSubmit={handlePasswordChange}>
                                <div className="form-group" style={{ marginBottom: '1rem' }}>
                                    <label>Current Password</label>
                                    <input
                                        type="password"
                                        className="form-input"
                                        value={passwords.currentPassword}
                                        onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: '1rem' }}>
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        className="form-input"
                                        value={passwords.newPassword}
                                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label>Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="form-input"
                                        value={passwords.confirmPassword}
                                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                        required
                                    />
                                </div>
                                <button type="submit" disabled={saving} className="btn-save" style={{ width: '100%' }}>
                                    {saving ? <Loader2 className="animate-spin" size={20} /> : 'Update Password'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProfileSettings;

