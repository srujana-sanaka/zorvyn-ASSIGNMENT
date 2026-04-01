const { query } = require('../config/db');

function buildWhere(filters, params) {
  const clauses = [];

  if (filters.type) {
    params.push(filters.type);
    clauses.push(`t.type = $${params.length}`);
  }

  if (filters.category) {
    params.push(filters.category);
    clauses.push(`t.category = $${params.length}`);
  }

  if (filters.startDate) {
    params.push(filters.startDate);
    clauses.push(`t.date >= $${params.length}`);
  }

  if (filters.endDate) {
    params.push(filters.endDate);
    clauses.push(`t.date <= $${params.length}`);
  }

  return clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
}

const transactionModel = {
  async create({ amount, type, category, date, notes, userId }) {
    const result = await query(
      `
      INSERT INTO transactions (amount, type, category, date, notes, user_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, amount, type, category, date, notes, user_id, created_at
      `,
      [amount, type, category, date, notes || null, userId]
    );
    return result.rows[0];
  },

  async findById(id) {
    const result = await query(
      `
      SELECT id, amount, type, category, date, notes, user_id, created_at, updated_at
      FROM transactions
      WHERE id = $1
      `,
      [id]
    );
    return result.rows[0] || null;
  },

  async update(id, { amount, type, category, date, notes }) {
    const result = await query(
      `
      UPDATE transactions
      SET amount = COALESCE($2, amount),
          type = COALESCE($3, type),
          category = COALESCE($4, category),
          date = COALESCE($5, date),
          notes = COALESCE($6, notes),
          updated_at = NOW()
      WHERE id = $1
      RETURNING id, amount, type, category, date, notes, user_id, created_at, updated_at
      `,
      [id, amount ?? null, type ?? null, category ?? null, date ?? null, notes ?? null]
    );
    return result.rows[0] || null;
  },

  async remove(id) {
    const result = await query(`DELETE FROM transactions WHERE id = $1 RETURNING id`, [id]);
    return result.rows[0] || null;
  },

  async list(filters, { limit = 50, offset = 0 } = {}) {
    const params = [];
    const where = buildWhere(filters || {}, params);

    params.push(limit);
    const limitParam = `$${params.length}`;
    params.push(offset);
    const offsetParam = `$${params.length}`;

    const result = await query(
      `
      SELECT
        t.id, t.amount, t.type, t.category, t.date, t.notes, t.user_id,
        t.created_at, t.updated_at,
        u.email AS created_by_email
      FROM transactions t
      JOIN users u ON u.id = t.user_id
      ${where}
      ORDER BY t.date DESC, t.created_at DESC
      LIMIT ${limitParam} OFFSET ${offsetParam}
      `,
      params
    );
    return result.rows;
  }
};

module.exports = { transactionModel };
