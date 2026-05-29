// src/components/Switches/SwitchRow.jsx
import { Edit, Trash2, Eye, Clock } from "lucide-react";  // ✅ Добавили Clock
import { StatusBadge } from "./StatusBadge";
import { DocumentList } from "./DocumentList";

/**
 * Компонент строки таблицы коммутаторов
 */
export const SwitchRow = ({
  switchItem,
  onEdit,
  onDelete,
  onView,
  onViewHistory,  // ✅ Добавили проп для истории
  onDownload,
  onDeleteDocument,
}) => {
  const {
    id,
    name,
    model,
    location,
    serialNumber,
    requestNumber,
    technician,
    ports,
    status,
    vendor,
    purchaseDate,
    comment,
    documents,
  } = switchItem;

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
      {/* Название */}
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="font-medium text-gray-900">{name || "—"}</div>
        <div className="text-xs text-gray-500">{formatDate(purchaseDate)}</div>
      </td>

      {/* Модель */}
      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
        {model || "—"}
      </td>

      {/* Место установки */}
      <td className="px-4 py-3 text-gray-700 whitespace-normal break-words max-w-[200px]" title={location}>
        {location || "—"}
      </td>

      {/* Серийный номер */}
      <td className="px-4 py-3 text-gray-700 font-mono text-sm whitespace-nowrap">
        {serialNumber || "—"}
      </td>

      {/* № заявки */}
      <td className="px-4 py-3 max-w-[250px]" title={requestNumber || undefined}>
        {requestNumber ? (
          <div className="flex flex-wrap gap-1.5">
            {String(requestNumber)
              .split(",")
              .map((req) => req.trim())
              .filter((req) => req !== "")
              .map((req, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100 whitespace-nowrap"
                >
                  {req}
                </span>
              ))}
          </div>
        ) : (
          <span className="text-gray-400 text-xs">—</span>
        )}
      </td>

      {/* Сотрудник */}
      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
        {technician || "—"}
      </td>

      {/* Порты */}
      <td className="px-4 py-3 text-center whitespace-nowrap">
        <span className="inline-block px-2 py-1 bg-gray-100 rounded text-sm font-medium text-gray-700">
          {ports || 0}
        </span>
      </td>

      {/* Статус */}
      <td className="px-4 py-3 whitespace-nowrap">
        <StatusBadge status={status} size="sm" />
      </td>

      {/* Вендор */}
      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
        {vendor || "—"}
      </td>

      {/* Комментарий */}
      <td className="px-4 py-3">
        {comment ? (
          <div className="text-gray-700 text-sm max-w-[200px] truncate cursor-help" title={comment}>
            {comment}
          </div>
        ) : (
          <span className="text-gray-400 text-xs">—</span>
        )}
      </td>

      {/* Документы */}
      <td className="px-4 py-3 whitespace-nowrap">
        <DocumentList documents={documents} />
      </td>

      {/* Действия */}
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-1">
          
          {/* ✅ Кнопка: История изменений */}
          {onViewHistory && (
            <button
              onClick={() => onViewHistory(switchItem)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="История изменений"
              aria-label="Показать историю"
            >
              <Clock className="w-4 h-4" aria-hidden="true" />
            </button>
          )}

          {onView && (
            <button
              onClick={() => onView(switchItem)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="Просмотр"
              aria-label="Просмотреть"
            >
              <Eye className="w-4 h-4" aria-hidden="true" />
            </button>
          )}

          {onEdit && (
            <button
              onClick={() => onEdit(switchItem)}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
              title="Редактировать"
              aria-label="Редактировать"
            >
              <Edit className="w-4 h-4" aria-hidden="true" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
              title="Удалить"
              aria-label="Удалить"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
            </button>
          )}

        </div>
      </td>
    </tr>
  );
};

export default SwitchRow;