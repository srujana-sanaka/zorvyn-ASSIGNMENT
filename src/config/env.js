const path = require('path');
const dotenv = require('dotenv');

// Loads .env from project root. In production, environment variables are usually injected by the platform.
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),

  databaseUrl: process.env.DATABASE_URL,
  pg: {
    host: process.env.PGHOST,
    port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'dev_secret_change_me',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  },

  corsOrigin: process.env.CORS_ORIGIN || '*'
};

module.exports = { env, requireEnv };
