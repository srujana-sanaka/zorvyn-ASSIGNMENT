const { AppError } = require('../utils/appError');
const { env } = require('../config/env');
const { logger } = require('../utils/logger');
//handling of errors 
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  if (statusCode >= 500) {
    logger.error('Unhandled error', {
      message: err.message,
      path: req.originalUrl,
      method: req.method
    });
  }

  const payload = {
    error: {
      message: err instanceof AppError ? err.message : 'Something went wrong'
    }
  };

  if (err instanceof AppError && err.details) {
    payload.error.details = err.details;
  }

  if (env.nodeEnv !== 'production') {
    payload.error.debug = { message: err.message, stack: err.stack };
  }

  res.status(statusCode).json(payload);
}

module.exports = { errorHandler };
