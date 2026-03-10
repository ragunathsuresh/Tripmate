const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.profileBio = req.body.profileBio !== undefined ? req.body.profileBio : user.profileBio;
            user.travelStyle = req.body.travelStyle || user.travelStyle;
            user.monthlyBudget = req.body.monthlyBudget !== undefined ? req.body.monthlyBudget : user.monthlyBudget;
            user.topDestinations = req.body.topDestinations || user.topDestinations;
            user.profilePicture = req.body.profilePicture !== undefined ? req.body.profilePicture : user.profilePicture;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                profileBio: updatedUser.profileBio,
                travelStyle: updatedUser.travelStyle,
                monthlyBudget: updatedUser.monthlyBudget,
                topDestinations: updatedUser.topDestinations,
                profilePicture: updatedUser.profilePicture,
                role: updatedUser.role,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (user && (await user.matchPassword(currentPassword))) {
            user.password = newPassword;
            await user.save();
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(401).json({ message: 'Invalid current password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Toggle 2FA
// @route   PUT /api/users/two-factor
// @access  Private
const toggleTwoFactor = async (req, res) => {
    try {
        const { twoFactorEnabled } = req.body;
        const user = await User.findById(req.user._id);

        if (user) {
            user.twoFactorEnabled = twoFactorEnabled;
            await user.save();
            res.json({ message: `Two-factor authentication ${twoFactorEnabled ? 'enabled' : 'disabled'}` });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    changePassword,
    toggleTwoFactor,
};
