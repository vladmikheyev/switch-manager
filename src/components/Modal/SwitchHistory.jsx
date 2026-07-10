// src/components/Modal/SwitchHistory.jsx
import { useState, useEffect } from 'react';
import { X, Clock, User, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';

/**
 * Модальное окно с историей изменений коммутатора
 */
export const SwitchHistory = ({ switchId, switchName, onClose }) => {
  // ✅ Объявляем все состояния
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  // ✅ Добавлено состояние для ошибки

  // Маппинг полей на русские названия
  const fieldLabels = {
    name: 'Название',
    model: 'Модель', 
    location: 'Место установки',
    serialNumber: 'Серийный номер',
    requestNumber: '№ заявки',
    technician: 'Сотрудник',
    ports: 'Порты',
    status: 'Статус',
    comment: 'Комментарий',
    vendor: 'Вендор',
    purchaseDate: 'Дата установки/проверки'
  };

  // Форматирование статуса для отображения
  const formatStatus = (status) => {
    const map = {
      active: 'Активен',
      maintenance: 'На складе',
      offline: 'Неизвестно',
      archived: 'В архиве',
      deleted: 'Удалён'
    };
    return map[status] || status;
  };

  // Форматирование даты
  const formatDate = (isoString) => {
    if (!isoString) return '—';
    return new Date(isoString).toLocaleString('ru-RU', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  // Загрузка истории при монтировании
  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        setError(null); // Сбрасываем ошибку перед новым запросом
        
        const response = await api.getSwitchHistory(switchId);
        
        // ✅ ОТЛАДКА: смотрим в консоль, что пришло
        console.log('📜 API ответ истории:', response);

        // Извлекаем массив истории из ответа
        // Структура зависит от того, как возвращает контроллер:
        // Вариант 1: { success: true, data: [...] }
        // Вариант 2: { history: [...] }
        // Вариант 3: [...]
        
        let historyData = [];
        if (response.data && Array.isArray(response.data)) {
          historyData = response.data;
        } else if (response.history && Array.isArray(response.history)) {
          historyData = response.history;
        } else if (Array.isArray(response)) {
          historyData = response;
        }

        console.log('✅ Распарсенная история:', historyData);
        setHistory(historyData);

      } catch (err) {
        console.error('❌ Ошибка загрузки истории:', err);
        setError('Не удалось загрузить историю изменений');
      } finally {
        setLoading(false);
      }
    };
    
    if (switchId) {
      loadHistory();
    }
  }, [switchId]);

  // Рендер значения с форматированием
  const renderValue = (field, value) => {
    if (value === null || value === undefined) return <span className="text-gray-400">—</span>;
    if (field === 'status') return formatStatus(value);
    if (field === 'purchaseDate' && value) {
      // Если дата пришла в странном формате, пробуем распарсить
      try {
        return new Date(value).toLocaleDateString('ru-RU');
      } catch {
        return String(value);
      }
    }
    return String(value);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        
        {/* Заголовок */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              📜 История изменений
            </h2>
            <p className="text-sm text-gray-500">
              {switchName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Контент */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="ml-3 text-gray-600">Загрузка истории...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                Обновить страницу
              </button>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>История изменений пуста</p>
              <p className="text-sm mt-1">Изменения появятся здесь после первого редактирования</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((entry, index) => (
                <div 
                  key={entry.id || index}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors bg-gray-50"
                >
                  {/* Запись: дата, действие, пользователь */}
                  <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {formatDate(entry.timestamp)}
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      entry.action === 'create' ? 'bg-green-100 text-green-700' :
                      entry.action === 'update' ? 'bg-blue-100 text-blue-700' :
                      entry.action === 'delete' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {entry.action === 'create' && '➕ Создан'}
                      {entry.action === 'update' && '✏️ Изменён'}
                      {entry.action === 'delete' && '🗑️ Удалён'}
                    </span>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600 ml-auto">
                      <User className="w-4 h-4" />
                      {entry.user || 'Система'}
                    </div>
                  </div>

                  {/* Изменения полей */}
                  <div className="space-y-2">
                    {Object.entries(entry.changes).map(([field, change]) => (
                      <div key={field} className="flex items-start gap-2 text-sm">
                        <span className="font-medium text-gray-700 min-w-[140px] shrink-0">
                          {fieldLabels[field] || field}:
                        </span>
                        <div className="flex items-center gap-2 flex-1 flex-wrap">
                          <span className="text-red-600 line-through bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                            {renderValue(field, change.old)}
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                            {renderValue(field, change.new)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Футер */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Всего записей: {history.length}</span>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwitchHistory;