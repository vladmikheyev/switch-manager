// src/utils/constants.js

/**
 * Статусы коммутаторов
 */
export const SWITCH_STATUS = {
  ACTIVE: 'active',
  MAINTENANCE: 'maintenance',
  OFFLINE: 'offline',
  ARCHIVED: 'archived'
};

/**
 * Конфигурация статусов (цвета, иконки, названия)
 */
export const STATUS_CONFIG = {
  [SWITCH_STATUS.ACTIVE]: {
    label: 'Активен',
    labelShort: 'Активен',
    color: 'green',
    colorHex: '#16a34a',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600',
    description: 'Коммутатор в работе'
  },
  [SWITCH_STATUS.MAINTENANCE]: {
    label: 'На складе',
    labelShort: 'Склад',
    color: 'yellow',
    colorHex: '#ca8a04',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-600',
    description: 'Коммутатор на хранении'
  },
  [SWITCH_STATUS.OFFLINE]: {
    label: 'Неизвестно',
    labelShort: 'Неизв.',
    color: 'red',
    colorHex: '#dc2626',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    iconColor: 'text-red-600',
    description: 'Статус не определён'
  },
  [SWITCH_STATUS.ARCHIVED]: {
    label: 'В архиве',
    labelShort: 'Архив',
    color: 'gray',
    colorHex: '#6b7280',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-200',
    iconColor: 'text-gray-600',
    description: 'Коммутатор в архиве'
  }
};

/**
 * Получение конфигурации статуса по ключу
 * @param {string} status - Ключ статуса
 * @returns {Object} Конфигурация статуса
 */
export const getStatusConfig = (status) => {
  return STATUS_CONFIG[status] || STATUS_CONFIG[SWITCH_STATUS.OFFLINE];
};

/**
 * Получение всех статусов для select/радио
 * @returns {Array} Массив статусов
 */
export const getStatusOptions = () => {
  return Object.keys(STATUS_CONFIG).map(key => ({
    value: key,
    label: STATUS_CONFIG[key].label,
    color: STATUS_CONFIG[key].color
  }));
};

/**
 * Типы документов
 */
export const DOCUMENT_TYPES = {
  IMAGE: 'image',
  PDF: 'pdf',
  WORD: 'word',
  OTHER: 'other'
};

/**
 * Конфигурация типов файлов
 */
export const FILE_TYPE_CONFIG = {
  [DOCUMENT_TYPES.IMAGE]: {
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    label: 'Изображение',
    icon: 'Image'
  },
  [DOCUMENT_TYPES.PDF]: {
    extensions: ['pdf'],
    mimeTypes: ['application/pdf'],
    label: 'PDF',
    icon: 'FileText'
  },
  [DOCUMENT_TYPES.WORD]: {
    extensions: ['doc', 'docx'],
    mimeTypes: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    label: 'Word',
    icon: 'FileText'
  },
  [DOCUMENT_TYPES.OTHER]: {
    extensions: [],
    mimeTypes: [],
    label: 'Другой',
    icon: 'File'
  }
};

/**
 * Получение типа файла по расширению
 * @param {string} filename - Имя файла
 * @returns {string} Тип документа
 */
export const getDocumentType = (filename) => {
  const ext = filename?.split('.').pop()?.toLowerCase();
  
  for (const [type, config] of Object.entries(FILE_TYPE_CONFIG)) {
    if (config.extensions.includes(ext)) {
      return type;
    }
  }
  
  return DOCUMENT_TYPES.OTHER;
};

/**
 * Получение MIME типа по расширению
 * @param {string} filename - Имя файла
 * @returns {string} MIME тип
 */
export const getMimeType = (filename) => {
  const ext = filename?.split('.').pop()?.toLowerCase();
  
  for (const config of Object.values(FILE_TYPE_CONFIG)) {
    const index = config.extensions.indexOf(ext);
    if (index !== -1 && config.mimeTypes[index]) {
      return config.mimeTypes[index];
    }
  }
  
  return 'application/octet-stream';
};

/**
 * Настройки загрузки файлов
 */
export const FILE_UPLOAD_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024,  // 10 MB
  MAX_SIZE_LABEL: '10 MB',
  ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx'],
  ALLOWED_MIME_TYPES: [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
};

/**
 * Форматирование размера файла
 * @param {number} bytes - Размер в байтах
 * @returns {string} Отформатированный размер
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Настройки пагинации
 */
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
};

/**
 * Настройки поиска
 */
export const SEARCH_CONFIG = {
  MIN_QUERY_LENGTH: 2,
  DEBOUNCE_DELAY: 300,
  MAX_RESULTS: 100
};

/**
 * Поля коммутатора для экспорта/импорта
 */
