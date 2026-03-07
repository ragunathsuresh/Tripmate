const express = require('express');
const router = express.Router();
const { recordView, getUserHistory } = require('../controllers/historyController');
const { protect } = require('../middleware/authMiddleware');

router.post('/view', protect, recordView);
router.get('/user/:userId', protect, getUserHistory);

module.exports = router;
