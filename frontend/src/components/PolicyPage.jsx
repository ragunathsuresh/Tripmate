import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Zap } from 'lucide-react';
import './PolicyPage.css';

const PolicyPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isPrivacy = location.pathname.includes('privacy');

    return (
        <div className="policy-page">
            <nav className="policy-nav">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={20} /> Back
                </button>
                <div className="policy-logo">
                    <Zap size={22} color="#00d2ff" fill="#00d2ff" />
                    <span>TripMate AI</span>
                </div>
            </nav>

            <main className="policy-content">
                <header className="policy-header">
                    <div className={`icon-box ${isPrivacy ? 'blue' : 'purple'}`}>
                        {isPrivacy ? <Shield size={32} /> : <FileText size={32} />}
                    </div>
                    <h1>{isPrivacy ? 'Privacy Policy' : 'Terms of Service'}</h1>
                    <p>Last updated: March 10, 2026</p>
                </header>

                <article className="policy-article">
                    <section>
                        <h2>1. Introduction</h2>
                        <p>
                            Welcome to TripMate AI. Your {isPrivacy ? 'privacy' : 'agreement to our terms'} is critically important to us.
                            This document outlines how we {isPrivacy ? 'collect, use, and protect your personal data' : 'expect our services to be used by our community'}.
                        </p>
                    </section>

                    <section>
                        <h2>2. {isPrivacy ? 'Data Collection' : 'Account Responsibilities'}</h2>
                        <p>
                            {isPrivacy ?
                                "We collect information you provide directly to us, such as your name, email, and travel preferences when you use our AI planner." :
                                "You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account."
                            }
                        </p>
                    </section>

                    <section>
                        <h2>3. {isPrivacy ? 'How We Use AI' : 'Service Availability'}</h2>
                        <p>
                            {isPrivacy ?
                                "Our AI engine processes your preferences locally and anonymously to provide destination recommendations. We never sell your personal datasets to third-party travel agencies." :
                                "While we strive for 100% uptime, our AI services may occasionally undergo maintenance. We reserve the right to modify or discontinue features at any time."
                            }
                        </p>
                    </section>

                    <section>
                        <h2>4. Contact Us</h2>
                        <p>
                            If you have any questions about this {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}, please contact us at:
                            <br />
                            <strong>legal@tripmate.ai</strong>
                        </p>
                    </section>
                </article>
            </main>
        </div>
    );
};

export default PolicyPage;
