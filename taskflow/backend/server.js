require('dotenv').config();
const express = require('express');
const cors = require('cors');
const initDB = require('./config/initDB');

const app = express();

// cors — because browsers are paranoid and honestly fair enough
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth',  require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

app.get('/api/health', (_, res) => {
  console.log('🏥 health check — yes, still alive, thanks for asking');
  res.json({ status: 'ok', app: 'PeakTasks' });
});

// 404 for unknown api routes
app.use((req, res) => {
  console.warn(`🤷 unknown route hit: ${req.method} ${req.path}`);
  res.status(404).json({ message: 'Route not found' });
});

// global error handler — the last line of defense
app.use((err, req, res, next) => {
  console.error('💥 unhandled error (this is fine):', err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 PeakTasks API running on port ${PORT}`);
      console.log(`📋 health check: http://localhost:${PORT}/api/health`);
      console.log(`☕ go get a coffee, you deserve it`);
    });
  })
  .catch((err) => {
    console.error('❌ failed to start — database said no:', err.message);
    process.exit(1);
  });
