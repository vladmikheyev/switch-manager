// src/components/Modal/SwitchForm.jsx
import { useState } from 'react';
import { FileUpload } from './FileUpload';

/**
 * Начальное состояние формы
 */
const INITIAL_FORM = {
  name: '',
  model: '',
  location: '',
  ports: '',
  status: 'active',
  vendor: '',
  purchaseDate: '',
  serialNumber: '',
  requestNumber: '',
  technician: '',
  comment: '',
  documents: []
};

/**
 * Опции статусов для select
 */
const STATUS_OPTIONS = [
  { value: 'active', label: 'Активен' },
  { value: 'maintenance', label: 'На складе' },
  { value: 'offline', label: 'Неизвестно' },
  { value: 'archived', label: 'В архиве' }
];

/**
 * Компонент формы для добавления/редактирования коммутатора
 * @param {Object} props
 * @param {Object} props.initialData - Данные для редактирования
 * @param {Function} props.onSubmit - Обработчик отправки формы
 * @param {Function} props.onCancel - Обработчик отмены
 */
export const SwitchForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel 
}) => {
  // Инициализация формы
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        ...INITIAL_FORM,
        ...initialData,
        ports: initialData.ports?.toString() || ''
      };
    }
    return { ...INITIAL_FORM };
  });

  // Состояние ошибок валидации
  const [errors, setErrors] = useState({});

  // Состояние отправки
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Обработчик изменения полей
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Очистка ошибки при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Обработчик загрузки файла
  const handleFileUploadSuccess = (doc) => {
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, doc]
    }));
  };

  // Обработчик удаления файла
  const handleFileDelete = (docIndex) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, index) => index !== docIndex)
    }));
  };

  // Валидация формы
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name?.trim()) newErrors.name = 'Название обязательно';
    if (!formData.model?.trim()) newErrors.model = 'Модель обязательна';
    if (!formData.location?.trim()) newErrors.location = 'Место установки обязательно';
    if (!formData.ports || isNaN(formData.ports) || formData.ports <= 0) {
      newErrors.ports = 'Укажите корректное количество портов';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработчик отправки
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      // Прокрутка к первой ошибке
      const firstError = document.querySelector('[data-error="true"]');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Подготовка данных (конвертация портов в число)
      const submitData = {
        ...formData,
        ports: parseInt(formData.ports) || 0,
        updatedAt: new Date().toISOString()
      };

      // Если это новый коммутатор, добавляем createdAt
      if (!initialData) {
        submitData.createdAt = new Date().toISOString();
        submitData.id = Date.now();
      }

      await onSubmit(submitData);
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      alert('Не удалось сохранить данные. Попробуйте ещё раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Компонент поля ввода (переиспользуемый)
  const InputField = ({ 
    label, 
    name, 
    type = 'text', 
    required = false, 
    placeholder = '',
    className = ''
  }) => (
    <div className={`space-y-1 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        data-error={!!errors[name]}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm
          ${errors[name] 
            ? 'border-red-300 bg-red-50 focus:ring-red-500' 
            : 'border-gray-300 bg-white'
          }`}
      />
      {errors[name] && (
        <p className="text-xs text-red-500" role="alert">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Секция 1: Основная информация */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b">
          Основная информация
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputField label="Название" name="name" required className="lg:col-span-2" />
          <InputField label="Модель" name="model" required />
          <InputField label="Вендор" name="vendor" placeholder="Cisco, TP-Link, etc." />
          <InputField label="Порты" name="ports" type="number" required />
          <InputField label="Серийный номер" name="serialNumber" className="lg:col-span-2" />
        </div>
      </div>

      {/* Секция 2: Размещение */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b">
          Размещение и статус
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputField label="Место установки" name="location" required className="lg:col-span-2" />
          
          <div className="space-y-1">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Статус <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              data-error={!!errors.status}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white
                ${errors.status ? 'border-red-300' : 'border-gray-300'}`}
            >
              {STATUS_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <InputField label="Дата покупки" name="purchaseDate" type="date" />
          <InputField label="№ заявки" name="requestNumber" placeholder="Заявка №..." />
          <InputField label="Сотрудник" name="technician" placeholder="Ответственный" />
        </div>
      </div>

      {/* Секция 3: Комментарий */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b">
          Дополнительная информация
        </h3>
        <div className="space-y-1">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
            Комментарий
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows={3}
            placeholder="Дополнительная информация о коммутаторе..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm resize-none"
          />
        </div>
      </div>

      {/* Секция 4: Документы */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b">
          Документы
        </h3>
        <FileUpload 
          documents={formData.documents}
          switchId={initialData?.id}
          onUploadSuccess={handleFileUploadSuccess}
          onDelete={handleFileDelete}
        />
      </div>

      {/* Кнопки действий */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Сохранение...
            </>
          ) : (
            initialData ? 'Сохранить изменения' : 'Добавить коммутатор'
          )}
        </button>
      </div>

    </form>
  );
};

export default SwitchForm;