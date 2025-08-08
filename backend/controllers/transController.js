const Transaction = require('../models/Transaction');

const getTransactions = async (req, res) => {
  try {
    let { month, year } = req.query;

    month = parseInt(month, 10);
    year = parseInt(year, 10);

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const transactions = await Transaction.find(
      { user: req.user._id,
        date: { $gte: startDate, $lt: endDate },
      }
    ).populate('category');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: `Failed to fetch transactions ${err}` });
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

const updateTransaction = async (req, res) => {
  try {
    const { amount, type, category, date } = req.body;
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    transaction.amount = amount;
    transaction.type = type;
    transaction.category = category;
    transaction.date = date;
    const updated = await transaction.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update transaction' });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    await transaction.remove();
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete transaction' });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
