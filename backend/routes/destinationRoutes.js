const express = require('express');
const router = express.Router();
const {
    getDestinations,
    searchDestinations,
    getFeaturedDestinations,
    getDestinationById,
    exploreDestinations,
} = require('../controllers/destinationController');

router.get('/', getDestinations);
router.get('/featured', getFeaturedDestinations);
router.get('/explore', exploreDestinations);
router.get('/search', searchDestinations);
router.get('/:id', getDestinationById);

module.exports = router;
