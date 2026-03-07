import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, PlaneTakeoff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        travelStyle: 'Solo',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { name, email, password, confirmPassword, travelStyle } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        // 1. Validation
        if (!name || !email || !password || !confirmPassword || !travelStyle) {
            setError('Please fill in all fields');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // 2. Password Match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setLoading(true);

        try {
            // 3. API Call
            const res = await axios.post('/api/auth/register', {
                name,
                email,
                password,
                confirmPassword,
                travelStyle,
            });

            if (res.data) {
                setSuccess('Registration successful! Redirecting...');
                // 4. Handle Success
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data));

                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            }
        } catch (err) {
            // 5. Handle Error
            setError(err.response?.data?.message || 'An error occurred during registration');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <div className="register-container">
                <div className="register-card">
                    <div className="register-header">
                        <div className="logo-section">
                            <div className="logo-icon-wrapper">
                                <PlaneTakeoff className="logo-icon" />
                            </div>
                            <h1>AI Travel Planner</h1>
                        </div>
                        <p className="subtitle">Create your account to start planning your next escape.</p>
                    </div>

                    <div className="status-messages">
                        {error && (
                            <div className="alert alert-error">
                                <AlertCircle className="alert-icon" />
                                <span>{error}</span>
                            </div>
                        )}
                        {success && (
                            <div className="alert alert-success">
                                <CheckCircle2 className="alert-icon" />
                                <span>{success}</span>
                            </div>
                        )}
                    </div>

                    <form onSubmit={onSubmit} className="register-form">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <div className="input-wrapper">
                                <User className="input-icon" />
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={name}
                                    onChange={onChange}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={onChange}
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="input-wrapper">
                                    <Lock className="input-icon" />
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={password}
                                        onChange={onChange}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <div className="input-wrapper">
                                    <Lock className="input-icon" />
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={onChange}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="travelStyle">Travel Style Preference</label>
                            <div className="select-wrapper">
                                <select
                                    id="travelStyle"
                                    name="travelStyle"
                                    value={travelStyle}
                                    onChange={onChange}
                                    className="modern-select"
                                >
                                    <option value="Solo">Solo Traveler</option>
                                    <option value="Adventure">Adventure Enthusiast</option>
                                    <option value="Luxury">Luxury & Comfort</option>
                                    <option value="Family">Family Fun</option>
                                    <option value="Budget">Budget Friendly</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="btn-register" disabled={loading}>
                            {loading ? (
                                <div className="loading-state">
                                    <Loader2 className="animate-spin" />
                                    <span>Creating Account...</span>
                                </div>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="register-footer">
                        <p>
                            Already have an account? <Link to="/login" className="login-link">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

