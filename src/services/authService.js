const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { userModel } = require('../models/userModel');
const { AppError } = require('../utils/appError');

const DEFAULT_REGISTER_ROLE = 'viewer';
const DEFAULT_REGISTER_STATUS = 'active';

function signToken(userId) {
  return jwt.sign({ sub: userId }, env.jwt.secret, { expiresIn: env.jwt.expiresIn });
}

const authService = {
  async register({ email, password }) {
    const existing = await userModel.findByEmail(email);
    if (existing) throw new AppError('Email is already registered', 409);

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await userModel.create({
      email,
      passwordHash,
      role: DEFAULT_REGISTER_ROLE,
      status: DEFAULT_REGISTER_STATUS
    });

    const token = signToken(user.id);
    return { user, token };
  },

  async login({ email, password }) {
    const user = await userModel.findByEmail(email);
    if (!user) throw new AppError('Invalid email or password', 401);
    if (user.status !== 'active') throw new AppError('User is inactive', 403);

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw new AppError('Invalid email or password', 401);

    const token = signToken(user.id);
    const safeUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      created_at: user.created_at
    };

    return { user: safeUser, token };
  }
};

module.exports = { authService };
