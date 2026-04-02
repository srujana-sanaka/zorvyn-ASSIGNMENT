class AppError extends Error {
  constructor(message, statusCode, details) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode || 500;
    this.details = details;
  }
}
// AppError lets you throw structured errors with message, status code, and details
module.exports = { AppError };
