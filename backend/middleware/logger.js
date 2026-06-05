// ==============================================
//  middleware/logger.js
//  Logs every incoming HTTP request to console
// ==============================================

const logger = (req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}]  ${req.method}  ${req.originalUrl}`);
  next(); // pass control to the next middleware or route
};

module.exports = logger;
