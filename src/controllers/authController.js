const { authService } = require('../services/authService');
const { asyncHandler } = require('../utils/asyncHandler');

const authController = {
  register: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.register({ email, password });
    res.status(201).json(result);
  }),

  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.status(200).json(result);
  })
};

module.exports = { authController };
