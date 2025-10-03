const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, },
  limit: Number,
  used: { type: Number, default: 0 },
});

module.exports = mongoose.model("Budget", budgetSchema);