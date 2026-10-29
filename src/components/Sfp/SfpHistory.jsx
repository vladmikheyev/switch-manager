// src/components/Sfp/SfpHistory.jsx
import { useState, useEffect } from 'react';
import { X, Clock, User, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';

export const SfpHistory = ({ switchId, switchName, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Маппинг полей SFP на русские названия
  const fieldLabels = {
    vendor: 'Вендор', model: 'Модель', specs: 'Характеристики',
    distance: 'Дальность', serialNumber: 'Сер.номер', laserClass: 'Класс',
    color: 'Цвет', location: 'Где находится', quantity: 'Кол-во', comment: 'Комментарий'
  };

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // ✅ Вызываем метод API для SFP
        const response = await api.getSfpHistory(switchId);
        
        // Универсальный парсинг ответа
        let historyData = [];
        if (response.data && Array.isArray(response.data)) historyData = response.data;
        else if (response.history && Array.isArray(response.history)) historyData = response.history;
        else if (Array.isArray(response)) historyData = response;

        setHistory(historyData);
      } catch (err) {
        console.error('❌ Ошибка загрузки истории SFP:', err);
        setError('Не удалось загрузить историю изменений');
      } finally {
        setLoading(false);
      }
    };
    if (switchId) loadHistory();
  }, [switchId]);

  const renderValue = (field, value) => {
    if (value === null || value === undefined) return <span className="text-gray-400">—</span>;
    return String(value);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">📜 История изменений SFP</h2>
            <p className="text-sm text-gray-500">{switchName}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"/></div>
          ) : error ? (
            <p className="text-center text-red-500 py-8">{error}</p>
          ) : history.length === 0 ? (
            <p className="text-center text-gray-500 py-8">История пуста</p>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-3 hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3 text-sm mb-2 pb-2 border-b border-gray-100">
                    <span className="flex items-center gap-1 text-gray-600"><Clock className="w-3.5 h-3.5"/> {new Date(entry.timestamp).toLocaleString('ru-RU')}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      entry.action === 'update' ? 'bg-blue-100 text-blue-700' :
                      entry.action === 'create' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {entry.action === 'update' ? '✏️ Изменено' : entry.action === 'create' ? '➕ Создано' : '🗑️ Удалено'}
                    </span>
                    <span className="ml-auto flex items-center gap-1 text-gray-600"><User className="w-3.5 h-3.5"/> {entry.user}</span>
                  </div>
                  <div className="space-y-1.5">
                    {Object.entries(entry.changes).map(([f, c]) => (
                      <div key={f} className="flex items-start gap-2 text-sm">
                        <span className="font-medium text-gray-700 w-32 shrink-0">{fieldLabels[f] || f}:</span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-red-600 line-through bg-red-50 px-1.5 py-0.5 rounded">{renderValue(f, c.old)}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0"/>
                          <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{renderValue(f, c.new)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl text-right">
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Закрыть</button>
        </div>
      </div>
    </div>
  );
};

export default SfpHistory;