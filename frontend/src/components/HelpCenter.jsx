import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Search,
    LifeBuoy,
    MessageCircle,
    Phone,
    Mail,
    FileText,
    ChevronRight,
    Play,
    HelpCircle,
    Zap,
    Map,
    Calendar,
    ArrowLeft
} from 'lucide-react';
import './HelpCenter.css';

const HelpCenter = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const faqs = [
        {
            q: "How does the AI Planner work?",
            a: "Our AI analyzes your preferences (style, budget, climate) and cross-references them with thousands of destination data points to generate a custom day-by-day itinerary."
        },
        {
            q: "Can I edit my saved trips?",
            a: "Yes! Navigate to 'My Trips', select any planning trip, and you can add/remove activities or change your travel dates."
        },
        {
            q: "Is there a premium version?",
            a: "Absolutely. Premium members get unlimited AI generations, offline maps, and exclusive early access to viral destination hidden gems."
        },
        {
            q: "How do I delete my account?",
            a: "You can manage your account data and standing in the 'Profile Settings' page under 'Security'."
        }
    ];

    return (
        <div className="help-page">
            <header className="help-hero">
                <nav className="help-nav">
                    <button onClick={() => navigate(-1)} className="back-link">
                        <ArrowLeft size={18} /> Back
                    </button>
                    <Link to="/" className="help-logo">
                        <Zap size={20} color="#00d2ff" fill="#00d2ff" />
                        <span>TripMate Support</span>
                    </Link>
                </nav>

                <div className="hero-content">
                    <h1>How can we help you?</h1>
                    <div className="search-bar-wrap">
                        <Search size={22} color="#94a3b8" />
                        <input
                            type="text"
                            placeholder="Search for articles, guides, or FAQs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <main className="help-container">
                <section className="topics-grid">
                    <div className="topic-card">
                        <div className="topic-icon-box blue"><Map size={24} /></div>
                        <h3>Planning a Trip</h3>
                        <p>Learn how to use AI to build the perfect journey.</p>
                        <span className="learn-more">12 Articles <ChevronRight size={16} /></span>
                    </div>
                    <div className="topic-card">
                        <div className="topic-icon-box purple"><Calendar size={24} /></div>
                        <h3>Managing Bookings</h3>
                        <p>Track your reservations and upcoming itineraries.</p>
                        <span className="learn-more">8 Articles <ChevronRight size={16} /></span>
                    </div>
                    <div className="topic-card">
                        <div className="topic-icon-box green"><Zap size={24} /></div>
                        <h3>Account & Premium</h3>
                        <p>Settings, billing, and upgrading your experience.</p>
                        <span className="learn-more">10 Articles <ChevronRight size={16} /></span>
                    </div>
                </section>

                <section className="faq-section">
                    <h2>Frequently Asked Questions</h2>
                    <div className="faq-list">
                        {faqs.map((faq, i) => (
                            <div key={i} className="faq-item">
                                <h4>{faq.q}</h4>
                                <p>{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="contact-support">
                    <div className="support-cta">
                        <div className="cta-icon"><MessageCircle size={32} color="white" /></div>
                        <div className="cta-text">
                            <h2>Still need help?</h2>
                            <p>Our support team is available 24/7 via live chat or email.</p>
                        </div>
                        <button className="btn-contact">Contact Us</button>
                    </div>

                    <div className="contact-grid">
                        <div className="contact-method">
                            <Mail size={20} color="#00d2ff" />
                            <div>
                                <h5>Email Support</h5>
                                <span>support@tripmate.ai</span>
                            </div>
                        </div>
                        <div className="contact-method">
                            <Phone size={20} color="#00d2ff" />
                            <div>
                                <h5>Call Center</h5>
                                <span>+1 (800) 123-4567</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="help-footer">
                <p>© 2026 TripMate AI. Built for the modern traveler.</p>
                <div className="footer-links">
                    <Link to="/privacy">Privacy</Link>
                    <Link to="/terms">Terms</Link>
                    <Link to="/about">About Us</Link>
                </div>
            </footer>
        </div>
    );
};

export default HelpCenter;
