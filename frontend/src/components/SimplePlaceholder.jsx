import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Construction, ArrowLeft, Zap, Landmark, CreditCard } from 'lucide-react';

const SimplePlaceholder = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isBilling = location.pathname.includes('billing');
    const isBookings = location.pathname.includes('bookings');

    const title = isBilling ? 'Billing & Subscription' : isBookings ? 'My Bookings' : 'Coming Soon';
    const Icon = isBilling ? CreditCard : isBookings ? Landmark : Construction;

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8fafc',
            fontFamily: 'Outfit, sans-serif',
            textAlign: 'center',
            padding: '2rem'
        }}>
            <div style={{
                width: '80px',
                height: '80px',
                background: '#e0f2fe',
                color: '#00d2ff',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem'
            }}>
                <Icon size={40} />
            </div>

            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>{title}</h1>
            <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '500px', lineHeight: 1.6 }}>
                We're currently fine-tuning this section to provide you with a world-class travel management experience. Check back soon!
            </p>

            <button
                onClick={() => navigate(-1)}
                style={{
                    marginTop: '3rem',
                    background: '#0f172a',
                    color: 'white',
                    border: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '16px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    cursor: 'pointer'
                }}
            >
                <ArrowLeft size={18} /> Take Me Back
            </button>

            <footer style={{ marginTop: 'auto', color: '#94a3b8', fontSize: '0.9rem' }}>
                <Zap size={16} color="#00d2ff" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                TripMate AI © 2026
            </footer>
        </div>
    );
};

export default SimplePlaceholder;
