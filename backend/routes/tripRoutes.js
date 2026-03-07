const express = require('express');
const router = express.Router();
const {
    addDestinationToTrip,
    getMyTrips,
    getUserTrips,
    getTripById,
    updateTrip,
    deleteTrip,
    generateTripPlan
} = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

router.post('/add-destination', protect, addDestinationToTrip);
router.post('/generate', protect, generateTripPlan);
router.get('/', protect, getMyTrips);
router.get('/user/:userId', protect, getUserTrips);
router.get('/:tripId', protect, getTripById);
router.put('/:tripId', protect, updateTrip);
router.delete('/:tripId', protect, deleteTrip);

module.exports = router;
