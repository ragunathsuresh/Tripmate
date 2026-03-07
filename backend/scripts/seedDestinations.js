const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Destination = require('../models/Destination');

dotenv.config();

const destinations = [
    {
        name: 'Paris', country: 'France', city: 'Europe • Western', category: 'City', climate: 'Moderate',
        description: 'The city of light, famous for the Eiffel Tower, Louvre, and charming cafes.',
        rating: 4.8, estimatedBudget: 3500, estimatedCostPerDay: 450, bestTimeToVisit: 'April to June',
        images: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1000'],
        coordinates: { lat: 48.8566, lng: 2.3522 },
        activities: [{ title: 'Eiffel Tower Visit', description: 'Iconic panoramic views.', type: 'sightseeing' }],
        status: 'active', visitorsPerMonth: 12500
    },
    {
        name: 'Bali', country: 'Indonesia', city: 'Asia • Southeast', category: 'Beach', climate: 'Tropical',
        description: 'Tropical paradise known for its volcanic mountains, iconic rice paddies and beaches.',
        rating: 4.9, estimatedBudget: 1500, estimatedCostPerDay: 150, bestTimeToVisit: 'May to September',
        images: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1000'],
        coordinates: { lat: -8.3405, lng: 115.092 },
        activities: [{ title: 'Surfing at Kuta', description: 'Great waves for all levels.', type: 'adventure' }],
        status: 'active', visitorsPerMonth: 25800
    },
    {
        name: 'Interlaken', country: 'Switzerland', city: 'Europe • Alpine', category: 'Mountain', climate: 'Cold',
        description: 'Traditional resort town in the mountainous Bernese Oberland region of central Switzerland.',
        rating: 4.7, estimatedBudget: 4500, estimatedCostPerDay: 500, bestTimeToVisit: 'June to August',
        images: ['https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&q=80&w=1000'],
        coordinates: { lat: 46.6863, lng: 7.8632 },
        activities: [{ title: 'Paragliding', description: 'Soar over the lakes and mountains.', type: 'adventure' }],
        status: 'active', visitorsPerMonth: 8200
    },
    {
        name: 'Tokyo', country: 'Japan', city: 'Asia • East', category: 'City', climate: 'Moderate',
        description: 'Japan’s busy capital, mixes the ultramodern and the traditional.',
        rating: 4.9, estimatedBudget: 4000, estimatedCostPerDay: 400, bestTimeToVisit: 'March to May',
        images: ['https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=1000'],
        coordinates: { lat: 35.6762, lng: 139.6503 },
        activities: [{ title: 'Shibuya Crossing', description: 'The famous scramble crossing.', type: 'sightseeing' }],
        status: 'hidden', visitorsPerMonth: 35000
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for detailed seeding...');
        await Destination.deleteMany();
        await Destination.insertMany(destinations);
        console.log('Admin Destinations seeded successfully!');
        process.exit();
    } catch (err) {
        console.error('Error seeding database:', err.message);
        process.exit(1);
    }
};

seedDB();
