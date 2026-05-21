// src/components/Switches/DocumentList.jsx
import { File, FileText, Image, Trash2, ExternalLink } from 'lucide-react';

/**
 * Компонент списка прикреплённых документов
 * @param {Object} props
 * @param {Array} props.documents - Массив документов [{name, url, type}]
 * @param {Function} props.onDelete - Обработчик удаления документа
 * @param {Function} props.onDownload - Обработчик скачивания документа
 * @param {boolean} props.showActions - Показывать кнопки действий (по умолчанию true)
 */
export const DocumentList = ({ 
  documents = [], 
  onDelete,
  onDownload,
  showActions = true 
}) => {
  // Определение иконки по типу файла
  const getFileIcon = (filename) => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return Image;
    if (['pdf', 'doc', 'docx'].includes(ext)) return FileText;
    return File;
  };

  // Если документов нет
  if (!documents || documents.length === 0) {
    return (
      <span className="text-gray-400 text-xs">—</span>
    );
  }

  // Показываем количество документов (для компактности в таблице)
  if (documents.length > 1) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-600 font-medium">
          {documents.length} файл(ов)
        </span>
        {/* Tooltip с названиями файлов можно добавить при желании */}
      </div>
    );
  }

  // Один документ
  const doc = documents[0];
  const FileIcon = getFileIcon(doc.name);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded border border-gray-200">
        <FileIcon className="w-3.5 h-3.5 text-gray-500" aria-hidden="true" />
        <span className="text-xs text-gray-700 max-w-[100px] truncate">
          {doc.name}
        </span>
      </div>

      {/* Кнопки действий */}
      {showActions && (
        <div className="flex items-center gap-1">
          {onDownload && (
            <button
              onClick={() => onDownload(doc)}
              className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
              title="Скачать"
            >
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(doc)}
              className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
              title="Удалить"
            >
              <Trash2 className="w-3 h-3" aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentList;