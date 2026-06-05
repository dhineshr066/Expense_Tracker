// ==============================================
//  middleware/errorHandler.js
//  Central error handler — catches any error
//  thrown in routes and returns a clean JSON
// ==============================================

const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.message);

  // Mongoose validation error (e.g. missing required field)
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, error: messages.join(", ") });
  }

  // Mongoose bad ObjectId (e.g. /api/expenses/not-a-valid-id)
  if (err.name === "CastError") {
    return res.status(400).json({ success: false, error: "Invalid expense ID format" });
  }

  // Default: 500 Internal Server Error
  res.status(500).json({ success: false, error: err.message || "Server Error" });
};

module.exports = errorHandler;
