// src/components/Layout/Stats/Stats.jsx
import { 
  Network, 
  CheckCircle, 
  Package, 
  AlertCircle, 
  HardDrive 
} from 'lucide-react';
import { StatsCard } from './StatsCard';

/**
 * Компонент отображения статистики по коммутаторам
 * @param {Object} props
 * @param {Array} props.switches - Массив всех коммутаторов
 */
export const Stats = ({ switches = [] }) => {
  // Вычисляем статистику
  const stats = {
    total: switches.length,
    active: switches.filter(s => s.status === 'active').length,
    maintenance: switches.filter(s => s.status === 'maintenance').length,
    offline: switches.filter(s => s.status === 'offline' || !s.status).length,
    totalPorts: switches.reduce((sum, s) => sum + (parseInt(s.ports) || 0), 0)
  };

  // Конфигурация карточек
  const cards = [
    {
      title: 'Всего коммутаторов',
      value: stats.total,
      icon: Network,
      color: 'blue'
    },
    {
      title: 'Активны',
      value: stats.active,
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'На складе',
      value: stats.maintenance,
      icon: Package,
      color: 'yellow'
    },
    {
      title: 'Неизвестно',
      value: stats.offline,
      icon: AlertCircle,
      color: 'red'
    },
    {
      title: 'Всего портов',
      value: stats.totalPorts,
      icon: HardDrive,
      color: 'gray'
    }
  ];

  // Если нет данных
  if (switches.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 text-center text-gray-500 border border-dashed border-gray-300">
        <Network className="w-12 h-12 mx-auto mb-3 text-gray-300" aria-hidden="true" />
        <p>Нет данных для отображения статистики</p>
        <p className="text-sm">Добавьте коммутаторы для просмотра статистики</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {cards.map((card, index) => (
        <StatsCard
          key={index}
          title={card.title}
          value={card.value}
          icon={card.icon}
          color={card.color}
        />
      ))}
    </div>
  );
};

export default Stats;