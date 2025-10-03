const BaseHandler = require('./BaseHandler');

class IncomeHandler extends BaseHandler {
  process() {
    // add extra business logic for income if needed
    return {
      ...this.transaction,
      balanceImpact: this.transaction.amount
    };
  }
}

module.exports = IncomeHandler;







