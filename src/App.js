// src/App.js
import { useState, useMemo } from 'react';
import { useSwitches } from './hooks/useSwitches';

// ✅ Прямые импорты компонентов
import { Header } from './components/Layout/Header';
import { Stats } from './components/Layout/Stats/Stats';
import { SearchBar } from './components/Controls/SearchBar';
import { ExportButtons } from './components/Controls/ExportButtons';
import { AddSwitchButton } from './components/Controls/AddSwitchButton';
import { SwitchTable } from './components/Switches/SwitchTable';
import { SwitchModal } from './components/Modal/SwitchModal';
import { SwitchHistory } from './components/Modal/SwitchHistory';  // ✅ Импорт истории

import { APP_NAME, APP_VERSION } from './utils/constants';

/**
 * Главный компонент приложения Switch Manager
 * @returns {JSX.Element} Приложение
 */
function App() {
  // Хук управления данными коммутаторов
  const {
    switches,
    isLoading,
    error,
    addSwitch,
    updateSwitch,
    deleteSwitch,
    exportSwitches,
    importSwitches,
    resetError
  } = useSwitches();

  // Состояние модальных окон
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSwitch, setEditingSwitch] = useState(null);
  const [historySwitch, setHistorySwitch] = useState(null);  // ✅ Состояние для истории

  // Состояние фильтров
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Фильтрация коммутаторов (мемоизация для производительности)
  const filteredSwitches = useMemo(() => {
    return switches.filter(switchItem => {
      const term = searchTerm.toLowerCase().trim();
      
      // Поиск по всем текстовым полям
      const matchesSearch = !term || [
        switchItem.name,
        switchItem.model,
        switchItem.location,
        switchItem.serialNumber,
        switchItem.requestNumber,
        switchItem.technician,
        switchItem.vendor
      ].some(field => field?.toLowerCase().includes(term));

      // Фильтр по статусу
      const matchesStatus = !statusFilter || switchItem.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [switches, searchTerm, statusFilter]);

  // Обработчик отправки формы
  const handleSubmit = async (data) => {
    try {
      if (editingSwitch) {
        await updateSwitch(editingSwitch.id, data);
      } else {
        await addSwitch(data);
      }
      setIsModalOpen(false);
      setEditingSwitch(null);
    } catch (err) {
      console.error('Ошибка сохранения:', err);
    }
  };

  // Обработчик редактирования
  const handleEdit = (switchItem) => {
    setEditingSwitch(switchItem);
    setIsModalOpen(true);
  };

  // ✅ Обработчик просмотра истории
  const handleViewHistory = (switchItem) => {
    setHistorySwitch(switchItem);
  };

  // Обработчик удаления
  const handleDelete = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот коммутатор?')) {
      deleteSwitch(id);
    }
  };

  // Очистка всех фильтров
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
  };

  // Закрытие модальных окон
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSwitch(null);
    setHistorySwitch(null);  // ✅ Закрываем и историю
  };

  // Экран загрузки
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  // Экран ошибки
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Ошибка загрузки</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={resetError}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Шапка приложения */}
      <Header 
        title={APP_NAME}
        subtitle={`v${APP_VERSION} • Система управления сетевым оборудованием`}
      />

      {/* Основной контент */}
      <main className="max-w-[95vw] w-full mx-auto px-4 py-6 space-y-6">
        
        {/* Статистика */}
        <Stats switches={switches} />

        {/* Панель управления */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Верхняя панель с поиском и кнопками */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
              
              {/* Поиск и фильтры */}
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                onClear={handleClearFilters}
              />

              {/* Кнопки экспорта и добавления */}
              <div className="flex flex-wrap gap-2">
                <ExportButtons
                  onExport={exportSwitches}
                  onImport={importSwitches}
                />
                <AddSwitchButton
                  onClick={() => setIsModalOpen(true)}
                />
              </div>

            </div>
          </div>

          {/* Таблица коммутаторов */}
          <div className="overflow-x-auto">
            <SwitchTable
              switches={filteredSwitches}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={(s) => console.log('Просмотр:', s)}
              onViewHistory={handleViewHistory}  // ✅ Передаём обработчик истории
              onDownload={(doc) => console.log('Скачать:', doc)}
              onDeleteDocument={(doc) => console.log('Удалить документ:', doc)}
            />
          </div>

          {/* Подвал таблицы с итогами */}
          {filteredSwitches.length > 0 && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
              Показано {filteredSwitches.length} из {switches.length} коммутаторов
            </div>
          )}

        </div>

        {/* Подвал страницы */}
        <footer className="text-center text-sm text-gray-500 py-4">
          {APP_NAME} v{APP_VERSION} • © {new Date().getFullYear()}
        </footer>

      </main>

      {/* Модальное окно добавления/редактирования */}
      {isModalOpen && (
        <SwitchModal
          isOpen={isModalOpen}
          initialData={editingSwitch}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
        />
      )}

      {/* ✅ Модальное окно истории изменений */}
      {historySwitch && !isModalOpen && (
        <SwitchHistory 
          switchId={historySwitch.id}
          switchName={historySwitch.name}
          onClose={() => setHistorySwitch(null)}
        />
      )}

    </div>
  );
}

export default App;