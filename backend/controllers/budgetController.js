// controllers/budgetController.js
const BudgetFacade = require("../services/budgetFacade");


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
 