// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// ❌ Убрали initDatabase, так как JSON БД инициализируется сама
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const switchRoutes = require('./routes/switches');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://10.182.63.130:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
});
app.use('/api/', limiter);

// ✅ Маршруты
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/switches', switchRoutes);

app.get('/', (req, res) => {
  res.json({ name: 'Switch Manager API', version: '1.0.0' });
});

// ✅ Обработчики ошибок
app.use(notFoundHandler);
app.use(errorHandler);

// ✅ Запуск
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Backend запущен!`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api/health\n`);
});