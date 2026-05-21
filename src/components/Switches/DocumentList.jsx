// src/components/Switches/DocumentList.jsx
import { File, FileText, Image as ImageIcon } from 'lucide-react';

// Определяем иконку по расширению файла
const getFileIcon = (filename) => {
  const ext = filename?.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return ImageIcon;
  if (['pdf', 'doc', 'docx'].includes(ext)) return FileText;
  return File;
};

export const DocumentList = ({ documents = [] }) => {
  // Если документов нет
  if (!documents || documents.length === 0) {
    return <span className="text-gray-400 text-xs">—</span>;
  }

  // URL вашего бэкенда (поменяйте на свой IP, если открываете не с localhost)
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  return (
    <div className="flex flex-wrap gap-1.5">
      {documents.map((doc, index) => {
        const fileName = doc.originalName || doc.name || 'Файл';
        const fileKey = doc.filename || doc.name;
        const FileIcon = getFileIcon(fileKey);
        // Формируем прямую ссылку на файл из папки uploads
        const fileUrl = `${API_URL}/api/switches/uploads/${fileKey}`;

        return (
          <a
            key={doc.id || index}
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-700 rounded border border-gray-200 hover:border-blue-300 transition-colors text-xs cursor-pointer no-underline"
            title={`Открыть: ${fileName}`}
          >
            <FileIcon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="max-w-[120px] truncate">{fileName}</span>
          </a>
        );
      })}
    </div>
  );
};

export default DocumentList;