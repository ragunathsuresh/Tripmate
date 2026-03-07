const express = require('express');
const router = express.Router();
const { loginAdmin, getDashboardAnalytics } = require('../controllers/adminController');
const {
    getAdminDestinations,
    createDestination,
    updateDestination,
    toggleDestinationStatus,
    deleteDestination
} = require('../controllers/adminDestinationController');
const {
    getAdminUsers,
    createAdminUser,
    updateAdminUser,
    toggleUserStatus,
    deleteAdminUser
} = require('../controllers/adminUserController');
const { adminProtect } = require('../middleware/adminProtect');

// Public route: Admin login
router.post('/login', loginAdmin);

// Protected routes:
router.get('/dashboard', adminProtect, getDashboardAnalytics);

// Manage Destinations
router.get('/destinations', adminProtect, getAdminDestinations);
router.post('/destinations', adminProtect, createDestination);
router.put('/destinations/:id', adminProtect, updateDestination);
router.patch('/destinations/:id/status', adminProtect, toggleDestinationStatus);
router.delete('/destinations/:id', adminProtect, deleteDestination);

// Manage Users
router.get('/users', adminProtect, getAdminUsers);
router.post('/users', adminProtect, createAdminUser);
router.put('/users/:id', adminProtect, updateAdminUser);
router.patch('/users/:id/status', adminProtect, toggleUserStatus);
router.delete('/users/:id', adminProtect, deleteAdminUser);

module.exports = router;
