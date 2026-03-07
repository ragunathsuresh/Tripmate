const mongoose = require('mongoose');

const itinerarySchema = mongoose.Schema(
    {
        trip: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Trip',
        },
        destination: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Destination',
        },
        days: [
            {
                dayNumber: { type: Number, required: true },
                activities: [
                    {
                        time: { type: String }, // e.g., '09:00 AM'
                        activity: { type: String, required: true },
                        location: { type: String },
                        duration: { type: String },
                        description: { type: String },
                        type: { type: String }, // e.g., 'culture', 'food', 'nature', 'adventure'
                        notes: { type: String },
                    },
                ],
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Itinerary', itinerarySchema);
