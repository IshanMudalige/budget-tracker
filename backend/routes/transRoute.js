const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getTransactions, createTransaction } = require('../controllers/transController');

router.route('/').get( protect, getTransactions);
router.route('/').post( protect, createTransaction);

module.exports = router;