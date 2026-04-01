const { AppError } = require('../utils/appError');

function requireRole(...allowedRoles) {
  const allowed = new Set(allowedRoles);

  return function roleGuard(req, res, next) {
    if (!req.user) return next(new AppError('Unauthorized', 401));
    if (!allowed.has(req.user.role)) {
      return next(new AppError('Forbidden: insufficient role', 403));
    }
    next();
  };
}

module.exports = { requireRole };
