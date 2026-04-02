const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { AppError } = require('../utils/appError');
const { userModel } = require('../models/userModel');

//middleawre for authetication
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return next(new AppError('Missing or invalid Authorization header', 401));
    }

    const token = header.slice('Bearer '.length).trim();
    let decoded;
    try {
      decoded = jwt.verify(token, env.jwt.secret);
    } catch {
      return next(new AppError('Invalid or expired token', 401));
    }

    const user = await userModel.findById(decoded.sub);
    if (!user) return next(new AppError('User not found', 401));
    if (user.status !== 'active') return next(new AppError('User is inactive', 403));

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status
    };

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { requireAuth };
