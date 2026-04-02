const { Pool } = require('pg');
const { env } = require('./env');
const { logger } = require('../utils/logger');

<<<<<<< HEAD
//creating a pool connection to the database
=======
//making connection to databse string
>>>>>>> ea8890f2725674d80a8218afd314323ced32fa5b
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

<<<<<<< HEAD
// query the db
=======
//checks query time for fetching from database{helps to find slow queries and optimize db performance}
>>>>>>> ea8890f2725674d80a8218afd314323ced32fa5b
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
