const bcrypt = require('bcryptjs');
const { userModel } = require('../models/userModel');
const { AppError } = require('../utils/appError');

const userService = {
  async createUserAsAdmin({ email, password, role, status }) {
    const existing = await userModel.findByEmail(email);
    if (existing) throw new AppError('Email is already registered', 409);

    // Admin-created accounts still need a password; in real systems you'd invite/reset.
    const passwordHash = await bcrypt.hash(password, 12);
    return userModel.create({ email, passwordHash, role, status });
  },

  async listUsers({ limit, offset }) {
    return userModel.list({ limit, offset });
  },

  async updateUser({ id, role, status }) {
    const updated = await userModel.updateStatusAndRole({ id, role, status });
    if (!updated) throw new AppError('User not found', 404);
    return updated;
  }
};

module.exports = { userService };
