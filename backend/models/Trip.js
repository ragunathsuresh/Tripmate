const mongoose = require('mongoose');

const tripSchema = mongoose.Schema(
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
        title: {
            type: String,
            default: function () {
                return 'Untitled Trip';
            }
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['planning', 'confirmed', 'completed'],
            default: 'planning',
        },
        referenceId: {
            type: String,
            unique: true,
            default: function () {
                return 'TRP' + Math.random().toString(36).substr(2, 6).toUpperCase();
            }
        },
    },
    {
        timestamps: true,
    }
);

// Pre-save hook to set title if missing
tripSchema.pre('save', async function () {
    if (!this.title || this.title === 'Untitled Trip') {
        try {
            const Destination = mongoose.model('Destination');
            const dest = await Destination.findById(this.destination);
            if (dest) {
                this.title = `${dest.name} Getaway`;
            }
        } catch (error) {
            console.error('Error setting trip title:', error);
        }
    }
});

module.exports = mongoose.model('Trip', tripSchema);
