const { Pool } = require('pg');
const { env } = require('./env');
const { logger } = require('../utils/logger');

//creating a pool connection to the database
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

pool.on('error', (err) => {
  // This usually indicates idle clients being terminated unexpectedly.
  logger.error('Unexpected PG pool error', { message: err.message });
});

// query the db
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
