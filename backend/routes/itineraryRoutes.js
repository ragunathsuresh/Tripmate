const express = require('express');
const router = express.Router();
const {
    getItinerary,
    regenerateDay,
    addActivity,
    updateActivity,
    deleteActivity
} = require('../controllers/itineraryController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:tripId', protect, getItinerary);
router.post('/regenerate-day', protect, regenerateDay);
router.post('/add-activity', protect, addActivity);
router.put('/update-activity', protect, updateActivity);
router.delete('/delete-activity', protect, deleteActivity);

module.exports = router;
