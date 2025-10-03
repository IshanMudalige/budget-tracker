const Budget = require("../models/Budget");

const budgetSubject = require('./notification/subject');

class BudgetFacade {

  static async updateBudget(amount, userId) {
    const budget = await Budget.findOne({ userId });
    if (!budget) {
      throw new Error(`Budget data not found`);
    }

    budget.used += amount;
    await budget.save();

    if (budget.used > budget.limit) {
      console.log(`Budget exceeded for user ${userId}`);
      budgetSubject.notify("BUDGET_EXCEEDED", {
        user:{ id: userId },
        message: `⚠️ Budget limit exceeded! ${budget.used} used out of ${budget.limit}`,
      });
    }

    return budget;
  }

  static async getRemaining(userId) {
    const budget = await Budget.findOne({ userId });
    if (!budget) {
      throw new Error("Budget not found");
    }
    return budget.limit - budget.used;
  }

  static async setBudget(userId, amount) {
    let budget = await Budget.findOne({ userId });
    if (!budget) {
      budget = new Budget({ user: userId, limit: amount, used: 0 });
    } else {
      budget.limit = amount;
    }
    await budget.save();
    return budget;
  }

  static async getBudget(userId) {
    const budget = await Budget.findOne({ userId });
    if (!budget) {
      throw new Error("Budget not found");
    }
    return budget;
  }

  static getSubject() {
    return budgetSubject;
  }
}

module.exports = BudgetFacade;
