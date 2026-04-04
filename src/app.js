const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { env } = require('./config/env');
const { authRoutes } = require('./routes/authRoutes');
const { userRoutes } = require('./routes/userRoutes');
const { transactionRoutes } = require('./routes/transactionRoutes');
const { dashboardRoutes } = require('./routes/dashboardRoutes');
const { notFound } = require('./middlewares/notFound');
const { errorHandler } = require('./middlewares/errorHandler');

function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());

  app.use(
    cors({
      origin: env.corsOrigin === '*' ? true : env.corsOrigin,
      credentials: true
    })
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: false }));

  // Lightweight request logging. In production you may want JSON logs instead.
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

  
// Root — browsers hit `/` first; real routes live under `/health` and `/api/*`.
  app.get('/', (req, res) => {
    res.json({
      name: 'Finance Data & Access Control API',
      health: '/health',
      api: { auth: '/api/auth', users: '/api/users', transactions: '/api/transactions', dashboard: '/api/dashboard/summary' }
    });
  });
  app.get('/health', (req, res) => {
    res.json({ ok: true, env: env.nodeEnv });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/transactions', transactionRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
