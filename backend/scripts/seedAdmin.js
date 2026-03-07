const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        const adminExists = await User.findOne({ email: 'admin@travelai.com' });

        if (adminExists) {
            console.log('Admin user already exists.');
        } else {
            const admin = await User.create({
                name: 'System Admin',
                email: 'admin@travelai.com',
                password: 'adminpassword123', // This will be hashed by the User model's pre-save hook
                travelStyle: 'Solo',
                role: 'admin'
            });
            console.log('Admin user created successfully:', admin.email);
        }

        process.exit();
    } catch (err) {
        console.error('Error creating admin:', err.message);
        process.exit(1);
    }
};

createAdmin();
