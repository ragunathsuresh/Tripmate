import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    PlaneTakeoff, Brain, Compass, LayoutDashboard, TrendingUp,
    Users, MapPin, Calendar, Star, Linkedin, Twitter,
    Facebook, Instagram, ArrowRight, Phone, Mail, CheckCircle,
    ChevronRight, Loader2
} from 'lucide-react';
import './About.css';

const iconMap = {
    Brain, Compass, LayoutDashboard, TrendingUp, Users, MapPin, Calendar, Star,
};

const StatCard = ({ stat }) => {
    const [count, setCount] = useState('0');
    const ref = useRef(null);
    const animated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !animated.current) {
                    animated.current = true;
                    setCount(stat.value);
                }
            },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [stat.value]);

    const Icon = iconMap[stat.icon] || Star;

    return (
        <div className="stat-card" ref={ref}>
            <div className="stat-icon-wrap">
                <Icon size={28} />
            </div>
            <div className="stat-value">{count}</div>
            <div className="stat-label">{stat.label}</div>
        </div>
    );
};

const About = () => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const res = await axios.get('/api/about');
                setContent(res.data);
            } catch (err) {
                setError('Failed to load content. Please try again.');
                console.error('About fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAbout();
    }, []);

    if (loading) {
        return (
            <div className="about-loading">
                <Loader2 className="spin-icon" size={48} />
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="about-loading">
                <p className="error-text">{error}</p>
            </div>
        );
    }

    return (
        <div className="about-page">
            {/* ── Navbar ── */}
            <nav className="about-nav">
                <Link to="/" className="about-nav-logo">
                    <PlaneTakeoff color="#00d2ff" size={22} />
                    <span>AI Travel Planner</span>
                </Link>
                <div className="about-nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/explore">Destinations</Link>
                    <Link to="/planner">AI Planner</Link>
                    <Link to="/about" className="active">About</Link>
                </div>
                <div className="about-nav-auth">
                    <Link to="/login" className="nav-btn-login">Login</Link>
                    <Link to="/register" className="nav-btn-register">Register</Link>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section
                className="about-hero"
                style={{ backgroundImage: `url(${content.heroImage})` }}
            >
                <div className="about-hero-overlay" />
                <div className="about-hero-content">
                    <span className="hero-badge">
                        <PlaneTakeoff size={14} /> Our Story
                    </span>
                    <h1>{content.heroTitle}</h1>
                    <p>{content.heroSubtitle}</p>
                    <div className="hero-cta-group">
                        <Link to="/planner" className="hero-btn-primary">
                            Start Planning <ArrowRight size={16} />
                        </Link>
                        <Link to="/explore" className="hero-btn-secondary">
                            Explore Destinations
                        </Link>
                    </div>
                </div>
                <div className="hero-scroll-indicator">
                    <div className="scroll-dot" />
                </div>
            </section>

            {/* ── Mission ── */}
            <section className="about-mission">
                <div className="mission-inner">
                    <div className="mission-badge">
                        <CheckCircle size={16} /> {content.missionTitle}
                    </div>
                    <h2>{content.missionTitle}</h2>
                    <p>{content.missionText}</p>
                    <div className="mission-pillars">
                        <div className="pillar"><span>✈️</span> AI-Driven</div>
                        <div className="pillar"><span>🌍</span> Global Reach</div>
                        <div className="pillar"><span>💡</span> Smart Insights</div>
                        <div className="pillar"><span>🔒</span> Secure & Private</div>
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section className="about-features">
                <div className="section-heading">
                    <h2>Why Choose Us</h2>
                    <p>Powerful tools designed to make every trip extraordinary.</p>
                </div>
                <div className="features-grid">
                    {content.features.map((f, i) => {
                        const Icon = iconMap[f.icon] || Star;
                        return (
                            <div className="feature-card" key={i}>
                                <div className="feature-icon-wrap">
                                    <Icon size={24} />
                                </div>
                                <h3>{f.title}</h3>
                                <p>{f.description}</p>
                                <div className="feature-arrow">
                                    <ChevronRight size={18} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── How It Works ── */}
            <section className="about-steps">
                <div className="section-heading">
                    <h2>How It Works</h2>
                    <p>Your dream trip in four simple steps.</p>
                </div>
                <div className="steps-track">
                    {content.steps.map((step, i) => (
                        <div className="step-item" key={i}>
                            <div className="step-bubble">
                                <span className="step-num">{step.stepNumber}</span>
                            </div>
                            {i < content.steps.length - 1 && <div className="step-connector" />}
                            <div className="step-body">
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>



            {/* ── Stats ── */}
            <section className="about-stats">
                <div className="stats-inner">
                    {content.stats.map((stat, i) => (
                        <StatCard stat={stat} key={i} />
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="about-cta">
                <div className="cta-card">
                    <div className="cta-glow" />
                    <h2>{content.ctaTitle}</h2>
                    <p>{content.ctaSubtitle}</p>
                    <Link to="/planner" className="cta-btn">
                        Start Planning Your Trip <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="about-footer">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <PlaneTakeoff color="#00d2ff" size={20} />
                            <span>AI Travel Planner</span>
                        </div>
                        <p>Redefining travel planning through the power of artificial intelligence. Discover, plan, and go.</p>
                        <div className="footer-socials">
                            <a href="#"><Twitter size={18} /></a>
                            <a href="#"><Facebook size={18} /></a>
                            <a href="#"><Instagram size={18} /></a>
                            <a href="#"><Linkedin size={18} /></a>
                        </div>
                    </div>
                    <div className="footer-col">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/explore">Destinations</Link></li>
                            <li><Link to="/planner">Planner</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Support</h4>
                        <ul>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">FAQ</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Social</h4>
                        <ul>
                            <li><a href="#"><Twitter size={14} /> Twitter</a></li>
                            <li><a href="#"><Instagram size={14} /> Instagram</a></li>
                            <li><a href="#"><Linkedin size={14} /> LinkedIn</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2026 AI Travel Planner. All rights reserved.</p>
                    <div className="footer-links">
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default About;
