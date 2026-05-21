// src/components/Switches/StatusBadge.jsx
import { CheckCircle, Package, AlertCircle, XCircle } from 'lucide-react';

/**
 * Конфигурация статусов
 */
const STATUS_CONFIG = {
  active: {
    label: 'Активен',
    icon: CheckCircle,
    colors: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      icon: 'text-green-600'
    }
  },
  maintenance: {
    label: 'На складе',
    icon: Package,
    colors: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
      icon: 'text-yellow-600'
    }
  },
  offline: {
    label: 'Неизвестно',
    icon: AlertCircle,
    colors: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: 'text-red-600'
    }
  },
  archived: {
    label: 'В архиве',
    icon: XCircle,
    colors: {
      bg: 'bg-gray-50',
      text: 'text-gray-700',
      border: 'border-gray-200',
      icon: 'text-gray-600'
    }
  }
};

/**
 * Компонент отображения статуса коммутатора
 * @param {Object} props
 * @param {string} props.status - Статус коммутатора (active, maintenance, offline, archived)
 * @param {boolean} props.showIcon - Показывать иконку (по умолчанию true)
 * @param {string} props.size - Размер бейджа (sm, md, lg)
 */
export const StatusBadge = ({ 
  status = 'active', 
  showIcon = true,
  size = 'md'
}) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.offline;
  const { label, icon: Icon, colors } = config;

  // Размеры в зависимости от prop
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  return (
    <span 
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${colors.bg} ${colors.text} ${colors.border} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon className={`w-3 h-3 ${colors.icon}`} aria-hidden="true" />}
      {label}
    </span>
  );
};

export default StatusBadge;