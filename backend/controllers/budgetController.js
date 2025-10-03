// controllers/budgetController.js
const BudgetFacade = require("../services/budgetFacade");

const withLog = (name) => (handler) => async (req, res, next) => {
  const t0 = Date.now();
  const redact = (o) => {
    try {
      const c = JSON.parse(JSON.stringify(o || {}));
      if (c.password) c.password = "[REDACTED]";
      if (c.token) c.token = "[REDACTED]";
      if (c.authorization) c.authorization = "[REDACTED]";
      return c;
    } catch { return {}; }
  };

  console.log(`[${new Date().toISOString()}] ${name}: START`, {
    path: req.originalUrl,
    method: req.method,
    user: req.user?._id || req.user?.id,
    params: req.params,
    query: req.query,
    body: redact(req.body),
  });

  try {
    await handler(req, res, next);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ${name}: ERROR`, err.message);
    return next ? next(err) : res.status(500).json({ success: false, error: err.message });
  } finally {
    const ms = Date.now() - t0;
    console.log(`[${new Date().toISOString()}] ${name}: END`, {
      status: res.statusCode,
      duration_ms: ms,
    });
  }
};


exports.setBudget = async (req, res) => {
  try {
    const { amount } = req.body;
    const budget = await BudgetFacade.setBudget(req.user._id, amount); // use budget facade to set budget value
    res.json(budget);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}

exports.getRemaining = async (req, res) => {
  try {
    const remaining = await BudgetFacade.getRemaining(req.user._id); // use budget facade to get remaining amount
    res.json({ success: true, remaining });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getBudget = async (req, res) => {
  try {
    const budget = await BudgetFacade.getBudget(req.user._id); // use budget facade to get budget amount
    res.json(budget);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
 
// module.exports = {
//   setBudget: withLog("setBudget")(setBudget),
//   getRemaining: withLog("getRemaining")(getRemaining),
//   getBudget: withLog("getBudget")(getBudget),
// };