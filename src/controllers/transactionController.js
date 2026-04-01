const { asyncHandler } = require('../utils/asyncHandler');
const { transactionService } = require('../services/transactionService');

function parsePagination(query) {
  const limit = query.limit ? Number(query.limit) : 50;
  const offset = query.offset ? Number(query.offset) : 0;
  return { limit, offset };
}

const transactionController = {
  create: asyncHandler(async (req, res) => {
    const { amount, type, category, date, notes, user_id } = req.body;

    const tx = await transactionService.createTransaction({
      amount,
      type,
      category,
      date,
      notes,
      // For audit: allow admin to specify user_id, otherwise default to self.
      userId: user_id || req.user.id
    });

    res.status(201).json({ transaction: tx });
  }),

  list: asyncHandler(async (req, res) => {
    const filters = {
      type: req.query.type,
      category: req.query.category,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };

    const transactions = await transactionService.listTransactions({
      filters,
      pagination: parsePagination(req.query)
    });

    res.json({ transactions });
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { amount, type, category, date, notes } = req.body;
    const updated = await transactionService.updateTransaction(id, { amount, type, category, date, notes });
    res.json({ transaction: updated });
  }),

  remove: asyncHandler(async (req, res) => {
    const { id } = req.params;
    await transactionService.deleteTransaction(id);
    res.status(204).send();
  })
};

module.exports = { transactionController };
