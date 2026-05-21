// src/components/UI/Input.jsx
import { forwardRef, useId } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

/**
 * Конфигурация размеров полей ввода
 */
const SIZES = {
  sm: 'px-2.5 py-1.5 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-2.5 text-base'
};

/**
 * Универсальный компонент поля ввода
 * @param {Object} props
 * @param {string} props.label - Лейбл поля
 * @param {string} props.name - Имя поля (для формы)
 * @param {string} props.type - Тип input (text, email, password, number, date, etc.)
 * @param {string} props.value - Значение поля
 * @param {Function} props.onChange - Обработчик изменения
 * @param {string} props.placeholder - Текст подсказки
 * @param {boolean} props.required - Обязательное поле
 * @param {boolean} props.disabled - Состояние disabled
 * @param {string} props.size - Размер поля (sm, md, lg)
 * @param {string} props.error - Текст ошибки
 * @param {string} props.success - Текст успешной валидации
 * @param {string} props.hint - Подсказка под полем
 * @param {React.ReactNode} props.leftIcon - Иконка слева
 * @param {React.ReactNode} props.rightIcon - Иконка справа
 * @param {Function} props.onRightIconClick - Обработчик клика по правой иконке
 * @param {boolean} props.clearable - Показывать кнопку очистки
 * @param {string} props.className - Дополнительные CSS классы
 * @param {Object} ref - Ref для доступа к элементу
 */
export const Input = forwardRef(({
  label,
  name,
  type = 'text',
  value = '',
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  size = 'md',
  error = '',
  success = '',
  hint = '',
  leftIcon,
  rightIcon,
  onRightIconClick,
  clearable = false,
  className = '',
  id: propId,
  ...props
}, ref) => {
  // Генерируем уникальный ID если не передан
  const generatedId = useId();
  const inputId = propId || generatedId;

  // Определяем состояние валидации
  const hasError = !!error;
  const hasSuccess = !!success;
  const hasValue = value && value.length > 0;

  // Базовые классы
  const baseClasses = 'block w-full rounded-lg border transition-all focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed';
  
  // Классы размера
  const sizeClasses = SIZES[size] || SIZES.md;
  
  // Классы состояния валидации
  const validationClasses = hasError
    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20'
    : hasSuccess
    ? 'border-green-300 bg-green-50 focus:border-green-500 focus:ring-green-500/20'
    : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500/20';

  // Классы для иконок
  const iconClasses = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

  // Объединение всех классов
  const combinedClasses = `${baseClasses} ${sizeClasses} ${validationClasses} ${className}`.trim();

  return (
    <div className="space-y-1">
      
      {/* Лейбл */}
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      {/* Контейнер input с иконками */}
      <div className="relative">
        
        {/* Левая иконка */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {leftIcon}
          </div>
        )}

        {/* Поле ввода */}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`${combinedClasses} ${leftIcon ? 'pl-10' : ''} ${rightIcon || clearable ? 'pr-10' : ''}`}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
          {...props}
        />

        {/* Правая иконка или кнопка очистки */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          
          {/* Индикатор успеха */}
          {hasSuccess && (
            <CheckCircle className={`${iconClasses} text-green-500`} aria-hidden="true" />
          )}

          {/* Индикатор ошибки */}
          {hasError && (
            <AlertCircle className={`${iconClasses} text-red-500`} aria-hidden="true" />
          )}

          {/* Кнопка очистки */}
          {clearable && hasValue && !disabled && (
            <button
              type="button"
              onClick={() => onChange?.({ target: { value: '' } })}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Очистить поле"
            >
              <X className={iconClasses} aria-hidden="true" />
            </button>
          )}

          {/* Правая иконка (если не показываем другие элементы) */}
          {rightIcon && !hasSuccess && !hasError && !(clearable && hasValue) && (
            <button
              type="button"
              onClick={onRightIconClick}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              tabIndex={-1}
            >
              {rightIcon}
            </button>
          )}
        </div>

      </div>

      {/* Текст ошибки */}
      {hasError && (
        <p 
          id={`${inputId}-error`} 
          className="text-xs text-red-500 flex items-center gap-1"
          role="alert"
        >
          <AlertCircle className="w-3 h-3" aria-hidden="true" />
          {error}
        </p>
      )}

      {/* Текст успеха */}
      {hasSuccess && (
        <p className="text-xs text-green-500 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" aria-hidden="true" />
          {success}
        </p>
      )}

      {/* Подсказка */}
      {hint && !hasError && !hasSuccess && (
        <p className="text-xs text-gray-500">{hint}</p>
      )}

    </div>
  );
});

Input.displayName = 'Input';

export default Input;