// src/components/Layout/Header.jsx
import { Network, Settings, LogOut, User } from 'lucide-react';  // ✅ Заменили Switch на Network

/**
 * Компонент шапки приложения
 * @param {Object} props
 * @param {string} props.title - Заголовок приложения
 * @param {string} props.subtitle - Подзаголовок (опционально)
 * @param {Function} props.onLogout - Обработчик выхода (опционально)
 */
export const Header = ({ 
  title = 'Учет коммутаторов', 
  subtitle = 'Система управления сетевым оборудованием',
  onLogout 
}) => {
  const currentDate = new Date().toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Левая часть: Логотип и заголовок */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              {/* ✅ Используем Network вместо Switch */}
              <Network className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-gray-500 hidden sm:block">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Правая часть: Доп. информация и действия */}
          <div className="flex items-center gap-4">
            
            {/* Дата */}
            <span className="text-sm text-gray-500 hidden md:block">
              {currentDate}
            </span>
            
            <div className="h-6 w-px bg-gray-200 hidden md:block" />

            {/* Кнопка настроек */}
            <button 
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Настройки"
              onClick={() => console.log('Settings clicked')}
            >
              <Settings className="w-5 h-5" aria-hidden="true" />
            </button>

            {/* Профиль / Выход */}
            {onLogout ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                  <User className="w-4 h-4 text-gray-500" aria-hidden="true" />
                  <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                    Администратор
                  </span>
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Выйти"
                >
                  <LogOut className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                <User className="w-4 h-4 text-blue-600" aria-hidden="true" />
                <span className="text-sm font-medium text-blue-700">
                  Локальный режим
                </span>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;