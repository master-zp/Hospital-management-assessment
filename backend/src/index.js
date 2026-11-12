require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
require('dotenv').config(); // also allow backend/.env

const express = require('express');
const cors = require('cors');
const { initPool, closePool, isMockMode } = require('./config/db');

const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const appointmentRoutes = require('./routes/appointments');
const doctorRoutes = require('./routes/doctors');
const departmentRoutes = require('./routes/departments');

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    dbMode: isMockMode() ? 'mock' : 'oracle',
    service: 'hms-api',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/departments', departmentRoutes);

app.use((err, _req, res, _next) => {
  console.error('[error]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

async function start() {
  await initPool();
  app.listen(PORT, () => {
    console.log(`[hms-api] listening on http://localhost:${PORT}`);
    console.log(`[hms-api] DB_MODE=${isMockMode() ? 'mock' : 'oracle'}`);
  });
}

process.on('SIGINT', async () => {
  await closePool();
  process.exit(0);
});

start().catch((err) => {
  console.error('Failed to start API', err);
  process.exit(1);
});
