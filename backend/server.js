// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path'); // ✅ Переместили require наверх

const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const switchRoutes = require('./routes/switches');
const sfpRoutes = require('./routes/sfp'); // ✅ Импорт маршрутов SFP

const app = express(); // ✅ Сначала создаем app
const PORT = process.env.PORT || 5000;

// ✅ Теперь можно использовать app.use для статики
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: true, // Разрешаем запросы с любых источников (для dev)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Логирование запросов в режиме разработки
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// Ограничитель частоты запросов (Rate Limiting)
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
});
app.use('/api/', limiter);

// ==========================================
// ✅ Маршруты (Routes)
// ==========================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/switches', switchRoutes); // Маршруты коммутаторов
app.use('/api/sfp', sfpRoutes);         // ✅ Маршруты SFP модулей

app.get('/', (req, res) => {
  res.json({ name: 'Switch Manager API', version: '2.1.0' }); // ✅ Обновили версию
});

// ==========================================
// ✅ Обработчики ошибок
// ==========================================
app.use(notFoundHandler);
app.use(errorHandler);

// ==========================================
// ✅ Запуск сервера
// ==========================================
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Backend запущен!`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Network: http://10.182.63.130:${PORT}\n`);
});