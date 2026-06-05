// ==============================================
//  models/Expense.js
//  MongoDB schema for an Expense document
// ==============================================

const mongoose = require("mongoose");

// Define the shape of each expense in the database
const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,              // removes extra spaces
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["Food", "Transport", "Entertainment", "Shopping", "Health", "Utilities", "Education", "Other"],
        message: "{VALUE} is not a valid category",
      },
    },
    date: {
      type: String,           // stored as "YYYY-MM-DD" string for easy filtering
      required: [true, "Date is required"],
    },
  },
  {
    timestamps: true,         // adds createdAt and updatedAt automatically
  }
);

// Export the model so routes can use it
module.exports = mongoose.model("Expense", expenseSchema);
