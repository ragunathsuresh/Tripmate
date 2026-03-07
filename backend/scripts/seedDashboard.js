const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Destination = require('../models/Destination');
const Booking = require('../models/Booking');

dotenv.config();

const seedDashboard = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        // 1. Create Users
        const users = [
            { name: 'Sarah Jenkins', email: 'sarah@example.com', password: 'password123', travelStyle: 'Luxury', createdAt: new Date(new Date().setDate(new Date().getDate() - 25)) },
            { name: 'Mike Ross', email: 'mike@example.com', password: 'password123', travelStyle: 'Adventure', createdAt: new Date(new Date().setDate(new Date().getDate() - 15)) },
            { name: 'Elena Vance', email: 'elena@example.com', password: 'password123', travelStyle: 'Family', createdAt: new Date(new Date().setDate(new Date().getDate() - 5)) },
            { name: 'John Doe', email: 'john@example.com', password: 'password123', travelStyle: 'Solo', createdAt: new Date(new Date().setDate(new Date().getDate() - 2)) },
        ];

        for (const u of users) {
            const exists = await User.findOne({ email: u.email });
            if (!exists) await User.create(u);
        }
        console.log('Users seeded.');

        // 2. Fetch Destinations and Users
        const dbUsers = await User.find({ email: { $in: ['sarah@example.com', 'mike@example.com', 'elena@example.com'] } });
        const dbDests = await Destination.find().limit(5);

        if (dbDests.length === 0) {
            console.log('No destinations found. Run seedDestinations first.');
            process.exit();
        }

        // 3. Create Bookings
        const bookings = [
            { user: dbUsers[0]._id, destination: dbDests[0]._id, amount: 1450, status: 'confirmed', createdAt: new Date(new Date().setDate(new Date().getDate() - 12)) },
            { user: dbUsers[1]._id, destination: dbDests[1]._id, amount: 2100, status: 'confirmed', createdAt: new Date(new Date().setDate(new Date().getDate() - 8)) },
            { user: dbUsers[2]._id, destination: dbDests[2]._id, amount: 890, status: 'pending', createdAt: new Date(new Date().setDate(new Date().getDate() - 3)) },
            { user: dbUsers[0]._id, destination: dbDests[3]._id, amount: 3200, status: 'confirmed', createdAt: new Date(new Date().setDate(new Date().getDate() - 1)) },
        ];

        await Booking.insertMany(bookings);
        console.log('Bookings seeded.');

        process.exit();
    } catch (err) {
        console.error('Error seeding dashboard:', err.message);
        process.exit(1);
    }
};

seedDashboard();
