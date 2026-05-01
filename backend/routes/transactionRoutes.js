const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const auth = require("../middleware/authMiddleware");

// Add transaction
router.post("/", auth, async (req, res) => {
  const transaction = new Transaction({
    ...req.body,
    userId: req.user,
  });

  await transaction.save();
  res.json(transaction);
});

// Get all transactions
router.get("/", auth, async (req, res) => {
  const transactions = await Transaction.find({ userId: req.user });
  res.json(transactions);
});

// Delete transaction
router.delete("/:id", auth, async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;