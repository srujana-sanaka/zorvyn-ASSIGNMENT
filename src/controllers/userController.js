const { asyncHandler } = require('../utils/asyncHandler');
const { userService } = require('../services/userService');

const userController = {
  createUser: asyncHandler(async (req, res) => {
    const { email, password, role, status } = req.body;
    const user = await userService.createUserAsAdmin({ email, password, role, status });
    res.status(201).json({ user });
  }),

  listUsers: asyncHandler(async (req, res) => {
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    const offset = req.query.offset ? Number(req.query.offset) : 0;
    const users = await userService.listUsers({ limit, offset });
    res.json({ users });
  }),

  updateUser: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { role, status } = req.body;
    const user = await userService.updateUser({ id, role, status });
    res.json({ user });
  })
};

module.exports = { userController };
