
const express = require('express');
const { registerUser, loginUser, updateUserProfile, getProfile, updateBudget } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// router.use(reqLogger);

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/updateBudget', protect, updateBudget);

module.exports = router;
