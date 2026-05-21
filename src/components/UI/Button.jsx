// src/components/UI/Button.jsx
import { forwardRef } from 'react';

/**
 * Конфигурация вариантов кнопок
 */
const VARIANTS = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md',
  secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm hover:shadow-md',
  success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 shadow-sm hover:shadow-md',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200',
  link: 'bg-transparent text-blue-600 hover:underline active:text-blue-800 p-0'
};

/**
 * Конфигурация размеров кнопок
 */
const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg'
};

/**
 * Универсальный компонент кнопки
 * @param {Object} props
 * @param {string} props.variant - Вариант кнопки (primary, secondary, danger, success, ghost, link)
 * @param {string} props.size - Размер кнопки (sm, md, lg, xl)
 * @param {boolean} props.disabled - Состояние disabled
 * @param {boolean} props.loading - Состояние загрузки
 * @param {string} props.className - Дополнительные CSS классы
 * @param {React.ReactNode} props.children - Содержимое кнопки
 * @param {React.ReactNode} props.leftIcon - Иконка слева
 * @param {React.ReactNode} props.rightIcon - Иконка справа
 * @param {boolean} props.fullWidth - Кнопка на всю ширину
 * @param {string} props.type - Тип кнопки (button, submit, reset)
 * @param {Function} props.onClick - Обработчик клика
 * @param {string} props.title - Tooltip текст
 * @param {Object} ref - Ref для доступа к элементу
 */
export const Button = forwardRef(({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  children,
  leftIcon,
  rightIcon,
  fullWidth = false,
  type = 'button',
  onClick,
  title,
  ...props
}, ref) => {
  // Базовые классы
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Классы варианта
  const variantClasses = VARIANTS[variant] || VARIANTS.primary;
  
  // Классы размера
  const sizeClasses = SIZES[size] || SIZES.md;
  
  // Классы ширины
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Классы для иконок
  const iconClasses = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

  // Объединение всех классов
  const combinedClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses} ${className}`.trim();

  return (
    <button
      ref={ref}
      type={type}
      className={combinedClasses}
      disabled={disabled || loading}
      onClick={onClick}
      title={title}
      {...props}
    >
      {/* Индикатор загрузки */}
      {loading && (
        <svg 
          className={`animate-spin ${iconClasses}`} 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {/* Иконка слева */}
      {!loading && leftIcon && (
        <span className={iconClasses}>{leftIcon}</span>
      )}

      {/* Текст кнопки */}
      {children && (
        <span>{children}</span>
      )}

      {/* Иконка справа */}
      {!loading && rightIcon && (
        <span className={iconClasses}>{rightIcon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;