// src/components/Sfp/SfpView.jsx
import { useState, useEffect, useMemo } from 'react';
import { api } from '../../services/api';
import { SfpTable } from './SfpTable';
import { SfpModal } from './SfpModal';
import { SfpHistory } from './SfpHistory';
import { Plus, Search } from 'lucide-react';

export const SfpView = () => {
  // Состояния данных и загрузки
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Состояния модальных окон
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [historyItem, setHistoryItem] = useState(null);
  
  // Состояния фильтров и поиска
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Загрузка данных с сервера
  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await api.getSfpList();
      const list = res?.data?.data || res?.data || res || [];
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error('❌ Ошибка загрузки SFP:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // ✅ Комплексная фильтрация: статус + поиск
  const filteredItems = useMemo(() => {
    let result = items;

    if (statusFilter !== 'all') {
      result = result.filter(item => item.status === statusFilter);
    }

    const term = searchTerm.toLowerCase().trim();
    if (term) {
      result = result.filter(item => {
        return [
          item.vendor, item.model, item.specs, 
          item.serialNumber, item.location, item.color, item.comment
        ].some(field => field?.toLowerCase().includes(term));
      });
    }

    return result;
  }, [items, statusFilter, searchTerm]);

  // Сохранение
  const handleSave = async (data) => {
    try {
      if (editingItem) await api.updateSfp(editingItem.id, data);
      else await api.createSfp(data);
      setIsModalOpen(false);
      setEditingItem(null);
      loadData();
    } catch (e) {
      console.error(e);
      alert('Ошибка сохранения');
    }
  };

  const handleEdit = (item) => { setEditingItem(item); setIsModalOpen(true); };

  const handleDelete = async (id) => {
    if (window.confirm('Удалить этот SFP модуль?')) {
      try { await api.deleteSfp(id); loadData(); } 
      catch (e) { alert('Ошибка удаления'); }
    }
  };

  if (isLoading) return <div className="text-center py-12 text-gray-500">⏳ Загрузка...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* ✅ ЕДИНАЯ СТРОКА: Заголовок + Поиск + Фильтр + Кнопка */}
      <div className="p-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-900 shrink-0">📡 Учёт SFP модулей</h2>
        
        <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
          {/* Поиск */}
          <div className="relative w-48 lg:w-64 shrink-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по вендору, модели, S/N..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            />
          </div>

          {/* Фильтр статусов */}
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 bg-white outline-none whitespace-nowrap"
          >
            <option value="all">📋 Все</option>
            <option value="ЗИП">📦 ЗИП</option>
            <option value="В работе">⚙️ В работе</option>
            <option value="Заказано">🚚 Заказано</option>
          </select>

          {/* Кнопка добавления */}
          <button
            onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" /> Добавить
          </button>
        </div>
      </div>

      {/* Таблица */}
      <SfpTable
        items={filteredItems}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewHistory={(item) => setHistoryItem(item)}
      />

      {/* Модалки */}
      {isModalOpen && (
        <SfpModal
          initialData={editingItem}
          onSubmit={handleSave}
          onClose={() => { setIsModalOpen(false); setEditingItem(null); }}
        />
      )}

      {historyItem && (
        <SfpHistory 
          switchId={historyItem.id} 
          switchName={`${historyItem.vendor} ${historyItem.model}`} 
          onClose={() => setHistoryItem(null)} 
        />
      )}
    </div>
  );
};

export default SfpView;