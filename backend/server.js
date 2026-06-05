// ==============================================
//  server.js  –  Entry point for the backend
//
//  Connects to MongoDB, registers middleware,
//  mounts routes, starts the HTTP server.
// ==============================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // load .env variables

// Import our custom middleware
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

// Import route files
const expenseRoutes = require("./routes/expenseRoutes");

// ─────────────────────────────────────────────
//  Create Express app
// ─────────────────────────────────────────────
const app = express();

// ─────────────────────────────────────────────
//  Built-in / Third-party Middleware
// ─────────────────────────────────────────────
app.use(cors());                    // allow requests from the React frontend
app.use(express.json());            // parse JSON request bodies
app.use(logger);                    // log every incoming request

// ─────────────────────────────────────────────
//  Routes
// ─────────────────────────────────────────────
app.use("/api/expenses", expenseRoutes);

// Health-check endpoint — useful for testing
app.get("/", (req, res) => {
  res.json({ message: "🚀 Expense Tracker API is running!" });
});

// ─────────────────────────────────────────────
//  Error Handler (must be LAST middleware)
// ─────────────────────────────────────────────
app.use(errorHandler);

// ─────────────────────────────────────────────
//  Connect to MongoDB, then start the server
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
