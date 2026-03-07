const mongoose = require('mongoose');

const travelHistorySchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        destination: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Destination',
        },
        destinationName: {
            type: String,
            required: true,
        },
        destinationImage: {
            type: String,
        },
        location: {
            type: String, // e.g., 'Paris, France'
        },
        status: {
            type: String,
            enum: ['recentlyViewed', 'planned', 'completed'],
            default: 'recentlyViewed',
        },
        viewedDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('TravelHistory', travelHistorySchema);
