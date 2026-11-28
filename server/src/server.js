const express = require('express');
const { connectDatabase, integerSetting } = require('./database');
const { studentRouter } = require('./students');
const { courseRouter } = require('./courses');

async function start() {
  const port = integerSetting('PORT', 3001);
  const { pool, sql } = await connectDatabase();
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '16kb' }));

  app.get('/api/health', async (req, res) => {
    await pool.request().query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  });
  app.use('/api/students', studentRouter(pool, sql));
  app.use('/api/courses', courseRouter(pool, sql));
  app.use((req, res) => res.status(404).json({ error: 'Route not found.' }));
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'The request contains invalid JSON.' });
    }
    if (error.type === 'entity.too.large') {
      return res.status(413).json({ error: 'The request is too large.' });
    }
    if (error.status >= 400 && error.status < 500) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error('API request failed:', error.message);
    res.status(500).json({ error: 'The server could not complete the request.' });
  });

  const server = app.listen(port, '127.0.0.1', (error) => {
    if (error) {
      console.error('Could not start the API:', error.message);
      process.exitCode = 1;
      void pool.close();
      return;
    }
    console.log(`Student API ready at http://localhost:${port}`);
  });

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, () => server.close(() => {
      pool.close().catch((error) => console.error('Could not close SQL Server:', error.message));
    }));
  }
}

start().catch((error) => {
  console.error('Startup failed:', error.message);
  process.exitCode = 1;
});
