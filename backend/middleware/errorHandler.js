// backend/middleware/errorHandler.js

// Обработчик ошибок для Express
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Ошибки валидации Joi
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Ошибка валидации',
      details: err.details.map(d => d.message)
    });
  }

  // Ошибки базы данных
  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return res.status(409).json({
      error: 'Дублирующиеся данные',
      message: 'Запись с таким серийным номером уже существует'
    });
  }

  // Ошибки авторизации
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }

  // Ошибки доступа
  if (err.name === 'ForbiddenError') {
    return res.status(403).json({ error: 'Доступ запрещён' });
  }

  // Ошибки "не найдено"
  if (err.status === 404) {
    return res.status(404).json({ error: 'Ресурс не найден' });
  }

  // Дефолтная ошибка сервера
  const statusCode = err.status || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Внутренняя ошибка сервера' 
    : err.message;

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Обработчик несуществующих маршрутов (404)
const notFoundHandler = (req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
};

module.exports = { errorHandler, notFoundHandler };