// ==============================================
//  routes/expenseRoutes.js
//  REST API routes for expenses
//
//  GET    /api/expenses        → get all
//  POST   /api/expenses        → add new
//  PUT    /api/expenses/:id    → update one
//  DELETE /api/expenses/:id    → delete one
// ==============================================

const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// ─────────────────────────────────────────────
//  GET /api/expenses
//  Returns all expenses, newest first.
//  Optional query: ?category=Food  ?month=2024-08
// ─────────────────────────────────────────────
router.get("/", async (req, res, next) => {
  try {
    const filter = {};

    // Filter by category if provided in query string
    if (req.query.category && req.query.category !== "All") {
      filter.category = req.query.category;
    }

    // Filter by month (expects "YYYY-MM" format)
    if (req.query.month && req.query.month !== "All") {
      filter.date = { $regex: `^${req.query.month}` };
    }

    const expenses = await Expense.find(filter).sort({ date: -1, createdAt: -1 });

    res.json({ success: true, count: expenses.length, data: expenses });
  } catch (err) {
    next(err); // pass to errorHandler middleware
  }
});

// ─────────────────────────────────────────────
//  POST /api/expenses
//  Creates a new expense.
//  Body: { title, amount, category, date }
// ─────────────────────────────────────────────
router.post("/", async (req, res, next) => {
  try {
    const { title, amount, category, date } = req.body;

    const expense = await Expense.create({ title, amount, category, date });

    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────
//  PUT /api/expenses/:id
//  Updates an existing expense by its MongoDB _id.
//  Body: any subset of { title, amount, category, date }
// ─────────────────────────────────────────────
router.put("/:id", async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,            // return the updated document
        runValidators: true,  // re-run schema validation on update
      }
    );

    if (!expense) {
      return res.status(404).json({ success: false, error: "Expense not found" });
    }

    res.json({ success: true, data: expense });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────
//  DELETE /api/expenses/:id
//  Deletes an expense by its MongoDB _id.
// ─────────────────────────────────────────────
router.delete("/:id", async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({ success: false, error: "Expense not found" });
    }

    res.json({ success: true, message: "Expense deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
