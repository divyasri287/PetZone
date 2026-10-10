const { validationResult } = require('express-validator');

// Middleware to handle express-validator result errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return res.status(400).json({
      message: messages[0], // First error for clean UX
      errors: messages,
    });
  }
  next();
};

module.exports = validate;
