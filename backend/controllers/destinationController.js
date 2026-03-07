const Destination = require('../models/Destination');

// @desc    Get all destinations with pagination/filtering
// @route   GET /api/destinations
// @access  Public
const getDestinations = async (req, res) => {
    const { category, minRating, maxBudget, page = 1, limit = 10 } = req.query;

    const query = {};

    if (category) {
        query.category = category;
    }

    if (minRating) {
        query.rating = { $gte: Number(minRating) };
    }

    if (maxBudget) {
        query.estimatedBudget = { $lte: Number(maxBudget) };
    }

    try {
        const skip = (page - 1) * limit;

        const destinations = await Destination.find(query)
            .limit(Number(limit))
            .skip(skip)
            .sort({ createdAt: -1 });

        const totalCount = await Destination.countDocuments(query);

        res.status(200).json({
            destinations,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: Number(page),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Search destinations
// @route   GET /api/destinations/search
// @access  Public
const searchDestinations = async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ message: 'Search term "q" is required' });
    }

    try {
        const destinations = await Destination.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { country: { $regex: q, $options: 'i' } },
                { category: { $regex: q, $options: 'i' } },
            ],
        });

        res.status(200).json(destinations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get top rated featured destinations
// @route   GET /api/destinations/featured
// @access  Public
const getFeaturedDestinations = async (req, res) => {
    try {
        const destinations = await Destination.find().sort({ rating: -1 }).limit(6);
        res.status(200).json(destinations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get destination by ID
// @route   GET /api/destinations/:id
// @access  Public
const getDestinationById = async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);

        if (destination) {
            res.status(200).json(destination);
        } else {
            res.status(404).json({ message: 'Destination not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Explore destinations with advanced filters
// @route   GET /api/destinations/explore
// @access  Public
const exploreDestinations = async (req, res) => {
    const {
        search,
        category,
        budgetMin,
        budgetMax,
        climate,
        rating,
        sort,
        page = 1,
        limit = 9
    } = req.query;

    const query = {};

    // 1. Filter by search term (name or country)
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { country: { $regex: search, $options: 'i' } }
        ];
    }

    // 2. Filter by category
    if (category) {
        query.category = category;
    }

    // 3. Filter by budget range
    if (budgetMin || budgetMax) {
        query.estimatedBudget = {};
        if (budgetMin) query.estimatedBudget.$gte = Number(budgetMin);
        if (budgetMax) query.estimatedBudget.$lte = Number(budgetMax);
    }

    // 4. Filter by climate
    if (climate) {
        query.climate = climate;
    }

    // 5. Filter by minimum rating
    if (rating) {
        query.rating = { $gte: Number(rating) };
    }

    try {
        // 6. Sorting
        let sortQuery = { createdAt: -1 }; // Default
        if (sort === 'rating') sortQuery = { rating: -1 };
        if (sort === 'budget-low') sortQuery = { estimatedBudget: 1 };
        if (sort === 'budget-high') sortQuery = { estimatedBudget: -1 };
        if (sort === 'popularity') sortQuery = { rating: -1 };

        const skip = (Number(page) - 1) * Number(limit);

        const destinations = await Destination.find(query)
            .sort(sortQuery)
            .limit(Number(limit))
            .skip(skip);

        const totalResults = await Destination.countDocuments(query);

        res.status(200).json({
            success: true,
            count: destinations.length,
            totalResults,
            totalPages: Math.ceil(totalResults / Number(limit)),
            currentPage: Number(page),
            destinations
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

module.exports = {
    getDestinations,
    searchDestinations,
    getFeaturedDestinations,
    getDestinationById,
    exploreDestinations,
};
