// backend/server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Включите CORS
app.use(cors({
  origin: 'http://localhost:3004', // разрешить только ваш фронтенд
  credentials: true
}));

// Парсинг JSON
app.use(express.json());

// Папка для загрузки файлов
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Путь к файлу с данными
const dataPath = path.join(__dirname, 'data', 'switches.json');

// Получить все коммутаторы
app.get('/api/switches', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Не удалось прочитать данные' });
    res.json(JSON.parse(data));
  });
});

// Загрузить файл и обновить коммутатор
app.post('/api/upload/:id', upload.single('file'), (req, res) => {
  const { id } = req.params;
  const file = req.file;

  if (!file) return res.status(400).json({ error: 'Файл не загружен' });

  const filePath = `/uploads/${file.filename}`;

  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Не удалось прочитать данные' });

    const switches = JSON.parse(data);
    const switchItem = switches.find(s => s.id == id);

    if (!switchItem) return res.status(404).json({ error: 'Коммутатор не найден' });

    switchItem.documents = switchItem.documents || [];
    switchItem.documents.push({
      name: file.originalname,
      path: filePath,
      type: file.mimetype,
      size: file.size,
      uploadDate: new Date().toISOString()
    });

    fs.writeFile(dataPath, JSON.stringify(switches, null, 2), () => {
      res.json(switchItem);
    });
  });
});

// Удалить документ
app.delete('/api/document/:id/:filename', (req, res) => {
  const { id, filename } = req.params;
  const filePath = path.join(uploadDir, filename);

  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Не удалось прочитать данные' });

    const switches = JSON.parse(data);
    const switchItem = switches.find(s => s.id == id);

    if (!switchItem) return res.status(404).json({ error: 'Коммутатор не найден' });

    switchItem.documents = switchItem.documents?.filter(d => d.path !== `/uploads/${filename}`) || [];

    fs.writeFile(dataPath, JSON.stringify(switches, null, 2), () => {
      // Удаляем файл с диска
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      res.json({ success: true });
    });
  });
});

// Статические файлы (для доступа к /uploads)
app.use('/uploads', express.static(uploadDir));

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

