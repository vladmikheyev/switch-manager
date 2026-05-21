// src/hooks/useSwitches.js
import { api } from "../services/api";
import { useState, useEffect, useCallback } from "react";

/**
 * Ключ для localStorage
 */
const STORAGE_KEY = "switch-manager-data";

/**
 * Данные по умолчанию для первого запуска
 */
const DEFAULT_SWITCHES = [
  {
    id: 1,
    name: "Switch-Office-01",
    model: "TP-Link TL-SG1008D",
    location: "Офис, этаж 2, кабинет 205",
    serialNumber: "TPL2024001234",
    requestNumber: "Заявка №123",
    technician: "Иванов И.И.",
    ports: 8,
    status: "active",
    vendor: "TP-Link",
    purchaseDate: "2024-01-15",
    comment: "",
    documents: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

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

  // Загрузка данных из localStorage при монтировании
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        setSwitches(JSON.parse(savedData));
      } else {
        setSwitches(DEFAULT_SWITCHES);
      }
    } catch (err) {
      console.error("Ошибка загрузки данных из localStorage:", err);
      setError("Не удалось загрузить данные");
      setSwitches(DEFAULT_SWITCHES);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Сохранение данных в localStorage при изменении
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(switches));
      } catch (err) {
        console.error("Ошибка сохранения данных в localStorage:", err);
        setError("Не удалось сохранить данные");
      }
    }
  }, [switches, isLoading]);

  /**
   * Добавление нового коммутатора
   * @param {Object} switchData - Данные коммутатора
   * @returns {Object} Созданный коммутатор
   */
  const addSwitch = useCallback(async (switchData) => {
    try {
      const response = await api.createSwitch(switchData);
      // ✅ Извлекаем данные из обёртки ответа API
      const newSwitch = response.data || response;
      setSwitches((prev) => [...prev, newSwitch]);
      return newSwitch;
    } catch (err) {
      console.error("❌ Ошибка сохранения на сервере:", err);
      setError("Не удалось сохранить коммутатор");
      throw err;
    }
  }, []);

  /**
   * Обновление данных коммутатора
   * @param {number} id - ID коммутатора
   * @param {Object} updatedData - Новые данные
   * @returns {Object} Обновлённый коммутатор
   */
  const updateSwitch = useCallback(async (id, updatedData) => {
    try {
      const response = await api.updateSwitch(id, updatedData);
      const updated = response.data || response;
      setSwitches((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updated } : s)),
      );
      return updated;
    } catch (err) {
      console.error("❌ Ошибка обновления:", err);
      setError("Не удалось обновить коммутатор");
      throw err;
    }
  }, []);

  /**
   * Удаление коммутатора
   * @param {number} id - ID коммутатора
   * @returns {boolean} Успешность удаления
   */

  const deleteSwitch = useCallback(async (id) => {
    try {
      // ✅ Просто вызываем API, ответ нам не нужен для логики
      await api.deleteSwitch(id);

      // Обновляем локальное состояние
      setSwitches((prev) => prev.filter((s) => String(s.id) !== String(id)));

      return true;
    } catch (err) {
      console.error("❌ Ошибка удаления:", err);

      // Если сервер вернул 404, удаляем из UI локально
      if (err?.response?.status === 404) {
        setSwitches((prev) => prev.filter((s) => String(s.id) !== String(id)));
        return true;
      }

      setError("Не удалось удалить коммутатор");
      throw err;
    }
  }, []);

  /**
   * Получение коммутатора по ID
   * @param {number} id - ID коммутатора
   * @returns {Object|null} Найденный коммутатор или null
   */
  const getSwitchById = useCallback(
    (id) => {
      return switches.find((s) => s.id === id) || null;
    },
    [switches],
  );

  /**
   * Импорт данных из внешнего источника
   * @param {Array} data - Массив коммутаторов для импорта
   * @param {boolean} merge - Объединить с существующими (true) или заменить (false)
   * @returns {number} Количество импортированных коммутаторов
   */
  const importSwitches = useCallback((data, merge = true) => {
    try {
      if (!Array.isArray(data)) {
        throw new Error("Данные должны быть массивом");
      }

      setSwitches((prev) => {
        if (merge) {
          // Объединение с существующими (избегаем дубликатов по ID)
          const existingIds = new Set(prev.map((s) => s.id));
          const newSwitches = data.filter((s) => !existingIds.has(s.id));
          return [...prev, ...newSwitches];
        } else {
          // Полная замена
          return data;
        }
      });

      setError(null);
      return data.length;
    } catch (err) {
      console.error("Ошибка импорта данных:", err);
      setError("Не удалось импортировать данные");
      throw err;
    }
  }, []);

  /**
   * Экспорт данных в JSON формат
   * @returns {string} JSON строка с данными
   */
  const exportSwitches = useCallback(() => {
    try {
      return JSON.stringify(switches, null, 2);
    } catch (err) {
      console.error("Ошибка экспорта данных:", err);
      setError("Не удалось экспортировать данные");
      throw err;
    }
  }, [switches]);

  /**
   * Очистка всех данных
   * @param {boolean} confirm - Требовать подтверждение
   * @returns {boolean} Успешность очистки
   */
  const clearAll = useCallback((confirm = true) => {
    if (
      confirm &&
      !window.confirm(
        "Вы уверены, что хотите удалить все коммутаторы? Это действие нельзя отменить.",
      )
    ) {
      return false;
    }

    try {
      setSwitches([]);
      localStorage.removeItem(STORAGE_KEY);
      setError(null);
      return true;
    } catch (err) {
      console.error("Ошибка очистки данных:", err);
      setError("Не удалось очистить данные");
      throw err;
    }
  }, []);

  /**
   * Поиск коммутаторов по запросу
   * @param {string} searchTerm - Поисковый запрос
   * @returns {Array} Отфильтрованный массив коммутаторов
   */
  const searchSwitches = useCallback(
    (searchTerm) => {
      if (!searchTerm?.trim()) {
        return switches;
      }

      const term = searchTerm.toLowerCase().trim();
      return switches.filter((s) => {
        const searchableFields = [
          s.name,
          s.model,
          s.location,
          s.serialNumber,
          s.requestNumber,
          s.technician,
          s.vendor,
          s.status,
        ];
        return searchableFields.some((field) =>
          field?.toLowerCase().includes(term),
        );
      });
    },
    [switches],
  );

  /**
   * Фильтрация коммутаторов по статусу
   * @param {string} status - Статус для фильтрации
   * @returns {Array} Отфильтрованный массив коммутаторов
   */
  const filterByStatus = useCallback(
    (status) => {
      if (!status) {
        return switches;
      }
      return switches.filter((s) => s.status === status);
    },
    [switches],
  );

  /**
   * Получение статистики по коммутаторам
   * @returns {Object} Объект со статистикой
   */
  const getStats = useCallback(() => {
    return {
      total: switches.length,
      active: switches.filter((s) => s.status === "active").length,
      maintenance: switches.filter((s) => s.status === "maintenance").length,
      offline: switches.filter((s) => s.status === "offline" || !s.status)
        .length,
      archived: switches.filter((s) => s.status === "archived").length,
      totalPorts: switches.reduce(
        (sum, s) => sum + (parseInt(s.ports) || 0),
        0,
      ),
      withDocuments: switches.filter((s) => s.documents?.length > 0).length,
    };
  }, [switches]);

  /**
   * Сброс ошибки
   */
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Данные
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
    clearAll,

    // Поиск и фильтрация
    searchSwitches,
    filterByStatus,

    // Статистика
    getStats,

    // Управление ошибками
    resetError,
  };
};

export default useSwitches;
