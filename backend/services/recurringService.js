const Transaction = require('../models/Transaction');

class RecurringService {
  async processRecurringTransactions() {
    try {
      const now = new Date();

      const recurringTxs = await Transaction.find({
        isRecurring: true,
        "recurrenceRule.nextRun": { $lte: now }
      });

      for (let tx of recurringTxs) {
        //Clone new transaction (Prototype Pattern)
        const newTx = tx.cloneForNextRun();
        await newTx.save();

        switch (tx.recurrenceRule.frequency) {
          case 'daily':
            tx.recurrenceRule.nextRun.setDate(
              tx.recurrenceRule.nextRun.getDate() + tx.recurrenceRule.interval
            );
            break;
          case 'weekly':
            tx.recurrenceRule.nextRun.setDate(
              tx.recurrenceRule.nextRun.getDate() + 7 * tx.recurrenceRule.interval
            );
            break;
          case 'monthly':
            tx.recurrenceRule.nextRun.setMonth(
              tx.recurrenceRule.nextRun.getMonth() + tx.recurrenceRule.interval
            );
            break;
          case 'yearly':
            tx.recurrenceRule.nextRun.setFullYear(
              tx.recurrenceRule.nextRun.getFullYear() + tx.recurrenceRule.interval
            );
            break;
        }

        await tx.save();
      }

      console.log(`Processed ${recurringTxs.length} recurring transactions.`);
    } catch (err) {
      console.error('Error processing recurring transactions:', err);
    }
  }
}

module.exports = new RecurringService();
