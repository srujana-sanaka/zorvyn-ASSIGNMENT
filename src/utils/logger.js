function serializeMeta(meta) {
  if (!meta) return '';
  try {
    return JSON.stringify(meta);
  } catch {
    return '';
  }
}

function log(level, message, meta) {
  const ts = new Date().toISOString();
  const payload = serializeMeta(meta);
  // Keep it simple: platform logs usually capture stdout/stderr.
  // If you later want structured logs, swap this with pino/winston.
  const line = payload ? `${ts} ${level.toUpperCase()} ${message} ${payload}` : `${ts} ${level.toUpperCase()} ${message}`;

  if (level === 'error') {
    console.error(line);
    return;
  }
  console.log(line);
}

const logger = {
  info: (msg, meta) => log('info', msg, meta),
  warn: (msg, meta) => log('warn', msg, meta),
  error: (msg, meta) => log('error', msg, meta)
};

module.exports = { logger };
