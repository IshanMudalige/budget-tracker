const BaseHandler = require('./BaseHandler');
const BudgetFacade = require('../services/BudgetFacade');

class ExpenseHandler extends BaseHandler {
  async process() {
    // extra busines logic for expenses
    // Update budget after processing expense
    await BudgetFacade.updateBudget(this.transaction.amount, this.userId);
    return this.transaction;
  }
}

module.exports = ExpenseHandler;







