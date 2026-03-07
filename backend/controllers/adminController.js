const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Destination = require('../models/Destination');
const Trip = require('../models/Trip');
const Booking = require('../models/Booking');

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
    const { loginId, password } = req.body; // loginId can be email or username (name in our case)

    // 1. Validate fields
    if (!loginId || !password) {
        return res.status(400).json({ message: 'Please add credentials' });
    }

    try {
        // 2. Find user by email or name (as username)
        const user = await User.findOne({
            $or: [{ email: loginId }, { name: loginId }]
        });

        // 3. Ensure user exists and is an admin
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized: Admin access only' });
        }

        // 4. Compare password
        if (await user.matchPassword(password)) {
            // 5. Generate token with id and role
            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
            );

            // 6. Return admin info and token
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get dashboard analytics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getDashboardAnalytics = async (req, res) => {
    try {
        // 1. Basic Stats
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalDestinations = await Destination.countDocuments();
        const totalBookingsCount = await Booking.countDocuments();

        const revenueResult = await Booking.aggregate([
            { $match: { status: 'confirmed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const grossRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // 2. User Growth (Last 30 Days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const userGrowthData = await User.aggregate([
            {
                $match: {
                    role: 'user',
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // 3. Popular Destinations
        const popularDestinations = await Booking.aggregate([
            {
                $group: {
                    _id: "$destination",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "destinations",
                    localField: "_id",
                    foreignField: "_id",
                    as: "details"
                }
            },
            { $unwind: "$details" },
            {
                $project: {
                    name: "$details.name",
                    country: "$details.country",
                    visits: "$count"
                }
            }
        ]);

        // 4. Recent Bookings (Latest 10)
        const recentBookings = await Booking.find()
            .populate('user', 'name email')
            .populate('destination', 'name country')
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            stats: {
                totalUsers,
                totalDestinations,
                totalBookings: totalBookingsCount,
                grossRevenue
            },
            userGrowthData,
            popularDestinations,
            recentBookings
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    loginAdmin,
    getDashboardAnalytics
};
