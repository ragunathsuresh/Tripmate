const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' },
    linkedIn: { type: String, default: '' },
    twitter: { type: String, default: '' },
});

const statSchema = new mongoose.Schema({
    label: { type: String, required: true },
    value: { type: String, required: true },  // e.g. "10k+"
    icon: { type: String, default: '' },
});

const featureSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'Star' },
});

const stepSchema = new mongoose.Schema({
    stepNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
});

const aboutContentSchema = new mongoose.Schema(
    {
        heroTitle: { type: String, default: 'About AI Travel Planner' },
        heroSubtitle: {
            type: String,
            default:
                "We're redefining the way the world moves. Seamlessly blending AI and the joy of travel, we make personalized journeys possible for everyone, everywhere.",
        },
        heroImage: {
            type: String,
            default:
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=2070',
        },
        missionTitle: { type: String, default: 'Our Mission' },
        missionText: {
            type: String,
            default:
                "Travel should be about discovery and joy, not logistics and stress. Our mission is to leverage the power of advanced AI to create seamless, personalized travel experiences that inspire wonder and connection for everyone, everywhere.",
        },
        features: [featureSchema],
        steps: [stepSchema],
        team: [teamMemberSchema],
        stats: [statSchema],
        ctaTitle: { type: String, default: 'Ready to travel smarter?' },
        ctaSubtitle: {
            type: String,
            default:
                'Join thousands of travelers who have simplified their journey with our AI-powered planner.',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('AboutContent', aboutContentSchema);
