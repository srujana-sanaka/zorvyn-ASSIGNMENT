const { Pool } = require('pg');
const { env } = require('./env');
const { logger } = require('../utils/logger');

//making connection to databse string
const pool = new Pool(
  env.databaseUrl
    ? { connectionString: env.databaseUrl, ssl: env.nodeEnv === 'production' ? { rejectUnauthorized: false } : false }
    : {
        host: env.pg.host,
        port: env.pg.port,
        database: env.pg.database,
        user: env.pg.user,
        password: env.pg.password
      }
);

//handles if any error occurred in restarting the db
pool.on('error', (err) => {
  logger.error('Unexpected PG pool error', { message: err.message });
});

//checks query time for fetching from database{helps to find slow queries and optimize db performance}
async function query(text, params) {
  const startedAt = Date.now();
  const result = await pool.query(text, params);
  const durationMs = Date.now() - startedAt;

  if (env.nodeEnv !== 'production' && durationMs > 200) {
    logger.warn('Slow query', { durationMs, rows: result.rowCount });
  }

  return result;
}

module.exports = { pool, query };
