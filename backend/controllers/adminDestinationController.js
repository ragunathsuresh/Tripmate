const Destination = require('../models/Destination');

// @desc    Get all destinations with pagination and filters
// @route   GET /api/admin/destinations
// @access  Private (Admin)
const getAdminDestinations = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { search, category, status } = req.query;
        let query = {};

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        if (category && category !== 'All') {
            query.category = category;
        }
        if (status && status !== 'All') {
            query.status = status;
        }

        const total = await Destination.countDocuments(query);
        const destinations = await Destination.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Stats for the UI
        const totalDestinations = await Destination.countDocuments();
        const topRatedResult = await Destination.aggregate([
            { $group: { _id: null, avgRating: { $avg: '$rating' } } }
        ]);
        const avgRating = topRatedResult.length > 0 ? topRatedResult[0].avgRating.toFixed(2) : 0;
        const missingMediaCount = await Destination.countDocuments({
            $or: [{ images: { $size: 0 } }, { images: { $exists: false } }]
        });

        res.json({
            destinations,
            page,
            totalPages: Math.ceil(total / limit),
            totalResults: total,
            stats: {
                totalDestinations,
                avgRating,
                missingMedia: missingMediaCount
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a new destination
// @route   POST /api/admin/destinations
// @access  Private (Admin)
const createDestination = async (req, res) => {
    try {
        const destination = await Destination.create(req.body);
        res.status(201).json(destination);
    } catch (error) {
        res.status(400).json({ message: 'Invalid destination data', error: error.message });
    }
};

// @desc    Update a destination
// @route   PUT /api/admin/destinations/:id
// @access  Private (Admin)
const updateDestination = async (req, res) => {
    try {
        const destination = await Destination.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }

        res.json(destination);
    } catch (error) {
        res.status(400).json({ message: 'Update failed', error: error.message });
    }
};

// @desc    Toggle destination status
// @route   PATCH /api/admin/destinations/:id/status
// @access  Private (Admin)
const toggleDestinationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const destination = await Destination.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }

        res.json(destination);
    } catch (error) {
        res.status(400).json({ message: 'Status update failed', error: error.message });
    }
};

// @desc    Delete a destination
// @route   DELETE /api/admin/destinations/:id
// @access  Private (Admin)
const deleteDestination = async (req, res) => {
    try {
        const destination = await Destination.findByIdAndDelete(req.params.id);

        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }

        res.json({ message: 'Destination removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getAdminDestinations,
    createDestination,
    updateDestination,
    toggleDestinationStatus,
    deleteDestination,
};
