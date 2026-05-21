# 🔄 Switch Manager

> **Система учёта и управления неуправляемыми сетевыми коммутаторами**

![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-22.x-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.18-black?logo=express)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38b2ac?logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-yellow)

---

## 📋 О проекте

**Switch Manager** — это веб-приложение для учёта сетевых коммутаторов в организации. Позволяет вести базу оборудования, отслеживать местоположение, статус, прикреплять документы и формировать отчёты.

### ✨ Основные возможности

| Функция | Описание |
|---------|----------|
| 🗄️ **Учёт коммутаторов** | Добавление, редактирование, удаление записей о сетевом оборудовании |
| 🔍 **Поиск и фильтры** | Быстрый поиск по названию, модели, серийному номеру; фильтрация по статусу |
| 📊 **Статистика** | Визуальные карточки с количеством устройств по статусам и общему числу портов |
| 📎 **Документы** | Прикрепление сканов, паспортов, актов к каждому коммутатору (изображения, PDF, DOC) |
| 📤 **Экспорт данных** | Выгрузка базы в JSON или CSV (Excel) для отчётности |
| 📥 **Импорт данных** | Загрузка ранее экспортированных данных для восстановления или переноса |
| 💾 **Локальное хранение** | Данные сохраняются в базе на сервере + резервная копия в браузере |

---

## 🖥️ Скриншоты интерфейса

*(Добавьте скриншоты в папку `/public/screenshots` и раскомментируйте ниже)*

<!-- ![Главный экран](public/screenshots/main.png) -->
<!-- ![Форма добавления](public/screenshots/form.png) -->
<!-- ![Статистика](public/screenshots/stats.png) -->

---

## 🚀 Быстрый старт

### 📦 Требования

- Node.js **v18+** (рекомендуется **v22**)
- npm **v9+**
- Windows 10/11 или Linux/macOS

### 🔧 Установка

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/vladmikheyev/switch-manager.git
cd switch-manager

# 2. Установите зависимости фронтенда
npm install

# 3. Установите зависимости бэкенда
cd backend
npm install
cd ..
```

### ⚙️ Настройка

Создайте файл `.env` в корне проекта (если отсутствует):

```env
# Порт фронтенда (по умолчанию 3000)
PORT=3000

# URL бэкенда для API-запросов
VITE_API_URL=http://localhost:5000

# Разрешённые источники для CORS (бэкенд)
CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:3000
```

### ▶️ Запуск

**Вариант А: Два терминала (рекомендуется для разработки)**

```powershell
# Терминал 1: Фронтенд
npm start
# → http://localhost:3000

