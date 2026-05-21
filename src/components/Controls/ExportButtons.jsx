// src/components/Controls/ExportButtons.jsx
import { Download, Upload, FileJson, FileSpreadsheet } from 'lucide-react';
import { useRef, useState } from 'react';

/**
 * Компонент кнопок экспорта и импорта данных
 * @param {Object} props
 * @param {Function} props.onExport - Обработчик экспорта (возвращает данные)
 * @param {Function} props.onImport - Обработчик импорта (принимает данные)
 * @param {string} props.fileName - Имя файла для экспорта
 */
export const ExportButtons = ({ 
  onExport, 
  onImport, 
  fileName = 'switches-export' 
}) => {
  const fileInputRef = useRef(null);
  const [isImporting, setIsImporting] = useState(false);

  // Экспорт в JSON
  const handleExportJSON = () => {
    try {
      const data = onExport();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка экспорта JSON:', error);
      alert('Не удалось экспортировать данные');
    }
  };

  // Экспорт в Excel (CSV формат для простоты)
  const handleExportExcel = () => {
    try {
      const data = onExport();
      const switches = JSON.parse(data);
      
      // Заголовки CSV
      const headers = [
        'ID', 'Название', 'Модель', 'Место установки', 
        'Серийный номер', 'Порты', 'Статус', 'Вендор', 
        'Дата покупки', '№ заявки', 'Сотрудник'
      ];

      // Данные CSV
      const rows = switches.map(s => [
        s.id,
        `"${s.name || ''}"`,
        `"${s.model || ''}"`,
        `"${s.location || ''}"`,
        `"${s.serialNumber || ''}"`,
        s.ports || 0,
        s.status || 'active',
        `"${s.vendor || ''}"`,
        `"${s.purchaseDate || ''}"`,
        `"${s.requestNumber || ''}"`,
        `"${s.technician || ''}"`
      ]);

      // Создаём CSV контент
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка экспорта Excel:', error);
      alert('Не удалось экспортировать данные');
    }
  };

  // Клик по скрытому input для импорта
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // Обработка выбранного файла
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (Array.isArray(data)) {
          onImport(data);
          alert(`Успешно импортировано ${data.length} коммутаторов`);
        } else {
          alert('Неверный формат файла. Ожидается массив данных.');
        }
      } catch (error) {
        console.error('Ошибка импорта:', error);
        alert('Ошибка чтения файла. Убедитесь, что это valid JSON.');
      } finally {
        setIsImporting(false);
        e.target.value = ''; // Сброс input
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex gap-2">
      
      {/* Скрытый input для импорта */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />

      {/* Кнопка импорта */}
      <button
        onClick={handleImportClick}
        disabled={isImporting}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Импортировать из JSON"
      >
        {isImporting ? (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        ) : (
          <Upload className="w-4 h-4" aria-hidden="true" />
        )}
        <span className="hidden sm:inline">Импорт</span>
      </button>

      {/* Кнопка экспорта JSON */}
      <button
        onClick={handleExportJSON}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        title="Экспорт в JSON"
      >
        <FileJson className="w-4 h-4" aria-hidden="true" />
        <span className="hidden sm:inline">JSON</span>
      </button>

      {/* Кнопка экспорта Excel/CSV */}
      <button
        onClick={handleExportExcel}
        className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
        title="Экспорт в Excel (CSV)"
      >
        <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
        <span className="hidden sm:inline">Excel</span>
      </button>

    </div>
  );
};

export default ExportButtons;