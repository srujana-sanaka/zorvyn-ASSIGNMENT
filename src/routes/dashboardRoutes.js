const express = require('express');
const { query } = require('express-validator');
const { dashboardController } = require('../controllers/dashboardController');
const { requireAuth } = require('../middlewares/requireAuth');
const { requireRole } = require('../middlewares/requireRole');
const { validate } = require('../middlewares/validate');

const router = express.Router();

// Viewer can read dashboard; so can everyone else.
router.get(
  '/summary',
  requireAuth,
  requireRole('admin', 'analyst', 'viewer'),
  [query('recentLimit').optional().isInt({ min: 1, max: 50 })],
  validate,
  dashboardController.summary
);

module.exports = { dashboardRoutes: router };
