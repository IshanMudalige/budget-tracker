const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {getCategories} = require('../controllers/catController');


router.get('/', protect, getCategories);

module.exports = router;
