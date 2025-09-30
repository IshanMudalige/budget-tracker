const mongoose = require('mongoose');

const recurrenceRuleSchema = new mongoose.Schema({
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'fortnightly', 'monthly'],
    required: true
  },
  interval: { type: Number, default: 1 },
  endDate: { type: Date },
  nextRun: { type: Date, required: true }
}, { _id: false });

const transactionSchema = new mongoose.Schema({
    amount: { type: Number, required: true, },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, },
    note: { type: String, },
    date: { type: Date, required: true, },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, },

    isRecurring: { type: Boolean, default: false },
  recurrenceRule: { type: recurrenceRuleSchema, default: null }
}, { timestamps: true });

// Prototype method for cloning recurring transaction
transactionSchema.methods.cloneForNextRun = function () {
  const clone = this.toObject();
  delete clone._id; 
  clone.date = this.recurrenceRule.nextRun; 
  clone.isRecurring = false; 
  clone.recurrenceRule = null;
  return new this.constructor(clone);
};

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
