const { transactionModel } = require('../models/transactionModel');
const { AppError } = require('../utils/appError');

//manage transaction models using transactionModel(create, update,remove,list)
const transactionService = {
  async createTransaction(input) {
    return transactionModel.create(input);
  },

  async listTransactions({ filters, pagination }) {
    return transactionModel.list(filters, pagination);
  },

  async updateTransaction(id, patch) {
    const updated = await transactionModel.update(id, patch);
    if (!updated) throw new AppError('Transaction not found', 404);
    return updated;
  },

  async deleteTransaction(id) {
    const removed = await transactionModel.remove(id);
    if (!removed) throw new AppError('Transaction not found', 404);
    return removed;
  }
};

module.exports = { transactionService };
