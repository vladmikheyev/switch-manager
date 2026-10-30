// backend/middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Убедимся, что папка uploads существует
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Настройка хранилища
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Генерируем уникальное имя: timestamp + случайное число + расширение
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, uniqueSuffix + ext);
  }
});

// Фильтр файлов (разрешаем только PDF и изображения)
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Разрешены только файлы PDF и изображения (JPG, PNG)'), false);
  }
};

// Создаем и экспортируем экземпляр multer
const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // Максимум 10 МБ
});

module.exports = upload; // ✅ Экспортируем сам экземпляр, чтобы работал upload.single()