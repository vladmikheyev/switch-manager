# 🔄 Switch Manager v2.1.0
**Система учёта и управления сетевым оборудованием**

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4-gray?logo=express)](https://expressjs.com)
[![Nginx](https://img.shields.io/badge/Nginx-1.29-blue?logo=nginx)](https://nginx.org)
[![Version](https://img.shields.io/badge/Version-2.1.0-orange)](https://github.com/vladmikheyev/switch-manager)

---

## 📋 Описание
**Switch Manager** — современное SPA-приложение для инвентаризации, мониторинга и учёта сетевого оборудования. Позволяет вести единую базу коммутаторов и SFP-модулей, привязывать технические спецификации (PDF), отслеживать историю изменений, гибко фильтровать данные и экспортировать отчёты в удобные форматы.

---

## ✨ Основные возможности

| Модуль | Функционал |
|--------|------------|
| 🔌 **Коммутаторы** | Полный CRUD, поля: название, модель, S/N, порты, статус, локация, сотрудник, заявка, комментарий |
| 📡 **SFP-модули** | Отдельная вкладка, учёт вендора/модели, дальности, класса, цвета, статуса, **физического количества (шт.)** |
| 📜 **История** | Автоматический аудит: кто, когда и какие поля изменил (хранит до 100 последних записей) |
| 🔍 **Умный поиск** | Фильтрация по **всем** полям (включая дальность, количество, комментарии и цвета) |
| 🏷️ **Статусы** | Быстрый отбор: `ЗИП` / `В работе` / `Заказано` с мгновенным пересчётом физических единиц |
| 📋 **Дублирование** | Копирование SFP с автоочисткой системных полей (`id`, даты, история) для массового ввода |
| 📤 **Экспорт** | Выгрузка **отфильтрованных** данных в `.xlsx` (Excel) и `.json` (бэкап/импорт) |
| 📎 **Документы** | Загрузка PDF-даташитов, хранение в `uploads/`, просмотр в новой вкладке по клику |
| 🎨 **Цвета** | Автоподбор цветового индикатора для SFP (желтый, голубой/aqua, черный, фиолетовый и др.) |
| 🔐 **Безопасность** | Локальный режим (`127.0.0.1`), rate limiting, валидация, защита от XSS, безопасный батник запуска |

---

## 🛠️ Технологический стек

| Слой | Технологии |
|------|-----------|
| **Фронтенд** | React 18, Vite, Tailwind CSS, Lucide React, `xlsx` |
| **Бэкенд** | Node.js 20+, Express 4, Multer, Helmet, CORS, express-rate-limit |
| **Хранение** | JSON-файлы (Flat-File DB), файловая система для документов |
| **Инфраструктура** | Nginx (reverse proxy & статика), Windows Batch/PowerShell |

---

## 🚀 Быстрый старт

### Требования
- Node.js **v18+**
- npm **v9+**
- Nginx *(опционально, для локального прокси на `:8088`)*

### Установка
```powershell
# 1. Клонирование или переход в папку проекта
cd switch-manager

# 2. Зависимости фронтенда
npm install

# 3. Зависимости бэкенда
cd backend && npm install && cd ..
```

### Запуск
> 💡 Рекомендуется использовать готовый батник для безопасного запуска в локальном режиме.

**Вариант А: Через батник (рекомендуется)**
```powershell
.\stop-start-App+nginx-LOCALHOST.bat
```
*(Запускает бэкенд, фронтенд и Nginx, проверяет порты, предлагает открыть браузер)*

**Вариант Б: Вручную (режим разработки)**
```powershell
# Терминал 1: Бэкенд
cd backend && npm run dev

# Терминал 2: Фронтенд
npm start
```
🌐 Приложение: `http://localhost:3000` | 🔌 API: `http://localhost:5000`

---

## ⚙️ Конфигурация

### Переменные окружения (`.env`)
| Переменная | Значение | Описание |
|------------|----------|----------|
| `VITE_API_URL` | `http://localhost:5000` | Адрес бэкенда |
| `PORT` | `5000` | Порт Express |

### База данных
Файлы хранятся в `backend/data/`:
- `switches.json` — коммутаторы
- `sfp_modules.json` — SFP-модули
- Формат: плоский JSON-массив. Создаётся/обновляется автоматически.

### Nginx (локальный режим)
Пример базовой конфигурации для `conf/nginx.conf`:
```nginx
server {
    listen 127.0.0.1:8088;
    server_name localhost;

    location / {
        root C:/Users/vg.mikheev/Documents/Swmanager/switch-manager/build;
        index index.html;
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
    }

    location /uploads/ {
        alias C:/Users/vg.mikheev/Documents/Swmanager/switch-manager/backend/uploads/;
    }
}
```

---

## 📁 Структура проекта
```
switch-manager/
├── 📄 package.json
├── 📄 .env
├── 📄 stop-start-App+nginx-LOCALHOST.bat
│
├── 📁 src/                         # Фронтенд (React)
│   ├── 📁 components/
│   │   ├── 📁 Controls/            # Поиск, экспорт, фильтры
│   │   ├── 📁 Modal/               # SwitchModal, SwitchHistory
│   │   ├── 📁 Switches/            # SwitchTable, SwitchRow
│   │   └── 📁 Sfp/                 # SfpView, SfpTable, SfpModal, SfpHistory
│   ├── 📁 hooks/                   # useSwitches
│   ├── 📁 services/                # api.js (методы /switches, /sfp)
│   ├── 📁 utils/                   # constants.js, хелперы
│   └── App.js                      # Главный компонент с вкладками
│
└── 📁 backend/                     # Бэкенд (Express)
    ├── 📄 server.js
    ├── 📁 config/                  # database.js
    ├── 📁 controllers/             # switchController.js, sfpController.js
    ├── 📁 models/                  # Switch.js, SfpModule.js
    ├── 📁 routes/                  # switches.js, sfp.js
    ├── 📁 middleware/              # upload.js (Multer), errorHandler.js
    ├── 📁 uploads/                 # Загруженные PDF/изображения
    └── 📁 data/                    # switches.json, sfp_modules.json
```

---

## 🌐 API Endpoints

### 🔌 Коммутаторы
| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| `GET`    | `/api/switches`           | Список всех коммутаторов |
| `GET`    | `/api/switches/:id`       | Коммутатор по ID |
| `GET`    | `/api/switches/:id/history` | 📜 История изменений |
| `POST`   | `/api/switches`           | Создать |
| `PUT`    | `/api/switches/:id`       | Обновить |
| `DELETE` | `/api/switches/:id`       | Удалить |
| `POST`   | `/api/switches/upload/:id`| 📎 Загрузить файл |

### 📡 SFP-модули
| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| `GET`    | `/api/sfp`                | Список модулей |
| `GET`    | `/api/sfp/:id`            | Модуль по ID |
| `GET`    | `/api/sfp/:id/history`    | 📜 История изменений SFP |
| `POST`   | `/api/sfp`                | Создать |
| `PUT`    | `/api/sfp/:id`            | Обновить |
| `DELETE` | `/api/sfp/:id`            | Удалить |
| `POST`   | `/api/sfp/upload/:id`     | 📎 Загрузить PDF-даташит |
| `DELETE` | `/api/sfp/document/:id/:filename` | Удалить документ |

---

## 🧰 Устранение неполадок

| Проблема | Решение |
|----------|---------|
| 🔁 Порт `5000`/`3000` занят | `taskkill /f /im node.exe` → перезапуск |
| 📦 Ошибка `Module not found` | `rm -rf node_modules/.vite` → `npm install` |
| 🌐 Nginx не запускается | `nginx -t` → проверьте пути в `nginx.conf` |
| 📄 Файл не загружается | Убедитесь, что фронтенд отправляет `FormData` без ручного `Content-Type` |
| 🖼️ Старая версия в браузере | `Ctrl + F5` (жёсткая перезагрузка) или `Disable cache` в DevTools |
| 📝 Ошибка `EADDRINUSE` | Принудительно завершите `node.exe` перед запуском |

---

## 🔐 Безопасность и бэкапы
- 🔒 **Локальный режим**: Бэкенд, фронтенд и Nginx привязаны к `127.0.0.1`
- 📁 **Файлы**: Сохраняются как `timestamp-random.ext`, оригинальные имена хранятся в JSON
- 📜 **Аудит**: Все изменения логируются с указанием пользователя и временной меткой
- 💾 **Бэкап**: Регулярно копируйте `backend/data/` и `backend/uploads/`
  ```powershell
  Copy-Item -Recurse backend\data, backend\uploads -Destination "backups\v2.1.0_$(Get-Date -Format 'yyyy-MM-dd_HH-mm')"
  ```

---

## 📊 История версий
| Версия | Дата | Изменения |
|--------|------|-----------|
| `2.1.0` | Окт 2026 | ✅ Вкладка SFP, подсчёт штук, статусы, поиск по всем полям, экспорт Excel/JSON, копирование записей, загрузка PDF, история, безопасный батник |
| `1.1.0` | Янв 2025 | 🔌 Базовый учёт коммутаторов, поиск, фильтрация, история |

---

## 📄 Лицензия
MIT © 2024–2026 Vlad Mikheyev

## 🤝 Поддержка и контакты
- 🐛 **Баги**: [Issues](https://github.com/vladmikheyev/switch-manager/issues)
- 💡 **Идеи**: [Discussions](https://github.com/vladmikheyev/switch-manager/discussions)
- 📧 **Email**: `vlad_mikheyev@mail.ru`

> 📘 *Документация актуальна на 30 октября 2026 г. Версия приложения: **2.1.0*** 🛠️✨