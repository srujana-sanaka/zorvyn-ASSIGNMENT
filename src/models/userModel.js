const { query } = require('../config/db');


//creating user model to insert user data in db 
const userModel = {
  async create({ email, passwordHash, role, status }) {
    const result = await query(
      `
      INSERT INTO users (email, password_hash, role, status)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, role, status, created_at
      `,
      [email, passwordHash, role, status]
    );
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await query(
      `
      SELECT id, email, password_hash, role, status, created_at
      FROM users
      WHERE email = $1
      `,
      [email]
    );
    return result.rows[0] || null;
  },

  async findById(id) {
    const result = await query(
      `
      SELECT id, email, role, status, created_at
      FROM users
      WHERE id = $1
      `,
      [id]
    );
    return result.rows[0] || null;
  },

  // using password_hash only when required(login) to avoid unneccsary exposing 
  async findAuthById(id) {
    const result = await query(
      `
      SELECT id, email, password_hash, role, status, created_at
      FROM users
      WHERE id = $1
      `,
      [id]
    );
    return result.rows[0] || null;
  },

  async list({ limit = 50, offset = 0 }) {
    const result = await query(
      `
      SELECT id, email, role, status, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    );
    return result.rows;
  },

  async updateStatusAndRole({ id, role, status }) {
    const result = await query(
      `
      UPDATE users
      SET role = COALESCE($2, role),
          status = COALESCE($3, status),
          updated_at = NOW()
      WHERE id = $1
      RETURNING id, email, role, status, created_at
      `,
      [id, role || null, status || null]
    );
    return result.rows[0] || null;
  }
};

module.exports = { userModel };
