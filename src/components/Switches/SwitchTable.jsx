// src/components/Switches/SwitchTable.jsx
import { SwitchRow } from './SwitchRow';

/**
 * Компонент таблицы коммутаторов
 * @param {Object} props
 * @param {Array} props.switches - Массив коммутаторов для отображения
 * @param {Function} props.onEdit - Обработчик редактирования
 * @param {Function} props.onDelete - Обработчик удаления
 * @param {Function} props.onView - Обработчик просмотра деталей
 * @param {Function} props.onDownload - Обработчик скачивания документа
 * @param {Function} props.onDeleteDocument - Обработчик удаления документа
 */
export const SwitchTable = ({ 
  switches = [], 
  onEdit, 
  onDelete, 
  onView,
  onViewHistory,
  onDownload,
  onDeleteDocument 
}) => {
  // Заголовки таблицы
  const headers = [
    'Название',
    'Модель',
    'Место установки',
    'Серийный номер',
    '№ заявки',
    'Сотрудник',
    'Порты',
    'Статус',
    'Вендор',
    'Комментарий',
    'Документы',
    'Действия'
  ];

  // Если нет данных
  if (switches.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          Нет коммутаторов
        </h3>
        <p className="text-gray-500 text-sm">
          Добавьте первый коммутатор или импортируйте данные
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1700px] table-fixed">
        
        {/* Заголовок таблицы */}
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {headers.map((header, index) => (
              <th 
                key={index}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Тело таблицы */}
        <tbody className="divide-y divide-gray-100">
          {switches.map((switchItem) => (
            <SwitchRow
              key={switchItem.id}
              switchItem={switchItem}
              onEdit={onEdit}
              onDelete={onDelete}
              /* onView={onView} */
              onViewHistory={onViewHistory} 
              onDownload={onDownload}
              onDeleteDocument={onDeleteDocument}
            />
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default SwitchTable;