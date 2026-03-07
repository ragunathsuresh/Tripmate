const Trip = require('../models/Trip');
const Destination = require('../models/Destination');
const TravelHistory = require('../models/TravelHistory');
const User = require('../models/User');

// @desc    Get user dashboard data
// @route   GET /api/dashboard
// @access  Private
const getUserDashboard = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log('Fetching dashboard for user:', userId);

        // 1. Get user preferences
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 2. Retrieve upcoming trips and populate destination
        const upcomingTrips = await Trip.find({
            user: userId,
            startDate: { $gte: new Date() }
        })
            .sort({ startDate: 1 })
            .populate('destination');

        // 3. Recently searched destinations
        const recentSearches = await TravelHistory.find({
            user: userId,
            status: 'recentlyViewed'
        })
            .sort({ viewedDate: -1 })
            .limit(5);

        // 4. Recommended Destinations
        const recommendations = await Destination.find({
            $or: [
                { category: user.travelStyle },
                { name: { $in: user.topDestinations || [] } }
            ],
            status: 'active'
        })
            .limit(6);

        // 5. Saved Trips
        const savedTrips = await Trip.find({
            user: userId,
            status: { $in: ['planning', 'confirmed'] }
        })
            .limit(4)
            .populate('destination');

        // 6. Map Destinations
        const mapDestinations = recommendations.map(dest => ({
            name: dest.name,
            coordinates: dest.coordinates,
            type: 'recommendation'
        }));

        res.json({
            user: {
                name: user.name,
                upcomingTripsCount: upcomingTrips.length,
                savedDestinationsCount: savedTrips.length
            },
            upcomingTrip: upcomingTrips[0] || null,
            recentSearches: recentSearches || [],
            recommendedDestinations: recommendations || [],
            savedTrips: savedTrips || [],
            mapDestinations: mapDestinations || []
        });

    } catch (error) {
        console.error('Dashboard Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getUserDashboard
};
