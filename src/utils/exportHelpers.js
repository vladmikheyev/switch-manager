// src/utils/exportHelpers.js
import * as XLSX from 'xlsx';
/**
 * Экспорт данных в JSON формат
 * @param {Array} data - Массив данных для экспорта
 * @param {string} filename - Имя файла (без расширения)
 * @param {number} spaces - Количество пробелов для форматирования (по умолчанию 2)
 * @returns {void}
 */
export const exportToJSON = (data, filename = 'export', spaces = 2) => {
  try {
    const jsonString = JSON.stringify(data, null, spaces);
    const blob = new Blob([jsonString], { type: 'application/json' });
    downloadFile(blob, `${filename}-${getDateString()}.json`);
  } catch (error) {
    console.error('Ошибка экспорта в JSON:', error);
    throw new Error('Не удалось экспортировать данные в JSON');
  }
};

/**
 * Экспорт данных в формат, совместимый с Excel (HTML-таблица с .xls расширением)
 * @param {Array} data - Массив объектов для экспорта
 * @param {string} filename - Имя файла (без расширения)
 * @param {Array} columns - Массив колонок для экспорта (опционально)
 * @returns {void}
 */
export const exportToCSV = (data, filename = 'export', columns = null) => {
  try {
    if (!data || data.length === 0) {
      throw new Error('Нет данных для экспорта');
    }

    // Определение колонок
    const headers = columns || Object.keys(data[0]);
    
    // CSV заголовки (с переводом на русский)
    const headerMap = {
      id: 'ID',
      name: 'Название',
      model: 'Модель',
      location: 'Место установки',
      serialNumber: 'Серийный номер',
      requestNumber: '№ заявки',
      technician: 'Сотрудник',
      ports: 'Порты',
      status: 'Статус',
      vendor: 'Вендор',
      purchaseDate: 'Дата покупки',
      comment: 'Комментарий',
      documents: 'Документы',
      createdAt: 'Создан',
      updatedAt: 'Обновлён'
    };

    // Формируем данные для таблицы
    const rows = data.map(row => {
      return headers.map(header => {
        let value = row[header];
        
        if (value === null || value === undefined) {
          value = '';
        } else if (header === 'status') {
          value = getStatusLabel(value);
        } else if (header === 'documents') {
          value = Array.isArray(value) ? value.length : 0;
        } else if (header === 'createdAt' || header === 'updatedAt') {
          value = value ? new Date(value).toLocaleDateString('ru-RU') : '';
        }
        
        // Экранирование для HTML
        return String(value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      });
    });

    // ✅ HTML-шаблон для Excel с явным указанием кодировки
    const htmlTable = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" 
            xmlns:x="urn:schemas-microsoft-com:office:excel" 
            xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <!--[if gte mso 9]><xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>Коммутаторы</x:Name>
                  <x:WorksheetOptions>
                    <x:DisplayGridlines/>
                    <x:ProtectContents>false</x:ProtectContents>
                  </x:WorksheetOptions>
                </x:ExcelWorksheet>
              </x:ExcelWorksheets>
            </x:ExcelWorkbook>
          </xml><![endif]-->
          <style>
            table { border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 4px 8px; text-align: left; }
            th { background: #f0f0f0; font-weight: bold; }
          </style>
        </head>
        <body>
          <table>
            <thead>
              <tr>${headers.map(h => `<th>${headerMap[h] || h}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    // ✅ BOM + кодирование через TextEncoder
    const BOM = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const encoder = new TextEncoder();
    const bytes = encoder.encode(htmlTable);
    
    // ✅ MIME-тип для Excel + расширение .xls
    const blob = new Blob([BOM, bytes], { 
      type: 'application/vnd.ms-excel;charset=utf-8' 
    });
    
    // ✅ Скачиваем как .xls (Excel откроет это корректно)
    downloadFile(blob, `${filename}-${getDateString()}.xls`);
    
  } catch (error) {
    console.error('Ошибка экспорта в Excel:', error);
    throw new Error('Не удалось экспортировать данные');
  }
};

/**
 * Экспорт данных в XLSX формат (требует библиотеку xlsx)
 * @param {Array} data - Массив объектов для экспорта
 * @param {string} filename - Имя файла (без расширения)
 * @param {string} sheetName - Название листа
 * @returns {void}
 */
export const exportToXLSX = (data, filename = 'export', sheetName = 'Данные') => {
  try {
    // ✅ Используем импортированный XLSX напрямую (не window.XLSX)
    if (!XLSX || !XLSX.utils) {
      console.error('Библиотека XLSX не загружена. Установите: npm install xlsx');
      throw new Error('Библиотека xlsx не найдена');
    }

    // Подготовка данных для Excel
    const formattedData = data.map(item => ({
      'ID': item.id,
      'Название': item.name,
      'Модель': item.model,
      'Место установки': item.location,
      'Серийный номер': item.serialNumber,
      '№ заявки': item.requestNumber,
      'Сотрудник': item.technician,
      'Порты': item.ports,
      'Статус': getStatusLabel(item.status),
      'Вендор': item.vendor,
      'Дата покупки': item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString('ru-RU') : '',
      'Комментарий': item.comment || '',
      'Документов': item.documents?.length || 0,
      'Создан': item.createdAt ? new Date(item.createdAt).toLocaleDateString('ru-RU') : '',
      'Обновлён': item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('ru-RU') : ''
    }));

    // Создание workbook
    const wb = XLSX.utils.book_new();  // ✅ Без window.
    const ws = XLSX.utils.json_to_sheet(formattedData);  // ✅ Без window.

    // Настройка ширины колонок
    ws['!cols'] = [
      { wch: 10 },  // ID
      { wch: 25 },  // Название
      { wch: 20 },  // Модель
      { wch: 40 },  // Место установки (длинное поле)
      { wch: 20 },  // Серийный номер
      { wch: 25 },  // № заявки (может содержать несколько)
      { wch: 20 },  // Сотрудник
      { wch: 8 },   // Порты
      { wch: 12 },  // Статус
      { wch: 15 },  // Вендор
      { wch: 15 },  // Дата покупки
      { wch: 40 },  // Комментарий (длинное поле)
      { wch: 15 },  // Создан
      { wch: 15 }   // Обновлён
    ];

    XLSX.utils.book_append_sheet(wb, ws, sheetName);  // ✅ Без window.
    
    // ✅ Скачивание с правильным расширением .xlsx
    XLSX.writeFile(wb, `${filename}-${getDateString()}.xlsx`);
    
  } catch (error) {
    console.error('❌ Ошибка экспорта в XLSX:', error);
    // ❌ Не делаем fallback на CSV — лучше показать ошибку пользователю
    alert(`Не удалось создать Excel-файл: ${error.message}\n\nПроверьте, что библиотека xlsx установлена: npm install xlsx`);
    throw error;
  }
};

/**
 * Импорт данных из JSON файла
 * @param {File} file - JSON файл для импорта
 * @returns {Promise<Array>} Распарсенные данные
 */
export const importFromJSON = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        if (!Array.isArray(data)) {
          throw new Error('Данные должны быть массивом');
        }
        
        // Валидация структуры данных
        const validated = data.map(item => ({
          ...item,
          id: item.id || Date.now() + Math.random(),
          status: item.status || 'active',
          ports: parseInt(item.ports) || 0,
          documents: item.documents || [],
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));
        
        resolve(validated);
      } catch (error) {
        reject(new Error('Неверный формат JSON файла'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Ошибка чтения файла'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Импорт данных из CSV файла
 * @param {File} file - CSV файл для импорта
 * @returns {Promise<Array>} Распарсенные данные
 */
export const importFromCSV = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          throw new Error('CSV файл пуст или не содержит данных');
        }

        // Парсинг заголовков
        const headers = parseCSVLine(lines[0]).map(h => h.replace(/"/g, '').trim());
        
        // Обратная мапа заголовков
        const headerReverseMap = {
          'ID': 'id',
          'Название': 'name',
          'Модель': 'model',
          'Место установки': 'location',
          'Серийный номер': 'serialNumber',
          '№ заявки': 'requestNumber',
          'Сотрудник': 'technician',
          'Порты': 'ports',
          'Статус': 'status',
          'Вендор': 'vendor',
          'Дата покупки': 'purchaseDate',
          'Комментарий': 'comment'
        };

        // Парсинг данных
        const data = [];
        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i]);
          const item = {};
          
          headers.forEach((header, index) => {
            const key = headerReverseMap[header] || header.toLowerCase();
            let value = values[index]?.replace(/"/g, '').trim() || '';
            
            // Конвертация статусов
            if (key === 'status') {
              value = getStatusKey(value);
            }
            
            // Конвертация чисел
            if (key === 'ports' || key === 'id') {
              value = parseInt(value) || 0;
            }
            
            item[key] = value;
          });
          
          // Добавление обязательных полей
          item.id = item.id || Date.now() + Math.random();
          item.documents = [];
          item.createdAt = new Date().toISOString();
          item.updatedAt = new Date().toISOString();
          
          data.push(item);
        }
        
        resolve(data);
      } catch (error) {
        reject(new Error('Неверный формат CSV файла'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Ошибка чтения файла'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Парсинг CSV строки с учётом кавычек
 * @param {string} line - CSV строка
 * @returns {Array} Массив значений
 */
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
};

/**
 * Получение человеко-читаемого статуса
 * @param {string} status - Ключ статуса
 * @returns {string} Название статуса
 */
const getStatusLabel = (status) => {
  const statusMap = {
    active: 'Активен',
    maintenance: 'На складе',
    offline: 'Неизвестно',
    archived: 'В архиве'
  };
  return statusMap[status] || status;
};

/**
 * Получение ключа статуса по названию
 * @param {string} label - Название статуса
 * @returns {string} Ключ статуса
 */
const getStatusKey = (label) => {
  const statusReverseMap = {
    'Активен': 'active',
    'На складе': 'maintenance',
    'Неизвестно': 'offline',
    'В архиве': 'archived'
  };
  return statusReverseMap[label] || 'active';
};

/**
 * Получение текущей даты в формате YYYY-MM-DD
 * @returns {string} Дата строка
 */
const getDateString = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Скачивание файла
 * @param {Blob} blob - Blob объект файла
 * @param {string} filename - Имя файла
 * @returns {void}
 */
const downloadFile = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Экспорт отчёта со статистикой
 * @param {Array} switches - Массив коммутаторов
 * @param {string} format - Формат экспорта (json, csv, xlsx)
 * @returns {void}
 */
export const exportReport = (switches, format = 'xlsx') => {
  const reportData = {
    exportedAt: new Date().toISOString(),
    totalSwitches: switches.length,
    byStatus: {
      active: switches.filter(s => s.status === 'active').length,
      maintenance: switches.filter(s => s.status === 'maintenance').length,
      offline: switches.filter(s => s.status === 'offline').length,
      archived: switches.filter(s => s.status === 'archived').length
    },
    totalPorts: switches.reduce((sum, s) => sum + (parseInt(s.ports) || 0), 0),
    switches: switches
  };

  switch (format.toLowerCase()) {
    case 'json':
      exportToJSON(reportData, 'report');
      break;
    case 'csv':
      exportToCSV(switches, 'report');
      break;
    case 'xlsx':
      exportToXLSX(switches, 'report');
      break;
    default:
      throw new Error(`Неподдерживаемый формат: ${format}`);
  }
};

export default {
  exportToJSON,
  exportToCSV,
  exportToXLSX,
  importFromJSON,
  importFromCSV,
  exportReport
};