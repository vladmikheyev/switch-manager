// src/components/Modal/SwitchModal.jsx
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { SwitchForm } from './SwitchForm';

/**
 * Компонент модального окна для добавления/редактирования коммутатора
 * @param {Object} props
 * @param {Object} props.initialData - Данные для редактирования (null для создания)
 * @param {Function} props.onSubmit - Обработчик отправки формы
 * @param {Function} props.onClose - Обработчик закрытия модального окна
 * @param {boolean} props.isOpen - Состояние открытия модального окна
 */
export const SwitchModal = ({ 
  initialData = null, 
  onSubmit, 
  onClose,
  isOpen = true 
}) => {
  // Блокировка прокрутки фона при открытом модальном окне
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Закрытие по клавише Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Если модальное окно закрыто, не рендерим ничего
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      
      {/* Затемнение фона */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Контент модального окна */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Заголовок */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
              {initialData ? 'Редактирование коммутатора' : 'Новый коммутатор'}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {initialData ? `ID: ${initialData.id}` : 'Заполните все обязательные поля'}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Закрыть модальное окно"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Тело с формой (прокручивается если не влезает) */}
        <div className="flex-1 overflow-y-auto p-6">
          <SwitchForm 
            initialData={initialData}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </div>

      </div>
    </div>
  );
};

export default SwitchModal;