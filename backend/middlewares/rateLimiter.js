const rateLimit = require("express-rate-limit");

exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 requests / 15 min
  message: "Too many attempts, try later",
});

exports.generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});
