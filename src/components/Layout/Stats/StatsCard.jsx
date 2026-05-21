// src/components/Layout/Stats/StatsCard.jsx
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Компонент карточки статистики
 * @param {Object} props
 * @param {string} props.title - Заголовок карточки
 * @param {number} props.value - Числовое значение
 * @param {string} props.icon - Иконка (Lucide React компонент)
 * @param {string} props.color - Цветовая схема (blue, green, yellow, red)
 * @param {number} props.change - Изменение в процентах (опционально)
 */
export const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue',
  change 
}) => {
  // Конфигурация цветовых схем
  const colorConfig = {
    blue: {
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      text: 'text-blue-700'
    },
    green: {
      bg: 'bg-green-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      text: 'text-green-700'
    },
    yellow: {
      bg: 'bg-yellow-50',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      text: 'text-yellow-700'
    },
    red: {
      bg: 'bg-red-50',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      text: 'text-red-700'
    },
    gray: {
      bg: 'bg-gray-50',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
      text: 'text-gray-700'
    }
  };

  const colors = colorConfig[color] || colorConfig.blue;

  // Определение тренда (если передано изменение)
  const TrendIcon = change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus;
  const trendColor = change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-400';

  return (
    <div className={`${colors.bg} rounded-xl p-5 transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between">
        
        {/* Левая часть: Заголовок и значение */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-600">
            {title}
          </p>
          <p className={`text-3xl font-bold ${colors.text}`}>
            {value}
          </p>
          
          {/* Индикатор изменения (если есть) */}
          {change !== undefined && (
            <div className="flex items-center gap-1 text-xs">
              <TrendIcon className={`w-3 h-3 ${trendColor}`} aria-hidden="true" />
              <span className={trendColor}>
                {change > 0 ? '+' : ''}{change}%
              </span>
              <span className="text-gray-400">за месяц</span>
            </div>
          )}
        </div>

        {/* Правая часть: Иконка */}
        <div className={`${colors.iconBg} p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${colors.iconColor}`} aria-hidden="true" />
        </div>

      </div>
    </div>
  );
};

export default StatsCard;