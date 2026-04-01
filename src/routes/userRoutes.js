const express = require('express');
const { body, param, query } = require('express-validator');
const { userController } = require('../controllers/userController');
const { requireAuth } = require('../middlewares/requireAuth');
const { requireRole } = require('../middlewares/requireRole');
const { validate } = require('../middlewares/validate');

const router = express.Router();

// Admin only
router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isString().isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('role').isIn(['admin', 'analyst', 'viewer']).withMessage('Role must be admin, analyst, or viewer'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive')
  ],
  validate,
  userController.createUser
);

router.get(
  '/',
  requireAuth,
  requireRole('admin'),
  [query('limit').optional().isInt({ min: 1, max: 200 }), query('offset').optional().isInt({ min: 0 })],
  validate,
  userController.listUsers
);

router.patch(
  '/:id',
  requireAuth,
  requireRole('admin'),
  [
    param('id').isUUID().withMessage('User id must be a UUID'),
    body('role').optional().isIn(['admin', 'analyst', 'viewer']),
    body('status').optional().isIn(['active', 'inactive'])
  ],
  validate,
  userController.updateUser
);

module.exports = { userRoutes: router };
