// src/components/Modal/FileUpload.jsx
import { useRef, useState } from 'react';
import { Upload, File, X, Image as ImageIcon, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

/**
 * Максимальный размер файла (10 MB)
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Разрешённые типы файлов
 */
const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

/**
 * Компонент загрузки файлов для коммутатора
 * @param {Object} props
 * @param {Array} props.documents - Массив уже загруженных документов
 * @param {number} props.switchId - ID коммутатора (для редактирования)
 * @param {Function} props.onUploadSuccess - Обработчик успешной загрузки
 * @param {Function} props.onDelete - Обработчик удаления документа
 */
export const FileUpload = ({ 
  documents = [], 
  switchId,
  onUploadSuccess,
  onDelete 
}) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Определение иконки по типу файла
  const getFileIcon = (filename) => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return ImageIcon;
    if (['pdf', 'doc', 'docx'].includes(ext)) return FileText;
    return File;
  };

  // Форматирование размера файла
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Валидация файла
  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Неподдерживаемый тип файла. Разрешены: JPG, PNG, PDF, DOC, DOCX';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'Файл слишком большой. Максимальный размер: 10 MB';
    }
    return null;
  };

  // Обработчик выбора файла
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Валидация
    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      setTimeout(() => setUploadError(null), 5000);
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Если есть switchId, загружаем на сервер
      if (switchId) {
        const response = await api.uploadFile(switchId, file);
        onUploadSuccess(response.document);
      } else {
        // Для нового коммутатора сохраняем локально
        const reader = new FileReader();
        reader.onload = (event) => {
          onUploadSuccess({
            name: file.name,
            type: file.type,
            size: file.size,
            url: event.target.result,
            uploadedAt: new Date().toISOString()
          });
        };
        reader.readAsDataURL(file);
      }

      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setUploadError(error.message || 'Не удалось загрузить файл');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  // Обработчик клика по зоне загрузки
  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      
      {/* Зона загрузки */}
      <div
        onClick={handleDropZoneClick}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
          ${isUploading 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept={ALLOWED_TYPES.join(',')}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-sm text-blue-600">Загрузка файла...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-gray-100 rounded-full">
              <Upload className="w-6 h-6 text-gray-400" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Нажмите для загрузки или перетащите файл
              </p>
              <p className="text-xs text-gray-500 mt-1">
                JPG, PNG, PDF, DOC, DOCX (макс. 10 MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Сообщения об ошибках/успехе */}
      {uploadError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          {uploadError}
        </div>
      )}

      {uploadSuccess && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          <CheckCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          Файл успешно загружен
        </div>
      )}

      {/* Список загруженных файлов */}
      {documents && documents.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Прикреплённые файлы ({documents.length})
          </h4>
          
          <div className="space-y-2">
            {documents.map((doc, index) => {
              const FileIcon = getFileIcon(doc.name);
              
              return (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-white rounded border border-gray-200">
                      <FileIcon className="w-4 h-4 text-gray-500" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {doc.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(doc.size)} • {new Date(doc.uploadedAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(index)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Удалить файл"
                      aria-label={`Удалить файл ${doc.name}`}
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export default FileUpload;