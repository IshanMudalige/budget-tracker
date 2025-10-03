const IncomeHandler = require('./incomeHandler');
const ExpenseHandler = require('./expenseHandler');

class HandlerFactory {
    static createHandler(transaction, userId) {
        if (transaction.type === 'income') { 
            return new IncomeHandler(transaction, userId); 
        }

        if (transaction.type === 'expense') { 
            return new ExpenseHandler(transaction, userId); 
        }
        
        throw new Error("Unknown transaction type");
    }
}

module.exports = HandlerFactory;

