const Transaction = require('../models/Transaction');

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).populate('category');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { amount, type, category, date } = req.body;

    const newTransaction = new Transaction({
      amount,
      type,
      category,
      date,
      user: req.user._id,
    });

    const saved = await newTransaction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create transaction' });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
};
