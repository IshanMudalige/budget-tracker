const Transaction = require('../models/Transaction');

const withLog = (name) => (handler) => async (req, res, next) => {
  const t0 = Date.now();
  const safe = (o = {}) => {
    try {
      const c = JSON.parse(JSON.stringify(o));
      ['password','token','authorization'].forEach(k => { if (k in c) c[k] = '[REDACTED]'; });
      return c;
    } catch { return {}; }
  };

  console.log(`[${new Date().toISOString()}] ${name}: START`, {
    path: req.originalUrl,
    method: req.method,
    user: req.user?._id || req.user?.id || 'anon',
    params: req.params,
    query: req.query,
    body: safe(req.body),
  });

  try {
    await handler(req, res, next);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ${name}: ERROR`, err.message);
    return next ? next(err) : res.status(500).json({ error: err.message });
  } finally {
    console.log(`[${new Date().toISOString()}] ${name}: END`, {
      status: res.statusCode,
      duration_ms: Date.now() - t0,
    });
  }
};

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
    const { amount, type, category, date, note } = req.body;

    const newTransaction = new Transaction({
      amount,
      type,
      category,
      date,
      note,
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
    const { amount, type, category, date, note } = req.body;
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    transaction.amount = amount;
    transaction.type = type;
    transaction.category = category;
    transaction.date = date;
    transaction.note = note;
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
  getTransactions: withLog('getTransactions')(getTransactions),
  createTransaction: withLog('createTransaction')(createTransaction),
  updateTransaction: withLog('updateTransaction')(updateTransaction),
  deleteTransaction: withLog('deleteTransaction')(deleteTransaction),
};