# Терминал 2: Бэкенд
cd backend
npm run dev
# → http://localhost:5000/api/health
```

**Вариант Б: Через batch-файл (Windows)**

```powershell
# Перезапуск nginx и сервисов (если используется прокси)
.\stop-start-nginx-norm.bat
```

---

## 🗂️ Структура проекта

```
switch-manager/
├── 📁 backend/                 # Серверная часть (Node.js + Express)
│   ├── 📁 config/              # Конфигурация БД
│   │   └── database.js         # JSON-хранилище с авто-инициализацией
│   ├── 📁 controllers/         # Обработчики запросов
│   │   └── switchController.js # CRUD-операции для коммутаторов
│   ├── 📁 middleware/          # Промежуточное ПО
│   │   ├── upload.js           # Загрузка файлов (multer)
│   │   └── errorHandler.js     # Единая обработка ошибок
│   ├── 📁 models/              # Бизнес-логика
│   │   └── Switch.js           # Модель данных коммутатора
│   ├── 📁 routes/              # API-маршруты
│   │   └── switches.js         # Маршруты + валидация Joi
│   ├── 📁 data/                # Файловая база данных
│   │   └── switches.json       # Основные данные (авто-создаётся)
│   ├── 📁 uploads/             # Загруженные файлы
│   ├── .env                    # Переменные окружения бэкенда
│   ├── package.json            # Зависимости бэкенда
│   └── server.js               # Точка входа Express
│
├── 📁 public/                  # Статические файлы фронтенда
├── 📁 src/                     # Исходный код React-приложения
│   ├── 📁 components/          # UI-компоненты
│   │   ├── 📁 Controls/        # Поиск, фильтры, кнопки экспорта
│   │   ├── 📁 Layout/          # Header, статистика
│   │   ├── 📁 Modal/           # Формы и модальные окна
│   │   ├── 📁 Switches/        # Таблица и строки коммутаторов
│   │   └── 📁 UI/              # Переиспользуемые Button, Input
│   ├── 📁 hooks/               # Кастомные хуки
│   │   └── useSwitches.js      # Логика CRUD + синхронизация с API
│   ├── 📁 services/            # API-клиент
│   │   └── api.js              # Axios-обёртка с retry/timeout
│   ├── 📁 utils/               # Утилиты
│   │   ├── constants.js        # Статусы, цвета, конфиги
│   │   └── exportHelpers.js    # Экспорт в JSON/CSV
│   ├── App.js                  # Главный компонент (композиция)
│   ├── index.js                # Точка входа React
│   └── index.css               # Глобальные стили + Tailwind
│
├── .env                        # Переменные окружения фронтенда
├── .gitignore                  # Исключения для Git
├── package.json                # Зависимости фронтенда
├── tailwind.config.js          # Конфигурация Tailwind CSS
└── README.md                   # Этот файл
```

---

## 🔌 API Endpoints

| Метод | Эндпоинт | Описание | Тело запроса |
|-------|----------|----------|-------------|
| `GET` | `/api/health` | Проверка работоспособности сервера | — |
| `GET` | `/api/switches` | Получить список коммутаторов | `?status=active&search=текст&limit=20` |
| `GET` | `/api/switches/:id` | Получить коммутатор по ID | — |
| `POST` | `/api/switches` | Создать новый коммутатор | `{ name, model, location, ports, ... }` |
| `PUT` | `/api/switches/:id` | Обновить коммутатор | `{ name?, model?, status?, ... }` |
| `DELETE` | `/api/switches/:id` | Удалить коммутатор | — |
| `POST` | `/api/upload/:switchId` | Загрузить файл для коммутатора | `FormData: { file: File }` |
| `DELETE` | `/api/document/:switchId/:filename` | Удалить документ | — |
| `GET` | `/api/switches/stats` | Получить статистику | — |
| `GET` | `/api/switches/search?q=запрос` | Поиск коммутаторов | — |
| `GET` | `/api/switches/uploads/:filename` | Прямой доступ к файлу | — |

> 📝 **Примечание**: Все ответы возвращаются в формате `{ success: boolean, data?: any, message?: string }`.

---

## ⚙️ Конфигурация

### Переменные окружения (`.env`)

| Переменная | Значение по умолчанию | Описание |
|------------|----------------------|----------|
| `VITE_API_URL` | `http://localhost:5000` | URL бэкенда для фронтенда |
| `PORT` | `5000` | Порт сервера бэкенда |
| `CORS_ORIGIN` | `http://localhost:3000` | Разрешённые источники (через запятую) |
| `NODE_ENV` | `development` | Режим работы (development/production) |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Макс. запросов в окно времени |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Окно времени для rate limit (15 мин) |

### Настройка Tailwind CSS

Проект использует **Tailwind CSS v3**. Основные настройки в `tailwind.config.js`:

```js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',   // Синий — основной акцент
        success: '#16a34a',   // Зелёный — активный статус
        warning: '#ca8a04',   // Жёлтый — на складе
        danger: '#dc2626',    // Красный — ошибка/оффлайн
      }
    }
  },
  plugins: []
}
```

---

## 🛠️ Разработка

### Полезные скрипты

```bash
# Фронтенд
npm start          # Запуск в режиме разработки
npm run build      # Сборка для продакшена (папка /build)
npm test           # Запуск тестов (Jest)
npm run eject      # Выход из CRA (необратимо!)

# Бэкенд
npm run dev        # Запуск с nodemon (авто-перезагрузка)
npm start          # Запуск в продакшен-режиме
```

### Линтинг и форматирование

Проект использует **ESLint** + **Prettier**. Проверка кода:

