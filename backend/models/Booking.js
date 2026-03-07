const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
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
        trip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Trip',
        },
        bookingDate: {
            type: Date,
            default: Date.now,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ['pending', 'confirmed', 'cancelled'],
            default: 'pending',
        },
        paymentId: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Booking', bookingSchema);
