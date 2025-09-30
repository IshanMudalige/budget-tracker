// routes/budgetRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const budgetController = require("../controllers/budgetController");

router.get("/remaining", protect, budgetController.getRemaining);
router.get("/", protect, budgetController.getBudget);
router.post("/set", protect, budgetController.setBudget);

module.exports = router;