```bash
# Фронтенд
npx eslint src/
npx prettier --check src/

# Бэкенд
cd backend
npx eslint .
```

### Добавление новой фичи

1.  Создайте ветку: `git checkout -b feature/new-feature`
2.  Внесите изменения в соответствующие файлы
3.  Протестируйте локально (фронтенд + бэкенд)
4.  Закоммитьте: `git commit -m "feat: описание изменения"`
5.  Откройте Pull Request

---

## 🐛 Устранение неполадок

| Проблема | Возможное решение |
|----------|------------------|
| ❌ `Failed to fetch` при сохранении | Проверьте, запущен ли бэкенд на `:5000`; убедитесь, что `VITE_API_URL` совпадает |
| ❌ `CORS policy blocked` | Добавьте адрес фронтенда в `CORS_ORIGIN` в `.env` бэкенда |
| ❌ Файлы не загружаются | Проверьте права на папку `backend/uploads/`; макс. размер файла — 10 MB |
| ❌ Данные не сохраняются после перезагрузки | Убедитесь, что `backend/data/switches.json` доступен для записи |
| ❌ Порт 3000/5000 занят | Измените `PORT` в `.env` или завершите процесс: `npx kill-port 3000` |
| ❌ Ошибка компиляции `Cannot find module` | Удалите `node_modules` и выполните `npm install` заново |

### Сброс кэша (если ничего не помогает)

```powershell
# Фронтенд
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Бэкенд
cd backend
rm -rf node_modules package-lock.json
npm install
```

---

## 📦 Деплой

### Локальная сеть (Windows)

1.  Соберите фронтенд: `npm run build`
2.  Настройте Nginx/IIS для раздачи папки `build/`
3.  Запустите бэкенд как сервис (PM2 или Windows Service):
    ```powershell
    npm install -g pm2
    cd backend
    pm2 start server.js --name switch-api
    pm2 save
    pm2 startup
    ```

### Docker (универсальный способ)

Создайте `Dockerfile` в корне:

```dockerfile
# Мульти-стейдж сборка
FROM node:22-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS backend
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ .
COPY --from=frontend /app/build ./public

EXPOSE 5000
CMD ["node", "server.js"]
```

Сборка и запуск:
```bash
docker build -t switch-manager .
docker run -p 5000:5000 -v ./data:/app/data -v ./uploads:/app/uploads switch-manager
```

---

## 🤝 Вклад в проект

1.  Форкните репозиторий
2.  Создайте ветку для фичи: `git checkout -b feature/amazing-feature`
3.  Закоммитьте изменения: `git commit -m 'feat: добавлена новая фича'`
4.  Запушьте ветку: `git push origin feature/amazing-feature`
5.  Откройте Pull Request

### 📋 Чеклист перед отправкой кода

- [ ] Код проходит линтинг (`npm run lint`)
- [ ] Нет `console.log` в продакшен-коде
- [ ] Добавлены/обновлены комментарии для сложных участков
- [ ] Протестированы основные сценарии (CRUD, загрузка файлов)
- [ ] Обновлён `README.md`, если изменился функционал

---

## 📄 Лицензия

Проект распространяется под лицензией **MIT**. См. файл [LICENSE](LICENSE) для деталей.

```
MIT License

Copyright (c) 2025-2026 Михеев Владислав Геннадьевич

Разрешается бесплатное использование, копирование, модификация...
```

---

## 👤 Автор

**Михеев Владислав Геннадьевич**  
📧 [your.email@example.com]  
🏢 [Ваша организация / отдел]

---

## 🙏 Благодарности

- [Create React App](https://create-react-app.dev/) — быстрый старт фронтенда
- [Tailwind CSS](https://tailwindcss.com/) — утилитарные стили
- [Express](https://expressjs.com/) — минималистичный сервер
- [Lucide React](https://lucide.dev/) — красивые иконки
- [Joi](https://joi.dev/) — валидация данных

---

> 💡 **Совет**: Регулярно делайте бэкап файла `backend/data/switches.json` — это ваша основная база данных!

---

*Документация актуальна на май 2026 г. При изменении архитектуры проекта — обновляйте README.* 🔄