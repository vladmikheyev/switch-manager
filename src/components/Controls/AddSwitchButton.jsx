// src/components/Controls/AddSwitchButton.jsx
import { Plus } from 'lucide-react';

/**
 * Компонент кнопки добавления нового коммутатора
 * @param {Object} props
 * @param {Function} props.onClick - Обработчик клика
 * @param {string} props.label - Текст кнопки (по умолчанию "Добавить")
 * @param {boolean} props.disabled - Состояние disabled (опционально)
 */
export const AddSwitchButton = ({ 
  onClick, 
  label = 'Добавить коммутатор',
  disabled = false 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
    >
      <Plus className="w-4 h-4" aria-hidden="true" />
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">Добавить</span>
    </button>
  );
};

export default AddSwitchButton;