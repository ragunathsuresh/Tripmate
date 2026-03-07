import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, PlaneTakeoff, Loader2, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post('/api/auth/login', {
                email,
                password,
            });

            if (res.data) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('userInfo', JSON.stringify(res.data));

                if (res.data.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="background-overlay"></div>

            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <div className="logo-badge">
                            <PlaneTakeoff className="logo-icon" />
                        </div>
                        <h1>AI Travel</h1>
                        <p className="subtitle">Sign in to start your next adventure</p>
                    </div>

                    {error && (
                        <div className="alert-error">
                            <AlertCircle className="alert-icon" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="login-form">
                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={onChange}
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="label-row">
                                <label htmlFor="password">Password</label>
                                <Link to="/forgot-password" variant="forgot">Forgot Password?</Link>
                            </div>
                            <div className="input-wrapper">
                                <Lock className="input-icon" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="show-password-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn-login" disabled={loading}>
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <>
                                    <span>Login</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="divider">
                        <span>OR CONTINUE WITH</span>
                    </div>

                    <div className="social-login">
                        <button className="btn-social">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                            <span>Google</span>
                        </button>
                        <button className="btn-social">
                            <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" />
                            <span>Facebook</span>
                        </button>
                    </div>

                    <div className="login-footer">
                        <p>
                            Don't have an account? <Link to="/register">Register Now</Link>
                        </p>
                    </div>
                </div>

                <nav className="bottom-nav">
                    <Link to="/privacy">PRIVACY POLICY</Link>
                    <Link to="/terms">TERMS OF SERVICE</Link>
                    <Link to="/contact">CONTACT</Link>
                </nav>
            </div>
        </div>
    );
};

export default Login;

