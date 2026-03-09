const AboutContent = require('../models/AboutContent');

// Default seed data
const defaultContent = {
    heroTitle: 'About AI Travel Planner',
    heroSubtitle:
        "We're redefining the way the world moves. Seamlessly blending AI and the joy of travel, we make personalized journeys possible for everyone, everywhere.",
    heroImage:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=2070',
    missionTitle: 'Our Mission',
    missionText:
        "Travel should be about discovery and joy, not logistics and stress. Our mission is to leverage the power of advanced AI to create seamless, personalized travel experiences that inspire wonder and connection for everyone, everywhere.",
    features: [
        {
            title: 'AI-Powered Planning',
            description: 'Build entire itineraries in seconds with intelligent suggestions tailored to your interests, pace, and budget.',
            icon: 'Brain',
        },
        {
            title: 'Smart Discovery',
            description: 'Uncover hidden gems and breathtaking experiences you might have never found on your own.',
            icon: 'Compass',
        },
        {
            title: 'Dynamic Builder',
            description: 'Drag, drop, and adjust your plans with an elegant interface that adapts in real-time.',
            icon: 'LayoutDashboard',
        },
        {
            title: 'Travel Insights',
            description: 'Access the latest travel trends, safety scores, and best time-to-visit recommendations.',
            icon: 'TrendingUp',
        },
    ],
    steps: [
        {
            stepNumber: 1,
            title: 'Set Preferences',
            description: 'Tell us where you want to go, your travel style, budget, and dates.',
        },
        {
            stepNumber: 2,
            title: 'AI Recommendations',
            description: 'Our AI analyzes millions of data points to curate the best matches for your profile.',
        },
        {
            stepNumber: 3,
            title: 'Itinerary Ready',
            description: 'Receive a beautifully crafted, day-by-day plan ready to follow.',
        },
        {
            stepNumber: 4,
            title: 'Manage & Enjoy',
            description: 'Adjust plans on the go, track spending, and share with travel companions.',
        },
    ],
    team: [
        {
            name: 'Alex Rivera',
            role: 'CEO & Co-Founder',
            bio: 'Former travel writer turned tech entrepreneur. Alex has visited 72 countries.',
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
            linkedIn: '#',
            twitter: '#',
        },
        {
            name: 'Sarah Chen',
            role: 'Head of AI',
            bio: 'PhD in Machine Learning from MIT. Sarah leads our intelligent planning engine.',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
            linkedIn: '#',
            twitter: '#',
        },
        {
            name: 'Marcus Thorne',
            role: 'Lead Designer',
            bio: 'Award-winning UX designer passionate about crafting beautiful travel experiences.',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
            linkedIn: '#',
            twitter: '#',
        },
    ],
    stats: [
        { label: 'Travelers', value: '10k+', icon: 'Users' },
        { label: 'Destinations', value: '500+', icon: 'MapPin' },
        { label: 'Trips Planned', value: '25k+', icon: 'Calendar' },
        { label: 'Satisfaction', value: '98%', icon: 'Star' },
    ],
    ctaTitle: 'Ready to travel smarter?',
    ctaSubtitle:
        'Join thousands of travelers who have simplified their journey with our AI-powered planner.',
};

// @desc    Get About page content
// @route   GET /api/about
// @access  Public
const getAboutContent = async (req, res) => {
    try {
        let content = await AboutContent.findOne();

        // Auto-seed if no document exists yet
        if (!content) {
            content = await AboutContent.create(defaultContent);
        }

        res.status(200).json(content);
    } catch (error) {
        console.error('Error fetching about content:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update About page content (Admin only)
// @route   PUT /api/about
// @access  Private/Admin
const updateAboutContent = async (req, res) => {
    try {
        let content = await AboutContent.findOne();

        if (!content) {
            content = await AboutContent.create({ ...defaultContent, ...req.body });
        } else {
            Object.assign(content, req.body);
            await content.save();
        }

        res.status(200).json(content);
    } catch (error) {
        console.error('Error updating about content:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getAboutContent, updateAboutContent };
