const express = require('express');
const { body, param, query } = require('express-validator');
const { transactionController } = require('../controllers/transactionController');
const { requireAuth } = require('../middlewares/requireAuth');
const { requireRole } = require('../middlewares/requireRole');
const { validate } = require('../middlewares/validate');

const router = express.Router();

// Analyst/Admin can view; only Admin can mutate.
router.get(
  '/',
  requireAuth,
  requireRole('admin', 'analyst'),
  [
    query('type').optional().isIn(['income', 'expense']),
    query('category').optional().isString().trim().isLength({ min: 1, max: 60 }),
    query('startDate').optional().isISO8601().toDate(),
    query('endDate').optional().isISO8601().toDate(),
    query('limit').optional().isInt({ min: 1, max: 200 }),
    query('offset').optional().isInt({ min: 0 })
  ],
  validate,
  transactionController.list
);

router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  [
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
    body('category').isString().trim().isLength({ min: 1, max: 60 }).withMessage('Category is required'),
    body('date').isISO8601().withMessage('Date must be a valid ISO date').toDate(),
    body('notes').optional().isString().trim().isLength({ max: 500 }),
    body('user_id').optional().isUUID().withMessage('user_id must be a UUID')
  ],
  validate,
  transactionController.create
);

router.patch(
  '/:id',
  requireAuth,
  requireRole('admin'),
  [
    param('id').isUUID().withMessage('Transaction id must be a UUID'),
    body('amount').optional().isNumeric(),
    body('type').optional().isIn(['income', 'expense']),
    body('category').optional().isString().trim().isLength({ min: 1, max: 60 }),
    body('date').optional().isISO8601().toDate(),
    body('notes').optional().isString().trim().isLength({ max: 500 })
  ],
  validate,
  transactionController.update
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('admin'),
  [param('id').isUUID().withMessage('Transaction id must be a UUID')],
  validate,
  transactionController.remove
);

module.exports = { transactionRoutes: router };
