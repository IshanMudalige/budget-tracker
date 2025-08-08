const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({
    catId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    name: { type: String },
    icon: { type: String },
    color: { type: String },
    type: { type: String },
});

module.exports = mongoose.model('Category', catSchema);
