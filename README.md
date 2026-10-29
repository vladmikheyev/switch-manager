# 🔄 Switch Manager

**Система учёта и управления сетевым оборудованием (Коммутаторы + SFP-модули)**

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4-gray?logo=express)](https://expressjs.com)
[![Nginx](https://img.shields.io/badge/Nginx-1.29-blue?logo=nginx)](https://nginx.org)
[![Version](https://img.shields.io/badge/Version-2.1.0-orange)](https://github.com/vladmikheyev/switch-manager)

---

## 📋 Описание

**Switch Manager** — это современное веб-приложение для инвентаризации, мониторинга и учёта сетевого оборудования. Позволяет вести базу коммутаторов и SFP-модулей, привязывать документы, отслеживать историю изменений, гибко фильтровать данные и экспортировать отчёты в удобные форматы.

### ✨ Основные возможности

| Функция | Описание |
|---------|----------|
| 🔌 Учёт коммутаторов | CRUD-операции, поля: название, модель, S/N, порты, статус, локация, сотрудник, заявка и др. |
| 📡 Учёт SFP-модулей | Отдельная вкладка с учётом вендора, модели, дальности, класса, цвета, статуса, остатков (шт.) |
| 📜 История изменений | Автоматический лог для каждого устройства: кто, когда и какие поля изменил (хранит последние 100 записей) |
| 🔍 Умный поиск | Фильтрация по всем текстовым полям, включая комментарии и цвета |
| 🏷️ Статусы и фильтры | Быстрый отбор по статусам (`ЗИП`, `В работе`, `Заказано`), мгновенный подсчёт физических единиц |
| 📤 Экспорт данных | Выгрузка отфильтрованных данных в `.xlsx` (Excel) и `.json` |
| 📋 Дублирование записей | Копирование SFP-модуля с автоочисткой системных полей для быстрого массового ввода |
| 📎 Документы | Загрузка фото/схем с поддержкой кириллицы, превью и увеличением |
| 🔐 Локальный режим | Безопасный запуск только на `127.0.0.1`, защита от внешнего доступа через Nginx |
| 📱 Адаптивный UI | Вкладки, компактные хедеры, таблицы с фиксированной шириной, мобильная адаптация |

---

## 🛠️ Технологический стек

| Слой | Технологии |
|------|-----------|
| **Фронтенд** | React 18, Vite, Tailwind CSS, Lucide React, `xlsx` |
| **Бэкенд** | Node.js 20+, Express 4, Multer + UUID, JSON-файлы (БД) |
| **Инфраструктура** | Nginx (reverse proxy, статика), Windows Batch/PowerShell |
| **Особенности** | Без внешних СУБД, история в JSON, hot-reload, безопасные скрипты запуска |

---

## 🚀 Быстрый старт

### Требования
- Node.js **v18+**
- npm **v9+**
- Nginx (для локального прокси/раздачи статики)

### Установка
```powershell
# 1. Клонируйте репозиторий
git clone https://github.com/vladmikheyev/switch-manager.git
cd switch-manager

# 2. Установите зависимости фронтенда
npm install

# 3. Установите зависимости бэкенда
cd backend
npm install
cd ..

# 4. (Опционально) Создайте .env
echo "VITE_API_URL=http://localhost:5000" > .env
```

### Запуск в режиме разработки
> ⚠️ Запускайте бэкенд и фронтенд в **разных терминалах** или используйте готовый батник.
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
| `BROWSER` | `none` | Отключить автооткрытие браузера |

### База данных
Файлы хранятся в `backend/data/`:
- `switches.json` — коммутаторы
- `sfp_modules.json` — SFP-модули
- Формат: плоский JSON-массив объектов. Автоматическая миграция/создание при первом запуске.

### Nginx (локальный режим)
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
        proxy_set_header X-Real-IP $remote_addr;
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
├── 📄 stop-start-App+nginx-LOCALHOST.bat  # Безопасный скрипт запуска
│
├── 📁 src/                                # Фронтенд (React)
│   ├── 📁 components/
│   │   ├── 📁 Controls/                   # Поиск, экспорт, фильтры
│   │   ├── 📁 Modal/                      # SwitchModal, SwitchHistory
│   │   ├── 📁 Switches/                   # SwitchTable, SwitchRow
│   │   └── 📁 Sfp/                        # 🆕 SfpView, SfpTable, SfpModal, SfpHistory
│   ├── 📁 hooks/                          # useSwitches
│   ├── 📁 services/                       # api.js (методы /switches, /sfp)
│   ├── 📁 utils/                          # constants.js, export helpers
│   └── App.jsx                            # Главный компонент с вкладками
│
└── 📁 backend/                            # Бэкенд (Express)
    ├── 📄 server.js
    ├── 📁 config/                         # database.js
    ├── 📁 controllers/                    # switchController.js, 🆕 sfpController.js
    ├── 📁 models/                         # Switch.js, 🆕 SfpModule.js
    ├── 📁 routes/                         # switches.js, 🆕 sfp.js
    ├── 📁 middleware/                     # upload.js
    ├── 📁 uploads/                        # Загруженные файлы
    └── 📁 data/                           # switches.json, 🆕 sfp_modules.json
```

---

## 🌐 API Endpoints

### Коммутаторы
| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| `GET` | `/api/switches` | Список всех коммутаторов |
| `GET` | `/api/switches/:id` | Коммутатор по ID |
| `GET` | `/api/switches/:id/history` | 📜 История изменений |
| `POST` | `/api/switches` | Создать |
| `PUT` | `/api/switches/:id` | Обновить |
| `DELETE` | `/api/switches/:id` | Удалить |

### SFP-модули
| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| `GET` | `/api/sfp` | Список модулей |
| `GET` | `/api/sfp/:id` | Модуль по ID |
| `GET` | `/api/sfp/:id/history` | 📜 История изменений SFP |
| `POST` | `/api/sfp` | Создать |
| `PUT` | `/api/sfp/:id` | Обновить |
| `DELETE` | `/api/sfp/:id` | Удалить |

### Файлы и Системные
| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| `POST` | `/api/switches/upload/:switchId` | Загрузить файл |
| `GET` | `/api/health` | Проверка статуса сервера |

---

## 📊 Экспорт данных

| Формат | Особенности |
|--------|-------------|
| `.xlsx` (Excel) | Плоская таблица с русскими заголовками, корректная кириллица, даты и числа. Экспортирует **отфильтрованные** данные. |
| `.json` | Полный массив объектов (включая `id`, `history`, `documents`). Идеально для бэкапа и последующего импорта. |

---

## 🧰 Управление и скрипты

### Запуск (рекомендуемый)
```powershell
.\stop-start-App+nginx-LOCALHOST.bat
```
**Что делает:**
1. Безопасно останавливает все `node.exe` и `nginx.exe`
2. Запускает бэкенд (`npm run dev`) и ждёт ответа `/api/health`
3. Запускает фронтенд с флагом `--host 127.0.0.1`
4. Валидирует и запускает Nginx (без опасных правок конфига!)
5. Проверяет доступность сервисов и предлагает открыть браузер

### Остановка
```powershell
taskkill /f /im node.exe && taskkill /f /im nginx.exe
```

---

## 🔧 Устранение неполадок

| Проблема | Решение |
|----------|---------|
| 🔄 Порт 5000/3000 занят | `taskkill /f /im node.exe` → перезапуск |
| 📦 Ошибка `Module not found` | `rm -rf node_modules package-lock.json && npm install` |
| 🌐 Nginx не запускается | `nginx -t` → проверьте пути в `nginx.conf` |
| 🕘 История не грузится | Убедитесь, что маршруты `/:id/history` стоят **до** общего `/:id` в `routes/*.js` |
| 💾 Данные не сохраняются | Проверьте права на папку `backend/data/` и наличие валидных JSON-файлов (`[]`) |
| 🖼️ Старая версия в браузере | `Ctrl + F5` (жёсткая перезагрузка) или включите `Disable cache` в DevTools → Network |

---

## 🔐 Безопасность

- 🔒 **Локальный режим**: Бэкенд, фронтенд и Nginx привязаны к `127.0.0.1`
- 📁 **Файлы**: Сохраняются как `uuid.ext`, оригинальные имена хранятся только в БД
- 🚫 **Защита от XSS/Injection**: Базовая валидация через `Joi` + экранирование в React
- 📜 **Аудит**: Все изменения логируются с указанием пользователя и временной меткой

---

## 📄 Лицензия

MIT © 2024–2026 Vlad Mikheyev

---

## 🤝 Вклад в проект
1. Форкните репозиторий
2. Создайте ветку: `git checkout -b feature/your-feature`
3. Внесите изменения, закоммитьте и отправьте PR
4. Соблюдайте ESLint правила и структуру проекта

---

## 📞 Поддержка
- 🐛 **Баги**: [Issues](https://github.com/vladmikheyev/switch-manager/issues)
- 💡 **Идеи**: [Discussions](https://github.com/vladmikheyev/switch-manager/discussions)
- 📧 **Email**: `vlad_mikheyev@mail.ru`

> 💡 **Регулярный бэкап:**
> ```powershell
> Copy-Item backend\data\*.json "backups\v2.1.0_$(Get-Date -Format 'yyyy-MM-dd_HH-mm').zip"
> ```

---

*Документация актуальна на 29 октября 2026 г. Версия приложения: **2.1.0*** 🛠️✨