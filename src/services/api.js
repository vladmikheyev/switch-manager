// src/services/api.js
import { API_CONFIG, ERROR_MESSAGES, FILE_UPLOAD_CONFIG } from '../utils/constants';

/**
 * Класс для управления API запросами
 */
class ApiClient {
  constructor() {
    this.baseURL = import.meta.env?.VITE_API_URL || 'http://localhost:5000';
    console.log('🔗 Backend URL:', this.baseURL);
    this.timeout = 30000;
    this.retries = 1;
    this.token = null;
  }

  /**
   * Установка токена авторизации
   * @param {string} token - JWT токен
   */
  setToken(token) {
    this.token = token;
  }

  /**
   * Очистка токена авторизации
   */
  clearToken() {
    this.token = null;
  }

  /**
   * Получение заголовков для запроса
   * @param {Object} customHeaders - Пользовательские заголовки
   * @returns {Object} Заголовки запроса
   */
  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Обработка ответа сервера
   * @param {Response} response - Fetch response
   * @returns {Promise<any>} Распарсенные данные
   * @throws {Error} Ошибка сервера
   */
  async handleResponse(response) {
    if (!response.ok) {
      let errorMessage = ERROR_MESSAGES.SERVER;
      let errorCode = response.status;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        errorCode = errorData.code || errorCode;
      } catch {
        // Если не удалось распарсить JSON, используем статус текст
        errorMessage = response.statusText || errorMessage;
      }

      const error = new Error(errorMessage);
      error.status = errorCode;
      error.response = response;
      throw error;
    }

    // Пустой ответ (204 No Content)
    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  /**
   * Выполнение fetch запроса с таймаутом
   * @param {string} url - URL запроса
   * @param {Object} options - Fetch options
   * @returns {Promise<Response>} Fetch response
   */
  async fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Выполнение запроса с повторными попытками
   * @param {string} url - URL запроса
   * @param {Object} options - Fetch options
   * @param {number} retryCount - Количество попыток
   * @returns {Promise<Response>} Fetch response
   */
  async fetchWithRetry(url, options = {}, retryCount = 0) {
    try {
      const response = await this.fetchWithTimeout(url, options);
      return response;
    } catch (error) {
      // Таймаут или ошибка сети - пробуем ещё раз
      if (retryCount < this.retries && (error.name === 'AbortError' || error.message.includes('network'))) {
        const delay = Math.pow(2, retryCount) * 1000; // Экспоненциальная задержка
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.fetchWithRetry(url, options, retryCount + 1);
      }
      throw error;
    }
  }

  /**
   * GET запрос
   * @param {string} endpoint - Эндпоинт API
   * @param {Object} params - Query параметры
   * @returns {Promise<any>} Данные ответа
   */
  async get(endpoint, params = {}) {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    // Добавление query параметров
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const response = await this.fetchWithRetry(url.toString(), {
      method: 'GET',
      headers: this.getHeaders()
    });

    return this.handleResponse(response);
  }

  /**
   * POST запрос
   * @param {string} endpoint - Эндпоинт API
   * @param {Object} data - Данные для отправки
   * @returns {Promise<any>} Данные ответа
   */
  async post(endpoint, data = {}) {
    const response = await this.fetchWithRetry(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });

    return this.handleResponse(response);
  }

  /**
   * PUT запрос
   * @param {string} endpoint - Эндпоинт API
   * @param {Object} data - Данные для отправки
   * @returns {Promise<any>} Данные ответа
   */
  async put(endpoint, data = {}) {
    const response = await this.fetchWithRetry(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });

    return this.handleResponse(response);
  }

  /**
   * PATCH запрос
   * @param {string} endpoint - Эндпоинт API
   * @param {Object} data - Данные для отправки
   * @returns {Promise<any>} Данные ответа
   */
  async patch(endpoint, data = {}) {
    const response = await this.fetchWithRetry(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });

    return this.handleResponse(response);
  }

  /**
   * DELETE запрос
   * @param {string} endpoint - Эндпоинт API
   * @returns {Promise<any>} Данные ответа
   */
  async delete(endpoint) {
    const response = await this.fetchWithRetry(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });

    return this.handleResponse(response);
  }

  /**
   * Загрузка файла (multipart/form-data)
   * @param {string} endpoint - Эндпоинт API
   * @param {File} file - Файл для загрузки
   * @param {Object} additionalData - Дополнительные данные
   * @param {Function} onProgress - Callback прогресса загрузки
   * @returns {Promise<any>} Данные ответа
   */
  async uploadFileRaw(endpoint, file, additionalData = {}, onProgress = null) {
    const formData = new FormData();
    formData.append('file', file);
    
    // Добавление дополнительных полей
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Проверка размера файла
    if (file.size > FILE_UPLOAD_CONFIG.MAX_SIZE) {
      const error = new Error(ERROR_MESSAGES.FILE_TOO_LARGE);
      error.code = 'FILE_TOO_LARGE';
      throw error;
    }

    // Проверка типа файла
    if (!FILE_UPLOAD_CONFIG.ALLOWED_MIME_TYPES.includes(file.type)) {
      const error = new Error(ERROR_MESSAGES.INVALID_FILE_TYPE);
      error.code = 'INVALID_FILE_TYPE';
      throw error;
    }

    try {
      const response = await this.fetchWithRetry(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        body: formData
        // Заголовки Content-Type устанавливаются автоматически для FormData
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
      throw error;
    }
  }

  /**
   * Скачивание файла
   * @param {string} endpoint - Эндпоинт API
   * @param {string} filename - Имя файла для сохранения
   * @returns {Promise<Blob>} Blob объект файла
   */
  async downloadFile(endpoint, filename = 'download') {
    const response = await this.fetchWithRetry(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(ERROR_MESSAGES.SERVER);
    }

    return response.blob();
  }

  // ============================================
  // Методы API для Switch Manager
  // ============================================

  /**
   * Получение списка всех коммутаторов
   * @param {Object} params - Параметры фильтрации
   * @returns {Promise<Array>} Список коммутаторов
   */
  async getSwitches(params = {}) {
    return this.get(API_CONFIG.ENDPOINTS.SWITCHES, params);
  }

  /**
   * Получение коммутатора по ID
   * @param {number} id - ID коммутатора
   * @returns {Promise<Object>} Данные коммутатора
   */
  async getSwitch(id) {
    return this.get(`${API_CONFIG.ENDPOINTS.SWITCHES}/${id}`);
  }

  /**
   * Создание нового коммутатора
   * @param {Object} data - Данные коммутатора
   * @returns {Promise<Object>} Созданный коммутатор
   */
  async createSwitch(data) {
    return this.post(API_CONFIG.ENDPOINTS.SWITCHES, data);
  }

  /**
   * Обновление коммутатора
   * @param {number} id - ID коммутатора
   * @param {Object} data - Новые данные
   * @returns {Promise<Object>} Обновлённый коммутатор
   */
  async updateSwitch(id, data) {
    return this.put(`${API_CONFIG.ENDPOINTS.SWITCHES}/${id}`, data);
  }

  /**
   * Частичное обновление коммутатора
   * @param {number} id - ID коммутатора
   * @param {Object} data - Данные для обновления
   * @returns {Promise<Object>} Обновлённый коммутатор
   */
  async patchSwitch(id, data) {
    return this.patch(`${API_CONFIG.ENDPOINTS.SWITCHES}/${id}`, data);
  }

  /**
   * Удаление коммутатора
   * @param {number} id - ID коммутатора
   * @returns {Promise<void>}
   */
  async deleteSwitch(id) {
    return this.delete(`${API_CONFIG.ENDPOINTS.SWITCHES}/${id}`);
  }

  /**
   * Загрузка файла для коммутатора
   * @param {number} switchId - ID коммутатора
   * @param {File} file - Файл для загрузки
   * @returns {Promise<Object>} Данные загруженного файла
   */
  async uploadFile(switchId, file) {
    return this.uploadFileRaw(`${API_CONFIG.ENDPOINTS.UPLOAD}/${switchId}`, file);
  }

  /**
   * Удаление документа коммутатора
   * @param {number} switchId - ID коммутатора
   * @param {string} filename - Имя файла для удаления
   * @returns {Promise<Object>} Результат удаления
   */
  async deleteDocument(switchId, filename) {
    return this.delete(`${API_CONFIG.ENDPOINTS.DOCUMENT}/${switchId}/${filename}`);
  }

  /**
   * Скачивание документа коммутатора
   * @param {string} filepath - Путь к файлу
   * @returns {Promise<Blob>} Blob объект файла
   */
  async downloadDocument(filepath) {
    return this.downloadFile(filepath);
  }

  /**
   * Проверка здоровья сервера
   * @returns {Promise<Object>} Статус сервера
   */
  async healthCheck() {
    return this.get(API_CONFIG.ENDPOINTS.HEALTH);
  }

  /**
   * Массовое создание/обновление коммутаторов
   * @param {Array} switches - Массив коммутаторов
   * @returns {Promise<Array>} Результат операции
   */
  async bulkUpsertSwitches(switches) {
    return this.post(`${API_CONFIG.ENDPOINTS.SWITCHES}/bulk`, switches);
  }

  /**
   * Массовое удаление коммутаторов
   * @param {Array} ids - Массив ID для удаления
   * @returns {Promise<Object>} Результат операции
   */
  async bulkDeleteSwitches(ids) {
    return this.post(`${API_CONFIG.ENDPOINTS.SWITCHES}/bulk-delete`, { ids });
  }

  /**
   * Поиск коммутаторов
   * @param {string} query - Поисковый запрос
   * @param {Object} filters - Дополнительные фильтры
   * @returns {Promise<Array>} Результаты поиска
   */
  async searchSwitches(query, filters = {}) {
    return this.get(`${API_CONFIG.ENDPOINTS.SWITCHES}/search`, { q: query, ...filters });
  }

  /**
   * Получение статистики по коммутаторам
   * @returns {Promise<Object>} Статистика
   */
  async getSwitchStats() {
    return this.get(`${API_CONFIG.ENDPOINTS.SWITCHES}/stats`);
  }

  /**
   * Экспорт коммутаторов
   * @param {string} format - Формат экспорта (json, csv, xlsx)
   * @param {Object} filters - Фильтры для экспорта
   * @returns {Promise<Blob>} Файл экспорта
   */
  async exportSwitches(format = 'json', filters = {}) {
    return this.downloadFile(`${API_CONFIG.ENDPOINTS.SWITCHES}/export?format=${format}`, `switches-export.${format}`);
  }

  /**
   * Импорт коммутаторов
   * @param {File} file - Файл для импорта
   * @returns {Promise<Object>} Результат импорта
   */
  async importSwitches(file) {
    return this.uploadFile(`${API_CONFIG.ENDPOINTS.SWITCHES}/import`, file);
  }
}

// ============================================
// Экспорт экземпляра API клиента
// ============================================

/**
 * Глобальный экземпляр API клиента
 * @type {ApiClient}
 */
export const api = new ApiClient();

/**
 * Фабричная функция для создания нового экземпляра API клиента
 * @param {Object} config - Конфигурация клиента
 * @returns {ApiClient} Новый экземпляр API клиента
 */
export const createApiClient = (config = {}) => {
  const client = new ApiClient();
  
  if (config.baseURL) {
    client.baseURL = config.baseURL;
  }
  
  if (config.token) {
    client.setToken(config.token);
  }
  
  if (config.timeout) {
    client.timeout = config.timeout;
  }
  
  return client;
};

export default api;