// src/hooks/useSwitches.js
import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

/**
 * Ключ для резервного копирования в localStorage
 * (используется только как фоллбэк при недоступности сервера)
 */
const BACKUP_KEY = 'switch-manager-backup';

/**
 * Кастомный хук для управления данными коммутаторов
 * @returns {Object} Методы и данные для работы с коммутаторами
 */
export const useSwitches = () => {
  // Состояние списка коммутаторов
  const [switches, setSwitches] = useState([]);
  
  // Состояние загрузки
  const [isLoading, setIsLoading] = useState(true);
  
  // Состояние ошибки
  const [error, setError] = useState(null);

  // ============================================
  // ИНИЦИАЛИЗАЦИЯ: Загрузка данных при монтировании
  // ============================================
  useEffect(() => {
    const fetchFromServer = async () => {
      try {
        // ✅ Сервер — главный источник истины
        const response = await api.getSwitches();
        
        // Извлекаем данные из обёртки ответа { success: true, data: [...] }
        const serverData = response?.data || response;
        
        if (Array.isArray(serverData)) {
          console.log(`📡 Загружено ${serverData.length} коммутаторов с сервера`);
          setSwitches(serverData);
          
          // Сохраняем в localStorage как резервную копию (не как основной источник!)
          localStorage.setItem(BACKUP_KEY, JSON.stringify(serverData));
          setError(null);
        }
      } catch (err) {
        console.warn('⚠️ Не удалось загрузить данные с сервера:', err.message);
        
        // Фоллбэк: пробуем загрузить из резервной копии в localStorage
        try {
          const backup = localStorage.getItem(BACKUP_KEY);
          if (backup) {
            const localData = JSON.parse(backup);
            console.log(`💾 Загружено ${localData.length} коммутаторов из резервной копии`);
            setSwitches(localData);
            setError('Сервер недоступен. Показаны локальные данные.');
          } else {
            setError('Не удалось подключиться к серверу и нет локальной копии.');
            setSwitches([]);
          }
        } catch {
          setError('Ошибка чтения локальных данных.');
          setSwitches([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFromServer();
  }, []);

  // ============================================
  // СИНХРОНИЗАЦИЯ: Сохранение резервной копии при изменении данных
  // ============================================
  useEffect(() => {
    // Сохраняем в localStorage только если данные не пустые и не загружаются
    if (!isLoading && switches.length > 0) {
      try {
        localStorage.setItem(BACKUP_KEY, JSON.stringify(switches));
      } catch (err) {
        console.warn('⚠️ Не удалось сохранить резервную копию:', err);
      }
    }
  }, [switches, isLoading]);

  // ============================================
  // CRUD ОПЕРАЦИИ
  // ============================================

  /**
   * Добавление нового коммутатора
   * @param {Object} switchData - Данные коммутатора
   * @returns {Object} Созданный коммутатор
   */
  const addSwitch = useCallback(async (switchData) => {
    try {
      const response = await api.createSwitch(switchData);
      // ✅ Извлекаем данные из обёртки ответа
      const newSwitch = response?.data || response;
      
      // Добавляем в локальное состояние
      setSwitches(prev => [...prev, newSwitch]);
      setError(null);
      return newSwitch;
    } catch (err) {
      console.error('❌ Ошибка добавления коммутатора:', err);
      
      // Показываем понятную ошибку пользователю
      const errorMsg = err?.response?.data?.error || 
                      err?.response?.data?.details?.join(', ') || 
                      err?.message || 
                      'Не удалось сохранить коммутатор';
      setError(errorMsg);
      throw err;
    }
  }, []);

  /**
   * Обновление данных коммутатора
   * @param {number|string} id - ID коммутатора
   * @param {Object} updatedData - Новые данные
   * @returns {Object} Обновлённый коммутатор
   */
  const updateSwitch = useCallback(async (id, updatedData) => {
    try {
      const response = await api.updateSwitch(id, updatedData);
      const updated = response?.data || response;
      
      // Обновляем в локальном состоянии
      setSwitches(prev => prev.map(s => 
        String(s.id) === String(id) ? { ...s, ...updated } : s
      ));
      setError(null);
      return updated;
    } catch (err) {
      console.error('❌ Ошибка обновления коммутатора:', err);
      
      const errorMsg = err?.response?.data?.error || 
                      err?.response?.data?.details?.join(', ') || 
                      err?.message || 
                      'Не удалось обновить коммутатор';
      setError(errorMsg);
      throw err;
    }
  }, []);

  /**
   * Удаление коммутатора
   * @param {number|string} id - ID коммутатора
   * @returns {boolean} Успешность удаления
   */
  const deleteSwitch = useCallback(async (id) => {
    try {
      await api.deleteSwitch(id);
      
      // ✅ Используем строковое сравнение для надёжности
      setSwitches(prev => prev.filter(s => String(s.id) !== String(id)));
      setError(null);
      return true;
    } catch (err) {
      console.error('❌ Ошибка удаления коммутатора:', err);
      
      // Если сервер вернул 404 (коммутатор уже удалён), удаляем из UI локально
      if (err?.response?.status === 404) {
        console.warn('⚠️ Коммутатор не найден на сервере, удаляем из UI локально');
        setSwitches(prev => prev.filter(s => String(s.id) !== String(id)));
        return true;
      }
      
      const errorMsg = err?.response?.data?.error || 
                      err?.message || 
                      'Не удалось удалить коммутатор';
      setError(errorMsg);
      throw err;
    }
  }, []);

  // ============================================
  // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
  // ============================================

  /**
   * Получение коммутатора по ID (локально)
   * @param {number|string} id - ID коммутатора
   * @returns {Object|null} Найденный коммутатор или null
   */
  const getSwitchById = useCallback((id) => {
    return switches.find(s => String(s.id) === String(id)) || null;
  }, [switches]);

  /**
   * Импорт данных (замена текущих)
   * @param {Array} data - Массив коммутаторов для импорта
   */
  const importSwitches = useCallback((data) => {
    if (!Array.isArray(data)) {
      throw new Error('Данные для импорта должны быть массивом');
    }
    setSwitches(data);
    setError(null);
  }, []);

  /**
   * Экспорт данных в JSON формат
   * @returns {string} JSON строка с данными
   */
  const exportSwitches = useCallback(() => {
    return JSON.stringify(switches, null, 2);
  }, [switches]);

  /**
   * Поиск коммутаторов по запросу (локально)
   * @param {string} searchTerm - Поисковый запрос
   * @returns {Array} Отфильтрованный массив
   */
  const searchSwitches = useCallback((searchTerm) => {
    if (!searchTerm?.trim()) {
      return switches;
    }
    const term = searchTerm.toLowerCase().trim();
    return switches.filter(s => {
      const fields = [
        s.name, s.model, s.location, s.serialNumber, 
        s.requestNumber, s.technician, s.vendor, s.status
      ];
      return fields.some(field => field?.toLowerCase()?.includes(term));
    });
  }, [switches]);

  /**
   * Фильтрация по статусу (локально)
   * @param {string} status - Статус для фильтрации
   * @returns {Array} Отфильтрованный массив
   */
  const filterByStatus = useCallback((status) => {
    if (!status) return switches;
    return switches.filter(s => s.status === status);
  }, [switches]);

  /**
   * Получение статистики (локально)
   * @returns {Object} Объект со статистикой
   */
  const getStats = useCallback(() => {
    return {
      total: switches.length,
      active: switches.filter(s => s.status === 'active').length,
      maintenance: switches.filter(s => s.status === 'maintenance').length,
      offline: switches.filter(s => s.status === 'offline').length,
      archived: switches.filter(s => s.status === 'archived').length,
      totalPorts: switches.reduce((sum, s) => sum + (parseInt(s.ports) || 0), 0),
      withDocuments: switches.filter(s => s.documents?.length > 0).length
    };
  }, [switches]);

  /**
   * Принудительная синхронизация с сервером
   * @returns {Promise<boolean>} Успешность обновления
   */
  const syncWithServer = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.getSwitches();
      const serverData = response?.data || response;
      
      if (Array.isArray(serverData)) {
        setSwitches(serverData);
        localStorage.setItem(BACKUP_KEY, JSON.stringify(serverData));
        setError(null);
        console.log('✅ Данные синхронизированы с сервером');
        return true;
      }
      return false;
    } catch (err) {
      console.error('❌ Ошибка синхронизации:', err);
      setError('Не удалось синхронизировать с сервером');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Сброс ошибки
   */
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  // ============================================
  // ПУБЛИЧНЫЙ ИНТЕРФЕЙС ХУКА
  // ============================================
  return {
    // Данные и состояние
    switches,
    isLoading,
    error,
    
    // CRUD операции
    addSwitch,
    updateSwitch,
    deleteSwitch,
    getSwitchById,
    
    // Импорт/Экспорт
    importSwitches,
    exportSwitches,
    
    // Поиск и фильтрация
    searchSwitches,
    filterByStatus,
    
    // Статистика
    getStats,
    
    // Синхронизация
    syncWithServer,
    
    // Управление ошибками
    resetError
  };
};

export default useSwitches;