const mongoose = require('mongoose');

const destinationSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a destination name'],
            trim: true,
        },
        country: {
            type: String,
            required: [true, 'Please add a country'],
        },
        city: {
            type: String,
            required: [true, 'Please add a city'],
        },
        category: {
            type: String,
            required: [true, 'Please select a category'],
            enum: ['Beach', 'Mountain', 'City', 'Historical', 'Adventure', 'Hill', 'Wildlife', 'Wellness', 'Luxury', 'Cultural', 'RoadTrip'],
        },
        climate: {
            type: String,
            enum: ['Tropical', 'Moderate', 'Cold', 'Arid', 'Rainy', 'Coastal', 'Arctic', 'Alpine', 'Humid'],
            default: 'Moderate',
        },
        travelStyle: {
            type: String,
            enum: ['Solo', 'Couple', 'Family', 'Business', 'Cruise', 'Adventure'],
            default: 'Solo',
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        estimatedBudget: {
            type: Number,
            required: [true, 'Please add an estimated total budget'],
        },
        estimatedCostPerDay: {
            type: Number,
            required: [true, 'Please add an estimated cost per day'],
        },
        bestTimeToVisit: {
            type: String,
        },
        images: [
            {
                type: String,
            },
        ],
        coordinates: {
            lat: { type: Number },
            lng: { type: Number },
        },
        activities: [
            {
                title: { type: String, required: true },
                description: { type: String, required: true },
                type: {
                    type: String,
                    enum: ['food', 'nature', 'adventure', 'sightseeing'],
                    required: true
                },
            }
        ],
        status: {
            type: String,
            enum: ['active', 'hidden'],
            default: 'active',
        },
        visitorsPerMonth: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Index for searching
destinationSchema.index({ name: 'text', country: 'text', category: 'text' });

module.exports = mongoose.model('Destination', destinationSchema);
