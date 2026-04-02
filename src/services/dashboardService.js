const { query } = require('../config/db');
//calculate total both based on income and expense and find balance
const dashboardService = {
  async getSummary({ recentLimit = 10 } = {}) {
    const totalsResult = await query(
      `
      SELECT
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount END), 0)::numeric(14,2) AS total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount END), 0)::numeric(14,2) AS total_expenses
      FROM transactions
      `
    );

    const totals = totalsResult.rows[0];
    const netBalance = Number(totals.total_income) - Number(totals.total_expenses);

    //category(food,entertainment) and type(income, expense) based total
    const categoryTotalsResult = await query(
      `
      SELECT
        category,
        type,
        COALESCE(SUM(amount), 0)::numeric(14,2) AS total
      FROM transactions
      GROUP BY category, type
      ORDER BY category ASC, type ASC
      `
    );
//get latest data 
    const recentResult = await query(
      `
      SELECT id, amount, type, category, date, notes, user_id, created_at
      FROM transactions
      ORDER BY date DESC, created_at DESC
      LIMIT $1
      `,
      [recentLimit]
    );

    // total money based on based on date
    const monthlyTrendsResult = await query(
      `
      SELECT
        to_char(date_trunc('month', date), 'YYYY-MM') AS month,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount END), 0)::numeric(14,2) AS income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount END), 0)::numeric(14,2) AS expenses
      FROM transactions
      GROUP BY date_trunc('month', date)
      ORDER BY date_trunc('month', date) ASC
      `
    );

    return {
      totals: {
        totalIncome: totals.total_income,
        totalExpenses: totals.total_expenses,
        netBalance: netBalance.toFixed(2)
      },
      categoryTotals: categoryTotalsResult.rows,
      recentTransactions: recentResult.rows,
      monthlyTrends: monthlyTrendsResult.rows
    };
  }
};

module.exports = { dashboardService };