export const SWITCH_FIELDS = [
  { key: 'id', label: 'ID', type: 'number', required: false, editable: false },
  { key: 'name', label: 'Название', type: 'string', required: true, editable: true },
  { key: 'model', label: 'Модель', type: 'string', required: true, editable: true },
  { key: 'location', label: 'Место установки', type: 'string', required: true, editable: true },
  { key: 'serialNumber', label: 'Серийный номер', type: 'string', required: false, editable: true },
  { key: 'requestNumber', label: '№ заявки', type: 'string', required: false, editable: true },
  { key: 'technician', label: 'Сотрудник', type: 'string', required: false, editable: true },
  { key: 'ports', label: 'Порты', type: 'number', required: true, editable: true },
  { key: 'status', label: 'Статус', type: 'string', required: true, editable: true, enum: Object.keys(SWITCH_STATUS) },
  { key: 'vendor', label: 'Вендор', type: 'string', required: false, editable: true },
  { key: 'purchaseDate', label: 'Дата покупки', type: 'date', required: false, editable: true },
  { key: 'comment', label: 'Комментарий', type: 'string', required: false, editable: true },
  { key: 'documents', label: 'Документы', type: 'array', required: false, editable: true },
  { key: 'createdAt', label: 'Создан', type: 'datetime', required: false, editable: false },
  { key: 'updatedAt', label: 'Обновлён', type: 'datetime', required: false, editable: false }
];

/**
 * Получение поля по ключу
 * @param {string} key - Ключ поля
 * @returns {Object|null} Конфигурация поля
 */
export const getFieldConfig = (key) => {
  return SWITCH_FIELDS.find(f => f.key === key) || null;
};

/**
 * Получение обязательных полей
 * @returns {Array} Массив ключей обязательных полей
 */
export const getRequiredFields = () => {
  return SWITCH_FIELDS.filter(f => f.required).map(f => f.key);
};

/**
 * Получение редактируемых полей
 * @returns {Array} Массив ключей редактируемых полей
 */
export const getEditableFields = () => {
  return SWITCH_FIELDS.filter(f => f.editable).map(f => f.key);
};

/**
 * Цветовые темы приложения
 */
export const COLOR_THEMES = {
  primary: {
    name: 'Синяя',
    primary: 'blue',
    primaryHex: '#2563eb',
    secondary: 'gray'
  },
  dark: {
    name: 'Тёмная',
    primary: 'indigo',
    primaryHex: '#4f46e5',
    secondary: 'slate'
  },
  green: {
    name: 'Зелёная',
    primary: 'emerald',
    primaryHex: '#059669',
    secondary: 'gray'
  }
};

/**
 * Настройки API
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env?.VITE_API_URL || 'http://localhost:5000',
  TIMEOUT: 30000,
  RETRIES: 3,
  ENDPOINTS: {
    SWITCHES: '/api/switches',
    // ✅ ИСПРАВЛЕНО: Полный путь внутри префикса /api/switches
    UPLOAD: '/api/switches/upload',
    DOCUMENT: '/api/switches/document',
    
    HEALTH: '/api/health',
    SEARCH: '/api/switches/search',
    STATS: '/api/switches/stats'
  }
};

/**
 * Сообщения об ошибках
 */
export const ERROR_MESSAGES = {
  NETWORK: 'Ошибка сети. Проверьте подключение к интернету.',
  SERVER: 'Ошибка сервера. Попробуйте позже.',
  NOT_FOUND: 'Ресурс не найден.',
  UNAUTHORIZED: 'Требуется авторизация.',
  FORBIDDEN: 'Доступ запрещён.',
  VALIDATION: 'Ошибка валидации данных.',
  FILE_TOO_LARGE: `Файл слишком большой. Максимальный размер: ${FILE_UPLOAD_CONFIG.MAX_SIZE_LABEL}`,
  INVALID_FILE_TYPE: 'Неподдерживаемый тип файла.',
  UNKNOWN: 'Произошла неизвестная ошибка.'
};

/**
 * Сообщения об успехе
 */
export const SUCCESS_MESSAGES = {
  CREATE: 'Запись успешно создана.',
  UPDATE: 'Запись успешно обновлена.',
  DELETE: 'Запись успешно удалена.',
  UPLOAD: 'Файл успешно загружен.',
  EXPORT: 'Данные успешно экспортированы.',
  IMPORT: 'Данные успешно импортированы.'
};

/**
 * Локаль приложения
 */
export const LOCALE = 'ru-RU';

/**
 * Формат даты для отображения
 */
export const DATE_FORMAT = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
};

/**
 * Формат даты и времени для отображения
 */
export const DATETIME_FORMAT = {
  ...DATE_FORMAT,
  hour: '2-digit',
  minute: '2-digit'
};

/**
 * Форматирование даты
 * @param {string|Date} date - Дата для форматирования
 * @param {Object} format - Опции формата
 * @returns {string} Отформатированная дата
 */
export const formatDate = (date, format = DATE_FORMAT) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString(LOCALE, format);
};

/**
 * Версия приложения
 */
export const APP_VERSION = '1.0.0';

/**
 * Название приложения
 */
export const APP_NAME = 'Switch Manager';

/**
 * Описание приложения
 */
export const APP_DESCRIPTION = 'Система управления сетевым оборудованием';

const constants = {
  SWITCH_STATUS,
  STATUS_CONFIG,
  getStatusConfig,
  getStatusOptions,
  DOCUMENT_TYPES,
  FILE_TYPE_CONFIG,
  getDocumentType,
  getMimeType,
  FILE_UPLOAD_CONFIG,
  formatFileSize,
  PAGINATION_CONFIG,
  SEARCH_CONFIG,
  SWITCH_FIELDS,
  getFieldConfig,
  getRequiredFields,
  getEditableFields,
  COLOR_THEMES,
  API_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOCALE,
  DATE_FORMAT,
  DATETIME_FORMAT,
  formatDate,
  APP_VERSION,
  APP_NAME,
  APP_DESCRIPTION
};

export default constants;