const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getTransactions, createTransaction, updateTransaction, deleteTransaction } = require('../controllers/transController');

router.route('/').get( protect, getTransactions).post( protect, createTransaction);
router.route('/:id').put( protect, updateTransaction).delete( protect, deleteTransaction);

module.exports = router;