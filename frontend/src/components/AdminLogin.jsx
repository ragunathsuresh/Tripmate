import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Plane,
    ShieldCheck,
    Activity
} from 'lucide-react';
import './AdminLogin.css';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await axios.post('/api/admin/login', {
                loginId,
                password
            });

            if (res.data.token) {
                // Store admin info and token
                localStorage.setItem('userInfo', JSON.stringify(res.data));
                localStorage.setItem('token', res.data.token);

                // Redirect to admin dashboard
                navigate('/admin/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Unauthorized access. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-body">
            <div className="admin-login-card">
                <div className="admin-icon-wrapper">
                    <Plane size={32} />
                </div>

                <h1>Admin Portal</h1>
                <p className="subtitle">
                    Secure access for travel management and operations dashboard
                </p>

                {error && <div className="admin-login-error">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="admin-form-group">
                        <label>Username</label>
                        <div className="admin-input-wrapper">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                className="admin-login-input"
                                placeholder="Enter your username"
                                value={loginId}
                                onChange={(e) => setLoginId(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="admin-form-group">
                        <div className="password-header">
                            <label>Password</label>
                            <a href="#" className="forgot-link">Forgot?</a>
                        </div>
                        <div className="admin-input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="admin-login-input"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </div>
                        </div>
                    </div>

                    <div className="remember-me">
                        <input type="checkbox" id="remember" />
                        <label htmlFor="remember">Remember this device for 30 days</label>
                    </div>

                    <button type="submit" className="btn-admin-login" disabled={loading}>
                        {loading ? 'Authenticating...' : (
                            <>
                                Sign Into Dashboard <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div className="admin-footer-meta">
                    <span><ShieldCheck size={14} style={{ marginRight: '4px' }} /> ENCRYPTED CONNECTION</span>
                    <span>V2.4.0-STABLE</span>
                </div>

                <div className="status-pills">
                    <span><span className="status-dot"></span> API Gateway: Online</span>
                    <span><span className="status-dot"></span> Auth Cluster: Healthy</span>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;

