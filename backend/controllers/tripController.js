const Destination = require('../models/Destination');
const Trip = require('../models/Trip');
const Itinerary = require('../models/Itinerary');
const TravelHistory = require('../models/TravelHistory');

// @desc    Add destination to user's trip planner
// @route   POST /api/trips/add-destination
// @access  Private
const addDestinationToTrip = async (req, res) => {
    const { destinationId } = req.body;

    if (!destinationId) {
        return res.status(400).json({ message: 'Destination ID is required' });
    }

    try {
        const tripExists = await Trip.findOne({ user: req.user._id, destination: destinationId });

        if (tripExists) {
            return res.status(400).json({ message: 'Destination already in your trip planner' });
        }

        const trip = await Trip.create({
            user: req.user._id,
            destination: destinationId,
            status: 'planning'
        });

        // Record as planned in History
        const dest = await Destination.findById(destinationId);
        if (dest) {
            await TravelHistory.findOneAndUpdate(
                { user: req.user._id, destination: destinationId },
                {
                    status: 'planned',
                    viewedDate: Date.now(),
                    destinationName: dest.name,
                    destinationImage: dest.images[0],
                    location: `${dest.city}, ${dest.country}`
                },
                { upsert: true }
            );
        }

        res.status(201).json({
            success: true,
            message: 'Destination added to trip planner',
            trip
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get user's trips
// @route   GET /api/trips
// @access  Private
const getMyTrips = async (req, res) => {
    try {
        const { status } = req.query;
        let query = { user: req.user._id };

        if (status === 'upcoming') {
            query.status = { $in: ['planning', 'confirmed'] };
        } else if (status === 'past') {
            query.status = 'completed';
        }

        const trips = await Trip.find(query).populate('destination').sort({ createdAt: -1 });
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all trips for a specific user ID
// @route   GET /api/trips/user/:userId
// @access  Private
const getUserTrips = async (req, res) => {
    try {
        const { status } = req.query;
        if (req.params.userId !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to view these trips' });
        }

        let query = { user: req.params.userId };

        if (status === 'upcoming') {
            query.status = { $in: ['planning', 'confirmed'] };
        } else if (status === 'past') {
            query.status = 'completed';
        }

        const trips = await Trip.find(query).populate('destination').sort({ createdAt: -1 });
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get trip by ID with itinerary
// @route   GET /api/trips/:tripId
// @access  Private
const getTripById = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.tripId).populate('destination');
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        const itinerary = await Itinerary.findOne({ trip: trip._id });

        res.status(200).json({ trip, itinerary });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update trip
// @route   PUT /api/trips/:tripId
// @access  Private
const updateTrip = async (req, res) => {
    try {
        let trip = await Trip.findById(req.params.tripId);

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        if (trip.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to update this trip' });
        }

        trip = await Trip.findByIdAndUpdate(req.params.tripId, req.body, {
            new: true,
            runValidators: true,
        }).populate('destination');

        res.status(200).json(trip);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete trip
// @route   DELETE /api/trips/:tripId
// @access  Private
const deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.tripId);

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        if (trip.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to delete this trip' });
        }

        await trip.deleteOne();
        await Itinerary.deleteMany({ trip: req.params.tripId });

        res.status(200).json({ success: true, message: 'Trip and itinerary removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Generate AI Trip Plan
// @route   POST /api/trips/generate
// @access  Private
const generateTripPlan = async (req, res) => {
    const {
        destinationType,
        durationDays,
        budgetLevel,
        interests,
        travelStyle,
        climatePreference
    } = req.body;

    try {
        const query = {
            category: destinationType,
            climate: climatePreference
        };
        console.log('GENERATE: Init Query:', query);

        if (budgetLevel === 'Economy') query.estimatedCostPerDay = { $lte: 150 };
        else if (budgetLevel === 'Comfort') query.estimatedCostPerDay = { $lte: 450 };
        else if (budgetLevel === 'Luxury') query.estimatedCostPerDay = { $gte: 450 };

        let destinations = await Destination.find(query).sort({ rating: -1 });
        console.log(`GENERATE: Found ${destinations.length} matches`);

        if (destinations.length === 0) {
            const fallbackQuery = { category: destinationType };
            if (query.estimatedCostPerDay) fallbackQuery.estimatedCostPerDay = query.estimatedCostPerDay;
            destinations = await Destination.find(fallbackQuery).sort({ rating: -1 });
            console.log(`GENERATE: Fallback 1 found ${destinations.length} matches`);
        }

        if (destinations.length === 0) {
            destinations = await Destination.find({ category: destinationType }).sort({ rating: -1 });
            console.log(`GENERATE: Fallback 2 found ${destinations.length} matches`);
        }

        if (destinations.length === 0) {
            destinations = await Destination.find().sort({ rating: -1 }).limit(1);
            console.log(`GENERATE: Fallback 3 found ${destinations.length} matches`);
        }

        if (destinations.length === 0) {
            console.log('GENERATE: No destinations found even with fallbacks');
            return res.status(404).json({ message: 'No suitable destinations found in our database.' });
        }

        const selectedDest = destinations[0];
        console.log('GENERATE: Selected Dest:', selectedDest.name);

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + Number(durationDays));

        console.log('GENERATE: Creating Trip record...');
        const trip = await Trip.create({
            user: req.user._id,
            destination: selectedDest._id,
            title: `${selectedDest.name} AI Explorer`,
            startDate,
            endDate,
            status: 'planning'
        });
        console.log('GENERATE: Trip created:', trip._id);

        const itineraryDays = [];
        const availableActivities = selectedDest.activities || [];

        console.log(`GENERATE: Generating ${durationDays} days of itinerary...`);
        for (let i = 1; i <= Number(durationDays); i++) {
            const dayActivities = [];

            dayActivities.push({
                time: '09:00 AM',
                activity: availableActivities[i % availableActivities.length]?.title || 'Leisure Morning',
                location: selectedDest.city,
                duration: '2 Hours',
                description: availableActivities[i % availableActivities.length]?.description || 'Relax and enjoy the local vibes.',
                type: availableActivities[i % availableActivities.length]?.type || 'sightseeing'
            });

            dayActivities.push({
                time: '01:00 PM',
                activity: availableActivities[(i + 1) % availableActivities.length]?.title || 'Explore Surroundings',
                location: selectedDest.city,
                duration: '3 Hours',
                description: availableActivities[(i + 1) % availableActivities.length]?.description || 'Walk around and discover hidden gems.',
                type: availableActivities[(i + 1) % availableActivities.length]?.type || 'adventure'
            });

            dayActivities.push({
                time: '07:00 PM',
                activity: availableActivities[(i + 2) % availableActivities.length]?.title || 'Local Dinner',
                location: selectedDest.city,
                duration: '2 Hours',
                description: availableActivities[(i + 2) % availableActivities.length]?.description || 'Taste traditional cuisine.',
                type: 'food'
            });

            itineraryDays.push({
                dayNumber: i,
                activities: dayActivities
            });
        }

        console.log('GENERATE: Creating Itinerary record...');
        const itinerary = await Itinerary.create({
            trip: trip._id,
            destination: selectedDest._id,
            days: itineraryDays
        });
        console.log('GENERATE: Itinerary created:', itinerary._id);

        // Update/Record Travel History as 'planned'
        await TravelHistory.findOneAndUpdate(
            { user: req.user._id, destination: selectedDest._id },
            {
                status: 'planned',
                viewedDate: Date.now(),
                destinationName: selectedDest.name,
                destinationImage: selectedDest.images[0],
                location: `${selectedDest.city}, ${selectedDest.country}`
            },
            { upsert: true, new: true }
        );

        res.status(201).json({
            success: true,
            trip,
            destination: selectedDest,
            itinerary
        });

    } catch (error) {
        console.error('GENERATE TRIP ERROR:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    addDestinationToTrip,
    getMyTrips,
    getUserTrips,
    getTripById,
    updateTrip,
    deleteTrip,
    generateTripPlan
};
