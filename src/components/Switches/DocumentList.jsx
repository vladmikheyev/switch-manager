// src/components/Switches/DocumentList.jsx
import { File, FileText, Image as ImageIcon } from 'lucide-react';

const getFileIcon = (filename) => {
  const ext = filename?.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return ImageIcon;
  if (['pdf', 'doc', 'docx'].includes(ext)) return FileText;
  return File;
};

export const DocumentList = ({ documents = [] }) => {
  if (!documents || documents.length === 0) {
    return <span className="text-gray-400 text-xs">—</span>;
  }

  const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000';

  return (
    <div className="flex flex-wrap gap-1.5">
      {documents.map((doc, index) => {
        // ✅ Берём originalName (оригинальное имя с кириллицей)
        const fileName = doc.originalName || doc.name || 'Файл';
        const fileKey = doc.filename || doc.name;
        const FileIcon = getFileIcon(fileKey);
        
        // ✅ Ссылка на файл: имя передаём как параметр для заголовка Content-Disposition
        const fileUrl = `${API_URL}/api/switches/uploads/${fileKey}`;

        return (
          <a
            key={doc.id || index}
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-700 rounded border border-gray-200 hover:border-blue-300 transition-colors text-xs cursor-pointer no-underline max-w-[200px]"
            title={fileName}  // ✅ Нативная подсказка с полным именем
            download={fileName}  // ✅ Имя файла при скачивании
          >
            <FileIcon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            {/* ✅ Обрезаем длинное имя, но показываем полностью в title */}
            <span className="truncate">{fileName}</span>
          </a>
        );
      })}
    </div>
  );
};

export default DocumentList;