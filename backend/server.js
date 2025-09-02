// backend/server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Включите CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://10.182.62.50:8080');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

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
  console.log('✅ Получен POST /api/upload/', req.params.id); // ← внутри функции
  console.log('📄 Загружаемый файл:', req.file); // ← полезно для отладки
  console.log('🧾 ID коммутатора:', req.params.id);

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

        fs.writeFile(dataPath, JSON.stringify(switches, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Не удалось сохранить данные' });
      }

      // Перечитываем обновлённый коммутатор
      console.log('✅ Файл успешно добавлен к коммутатору:', switchItem);
      const updatedSwitch = switches.find(s => s.id == id);
      res.json(updatedSwitch);
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер запущен на http://0.0.0.0:${PORT}`);
  
});

