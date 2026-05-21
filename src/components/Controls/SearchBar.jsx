// src/components/Controls/SearchBar.jsx
import { Search, Filter, X } from 'lucide-react';

/**
 * Компонент поиска и фильтрации коммутаторов
 * @param {Object} props
 * @param {string} props.value - Текущее значение поиска
 * @param {Function} props.onChange - Обработчик изменения поиска
 * @param {string} props.statusFilter - Текущий фильтр по статусу
 * @param {Function} props.onStatusChange - Обработчик изменения фильтра статуса
 * @param {Function} props.onClear - Обработчик очистки всех фильтров (опционально)
 */
export const SearchBar = ({ 
  value = '', 
  onChange, 
  statusFilter = '', 
  onStatusChange,
  onClear 
}) => {
  // Опции статусов для фильтра
  const statusOptions = [
    { value: '', label: 'Все статусы' },
    { value: 'active', label: 'Активны' },
    { value: 'maintenance', label: 'На складе' },
    { value: 'offline', label: 'Неизвестно' }
  ];

  // Есть ли активные фильтры
  const hasActiveFilters = value || statusFilter;

  return (
    <div className="flex flex-col sm:flex-row gap-3 flex-1">
      
      {/* Поле поиска */}
      <div className="relative flex-1 max-w-md">
        <Search 
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" 
          aria-hidden="true" 
        />
        <input
          type="text"
          placeholder="Поиск по названию, модели, серийному номеру..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
        />
        
        {/* Кнопка очистки поиска */}
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            title="Очистить поиск"
          >
            <X className="w-3 h-3" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Фильтр по статусу */}
      <div className="relative">
        <Filter 
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" 
          aria-hidden="true" 
        />
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full sm:w-48 pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white appearance-none cursor-pointer"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Иконка стрелки для select */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Кнопка сброса всех фильтров */}
      {hasActiveFilters && onClear && (
        <button
          onClick={onClear}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap"
        >
          Сбросить фильтры
        </button>
      )}

    </div>
  );
};

export default SearchBar;