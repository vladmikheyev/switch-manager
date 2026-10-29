// src/components/Sfp/SfpTable.jsx
import { Edit, Trash2, Clock } from 'lucide-react';

export const SfpTable = ({ items, onEdit, onDelete, onViewHistory }) => {
  if (!items?.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg mb-2">📭 SFP модули не найдены</p>
        <p className="text-sm">Добавьте первый модуль</p>
      </div>
    );
  }

  // ✅ Умная функция для определения класса цвета Tailwind
  const getColorClass = (colorStr) => {
    if (!colorStr) return 'bg-gray-300';
    const c = colorStr.toLowerCase();
    
    if (c.includes('желт') || c.includes('yellow')) return 'bg-yellow-400';
    if (c.includes('голуб') || c.includes('cyan') || c.includes('aqua') || c.includes('бирюз')) return 'bg-cyan-400'; // OM3/OM4
    if (c.includes('син') || c.includes('blue')) return 'bg-blue-500';
    if (c.includes('черн') || c.includes('black')) return 'bg-gray-900';
    if (c.includes('зелен') || c.includes('green')) return 'bg-green-500';
    if (c.includes('оранж') || c.includes('orange')) return 'bg-orange-500'; // OM1/OM2
    if (c.includes('красн') || c.includes('red')) return 'bg-red-500';
    if (c.includes('бел') || c.includes('white')) return 'bg-white'; 
    
    return 'bg-gray-300'; // Цвет по умолчанию, если не распознан
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1200px] table-fixed border-collapse">
        <thead className="bg-gray-50">
          <tr className="border-b border-gray-200">
            {['Вендор', 'Модель', 'Характеристики', 'Дальность', 'Сер.номер', 'Класс', 'Цвет', 'Где находится', 'Кол-во', 'Действия'].map((header) => (
              <th 
                key={header} 
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider truncate"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 truncate">{item.vendor || '—'}</td>
              <td className="px-4 py-3 font-medium truncate">{item.model || '—'}</td>
              <td className="px-4 py-3 text-sm truncate" title={item.specs}>{item.specs || '—'}</td>
              <td className="px-4 py-3 text-center">{item.distance || '—'}</td>
              <td className="px-4 py-3 font-mono text-sm">{item.serialNumber || '—'}</td>
              <td className="px-4 py-3 text-sm">{item.laserClass || '—'}</td>
              
              {/* ✅ Обновленная колонка "Цвет" */}
              <td className="px-4 py-3">
                {item.color ? (
                  <span className="inline-flex items-center gap-1.5">
                    {/* border-gray-400 и shadow-sm гарантируют, что черный и белый кружки будут видны четко */}
                    <span className={`w-3.5 h-3.5 rounded-full border border-gray-400 shadow-sm ${getColorClass(item.color)}`} />
                    <span className="text-sm text-gray-700">{item.color}</span>
                  </span>
                ) : (
                  <span className="text-gray-400 text-sm">—</span>
                )}
              </td>

              <td className="px-4 py-3 text-sm truncate" title={item.location}>{item.location || '—'}</td>
              <td className="px-4 py-3 text-center font-semibold">{item.quantity || 0} шт.</td>
              <td className="px-4 py-3">
                <div className="flex gap-2 justify-end">
                  {onViewHistory && (
                    <button onClick={() => onViewHistory(item)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded" title="История">
                      <Clock className="w-4 h-4" />
                    </button>
                  )}
                  {onEdit && (
                    <button onClick={() => onEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded" title="Редактировать">
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  {onDelete && (
                    <button onClick={() => onDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-100 rounded" title="Удалить">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SfpTable;