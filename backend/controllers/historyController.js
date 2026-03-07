const TravelHistory = require('../models/TravelHistory');
const Destination = require('../models/Destination');

// @desc    Record destination view
// @route   POST /api/history/view
// @access  Private
const recordView = async (req, res) => {
    const { destinationId } = req.body;

    try {
        const dest = await Destination.findById(destinationId);
        if (!dest) {
            return res.status(404).json({ message: 'Destination not found' });
        }

        // Check if history already exists for this user and destination
        let history = await TravelHistory.findOne({
            user: req.user._id,
            destination: destinationId
        });

        if (history) {
            // Update the viewed date
            history.viewedDate = Date.now();
            await history.save();
        } else {
            // Create new history record
            history = await TravelHistory.create({
                user: req.user._id,
                destination: destinationId,
                destinationName: dest.name,
                destinationImage: dest.images[0],
                location: `${dest.city}, ${dest.country}`,
                status: 'recentlyViewed'
            });
        }

        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get user travel history
// @route   GET /api/history/user/:userId
// @access  Private
const getUserHistory = async (req, res) => {
    const { userId } = req.params;
    const { status, page = 1, limit = 5 } = req.query;

    try {
        // Ensure user is requesting their own history
        if (userId !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const query = { user: userId };
        if (status) {
            query.status = status;
        }

        const skip = (page - 1) * limit;

        const history = await TravelHistory.find(query)
            .sort({ viewedDate: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await TravelHistory.countDocuments(query);

        res.status(200).json({
            history,
            page: Number(page),
            totalPages: Math.ceil(total / limit),
            totalResults: total
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    recordView,
    getUserHistory
};
