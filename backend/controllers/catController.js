const Category = require('../models/Category');

const getCategories = async (
    req,
    res) => {
    try {
        const cats = await Category.find();
        res.json(cats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCategories };