// src/hooks/useFileUpload.js
import { useState, useCallback } from 'react';
import { api } from '../services/api';

/**
 * Максимальный размер файла (10 MB)
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Разрешённые типы файлов
 */
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

/**
 * Расширения файлов для валидации по имени
 */
const ALLOWED_EXTENSIONS = [
  'jpg', 'jpeg', 'png', 'gif', 'webp',
  'pdf', 'doc', 'docx'
];

/**
 * Кастомный хук для управления загрузкой файлов
 * @returns {Object} Методы и состояние для работы с загрузкой файлов
 */
export const useFileUpload = () => {
  // Состояние загрузки
  const [isUploading, setIsUploading] = useState(false);
  
  // Состояние ошибки
  const [error, setError] = useState(null);
  
  // Состояние успеха
  const [success, setSuccess] = useState(null);
  
  // Прогресс загрузки (0-100)
  const [progress, setProgress] = useState(0);

  /**
   * Валидация файла
   * @param {File} file - Файл для валидации
   * @returns {Object|null} Объект ошибки или null если всё ок
   */
  const validateFile = useCallback((file) => {
    if (!file) {
      return { code: 'NO_FILE', message: 'Файл не выбран' };
    }

    // Проверка размера
    if (file.size > MAX_FILE_SIZE) {
      return {
        code: 'FILE_TOO_LARGE',
        message: `Файл слишком большой. Максимальный размер: ${formatFileSize(MAX_FILE_SIZE)}`
      };
    }

    // Проверка типа по MIME
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        code: 'INVALID_TYPE',
        message: 'Неподдерживаемый тип файла. Разрешены: JPG, PNG, GIF, WEBP, PDF, DOC, DOCX'
      };
    }

    // Проверка расширения
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return {
        code: 'INVALID_EXTENSION',
        message: 'Неподдерживаемое расширение файла'
      };
    }

    return null;
  }, []);

  /**
   * Форматирование размера файла
   * @param {number} bytes - Размер в байтах
   * @returns {string} Отформатированный размер
   */
  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  /**
   * Загрузка файла на сервер
   * @param {number} switchId - ID коммутатора
   * @param {File} file - Файл для загрузки
   * @param {Function} onProgress - Callback для отслеживания прогресса
   * @returns {Object} Данные загруженного файла
   */
  const uploadFile = useCallback(async (switchId, file, onProgress) => {
    // Валидация
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError.message);
      throw new Error(validationError.message);
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);
    setProgress(0);

    try {
      // Если передан callback прогресса
      if (onProgress) {
        // Имитация прогресса для UX (реальный прогресс зависит от бэкенда)
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);
      }

      // Загрузка через API
      const response = await api.uploadFile(switchId, file);
      
      setProgress(100);
      setSuccess({
        message: 'Файл успешно загружен',
        data: response.document
      });

      // Сброс успеха через 3 секунды
      setTimeout(() => setSuccess(null), 3000);

      return response.document;
    } catch (err) {
      console.error('Ошибка загрузки файла:', err);
      setError(err.message || 'Не удалось загрузить файл');
      throw err;
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(0), 500);
    }
  }, [validateFile]);

  /**
   * Загрузка нескольких файлов
   * @param {number} switchId - ID коммутатора
   * @param {FileList} files - Список файлов
   * @returns {Array} Массив загруженных документов
   */
  const uploadMultipleFiles = useCallback(async (switchId, files) => {
    const results = [];
    const errors = [];

    for (const file of Array.from(files)) {
      try {
        const result = await uploadFile(switchId, file);
        results.push(result);
      } catch (err) {
        errors.push({ file: file.name, error: err.message });
      }
    }

    if (errors.length > 0) {
      console.warn('Некоторые файлы не удалось загрузить:', errors);
    }

    return results;
  }, [uploadFile]);

  /**
   * Удаление файла с сервера
   * @param {number} switchId - ID коммутатора
   * @param {string} filename - Имя файла для удаления
   * @returns {boolean} Успешность удаления
   */
  const deleteFile = useCallback(async (switchId, filename) => {
    try {
      setIsUploading(true);
      setError(null);

      await api.deleteDocument(switchId, filename);
      
      setSuccess({ message: 'Файл успешно удалён' });
      setTimeout(() => setSuccess(null), 3000);

      return true;
    } catch (err) {
      console.error('Ошибка удаления файла:', err);
      setError(err.message || 'Не удалось удалить файл');
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  /**
   * Загрузка файла как Data URL (для локального предпросмотра)
   * @param {File} file - Файл для конвертации
   * @returns {Promise<string>} Data URL строка
   */
  const readFileAsDataURL = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }, []);

  /**
   * Загрузка файла для нового коммутатора (без сервера)
   * @param {File} file - Файл для загрузки
   * @returns {Object} Данные файла для локального хранения
   */
  const uploadFileLocal = useCallback(async (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError.message);
      throw new Error(validationError.message);
    }

    setIsUploading(true);
    setError(null);

    try {
      const dataUrl = await readFileAsDataURL(file);
      
      const document = {
        name: file.name,
        type: file.type,
        size: file.size,
        url: dataUrl,
        uploadedAt: new Date().toISOString()
      };

      setSuccess({ message: 'Файл успешно добавлен' });
      setTimeout(() => setSuccess(null), 3000);

      return document;
    } catch (err) {
      console.error('Ошибка локальной загрузки:', err);
      setError(err.message || 'Не удалось добавить файл');
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [validateFile, readFileAsDataURL]);

  /**
   * Сброс состояния ошибки
   */
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Сброс состояния успеха
   */
  const resetSuccess = useCallback(() => {
    setSuccess(null);
  }, []);

  /**
   * Сброс всего состояния
   */
  const resetState = useCallback(() => {
    setIsUploading(false);
    setError(null);
    setSuccess(null);
    setProgress(0);
  }, []);

  return {
    // Состояние
    isUploading,
    error,
    success,
    progress,
    
    // Методы загрузки
    uploadFile,
    uploadMultipleFiles,
    uploadFileLocal,
    
    // Методы удаления
    deleteFile,
    
    // Утилиты
    validateFile,
    formatFileSize,
    readFileAsDataURL,
    
    // Сброс состояния
    resetError,
    resetSuccess,
    resetState
  };
};

export default useFileUpload;