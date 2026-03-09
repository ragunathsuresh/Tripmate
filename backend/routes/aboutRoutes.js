const express = require('express');
const router = express.Router();
const { getAboutContent, updateAboutContent } = require('../controllers/aboutController');
const { protect } = require('../middleware/authMiddleware');
const { adminProtect } = require('../middleware/adminProtect');

// Public
router.get('/', getAboutContent);

// Admin only
router.put('/', protect, adminProtect, updateAboutContent);

module.exports = router;
