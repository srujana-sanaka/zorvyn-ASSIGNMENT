const { validationResult } = require('express-validator');
const { AppError } = require('../utils/appError');

function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const details = result.array().map((e) => ({
    field: e.path,
    message: e.msg
  }));

  next(new AppError('Validation failed', 422, details));
}

module.exports = { validate };
