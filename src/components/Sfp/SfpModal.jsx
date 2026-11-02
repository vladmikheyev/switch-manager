// src/components/Sfp/SfpModal.jsx
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const SfpModal = ({ initialData, onSubmit, onClose }) => {
  // ✅ Начальное состояние с mediaType
  const [formData, setFormData] = useState({
    vendor: '',
    model: '',
    specs: '',
    distance: '',
    serialNumber: '',
    mediaType: '', // ✅ Новое поле
    status: 'ЗИП',
    color: '',
    location: '',
    quantity: 1,
    technician: 'Ковалев Д.С.',
    comment: '',
    _fileToUpload: null
  });

  // Заполняем форму при редактировании/копировании
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        _fileToUpload: null // Сбрасываем файл при открытии модалки
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === '_fileToUpload' && files?.length > 0) {
      setFormData(prev => ({ ...prev, _fileToUpload: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditing = !!initialData?.id;
  const isCopying = !!initialData && !initialData?.id;
  const modalTitle = isEditing ? 'Редактировать SFP модуль' 
                : isCopying ? '📋 Копирование SFP модуля' 
                : 'Добавить SFP модуль';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Заголовок */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{modalTitle}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Вендор *</label>
              <input name="vendor" value={formData.vendor} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Например: FANG HANG" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Модель *</label>
              <input name="model" value={formData.model} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Например: FH-SB5312CDS3" />
            </div>

            {/* ✅ НОВОЕ ПОЛЕ: Тип среды */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Тип среды *</label>
              <select name="mediaType" value={formData.mediaType || ''} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">Выберите тип</option>
                <option value="SMF">SMF (Single-Mode Fiber)</option>
                <option value="MMF">MMF (Multi-Mode Fiber)</option>
                <option value="Copper">Copper (RJ-45)</option>
                <option value="Twinax CU">Twinax Cable Passive (CU)</option>
                <option value="Twinax ACU">Twinax Cable Active (ACU)</option>
                <option value="AOC">Active Optical Cable (AOC)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Статус *</label>
              <select name="status" value={formData.status || 'ЗИП'} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="ЗИП">📦 ЗИП</option>
                <option value="В работе">⚙️ В работе</option>
                <option value="Заказано">🚚 Заказано</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Характеристики</label>
              <input name="specs" value={formData.specs} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="1.25G SFP SC 1550/1310nm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Дальность</label>
              <input name="distance" value={formData.distance} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="3km" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Серийный номер</label>
              <input name="serialNumber" value={formData.serialNumber} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="SN:FLU..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Цвет</label>
              <input name="color" value={formData.color} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="желтая, синяя..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Где находится *</label>
              <input name="location" value={formData.location} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="ЗИП в тумбочке" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Количество (шт.)</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="1" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Сотрудник</label>
              <input name="technician" value={formData.technician} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Комментарий</label>
            <textarea name="comment" value={formData.comment} onChange={handleChange} rows="3" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Дополнительная информация..." />
          </div>

          {/* Загрузка PDF */}
          <div className="border-t border-gray-200 pt-4 mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">📄 Техническая спецификация (PDF)</label>
            <div className="flex items-center gap-3">
              <input 
                type="file" 
                accept=".pdf" 
                name="_fileToUpload" 
                onChange={handleChange} 
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {initialData?.documents?.length > 0 && (
                <span className="text-xs text-green-600">✅ Файл уже прикреплён</span>
              )}
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Отмена</button>
            <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
              {isEditing ? 'Сохранить изменения' : 'Добавить модуль'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SfpModal;